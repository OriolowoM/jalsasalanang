const fs = require('fs');
const csv = require('csv-parser');

async function parse(file) {
  return new Promise((resolve) => {
    const list = [];
    fs.createReadStream(file)
      .pipe(csv())
      .on('data', d => list.push(d))
      .on('end', () => resolve(list));
  });
}

async function checkOverlap() {
  const mainPosts = await parse('data/csv_exports/wp_main_posts.csv');
  const blogPosts = await parse('data/csv_exports/wp_blog_posts.csv');
  const mainPages = await parse('data/csv_exports/wp_main_pages.csv');
  const blogPages = await parse('data/csv_exports/wp_blog_pages.csv');

  console.log(`Main Posts: ${mainPosts.length}, Blog Posts: ${blogPosts.length}`);
  const blogTitles = new Set(blogPosts.map(p => p.Title.trim().toLowerCase()));
  let matchCount = 0;
  for (const mp of mainPosts) {
    if (blogTitles.has(mp.Title.trim().toLowerCase())) {
      matchCount++;
      console.log(`Matching Post: "${mp.Title}"`);
    }
  }
  console.log(`Total matching posts between main and blog: ${matchCount}`);

  console.log(`\nMain Pages: ${mainPages.length}, Blog Pages: ${blogPages.length}`);
  const blogPageTitles = new Set(blogPages.map(p => p.Title.trim().toLowerCase()));
  let pageMatch = 0;
  for (const mp of mainPages) {
    if (blogPageTitles.has(mp.Title.trim().toLowerCase())) {
      pageMatch++;
      console.log(`Matching Page: "${mp.Title}"`);
    }
  }
  console.log(`Total matching pages: ${pageMatch}`);
}

checkOverlap();
