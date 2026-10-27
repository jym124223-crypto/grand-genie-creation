const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const EXPORT_DIR = path.join(ROOT_DIR, 'exports', 'affiches-hd');
const DESKTOP_DIR = 'C:/Users/jym12/OneDrive/Desktop';
const ARTIFACT_DIR = 'C:/Users/jym12/.gemini/antigravity-ide/brain/13153017-adef-4a59-8e9d-b3be2646daff';

// Chemins des images
const IMG_BIG_BANG = path.join(ARTIFACT_DIR, 'big_bang_primordial_1792994835476.jpg');
const IMG_JWST = path.join(ARTIFACT_DIR, 'james_webb_telescope_1792994858245.jpg');
const IMG_PENROSE = path.join(ARTIFACT_DIR, 'portrait_roger_penrose_1792994880594.jpg');
const IMG_SILHOUETTE = path.join(ARTIFACT_DIR, 'silhouette_homme_cosmos_1792994899749.jpg');
const IMG_GLASS = path.join(ARTIFACT_DIR, 'verre_eau_bris_1792994918445.jpg');
const IMG_CHAOTIC = path.join(ARTIFACT_DIR, 'univers_chaotique_1792994938049.jpg');
const IMG_REAL_CMB = path.join(ARTIFACT_DIR, 'univers_reel_homogene_1792994958553.jpg');

const WIDTH = 4000;
const HEIGHT = 6000;

// Masque coins arrondis avec support alpha strict
function createRoundedMask(w, h, r) {
  return Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" fill="#ffffff"/></svg>`);
}

// Masque cercle avec support alpha strict
function createCircleMask(d) {
  return Buffer.from(`<svg width="${d}" height="${d}"><circle cx="${d/2}" cy="${d/2}" r="${d/2}" fill="#ffffff"/></svg>`);
}

