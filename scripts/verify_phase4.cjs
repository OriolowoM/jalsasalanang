const http = require('http');

async function checkUrl(url, manualRedirect = false) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve({
        status: res.statusCode,
        location: res.headers.location || null,
        contentType: res.headers['content-type'] || null,
      });
    });
    req.on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function run() {
  const tests = [
    { name: 'Homepage Root', url: 'http://localhost:3000/' },
    { name: 'Articles Archive', url: 'http://localhost:3000/articles' },
    { name: 'Sample Migrated Article', url: 'http://localhost:3000/articles/fear-of-allah-righteousness-key-to-answered-prayers' },
    { name: 'New 2026 Article', url: 'http://localhost:3000/articles/justice-equality-prerequisites-global-peace-jalsa-2026' },
    { name: 'Migrated Static Page (Programme)', url: 'http://localhost:3000/programme-of-events-jalsa-salana-nigeria-2024' },
    { name: 'Static Page (Accommodation)', url: 'http://localhost:3000/accommodation' },
    { name: 'Dedicated Registration Page', url: 'http://localhost:3000/registration' },
    { name: 'SEO 301 /blog Redirect', url: 'http://localhost:3000/blog' },
    { name: 'SEO 301 /blog/:slug Redirect', url: 'http://localhost:3000/blog/fear-of-allah-righteousness-key-to-answered-prayers' },
    { name: 'SEO 301 /news Redirect', url: 'http://localhost:3000/news' },
    { name: 'Direct Slug Fallback Redirect', url: 'http://localhost:3000/fear-of-allah-righteousness-key-to-answered-prayers' },
    { name: 'Migrated Image Delivery (Port 3000)', url: 'http://localhost:3000/uploads/migrated/blog.jalsasalana.ng/Press-Jalsa-Conference-8.jpg' },
    { name: 'Migrated Media (Direct Port 5000)', url: 'http://localhost:5000/uploads/migrated/blog.jalsasalana.ng/Press-Jalsa-Conference-8.jpg' },
  ];

  console.log('--- PHASE 4 SYSTEM VERIFICATION SUITE ---');
  let successCount = 0;
  for (const t of tests) {
    const res = await checkUrl(t.url);
    const pass = res.status === 200 || res.status === 307 || res.status === 308;
    if (pass) successCount++;
    console.log(`[STATUS ${res.status}] ${t.name}: ${t.url} ${res.location ? '-> Location: ' + res.location : ''}`);
  }
  console.log(`\nResults: ${successCount} / ${tests.length} checks passed cleanly.`);
}

run();
