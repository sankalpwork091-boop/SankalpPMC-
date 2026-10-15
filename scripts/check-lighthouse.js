const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.report.html'));
if (files.length === 0) {
  console.log('No report HTML found');
  process.exit(1);
}

const html = fs.readFileSync(files[files.length - 1], 'utf8');
const match = html.match(/window\.__LIGHTHOUSE_JSON__\s*=\s*({[\s\S]*?});<\/script>/);

if (match) {
  const data = JSON.parse(match[1]);
  console.log('=== LIGHTHOUSE AUDIT SCORES ===');
  for (const [k, v] of Object.entries(data.categories)) {
    console.log(`${k.toUpperCase()}: ${Math.round(v.score * 100)} / 100`);
  }
} else {
  console.log('Could not find window.__LIGHTHOUSE_JSON__');
}
