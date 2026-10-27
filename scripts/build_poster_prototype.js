const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const FONTS_DIR = path.join(ROOT_DIR, 'assets', 'fonts');
const EXPORT_DIR = path.join(ROOT_DIR, 'exports', 'affiches-hd');
const BG_IMAGE_PATH = 'C:/Users/jym12/.gemini/antigravity-ide/brain/13153017-adef-4a59-8e9d-b3be2646daff/fond_entropie_cosmos_1792990069355.jpg';
const LOGO_PATH = path.join(ROOT_DIR, 'assets', 'images', 'logo-embleme-180.png');
const ARTIFACT_DIR = 'C:/Users/jym12/.gemini/antigravity-ide/brain/13153017-adef-4a59-8e9d-b3be2646daff';

// Dimensions 20 × 30 pouces (Ratio 2:3) en Ultra-HD
const POSTER_WIDTH = 4000;
const POSTER_HEIGHT = 6000;

function getFontBase64(fontName) {
  const fontPath = path.join(FONTS_DIR, fontName);
  if (fs.existsSync(fontPath)) {
    return fs.readFileSync(fontPath).toString('base64');
  }
  return null;
}

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Générateur de PDF 1.4 pur prêt à l'impression grand format 20 × 30 pouces
function buildPdfFromJpegBuffer(jpegBuffer, width, height) {
  // 20 x 30 pouces en points typographiques (1 pouce = 72 points)
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

async function generatePoster() {
  console.log('🚀 Démarrage de la génération de l\'affiche prototype Entropie & Intelligent Design...');

  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
  }

  // 1. Logo emblème officiel
  let logoBase64 = '';
  if (fs.existsSync(LOGO_PATH)) {
    logoBase64 = `data:image/png;base64,${fs.readFileSync(LOGO_PATH).toString('base64')}`;
  }

  const titleFont = "'Cinzel', Georgia, 'Times New Roman', serif";
  const bodyFont = "'Montserrat', 'Segoe UI', Arial, sans-serif";

  // Construction du SVG Ultra-HD
  const svgOverlay = `
  <svg width="${POSTER_WIDTH}" height="${POSTER_HEIGHT}" viewBox="0 0 ${POSTER_WIDTH} ${POSTER_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        .cinzel-title {
          font-family: ${titleFont};
          font-weight: 700;
          fill: #F3D9A4;
          letter-spacing: 5px;
        }

        .cinzel-heading {
          font-family: ${titleFont};
          font-weight: 700;
          fill: #F3D9A4;
          letter-spacing: 3px;
        }

        .montserrat-lead {
          font-family: ${bodyFont};
          font-style: italic;
          font-size: 38px;
          line-height: 1.6;
          fill: #FFF4DC;
          text-anchor: middle;
        }

        .card-title {
          font-family: ${titleFont};
          font-weight: 700;
          font-size: 42px;
          fill: #F3D9A4;
          letter-spacing: 2px;
        }

        .card-sub {
          font-family: ${bodyFont};
          font-weight: 600;
          font-style: italic;
          font-size: 26px;
          fill: #D9A55B;
          letter-spacing: 1px;
        }

        .body-bold {
          font-family: ${bodyFont};
          font-weight: 700;
          font-size: 27px;
          fill: #F3D9A4;
        }

        .body-regular {
          font-family: ${bodyFont};
          font-weight: 400;
          font-size: 27px;
          fill: #E2E8F0;
          line-height: 1.55;
        }

        .conviction-title {
          font-family: ${titleFont};
          font-weight: 700;
          font-size: 40px;
          fill: #FFF4DC;
          letter-spacing: 3px;
          text-anchor: middle;
        }

        .conviction-body {
          font-family: ${bodyFont};
          font-weight: 500;
          font-style: italic;
          font-size: 27px;
          line-height: 1.6;
          fill: #FFF4DC;
        }
      </style>

      <!-- Gradients -->
      <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#8A5A2B" stop-opacity="0"/>
        <stop offset="25%" stop-color="#D9A55B" stop-opacity="0.9"/>
        <stop offset="50%" stop-color="#FFF4DC" stop-opacity="1"/>
        <stop offset="75%" stop-color="#D9A55B" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#8A5A2B" stop-opacity="0"/>
      </linearGradient>

      <linearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#081832" stop-opacity="0.90"/>
        <stop offset="100%" stop-color="#040C1A" stop-opacity="0.95"/>
      </linearGradient>

      <linearGradient id="convictionBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0c2347" stop-opacity="0.94"/>
        <stop offset="50%" stop-color="#081832" stop-opacity="0.96"/>
        <stop offset="100%" stop-color="#141c10" stop-opacity="0.92"/>
      </linearGradient>

      <linearGradient id="topVignette" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#040A14" stop-opacity="0.95"/>
        <stop offset="65%" stop-color="#040A14" stop-opacity="0.80"/>
        <stop offset="100%" stop-color="#040A14" stop-opacity="0.0"/>
      </linearGradient>

      <linearGradient id="bottomVignette" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#040A14" stop-opacity="0.0"/>
        <stop offset="35%" stop-color="#040A14" stop-opacity="0.82"/>
        <stop offset="100%" stop-color="#040A14" stop-opacity="0.98"/>
      </linearGradient>

      <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFF4DC" stop-opacity="0.25"/>
        <stop offset="60%" stop-color="#D9A55B" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#081832" stop-opacity="0.0"/>
      </radialGradient>
    </defs>



    <!-- 2. VIGNETTES D'ASSOMBRISSEMENT POUR LA LISIBILITÉ -->
    <rect x="0" y="0" width="${POSTER_WIDTH}" height="1400" fill="url(#topVignette)"/>
    <rect x="0" y="3600" width="${POSTER_WIDTH}" height="2400" fill="url(#bottomVignette)"/>

    <!-- 3. CADRE & BORDURES D'ART GÉOMÉTRIQUES -->
    <rect x="90" y="90" width="${POSTER_WIDTH - 180}" height="${POSTER_HEIGHT - 180}" rx="30" fill="none" stroke="#D9A55B" stroke-width="4" opacity="0.8"/>
    <rect x="120" y="120" width="${POSTER_WIDTH - 240}" height="${POSTER_HEIGHT - 240}" rx="20" fill="none" stroke="#8A5A2B" stroke-width="2" opacity="0.5" stroke-dasharray="24 14"/>

    <!-- Coins ouvragés géométriques -->
    <g stroke="#D9A55B" stroke-width="3.5" opacity="0.85">
      <!-- Haut Gauche -->
      <line x1="70" y1="200" x2="200" y2="200"/>
      <line x1="200" y1="70" x2="200" y2="200"/>
      <circle cx="200" cy="200" r="8" fill="#FFF4DC"/>
      <!-- Haut Droite -->
      <line x1="${POSTER_WIDTH - 200}" y1="200" x2="${POSTER_WIDTH - 70}" y2="200"/>
      <line x1="${POSTER_WIDTH - 200}" y1="70" x2="${POSTER_WIDTH - 200}" y2="200"/>
      <circle cx="${POSTER_WIDTH - 200}" cy="200" r="8" fill="#FFF4DC"/>
      <!-- Bas Gauche -->
      <line x1="70" y1="${POSTER_HEIGHT - 200}" x2="200" y2="${POSTER_HEIGHT - 200}"/>
      <line x1="200" y1="${POSTER_HEIGHT - 200}" x2="200" y2="${POSTER_HEIGHT - 70}"/>
      <circle cx="200" cy="${POSTER_HEIGHT - 200}" r="8" fill="#FFF4DC"/>
      <!-- Bas Droite -->
      <line x1="${POSTER_WIDTH - 200}" y1="${POSTER_HEIGHT - 200}" x2="${POSTER_WIDTH - 70}" y2="${POSTER_HEIGHT - 200}"/>
      <line x1="${POSTER_WIDTH - 200}" y1="${POSTER_HEIGHT - 200}" x2="${POSTER_WIDTH - 200}" y2="${POSTER_HEIGHT - 70}"/>
      <circle cx="${POSTER_WIDTH - 200}" cy="${POSTER_HEIGHT - 200}" r="8" fill="#FFF4DC"/>
    </g>

    <!-- ======================================================================
         EN-TÊTE : LOGO, TITRE ET CHAPEAU
         ====================================================================== -->
    <g transform="translate(2000, 240)">
      ${logoBase64 ? `<image href="${logoBase64}" x="-65" y="0" width="130" height="130"/>` : ''}
      <circle cx="0" cy="65" r="75" fill="none" stroke="#D9A55B" stroke-width="2.5" opacity="0.6"/>
      <circle cx="0" cy="65" r="85" fill="none" stroke="#8A5A2B" stroke-width="1.5" stroke-dasharray="10 8" opacity="0.4"/>
    </g>

    <text x="2000" y="460" text-anchor="middle" font-family="${titleFont}" font-size="28" font-weight="700" fill="#D9A55B" letter-spacing="14" opacity="0.95">
      LE GRAND GÉNIE DE LA CRÉATION  •  ENQUÊTE SCIENTIFIQUE &amp; COSMOLOGIE
    </text>

    <!-- Titre Principal -->
    <text x="2000" y="580" text-anchor="middle" class="cinzel-title" font-size="88">L&#39;ENTROPIE ET LE DÉPART</text>
    <text x="2000" y="685" text-anchor="middle" class="cinzel-title" font-size="88">EXTRAORDINAIRE DE L&#39;UNIVERS</text>

    <!-- Ligne de séparation Or sous le titre -->
    <line x1="1000" y1="735" x2="3000" y2="735" stroke="url(#goldGradient)" stroke-width="3"/>
    <polygon points="2000,727 2008,735 2000,743 1992,735" fill="#FFF4DC"/>

    <!-- Chapeau officiel de Jean-Yves -->
    <g transform="translate(2000, 810)">
      <text x="0" y="0" class="montserrat-lead">
        <tspan x="0" dy="0">« Pourquoi le temps avance-t-il toujours dans le même sens ? Et à quel point l&#39;Univers a-t-il dû</tspan>
        <tspan x="0" dy="55">commencer de façon particulière pour mener jusqu&#39;à nous ? Roger Penrose a tenté de le mesurer.</tspan>
        <tspan x="0" dy="55" fill="#D9A55B" font-weight="700">Le résultat donne le vertige. »</tspan>
      </text>
    </g>

    <line x1="1400" y1="970" x2="2600" y2="970" stroke="url(#goldGradient)" stroke-width="2" opacity="0.7"/>

    <!-- ======================================================================
         SECTION INFOGRAPHIQUE SUPÉRIEURE : 2 BLOCS
         ====================================================================== -->
    
    <!-- CARTE 1 : L'entropie et la flèche du temps (x: 220 à 1930) -->
    <g transform="translate(220, 1020)">
      <rect x="0" y="0" width="1710" height="730" rx="22" fill="url(#cardBg)" stroke="#D9A55B" stroke-width="2.5" opacity="0.95"/>
      <!-- Filet doré intérieur -->
      <rect x="14" y="14" width="1682" height="702" rx="14" fill="none" stroke="#8A5A2B" stroke-width="1.2" opacity="0.4"/>

      <!-- En-tête de carte -->
      <circle cx="55" cy="65" r="14" fill="#D9A55B"/>
      <text x="55" y="73" text-anchor="middle" font-family="${titleFont}" font-size="20" font-weight="700" fill="#081832">1</text>
      <text x="95" y="72" class="card-title">L&#39;ENTROPIE &amp; LA FLÈCHE DU TEMPS</text>
      <text x="95" y="112" class="card-sub">L&#39;asymétrie fondamentale entre le passé et le futur</text>
      <line x1="40" y1="135" x2="1670" y2="135" stroke="url(#goldGradient)" stroke-width="1.5" opacity="0.5"/>

      <!-- Points détaillés du script -->
      <g transform="translate(50, 180)">
        <circle cx="10" cy="-6" r="6" fill="#D9A55B"/>
        <text x="35" y="0">
          <tspan class="body-bold">Mesure de l&#39;organisation : </tspan>
          <tspan class="body-regular">L&#39;entropie ne décrit pas seulement le désordre quotidien. En physique,</tspan>
        </text>
        <text x="35" y="42" class="body-regular">elle mesure précisément le nombre de façons dont la matière et l&#39;énergie peuvent s&#39;organiser.</text>
        <text x="35" y="84" class="body-regular">Plus le nombre de configurations possibles est élevé, plus l&#39;entropie d&#39;un système est grande.</text>
      </g>

      <g transform="translate(50, 340)">
        <circle cx="10" cy="-6" r="6" fill="#D9A55B"/>
        <text x="35" y="0">
          <tspan class="body-bold">Le second principe de la thermodynamique : </tspan>
          <tspan class="body-regular">L&#39;entropie possède une propriété immuable :</tspan>
        </text>
        <text x="35" y="42" class="body-regular">dans tout système isolé, elle augmente spontanément et sans cesse. C&#39;est ce phénomène physique</text>
        <text x="35" y="84" class="body-regular">universel qui impose une direction unique et irréversible à l&#39;écoulement du temps.</text>
      </g>

      <g transform="translate(50, 500)">
        <circle cx="10" cy="-6" r="6" fill="#D9A55B"/>
        <text x="35" y="0">
          <tspan class="body-bold">L&#39;irréversibilité du réel : </tspan>
          <tspan class="body-regular">Un verre peut tomber d&#39;une table et se briser en mille morceaux.</tspan>
        </text>
        <text x="35" y="42" class="body-regular">Pourtant, personne n&#39;a jamais observé ces débris se rassembler spontanément pour reformer</text>
        <text x="35" y="84" class="body-regular">le verre intact et remonter sur la table. Le passé et le futur ne sont pas interchangeables.</text>
      </g>
    </g>

    <!-- CARTE 2 : Un début hautement ordonné (x: 2070 à 3780) -->
    <g transform="translate(2070, 1020)">
      <rect x="0" y="0" width="1710" height="730" rx="22" fill="url(#cardBg)" stroke="#D9A55B" stroke-width="2.5" opacity="0.95"/>
      <rect x="14" y="14" width="1682" height="702" rx="14" fill="none" stroke="#8A5A2B" stroke-width="1.2" opacity="0.4"/>

      <!-- En-tête de carte -->
      <circle cx="55" cy="65" r="14" fill="#D9A55B"/>
      <text x="55" y="73" text-anchor="middle" font-family="${titleFont}" font-size="20" font-weight="700" fill="#081832">2</text>
      <text x="95" y="72" class="card-title">UN DÉBUT TRÈS PARTICULIER</text>
      <text x="95" y="112" class="card-sub">L&#39;homogénéité initiale : un état hautement ordonné pour la gravité</text>
      <line x1="40" y1="135" x2="1670" y2="135" stroke="url(#goldGradient)" stroke-width="1.5" opacity="0.5"/>

      <!-- Points détaillés du script -->
      <g transform="translate(50, 180)">
        <circle cx="10" cy="-6" r="6" fill="#D9A55B"/>
        <text x="35" y="0">
          <tspan class="body-bold">L&#39;inversion thermodynamique : </tspan>
          <tspan class="body-regular">Si l&#39;entropie augmente sans discontinuer depuis l&#39;origine,</tspan>
        </text>
        <text x="35" y="42" class="body-regular">la logique déductive impose qu&#39;elle devait être extraordinairement basse au commencement.</text>
        <text x="35" y="84" class="body-regular">L&#39;Univers primitif était incandescent et dense, mais doté d&#39;une géométrie inattendue.</text>
      </g>

      <g transform="translate(50, 340)">
        <circle cx="10" cy="-6" r="6" fill="#D9A55B"/>
        <text x="35" y="0">
          <tspan class="body-bold">Le paradoxe de la gravité : </tspan>
          <tspan class="body-regular">La matière primordiale y était répartie de façon presque parfaitement</tspan>
        </text>
        <text x="35" y="42" class="body-regular">uniforme. Or, du point de vue gravitationnel, une telle uniformité représente un état hautement</text>
        <text x="35" y="84" class="body-regular">improbable et extrêmement ordonné, situé à l&#39;opposé absolu du chaos spontané.</text>
      </g>

      <g transform="translate(50, 500)">
        <circle cx="10" cy="-6" r="6" fill="#D9A55B"/>
        <text x="35" y="0">
          <tspan class="body-bold">La condition préalable à la vie : </tspan>
          <tspan class="body-regular">C&#39;est précisément cette configuration de départ millimétrée</tspan>
        </text>
        <text x="35" y="42" class="body-regular">qui a permis à la gravitation d&#39;agréger peu à peu la matière pour façonner les premières étoiles,</text>
        <text x="35" y="84" class="body-regular">les galaxies, les systèmes planétaires équilibrés et, ultimement, de rendre la vie possible.</text>
      </g>
    </g>

    <!-- ======================================================================
         SECTION CENTRALE : LE CALCUL VERTIGINEUX DE ROGER PENROSE
         (Flottant en bas du nexus cosmique)
         ====================================================================== -->
    <g transform="translate(2000, 3420)">
      <!-- Fond or / marine prestigieux pour le chiffre clé -->
      <rect x="-1800" y="-190" width="3600" height="380" rx="26" fill="#061224" stroke="#D9A55B" stroke-width="3" opacity="0.96"/>
      <rect x="-1782" y="-172" width="3564" height="344" rx="18" fill="none" stroke="#FFF4DC" stroke-width="1.2" opacity="0.35"/>

      <!-- Sur-titre Penrose -->
      <text x="0" y="-120" text-anchor="middle" font-family="${titleFont}" font-size="28" font-weight="700" fill="#D9A55B" letter-spacing="8">
        ✦ LE CALCUL DE PROBABILITÉ DE SIR ROGER PENROSE (PRIX NOBEL DE PHYSIQUE 2020) ✦
      </text>

      <!-- Monumental Number : 1 chance sur 10^(10^123) -->
      <g transform="translate(0, -20)">
        <text text-anchor="middle" font-family="${titleFont}" font-weight="700" fill="#FFF4DC">
          <tspan font-size="80">1 CHANCE SUR 10</tspan>
          <tspan font-size="52" dy="-35" fill="#F3D9A4">10</tspan>
          <tspan font-size="34" dy="-25" fill="#D9A55B">123</tspan>
        </text>
      </g>

      <!-- Explication scientifique rigoureuse tirée du script -->
      <text x="0" y="85" text-anchor="middle" font-family="${bodyFont}" font-size="26" font-weight="500" fill="#E2E8F0">
        <tspan x="0" dy="0">Parmi un nombre inconcevable de façons possibles de démarrer un univers, une infime fraction seulement mène à un cosmos structuré.</tspan>
        <tspan x="0" dy="42">Ce chiffre défie toute imagination : écrire seulement tous ses zéros nécessiterait plus d&#39;encre qu&#39;il n&#39;y a d&#39;atomes dans tout l&#39;univers observable (~10⁸⁰ atomes).</tspan>
      </text>
    </g>

    <!-- ======================================================================
         SECTION INFOGRAPHIQUE INFÉRIEURE : JAMES WEBB & INTELLIGENT DESIGN
         ====================================================================== -->

    <!-- CARTE 3 : L'analogie du James Webb (x: 220 à 1930, y: 3850) -->
    <g transform="translate(220, 3850)">
      <rect x="0" y="0" width="1710" height="1520" rx="24" fill="url(#cardBg)" stroke="#D9A55B" stroke-width="2.5" opacity="0.95"/>
      <rect x="14" y="14" width="1682" height="1492" rx="16" fill="none" stroke="#8A5A2B" stroke-width="1.2" opacity="0.4"/>

      <!-- En-tête -->
      <circle cx="55" cy="65" r="14" fill="#D9A55B"/>
      <text x="55" y="73" text-anchor="middle" font-family="${titleFont}" font-size="20" font-weight="700" fill="#081832">3</text>
      <text x="95" y="72" class="card-title">CE QUE NOUS APPREND JAMES WEBB</text>
      <text x="95" y="112" class="card-sub">L&#39;exigence absolue d&#39;une configuration initiale programmée</text>
      <line x1="40" y1="135" x2="1670" y2="135" stroke="url(#goldGradient)" stroke-width="1.5" opacity="0.5"/>

      <!-- Paragraphes explicatifs fidèles au texte -->
      <g transform="translate(50, 185)">
        <text x="0" y="0" class="body-regular">
          <tspan x="0" dy="0">Prenons un exemple technologique concret. Le télescope spatial James Webb</tspan>
          <tspan x="0" dy="44">était beaucoup trop volumineux pour être lancé déployé. Les ingénieurs ont dû</tspan>
          <tspan x="0" dy="44">le plier entièrement : son miroir géant en béryllium doré, son immense pare-soleil</tspan>
          <tspan x="0" dy="44">de la taille d&#39;un court de tennis, ses liaisons électroniques et ses instruments.</tspan>
        </text>
      </g>

      <!-- Boîte métrique 344 points de défaillance -->
      <g transform="translate(50, 410)">
        <rect x="0" y="0" width="1610" height="300" rx="16" fill="#0a1a33" stroke="#D9A55B" stroke-width="1.8"/>
        <text x="80" y="75" font-family="${titleFont}" font-size="56" font-weight="700" fill="#FFF4DC">344</text>
        <text x="210" y="55" font-family="${titleFont}" font-size="28" font-weight="700" fill="#F3D9A4">POINTS DE DÉFAILLANCE UNIQUE IDENTIFIÉS PAR LA NASA</text>
        <text x="210" y="92" class="card-sub">Une séquence chirurgicale sans aucune possibilité de réparation humaine</text>
        <text x="40" y="150" class="body-regular">
          <tspan x="40" dy="0">Une fois positionné à 1,5 million de kilomètres de la Terre au point de Lagrange L2,</tspan>
          <tspan x="40" dy="42">tout devait se déployer dans un ordre mathématiquement rigoureux. Un seul grippage,</tspan>
          <tspan x="40" dy="42">un seul câble bloqué, et l&#39;intégralité de la mission spatiale était anéantie.</tspan>
        </text>
      </g>

      <g transform="translate(50, 770)">
        <text x="0" y="0" class="body-regular">
          <tspan x="0" dy="0">Pendant des années, les équipes d&#39;ingénieurs ont calculé, simulé et testé chaque</tspan>
          <tspan x="0" dy="44">scénario. Ils savaient avec certitude qu&#39;une configuration de départ précise était</tspan>
          <tspan x="0" dy="44">strictement indispensable pour obtenir le fonctionnement final attendu.</tspan>
        </text>
      </g>

      <!-- Encadré déductif -->
      <g transform="translate(50, 950)">
        <rect x="0" y="0" width="1610" height="240" rx="16" fill="#040b17" stroke="#8A5A2B" stroke-width="1.5" stroke-dasharray="12 8"/>
        <text x="50" y="60" font-family="${titleFont}" font-size="30" font-weight="700" fill="#F3D9A4">✦ LA RECONNAISSANCE IMMÉDIATE DU DESIGN ✦</text>
        <text x="50" y="115" class="body-regular">
          <tspan x="50" dy="0">Devant la complexité et la réussite du télescope James Webb,</tspan>
          <tspan x="50" dy="42">aucun observateur rationnel ne doute un seul instant qu&#39;une intelligence l&#39;a conçu,</tspan>
          <tspan x="50" dy="42">avec une intention lucide et un objectif précisément défini.</tspan>
        </text>
      </g>

      <g transform="translate(50, 1260)">
        <text x="0" y="0" class="body-regular">
          <tspan x="0" dy="0">Si l&#39;agencement d&#39;une machine technologique humaine impose l&#39;évidence d&#39;un concepteur,</tspan>
          <tspan x="0" dy="44">que devons-nous raisonnablement déduire de l&#39;état initial de tout l&#39;Univers,</tspan>
          <tspan x="0" dy="44">réglé à 1 chance sur 10¹⁰¹²³ pour permettre l&#39;apparition de la vie ?</tspan>
        </text>
      </g>
    </g>

    <!-- CARTE 4 : MA CONVICTION POUR L'INTELLIGENT DESIGN (x: 2070 à 3780, y: 3850) -->
    <g transform="translate(2070, 3850)">
      <rect x="0" y="0" width="1710" height="1520" rx="24" fill="url(#convictionBg)" stroke="#D9A55B" stroke-width="3.5" opacity="0.98"/>
      <rect x="16" y="16" width="1678" height="1488" rx="16" fill="none" stroke="#FFF4DC" stroke-width="1.5" opacity="0.4"/>

      <!-- Ornement supérieur -->
      <g transform="translate(855, 65)">
        <polygon points="0,-15 15,0 0,15 -15,0" fill="#FFF4DC"/>
        <line x1="-300" y1="0" x2="-35" y2="0" stroke="url(#goldGradient)" stroke-width="2"/>
        <line x1="35" y1="0" x2="300" y2="0" stroke="url(#goldGradient)" stroke-width="2"/>
      </g>

      <!-- Titre solennel -->
      <text x="855" y="130" class="conviction-title">MA CONVICTION PERSONNELLE :</text>
      <text x="855" y="185" class="conviction-title" fill="#D9A55B">LE DESSEIN INTELLIGENT (INTELLIGENT DESIGN)</text>
      <line x1="150" y1="215" x2="1560" y2="215" stroke="url(#goldGradient)" stroke-width="2" opacity="0.7"/>

      <!-- Texte intégral de la conviction de Jean-Yves -->
      <g transform="translate(80, 260)">
        <!-- Paragraphe 1 -->
        <text x="0" y="35" class="conviction-body">
          <tspan x="0" dy="0">« Je ne prétends pas que le télescope James Webb prouve</tspan>
          <tspan x="0" dy="48">scientifiquement l&#39;existence de Dieu. Je partage ici ma conviction</tspan>
          <tspan x="0" dy="48">personnelle, nourrie par l&#39;examen attentif des lois de la nature.</tspan>
        </text>

        <!-- Paragraphe 2 -->
        <text x="0" y="215" class="conviction-body">
          <tspan x="0" dy="0">Quand je regarde l&#39;état initial extraordinairement précis de l&#39;Univers,</tspan>
          <tspan x="0" dy="48">suivi de lois physiques fondamentales qui le mènent avec une telle</tspan>
          <tspan x="0" dy="48">justesse jusqu&#39;à la matière complexe, aux étoiles stables, aux éléments</tspan>
          <tspan x="0" dy="48">chimiques et à l&#39;éclosion de la vie, j&#39;y vois la marque indéniable</tspan>
          <tspan x="0" dy="48" fill="#FFF4DC">d&#39;une conception intelligente.</tspan>
        </text>

        <!-- Paragraphe 3 -->
        <text x="0" y="495" class="conviction-body">
          <tspan x="0" dy="0">Si nous reconnaissons tous sans hésiter l&#39;intelligence des ingénieurs</tspan>
          <tspan x="0" dy="48">derrière les 344 mécanismes de James Webb, pourquoi refuser d&#39;envisager</tspan>
          <tspan x="0" dy="48" fill="#F3D9A4">une intelligence immensément supérieure derrière les conditions</tspan>
          <tspan x="0" dy="48">initiales et les constantes cosmiques de notre Univers ? »</tspan>
        </text>

        <!-- Point d'orgue -->
        <g transform="translate(0, 730)">
          <rect x="-20" y="0" width="1590" height="200" rx="14" fill="#040a14" stroke="#D9A55B" stroke-width="2"/>
          <text x="775" y="70" text-anchor="middle" font-family="${titleFont}" font-size="34" font-weight="700" fill="#FFF4DC">
            « Pour moi, cette intelligence suprême, c&#39;est le Créateur :
          </text>
          <text x="775" y="130" text-anchor="middle" font-family="${titleFont}" font-size="36" font-weight="700" fill="#D9A55B">
            LE GRAND GÉNIE DE LA CRÉATION. »
          </text>
        </g>
      </g>

      <!-- Signature Jean-Yves -->
      <g transform="translate(855, 1260)">
        <line x1="-350" y1="0" x2="350" y2="0" stroke="url(#goldGradient)" stroke-width="1.5" opacity="0.6"/>
        <text x="0" y="60" text-anchor="middle" font-family="${titleFont}" font-size="30" font-weight="700" fill="#F3D9A4">
          JEAN-YVES
        </text>
        <text x="0" y="105" text-anchor="middle" font-family="${bodyFont}" font-size="22" font-weight="500" fill="#D9A55B" letter-spacing="3">
          Auteur &amp; Présentateur de « Le Grand Génie de la Création »
        </text>
      </g>
    </g>

    <!-- ======================================================================
         PIED DE PAGE (FOOTER)
         ====================================================================== -->
    <g transform="translate(2000, 5600)">
      <line x1="-1600" y1="0" x2="1600" y2="0" stroke="url(#goldGradient)" stroke-width="3" opacity="0.85"/>
      <circle cx="0" cy="0" r="9" fill="#FFF4DC"/>
      <circle cx="-1600" cy="0" r="5" fill="#D9A55B"/>
      <circle cx="1600" cy="0" r="5" fill="#D9A55B"/>

      <text x="0" y="80" text-anchor="middle" font-family="${titleFont}" font-size="44" font-weight="700" fill="#F3D9A4" letter-spacing="8">
        LE GRAND GÉNIE DE LA CRÉATION
      </text>

      <text x="0" y="140" text-anchor="middle" font-family="${bodyFont}" font-size="26" font-weight="600" fill="#D9A55B" letter-spacing="6">
        grandcreateur.com  •  DOCUMENT D&#39;ART ET D&#39;ÉTUDE GRAND FORMAT  •  ÉDITION HAUTE DÉFINITION (300 DPI)
      </text>
    </g>
  </svg>
  `;

  // 4. Génération de l'image Master Ultra-HD (4000 × 6000 px) par composition native
  const masterJpgPath = path.join(EXPORT_DIR, 'affiche-entropie-intelligent-design-master-hd.jpg');
  console.log(`🖼️ Rendu Sharp natif de l'affiche (${POSTER_WIDTH}x${POSTER_HEIGHT})...`);
  await sharp(BG_IMAGE_PATH)
    .resize(POSTER_WIDTH, POSTER_HEIGHT, { fit: 'cover', position: 'center' })
    .composite([
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0
      }
    ])
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(masterJpgPath);
  console.log(`✅ Master Ultra-HD généré : ${masterJpgPath} (${(fs.statSync(masterJpgPath).size / (1024 * 1024)).toFixed(2)} Mo)`);

  // 5. Génération du PDF haute résolution 20 × 30 pouces (300 DPI) prêt pour l'imprimerie
  const masterJpgBuffer = fs.readFileSync(masterJpgPath);
  const pdfBuffer = buildPdfFromJpegBuffer(masterJpgBuffer, POSTER_WIDTH, POSTER_HEIGHT);
  const pdfPath = path.join(EXPORT_DIR, 'affiche-entropie-intelligent-design-impression-20x30.pdf');
  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log(`✅ PDF d'impression 20x30 généré : ${pdfPath} (${(pdfBuffer.length / (1024 * 1024)).toFixed(2)} Mo)`);

  // 6. Génération d'un aperçu JPG optimisé pour écran (1600 × 2400)
  const previewPath = path.join(EXPORT_DIR, 'affiche-entropie-intelligent-design-apercu.jpg');
  await sharp(masterJpgBuffer)
    .resize(1600, 2400, { fit: 'inside' })
    .jpeg({ quality: 90 })
    .toFile(previewPath);
  console.log(`✅ Aperçu écran généré : ${previewPath} (${(fs.statSync(previewPath).size / 1024).toFixed(1)} Ko)`);

  // 7. Copie de l'aperçu dans le dossier artifacts pour affichage immédiat dans l'interface
  const artifactPreviewPath = path.join(ARTIFACT_DIR, 'poster_entropie_intelligent_design.jpg');
  fs.copyFileSync(previewPath, artifactPreviewPath);
  console.log(`✅ Aperçu copié dans les artéfacts : ${artifactPreviewPath}`);

  return {
    masterJpg: masterJpgPath,
    pdf: pdfPath,
    preview: previewPath,
    artifactPreview: artifactPreviewPath
  };
}

generatePoster().catch(err => {
  console.error('Erreur critique :', err);
  process.exit(1);
});
