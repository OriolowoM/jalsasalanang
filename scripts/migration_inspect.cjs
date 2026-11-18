const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/HP PROBOOK/.gemini/antigravity/brain/6c428fd8-1f7d-4b7d-b9c9-bcef788ae522/.user_uploaded';
const files = [
  'media_1794655312520_a9a1d858.csv',
  'media_1794655312535_450c6317.csv',
  'media_1794655312536_256046c9.csv',
  'media_1794655312538_93faecd4.csv'
];

for (const file of files) {
  const filePath = path.join(srcDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('====================================');
  console.log('File:', file, 'Size:', content.length, 'bytes');
  
  // Find sample URLs
  const urls = content.match(/https?:\/\/[^\s"',<>]+/g) || [];
  const domainCounts = {};
  for (const u of urls) {
    try {
      const host = new URL(u).hostname;
      domainCounts[host] = (domainCounts[host] || 0) + 1;
    } catch(e) {}
  }
  console.log('Domains found:', domainCounts);

  // Check headers and first 2 lines
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  console.log('Total non-empty lines:', lines.length);
  console.log('Header line:', lines[0]);
  console.log('Sample row (truncated):', lines[1] ? lines[1].substring(0, 200) : 'none');
}
