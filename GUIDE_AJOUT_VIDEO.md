# 📘 Guide Simple : Comment Ajouter une Nouvelle Vidéo

Bienvenue Jean-Yves ! Ajouter une nouvelle vidéo à votre site web « **Le Grand Génie de la Création** » est conçu pour être un jeu d'enfant. Vous n'avez pas besoin de toucher au code HTML ou CSS : **tout se passe dans un seul fichier simple : `data/videos.js`**.

---

## 🚀 Méthode en 3 étapes (2 minutes chrono)

### Étape 1 : Ouvrez le fichier `data/videos.js`
Ouvrez le fichier [videos.js](file:///C:/Users/jym12/.gemini/antigravity-ide/scratch/grand-genie-creation/data/videos.js) avec votre éditeur de texte.

### Étape 2 : Copiez-collez ce modèle
Ajoutez simplement ce bloc au début du tableau `const VIDEOS = [ ... ];` :

```javascript
{
  id: 'titre-court-de-la-video', // Ex: 'or-et-constantes-cosmiques' (sans espaces ni accents)
  slug: 'titre-court-de-la-video',
  title: 'Votre Titre de Vidéo Complet et Accrocheur (H1)',
  featured: true, // Mettez true si vous voulez qu'elle soit la vidéo à la une sur l'accueil
  theme: 'cosmologie', // Choisissez parmi : 'cosmologie', 'adn-vivant', 'physique', ou 'grands-scientifiques'
  themeLabel: 'Cosmologie', // Nom affiché : 'Cosmologie', 'ADN et le vivant', 'Physique', ou 'Grands scientifiques'
  youtubeId: 'ID_DE_VOTRE_VIDEO_YOUTUBE', // Ex: si l'URL est youtube.com/watch?v=AbCdEf123, l'ID est 'AbCdEf123'
  youtubeUrl: 'https://www.youtube.com/watch?v=ID_DE_VOTRE_VIDEO_YOUTUBE',
  summary: 'Court résumé percutant de 2 à 3 phrases pour Google, YouTube et la carte d\'aperçu.',
  date: '20 Octobre 2026',
  datePublished: '2026-10-20T10:00:00+02:00',
  readTime: '8 min de lecture',
  duration: 'PT15M30S', // Durée pour Google (ex: 15 min 30 s)
  thumbnail: 'assets/images/theme-cosmologie.jpg', // ou le chemin de votre miniature personnalisée
  keyTakeaways: [
    'Premier point clé à retenir de la vidéo.',
    'Deuxième argument scientifique marquant.',
    'Troisième réflexion sur le dessein créateur.'
  ],
  content: `
    <p class="article-lead">
      Paragraphe d'introduction percutant qui capte l'attention du lecteur dès la première phrase.
    </p>

    <h2>1. Premier grand sous-titre de votre démonstration</h2>
    <p>
      Texte explicatif de votre première partie. Vous pouvez mettre des mots en <strong>gras</strong> pour faire ressortir les concepts clés.
    </p>

    <blockquote class="article-quote">
      « Citation scientifique inspirante d'un chercheur ou d'un grand physicien. »
      <cite>— Nom de l'auteur, profession</cite>
    </blockquote>

    <h2>2. Deuxième sous-titre approfondi</h2>
    <p>
      Suite de votre démonstration avec les données observationnelles, les lois physiques ou biologiques.
    </p>

    <div class="article-callout">
      <h4>Point de réflexion clé</h4>
      <p>
        Un encadré bleu électrique élégant pour mettre en valeur un paradoxe ou une découverte frappante.
      </p>
    </div>

    <h2>3. Conclusion et perspective</h2>
    <p>
      Synthèse finale montrant comment ces indices scientifiques pointent vers le Grand Génie créateur.
    </p>
  `
},
```

### Étape 3 : Sauvegardez le fichier
Dès que vous enregistrez `data/videos.js` :
1. ✅ La vidéo apparaît automatiquement sur la page **Accueil** (si `featured: true`).
2. ✅ Elle s'ajoute automatiquement au catalogue **Vidéos** avec recherche instantanée.
3. ✅ Elle se classe toute seule dans son **Thème** correspondant.
4. ✅ Sa page dédiée (`video.html?id=titre-court-de-la-video`) est prête avec son lecteur YouTube, son texte complet, ses suggestions similaires et ses balises Google Schema.org !

---

## 🎨 Les 4 Thèmes Disponibles
Pour le champ `theme`, utilisez l'une de ces 4 valeurs exactes :
- `'cosmologie'` (pour *Cosmologie*)
- `'adn-vivant'` (pour *ADN et le vivant*)
- `'physique'` (pour *Physique*)
- `'grands-scientifiques'` (pour *Grands scientifiques*)

---

## 📸 Où mettre les images et miniatures ?
Déposez simplement vos images dans le dossier :
`assets/images/`
Puis indiquez leur nom dans le champ `thumbnail: 'assets/images/ma-miniature.jpg'`.
