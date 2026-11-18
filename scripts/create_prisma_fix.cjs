const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'node_modules/.prisma');
const zipFile = path.join(rootDir, 'prisma_engine_fix.zip');

if (!fs.existsSync(srcDir)) {
  console.error('.prisma not found in node_modules');
  process.exit(1);
}

// Temporary bundle folder
const tempDir = path.join(rootDir, 'temp_prisma_bundle');
if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
if (fs.existsSync(zipFile)) fs.rmSync(zipFile, { force: true });

fs.mkdirSync(path.join(tempDir, '.prisma'), { recursive: true });

// Copy only .prisma/client
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    // Skip windows DLL to keep zip small and fast
    if (entry.includes('.dll')) continue;
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    if (fs.statSync(s).isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

copyDir(srcDir, path.join(tempDir, '.prisma'));

console.log('Zipping prisma_engine_fix.zip...');
execSync(`tar.exe -a -c -f "${zipFile}" .prisma`, { cwd: tempDir, stdio: 'inherit' });

const sizeMb = (fs.statSync(zipFile).size / (1024 * 1024)).toFixed(2);
console.log(`Created prisma_engine_fix.zip: ${sizeMb} MB`);

fs.rmSync(tempDir, { recursive: true, force: true });
