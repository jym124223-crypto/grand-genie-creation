const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '..', 'assets', 'fonts');
if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

function downloadBinary(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadBinary(res.headers.location, dest));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(dest, buf);
        resolve(buf);
      });
    }).on('error', reject);
  });
}

async function run() {
  // Direct TTF links from Google Fonts GitHub repo (canonical release)
  const cinzelUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/cinzel/Cinzel%5Bwght%5D.ttf';
  const montserratUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/Montserrat%5Bwght%5D.ttf';

  const cinzelDest = path.join(FONTS_DIR, 'Cinzel.ttf');
  const montserratDest = path.join(FONTS_DIR, 'Montserrat.ttf');

  console.log('Téléchargement de Cinzel...');
  try {
    await downloadBinary(cinzelUrl, cinzelDest);
    console.log('✅ Cinzel.ttf téléchargé :', fs.statSync(cinzelDest).size, 'octets');
  } catch (e) {
    console.warn('⚠️ Échec Cinzel :', e.message);
  }

  console.log('Téléchargement de Montserrat...');
  try {
    await downloadBinary(montserratUrl, montserratDest);
    console.log('✅ Montserrat.ttf téléchargé :', fs.statSync(montserratDest).size, 'octets');
  } catch (e) {
    console.warn('⚠️ Échec Montserrat :', e.message);
  }
}

run();
