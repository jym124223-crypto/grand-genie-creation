/**
 * Catalogue des affiches pour « Le Grand Génie de la Création »
 * Une affiche par vidéo.
 * 
 * GUIDE POUR AJOUTER UNE NOUVELLE AFFICHE :
 * 1. Déposez votre illustration de fond dans :
 *    👉 public/affiches/fonds/ (ex: mon-fond.jpg)
 * 2. Ajoutez un objet ci-dessous avec le titre, le thème, le nom de l'image de fond
 *    et 3 à 5 faits marquants (phrases courtes).
 * 3. Lancez : node build-affiches.js
 *    Le script génère automatiquement le PDF prêt à imprimer et l'aperçu WebP.
 */

const AFFICHES = [
  {
    id: "kepler-newton-maxwell",
    videoId: "slei71ya6Pc",
    title: "Kepler, Newton, Maxwell: 3 Géants de la science qui croyaient en un Créateur",
    theme: "Grands scientifiques",
    themeKey: "grands-scientifiques",
    description: "Affiche d'art grand format explorant la mécanique céleste et la foi rationnelle des pères fondateurs de la physique moderne.",
    backgroundImage: "public/affiches/fonds/kepler-newton-maxwell.jpg",
    // Textes provisoires à remplacer par les faits marquants définitifs de l'auteur
    keyPoints: [
      "[Fait marquant n°1 : Texte provisoire court à fournir par l'auteur]",
      "[Fait marquant n°2 : Texte provisoire court à fournir par l'auteur]",
      "[Fait marquant n°3 : Texte provisoire court à fournir par l'auteur]",
      "[Fait marquant n°4 : Texte provisoire court à fournir par l'auteur]"
    ],
    previewWebp: "/public/affiches/kepler-newton-maxwell.webp",
    previewImage: "/public/affiches/kepler-newton-maxwell.jpg",
    pdfFile: "/public/affiches/kepler-newton-maxwell.pdf",
    format: "Format Portrait 3:4 — Haute Résolution (300 DPI)"
  },
  {
    id: "affiche-4-piliers",
    title: "Les 4 Piliers de la Science & de la Création",
    theme: "Synthèse globale",
    themeKey: "synthese",
    description: "Infographie complète réunissant les arguments clés de la Cosmologie, de l'ADN, de la Physique quantique et les citations historiques des pères fondateurs de la science.",
    previewWebp: "/public/affiches/affiche-4-piliers-preview.webp",
    previewImage: "/public/affiches/affiche-4-piliers-preview.jpg",
    pdfFile: "/public/affiches/affiche-4-piliers-haute-definition.pdf",
    format: "Format A3 / A4 HD",
    isPreGenerated: true
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AFFICHES };
}
