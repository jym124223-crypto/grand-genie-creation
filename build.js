/**
 * Script de build et de validation de production pour Vercel et l'hébergement statique
 */
const fs = require('fs');
const path = require('path');

console.log('🚀 Démarrage du build de production pour « Le Grand Génie de la Création »...');

const ROOT_DIR = __dirname;

// 1. Vérification des fichiers HTML essentiels
const requiredHtml = [
  'index.html',
  'videos.html',
  'themes.html',
  'a-propos.html',
  'infolettre.html',
  'video.html'
];

let errors = [];

requiredHtml.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(filePath)) {
    errors.push(`Fichier HTML manquant : ${file}`);
  } else {
    const content = fs.readFileSync(filePath, 'utf8');
    // Vérification du lien CSS vers /css/style.css
    if (!content.includes('href="/css/style.css"') && !content.includes('href="css/style.css"')) {
      errors.push(`Feuille de style non liée dans : ${file}`);
    }
  }
});

// 2. Vérification CSS et JS
const requiredAssets = [
  'css/style.css',
  'data/videos.js',
  'js/main.js',
  'sitemap.xml',
  'robots.txt',
  'public/images/jean-yves-portrait.jpg'
];

requiredAssets.forEach(asset => {
  const p = path.join(ROOT_DIR, asset);
  if (!fs.existsSync(p)) {
    errors.push(`Ressource manquante : ${asset}`);
  }
});

if (errors.length > 0) {
  console.error('❌ Erreurs détectées lors de la vérification du build :');
  errors.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
}

console.log('✅ Validation des 6 pages HTML : Réussie');
console.log('✅ Validation de la feuille de style CSS : Réussie');
console.log('✅ Validation des scripts JS et de la base de données de vidéos : Réussie');
console.log('✅ Validation du dossier public et du portrait de Jean-Yves : Réussie');
console.log('✅ Fichiers SEO (sitemap.xml, robots.txt) : Présents');
console.log('✨ Build de production prêt pour le déploiement statique Vercel Edge.');
process.exit(0);
