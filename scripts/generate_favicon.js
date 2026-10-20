const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SOURCE_IMAGE = 'C:/Users/jym12/.gemini/antigravity-ide/brain/13153017-adef-4a59-8e9d-b3be2646daff/.user_uploaded/media_1792467128980.jpg';

// Création d'un fichier ICO multi-tailles valide contenant des tampons PNG
function createIco(pngBuffersWithSizes) {
  const numImages = pngBuffersWithSizes.length;
  const headerSize = 6;
  const entrySize = 16;
  const directorySize = headerSize + (entrySize * numImages);

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(numImages, 4);

  const entries = [];
  let currentOffset = directorySize;

  pngBuffersWithSizes.forEach(({ size, buffer }) => {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // Width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // Size
    entry.writeUInt32LE(currentOffset, 12); // Offset

    entries.push(entry);
    currentOffset += buffer.length;
  });

  return Buffer.concat([
    header,
    ...entries,
    ...pngBuffersWithSizes.map(item => item.buffer)
  ]);
}

async function run() {
  console.log('🌟 Génération des favicons pour « Le Grand Génie de la Création »...');

  if (!fs.existsSync(SOURCE_IMAGE)) {
    throw new Error(`Image source introuvable : ${SOURCE_IMAGE}`);
  }

  // Recadrage centré sur le symbole de l'arbre cosmique
  const cropBox = { left: 176, top: 176, width: 672, height: 672 };

  const croppedBase = sharp(SOURCE_IMAGE).extract(cropBox);

  // 1. Génération des PNGs aux tailles requises
  const sizes = [16, 32, 48, 64, 180, 192, 512];
  const buffers = {};

  for (const s of sizes) {
    buffers[s] = await croppedBase
      .clone()
      .resize(s, s, { kernel: sharp.kernel.lanczos3 })
      .png({ compressionLevel: 9 })
      .toBuffer();
    console.log(`✅ PNG généré : ${s}x${s} (${buffers[s].length} octets)`);
  }

  // 2. Fichiers cibles à la racine
  fs.writeFileSync(path.join(ROOT_DIR, 'favicon-16x16.png'), buffers[16]);
  fs.writeFileSync(path.join(ROOT_DIR, 'favicon-32x32.png'), buffers[32]);
  fs.writeFileSync(path.join(ROOT_DIR, 'favicon.png'), buffers[32]);
  fs.writeFileSync(path.join(ROOT_DIR, 'apple-touch-icon.png'), buffers[180]);
  fs.writeFileSync(path.join(ROOT_DIR, 'android-chrome-192x192.png'), buffers[192]);
  fs.writeFileSync(path.join(ROOT_DIR, 'android-chrome-512x512.png'), buffers[512]);

  // 3. Fichier favicon.ico multi-résolutions (16, 32, 48)
  const icoBuffer = createIco([
    { size: 16, buffer: buffers[16] },
    { size: 32, buffer: buffers[32] },
    { size: 48, buffer: buffers[48] }
  ]);
  fs.writeFileSync(path.join(ROOT_DIR, 'favicon.ico'), icoBuffer);
  console.log(`✅ favicon.ico généré (${icoBuffer.length} octets)`);

  // 4. Copie dans le dossier assets/images pour le logo du site
  const assetsDir = path.join(ROOT_DIR, 'assets', 'images');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
  fs.writeFileSync(path.join(assetsDir, 'logo-embleme.png'), buffers[512]);
  fs.writeFileSync(path.join(assetsDir, 'logo-embleme-180.png'), buffers[180]);
  console.log(`✅ Logo emblème copié dans ${assetsDir}`);

  // 5. Copie dans le dossier public/ si présent
  const publicDir = path.join(ROOT_DIR, 'public');
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
    fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), buffers[32]);
    fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), buffers[16]);
    fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buffers[180]);
  }

  // 6. Création de site.webmanifest
  const webmanifest = {
    name: "Le Grand Génie de la Création",
    short_name: "Grand Génie",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    theme_color: "#081832",
    background_color: "#081832",
    display: "standalone"
  };
  fs.writeFileSync(path.join(ROOT_DIR, 'site.webmanifest'), JSON.stringify(webmanifest, null, 2), 'utf8');
  console.log('✅ site.webmanifest créé');

  console.log('✨ Tous les fichiers de favicon ont été créés avec succès !');
}

run().catch(err => {
  console.error('Erreur :', err);
  process.exit(1);
});
