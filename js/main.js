/**
 * Script Principal du Site « Le Grand Génie de la Création »
 * Gère l'interactivité, le menu mobile, l'inscription infolettre et le rendu dynamique des pages
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initNewsletterForms();
  
  // Routage & Rendu en fonction de la page active
  const path = window.location.pathname.toLowerCase();
  
  if (path.includes('video.html')) {
    initVideoDetailPage();
  } else if (path.includes('videos.html')) {
    initVideosCatalogPage();
  } else if (path.includes('themes.html')) {
    initThemesPage();
  } else if (path.includes('index.html') || path.endsWith('/') || path.endsWith('grand-genie-creation')) {
    initHomePage();
  }
});

/* ==========================================================================
   NAVIGATION GLOBALE & MENU MOBILE
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.main-nav');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      const isOpen = nav.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });

    // Fermer le menu lors du clic sur un lien
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   INSCRIPTION INFOLETTRE & RETOUR UTILISATEUR
   ========================================================================== */
function initNewsletterForms() {
  const forms = document.querySelectorAll('.newsletter-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input) return;

      const email = input.value.trim();
      if (!email || !validateEmail(email)) {
        showToast('Veuillez entrer une adresse courriel valide.', 'warning');
        return;
      }

      // Sauvegarde dans le stockage local (simulation de liste de diffusion)
      let subscribers = JSON.parse(localStorage.getItem('ggc_subscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('ggc_subscribers', JSON.stringify(subscribers));
      }

      showToast(`Merci ! Vous êtes désormais inscrit avec l'adresse : ${email}`, 'success');
      form.reset();
    });
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  const iconSvg = type === 'success' 
    ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f5c542" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`
    : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   PAGE D'ACCUEIL (INDEX)
   ========================================================================== */
function initHomePage() {
  // Optionnel : s'assurer que la dernière vidéo correspond toujours à la featured de videos.js
  const featured = getFeaturedVideo();
  const featuredContainer = document.getElementById('featured-video-mount');
  if (featuredContainer && featured) {
    // La structure est déjà injectée dans index.html pour le SEO statique
  }
}

/* ==========================================================================
   PAGE MODÈLE VIDÉO DÉTAILLÉE (video.html)
   ========================================================================== */
function initVideoDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('id') || urlParams.get('v') || 'nobel-medecine-2026-code-cache';
  
  const video = getVideoById(videoId) || getFeaturedVideo();
  if (!video) return;

  // Mise à jour balises SEO dynamiques
  document.title = `${video.title} | Le Grand Génie de la Création`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', video.summary);
  }

  // Éléments du DOM
  const breadcrumbCurrent = document.getElementById('breadcrumb-title');
  const titleEl = document.getElementById('video-title');
  const badgeEl = document.getElementById('video-theme-badge');
  const dateEl = document.getElementById('video-date');
  const readTimeEl = document.getElementById('video-read-time');
  const iframeEl = document.getElementById('youtube-iframe');
  const takeawaysListEl = document.getElementById('takeaways-list');
  const articleBodyEl = document.getElementById('article-body');
  const relatedMountEl = document.getElementById('related-videos-mount');

  if (breadcrumbCurrent) breadcrumbCurrent.textContent = video.title;
  if (titleEl) titleEl.textContent = video.title;
  if (badgeEl) {
    badgeEl.textContent = video.themeLabel;
    badgeEl.href = `themes.html?theme=${video.theme}`;
  }
  if (dateEl) dateEl.textContent = video.date;
  if (readTimeEl) readTimeEl.textContent = video.readTime;
  
  if (iframeEl) {
    iframeEl.src = `https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`;
    iframeEl.title = video.title;
  }

  // Points clés
  if (takeawaysListEl && video.keyTakeaways) {
    takeawaysListEl.innerHTML = video.keyTakeaways.map(item => `
      <li class="takeaway-item">
        <span class="takeaway-dot"></span>
        <span>${item}</span>
      </li>
    `).join('');
  }

  // Corps de l'article écrit
  if (articleBodyEl) {
    articleBodyEl.innerHTML = video.content;
  }

  // Vidéos du même thème (3 suggestions)
  if (relatedMountEl) {
    const related = getRelatedVideos(video.id, 3);
    relatedMountEl.innerHTML = related.map(v => renderVideoCard(v)).join('');
  }

  // Injection des données structurées Schema.org
  injectVideoSchema(video);
}

