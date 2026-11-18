const fs = require('fs');
const path = require('path');
const https = require('https');

const agent = new https.Agent({ rejectUnauthorized: false });

async function fetchUrl(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  return await res.text();
}

function extractMeta(html, url) {
  const title = (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || '';
  const description = (html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) || [])[1] || '';
  
  // Extract fonts
  const fonts = [];
  const fontLinks = html.match(/https?:\/\/fonts\.googleapis\.com\/css2?[^"'\s]+/gi) || [];
  fonts.push(...fontLinks);

  // Extract CSS stylesheets
  const cssLinks = [];
  const linkMatches = html.match(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi) || [];
  for (const m of linkMatches) {
    const href = (m.match(/href=["']([^"']+)["']/i) || [])[1];
    if (href) cssLinks.push(href);
  }

  // Extract navigation links from <nav> or header
  const navLinks = [];
  const aMatches = html.match(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi) || [];
  for (const a of aMatches) {
    const href = (a.match(/href=["']([^"']+)["']/i) || [])[1];
    const text = a.replace(/<[^>]*>/g, '').trim().replace(/\s+/g, ' ');
    if (href && text && text.length > 1 && text.length < 50 && !href.startsWith('#') && !href.startsWith('javascript:')) {
      navLinks.push({ text, href });
    }
  }

  // Deduplicate nav links
  const uniqueNav = [];
  const seenNav = new Set();
  for (const n of navLinks) {
    const key = `${n.text.toLowerCase()}::${n.href}`;
    if (!seenNav.has(key)) {
      seenNav.add(key);
      uniqueNav.push(n);
    }
  }

  // Extract color codes
  const hexColors = html.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/g) || [];
  const colorCounts = {};
  for (const c of hexColors) {
    const lower = c.toLowerCase();
    colorCounts[lower] = (colorCounts[lower] || 0) + 1;
  }
  const topColors = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([color, count]) => ({ color, count }));

  // Extract logo images
  const logos = [];
  const imgMatches = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi) || [];
  for (const img of imgMatches) {
    const src = (img.match(/src=["']([^"']+)["']/i) || [])[1];
    const alt = (img.match(/alt=["']([^"']+)["']/i) || [])[1] || '';
    if (src && (/logo/i.test(src) || /logo/i.test(alt) || /jalsa/i.test(alt))) {
      logos.push({ src, alt });
    }
  }

  return {
    url,
    title: title.trim(),
    description: description.trim(),
    fonts,
    cssLinks: cssLinks.slice(0, 10),
    topColors,
    logos,
    uniqueNav
  };
}

async function analyze() {
  console.log('Crawling live sites...');
  const mainHtml = await fetchUrl('https://jalsasalana.ng/');
  const blogHtml = await fetchUrl('https://blog.jalsasalana.ng/');

  const mainData = extractMeta(mainHtml, 'https://jalsasalana.ng/');
  const blogData = extractMeta(blogHtml, 'https://blog.jalsasalana.ng/');

  const result = { mainData, blogData };
  fs.writeFileSync('scripts/live_site_analysis.json', JSON.stringify(result, null, 2));

  console.log('=== MAIN SITE (jalsasalana.ng) ===');
  console.log('Title:', mainData.title);
  console.log('Top Colors:', mainData.topColors);
  console.log('Fonts:', mainData.fonts);
  console.log('Logos:', mainData.logos);
  console.log('Navigation count:', mainData.uniqueNav.length);
  console.log('Sample Nav:', mainData.uniqueNav.slice(0, 15));

  console.log('\n=== BLOG SITE (blog.jalsasalana.ng) ===');
  console.log('Title:', blogData.title);
  console.log('Top Colors:', blogData.topColors);
  console.log('Fonts:', blogData.fonts);
  console.log('Logos:', blogData.logos);
  console.log('Navigation count:', blogData.uniqueNav.length);
  console.log('Sample Nav:', blogData.uniqueNav.slice(0, 15));
}

analyze().catch(console.error);
