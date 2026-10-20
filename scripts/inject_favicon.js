const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

const htmlFiles = [
  'index.html',
  'videos.html',
  'themes.html',
  'affiches.html',
  'a-propos.html',
  'infolettre.html',
  'video.html'
];

const faviconSnippet = `  <!-- Favicon & Icônes Officielles -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#081832">`;

const oldBrandSvgRegex = /<div class="brand-icon">[\s\S]*?<svg[\s\S]*?<\/svg>[\s\S]*?<\/div>/gi;
const newBrandIconHtml = `<div class="brand-icon">
          <img src="/assets/images/logo-embleme-180.png" alt="Emblème Le Grand Génie de la Création" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">
        </div>`;

htmlFiles.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`Fichier non trouvé : ${file}`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Injection du Favicon dans le <head> s'il n'est pas déjà présent
  if (!html.includes('rel="icon"')) {
    if (html.includes('<link rel="stylesheet" href="/css/style.css">')) {
      html = html.replace(
        '<link rel="stylesheet" href="/css/style.css">',
        `${faviconSnippet}\n\n  <link rel="stylesheet" href="/css/style.css">`
      );
    } else {
      html = html.replace('</head>', `${faviconSnippet}\n</head>`);
    }
    console.log(`✅ Favicon injecté dans : ${file}`);
  }

  // 2. Remplacement du SVG générique par l'image emblème dans le header et footer
  if (oldBrandSvgRegex.test(html)) {
    html = html.replace(oldBrandSvgRegex, newBrandIconHtml);
    console.log(`✅ Emblème inséré dans le header/footer de : ${file}`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
});

console.log('✨ Mise à jour des gabarits HTML terminée.');
