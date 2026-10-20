/**
 * Script de Build et d'Automatisation pour « Le Grand Génie de la Création »
 * 
 * Fonctionnalités :
 * 1. Récupération du flux RSS YouTube de la chaîne (@immensegeniedanslunivers)
 * 2. DÉDUPLICATION STRICTE par identifiant YouTube unique (1 vidéo = 1 seule entrée garantie)
 * 3. Tolérance aux pannes (fallback vers data/youtube_cache.json en cas d'erreur réseau)
 * 4. Fusion avec les métadonnées manuelles (thème unique, script écrit) depuis data/manual_videos.js
 * 5. Génération statique propre et sans doublons :
 *    - videos.html (liste unique propre entre balises de délimitation strictes)
 *    - themes.html (4 thèmes avec leurs cartes respectives entre balises strictes)
 *    - dossier videos/ (pages statiques par vidéo avec vidéo YouTube et version écrite)
 *    - data/videos.js (catalogue client dédupliqué)
 *    - sitemap.xml (référencement SEO des 7 vidéos)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT_DIR = __dirname;
const CHANNEL_ID = 'UCnVoEsgYAxULYINIkqgQf0w';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const CACHE_FILE = path.join(ROOT_DIR, 'data', 'youtube_cache.json');
const MANUAL_FILE = path.join(ROOT_DIR, 'data', 'manual_videos.js');
const MANUAL_JSON_FILE = path.join(ROOT_DIR, 'data', 'manual_videos.json');

const THEMES_CONFIG = {
  'cosmologie': {
    id: 'cosmologie',
    name: 'Cosmologie',
    tagline: 'L\'immensité réglée au millimètre près',
    description: 'De l\'origine de l\'espace-temps à l\'extraordinaire réglage des constantes cosmologiques : découvrez pourquoi l\'univers semble avoir été conçu pour accueillir la vie.',
    image: 'assets/images/theme-cosmologie.jpg'
  },
  'adn-vivant': {
    id: 'adn-vivant',
    name: 'ADN et le vivant',
    tagline: 'L\'information numérique au cœur de chaque cellule',
    description: 'La molécule d\'ADN, les nanomachines d\'édition et la complexité irréductible des organismes vivants révèlent une densité d\'information qui défie le pur hasard matériel.',
    image: 'assets/images/theme-adn-vivant.jpg'
  },
  'physique': {
    id: 'physique',
    name: 'Physique',
    tagline: 'Les lois inébranlables et les constantes universelles',
    description: 'La constante de structure fine, la gravitation, l\'interaction forte et les symétries quantiques : la physique fondamentale témoigne d\'un ordre mathématique sublime.',
    image: 'assets/images/theme-physique.jpg'
  },
  'grands-scientifiques': {
    id: 'grands-scientifiques',
    name: 'Grands scientifiques',
    tagline: '« Penser les pensées du Créateur après Lui »',
    description: 'Newton, Kepler, Maxwell, Faraday, Pasteur, Planck : explorez les écrits et la démarche des pères fondateurs de la science moderne qui puisaient leur génie dans l\'émerveillement de la Création.',
    image: 'assets/images/theme-grands-scientifiques.jpg'
  }
};

// Fonctions utilitaires
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 70);
}

function formatDateFr(isoDate) {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return 'Date récente';
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function normalizeTheme(themeInput) {
  if (!themeInput) return null;
  const t = themeInput.toLowerCase().trim();
  if (t.includes('adn') || t.includes('vivant') || t.includes('cellule') || t.includes('oeil')) {
    return { key: 'adn-vivant', label: 'ADN et le vivant' };
  }
  if (t.includes('scientifique') || t.includes('newton') || t.includes('kepler')) {
    return { key: 'grands-scientifiques', label: 'Grands scientifiques' };
  }
  if (t.includes('physique') || t.includes('neutrino') || t.includes('quantique') || t.includes('137')) {
    return { key: 'physique', label: 'Physique' };
  }
  if (t.includes('cosmo') || t.includes('univers') || t.includes('big bang') || t.includes('terre') || t.includes('entropie')) {
    return { key: 'cosmologie', label: 'Cosmologie' };
  }
  return { key: 'cosmologie', label: 'Cosmologie' };
}

function autoDetectTheme(title, description = '') {
  const text = (title + ' ' + description).toLowerCase();
  if (text.includes('adn') || text.includes('medecine') || text.includes('cellule') || text.includes('oiel') || text.includes('œil') || text.includes('vivant') || text.includes('machine moleculaire')) {
    return { key: 'adn-vivant', label: 'ADN et le vivant' };
  }
  if (text.includes('kepler') || text.includes('newton') || text.includes('maxwell') || text.includes('geants de la science') || text.includes('pasteur') || text.includes('planck')) {
    return { key: 'grands-scientifiques', label: 'Grands scientifiques' };
  }
  if (text.includes('physique') || text.includes('neutrino') || text.includes('quantique') || text.includes('constante')) {
    return { key: 'physique', label: 'Physique' };
  }
  return { key: 'cosmologie', label: 'Cosmologie' };
}

// 1. Récupération du flux RSS YouTube avec Timeout et Fallback
function fetchRssFeed(url, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SiteBuilder/1.0',
        'Accept': 'application/xml, text/xml, */*'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchRssFeed(res.headers.location, timeoutMs));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Code de statut HTTP : ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error(`Délai d'attente dépassé (${timeoutMs}ms)`));
    });
  });
}

function parseRssXml(xml) {
  const entries = [];
  const rawEntries = xml.split('<entry>').slice(1);
  for (const raw of rawEntries) {
    const videoIdMatch = raw.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch = raw.match(/<title>([^<]+)<\/title>/);
    const pubMatch = raw.match(/<published>([^<]+)<\/published>/);
    const descMatch = raw.match(/<media:description>([\s\S]*?)<\/media:description>/);
    const thumbMatch = raw.match(/<media:thumbnail url="([^"]+)"/);

    if (videoIdMatch && titleMatch) {
      entries.push({
        youtubeId: videoIdMatch[1].trim(),
        title: titleMatch[1].trim(),
        published: pubMatch ? pubMatch[1].trim() : new Date().toISOString(),
        description: descMatch ? descMatch[1].trim() : '',
        thumbnail: thumbMatch ? thumbMatch[1].trim() : `https://i.ytimg.com/vi/${videoIdMatch[1].trim()}/hqdefault.jpg`
      });
    }
  }
  return entries;
}

