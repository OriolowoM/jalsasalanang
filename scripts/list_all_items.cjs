const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

async function parseCsv(file) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.resolve(file))
      .pipe(csv())
      .on('data', (d) => results.push(d))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

async function inspectAll() {
  const blogPages = await parseCsv('data/csv_exports/wp_blog_pages.csv');
  console.log('\n--- BLOG PAGES (Count: ' + blogPages.length + ') ---');
  blogPages.forEach(p => console.log(`[ID ${p.ID}] ${p.Title} -> ${p.Permalink}`));

  const mainPages = await parseCsv('data/csv_exports/wp_main_pages.csv');
  console.log('\n--- MAIN PAGES (Count: ' + mainPages.length + ') ---');
  mainPages.forEach(p => console.log(`[ID ${p['﻿id'] || p.id || p.ID}] ${p.Title}`));

  const mainPosts = await parseCsv('data/csv_exports/wp_main_posts.csv');
  console.log('\n--- MAIN POSTS (Count: ' + mainPosts.length + ') ---');
  mainPosts.forEach(p => console.log(`[ID ${p['﻿id'] || p.id || p.ID}] ${p.Title}`));

  const blogPosts = await parseCsv('data/csv_exports/wp_blog_posts.csv');
  console.log('\n--- BLOG POSTS (Count: ' + blogPosts.length + ') ---');
  blogPosts.forEach((p, idx) => {
    if (idx < 20 || idx > blogPosts.length - 10) {
      console.log(`[ID ${p.ID}] (${p.Date}) ${p.Title} -> ${p.Permalink}`);
    } else if (idx === 20) {
      console.log(`... [and ${blogPosts.length - 29} more blog posts] ...`);
    }
  });
}

inspectAll().catch(console.error);
