const fs = require('fs');
const path = require('path');

const targets = [
  'customer-',
  'plumbing',
  'why-choose-us',
  'emergency-',
  'Alek-Burley',
  'Jason-Leung',
  'Damian-Barczak',
  'press24',
  '360_F_'
];

function findInDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(findInDir(fullPath));
    } else {
      if (targets.some(t => entry.name.toLowerCase().includes(t.toLowerCase()))) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

const foundWeb = findInDir(path.resolve('apps/web/public/uploads'));
const foundApi = findInDir(path.resolve('apps/api/uploads'));

console.log('Found in apps/web:', foundWeb.length);
foundWeb.forEach(f => console.log('Web:', path.basename(f)));

console.log('Found in apps/api:', foundApi.length);
foundApi.forEach(f => console.log('Api:', path.basename(f)));