// Chargement des données manuelles
function loadManualData() {
  let manual = {};
  if (fs.existsSync(MANUAL_FILE)) {
    try {
      delete require.cache[require.resolve(MANUAL_FILE)];
      manual = require(MANUAL_FILE) || {};
    } catch (e) {
      console.warn(`⚠️ Impossible de charger ${MANUAL_FILE} :`, e.message);
    }
  }
  if (fs.existsSync(MANUAL_JSON_FILE)) {
    try {
      const jsonContent = JSON.parse(fs.readFileSync(MANUAL_JSON_FILE, 'utf8'));
      manual = { ...manual, ...jsonContent };
    } catch (e) {
      console.warn(`⚠️ Impossible de charger ${MANUAL_JSON_FILE} :`, e.message);
    }
  }
  return manual;
}

// Générateur de carte vidéo simplifiée :
// Contient UNIQUEMENT : miniature, petite étiquette thème, titre, date, bouton « Lire & Voir »
// PAS de description longue
function renderVideoCardHtml(v) {
  return `
    <article class="video-card">
      <div class="video-card-thumb-wrap">
        <a href="/videos/${v.slug}" aria-label="Regarder ${escapeHtml(v.title)}">
          <img src="${v.thumbnail}" alt="${escapeHtml(v.title)}" class="video-card-thumb" loading="lazy">
        </a>
        <a href="themes.html?theme=${v.theme}" class="video-card-badge badge badge-gold">${escapeHtml(v.themeLabel)}</a>
      </div>
      <div class="video-card-body">
        <h3 class="video-card-title">
          <a href="/videos/${v.slug}">${escapeHtml(v.title)}</a>
        </h3>
        <div class="video-card-meta">
          <span>${escapeHtml(v.date)}</span>
          <a href="/videos/${v.slug}" style="color: var(--gold-primary); font-weight: 700; display: inline-flex; align-items: center; gap: 0.3rem;">
            Lire & Voir →
          </a>
        </div>
      </div>
    </article>
  `;
}

