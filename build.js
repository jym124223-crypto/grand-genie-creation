/**
 * Script de Build et d'Automatisation pour « Le Grand Génie de la Création »
 * 
 * Fonctionnalités :
 * 1. Récupération automatique du flux RSS YouTube de la chaîne (@immensegeniedanslunivers)
 * 2. Tolérance aux pannes et résilience : utilisation de data/youtube_cache.json en cas de timeout ou panne réseau
 * 3. Fusion avec les métadonnées manuelles (thèmes, scripts complets, durées de lecture) depuis data/manual_videos.js
 * 4. Génération statique des pages :
 *    - index.html (dernière vidéo en vedette à la une)
 *    - videos.html (catalogue complet pré-rendu)
 *    - themes.html (vidéos triées par thématiques)
 *    - dossier videos/ (une page statique ultra-rapide par vidéo avec lecteur YouTube et version écrite)
 *    - data/videos.js (base de données pour l'interactivité et les filtres côté client)
 *    - sitemap.xml (référencement SEO de toutes les vidéos)
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
      // Décharger le cache require au cas où
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

// Générateur de carte vidéo HTML
function renderVideoCardHtml(v, isInsideVideosDir = false) {
  const linkPrefix = isInsideVideosDir ? '/videos/' : '/videos/';
  const linkUrl = `${linkPrefix}${v.slug}`;
  const themeLink = isInsideVideosDir ? `/themes.html?theme=${v.theme}` : `themes.html?theme=${v.theme}`;

  return `
    <article class="video-card">
      <div class="video-card-thumb-wrap">
        <a href="${linkUrl}" aria-label="Regarder ${escapeHtml(v.title)}">
          <img src="${v.thumbnail}" alt="${escapeHtml(v.title)}" class="video-card-thumb" loading="lazy">
        </a>
        <a href="${themeLink}" class="video-card-badge badge badge-gold">${escapeHtml(v.themeLabel)}</a>
        <span class="video-card-duration">${escapeHtml(v.readTime)}</span>
      </div>
      <div class="video-card-body">
        <h3 class="video-card-title">
          <a href="${linkUrl}">${escapeHtml(v.title)}</a>
        </h3>
        <p class="video-card-summary">${escapeHtml(v.summary)}</p>
        <div class="video-card-meta">
          <span>${escapeHtml(v.date)}</span>
          <a href="${linkUrl}" style="color: var(--gold-primary); font-weight: 700; display: inline-flex; align-items: center; gap: 0.3rem;">
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

  // Remplacement du Title & Meta
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(video.title)} | Le Grand Génie de la Création</title>`);
  html = html.replace(/<meta name="description" content="[\s\S]*?">/i, `<meta name="description" content="${escapeHtml(video.summary)}">`);

  // Fil d'Ariane
  html = html.replace(/<span id="breadcrumb-title">[\s\S]*?<\/span>/i, `<span id="breadcrumb-title">${escapeHtml(video.title)}</span>`);

  // Badge Thème
  html = html.replace(/<a href="themes\.html" class="badge badge-gold" id="video-theme-badge">[\s\S]*?<\/a>/i, `<a href="/themes.html?theme=${video.theme}" class="badge badge-gold" id="video-theme-badge">${escapeHtml(video.themeLabel)}</a>`);

  // Titre H1
  html = html.replace(/<h1 class="video-article-title" id="video-title">[\s\S]*?<\/h1>/i, `<h1 class="video-article-title" id="video-title">${escapeHtml(video.title)}</h1>`);

  // Métadonnées (date & lecture)
  html = html.replace(/<span id="video-read-time">[\s\S]*?<\/span>/i, `<span id="video-read-time">${escapeHtml(video.readTime)}</span>`);
  html = html.replace(/<span id="video-date">[\s\S]*?<\/span>/i, `<span id="video-date">${escapeHtml(video.date)}</span>`);

  // Iframe YouTube
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

  // Points clés
  const takeawaysHtml = (video.keyTakeaways || []).map(item => `
    <li class="takeaway-item">
      <span class="takeaway-dot"></span>
      <span>${escapeHtml(item)}</span>
    </li>
  `).join('');
  html = html.replace(/<ul class="takeaways-list" id="takeaways-list">[\s\S]*?<\/ul>/i, `<ul class="takeaways-list" id="takeaways-list">${takeawaysHtml}</ul>`);

  // Version écrite (Corps de l'article)
  let writtenArticleHtml = video.content;
  if (!writtenArticleHtml || writtenArticleHtml.trim().length === 0) {
    writtenArticleHtml = `
      <p class="article-lead">${escapeHtml(video.summary)}</p>
      <div class="article-callout">
        <h4>À propos de cette vidéo</h4>
        <p>${video.formattedDescription || escapeHtml(video.summary)}</p>
      </div>
      <div class="article-version-ecrite" style="margin-top: 2rem; padding: 1.5rem; background: rgba(245, 197, 66, 0.05); border: 1px dashed var(--gold-primary); border-radius: var(--radius-sm);">
        <h4 style="color: var(--gold-primary); margin-bottom: 0.5rem;">📝 Version écrite du script</h4>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 0;">La transcription et la version écrite complète de cette vidéo sont en cours de mise en page par Jean-Yves. En attendant, visionnez le documentaire complet dans le lecteur ci-dessus !</p>
      </div>
    `;
  }
  html = html.replace(/<article class="article-content" id="article-body">[\s\S]*?<\/article>/i, `<article class="article-content" id="article-body">${writtenArticleHtml}</article>`);

  // Vidéos similaires
  const relatedVideos = allVideos.filter(v => v.youtubeId !== video.youtubeId).slice(0, 3);
  const relatedCardsHtml = relatedVideos.map(v => renderVideoCardHtml(v, true)).join('');
  html = html.replace(/<div class="related-grid" id="related-videos-mount">[\s\S]*?<\/div>/i, `<div class="related-grid" id="related-videos-mount">${relatedCardsHtml}</div>`);

  // Balises Schema.org JSON-LD statiques
  const schemaScript = `
  <script type="application/ld+json" id="schema-video-jsonld">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoObject",
        "@id": "https://legrandgeniedelacreation.com/videos/${video.slug}#video",
        "name": ${JSON.stringify(video.title)},
        "description": ${JSON.stringify(video.summary)},
        "thumbnailUrl": ${JSON.stringify(video.thumbnail)},
        "uploadDate": ${JSON.stringify(video.datePublished)},
        "embedUrl": "https://www.youtube.com/embed/${video.youtubeId}"
      },
      {
        "@type": "Article",
        "@id": "https://legrandgeniedelacreation.com/videos/${video.slug}#article",
        "headline": ${JSON.stringify(video.title)},
        "description": ${JSON.stringify(video.summary)},
        "datePublished": ${JSON.stringify(video.datePublished)},
        "author": {
          "@type": "Person",
          "name": "Jean-Yves",
          "jobTitle": "Créateur & vulgarisateur scientifique",
          "url": "https://legrandgeniedelacreation.com/a-propos.html"
        }
      }
    ]
  }
  </script>`;

  if (!html.includes('id="schema-video-jsonld"')) {
    html = html.replace('</head>', `${schemaScript}\n</head>`);
  } else {
    html = html.replace(/<script type="application\/ld\+json" id="schema-video-jsonld">[\s\S]*?<\/script>/i, schemaScript);
  }

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
      console.log(`✅ Flux YouTube récupéré avec succès : ${rawVideos.length} vidéos trouvées.`);
      fs.writeFileSync(CACHE_FILE, JSON.stringify(rawVideos, null, 2), 'utf8');
    } else {
      throw new Error('Aucune vidéo trouvée dans le flux XML');
    }
  } catch (err) {
    console.warn(`⚠️ Attention : Impossible de joindre le flux YouTube en direct (${err.message}).`);
    if (fs.existsSync(CACHE_FILE)) {
      console.log(`📂 Utilisation des données de secours du cache : ${CACHE_FILE}`);
      try {
        rawVideos = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
        console.log(`✅ ${rawVideos.length} vidéos chargées depuis le cache local.`);
      } catch (cacheErr) {
        console.error('❌ Échec de lecture du cache :', cacheErr.message);
      }
    }
  }

  // Si même le cache est vide, lire les vidéos existantes dans data/videos.js pour ne jamais planter
  if (rawVideos.length === 0) {
    console.warn('⚠️ Aucun flux ni cache disponible. Conservation des vidéos existantes.');
  }

  // 2. Fusion avec les données manuelles
  const manualData = loadManualData();
  console.log(`📚 Fichier de personnalisation manuelle chargé : ${Object.keys(manualData).length} entrées trouvées.`);

  const processedVideos = rawVideos.map((raw, index) => {
    const slug = slugify(raw.title);
    // Recherche dans les données manuelles par ID YouTube ou par Slug
    const manual = manualData[raw.youtubeId] || manualData[slug] || {};

    const themeObj = normalizeTheme(manual.theme) || autoDetectTheme(raw.title, raw.description);
    const dateFormatted = formatDateFr(raw.published);

    // Résumé : soit manuel, soit 2 premières phrases de la description YouTube
    let summary = manual.summary;
    if (!summary) {
      const cleanDesc = raw.description ? raw.description.split('\n')[0].replace(/[\r\n]+/g, ' ').trim() : '';
      summary = cleanDesc.length > 20 ? cleanDesc : `${raw.title} - Regardez l'enquête vidéo et découvrez la démonstration complète sur Le Grand Génie de la Création.`;
    }

    const readTime = manual.readTime || '8 min de lecture';
    const keyTakeaways = manual.keyTakeaways || [
      'Examen rigoureux des données scientifiques observationnelles.',
      'Démonstration claire réfutant le hasard aveugle au profit d\'un dessein ordonné.',
      'Réflexion philosophique sur les qualités extraordinaires d\'un génie créateur.'
    ];

    let formattedDescription = '';
    if (raw.description) {
      formattedDescription = escapeHtml(raw.description).replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>');
    }

    return {
      id: slug,
      slug: slug,
      title: raw.title,
      featured: index === 0, // La plus récente est en vedette
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

  // 3. Écriture de data/videos.js
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

// Fonctions utilitaires
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
  console.log(`✅ data/videos.js mis à jour avec ${processedVideos.length} vidéos.`);

  // 4. Mise à jour de l'accueil (index.html) avec la dernière vidéo en vedette
  if (processedVideos.length > 0) {
    const featured = processedVideos[0];
    const indexPath = path.join(ROOT_DIR, 'index.html');
    let indexHtml = fs.readFileSync(indexPath, 'utf8');

    const featuredSectionRegex = /<div class="featured-video-card" id="featured-video-mount">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/i;
    const newFeaturedSection = `<div class="featured-video-card" id="featured-video-mount">
          <div class="video-grid">
            <div class="video-player-container">
              <div class="video-embed-wrapper">
                <iframe 
                  id="featured-iframe"
                  src="https://www.youtube.com/embed/${featured.youtubeId}?rel=0&modestbranding=1" 
                  title="${escapeHtml(featured.title)}" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                  loading="lazy">
                </iframe>
              </div>
            </div>

            <div class="video-details">
              <div>
                <div class="video-meta-top">
                  <span class="badge badge-gold">${escapeHtml(featured.themeLabel)}</span>
                  <span class="video-date">${escapeHtml(featured.date)} • ${escapeHtml(featured.readTime)}</span>
                </div>
                
                <h3 style="font-size: 1.55rem; line-height: 1.25; margin-bottom: 1rem;">
                  <a href="/videos/${featured.slug}" class="video-title-link">
                    ${escapeHtml(featured.title)}
                  </a>
                </h3>

                <p class="video-summary">
                  ${escapeHtml(featured.summary)}
                </p>
              </div>

              <div class="video-cta-footer">
                <a href="/videos/${featured.slug}" class="btn btn-gold" id="btn-read-full-article">
                  Lire la version écrite complète →
                </a>
                <a href="videos.html" class="read-article-link">
                  Voir tout le catalogue (${processedVideos.length} vidéos)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;

    indexHtml = indexHtml.replace(featuredSectionRegex, newFeaturedSection);
    fs.writeFileSync(indexPath, indexHtml, 'utf8');
    console.log(`✅ index.html mis à jour : vidéo en vedette « ${featured.title} » injectée.`);
  }

  // 5. Mise à jour de la page catalogue (videos.html)
  const videosPagePath = path.join(ROOT_DIR, 'videos.html');
  let videosHtml = fs.readFileSync(videosPagePath, 'utf8');

  // Mise à jour du badge de comptage
  videosHtml = videosHtml.replace(/<span class="badge badge-gold" id="videos-count-badge">[\s\S]*?<\/span>/i, 
    `<span class="badge badge-gold" id="videos-count-badge">${processedVideos.length} vidéo${processedVideos.length > 1 ? 's' : ''}</span>`);

  // Pré-rendu de la grille de toutes les vidéos
  const allCardsHtml = processedVideos.map(v => renderVideoCardHtml(v, false)).join('');
  videosHtml = videosHtml.replace(/<div class="videos-grid" id="all-videos-mount">[\s\S]*?<\/div>/i,
    `<div class="videos-grid" id="all-videos-mount">\n${allCardsHtml}\n      </div>`);

  fs.writeFileSync(videosPagePath, videosHtml, 'utf8');
  console.log(`✅ videos.html mis à jour : ${processedVideos.length} cartes de vidéos pré-rendues.`);

  // 6. Mise à jour de themes.html avec les vraies vidéos par thématique
  const themesPagePath = path.join(ROOT_DIR, 'themes.html');
  if (fs.existsSync(themesPagePath)) {
    let themesHtml = fs.readFileSync(themesPagePath, 'utf8');
    Object.keys(THEMES_CONFIG).forEach(themeKey => {
      const themeVideos = processedVideos.filter(v => v.theme === themeKey);
      const themeCards = themeVideos.length > 0 
        ? themeVideos.map(v => renderVideoCardHtml(v, false)).join('')
        : `<p style="color: var(--text-muted); grid-column: 1 / -1;">Nouvelles vidéos à venir prochainement pour ce thème.</p>`;

      const sectionRegex = new RegExp(`(<section class="theme-video-section" data-theme="${themeKey}"[\\s\\S]*?<div class="videos-grid">)([\\s\\S]*?)(<\\/div>[\\s\\S]*?<\\/section>)`, 'i');
      if (sectionRegex.test(themesHtml)) {
        themesHtml = themesHtml.replace(sectionRegex, `$1\n${themeCards}\n      $3`);
      }
    });
    fs.writeFileSync(themesPagePath, themesHtml, 'utf8');
    console.log('✅ themes.html mis à jour avec les vidéos réelles par thématique.');
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
    // 1. Sauvegarder sous le slug : /videos/mon-titre.html
    fs.writeFileSync(path.join(videosDir, `${v.slug}.html`), pageHtml, 'utf8');
    
    // 2. Sauvegarder aussi comme sous-dossier avec index.html pour les serveurs statiques et les tests de liens
    const slugSubdir = path.join(videosDir, v.slug);
    if (!fs.existsSync(slugSubdir)) {
      fs.mkdirSync(slugSubdir, { recursive: true });
    }
    fs.writeFileSync(path.join(slugSubdir, 'index.html'), pageHtml, 'utf8');

    // 3. Sauvegarder aussi sous l'ID YouTube pour que les liens directs fonctionnent
    fs.writeFileSync(path.join(videosDir, `${v.youtubeId}.html`), pageHtml, 'utf8');
    const ytSubdir = path.join(videosDir, v.youtubeId);
    if (!fs.existsSync(ytSubdir)) {
      fs.mkdirSync(ytSubdir, { recursive: true });
    }
    fs.writeFileSync(path.join(ytSubdir, 'index.html'), pageHtml, 'utf8');
  });
  console.log(`✅ Dossier /videos/ généré : pages HTML et dossiers index.html créés pour ${processedVideos.length} vidéos.`);

  // 8. Mise à jour de sitemap.xml avec les nouvelles URLs
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
    console.log('✅ sitemap.xml mis à jour avec les URLs de chaque vidéo.');
  }

  // 9. Vérification finale des ressources essentielles
  const requiredFiles = [
    'index.html',
    'videos.html',
    'themes.html',
    'a-propos.html',
    'infolettre.html',
    'video.html',
    'css/style.css',
    'data/videos.js',
    'js/main.js'
  ];

  let missing = [];
  requiredFiles.forEach(f => {
    if (!fs.existsSync(path.join(ROOT_DIR, f))) {
      missing.push(f);
    }
  });

  if (missing.length > 0) {
    console.error('❌ Fichiers manquants après le build :', missing);
    process.exit(1);
  }

  console.log('✨ Build et validation de production réussis avec succès !');
}

runBuild().catch(err => {
  console.error('❌ Erreur critique pendant le build :', err);
  process.exit(1);
});
