const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const files = [
  { name: 'wp_blog_pages', file: 'data/csv_exports/wp_blog_pages.csv' },
  { name: 'wp_main_pages', file: 'data/csv_exports/wp_main_pages.csv' },
  { name: 'wp_main_posts', file: 'data/csv_exports/wp_main_posts.csv' },
  { name: 'wp_blog_posts', file: 'data/csv_exports/wp_blog_posts.csv' }
];

async function parseCsv(item) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.resolve(item.file))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve({ name: item.name, count: results.length, sample: results[0], allKeys: Object.keys(results[0] || {}), rows: results }))
      .on('error', (err) => reject(err));
  });
}

async function run() {
  for (const item of files) {
    const res = await parseCsv(item);
    console.log('====================================');
    console.log(`File: ${res.name} (Count: ${res.count})`);
    console.log('Columns:', res.allKeys);
    if (res.sample) {
      console.log('Sample Row 1:');
      for (const [k, v] of Object.entries(res.sample)) {
        const valPreview = typeof v === 'string' ? (v.length > 80 ? v.substring(0, 80) + '...' : v) : v;
        console.log(`  ${k}: ${valPreview}`);
      }
    }
  }
}

run().catch(console.error);
