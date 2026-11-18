const path = require('path');
const fs = require('fs');
const express = require('express');
const next = require('next');
require('dotenv').config();

// Allow internal loopback Node HTTPS fetches without leaf certificate errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Clean up any stale/broken engine in /tmp (which causes 'failed to map segment from shared object' due to noexec)
if (process.platform === 'linux') {
  try {
    const tmpDir = '/tmp/prisma-engines';
    if (fs.existsSync(tmpDir)) {
      const files = fs.readdirSync(tmpDir);
      for (const f of files) {
        try { fs.unlinkSync(path.join(tmpDir, f)); } catch (_) {}
      }
    }
  } catch (_) {}
}

// Auto-detect and configure Linux Prisma Query Engine binary safely in /home (NEVER /tmp)
if (process.platform === 'linux') {
  console.log('[Jalsa Unified Server] Linux platform detected. Configuring Prisma engines...');

  const enginesDir = path.resolve(__dirname, 'prisma/engines');
  const clientDir = path.resolve(__dirname, 'prisma/client');
  const venvClientDir = '/home/ahmabumi/nodevenv/jalsasalana.ng/20/lib/node_modules/.prisma/client';

  // Candidate engines in order of priority (RHEL first for CloudLinux/cPanel, then Debian, OpenSSL 1.0.x then 3.0.x/1.1.x)
  const engineNames = [
    'libquery_engine-rhel-openssl-1.0.x.so.node',
    'libquery_engine-debian-openssl-1.0.x.so.node',
    'libquery_engine-rhel-openssl-3.0.x.so.node',
    'libquery_engine-debian-openssl-3.0.x.so.node',
    'libquery_engine-debian-openssl-1.1.x.so.node',
  ];

  // 1. Sync all engine files to virtual environment if present
  if (fs.existsSync(venvClientDir)) {
    for (const name of engineNames) {
      const candidateSources = [
        path.join(enginesDir, name),
        path.join(clientDir, name),
        path.resolve(__dirname, 'prisma', name),
      ];
      const src = candidateSources.find((p) => fs.existsSync(p));
      if (src) {
        const dst = path.join(venvClientDir, name);
        try {
          if (!fs.existsSync(dst) || fs.statSync(dst).size !== fs.statSync(src).size) {
            fs.copyFileSync(src, dst);
            fs.chmodSync(dst, 0o755);
            console.log(`[Jalsa Unified Server] Synced ${name} to virtualenv`);
          }
        } catch (syncErr) {
          console.warn(`[Jalsa Unified Server] Virtualenv sync notice for ${name}:`, syncErr.message);
        }
      }
    }
  }

  // 2. Select and verify the working engine in application directory (NEVER /tmp to avoid noexec restriction)
  let verifiedEnginePath = null;
  for (const name of engineNames) {
    const locations = [
      path.join(enginesDir, name),
      path.join(clientDir, name),
      path.resolve(__dirname, 'prisma', name),
      path.join(venvClientDir, name),
    ];
    for (const loc of locations) {
      if (fs.existsSync(loc)) {
        try {
          fs.chmodSync(loc, 0o755);
          // Test if Node can map and require this binary without error
          require(loc);
          verifiedEnginePath = loc;
          console.log(`[Jalsa Unified Server] Successfully validated Prisma engine: ${loc}`);
          break;
        } catch (loadErr) {
          console.log(`[Jalsa Unified Server] Candidate ${name} not suitable: ${loadErr.message}`);
        }
      }
    }
    if (verifiedEnginePath) break;
  }

  // If require() dry-run threw, fallback to the first existing file in prisma/engines
  if (!verifiedEnginePath) {
    for (const name of engineNames) {
      const fallbackLoc = path.join(enginesDir, name);
      if (fs.existsSync(fallbackLoc)) {
        try { fs.chmodSync(fallbackLoc, 0o755); } catch (_) {}
        verifiedEnginePath = fallbackLoc;
        console.log(`[Jalsa Unified Server] Using fallback engine in application directory: ${fallbackLoc}`);
        break;
      }
    }
  }

  if (verifiedEnginePath) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = verifiedEnginePath;
    console.log(`[Jalsa Unified Server] Set PRISMA_QUERY_ENGINE_LIBRARY = ${verifiedEnginePath}`);
  }
}

// Resolve monorepo package @jalsa/shared directly without requiring global npm linking
const originalRequire = module.constructor.prototype.require;
module.constructor.prototype.require = function (id) {
  if (id === '@jalsa/shared') {
    return originalRequire.call(this, path.resolve(__dirname, 'packages/shared/dist/index.js'));
  }
  return originalRequire.apply(this, arguments);
};

