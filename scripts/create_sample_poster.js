const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function makePoster() {
  const width = 1200;
  const height = 1600;

  const svgContent = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#040911"/>
        <stop offset="40%" stop-color="#081728"/>
        <stop offset="100%" stop-color="#03070d"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#f5c542"/>
        <stop offset="50%" stop-color="#ffd978"/>
        <stop offset="100%" stop-color="#d4af37"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f233a" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#0a1829" stop-opacity="0.95"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>

    <!-- Gold Outer Border -->
    <rect x="30" y="30" width="${width - 60}" height="${height - 60}" rx="16" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.7"/>
    <rect x="45" y="45" width="${width - 90}" height="${height - 90}" rx="12" fill="none" stroke="url(#goldGrad)" stroke-width="1" opacity="0.3" stroke-dasharray="10 5"/>

    <!-- Header / Brand -->
    <text x="600" y="115" text-anchor="middle" fill="url(#goldGrad)" font-family="Arial, sans-serif" font-weight="bold" font-size="22" letter-spacing="5">LE GRAND GENIE DE LA CREATION</text>
    <text x="600" y="170" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold" font-size="44" letter-spacing="1">LES 4 PILIERS DE LA SCIENCE</text>
    <text x="600" y="210" text-anchor="middle" fill="#94a3b8" font-family="Arial, sans-serif" font-size="18">La symphonie mathematique et biologique qui pointe vers un Createur</text>
    <line x1="450" y1="240" x2="750" y2="240" stroke="url(#goldGrad)" stroke-width="2" opacity="0.7"/>

    <!-- Pilier 1 : Cosmologie -->
    <g transform="translate(80, 280)">
      <rect width="490" height="490" rx="14" fill="url(#cardGrad)" stroke="#1e3a5f" stroke-width="2"/>
      <circle cx="60" cy="60" r="30" fill="#f5c542" fill-opacity="0.15" stroke="#f5c542" stroke-width="1.5"/>
      <text x="60" y="70" text-anchor="middle" fill="#f5c542" font-size="24">*</text>
      <text x="110" y="58" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold" font-size="26">1. COSMOLOGIE</text>
      <text x="110" y="82" fill="#f5c542" font-family="Arial, sans-serif" font-size="16" font-weight="bold">L'ajustement fin vertigineux</text>
      <text x="35" y="140" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• Entropie initiale de Penrose : 1 sur 10^(10^123)</text>
      <text x="35" y="180" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• Constante cosmologique reglee a 10^-120</text>
      <text x="35" y="220" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• Les 3 boucliers protecteurs de la Terre</text>
      <text x="35" y="260" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• Vitesse d'expansion equilibree au millieme</text>
      <rect x="30" y="310" width="430" height="145" rx="8" fill="#040a14" fill-opacity="0.8" stroke="#f5c542" stroke-width="0.5"/>
      <text x="45" y="350" fill="#f5c542" font-family="Arial, sans-serif" font-size="14" font-style="italic">"Pour produire un univers comme le notre,</text>
      <text x="45" y="375" fill="#f5c542" font-family="Arial, sans-serif" font-size="14" font-style="italic">le Createur a du viser 1 part pour 10^(10^123)."</text>
      <text x="45" y="415" fill="#94a3b8" font-family="Arial, sans-serif" font-size="13">— Sir Roger Penrose, Prix Nobel de Physique</text>
    </g>

    <!-- Pilier 2 : ADN & Vivant -->
    <g transform="translate(630, 280)">
      <rect width="490" height="490" rx="14" fill="url(#cardGrad)" stroke="#1e3a5f" stroke-width="2"/>
      <circle cx="60" cy="60" r="30" fill="#00e5ff" fill-opacity="0.15" stroke="#00e5ff" stroke-width="1.5"/>
      <text x="60" y="70" text-anchor="middle" fill="#00e5ff" font-size="24">#</text>
      <text x="110" y="58" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold" font-size="26">2. ADN &amp; LE VIVANT</text>
      <text x="110" y="82" fill="#00e5ff" font-family="Arial, sans-serif" font-size="16" font-weight="bold">L'information numerique cellulaire</text>
      <text x="35" y="140" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• 3,2 milliards de lettres chimiques ordonnees</text>
      <text x="35" y="180" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• Densite : 215 petaoctets par gramme</text>
      <text x="35" y="220" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• Machines d'auto-reparation en temps reel</text>
      <text x="35" y="260" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• Kinesine et moteurs rotatifs a 100 000 tr/min</text>
      <rect x="30" y="310" width="430" height="145" rx="8" fill="#040a14" fill-opacity="0.8" stroke="#00e5ff" stroke-width="0.5"/>
      <text x="45" y="350" fill="#00e5ff" font-family="Arial, sans-serif" font-size="14" font-style="italic">"L'ADN est comme un programme logiciel,</text>
      <text x="45" y="375" fill="#00e5ff" font-family="Arial, sans-serif" font-size="14" font-style="italic">mais infiniment plus complexe que nos codes."</text>
      <text x="45" y="415" fill="#94a3b8" font-family="Arial, sans-serif" font-size="13">— Bill Gates</text>
    </g>

    <!-- Pilier 3 : Physique -->
    <g transform="translate(80, 810)">
      <rect width="490" height="490" rx="14" fill="url(#cardGrad)" stroke="#1e3a5f" stroke-width="2"/>
      <circle cx="60" cy="60" r="30" fill="#f5c542" fill-opacity="0.15" stroke="#f5c542" stroke-width="1.5"/>
      <text x="60" y="70" text-anchor="middle" fill="#f5c542" font-size="24">~</text>
      <text x="110" y="58" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold" font-size="26">3. PHYSIQUE</text>
      <text x="110" y="82" fill="#f5c542" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Les lois &amp; constantes universelles</text>
      <text x="35" y="140" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• Detection des neutrinos &amp; l'invisible demontre</text>
      <text x="35" y="180" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• Constante de structure fine alpha = 1/137</text>
      <text x="35" y="220" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• Equilibre precis entre gravite et force forte</text>
      <text x="35" y="260" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• Symetries quantiques d'une beaute absolue</text>
      <rect x="30" y="310" width="430" height="145" rx="8" fill="#040a14" fill-opacity="0.8" stroke="#f5c542" stroke-width="0.5"/>
      <text x="45" y="350" fill="#f5c542" font-family="Arial, sans-serif" font-size="14" font-style="italic">"Au fond du verre des sciences naturelles,</text>
      <text x="45" y="375" fill="#f5c542" font-family="Arial, sans-serif" font-size="14" font-style="italic">Dieu vous attend."</text>
      <text x="45" y="415" fill="#94a3b8" font-family="Arial, sans-serif" font-size="13">— Werner Heisenberg, Prix Nobel de Physique</text>
    </g>

    <!-- Pilier 4 : Grands Scientifiques -->
    <g transform="translate(630, 810)">
      <rect width="490" height="490" rx="14" fill="url(#cardGrad)" stroke="#1e3a5f" stroke-width="2"/>
      <circle cx="60" cy="60" r="30" fill="#ffd978" fill-opacity="0.15" stroke="#ffd978" stroke-width="1.5"/>
      <text x="60" y="70" text-anchor="middle" fill="#ffd978" font-size="24">+</text>
      <text x="110" y="58" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold" font-size="26">4. LES SAVANTS</text>
      <text x="110" y="82" fill="#ffd978" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Les peres fondateurs de la science</text>
      <text x="35" y="140" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• Johannes Kepler : Penser les pensees de Dieu</text>
      <text x="35" y="180" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• Isaac Newton : L'ordre magnifique des orbites</text>
      <text x="35" y="220" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• James Clerk Maxwell : La lumiere et les ondes</text>
      <text x="35" y="260" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="17">• Louis Pasteur : La loi de la biogenese vivante</text>
      <rect x="30" y="310" width="430" height="145" rx="8" fill="#040a14" fill-opacity="0.8" stroke="#ffd978" stroke-width="0.5"/>
      <text x="45" y="350" fill="#ffd978" font-family="Arial, sans-serif" font-size="14" font-style="italic">"Cet arrangement si magnifique n'a pu etre</text>
      <text x="45" y="375" fill="#ffd978" font-family="Arial, sans-serif" font-size="14" font-style="italic">que le produit d'un Etre puissant et intelligent."</text>
      <text x="45" y="415" fill="#94a3b8" font-family="Arial, sans-serif" font-size="13">— Sir Isaac Newton, Principia Mathematica</text>
    </g>

    <!-- Footer of the Poster -->
    <text x="600" y="1380" text-anchor="middle" fill="#f8fafc" font-family="Arial, sans-serif" font-weight="bold" font-size="20">Affiche Infographique Officielle • Edition Limitee Haute Definition</text>
    <text x="600" y="1415" text-anchor="middle" fill="#f5c542" font-family="Arial, sans-serif" font-size="16">Presente par Jean-Yves • Chaine YouTube : @immensegeniedanslunivers</text>
    <text x="600" y="1445" text-anchor="middle" fill="#64748b" font-family="Arial, sans-serif" font-size="14">https://legrandgeniedelacreation.com • Droits d'impression et d'affichage educatif autorises</text>
  </svg>
  `;

  const destPreview = path.join(__dirname, '..', 'public', 'affiches', 'affiche-4-piliers-preview.jpg');
  await sharp(Buffer.from(svgContent))
    .jpeg({ quality: 90 })
    .toFile(destPreview);

  console.log('✅ Apercu JPG genere avec succes :', destPreview);

  // Generer egalement une version WebP pour la rapidite du web
  const destWebp = path.join(__dirname, '..', 'public', 'affiches', 'affiche-4-piliers-preview.webp');
  await sharp(Buffer.from(svgContent))
    .webp({ quality: 85 })
    .toFile(destWebp);

  console.log('✅ Apercu WebP genere avec succes :', destWebp);

  // Generateur d'un PDF-1.4 valide encapsulant l'image haute definition
  const jpegBuffer = fs.readFileSync(destPreview);
  const pdfPath = path.join(__dirname, '..', 'public', 'affiches', 'affiche-4-piliers-haute-definition.pdf');
  
  // Format PDF standard encapsulant le flux JPEG en pleine page
  const ptWidth = 595; // A4 standard width
  const ptHeight = 842; // A4 standard height

  const pdfParts = [];
  pdfParts.push('%PDF-1.4\n');

  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ptWidth} ${ptHeight}] /Contents 4 0 R /Resources << /XObject << /Im1 5 0 R >> >> >>\nendobj\n`;
  const streamContent = `q\n${ptWidth} 0 0 ${ptHeight} 0 0 cm\n/Im1 Do\nQ\n`;
  const obj4 = `4 0 obj\n<< /Length ${Buffer.byteLength(streamContent)} >>\nstream\n${streamContent}endstream\nendobj\n`;
  
  const obj5Header = `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBuffer.length} >>\nstream\n`;
  const obj5Footer = '\nendstream\nendobj\n';

  // Assemblage du fichier PDF binaire
  const b1 = Buffer.from(pdfParts[0] + obj1 + obj2 + obj3 + obj4 + obj5Header, 'binary');
  const b2 = jpegBuffer;
  const b3 = Buffer.from(obj5Footer, 'binary');

  // Table des offsets (xref)
  const offset1 = pdfParts[0].length;
  const offset2 = offset1 + obj1.length;
  const offset3 = offset2 + obj2.length;
  const offset4 = offset3 + obj3.length;
  const offset5 = offset4 + obj4.length;
  const xrefOffset = b1.length + b2.length + b3.length;

  const pad = n => String(n).padStart(10, '0');
  const xref = `xref\n0 6\n0000000000 65535 f \n${pad(offset1)} 00000 n \n${pad(offset2)} 00000 n \n${pad(offset3)} 00000 n \n${pad(offset4)} 00000 n \n${pad(offset5)} 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  const b4 = Buffer.from(xref, 'binary');

  const fullPdf = Buffer.concat([b1, b2, b3, b4]);
  fs.writeFileSync(pdfPath, fullPdf);
  console.log('✅ Fichier PDF officiel genere avec succes :', pdfPath, `(${fullPdf.length} octets)`);
}

makePoster().catch(err => {
  console.error('Erreur :', err);
  process.exit(1);
});
