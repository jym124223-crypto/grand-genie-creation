# 📘 Guide : Synchronisation YouTube & Ajout de Contenu Écrit

Le site « **Le Grand Génie de la Création** » est désormais **automatisé à 100% avec votre chaîne YouTube** (`@immensegeniedanslunivers`).

---

## ⚡ 1. Comment vos vidéos apparaissent sur le site

Dès que vous publiez une vidéo sur YouTube :
1. Au prochain build (ou push sur GitHub), le script `build.js` interroge automatiquement le flux RSS de votre chaîne :
   `https://www.youtube.com/feeds/videos.xml?channel_id=UCnVoEsgYAxULYINIkqgQf0w`
2. La vidéo est immédiatement ajoutée :
   - À la une sur la **page d'accueil** (la vidéo la plus récente)
   - Dans le catalogue complet sur la page **Vidéos** (avec recherche et filtres)
   - Dans la thématique correspondante sur la page **Thèmes**
   - Sur une page dédiée permanente (`/videos/votre-titre`) avec lecteur vidéo intégré et description

---

## ✍️ 2. Comment ajouter le Thème et la Version Écrite (Script)

Pour associer un thème précis, modifier le temps de lecture ou insérer le script écrit complet d'une vidéo, ouvrez le fichier :
👉 **`data/manual_videos.js`**

### Modèle à ajouter :

```javascript
// Remplacez 'VOTRE_ID_YOUTUBE' par l'ID de votre vidéo (ex: '2Qn-coJEddU')
"VOTRE_ID_YOUTUBE": {
  theme: "ADN et vivant", // 'Cosmologie', 'ADN et vivant', 'Physique', ou 'Grands scientifiques'
  readTime: "8 min de lecture",
  summary: "Résumé personnalisé qui s'affiche sur la carte et pour Google (optionnel).",
  keyTakeaways: [
    "Premier point clé à retenir",
    "Deuxième argument scientifique marquant",
    "Troisième réflexion sur le dessein créateur"
  ],
  script: `
    <p class="article-lead">
      Paragraphe d'introduction percutant de votre script écrit.
    </p>

    <h2>1. Premier grand point de votre démonstration</h2>
    <p>
      Votre texte explicatif. Vous pouvez mettre des mots en <strong>gras</strong>.
    </p>

    <blockquote class="article-quote">
      « Citation inspirante d'un scientifique. »
      <cite>— Nom du chercheur</cite>
    </blockquote>

    <h2>2. Deuxième sous-titre</h2>
    <p>
      Suite de vos explications détaillées.
    </p>

    <div class="article-callout">
      <h4>Point de réflexion clé</h4>
      <p>Encadré mis en valeur pour un paradoxe ou une donnée frappante.</p>
    </div>
  `
}
```

---

## 🛡️ 3. Résilience et Sécurité (Mode Hors-Ligne)

Si le flux YouTube ne répond pas pendant le build (coupure réseau, maintenance YouTube, etc.), le site **ne plante jamais**. Il utilise automatiquement la dernière liste connue enregistrée dans `data/youtube_cache.json`.

---

## 🖼️ 4. Comment ajouter une nouvelle Affiche à télécharger

Le site dispose d'une section publique **Affiches** (`affiches.html`) et d'une page privée de téléchargement direct (`affiches-telechargement.html`) conçue pour vos abonnés MailerLite.

Pour ajouter une nouvelle affiche en 2 étapes très simples :

### Étape A — Déposer vos fichiers dans `public/affiches/`
Placez vos deux fichiers dans le dossier `public/affiches/` :
- L'image d'aperçu : `public/affiches/nom-affiche-preview.jpg` (ou `.webp`)
- Le fichier PDF haute définition : `public/affiches/nom-affiche-hd.pdf`

### Étape B — Déclarer l'affiche dans `data/affiches.js`
Ouvrez le fichier `data/affiches.js` et ajoutez un nouvel objet dans la liste `AFFICHES` :

```javascript
{
  id: "affiche-adn-programme",
  title: "L'ADN : Le Programme Numérique du Vivant",
  theme: "ADN et vivant", // 'Cosmologie', 'ADN et vivant', 'Physique', 'Grands scientifiques', ou 'Synthèse globale'
  themeKey: "adn-vivant",
  description: "Infographie haute définition synthétisant la densité d'information de l'ADN et les nanomachines cellulaires.",
  previewImage: "/public/affiches/nom-affiche-preview.jpg",
  pdfFile: "/public/affiches/nom-affiche-hd.pdf",
  format: "Format A3 / A4 — Haute Définition (300 DPI)"
}
```
L'affiche apparaîtra immédiatement sur la page publique `affiches.html` et sur la page de téléchargement direct `affiches-telechargement.html`.

### 💡 Lien pour votre courriel de bienvenue MailerLite :
Dans le courriel automatisé envoyé à vos nouveaux inscrits sur MailerLite, mettez simplement le lien vers la page de téléchargement :
`https://legrandgeniedelacreation.com/affiches-telechargement.html`
Cette page est protégée (`noindex`), invisible des moteurs de recherche et réservée à vos abonnés.

---

## 🚀 5. Déploiement

Dès que vous avez modifié `data/manual_videos.js` ou `data/affiches.js` :
```bash
git add .
git commit -m "feat: mise a jour des videos, scripts ou affiches"
git push origin main
```
Vercel lancera automatiquement la commande de build et mettra votre site en ligne en quelques secondes !

