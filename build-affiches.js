/**
 * Script de génération automatisée des Affiches pour « Le Grand Génie de la Création »
 * 
 * Respecte strictement la charte graphique :
 * - Ambiance cosmos chaud, sépia et or, mystérieux et majestueux (aucun bleu, aucune couleur vive)
 * - Fond : noir chaud #0B0806, nébuleuses brun #2A1A10, bronze #8A5A2B et ambre #D9A55B
 * - Éléments graphiques : lignes de lumière très fines, or #D9A55B à champagne #F3D9A4,
 *   spirales, orbites et ondes autour d'un point lumineux blanc doré #FFF4DC
 * - Titre : police Cinzel / Playfair, couleur champagne #F3D9A4 avec halo doré
 * - Texte : police Montserrat, couleur #F3D9A4
 * - Format portrait 3:4, export PDF haute résolution prêt à imprimer + aperçu WebP + JPG
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = __dirname;
const AFFICHES_DATA_FILE = path.join(ROOT_DIR, 'data', 'affiches.js');
const FONDS_DIR = path.join(ROOT_DIR, 'public', 'affiches', 'fonds');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'affiches');
const FONTS_DIR = path.join(ROOT_DIR, 'assets', 'fonts');

// Dimensions du gabarit d'affiche : Format Portrait 3:4 en Haute Définition (300 DPI)
const POSTER_WIDTH = 2400;
const POSTER_HEIGHT = 3200;

// Chargement des polices locales en Base64 pour un rendu typographique vectoriel exact
function getFontBase64(fontName) {
  const fontPath = path.join(FONTS_DIR, fontName);
  if (fs.existsSync(fontPath)) {
    return fs.readFileSync(fontPath).toString('base64');
  }
  return null;
}

// Découpage automatique du titre en lignes équilibrées
function wrapTitle(text, maxCharsPerLine = 32) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

// Échappement XML/SVG
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Générateur de PDF 1.4 pur à partir du tampon JPEG
function buildPdfFromJpegBuffer(jpegBuffer, width, height) {
  const ptWidth = 595.28; // A4 portrait standard width in points
  const ptHeight = 595.28 * (height / width); // 3:4 = 793.7 points

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

async function generateSinglePoster(poster) {
  console.log(`\n🎨 Génération de l'affiche : « ${poster.title} » (ID: ${poster.id})...`);

  // 1. Image de fond cosmique
  let bgImagePath = null;
  if (poster.backgroundImage) {
    if (path.isAbsolute(poster.backgroundImage) && fs.existsSync(poster.backgroundImage)) {
      bgImagePath = poster.backgroundImage;
    } else {
      const candidate1 = path.join(ROOT_DIR, poster.backgroundImage);
      const candidate2 = path.join(FONDS_DIR, path.basename(poster.backgroundImage));
      if (fs.existsSync(candidate1)) bgImagePath = candidate1;
      else if (fs.existsSync(candidate2)) bgImagePath = candidate2;
    }
  }

  // Fallback si l'image de fond n'est pas spécifiée
  if (!bgImagePath || !fs.existsSync(bgImagePath)) {
    console.warn(`⚠️ Fond ${poster.backgroundImage} non trouvé. Recherche d'un fond par défaut dans ${FONDS_DIR}...`);
    const defaultFond = path.join(FONDS_DIR, 'kepler-newton-maxwell.jpg');
    if (fs.existsSync(defaultFond)) {
      bgImagePath = defaultFond;
    } else {
      throw new Error(`Aucune image de fond disponible pour l'affiche ${poster.id}`);
    }
  }

  // Préparation du fond : redimensionnement à la taille de l'affiche
  console.log(`🌌 Utilisation du fond cosmique : ${path.basename(bgImagePath)}`);
  const bgBuffer = await sharp(bgImagePath)
    .resize(POSTER_WIDTH, POSTER_HEIGHT, { fit: 'cover', position: 'center' })
    .toBuffer();
  const bgBase64 = `data:image/jpeg;base64,${bgBuffer.toString('base64')}`;

  // 2. Préparation des polices vectorielles
  const cinzelBase64 = getFontBase64('Cinzel.ttf');
  const montserratBase64 = getFontBase64('Montserrat.ttf');

  let fontFaceDeclarations = '';
  if (cinzelBase64) {
    fontFaceDeclarations += `
      @font-face {
        font-family: 'CinzelCustom';
        src: url('data:font/truetype;charset=utf-8;base64,${cinzelBase64}') format('truetype');
        font-weight: 700;
      }
    `;
  }
  if (montserratBase64) {
    fontFaceDeclarations += `
      @font-face {
        font-family: 'MontserratCustom';
        src: url('data:font/truetype;charset=utf-8;base64,${montserratBase64}') format('truetype');
        font-weight: 400 600;
      }
    `;
  }

  // 3. Typographie et mise en page
  const titleFont = cinzelBase64 ? "'CinzelCustom', 'Cinzel', 'Playfair Display', Georgia, serif" : "'Cinzel', 'Playfair Display', Georgia, serif";
  const bodyFont = montserratBase64 ? "'MontserratCustom', 'Montserrat', sans-serif" : "'Montserrat', sans-serif";

  // Titre en haut
  const titleLines = wrapTitle(poster.title, 34);
  const titleFontSize = titleLines.length > 2 ? 64 : 76;
  const titleLineHeight = titleFontSize * 1.35;
  const titleStartY = 280 - ((titleLines.length - 1) * titleLineHeight * 0.4);

  const titleSvgLines = titleLines.map((line, idx) => {
    const y = titleStartY + (idx * titleLineHeight);
    return `<text x="1200" y="${y}" text-anchor="middle" class="poster-title-text">${escapeXml(line.toUpperCase())}</text>`;
  }).join('\n');

  // Faits marquants (3 à 5 phrases)
  const facts = poster.keyPoints && poster.keyPoints.length > 0
    ? poster.keyPoints
    : [
        "[Fait marquant n°1 : Texte provisoire court]",
        "[Fait marquant n°2 : Texte provisoire court]",
        "[Fait marquant n°3 : Texte provisoire court]",
        "[Fait marquant n°4 : Texte provisoire court]"
      ];

  const factsCount = facts.length;
  const factSpacing = factsCount > 4 ? 85 : 100;
  const factsStartY = 2460 - ((factsCount - 3) * 45);

  const factsSvgLines = facts.map((fact, idx) => {
    const y = factsStartY + (idx * factSpacing);
    return `
      <g transform="translate(1200, ${y})">
        <!-- Puce céleste sépia / or -->
        <circle cx="-560" cy="-8" r="7" fill="#D9A55B" opacity="0.8"/>
        <circle cx="-560" cy="-8" r="14" fill="none" stroke="#D9A55B" stroke-width="1.2" opacity="0.4"/>
        <text x="-520" y="0" text-anchor="start" class="poster-fact-text">
          ${escapeXml(fact)}
        </text>
      </g>
    `;
  }).join('\n');

  // SVG complet du gabarit
  const svgOverlay = `
  <svg width="${POSTER_WIDTH}" height="${POSTER_HEIGHT}" viewBox="0 0 ${POSTER_WIDTH} ${POSTER_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        ${fontFaceDeclarations}

        .poster-title-text {
          font-family: ${titleFont};
          font-weight: 700;
          font-size: ${titleFontSize}px;
          fill: #F3D9A4;
          letter-spacing: 3px;
          filter: drop-shadow(0 0 16px rgba(217, 165, 91, 0.45));
        }

        .poster-fact-text {
          font-family: ${bodyFont};
          font-weight: 500;
          font-size: 34px;
          fill: #F3D9A4;
          letter-spacing: 0.8px;
        }

        .poster-brand-text {
          font-family: ${titleFont};
          font-weight: 700;
          font-size: 32px;
          fill: #F3D9A4;
          letter-spacing: 6px;
        }

        .poster-domain-text {
          font-family: ${bodyFont};
          font-weight: 600;
          font-size: 22px;
          fill: #D9A55B;
          letter-spacing: 4px;
        }
      </style>

      <!-- Halos et dégradés sépia/or -->
      <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#8A5A2B" stop-opacity="0"/>
        <stop offset="30%" stop-color="#D9A55B" stop-opacity="0.8"/>
        <stop offset="50%" stop-color="#F3D9A4" stop-opacity="1"/>
        <stop offset="70%" stop-color="#D9A55B" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#8A5A2B" stop-opacity="0"/>
      </linearGradient>

      <!-- Vignettage haut et bas pour garantir la lisibilité du texte -->
      <linearGradient id="topVignette" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0B0806" stop-opacity="0.92"/>
        <stop offset="40%" stop-color="#0B0806" stop-opacity="0.75"/>
        <stop offset="100%" stop-color="#0B0806" stop-opacity="0"/>
      </linearGradient>

      <linearGradient id="bottomVignette" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0B0806" stop-opacity="0"/>
        <stop offset="40%" stop-color="#0B0806" stop-opacity="0.82"/>
        <stop offset="100%" stop-color="#0B0806" stop-opacity="0.96"/>
      </linearGradient>

      <radialGradient id="centerShine" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFF4DC" stop-opacity="0.2"/>
        <stop offset="50%" stop-color="#D9A55B" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#0B0806" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- 1. IMAGE DE FOND COSMIQUE CENTRÉE -->
    <image href="${bgBase64}" x="0" y="0" width="${POSTER_WIDTH}" height="${POSTER_HEIGHT}" preserveAspectRatio="xMidYMid slice"/>

    <!-- 2. VIGNETTES DE LISIBILITÉ (HAUT & BAS) -->
    <rect x="0" y="0" width="${POSTER_WIDTH}" height="700" fill="url(#topVignette)"/>
    <rect x="0" y="2150" width="${POSTER_WIDTH}" height="1050" fill="url(#bottomVignette)"/>

    <!-- Halo subtil au centre pour magnifier le point lumineux -->
    <circle cx="1200" cy="1420" r="600" fill="url(#centerShine)"/>

    <!-- 3. BORDURE ÉLÉGANTE SÉPIA ET OR -->
    <rect x="60" y="60" width="${POSTER_WIDTH - 120}" height="${POSTER_HEIGHT - 120}" rx="18" fill="none" stroke="#D9A55B" stroke-width="2.5" opacity="0.6"/>
    <rect x="78" y="78" width="${POSTER_WIDTH - 156}" height="${POSTER_HEIGHT - 156}" rx="12" fill="none" stroke="#8A5A2B" stroke-width="1.2" opacity="0.4" stroke-dasharray="14 8"/>

    <!-- Coins ouvragés géométriques -->
    <g stroke="#D9A55B" stroke-width="2" opacity="0.7">
      <!-- Haut Gauche -->
      <line x1="50" y1="120" x2="120" y2="120"/>
      <line x1="120" y1="50" x2="120" y2="120"/>
      <!-- Haut Droite -->
      <line x1="${POSTER_WIDTH - 120}" y1="120" x2="${POSTER_WIDTH - 50}" y2="120"/>
      <line x1="${POSTER_WIDTH - 120}" y1="50" x2="${POSTER_WIDTH - 120}" y2="120"/>
      <!-- Bas Gauche -->
      <line x1="50" y1="${POSTER_HEIGHT - 120}" x2="120" y2="${POSTER_HEIGHT - 120}"/>
      <line x1="120" y1="${POSTER_HEIGHT - 120}" x2="120" y2="${POSTER_HEIGHT - 50}"/>
      <!-- Bas Droite -->
      <line x1="${POSTER_WIDTH - 120}" y1="${POSTER_HEIGHT - 120}" x2="${POSTER_WIDTH - 50}" y2="${POSTER_HEIGHT - 120}"/>
      <line x1="${POSTER_WIDTH - 120}" y1="${POSTER_HEIGHT - 120}" x2="${POSTER_WIDTH - 120}" y2="${POSTER_HEIGHT - 50}"/>
    </g>

    <!-- 4. EN HAUT : LE TITRE DE LA VIDÉO -->
    <g>
      <!-- Petit sur-titre discret -->
      <text x="1200" y="165" text-anchor="middle" font-family="${titleFont}" font-size="20" font-weight="700" fill="#D9A55B" letter-spacing="8" opacity="0.9">
        — ÉTUDE SCIENTIFIQUE &amp; DESSEIN INTELLIGENT —
      </text>

      <!-- Titre principal avec léger halo doré -->
      ${titleSvgLines}

      <!-- Séparateur or fin sous le titre -->
      <line x1="850" y1="${titleStartY + (titleLines.length * titleLineHeight) - 15}" x2="1550" y2="${titleStartY + (titleLines.length * titleLineHeight) - 15}" stroke="url(#goldGradient)" stroke-width="2"/>
    </g>

    <!-- 5. AU CENTRE : L'ILLUSTRATION COSMIQUE
         (La composition laisse respirer le point lumineux #FFF4DC, les orbites et spirales fines au centre) -->

    <!-- 6. EN DESSOUS : 3 À 5 FAITS MARQUANTS (PHRASES COURTES) -->
    <g>
      <!-- Séparateur fin au-dessus des faits marquants -->
      <line x1="750" y1="${factsStartY - 110}" x2="1650" y2="${factsStartY - 110}" stroke="url(#goldGradient)" stroke-width="1.5" opacity="0.8"/>
      
      <text x="1200" y="${factsStartY - 65}" text-anchor="middle" font-family="${titleFont}" font-size="22" font-weight="700" fill="#D9A55B" letter-spacing="6">
        ✦ FAITS MARQUANTS &amp; ENSEIGNEMENTS ✦
      </text>

      <!-- Liste des phrases courtes -->
      ${factsSvgLines}
    </g>

    <!-- 7. EN BAS : « LE GRAND GÉNIE DE LA CRÉATION » ET GRANDCREATEUR.COM -->
    <g transform="translate(1200, 2980)">
      <line x1="-500" y1="-35" x2="500" y2="-35" stroke="url(#goldGradient)" stroke-width="2" opacity="0.75"/>
      <circle cx="0" cy="-35" r="5" fill="#FFF4DC"/>

      <text x="0" y="15" text-anchor="middle" class="poster-brand-text">
        LE GRAND GÉNIE DE LA CRÉATION
      </text>
      <text x="0" y="55" text-anchor="middle" class="poster-domain-text">
        grandcreateur.com
      </text>
    </g>
  </svg>
  `;

  // 4. Génération du master JPG haute résolution (2400 x 3200)
  const masterJpgPath = path.join(OUTPUT_DIR, `${poster.id}.jpg`);
  await sharp(Buffer.from(svgOverlay))
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(masterJpgPath);
  console.log(`✅ Master JPG généré : ${masterJpgPath} (${(fs.statSync(masterJpgPath).size / 1024).toFixed(1)} Ko)`);

  // 5. Génération de l'aperçu WebP optimisé pour le site web
  const webpPath = path.join(OUTPUT_DIR, `${poster.id}.webp`);
  await sharp(Buffer.from(svgOverlay))
    .resize(900, 1200, { fit: 'inside' })
    .webp({ quality: 85, effort: 6 })
    .toFile(webpPath);
  console.log(`✅ Aperçu WebP généré : ${webpPath} (${(fs.statSync(webpPath).size / 1024).toFixed(1)} Ko)`);

  // 6. Génération de l'export PDF haute résolution prêt à imprimer
  const masterJpgBuffer = fs.readFileSync(masterJpgPath);
  const pdfBuffer = buildPdfFromJpegBuffer(masterJpgBuffer, POSTER_WIDTH, POSTER_HEIGHT);
  const pdfPath = path.join(OUTPUT_DIR, `${poster.id}.pdf`);
  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log(`✅ Export PDF prêt à imprimer généré : ${pdfPath} (${(pdfBuffer.length / 1024).toFixed(1)} Ko)`);

  return {
    jpg: masterJpgPath,
    webp: webpPath,
    pdf: pdfPath
  };
}

// Fonction principale
async function buildAllPosters() {
  console.log('🚀 Démarrage de build-affiches.js...');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Chargement des affiches déclarées
  delete require.cache[require.resolve(AFFICHES_DATA_FILE)];
  const { AFFICHES } = require(AFFICHES_DATA_FILE);

  console.log(`📋 ${AFFICHES.length} affiche(s) à générer.`);

  for (const poster of AFFICHES) {
    if (poster.isPreGenerated) {
      console.log(`⏩ Affiche préexistante ignorée : « ${poster.title} » (ID: ${poster.id})`);
      continue;
    }
    try {
      await generateSinglePoster(poster);
    } catch (err) {
      console.error(`❌ Échec pour l'affiche ${poster.id} :`, err);
    }
  }

  console.log('\n✨ Génération des affiches terminée avec succès.');
}

if (require.main === module) {
  buildAllPosters().catch(err => {
    console.error('Erreur critique :', err);
    process.exit(1);
  });
}

module.exports = { buildAllPosters, generateSinglePoster };