// Générateur de PDF 1.4 grand format 20 × 30 pouces (300 DPI)
function buildPdfFromJpegBuffer(jpegBuffer, width, height) {
  const ptWidth = 20 * 72; // 1440 pt
  const ptHeight = 30 * 72; // 2160 pt

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

async function buildIllustratedPoster() {
  console.log('🚀 Démarrage de la composition de l\'affiche illustrée HD (style référence)...');

  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
  }

  // 1. Préparation des images haute résolution avec coins arrondis et canal alpha
  console.log('🖼️ Préparation des images haute résolution...');

  // 1. Verre brisé (830 × 520)
  const glassBuf = await sharp(IMG_GLASS)
    .ensureAlpha()
    .resize(830, 520, { fit: 'cover', position: 'center' })
    .composite([{ input: createRoundedMask(830, 520, 16), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 2. Big Bang primordial (1660 × 620)
  const bigBangBuf = await sharp(IMG_BIG_BANG)
    .ensureAlpha()
    .resize(1660, 620, { fit: 'cover', position: 'center' })
    .composite([{ input: createRoundedMask(1660, 620, 16), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 3. Univers chaotique (750 × 420)
  const chaoticBuf = await sharp(IMG_CHAOTIC)
    .ensureAlpha()
    .resize(750, 420, { fit: 'cover', position: 'center' })
    .composite([{ input: createRoundedMask(750, 420, 14), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 4. Univers réel CMB (750 × 420)
  const realCmbBuf = await sharp(IMG_REAL_CMB)
    .ensureAlpha()
    .resize(750, 420, { fit: 'cover', position: 'center' })
    .composite([{ input: createRoundedMask(750, 420, 14), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 5. Roger Penrose circulaire (520 × 520)
  const penroseBuf = await sharp(IMG_PENROSE)
    .ensureAlpha()
    .resize(520, 520, { fit: 'cover', position: 'top' })
    .composite([{ input: createCircleMask(520), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 6. James Webb télescope (1600 × 900)
  const jwstBuf = await sharp(IMG_JWST)
    .ensureAlpha()
    .resize(1600, 900, { fit: 'cover', position: 'center' })
    .composite([{ input: createRoundedMask(1600, 900, 18), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 7. Silhouette contemplative (940 × 870)
  const silhouetteBuf = await sharp(IMG_SILHOUETTE)
    .ensureAlpha()
    .resize(940, 870, { fit: 'cover', position: 'center' })
    .composite([{ input: createRoundedMask(940, 870, 18), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 2. Schémas vectoriels SVG (molécules & espace des phases)
  const titleFont = "'Arial Black', 'Helvetica Neue', Arial, sans-serif";
  const bodyFont = "'Segoe UI', Arial, sans-serif";

  let orderedAtomsSvg = '';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      const cx = 50 + c * 75;
      const cy = 40 + r * 55;
      orderedAtomsSvg += `<circle cx="${cx}" cy="${cy}" r="14" fill="#38BDF8"/>`;
      if (c < 4) {
        orderedAtomsSvg += `<line x1="${cx + 14}" y1="${cy}" x2="${cx + 61}" y2="${cy}" stroke="#0284C7" stroke-width="3"/>`;
      }
      if (r < 3) {
        orderedAtomsSvg += `<line x1="${cx}" y1="${cy + 14}" x2="${cx}" y2="${cy + 41}" stroke="#0284C7" stroke-width="3"/>`;
      }
    }
  }

  const randomCoords = [
    [40, 50], [90, 110], [140, 45], [195, 95], [260, 40],
    [70, 180], [130, 215], [220, 160], [310, 115], [360, 65],
    [175, 125], [280, 210], [340, 170], [50, 130], [320, 225],
    [105, 75], [235, 70], [370, 120], [160, 175], [290, 155]
  ];
  let disorderedAtomsSvg = '';
  randomCoords.forEach(([cx, cy]) => {
    disorderedAtomsSvg += `<circle cx="${cx}" cy="${cy}" r="13" fill="#60A5FA"/>`;
    const vx = ((cx * 17) % 30) - 15;
    const vy = ((cy * 23) % 30) - 15;
    disorderedAtomsSvg += `<line x1="${cx}" y1="${cy}" x2="${cx + vx}" y2="${cy + vy}" stroke="#93C5FD" stroke-width="2" stroke-dasharray="3 3"/>`;
  });

  let phaseSpaceDots = '';
  for (let y = 0; y < 14; y++) {
    for (let x = 0; x < 26; x++) {
      const px = x * 36;
      const py = y * 24;
      phaseSpaceDots += `<circle cx="${px}" cy="${py}" r="2.5" fill="#38BDF8" opacity="0.6"/>`;
    }
  }

  // 3. Construction du calque vectoriel de base (Cartes, Textes, Titres, Lignes)
  const baseVectorSvg = `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#FF7A29"/>
      </marker>
      <linearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0E1E34" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#091424" stop-opacity="0.98"/>
      </linearGradient>
    </defs>

    <!-- Fond général sombre -->
    <rect width="${WIDTH}" height="${HEIGHT}" fill="#081422"/>

    <!-- EN-TÊTE -->
    <g transform="translate(2000, 110)">
      <text x="0" y="0" text-anchor="middle" font-family="${titleFont}" font-size="74" font-weight="900" fill="#FFFFFF" letter-spacing="3">
        L&#39;ORIGINE DE L&#39;UNIVERS :
      </text>
      <text x="0" y="95" text-anchor="middle" font-family="${titleFont}" font-size="74" font-weight="900" fill="#FFFFFF" letter-spacing="3">
        LE MYSTÈRE DE LA CONFIGURATION INITIALE
      </text>
      <text x="0" y="165" text-anchor="middle" font-family="${titleFont}" font-size="34" font-weight="800" fill="#38BDF8" letter-spacing="4">
        DU BIG BANG AU TÉLESCOPE JAMES WEBB : DU HASARD À LA CONCEPTION ?
      </text>
    </g>

    <!-- SECTION 1 (x: 120, y: 340) -->
    <g transform="translate(120, 340)">
      <rect width="1820" height="1520" rx="20" fill="url(#cardBg)" stroke="#1E3A5F" stroke-width="2.5"/>
      <text x="50" y="75" font-family="${titleFont}" font-size="44" font-weight="900" fill="#FFFFFF">
        1 : QU&#39;EST-CE QUE L&#39;ENTROPIE ?
      </text>

      <!-- Verre intact -->
      <g transform="translate(80, 130)">
        <rect width="640" height="520" rx="14" fill="#061224" stroke="#1E3A5F" stroke-width="1.5"/>
        <text x="320" y="55" text-anchor="middle" font-family="${titleFont}" font-size="28" font-weight="800" fill="#38BDF8">
          VERRE D&#39;EAU INTACT
        </text>
        <path d="M 220 120 L 250 420 Q 320 450 390 420 L 420 120 Z" fill="#0C2548" stroke="#38BDF8" stroke-width="4"/>
        <path d="M 235 240 L 253 415 Q 320 440 387 415 L 405 240 Z" fill="#0284C7" opacity="0.6"/>
        <ellipse cx="320" cy="120" rx="100" ry="25" fill="#1E3A5F" stroke="#38BDF8" stroke-width="3"/>
        <text x="320" y="485" text-anchor="middle" font-family="${bodyFont}" font-size="22" font-weight="700" fill="#94A3B8">
          État initial hautement ordonné
        </text>
      </g>

      <!-- Flèche orange bris de verre -->
      <path d="M 750 390 Q 840 370 870 390" fill="none" stroke="#FF7A29" stroke-width="12" marker-end="url(#arrow)"/>

      <!-- Cadre Verre brisé -->
      <rect x="910" y="130" width="830" height="520" rx="16" fill="none" stroke="#1E3A5F" stroke-width="2"/>
      <text x="1325" y="620" text-anchor="middle" font-family="${bodyFont}" font-size="22" font-weight="700" fill="#F87171">
        Irréversibilité : le verre ne se reforme jamais seul
      </text>

      <!-- Transition moléculaire -->
      <path d="M 910 680 Q 910 710 910 730" fill="none" stroke="#FF7A29" stroke-width="8" marker-end="url(#arrow)"/>
      <text x="50" y="760" font-family="${titleFont}" font-size="30" font-weight="800" fill="#38BDF8">
        À L&#39;ÉCHELLE MICROSCOPIQUE : L&#39;ARRANGEMENT DES MOLÉCULES
      </text>

      <!-- Boîte Ordonnée -->
      <g transform="translate(80, 800)">
        <rect width="720" height="360" rx="14" fill="#061224" stroke="#1E3A5F" stroke-width="1.8"/>
        <g transform="translate(170, 70)">${orderedAtomsSvg}</g>
        <text x="360" y="325" text-anchor="middle" font-family="${titleFont}" font-size="24" font-weight="800" fill="#38BDF8">
          ORDRE : PEU DE CONFIGURATIONS
        </text>
      </g>

      <!-- Flèche moléculaire -->
      <path d="M 830 980 L 960 980" fill="none" stroke="#FF7A29" stroke-width="12" marker-end="url(#arrow)"/>

      <!-- Boîte Désordonnée -->
      <g transform="translate(1000, 800)">
        <rect width="740" height="360" rx="14" fill="#061224" stroke="#1E3A5F" stroke-width="1.8"/>
        <g transform="translate(160, 50)">${disorderedAtomsSvg}</g>
        <text x="370" y="325" text-anchor="middle" font-family="${titleFont}" font-size="24" font-weight="800" fill="#F5C542">
          DÉSORDRE : MULTITUDE DE CONFIGURATIONS
        </text>
      </g>

      <!-- Texte Section 1 -->
      <g transform="translate(60, 1220)">
        <rect width="1700" height="240" rx="12" fill="#040A14" stroke="#1E3A5F" stroke-width="1.2"/>
        <text x="40" y="65" font-family="${bodyFont}" font-size="30" fill="#E2E8F0">
          <tspan x="40" dy="0">L&#39;entropie est une mesure du désordre ou plutôt <tspan font-weight="700" fill="#38BDF8">du nombre de configurations possibles</tspan> de la matière.</tspan>
          <tspan x="40" dy="48">Le deuxième principe de la thermodynamique dicte qu&#39;elle augmente constamment dans un système isolé,</tspan>
          <tspan x="40" dy="48">imposant ainsi <tspan font-weight="700" fill="#F5C542">une flèche irréversible au temps</tspan> : le futur et le passé ne sont pas interchangeables.</tspan>
        </text>
      </g>
    </g>

    <!-- SECTION 2 (x: 2060, y: 340) -->
    <g transform="translate(2060, 340)">
      <rect width="1820" height="1520" rx="20" fill="url(#cardBg)" stroke="#1E3A5F" stroke-width="2.5"/>
      <text x="50" y="75" font-family="${titleFont}" font-size="44" font-weight="900" fill="#FFFFFF">
        2. L&#39;ÉTAT INITIAL DE L&#39;UNIVERS
      </text>

      <!-- Cadre Big Bang -->
      <rect x="80" y="110" width="1660" height="620" rx="16" fill="none" stroke="#F5C542" stroke-width="2"/>
      <rect x="100" y="130" width="400" height="60" rx="8" fill="#061224" opacity="0.9"/>
      <text x="120" y="172" font-family="${titleFont}" font-size="24" font-weight="800" fill="#F5C542">
        ✦ PLASMA PRIMORDIAL ARDENT
      </text>

      <!-- Cadre Chaotique -->
      <g transform="translate(80, 770)">
        <rect width="750" height="420" rx="14" fill="none" stroke="#EF4444" stroke-width="2.5"/>
        <text x="375" y="38" text-anchor="middle" font-family="${titleFont}" font-size="24" font-weight="800" fill="#F87171">
          UNIVERS CHAOTIQUE IMAGINAIRE
        </text>
        <text x="375" y="405" text-anchor="middle" font-family="${bodyFont}" font-size="20" font-weight="600" fill="#CBD5E1">
          Grumeaux, trous noirs précoces, matière disloquée
        </text>
      </g>

      <!-- Flèche comparaison -->
      <path d="M 855 980 L 965 980" fill="none" stroke="#FF7A29" stroke-width="12" marker-end="url(#arrow)"/>

      <!-- Cadre Réel -->
      <g transform="translate(990, 770)">
        <rect width="750" height="420" rx="14" fill="none" stroke="#38BDF8" stroke-width="2.5"/>
        <text x="375" y="38" text-anchor="middle" font-family="${titleFont}" font-size="24" font-weight="800" fill="#38BDF8">
          UNIVERS RÉEL : HAUTEMENT HOMOGÈNE
        </text>
        <text x="375" y="405" text-anchor="middle" font-family="${bodyFont}" font-size="20" font-weight="600" fill="#CBD5E1">
          Distribution uniforme parfaite à basse entropie
        </text>
      </g>

      <!-- Texte Section 2 -->
      <g transform="translate(60, 1220)">
        <rect width="1700" height="240" rx="12" fill="#040A14" stroke="#1E3A5F" stroke-width="1.2"/>
        <text x="40" y="65" font-family="${bodyFont}" font-size="30" fill="#E2E8F0">
          <tspan x="40" dy="0">Pour la gravitation, un univers homogène et régulier représente un état <tspan font-weight="700" fill="#F5C542">d&#39;ordre maximal</tspan>.</tspan>
          <tspan x="40" dy="48">Un état d&#39;une incroyable uniformité et <tspan font-weight="700" fill="#38BDF8">d&#39;une basse entropie extrême</tspan> était strictement indispensable</tspan>
          <tspan x="40" dy="48">pour permettre l&#39;effondrement gravitationnel progressif qui a forgé les étoiles, les galaxies et la vie.</tspan>
        </text>
      </g>
    </g>

    <!-- SECTION 3 (x: 120, y: 1910) -->
    <g transform="translate(120, 1910)">
      <rect width="3760" height="1160" rx="20" fill="url(#cardBg)" stroke="#F5C542" stroke-width="3"/>
      <text x="60" y="75" font-family="${titleFont}" font-size="44" font-weight="900" fill="#FFFFFF">
        3. LE CALCUL DE PENROSE : 1 CHANCE SUR 10¹⁰¹²³
      </text>

      <!-- Colonne 1 : Chiffre Penrose -->
      <g transform="translate(60, 120)">
        <text x="40" y="150" font-family="${titleFont}" font-size="130" font-weight="900" fill="#F5C542">
          1 / 10<tspan font-size="75" dy="-45">10</tspan><tspan font-size="50" dy="-25">123</tspan>
        </text>

        <rect x="0" y="220" width="1050" height="270" rx="14" fill="#040A14" stroke="#F5C542" stroke-width="1.8"/>
        <text x="40" y="65" font-family="${titleFont}" font-size="28" font-weight="800" fill="#FFFFFF">
          PROBABILITÉ STATISTIQUE : QUASIMENT NULLE
        </text>
        <text x="40" y="125" font-family="${bodyFont}" font-size="25" fill="#E2E8F0">
          <tspan x="40" dy="0">Ce chiffre dépasse l&#39;entendement humain :</tspan>
          <tspan x="40" dy="38"><tspan font-weight="700" fill="#F5C542">écrire tous ses zéros nécessiterait plus d&#39;encre</tspan></tspan>
          <tspan x="40" dy="38">qu&#39;il n&#39;y a d&#39;atomes dans tout l&#39;univers observable (~10⁸⁰ atomes).</tspan>
        </text>
      </g>

      <!-- Colonne 2 : Cadre Roger Penrose -->
      <circle cx="1600" cy="400" r="260" fill="none" stroke="#F5C542" stroke-width="4"/>
      <circle cx="1600" cy="400" r="275" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="8 6"/>
      <text x="1600" y="700" text-anchor="middle" font-family="${titleFont}" font-size="28" font-weight="800" fill="#FFFFFF">
        SIR ROGER PENROSE
      </text>
      <text x="1600" y="738" text-anchor="middle" font-family="${bodyFont}" font-size="22" font-weight="600" fill="#38BDF8">
        Prix Nobel de Physique 2020
      </text>

      <!-- Flèche vers l'espace des phases -->
      <path d="M 1900 350 Q 2000 280 2100 330" fill="none" stroke="#38BDF8" stroke-width="8" marker-end="url(#arrow)"/>

      <!-- Colonne 3 : Espace des phases -->
      <g transform="translate(2150, 140)">
        <rect width="1530" height="600" rx="16" fill="#040A14" stroke="#1E3A5F" stroke-width="2"/>
        <text x="50" y="55" font-family="${titleFont}" font-size="28" font-weight="800" fill="#38BDF8">
          L&#39;ESPACE DES PHASES : L&#39;AIGUILLE DU CRÉATEUR
        </text>
        <g transform="translate(80, 110)">${phaseSpaceDots}</g>

        <!-- Boîte sélectionnée -->
        <rect x="580" y="260" width="36" height="24" fill="#F5C542" stroke="#FFFFFF" stroke-width="2"/>
        <line x1="1200" y1="120" x2="620" y2="255" stroke="#FFFFFF" stroke-width="5"/>
        <circle cx="620" cy="255" r="8" fill="#F5C542"/>
        <text x="1220" y="115" font-family="${titleFont}" font-size="24" font-weight="800" fill="#F5C542">
          POINTAGE ULTRA-PRÉCIS
        </text>
        <text x="1220" y="148" font-family="${bodyFont}" font-size="20" fill="#E2E8F0">
          1 boîte parmi 10¹⁰¹²³ univers possibles
        </text>
        <text x="50" y="530" font-family="${bodyFont}" font-size="24" fill="#94A3B8">
          « Pour produire un univers semblable au nôtre, le Créateur a dû viser un volume de l&#39;espace des phases
        </text>
        <text x="50" y="565" font-family="${bodyFont}" font-size="24" font-weight="700" fill="#F5C542">
          d&#39;à peine 1 part pour 10 puissance 10 puissance 123. » — Sir Roger Penrose
        </text>
      </g>

      <!-- Texte Section 3 -->
      <g transform="translate(60, 830)">
        <rect width="3640" height="260" rx="14" fill="#061224" stroke="#1E3A5F" stroke-width="1.5"/>
        <text x="60" y="70" font-family="${bodyFont}" font-size="32" fill="#FFFFFF">
          <tspan x="60" dy="0">Le physicien Roger Penrose a calculé la probabilité que cette configuration initiale se produise spontanément :</tspan>
          <tspan x="60" dy="54"><tspan font-weight="900" fill="#F5C542">1 chance sur 10 puissance 10 puissance 123.</tspan> Un nombre si gigantesque qu&#39;il dépasse l&#39;échelle de l&#39;Univers entier,</tspan>
          <tspan x="60" dy="54">rendant l&#39;émergence d&#39;un cosmos ordonné et propice à la vie <tspan font-weight="700" fill="#F87171">statistiquement impossible par simple hasard</tspan>.</tspan>
        </text>
      </g>
    </g>

    <!-- SECTION 4 (x: 120, y: 3120) -->
    <g transform="translate(120, 3120)">
      <rect width="3760" height="1300" rx="20" fill="url(#cardBg)" stroke="#1E3A5F" stroke-width="2.5"/>
      <text x="60" y="75" font-family="${titleFont}" font-size="44" font-weight="900" fill="#FFFFFF">
        4. L&#39;ANALOGIE DU TÉLESCOPE JAMES WEBB
      </text>

      <!-- Cadre JWST -->
      <rect x="60" y="120" width="1600" height="900" rx="18" fill="none" stroke="#F5C542" stroke-width="2"/>

      <!-- Badge 344 points de défaillance -->
      <g transform="translate(1700, 160)">
        <rect width="820" height="280" rx="16" fill="#040A14" stroke="#FF7A29" stroke-width="3"/>
        <text x="410" y="85" text-anchor="middle" font-family="${titleFont}" font-size="68" font-weight="900" fill="#F5C542">
          344
        </text>
        <text x="410" y="150" text-anchor="middle" font-family="${titleFont}" font-size="28" font-weight="800" fill="#FF7A29">
          POINTS DE DÉFAILLANCE UNIQUE
        </text>
        <text x="410" y="210" text-anchor="middle" font-family="${bodyFont}" font-size="22" font-weight="600" fill="#E2E8F0">
          Un seul grippage et toute la mission était anéantie
        </text>
        <!-- Flèches pointant le télescope -->
        <path d="M 0 60 L -120 40" stroke="#FF7A29" stroke-width="6" marker-end="url(#arrow)"/>
        <path d="M 0 140 L -160 220" stroke="#FF7A29" stroke-width="6" marker-end="url(#arrow)"/>
        <path d="M 0 220 L -120 380" stroke="#FF7A29" stroke-width="6" marker-end="url(#arrow)"/>
      </g>

      <!-- Schéma Fusée -> Déploiement -->
      <g transform="translate(2620, 150)">
        <rect width="1080" height="850" rx="16" fill="#061224" stroke="#1E3A5F" stroke-width="2"/>
        <g transform="translate(100, 60)">
          <path d="M 120 40 Q 180 0 240 40 L 240 500 L 120 500 Z" fill="#0C2548" stroke="#38BDF8" stroke-width="3"/>
          <rect x="150" y="180" width="60" height="180" rx="8" fill="#F5C542"/>
          <text x="180" y="560" text-anchor="middle" font-family="${titleFont}" font-size="22" font-weight="800" fill="#38BDF8">
            REPLIÉ DANS LA COIFFE
          </text>
          <text x="180" y="595" text-anchor="middle" font-family="${bodyFont}" font-size="18" fill="#94A3B8">
            Diamètre max : 5 mètres
          </text>
        </g>
        <path d="M 400 320 L 540 320" stroke="#FF7A29" stroke-width="12" marker-end="url(#arrow)"/>
        <g transform="translate(560, 60)">
          <polygon points="260,100 320,135 320,205 260,240 200,205 200,135" fill="#F5C542" stroke="#FFFFFF" stroke-width="3"/>
          <polygon points="260,245 320,280 320,350 260,385 200,350 200,280" fill="#F5C542" stroke="#FFFFFF" stroke-width="3"/>
          <polygon points="120,380 400,380 440,460 80,460" fill="#94A3B8" stroke="#38BDF8" stroke-width="2"/>
          <circle cx="260" cy="620" r="80" fill="#0284C7" stroke="#38BDF8" stroke-width="4"/>
          <path d="M 230 580 Q 260 560 290 600 Q 310 650 260 680" fill="#22C55E"/>
          <text x="260" y="740" text-anchor="middle" font-family="${titleFont}" font-size="22" font-weight="800" fill="#38BDF8">
            DÉPLOYÉ À 1,5 M KM (L2)
          </text>
          <text x="260" y="775" text-anchor="middle" font-family="${bodyFont}" font-size="18" fill="#94A3B8">
            Séquence automatique parfaite
          </text>
        </g>
      </g>

      <!-- Texte Section 4 -->
      <g transform="translate(60, 1060)">
        <rect width="3640" height="180" rx="14" fill="#040A14" stroke="#1E3A5F" stroke-width="1.2"/>
        <text x="50" y="65" font-family="${bodyFont}" font-size="28" fill="#E2E8F0">
          <tspan x="50" dy="0">Le télescope James Webb était beaucoup trop volumineux pour être lancé déployé. Les ingénieurs ont dû le plier entièrement.</tspan>
          <tspan x="50" dy="46">Une machine si complexe qu&#39;elle a exigé des années de calculs, de tests et de simulations. <tspan font-weight="700" fill="#F5C542">Une configuration initiale minutieuse était strictement indispensable</tspan> pour que la mission réussisse.</tspan>
        </text>
      </g>
    </g>

    <!-- SECTION 5 (x: 120, y: 4470) -->
    <g transform="translate(120, 4470)">
      <rect width="3760" height="1220" rx="20" fill="url(#cardBg)" stroke="#38BDF8" stroke-width="2.5"/>
      <text x="60" y="75" font-family="${titleFont}" font-size="44" font-weight="900" fill="#FFFFFF">
        5. HASARD OU CONCEPTION ?
      </text>

      <!-- Engrenages -->
      <g transform="translate(120, 260)">
        <circle cx="160" cy="160" r="110" fill="none" stroke="#38BDF8" stroke-width="16"/>
        <circle cx="160" cy="160" r="45" fill="#061224" stroke="#38BDF8" stroke-width="8"/>
        <rect x="145" y="25" width="30" height="40" rx="6" fill="#38BDF8"/>
        <rect x="145" y="255" width="30" height="40" rx="6" fill="#38BDF8"/>
        <rect x="25" y="145" width="40" height="30" rx="6" fill="#38BDF8"/>
        <rect x="255" y="145" width="40" height="30" rx="6" fill="#38BDF8"/>

        <circle cx="370" cy="240" r="85" fill="none" stroke="#F5C542" stroke-width="14"/>
        <circle cx="370" cy="240" r="35" fill="#061224" stroke="#F5C542" stroke-width="6"/>
        <rect x="358" y="135" width="24" height="30" rx="5" fill="#F5C542"/>
        <rect x="358" y="315" width="24" height="30" rx="5" fill="#F5C542"/>
        <rect x="265" y="228" width="30" height="24" rx="5" fill="#F5C542"/>
        <rect x="445" y="228" width="30" height="24" rx="5" fill="#F5C542"/>

        <circle cx="270" cy="380" r="60" fill="none" stroke="#FF7A29" stroke-width="12"/>
        <circle cx="270" cy="380" r="22" fill="#061224" stroke="#FF7A29" stroke-width="5"/>

        <text x="250" y="550" text-anchor="middle" font-family="${titleFont}" font-size="24" font-weight="800" fill="#38BDF8">
          MÉCANIQUE DE PRÉCISION
        </text>
        <text x="250" y="590" text-anchor="middle" font-family="${bodyFont}" font-size="20" fill="#94A3B8">
          Lois physiques &amp; réglages fins
        </text>
      </g>

      <!-- Déduction & Conviction Jean-Yves -->
      <g transform="translate(680, 130)">
        <text x="0" y="40" font-family="${titleFont}" font-size="36" font-weight="900" fill="#FFFFFF">
          LA RECONNAISSANCE DU DESIGN INTELLIGENT
        </text>

        <text x="0" y="110" font-family="${bodyFont}" font-size="29" fill="#E2E8F0">
          <tspan x="0" dy="0">Si la complexité d&#39;une machine technologique humaine nous impose rationnellement</tspan>
          <tspan x="0" dy="46">de reconnaître l&#39;œuvre d&#39;une intelligence, qu&#39;en est-il de la configuration initiale de l&#39;Univers ?</tspan>
          <tspan x="0" dy="46">Entre la justesse des lois physiques et l&#39;ajustement vertigineux des conditions de départ,</tspan>
          <tspan x="0" dy="46">la science moderne pointe vers <tspan font-weight="700" fill="#38BDF8">la marque indéniable d&#39;une grande conception</tspan>.</tspan>
        </text>

        <!-- Cartouche solennel -->
        <g transform="translate(0, 340)">
          <rect width="2020" height="340" rx="18" fill="#040A14" stroke="#F5C542" stroke-width="3"/>
          <text x="1010" y="70" text-anchor="middle" font-family="${titleFont}" font-size="30" font-weight="800" fill="#F5C542">
            ✦ MA CONVICTION PERSONNELLE (JEAN-YVES) ✦
          </text>
          <text x="1010" y="130" text-anchor="middle" font-family="${bodyFont}" font-size="28" font-style="italic" fill="#E2E8F0">
            « Si nous reconnaissons sans hésiter l&#39;intelligence des ingénieurs derrière les 344 mécanismes de James Webb,
          </text>
          <text x="1010" y="175" text-anchor="middle" font-family="${bodyFont}" font-size="28" font-style="italic" fill="#E2E8F0">
            pourquoi refuser d&#39;envisager une intelligence immensément supérieure derrière les constantes de notre Univers ?
          </text>
          <line x1="200" y1="215" x2="1820" y2="215" stroke="#F5C542" stroke-width="1.5" opacity="0.6"/>
          <text x="1010" y="280" text-anchor="middle" font-family="${titleFont}" font-size="38" font-weight="900" fill="#FFFFFF">
            POUR MOI, CETTE INTELLIGENCE SUPRÊME, C&#39;EST LE CRÉATEUR :
          </text>
          <text x="1010" y="325" text-anchor="middle" font-family="${titleFont}" font-size="36" font-weight="900" fill="#F5C542">
            LE GRAND GÉNIE DE LA CRÉATION.
          </text>
        </g>
      </g>

      <!-- Cadre Silhouette -->
      <rect x="2740" y="150" width="940" height="870" rx="18" fill="none" stroke="#38BDF8" stroke-width="2.5"/>
      <text x="3210" y="1060" text-anchor="middle" font-family="${titleFont}" font-size="24" font-weight="800" fill="#38BDF8">
        CONTEMPLATION DE L&#39;UNIVERS
      </text>
    </g>

    <!-- PIED DE PAGE -->
    <g transform="translate(2000, 5820)">
      <line x1="-1800" y1="0" x2="1800" y2="0" stroke="#1E3A5F" stroke-width="3"/>
      <circle cx="0" cy="0" r="8" fill="#F5C542"/>
      <text x="0" y="60" text-anchor="middle" font-family="${titleFont}" font-size="36" font-weight="900" fill="#FFFFFF" letter-spacing="6">
        LE GRAND GÉNIE DE LA CRÉATION
      </text>
      <text x="0" y="110" text-anchor="middle" font-family="${bodyFont}" font-size="24" font-weight="600" fill="#94A3B8" letter-spacing="4">
        grandcreateur.com  •  DOCUMENT D&#39;ART ET D&#39;ÉTUDE GRAND FORMAT (20 × 30 po)  •  ÉDITION HAUTE DÉFINITION (300 DPI)
      </text>
    </g>
  </svg>
  `;

  // 4. On rasterise d'abord le calque vectoriel
  console.log('📐 Rasterisation du calque vectoriel de base...');
  const baseVectorBuf = await sharp(Buffer.from(baseVectorSvg))
    .resize(WIDTH, HEIGHT)
    .png()
    .toBuffer();

  // 5. Assemblage final : les photos sont placées PAR-DESSUS les cartes
  console.log('🎨 Composition finale : incrustation des photos haute résolution...');
  const masterJpgPath = path.join(EXPORT_DIR, 'affiche-origine-univers-illustree-master-hd.jpg');

  await sharp(baseVectorBuf)
    .composite([
      // 1. Verre brisé (Section 1)
      { input: glassBuf, top: 470, left: 1030 },
      // 2. Big Bang (Section 2)
      { input: bigBangBuf, top: 450, left: 2140 },
      // 3. Univers chaotique (Section 2)
      { input: chaoticBuf, top: 1110, left: 2140 },
      // 4. Univers réel CMB (Section 2)
      { input: realCmbBuf, top: 1110, left: 3050 },
      // 5. Roger Penrose circulaire (Section 3)
      { input: penroseBuf, top: 2050, left: 1460 },
      // 6. James Webb (Section 4)
      { input: jwstBuf, top: 3240, left: 180 },
      // 7. Silhouette contemplative (Section 5)
      { input: silhouetteBuf, top: 4620, left: 2860 }
    ])
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(masterJpgPath);

  console.log(`✅ Master Ultra-HD généré : ${masterJpgPath} (${(fs.statSync(masterJpgPath).size / (1024 * 1024)).toFixed(2)} Mo)`);

  // 6. Génération du PDF haute résolution 20 × 30 pouces (300 DPI)
  const masterJpgBuffer = fs.readFileSync(masterJpgPath);
  const pdfBuffer = buildPdfFromJpegBuffer(masterJpgBuffer, WIDTH, HEIGHT);
  const pdfPath = path.join(EXPORT_DIR, 'affiche-origine-univers-illustree-impression-20x30.pdf');
  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log(`✅ PDF d'impression 20x30 généré : ${pdfPath} (${(pdfBuffer.length / (1024 * 1024)).toFixed(2)} Mo)`);

  // 7. Génération de l'aperçu écran (1600 × 2400)
  const previewPath = path.join(EXPORT_DIR, 'affiche-origine-univers-illustree-apercu.jpg');
  await sharp(masterJpgBuffer)
    .resize(1600, 2400, { fit: 'inside' })
    .jpeg({ quality: 90 })
    .toFile(previewPath);
  console.log(`✅ Aperçu écran généré : ${previewPath} (${(fs.statSync(previewPath).size / 1024).toFixed(1)} Ko)`);

  // 8. Copie dans les artéfacts
  const artifactPreviewPath = path.join(ARTIFACT_DIR, 'poster_origine_univers_illustre.jpg');
  fs.copyFileSync(previewPath, artifactPreviewPath);
  console.log(`✅ Aperçu copié dans les artéfacts : ${artifactPreviewPath}`);

  // 9. Copie directe sur le Bureau de l'utilisateur
  if (fs.existsSync(DESKTOP_DIR)) {
    fs.copyFileSync(pdfPath, path.join(DESKTOP_DIR, 'affiche-origine-univers-illustree-impression-20x30.pdf'));
    fs.copyFileSync(masterJpgPath, path.join(DESKTOP_DIR, 'affiche-origine-univers-illustree-master-hd.jpg'));
    fs.copyFileSync(previewPath, path.join(DESKTOP_DIR, 'affiche-origine-univers-illustree-apercu.jpg'));
    console.log(`✅ Fichiers copiés avec succès sur le Bureau : ${DESKTOP_DIR}`);
  }

  return { masterJpgPath, pdfPath, previewPath };
}

buildIllustratedPoster().catch(err => {
  console.error('Erreur critique :', err);
  process.exit(1);
});