// Auto-encode special characters in DATABASE_URL password (e.g. #, @)
function fixDatabaseUrl(rawUrl) {
  if (!rawUrl) return rawUrl;
  const match = rawUrl.match(/^mysql:\/\/([^:]+):(.+)@([^/@:]+)(:\d+)?\/(.+)$/);
  if (match) {
    const [_, user, pass, host, port, db] = match;
    const encodedPass = encodeURIComponent(decodeURIComponent(pass));
    return `mysql://${user}:${encodedPass}@${host}${port || ''}/${db}`;
  }
  return rawUrl;
}
if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = fixDatabaseUrl(process.env.DATABASE_URL);
}

// Ensure uncaught errors are recorded to startup_error.txt for easy troubleshooting
process.on('uncaughtException', (err) => {
  const msg = `[${new Date().toISOString()}] Uncaught Exception:\n${err.stack || err.message}\n`;
  try { fs.writeFileSync(path.resolve(__dirname, 'startup_error.txt'), msg); } catch (_) {}
  console.error(msg);
});

process.on('unhandledRejection', (reason) => {
  const msg = `[${new Date().toISOString()}] Unhandled Rejection:\n${reason?.stack || reason}\n`;
  try { fs.writeFileSync(path.resolve(__dirname, 'startup_error.txt'), msg); } catch (_) {}
  console.error(msg);
});

const dev = process.env.NODE_ENV === 'development';
const port = parseInt(process.env.PORT || '3000', 10);

// Set internal API loopback URL for Next.js SSR requests
if (!process.env.INTERNAL_API_URL) {
  if (process.env.PORT && !isNaN(Number(process.env.PORT))) {
    process.env.INTERNAL_API_URL = `http://127.0.0.1:${process.env.PORT}/api/v1`;
  } else {
    process.env.INTERNAL_API_URL = 'https://jalsasalana.ng/api/v1';
  }
}

// Background auto-seeding if database has zero articles
function autoSeedDatabaseIfEmpty() {
  setTimeout(async () => {
    try {
      const { prisma } = require('./apps/api/dist/lib/prisma');
      const articleCount = await prisma.article.count();
      console.log(`[Jalsa Unified Server] Database verified: ${articleCount} articles present.`);
      if (articleCount === 0) {
        console.log('[Jalsa Unified Server] Zero articles found. Automatically running database seed...');
        const { fork } = require('child_process');
        const seedScript = path.resolve(__dirname, 'prisma/seed/seed.js');
        if (fs.existsSync(seedScript)) {
          const child = fork(seedScript, [], {
            env: { ...process.env },
            stdio: 'inherit',
          });
          child.on('exit', (code) => {
            console.log(`[Jalsa Unified Server] Database seed completed with status ${code}`);
          });
        }
      }
    } catch (err) {
      console.warn('[Jalsa Unified Server] Auto-seed check warning (non-fatal):', err.message);
    }
  }, 2500);
}

// Initialize Next.js app located at apps/web
const nextApp = next({ dev, dir: path.resolve(__dirname, 'apps/web') });
const handle = nextApp.getRequestHandler();

async function start() {
  try {
    console.log('[Jalsa Unified Server] Preparing Next.js application...');
    await nextApp.prepare();

    const server = express();

    // Import Express API app
    console.log('[Jalsa Unified Server] Loading API routes...');
    const apiApp = require('./apps/api/dist/server').default || require('./apps/api/dist/server');

    // 1. Route API, uploads, and health check to Express without touching other routes
    server.use((req, res, next) => {
      if (
        req.path.startsWith('/api/v1') ||
        req.path.startsWith('/uploads') ||
        req.path === '/health'
      ) {
        return apiApp(req, res, next);
      }
      next();
    });

    // 2. Delegate all remaining routes to Next.js (pages, static files, Next.js API routes)
    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, () => {
      console.log(`[Jalsa Unified Server] Running on port ${port} (mode: ${dev ? 'development' : 'production'})`);
      try {
        fs.writeFileSync(path.resolve(__dirname, 'startup_status.txt'), `Running successfully on port ${port} at ${new Date().toISOString()}`);
      } catch (_) {}
      // Check database seed in background
      autoSeedDatabaseIfEmpty();
    });
  } catch (err) {
    const errorMsg = `[${new Date().toISOString()}] Startup Error:\n${err.stack || err.message}\n`;
    try { fs.writeFileSync(path.resolve(__dirname, 'startup_error.txt'), errorMsg); } catch (_) {}
    console.error(errorMsg);
    process.exit(1);
  }
}

start();
