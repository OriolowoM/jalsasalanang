const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const webPublicUploads = path.resolve('apps/web/public/uploads/migrated');
const apiUploads = path.resolve('apps/api/uploads/migrated');

// Ensure destination directories exist
function ensureDirs(subDir) {
  const dirWeb = path.join(webPublicUploads, subDir);
  const dirApi = path.join(apiUploads, subDir);
  fs.mkdirSync(dirWeb, { recursive: true });
  fs.mkdirSync(dirApi, { recursive: true });
  return { dirWeb, dirApi };
}

// Download a single file with redirect handling and timeouts
function downloadFile(fileUrl, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      return reject(new Error('Too many redirects'));
    }

    try {
      const parsed = new URL(fileUrl);
      const client = parsed.protocol === 'https:' ? https : http;
      
      const req = client.get(fileUrl, {
        rejectUnauthorized: false,
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }, (res) => {
        // Handle redirect
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let redirectUrl = res.headers.location;
          if (!redirectUrl.startsWith('http')) {
            redirectUrl = new URL(redirectUrl, fileUrl).href;
          }
          return resolve(downloadFile(redirectUrl, maxRedirects - 1));
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }

        const mimeType = res.headers['content-type'] || 'image/jpeg';
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve({ buffer, mimeType });
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Connection timeout'));
      });

      req.on('error', err => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

// Generate fallback placeholder SVG/image if remote image 404s
function createFallbackImage(title) {
  const svg = `<svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#011c15;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#064e3b;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#022c22;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    <circle cx="400" cy="220" r="140" fill="none" stroke="#c5a059" stroke-width="2" stroke-dasharray="6,6" opacity="0.4"/>
    <text x="50%" y="210" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="28" fill="#d4af37" font-weight="bold">
      جلسہ سالانہ نائیجیریا
    </text>
    <text x="50%" y="260" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f3e5ab" letter-spacing="4">
      JALSA SALANA NIGERIA
    </text>
    <text x="50%" y="300" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#a1a1aa">
      Official Editorial &amp; Historical Archive
    </text>
  </svg>`;
  return Buffer.from(svg, 'utf8');
}

// Async worker pool for concurrent downloads
async function runPool(items, concurrency, workerFn) {
  let index = 0;
  const results = [];

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++;
      const item = items[currentIndex];
      try {
        const res = await workerFn(item, currentIndex, items.length);
        results.push(res);
      } catch (err) {
        results.push({ item, error: err.message });
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log('======================================================');
  console.log('   JALSA SALANA NIGERIA — MEDIA ASSET MIGRATION       ');
  console.log('======================================================\n');

  // 1. Fetch all assets from database
  const assets = await prisma.wordPressAsset.findMany();
  console.log(`Phase 3.1: Found ${assets.length} isolated WordPress assets to mirror.`);

  let downloadedCount = 0;
  let fallbackCount = 0;
  let failedCount = 0;

  // 2. Download assets with concurrency 6
  console.log('\nPhase 3.2: Downloading & mirroring media assets to local storage...');
  
  await runPool(assets, 6, async (asset, idx, total) => {
    const sourceSite = asset.sourceSite || 'blog.jalsasalana.ng';
    const { dirWeb, dirApi } = ensureDirs(sourceSite);
    
    // Sanitize filename
    let cleanFileName = asset.fileName || 'asset_' + asset.id + '.jpg';
    cleanFileName = cleanFileName.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    if (!path.extname(cleanFileName)) cleanFileName += '.jpg';

    const webPath = path.join(dirWeb, cleanFileName);
    const apiPath = path.join(dirApi, cleanFileName);
    const relativeLocalPath = `/uploads/migrated/${sourceSite}/${cleanFileName}`;

    try {
      const { buffer, mimeType } = await downloadFile(asset.originalUrl);
      fs.writeFileSync(webPath, buffer);
      fs.writeFileSync(apiPath, buffer);

      await prisma.wordPressAsset.update({
        where: { id: asset.id },
        data: {
          localPath: relativeLocalPath,
          status: 'DOWNLOADED',
          mimeType,
          fileName: cleanFileName,
          updatedAt: new Date()
        }
      });

      downloadedCount++;
      if (idx % 25 === 0 || idx === total - 1) {
        console.log(`  [Progress ${idx + 1}/${total}] Downloaded: ${cleanFileName} (${(buffer.length / 1024).toFixed(1)} KB)`);
      }
    } catch (err) {
      // If failed, create fallback SVG placeholder so broken link never occurs
      const isSvg = cleanFileName.endsWith('.svg');
      const fallbackBuffer = createFallbackImage(asset.postOrPageTitle || asset.fileName);
      const fallbackName = cleanFileName.replace(/\.[^.]+$/, '') + '.svg';
      const fallbackWebPath = path.join(dirWeb, fallbackName);
      const fallbackApiPath = path.join(dirApi, fallbackName);
      const fallbackRelativePath = `/uploads/migrated/${sourceSite}/${fallbackName}`;

      fs.writeFileSync(fallbackWebPath, fallbackBuffer);
      fs.writeFileSync(fallbackApiPath, fallbackBuffer);

      await prisma.wordPressAsset.update({
        where: { id: asset.id },
        data: {
          localPath: fallbackRelativePath,
          status: 'FALLBACK_GENERATED',
          mimeType: 'image/svg+xml',
          fileName: fallbackName,
          updatedAt: new Date()
        }
      });

      fallbackCount++;
      console.log(`  [Notice ${idx + 1}/${total}] Fallback created for ${cleanFileName} (${err.message})`);
    }
  });

  console.log(`\nAsset Download Summary:`);
  console.log(`  - Successfully Downloaded: ${downloadedCount}`);
  console.log(`  - Fallback Generated: ${fallbackCount}`);
  console.log(`  - Total Mapped Locally: ${downloadedCount + fallbackCount} / ${assets.length}`);

  // 3. Database URL Replacement: Remap Articles, Pages & Migration Records
  console.log('\nPhase 3.3: Remapping Article & Page Content to Local Assets...');

  // Fetch updated asset map
  const updatedAssets = await prisma.wordPressAsset.findMany();
  const urlMap = new Map();
  for (const a of updatedAssets) {
    if (a.localPath) {
      urlMap.set(a.originalUrl.trim(), a.localPath);
      // Also map non-https and https variants
      if (a.originalUrl.startsWith('https://')) {
        urlMap.set(a.originalUrl.replace('https://', 'http://').trim(), a.localPath);
      } else if (a.originalUrl.startsWith('http://')) {
        urlMap.set(a.originalUrl.replace('http://', 'https://').trim(), a.localPath);
      }
    }
  }

  // Update Articles
  const articles = await prisma.article.findMany();
  let updatedArticlesCount = 0;
  for (const article of articles) {
    let content = article.content || '';
    let featuredImage = article.featuredImage;
    let modified = false;

    // Replace known assets in content
    for (const [orig, local] of urlMap.entries()) {
      if (content.includes(orig)) {
        content = content.split(orig).join(local);
        modified = true;
      }
      if (featuredImage === orig) {
        featuredImage = local;
        modified = true;
      }
    }

    // Generic domain replacement for any stray wp-content/uploads/
    if (content.includes('blog.jalsasalana.ng/wp-content/uploads/')) {
      content = content.replace(/https?:\/\/blog\.jalsasalana\.ng\/wp-content\/uploads\/(?:\d{4}\/\d{2}\/)?([^\s"'>]+)/gi, '/uploads/migrated/blog.jalsasalana.ng/$1');
      modified = true;
    }
    if (content.includes('jalsasalana.ng/wp-content/uploads/')) {
      content = content.replace(/https?:\/\/jalsasalana\.ng\/wp-content\/uploads\/(?:\d{4}\/\d{2}\/)?([^\s"'>]+)/gi, '/uploads/migrated/jalsasalana.ng/$1');
      modified = true;
    }

    if (featuredImage && featuredImage.includes('blog.jalsasalana.ng/wp-content/uploads/')) {
      featuredImage = featuredImage.replace(/https?:\/\/blog\.jalsasalana\.ng\/wp-content\/uploads\/(?:\d{4}\/\d{2}\/)?([^\s"'>]+)/gi, '/uploads/migrated/blog.jalsasalana.ng/$1');
      modified = true;
    }
    if (featuredImage && featuredImage.includes('jalsasalana.ng/wp-content/uploads/')) {
      featuredImage = featuredImage.replace(/https?:\/\/jalsasalana\.ng\/wp-content\/uploads\/(?:\d{4}\/\d{2}\/)?([^\s"'>]+)/gi, '/uploads/migrated/jalsasalana.ng/$1');
      modified = true;
    }

    if (modified) {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          content,
          featuredImage,
          updatedAt: new Date()
        }
      });
      updatedArticlesCount++;
    }
  }
  console.log(`  - Remapped ${updatedArticlesCount} articles with local image URLs.`);

  // Update Pages
  const pages = await prisma.page.findMany();
  let updatedPagesCount = 0;
  for (const page of pages) {
    let content = page.content || '';
    let featuredImage = page.featuredImage;
    let modified = false;

    for (const [orig, local] of urlMap.entries()) {
      if (content.includes(orig)) {
        content = content.split(orig).join(local);
        modified = true;
      }
      if (featuredImage === orig) {
        featuredImage = local;
        modified = true;
      }
    }

    if (content.includes('blog.jalsasalana.ng/wp-content/uploads/')) {
      content = content.replace(/https?:\/\/blog\.jalsasalana\.ng\/wp-content\/uploads\/(?:\d{4}\/\d{2}\/)?([^\s"'>]+)/gi, '/uploads/migrated/blog.jalsasalana.ng/$1');
      modified = true;
    }
    if (content.includes('jalsasalana.ng/wp-content/uploads/')) {
      content = content.replace(/https?:\/\/jalsasalana\.ng\/wp-content\/uploads\/(?:\d{4}\/\d{2}\/)?([^\s"'>]+)/gi, '/uploads/migrated/jalsasalana.ng/$1');
      modified = true;
    }

    if (featuredImage && featuredImage.includes('blog.jalsasalana.ng/wp-content/uploads/')) {
      featuredImage = featuredImage.replace(/https?:\/\/blog\.jalsasalana\.ng\/wp-content\/uploads\/(?:\d{4}\/\d{2}\/)?([^\s"'>]+)/gi, '/uploads/migrated/blog.jalsasalana.ng/$1');
      modified = true;
    }
    if (featuredImage && featuredImage.includes('jalsasalana.ng/wp-content/uploads/')) {
      featuredImage = featuredImage.replace(/https?:\/\/jalsasalana\.ng\/wp-content\/uploads\/(?:\d{4}\/\d{2}\/)?([^\s"'>]+)/gi, '/uploads/migrated/jalsasalana.ng/$1');
      modified = true;
    }

    if (modified) {
      await prisma.page.update({
        where: { id: page.id },
        data: {
          content,
          featuredImage,
          updatedAt: new Date()
        }
      });
      updatedPagesCount++;
    }
  }
  console.log(`  - Remapped ${updatedPagesCount} static and event pages with local image URLs.`);

  console.log('\n======================================================');
  console.log('         PHASE 3 MEDIA MIGRATION COMPLETE             ');
  console.log('======================================================');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