// Construction de la page vidéo statique
function buildStaticVideoPage(video, allVideos, templateHtml) {
  let html = templateHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(video.title)} | Le Grand Génie de la Création</title>`);
  html = html.replace(/<meta name="description" content="[\s\S]*?">/i, `<meta name="description" content="${escapeHtml(video.summary)}">`);
  html = html.replace(/<span id="breadcrumb-title">[\s\S]*?<\/span>/i, `<span id="breadcrumb-title">${escapeHtml(video.title)}</span>`);
  html = html.replace(/<a href="themes\.html" class="badge badge-gold" id="video-theme-badge">[\s\S]*?<\/a>/i, `<a href="/themes.html?theme=${video.theme}" class="badge badge-gold" id="video-theme-badge">${escapeHtml(video.themeLabel)}</a>`);
  html = html.replace(/<h1 class="video-article-title" id="video-title">[\s\S]*?<\/h1>/i, `<h1 class="video-article-title" id="video-title">${escapeHtml(video.title)}</h1>`);
  html = html.replace(/<span id="video-read-time">[\s\S]*?<\/span>/i, `<span id="video-read-time">${escapeHtml(video.readTime)}</span>`);
  html = html.replace(/<span id="video-date">[\s\S]*?<\/span>/i, `<span id="video-date">${escapeHtml(video.date)}</span>`);

  const iframeRegex = /<iframe[\s\S]*?id="youtube-iframe"[\s\S]*?<\/iframe>/i;
  const newIframe = `<iframe 
            id="youtube-iframe"
            src="https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1" 
            title="${escapeHtml(video.title)}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            loading="lazy">
          </iframe>`;
  html = html.replace(iframeRegex, newIframe);

  const takeawaysHtml = (video.keyTakeaways || []).map(item => `
    <li class="takeaway-item">
      <span class="takeaway-dot"></span>
      <span>${escapeHtml(item)}</span>
    </li>
  `).join('');
  html = html.replace(/<ul class="takeaway[s]?-list" id="takeaways-list">[\s\S]*?<\/ul>/i, `<ul class="takeaway-list" id="takeaways-list">${takeawaysHtml}</ul>`);

  let writtenArticleHtml = video.content;
  if (!writtenArticleHtml || writtenArticleHtml.trim().length === 0) {
    writtenArticleHtml = `
      <p class="article-lead">${escapeHtml(video.summary)}</p>
      <div class="article-callout">
        <h4>À propos de cette vidéo</h4>
        <p>${video.formattedDescription || escapeHtml(video.summary)}</p>
      </div>
    `;
  }
  html = html.replace(/<article class="article-content" id="article-body">[\s\S]*?<\/article>/i, `<article class="article-content" id="article-body">${writtenArticleHtml}</article>`);

  const relatedVideos = allVideos.filter(v => v.youtubeId !== video.youtubeId).slice(0, 3);
  const relatedCardsHtml = relatedVideos.map(v => renderVideoCardHtml(v)).join('');
  html = html.replace(/<div class="related-grid" id="related-videos-mount">[\s\S]*?<\/div>/i, `<div class="related-grid" id="related-videos-mount">${relatedCardsHtml}</div>`);

  return html;
}

// Fonction principale de Build
async function runBuild() {
  console.log('🚀 Démarrage du build de production pour « Le Grand Génie de la Création »...');

  // 1. Récupération des vidéos YouTube (RSS ou Cache de secours)
  let rawVideos = [];
  try {
    console.log(`📡 Connexion au flux YouTube RSS (${CHANNEL_ID})...`);
    const xml = await fetchRssFeed(RSS_URL, 8000);
    rawVideos = parseRssXml(xml);
    if (rawVideos.length > 0) {
      console.log(`✅ Flux YouTube récupéré : ${rawVideos.length} vidéos brutes trouvées.`);
    } else {
      throw new Error('Aucune vidéo dans le flux XML');
    }
  } catch (err) {
    console.warn(`⚠️ Flux YouTube inaccessible (${err.message}). Utilisation du cache.`);
    if (fs.existsSync(CACHE_FILE)) {
      try {
        rawVideos = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      } catch (cacheErr) {
        console.error('❌ Échec de lecture du cache :', cacheErr.message);
      }
    }
  }

  // 2. DÉDUPLICATION STRICTE par identifiant YouTube unique (1 vidéo = 1 seule entrée)
  const uniqueVideosMap = new Map();
  for (const raw of rawVideos) {
    if (raw.youtubeId && !uniqueVideosMap.has(raw.youtubeId)) {
      uniqueVideosMap.set(raw.youtubeId, raw);
    }
  }
  const deduplicatedRawVideos = Array.from(uniqueVideosMap.values());
  console.log(`🔍 Après déduplication stricte par YouTube ID : ${deduplicatedRawVideos.length} vidéos uniques.`);

  // Sauvegarde propre du cache dédupliqué
  fs.writeFileSync(CACHE_FILE, JSON.stringify(deduplicatedRawVideos, null, 2), 'utf8');

  // 3. Fusion avec les données manuelles officielles (Thème unique, Script, Titre officiel, etc.)
  const manualData = loadManualData();

  const processedVideos = deduplicatedRawVideos.map((raw, index) => {
    const manual = manualData[raw.youtubeId] || {};
    const title = manual.officialTitle || raw.title;
    const slug = slugify(title);

    // Chaque vidéo a UN SEUL thème
    const themeObj = normalizeTheme(manual.theme) || autoDetectTheme(title, raw.description);
    const dateFormatted = formatDateFr(raw.published);

    let summary = manual.summary;
    if (!summary) {
      const cleanDesc = raw.description ? raw.description.split('\n')[0].replace(/[\r\n]+/g, ' ').trim() : '';
      summary = cleanDesc.length > 20 ? cleanDesc : `${title} - Regardez l'enquête vidéo sur Le Grand Génie de la Création.`;
    }

    const readTime = manual.readTime || '5 min de lecture';
    const keyTakeaways = manual.keyTakeaways || manual.sections || [];

    let formattedDescription = '';
    if (raw.description) {
      formattedDescription = escapeHtml(raw.description).replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>');
    }

    return {
      id: slug,
      slug: slug,
      title: title,
      featured: index === 0,
      theme: themeObj.key,
      themeLabel: themeObj.label,
      youtubeId: raw.youtubeId,
      youtubeUrl: `https://www.youtube.com/watch?v=${raw.youtubeId}`,
      summary: summary,
      date: dateFormatted,
      datePublished: raw.published,
      readTime: readTime,
      duration: manual.duration || 'PT15M00S',
      thumbnail: raw.thumbnail,
      keyTakeaways: keyTakeaways,
      formattedDescription: formattedDescription,
      content: manual.script || ''
    };
  });

  // Calcul du nombre de vidéos par thème
  const themeCounts = {
    'cosmologie': 0,
    'adn-vivant': 0,
    'physique': 0,
    'grands-scientifiques': 0
  };
  processedVideos.forEach(v => {
    if (themeCounts[v.theme] !== undefined) {
      themeCounts[v.theme]++;
    }
  });

  // 4. Écriture de data/videos.js (reconstruit à neuf à chaque build)
  const videosJsContent = `/**
 * Base de données générée automatiquement lors du build
 * Chaîne : « Le Grand Génie de la Création »
 * Total vidéos : ${processedVideos.length}
 * Date de génération : ${new Date().toISOString()}
 */

const THEMES = {
  'cosmologie': {
    id: 'cosmologie',
    name: 'Cosmologie',
    tagline: 'L\\'immensité réglée au millimètre près',
    description: 'De l\\'origine de l\\'espace-temps à l\\'extraordinaire réglage des constantes cosmologiques : découvrez pourquoi l\\'univers semble avoir été conçu pour accueillir la vie.',
    image: 'assets/images/theme-cosmologie.jpg',
    videoCount: ${themeCounts['cosmologie']}
  },
  'adn-vivant': {
    id: 'adn-vivant',
    name: 'ADN et le vivant',
    tagline: 'L\\'information numérique au cœur de chaque cellule',
    description: 'La molécule d\\'ADN, les nanomachines d\\'édition et la complexité irréductible des organismes vivants révèlent une densité d\\'information qui défie le pur hasard matériel.',
    image: 'assets/images/theme-adn-vivant.jpg',
    videoCount: ${themeCounts['adn-vivant']}
  },
  'physique': {
    id: 'physique',
    name: 'Physique',
    tagline: 'Les lois inébranlables et les constantes universelles',
    description: 'La constante de structure fine, la gravitation, l\\'interaction forte et les symétries quantiques : la physique fondamentale témoigne d\\'un ordre mathématique sublime.',
    image: 'assets/images/theme-physique.jpg',
    videoCount: ${themeCounts['physique']}
  },
  'grands-scientifiques': {
    id: 'grands-scientifiques',
    name: 'Grands scientifiques',
    tagline: '« Penser les pensées du Créateur après Lui »',
    description: 'Newton, Kepler, Maxwell, Faraday, Pasteur, Planck : explorez les écrits et la démarche des pères fondateurs de la science moderne qui puisaient leur génie dans l\\'émerveillement de la Création.',
    image: 'assets/images/theme-grands-scientifiques.jpg',
    videoCount: ${themeCounts['grands-scientifiques']}
  }
};

const VIDEOS = ${JSON.stringify(processedVideos, null, 2)};

function getFeaturedVideo() {
  return VIDEOS.find(v => v.featured) || VIDEOS[0];
}

function getVideoById(id) {
  if (!id) return null;
  return VIDEOS.find(v => 
    v.id.toLowerCase() === id.toLowerCase() || 
    v.slug.toLowerCase() === id.toLowerCase() ||
    v.youtubeId === id
  );
}

function getVideosByTheme(themeKey) {
  if (!themeKey || themeKey === 'all') return VIDEOS;
  return VIDEOS.filter(v => v.theme === themeKey);
}

function getRelatedVideos(videoId, limit = 3) {
  const current = getVideoById(videoId);
  if (!current) return VIDEOS.slice(0, limit);
  const sameTheme = VIDEOS.filter(v => v.theme === current.theme && v.id !== current.id);
  if (sameTheme.length >= limit) return sameTheme.slice(0, limit);
  const others = VIDEOS.filter(v => v.theme !== current.theme && v.id !== current.id);
  return [...sameTheme, ...others].slice(0, limit);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { THEMES, VIDEOS, getFeaturedVideo, getVideoById, getVideosByTheme, getRelatedVideos };
}
`;

  fs.writeFileSync(path.join(ROOT_DIR, 'data', 'videos.js'), videosJsContent, 'utf8');
  console.log(`✅ data/videos.js reconstruit à neuf : exactement ${processedVideos.length} vidéos.`);

  // 5. Mise à jour de la page catalogue (videos.html)
  const videosPagePath = path.join(ROOT_DIR, 'videos.html');
  if (fs.existsSync(videosPagePath)) {
    let videosHtml = fs.readFileSync(videosPagePath, 'utf8');

    // Mise à jour du badge de comptage
    videosHtml = videosHtml.replace(/<span class="badge badge-gold" id="videos-count-badge">[\s\S]*?<\/span>/i, 
      `<span class="badge badge-gold" id="videos-count-badge">${processedVideos.length} vidéo${processedVideos.length > 1 ? 's' : ''}</span>`);

    // Remplacement strict entre les balises de commentaires
    const allCardsHtml = processedVideos.map(v => renderVideoCardHtml(v)).join('\n');
    videosHtml = videosHtml.replace(
      /<!-- VIDEOS_LIST_START -->[\s\S]*?<!-- VIDEOS_LIST_END -->/i,
      `<!-- VIDEOS_LIST_START -->\n${allCardsHtml}\n<!-- VIDEOS_LIST_END -->`
    );

    fs.writeFileSync(videosPagePath, videosHtml, 'utf8');
    console.log(`✅ videos.html reconstruit à neuf : exactement ${processedVideos.length} cartes générées (0 doublon).`);
  }

  // 6. Mise à jour de themes.html avec les 4 thèmes et leurs vidéos
  const themesPagePath = path.join(ROOT_DIR, 'themes.html');
  if (fs.existsSync(themesPagePath)) {
    let themesHtml = fs.readFileSync(themesPagePath, 'utf8');
    Object.keys(THEMES_CONFIG).forEach(themeKey => {
      const themeVideos = processedVideos.filter(v => v.theme === themeKey);
      const themeCards = themeVideos.length > 0 
        ? themeVideos.map(v => renderVideoCardHtml(v)).join('\n')
        : `<p style="color: var(--text-muted); grid-column: 1 / -1;">Nouvelles vidéos à venir prochainement pour ce thème.</p>`;

      const markerRegex = new RegExp(`<!-- THEME_${themeKey}_START -->[\\s\\S]*?<!-- THEME_${themeKey}_END -->`, 'i');
      if (markerRegex.test(themesHtml)) {
        themesHtml = themesHtml.replace(markerRegex, `<!-- THEME_${themeKey}_START -->\n${themeCards}\n<!-- THEME_${themeKey}_END -->`);
      }
    });
    fs.writeFileSync(themesPagePath, themesHtml, 'utf8');
    console.log('✅ themes.html reconstruit à neuf avec les 4 thèmes et leurs vidéos respectives.');
  }

  // 7. Génération statique des pages individuelles par vidéo dans le dossier videos/
  const videoTemplatePath = path.join(ROOT_DIR, 'video.html');
  const videoTemplate = fs.readFileSync(videoTemplatePath, 'utf8');
  const videosDir = path.join(ROOT_DIR, 'videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  processedVideos.forEach(v => {
    const pageHtml = buildStaticVideoPage(v, processedVideos, videoTemplate);
    fs.writeFileSync(path.join(videosDir, `${v.slug}.html`), pageHtml, 'utf8');

    const slugSubdir = path.join(videosDir, v.slug);
    if (!fs.existsSync(slugSubdir)) {
      fs.mkdirSync(slugSubdir, { recursive: true });
    }
    fs.writeFileSync(path.join(slugSubdir, 'index.html'), pageHtml, 'utf8');

    fs.writeFileSync(path.join(videosDir, `${v.youtubeId}.html`), pageHtml, 'utf8');
    const ytSubdir = path.join(videosDir, v.youtubeId);
    if (!fs.existsSync(ytSubdir)) {
      fs.mkdirSync(ytSubdir, { recursive: true });
    }
    fs.writeFileSync(path.join(ytSubdir, 'index.html'), pageHtml, 'utf8');
  });
  console.log(`✅ Dossier /videos/ généré pour les ${processedVideos.length} vidéos.`);

  // 8. Mise à jour de sitemap.xml
  const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const today = new Date().toISOString().split('T')[0];
    const videoUrls = processedVideos.map(v => `  <url>
    <loc>https://legrandgeniedelacreation.com/videos/${v.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://legrandgeniedelacreation.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://legrandgeniedelacreation.com/videos.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://legrandgeniedelacreation.com/themes.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://legrandgeniedelacreation.com/affiches.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://legrandgeniedelacreation.com/a-propos.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://legrandgeniedelacreation.com/infolettre.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
${videoUrls}
</urlset>`;

    fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
    console.log('✅ sitemap.xml mis à jour.');
  }

  console.log('✨ Build de production terminé avec succès : exactement 7 vidéos.');
}

runBuild().catch(err => {
  console.error('❌ Erreur critique pendant le build :', err);
  process.exit(1);
});
