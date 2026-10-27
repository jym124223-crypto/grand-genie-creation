const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCE_DIR = 'C:/Users/jym12/Downloads/affiches_grand_genie';
const DEST_DIR = path.join(ROOT_DIR, 'public', 'affiches');

// Fonction de génération d'un PDF 1.4 pur à partir du buffer JPEG
function buildPdfFromJpegBuffer(jpegBuffer, width, height) {
  const ptWidth = 595.28; // Largeur A4 portrait standard (points)
  const ptHeight = 595.28 * (height / width); // Ratio 2:3 = 892.92 points

  const header = '%PDF-1.4\n';
  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ptWidth.toFixed(2)} ${ptHeight.toFixed(2)}] /Contents 4 0 R /Resources << /XObject << /Im1 5 0 R >> >> >>\nendobj\n`;
  const streamContent = `q\n${ptWidth.toFixed(2)} 0 0 ${ptHeight.toFixed(2)} 0 0 cm\n/Im1 Do\nQ\n`;
  const obj4 = `4 0 obj\n<< /Length ${Buffer.byteLength(streamContent)} >>\nstream\n${streamContent}endstream\nendobj\n`;
  const obj5Header = `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBuffer.length} >>\nstream\n`;
  const obj5Footer = '\nendstream\nendobj\n';

  const b1 = Buffer.from(header + obj1 + obj2 + obj3 + obj4 + obj5Header, 'binary');
  const b2 = jpegBuffer;
  const b3 = Buffer.from(obj5Footer, 'binary');

  const offset1 = header.length;
  const offset2 = offset1 + obj1.length;
  const offset3 = offset2 + obj2.length;
  const offset4 = offset3 + obj3.length;
  const offset5 = offset4 + obj4.length;
  const xrefOffset = b1.length + b2.length + b3.length;

  const pad = n => String(n).padStart(10, '0');
  const xref = `xref\n0 6\n0000000000 65535 f \n${pad(offset1)} 00000 n \n${pad(offset2)} 00000 n \n${pad(offset3)} 00000 n \n${pad(offset4)} 00000 n \n${pad(offset5)} 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  const b4 = Buffer.from(xref, 'binary');

  return Buffer.concat([b1, b2, b3, b4]);
}

const POSTERS_CONFIG = [
  {
    num: 1,
    sourceFile: '01_etat_initial_univers.png',
    id: '01-etat-initial-univers',
    videoId: 'G7XhpPR3eWI',
    title: "1 chance sur 10^10^123 : L'État Initial de l'Univers",
    theme: 'Cosmologie',
    themeKey: 'cosmologie',
    description: "Le calcul vertigineux de Sir Roger Penrose (1 chance sur 10^(10^123)) et l'extraordinaire réglage de l'entropie à l'origine de l'univers.",
    format: 'Format Portrait A3/A4 HD (300 DPI)'
  },
  {
    num: 2,
    sourceFile: '02_trois_boucliers.png',
    id: '02-trois-boucliers-terre',
    videoId: 'Nte26WFswSU',
    title: 'Les 3 Boucliers Invisibles de la Terre',
    theme: 'Cosmologie',
    themeKey: 'cosmologie',
    description: "L'héliosphère cosmique, le champ magnétique protecteur et l'atmosphère terrestre : les trois armures indispensables à la vie.",
    format: 'Format Portrait A3/A4 HD (300 DPI)'
  },
  {
    num: 3,
    sourceFile: '03_machines_moleculaires.png',
    id: '03-machines-moleculaires',
    videoId: '8JJFZ_rkqRk',
    title: '3 Machines Moléculaires dans la Cellule',
    theme: 'ADN et le vivant',
    themeKey: 'adn-vivant',
    description: "La kinésine, l'ATP synthase et le moteur flagellaire : des chefs-d'œuvre de nanotechnologie et de complexité irréductible.",
    format: 'Format Portrait A3/A4 HD (300 DPI)'
  },
  {
    num: 4,
    sourceFile: '04_oeil_humain.png',
    id: '04-oeil-humain',
    videoId: 'Vv1L9zfWo9w',
    title: "10 Faits Fascinants sur l'Œil Humain",
    theme: 'ADN et le vivant',
    themeKey: 'adn-vivant',
    description: "10 millions de couleurs, régénération ultra-rapide de la cornée et traitement neuronal : l'optique la plus prodigieuse de la Création.",
    format: 'Format Portrait A3/A4 HD (300 DPI)'
  },
  {
    num: 5,
    sourceFile: '05_neutrino.png',
    id: '05-neutrino',
    videoId: 'UoxYZlJpPJ8',
    title: 'Le Prix Nobel de Physique & les Neutrinos',
    theme: 'Physique',
    themeKey: 'physique',
    description: "Le traceur cosmique des glaces d'IceCube, le voyage de 4 milliards d'années en ligne droite et l'inférence à la meilleure explication.",
    format: 'Format Portrait A3/A4 HD (300 DPI)'
  },
  {
    num: 6,
    sourceFile: '06_kepler_newton_maxwell.png',
    id: '06-kepler-newton-maxwell',
    videoId: 'slei71ya6Pc',
    title: 'Kepler, Newton, Maxwell : 3 Géants de la Science',
    theme: 'Grands scientifiques',
    themeKey: 'grands-scientifiques',
    description: "Les lois planétaires, la gravitation universelle et l'électromagnétisme sous le regard de trois pères fondateurs de la physique.",
    format: 'Format Portrait A3/A4 HD (300 DPI)'
  },
  {
    num: 7,
    sourceFile: '07_nobel_adn_optogenetique.png',
    id: '07-nobel-adn-optogenetique',
    videoId: '2Qn-coJEddU',
    title: "Prix Nobel de Médecine : Le Code Caché de l'ADN",
    theme: 'ADN et le vivant',
    themeKey: 'adn-vivant',
    description: "De l'algue unicellulaire à l'optogénétique : le programme de 3 milliards de lettres qui pilote la matière vivante et les neurones.",
    format: 'Format Portrait A3/A4 HD (300 DPI)'
  },
  {
    num: 11,
    sourceFile: '11_adn_poubelle.png',
    id: '11-adn-poubelle',
    videoId: 'duBb1KJPsio',
    title: 'ADN Poubelle (Junk DNA) : Le Chef-d’Œuvre Caché',
    theme: 'ADN et le vivant',
    themeKey: 'adn-vivant',
    description: "98 % du génome longtemps qualifiés de déchets se révèlent être le centre de commande et d'aiguillage le plus sophistiqué du vivant.",
    format: 'Format Portrait A3/A4 HD (300 DPI)'
  },
  {
    num: 12,
    sourceFile: '12_avant_le_big_bang.png',
    id: '12-avant-le-big-bang',
    videoId: 'hPijA7bN2xg',
    title: "Qu'y avait-il avant le Big Bang ?",
    theme: 'Cosmologie',
    themeKey: 'cosmologie',
    description: "Le théorème BGV, l'argument cosmologique du Kalam et la question fondamentale de Leibniz : pourquoi y a-t-il quelque chose plutôt que rien ?",
    format: 'Format Portrait A3/A4 HD (300 DPI)'
  }
];

