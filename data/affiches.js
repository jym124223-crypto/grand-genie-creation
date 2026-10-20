/**
 * Catalogue des affiches à télécharger gratuitement
 * Chaîne : « Le Grand Génie de la Création »
 * 
 * GUIDE POUR AJOUTER UNE NOUVELLE AFFICHE :
 * 1. Déposez votre image d'aperçu (ex: .jpg ou .webp) et votre fichier PDF dans le dossier :
 *    👉 public/affiches/
 * 2. Ajoutez un nouvel objet dans la liste AFFICHES ci-dessous en copiant l'exemple :
 *    - id : Identifiant unique sans espaces (ex: 'affiche-adn-code')
 *    - title : Titre officiel de l'affiche
 *    - theme : Thème parmi 'Cosmologie', 'ADN et vivant', 'Physique', 'Grands scientifiques', ou 'Synthèse globale'
 *    - themeKey : Clé du thème ('cosmologie', 'adn-vivant', 'physique', 'grands-scientifiques', ou 'general')
 *    - description : Courte phrase explicative décrivant l'affiche
 *    - previewImage : Chemin de l'image (ex: '/public/affiches/mon-image.jpg')
 *    - pdfFile : Chemin du fichier PDF (ex: '/public/affiches/mon-affiche.pdf')
 *    - format : Format d'impression conseillé (ex: 'A3 / A4 Haute Définition (300 DPI)')
 */

const AFFICHES = [
  {
    id: "affiche-4-piliers",
    title: "Les 4 Piliers de la Science & de la Création",
    theme: "Synthèse globale",
    themeKey: "general",
    description: "Infographie complète réunissant les arguments clés de la Cosmologie, de l'ADN, de la Physique quantique et les citations historiques des pères fondateurs de la science.",
    previewImage: "/public/affiches/affiche-4-piliers-preview.jpg",
    pdfFile: "/public/affiches/affiche-4-piliers-haute-definition.pdf",
    format: "Format A3 / A4 — Haute Définition (300 DPI)"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AFFICHES };
}
