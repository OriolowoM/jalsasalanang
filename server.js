const path = require('path');
const fs = require('fs');
const express = require('express');
const next = require('next');
require('dotenv').config();

// Allow internal loopback Node HTTPS fetches without leaf certificate errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Auto-extract deploy.tar.gz if uploaded by CI/CD
const deployArchive = path.resolve(__dirname, 'deploy.tar.gz');
if (fs.existsSync(deployArchive)) {
  try {
    const size = fs.statSync(deployArchive).size;
    console.log(`[Jalsa Unified Server] deploy.tar.gz detected (${size} bytes). Auto-extracting...`);
    const { execSync } = require('child_process');
    try {
      execSync('tar -xzf deploy.tar.gz', { cwd: __dirname });
    } catch (_) {
      try {
        execSync('/bin/tar -xzf deploy.tar.gz', { cwd: __dirname });
      } catch (_) {
        execSync('/usr/bin/tar -xzf deploy.tar.gz', { cwd: __dirname });
      }
    }
    fs.unlinkSync(deployArchive);
    console.log('[Jalsa Unified Server] deploy.tar.gz successfully extracted and removed.');
  } catch (err) {
    console.error('[Jalsa Unified Server] deploy.tar.gz extraction error:', err.message);
  }
}

// Discard any /tmp/prisma-engines engine path (causes 'failed to map segment from shared object' due to cPanel noexec)
if (process.env.PRISMA_QUERY_ENGINE_LIBRARY && process.env.PRISMA_QUERY_ENGINE_LIBRARY.startsWith('/tmp')) {
  delete process.env.PRISMA_QUERY_ENGINE_LIBRARY;
}

// Clean up any stale/broken engine in /tmp
if (process.platform === 'linux') {
  try {
    const tmpDir = '/tmp/prisma-engines';
    if (fs.existsSync(tmpDir)) {
      const files = fs.readdirSync(tmpDir);
      for (const f of files) {
        try { fs.unlinkSync(path.join(tmpDir, f)); } catch (_) {}
      }
      try { fs.rmdirSync(tmpDir); } catch (_) {}
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
      path.join(venvClientDir, name),
      path.join(enginesDir, name),
      path.join(clientDir, name),
      path.resolve(__dirname, 'prisma', name),
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
          console.log(`[Jalsa Unified Server] Candidate ${name} at ${loc} not suitable: ${loadErr.message}`);
        }
      }
    }
    if (verifiedEnginePath) break;
  }

  // If require() dry-run threw, fallback to the first existing file in virtualenv or engines
  if (!verifiedEnginePath) {
    for (const name of engineNames) {
      const fallbackLocs = [
        path.join(venvClientDir, name),
        path.join(enginesDir, name),
      ];
      for (const loc of fallbackLocs) {
        if (fs.existsSync(loc)) {
          try { fs.chmodSync(loc, 0o755); } catch (_) {}
          verifiedEnginePath = loc;
          console.log(`[Jalsa Unified Server] Using fallback engine: ${loc}`);
          break;
        }
      }
      if (verifiedEnginePath) break;
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

// Set internal API URL for Next.js SSR requests
process.env.INTERNAL_API_URL = 'https://jalsasalana.ng/api/v1';

// Background auto-migration and seeding if database tables or articles are missing
function autoSeedDatabaseIfEmpty() {
  setTimeout(async () => {
    try {
      const { prisma } = require('./apps/api/dist/lib/prisma');
      let articleCount = 0;
      let needsMigration = false;
      try {
        articleCount = await prisma.article.count();
        console.log(`[Jalsa Unified Server] Database verified: ${articleCount} articles present.`);
      } catch (checkErr) {
        console.log('[Jalsa Unified Server] Database tables missing or inaccessible:', checkErr.message);
        needsMigration = true;
      }

      if (needsMigration || articleCount === 0) {
        console.log('[Jalsa Unified Server] Running automatic database migration and seeding routine...');
        try {
          const { runMigration } = require('./prisma/migrate');
          await runMigration();
          console.log('[Jalsa Unified Server] Database migration and seed completed.');
        } catch (migErr) {
          console.error('[Jalsa Unified Server] Migration routine error:', migErr.message);
        }
      }
    } catch (err) {
      console.warn('[Jalsa Unified Server] Auto-migration check warning (non-fatal):', err.message);
    }
  }, 1500);
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
        fs.writeFileSync(
          path.resolve(__dirname, 'startup_status.txt'),
          `Running successfully on port ${port} at ${new Date().toISOString()}\nPrisma Engine: ${process.env.PRISMA_QUERY_ENGINE_LIBRARY || 'none'}`
        );
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