function injectVideoSchema(video) {
  const existingSchema = document.getElementById('schema-video-jsonld');
  if (existingSchema) existingSchema.remove();

  const script = document.createElement('script');
  script.id = 'schema-video-jsonld';
  script.type = 'application/ld+json';

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoObject",
        "@id": `https://legrandgeniedelacreation.com/videos/${video.slug}#video`,
        "name": video.title,
        "description": video.summary,
        "thumbnailUrl": `https://legrandgeniedelacreation.com/${video.thumbnail}`,
        "uploadDate": video.datePublished || "2026-10-12T10:00:00+02:00",
        "duration": video.duration || "PT14M32S",
        "embedUrl": `https://www.youtube.com/embed/${video.youtubeId}`,
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": { "@type": "WatchAction" },
          "userInteractionCount": 12450
        }
      },
      {
        "@type": "Article",
        "@id": `https://legrandgeniedelacreation.com/videos/${video.slug}#article`,
        "headline": video.title,
        "description": video.summary,
        "datePublished": video.datePublished || "2026-10-12T10:00:00+02:00",
        "dateModified": video.datePublished || "2026-10-12T10:00:00+02:00",
        "author": {
          "@type": "Person",
          "name": "Jean-Yves",
          "jobTitle": "Créateur & vulgarisateur scientifique",
          "url": "https://legrandgeniedelacreation.com/a-propos.html"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Le Grand Génie de la Création",
          "logo": {
            "@type": "ImageObject",
            "url": "https://legrandgeniedelacreation.com/assets/images/jean-yves-portrait.jpg"
          }
        },
        "image": `https://legrandgeniedelacreation.com/${video.thumbnail}`
      }
    ]
  };

  script.textContent = JSON.stringify(schemaData, null, 2);
  document.head.appendChild(script);
}

/* ==========================================================================
   PAGE CATALOGUE DES VIDÉOS (videos.html)
   ========================================================================== */
function initVideosCatalogPage() {
  const mount = document.getElementById('all-videos-mount');
  const searchInput = document.getElementById('video-search-input');
  const themeFilter = document.getElementById('theme-select');
  const countBadge = document.getElementById('videos-count-badge');

  if (!mount) return;

  function renderList() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedTheme = themeFilter ? themeFilter.value : 'all';

    const filtered = VIDEOS.filter(v => {
      const matchesSearch = !query || 
        v.title.toLowerCase().includes(query) || 
        v.summary.toLowerCase().includes(query) ||
        v.themeLabel.toLowerCase().includes(query);

      const matchesTheme = (selectedTheme === 'all') || (v.theme === selectedTheme);

      return matchesSearch && matchesTheme;
    });

    if (countBadge) {
      countBadge.textContent = `${filtered.length} vidéo${filtered.length > 1 ? 's' : ''}`;
    }

    if (filtered.length === 0) {
      mount.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <p style="font-size: 1.2rem; color: #ffffff; margin-bottom: 0.5rem;">Aucune vidéo trouvée pour votre recherche.</p>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Essayez d'autres mots-clés ou sélectionnez un thème différent.</p>
        </div>
      `;
      return;
    }

    mount.innerHTML = filtered.map(v => renderVideoCard(v)).join('');
  }

  if (searchInput) searchInput.addEventListener('input', renderList);
  if (themeFilter) themeFilter.addEventListener('change', renderList);

  // Vérifier si un filtre thème est passé dans l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const themeParam = urlParams.get('theme');
  if (themeParam && themeFilter) {
    themeFilter.value = themeParam;
  }

  renderList();
}

/* ==========================================================================
   PAGE THÈMES (themes.html)
   ========================================================================== */
function initThemesPage() {
  const buttons = document.querySelectorAll('.filter-btn');
  const sections = document.querySelectorAll('.theme-video-section');

  const urlParams = new URLSearchParams(window.location.search);
  const themeParam = urlParams.get('theme');

  if (themeParam) {
    filterByTheme(themeParam);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTheme = btn.getAttribute('data-theme');
      filterByTheme(targetTheme);
    });
  });

  function filterByTheme(themeKey) {
    buttons.forEach(b => {
      if (b.getAttribute('data-theme') === themeKey) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    sections.forEach(sec => {
      if (themeKey === 'all' || sec.getAttribute('data-theme') === themeKey) {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });
  }
}

/* ==========================================================================
   GÉNÉRATEUR DE CARTE VIDÉO HTML
   ========================================================================== */
function renderVideoCard(v) {
  return `
    <article class="video-card">
      <div class="video-card-thumb-wrap">
        <a href="video.html?id=${v.slug}" aria-label="Regarder ${v.title}">
          <img src="${v.thumbnail}" alt="${v.title}" class="video-card-thumb" loading="lazy">
        </a>
        <span class="video-card-badge badge badge-gold">${v.themeLabel}</span>
        <span class="video-card-duration">${v.readTime}</span>
      </div>
      <div class="video-card-body">
        <h3 class="video-card-title">
          <a href="video.html?id=${v.slug}">${v.title}</a>
        </h3>
        <p class="video-card-summary">${v.summary}</p>
        <div class="video-card-meta">
          <span>${v.date}</span>
          <a href="video.html?id=${v.slug}" style="color: var(--gold-primary); font-weight: 700; display: inline-flex; align-items: center; gap: 0.3rem;">
            Lire & Voir →
          </a>
        </div>
      </div>
    </article>
  `;
}
