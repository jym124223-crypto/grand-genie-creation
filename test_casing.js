const fs = require('fs');
const path = require('path');
const root = __dirname;

const htmlFiles = ['index.html', 'video.html', 'videos.html', 'themes.html', 'a-propos.html', 'infolettre.html'];
let mismatches = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  const regex = /(?:href|src)=["']([^"'#?]+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const ref = match[1];
    if (ref.startsWith('http') || ref.startsWith('mailto') || ref.startsWith('#') || ref.startsWith('tel')) continue;
    
    let rel = ref.startsWith('/') ? ref.slice(1) : ref;
    const fullPath = path.join(root, rel);
    
    if (!fs.existsSync(fullPath)) {
      mismatches.push({ file, ref, error: 'File does not exist' });
    } else {
      const dir = path.dirname(fullPath);
      const base = path.basename(fullPath);
      const actualFiles = fs.readdirSync(dir);
      if (!actualFiles.includes(base)) {
        mismatches.push({ file, ref, actual: actualFiles.find(f => f.toLowerCase() === base.toLowerCase()), error: 'Case mismatch on disk' });
      }
    }
  }
});

// Also check videos.js data references
const videosContent = fs.readFileSync(path.join(root, 'data', 'videos.js'), 'utf8');
const imgRegex = /assets\/images\/[a-zA-Z0-9-]+\.(?:jpg|png|webp)/g;
let imgMatch;
while ((imgMatch = imgRegex.exec(videosContent)) !== null) {
  const ref = imgMatch[0];
  const fullPath = path.join(root, ref);
  if (!fs.existsSync(fullPath)) {
    mismatches.push({ file: 'data/videos.js', ref, error: 'File does not exist' });
  } else {
    const dir = path.dirname(fullPath);
    const base = path.basename(fullPath);
    const actualFiles = fs.readdirSync(dir);
    if (!actualFiles.includes(base)) {
      mismatches.push({ file: 'data/videos.js', ref, actual: actualFiles.find(f => f.toLowerCase() === base.toLowerCase()), error: 'Case mismatch on disk' });
    }
  }
}

if (mismatches.length === 0) {
  console.log('✅ 100% SUCCESS: All file names, images, CSS, JS, and HTML links match disk casing EXACTLY.');
} else {
  console.error('❌ Mismatches found:', mismatches);
  process.exit(1);
}
