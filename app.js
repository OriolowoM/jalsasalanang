// Entrypoint for Phusion Passenger & LiteSpeed Web Server
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logFile = path.resolve(__dirname, 'diagnostic_log.txt');
function log(msg) {
  try {
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
  } catch (_) {}
  console.log(msg);
}

log('=== APP.JS STARTUP INVOCATION ===');
log(`Node: ${process.version}, Platform: ${process.platform}, Arch: ${process.arch}`);

// 1. Auto-extract deploy.tar.gz if uploaded
const archivePath = path.resolve(__dirname, 'deploy.tar.gz');
if (fs.existsSync(archivePath)) {
  try {
    const stat = fs.statSync(archivePath);
    log(`Found ${archivePath} (${stat.size} bytes). Extracting with tar...`);
    execSync('tar -xzf deploy.tar.gz', { cwd: __dirname, encoding: 'utf8' });
    fs.unlinkSync(archivePath);
    log('tar extraction completed successfully and archive removed.');
  } catch (err) {
    log(`tar extraction error: ${err.message}`);
  }
}

// 2. Clean up any /tmp/prisma-engines (prevent noexec segment mapping crash)
try {
  const tmpPrisma = '/tmp/prisma-engines';
  if (fs.existsSync(tmpPrisma)) {
    const files = fs.readdirSync(tmpPrisma);
    for (const f of files) {
      try { fs.unlinkSync(path.join(tmpPrisma, f)); } catch (_) {}
    }
    log(`Cleaned ${files.length} files from /tmp/prisma-engines`);
  }
} catch (tmpErr) {
  log(`/tmp cleanup notice: ${tmpErr.message}`);
}

// 3. Inspect engines in prisma/engines and test require()
const enginesDir = path.resolve(__dirname, 'prisma/engines');
log(`Checking engines in: ${enginesDir}`);
let workingEngine = null;
if (fs.existsSync(enginesDir)) {
  const engineFiles = fs.readdirSync(enginesDir);
  log(`Found engine files: ${engineFiles.join(', ')}`);
  for (const f of engineFiles) {
    if (f.endsWith('.so.node')) {
      const fullPath = path.join(enginesDir, f);
      try {
        fs.chmodSync(fullPath, 0o755);
        require(fullPath);
        log(`SUCCESS: Engine ${f} loaded and mapped perfectly!`);
        if (!workingEngine) workingEngine = fullPath;
      } catch (err) {
        log(`Engine candidate ${f} failed: ${err.message}`);
      }
    }
  }
} else {
  log('prisma/engines directory does not exist!');
}

if (workingEngine) {
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = workingEngine;
  log(`Setting process.env.PRISMA_QUERY_ENGINE_LIBRARY = ${workingEngine}`);
}

// 4. Delegate to server.js
try {
  require('./server.js');
} catch (err) {
  log(`FATAL: Error requiring ./server.js: ${err.stack || err.message}`);
}
