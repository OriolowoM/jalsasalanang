const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const bundleDir = path.join(rootDir, 'cpanel_bundle');
const zipFile = path.join(rootDir, 'jalsa_cpanel_deploy.zip');

console.log('--- Packaging Jalsa Salana Nigeria for cPanel Deployment ---');

// 1. Clean previous bundle
if (fs.existsSync(bundleDir)) {
  fs.rmSync(bundleDir, { recursive: true, force: true });
}
if (fs.existsSync(zipFile)) {
  fs.rmSync(zipFile, { force: true });
}
fs.mkdirSync(bundleDir, { recursive: true });

// Helper to copy files/folders
function copySync(srcRel, destRel, excludeCallback) {
  const src = path.join(rootDir, srcRel);
  const dest = path.join(bundleDir, destRel || srcRel);

  if (!fs.existsSync(src)) {
    console.warn(`[Skip] Source not found: ${srcRel}`);
    return;
  }

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      if (excludeCallback && excludeCallback(entry, path.join(srcRel, entry))) {
        continue;
      }
      copySync(path.join(srcRel, entry), path.join(destRel || srcRel, entry), excludeCallback);
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log('1. Copying production files...');

// Root files
copySync('server.js');
copySync('app.js');
copySync('package.json');
copySync('package-lock.json');
copySync('.env.example');
if (fs.existsSync(path.join(rootDir, '.htaccess'))) {
  copySync('.htaccess');
}

// Prisma & Database
copySync('prisma');
copySync('data/cpanel_database_import.sql');

// Pre-bundled Prisma Client with multi-platform Linux binaries
if (fs.existsSync(path.join(rootDir, 'node_modules/.prisma'))) {
  console.log('2b. Bundling multi-platform Prisma engine binaries (.prisma)...');
  copySync('node_modules/.prisma', 'node_modules/.prisma');
}

// packages/shared
copySync('packages/shared/package.json');
copySync('packages/shared/dist');

// apps/api
copySync('apps/api/package.json');
copySync('apps/api/dist');
if (fs.existsSync(path.join(rootDir, 'apps/api/uploads'))) {
  copySync('apps/api/uploads');
} else {
  fs.mkdirSync(path.join(bundleDir, 'apps/api/uploads'), { recursive: true });
}

// apps/web
copySync('apps/web/package.json');
copySync('apps/web/next.config.js');
copySync('apps/web/public');

// apps/web/.next (excluding cache)
console.log('2. Copying Next.js build (excluding cache)...');
copySync('apps/web/.next', 'apps/web/.next', (entry, fullRel) => {
  return entry === 'cache' || fullRel.includes('.next/cache') || fullRel.includes('.next\\cache');
});

console.log('3. Creating jalsa_cpanel_deploy.zip via tar...');
try {
  // Use Windows built-in tar.exe which natively supports creating zip files with -a
  execSync(`tar.exe -a -c -f "${zipFile}" *`, { cwd: bundleDir, stdio: 'inherit' });
  console.log('4. Successfully created jalsa_cpanel_deploy.zip!');
} catch (err) {
  console.error('Failed to create zip with tar:', err);
}

// Check size
if (fs.existsSync(zipFile)) {
  const sizeMb = (fs.statSync(zipFile).size / (1024 * 1024)).toFixed(2);
  console.log(`\n========================================================`);
  console.log(`DEPLOYMENT ZIP READY:`);
  console.log(`File: ${zipFile}`);
  console.log(`Size: ${sizeMb} MB`);
  console.log(`========================================================\n`);
}

// Clean up bundleDir
fs.rmSync(bundleDir, { recursive: true, force: true });