async function main() {
  console.log('🚀 Début du traitement des affiches officielles...');

  // Nettoyage des anciens fichiers d'affiches temporaires
  if (fs.existsSync(DEST_DIR)) {
    const existing = fs.readdirSync(DEST_DIR);
    for (const f of existing) {
      const fullPath = path.join(DEST_DIR, f);
      if (fs.statSync(fullPath).isFile()) {
        fs.unlinkSync(fullPath);
        console.log(`🗑️ Supprimé ancien fichier : ${f}`);
      }
    }
  } else {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  const generatedAffiches = [];

  for (const item of POSTERS_CONFIG) {
    const srcPath = path.join(SOURCE_DIR, item.sourceFile);
    if (!fs.existsSync(srcPath)) {
      console.error(`❌ Fichier source manquant : ${srcPath}`);
      continue;
    }

    console.log(`\n🖼️ Traitement Affiche #${item.num} : ${item.title}`);
    
    // 1. Copier le fichier original HD PNG (3000 x 4500)
    const destPngName = `${item.id}.png`;
    const destPngPath = path.join(DEST_DIR, destPngName);
    fs.copyFileSync(srcPath, destPngPath);
    console.log(`  ✅ PNG HD sauvegardé : ${destPngName}`);

    // 2. Générer aperçu JPEG haute qualité (2000 x 3000)
    const destJpgName = `${item.id}.jpg`;
    const destJpgPath = path.join(DEST_DIR, destJpgName);
    const jpegBuffer = await sharp(srcPath)
      .resize(2000, 3000, { fit: 'inside' })
      .jpeg({ quality: 92 })
      .toBuffer();
    fs.writeFileSync(destJpgPath, jpegBuffer);
    console.log(`  ✅ JPG aperçu généré : ${destJpgName} (${(jpegBuffer.length / 1024).toFixed(0)} Ko)`);

    // 3. Générer aperçu WebP ultra léger pour le web (1000 x 1500)
    const destWebpName = `${item.id}.webp`;
    const destWebpPath = path.join(DEST_DIR, destWebpName);
    const webpBuffer = await sharp(srcPath)
      .resize(1000, 1500, { fit: 'inside' })
      .webp({ quality: 85 })
      .toBuffer();
    fs.writeFileSync(destWebpPath, webpBuffer);
    console.log(`  ✅ WebP web généré : ${destWebpName} (${(webpBuffer.length / 1024).toFixed(0)} Ko)`);

    // 4. Générer PDF haute définition prêt à imprimer (A4/A3 300 DPI)
    const destPdfName = `${item.id}.pdf`;
    const destPdfPath = path.join(DEST_DIR, destPdfName);
    const pdfJpegBuffer = await sharp(srcPath)
      .resize(2400, 3600, { fit: 'inside' })
      .jpeg({ quality: 90 })
      .toBuffer();
    const pdfBuffer = buildPdfFromJpegBuffer(pdfJpegBuffer, 2400, 3600);
    fs.writeFileSync(destPdfPath, pdfBuffer);
    console.log(`  ✅ PDF vectorisé généré : ${destPdfName} (${(pdfBuffer.length / 1024 / 1024).toFixed(2)} Mo)`);

    generatedAffiches.push({
      id: item.id,
      videoId: item.videoId,
      title: item.title,
      theme: item.theme,
      themeKey: item.themeKey,
      description: item.description,
      previewWebp: `/public/affiches/${destWebpName}`,
      previewImage: `/public/affiches/${destJpgName}`,
      pdfFile: `/public/affiches/${destPdfName}`,
      pngFile: `/public/affiches/${destPngName}`,
      format: item.format
    });
  }

  // Écriture de data/affiches.js
  const affichesJsContent = `/**
 * Catalogue officiel des Affiches pour « Le Grand Génie de la Création »
 * Une affiche haute définition par vidéo.
 * Généré automatiquement à partir des créations originales de l'auteur.
 */

const AFFICHES = ${JSON.stringify(generatedAffiches, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AFFICHES };
}
`;

  const affichesJsPath = path.join(ROOT_DIR, 'data', 'affiches.js');
  fs.writeFileSync(affichesJsPath, affichesJsContent, 'utf8');
  console.log(`\n🎉 data/affiches.js mis à jour avec ${generatedAffiches.length} affiches officielles !`);
}

main().catch(console.error);
