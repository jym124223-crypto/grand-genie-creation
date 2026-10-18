/**
 * Base de données des vidéos et des thèmes
 * Chaîne : « Le Grand Génie de la Création »
 * 
 * GUIDE POUR AJOUTER UNE NOUVELLE VIDÉO :
 * 1. Dupliquez un bloc d'objet vidéo ci-dessous.
 * 2. Remplissez : id, slug, title, theme, youtubeId, summary, date, readTime, thumbnail.
 * 3. Rédigez le contenu complet de la version écrite dans 'content' (avec balises H2, H3, paragraphes, citations).
 * 4. Définissez les 'keyTakeaways' (3 points clés à retenir).
 */

const THEMES = {
  'cosmologie': {
    id: 'cosmologie',
    name: 'Cosmologie',
    tagline: 'L\'immensité réglée au millimètre près',
    description: 'De l\'origine de l\'espace-temps à l\'extraordinaire réglage des constantes cosmologiques : découvrez pourquoi l\'univers semble avoir été conçu pour accueillir la vie.',
    image: 'assets/images/theme-cosmologie.jpg',
    videoCount: 2
  },
  'adn-vivant': {
    id: 'adn-vivant',
    name: 'ADN et le vivant',
    tagline: 'L\'information numérique au cœur de chaque cellule',
    description: 'La molécule d\'ADN, les nanomachines d\'édition et la complexité irréductible des organismes vivants révèlent une densité d\'information qui défie le pur hasard matériel.',
    image: 'assets/images/theme-adn-vivant.jpg',
    videoCount: 2
  },
  'physique': {
    id: 'physique',
    name: 'Physique',
    tagline: 'Les lois inébranlables et les constantes universelles',
    description: 'La constante de structure fine, la gravitation, l\'interaction forte et les symétries quantiques : la physique fondamentale témoigne d\'un ordre mathématique sublime.',
    image: 'assets/images/theme-physique.jpg',
    videoCount: 1
  },
  'grands-scientifiques': {
    id: 'grands-scientifiques',
    name: 'Grands scientifiques',
    tagline: '« Penser les pensées du Créateur après Lui »',
    description: 'Newton, Kepler, Maxwell, Faraday, Pasteur, Planck : explorez les écrits et la démarche des pères fondateurs de la science moderne qui puisaient leur génie dans l\'émerveillement de la Création.',
    image: 'assets/images/theme-grands-scientifiques.jpg',
    videoCount: 1
  }
};

const VIDEOS = [
  {
    id: 'nobel-medecine-2026-code-cache',
    slug: 'nobel-medecine-2026-code-cache',
    title: 'Le Code Caché du Vivant : Hasard aveugle ou Chef-d\'Œuvre d\'Ingénierie ?',
    featured: true,
    theme: 'adn-vivant',
    themeLabel: 'ADN et le vivant',
    youtubeId: '74L73K6rG48', // ID de démo, facilement remplaçable
    youtubeUrl: 'https://www.youtube.com/watch?v=74L73K6rG48',
    summary: 'Plongée vertigineuse au cœur de la cellule : quand les nanomachines biologiques, la densité d\'information numérique de l\'ADN et les mécanismes d\'auto-réparation défient les explications matérialistes et pointent vers un Génie programmateur.',
    date: '12 Octobre 2026',
    datePublished: '2026-10-12T10:00:00+02:00',
    readTime: '8 min de lecture',
    duration: 'PT14M32S',
    thumbnail: 'assets/images/thumb-adn-code.jpg',
    keyTakeaways: [
      'L\'ADN stocke l\'information avec une densité un milliard de fois supérieure à nos disques durs de pointe.',
      'Les machines moléculaires comme les polymérases possèdent des systèmes de relecture et de correction d\'erreurs comparables aux algorithmes informatiques les plus sophistiqués.',
      'Partout dans l\'expérience humaine, un code informatique ou textuel provient invariablement d\'un esprit intelligent.'
    ],
    content: `
      <p class="article-lead">
        Lorsque James Watson et Francis Crick ont identifié la structure en double hélice de l'ADN en 1953, ils n'ont pas seulement découvert une molécule chimique. Sans s'en rendre pleinement compte sur le moment, ils ont mis au jour le système de traitement de l'information le plus sophistiqué, le plus dense et le plus robuste de tout l'univers connu.
      </p>

      <h2>1. Une densité d'information qui humilie notre technologie</h2>
      <p>
        Imaginez un instant que vous deviez stocker l'intégralité des connaissances humaines accumulées depuis l'aube de la civilisation : chaque livre imprimé, chaque film tourné, chaque fichier informatique, chaque recherche scientifique. Avec notre technologie sur silicium la plus avancée, il nous faudrait d'immenses centres de données de plusieurs hectares, consommant des mégawatts d'électricité.
      </p>
      <p>
        Dans le vivant, la réponse est tout autre : <strong>un seul gramme d'ADN peut théoriquement contenir jusqu'à 215 pétaoctets de données</strong>. Cela équivaut à 215 millions de gigaoctets dans un volume plus petit qu'une tête d'épingle. Mais la prouesse ne s'arrête pas au stockage ; elle réside dans son architecture logique.
      </p>

      <blockquote class="article-quote">
        « La biologie est l'étude de choses compliquées qui donnent l'impression d'avoir été conçues pour un but précis. »
        <cite>— Richard Dawkins, biologiste</cite>
      </blockquote>

      <h2>2. Le code génétique : un langage formel à 4 lettres</h2>
      <p>
        L'ADN n'est pas une simple chaîne de matière inerte réagissant passivement. C'est un code quaternaire digital composé de quatre bases azotées : l'Adénine (A), la Thymine (T), la Cytosine (C) et la Guanine (G). Exactement comme le binaire (0 et 1) commande les logiciels de nos ordinateurs, des triplets de ces bases (les codons) dictent précisément l'assemblage des 20 acides aminés qui formeront les protéines indispensables à la vie.
      </p>
      <p>
        Or, en théorie de l'information, une règle universelle n'a jamais été prise en défaut : <em>une information symbolique complexe et spécifiée ne naît jamais du hasard aveugle ou des simples lois de la chimie inorganique</em>. La physique et la chimie expliquent le support (le papier et l'encre, ou la molécule de sucre et de phosphate), mais elles n'expliquent pas le message (la phrase écrite sur le papier). Le message transcende son support.
      </p>

      <h2>3. Les nanomachines d'édition et la réparation en temps réel</h2>
      <p>
        Ce qui bouleverse encore davantage les observateurs attentifs, c'est ce qui se produit lors de la réplication de l'ADN. Des enzymes spécialisées avancent à une vitesse stupéfiante tout en effectuant un travail de relecture d'une précision chirurgicale :
      </p>
      <ul>
        <li><strong>L'Hélicase</strong> : un moteur moléculaire qui déroule la double hélice à des centaines de tours par seconde sans jamais rompre la chaîne.</li>
        <li><strong>L'ADN Polymérase</strong> : un copieur ultra-rapide qui ne commet qu'une erreur pour 100 000 bases insérées.</li>
        <li><strong>Les complexes de réparation (Mismatch Repair)</strong> : un véritable antivirus intégré qui patrouille, détecte l'erreur, découpe la mauvaise base et la remplace, portant le taux de fidélité finale à une seule erreur pour un milliard de bases !</li>
      </ul>

      <div class="article-callout">
        <h4>Le paradoxe de la poule et de l'œuf moléculaire</h4>
        <p>
          Pour fabriquer des protéines, la cellule a impérativement besoin des instructions encodées dans l'ADN. Mais pour lire, transcrire et répliquer l'ADN, la cellule a impérativement besoin de protéines et d'enzymes déjà pleinement formées. Aucun des deux systèmes ne peut fonctionner sans l'autre. Comment un tel système interdépendant aurait-il pu s'échafauder pas à pas par des processus non guidés ?
        </p>
      </div>

      <h2>4. La conclusion qui s'impose à l'esprit rationnel</h2>
      <p>
        Quand vous marchez sur une plage et trouvez écrit dans le sable : <em>« Jean-Yves était ici ce matin »</em>, vous ne concluez jamais que le va-et-vient des vagues ou le souffle du vent ont arrangé les grains de silice de cette manière. Vous reconnaissez instantanément la trace d'un esprit intelligent capable de conceptualisation.
      </p>
      <p>
        Au cœur de chacune des 30 000 milliards de cellules de votre corps se trouve une bibliothèque de 3,2 milliards de lettres d'instructions d'une perfection inouïe. La science ne détruit pas l'émerveillement : elle dévoile la signature indéniable d'un Grand Génie de la Création.
      </p>
    `
  },
  {
    id: 'ajustement-fin-constantes-cosmologiques',
    slug: 'ajustement-fin-constantes-cosmologiques',
    title: 'L\'Ajustement Fin de l\'Univers : La Signature Mathématique d\'un Esprit ?',
    featured: false,
    theme: 'cosmologie',
    themeLabel: 'Cosmologie',
    youtubeId: 'dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    summary: 'Si la constante gravitationnelle ou l\'énergie noire variaient d\'une fraction infinitésimale de milliardième, aucune étoile, aucune chimie et aucune vie ne pourraient exister. Coïncidence fortuite ou intention cosmique ?',
    date: '28 Septembre 2026',
    datePublished: '2026-09-28T10:00:00+02:00',
    readTime: '10 min de lecture',
    duration: 'PT16M45S',
    thumbnail: 'assets/images/theme-cosmologie.jpg',
    keyTakeaways: [
      'Plus d\'une trentaine de constantes physiques fondamentales doivent se situer dans un intervalle hyper-étroit pour autoriser l\'existence de la matière et de la vie.',
      'La constante cosmologique Lambda présente un réglage fin d\'une précision de 1 sur 10 puissance 120.',
      'Le recours au multivers invérifiable ne fait que repousser le problème du réglage fin du générateur d\'univers.'
    ],
    content: `
      <p class="article-lead">
        Au cours des cinquante dernières années, les astrophysiciens et cosmologistes ont été confrontés à une découverte inattendue qui a ébranlé les certitudes matérialistes : les lois de la physique et les paramètres initiaux de notre univers sont réglés avec une précision si vertigineuse que le moindre écart microscopique aurait rendu l'univers stérile et chaotique.
      </p>

      <h2>1. Les boutons de réglage de la réalité</h2>
      <p>
        Imaginez entrer dans la salle de contrôle de l'univers. Sur le tableau de bord, plusieurs dizaines de curseurs déterminent les valeurs fondamentales de la réalité : la force de gravitation, l'interaction nucléaire forte, la masse de l'électron, la vitesse de la lumière, la constante cosmologique.
      </p>
      <p>
        Si vous modifiez l'un de ces curseurs, même d'un millième de pourcent, les conséquences sont apocalyptiques :
      </p>
      <ul>
        <li><strong>L'interaction nucléaire forte</strong> : Si elle était à peine 2 % plus forte, tout l'hydrogène aurait brûlé dans les premières minutes du Big Bang, empêchant la formation d'eau et d'étoiles stables comme le Soleil. Si elle était 5 % plus faible, les atomes complexes comme le carbone et l'oxygène ne pourraient pas se lier.</li>
        <li><strong>La gravitation (G)</strong> : Si elle était légèrement plus puissante, les étoiles s'effondreraient en trous noirs avant même que la vie n'ait le temps de poindre. Si elle était un tantinet plus faible, aucune galaxie ne se condenserait.</li>
      </ul>

      <blockquote class="article-quote">
        « Une interprétation de bon sens des faits suggère qu'un super-intellect a trafiqué la physique, ainsi que la chimie et la biologie. »
        <cite>— Sir Fred Hoyle, astrophysicien émérite</cite>
      </blockquote>

      <h2>2. Le cas extrême de la constante cosmologique Lambda</h2>
      <p>
        Le physicien théoricien Leonard Susskind et le prix Nobel Steven Weinberg ont souligné que la densité de l'énergie sombre (qui régit l'expansion accélérée de l'univers) est ajustée à <strong>une précision d'une part pour 10<sup>120</sup></strong>.
      </p>
      <p>
        Pour visualiser ce que représente 10<sup>120</sup>, imaginez viser une cible de la taille d'une pièce de monnaie située à l'autre bout de l'univers observable avec une précision absolue du premier coup. Si la valeur avait été légèrement plus forte, l'espace se serait dispersé trop vite pour que des nébuleuses se forment ; si elle avait été légèrement négative, l'univers se serait immédiatement recroquevillé sur lui-même.
      </p>

      <h2>3. Le multivers : solution scientifique ou échappatoire métaphysique ?</h2>
      <p>
        Face à ce constat accablant, certains partisans du matérialisme invoquent l'hypothèse du multivers : s'il existe une infinité d'univers aléatoires, nous serions simplement tombés par hasard dans le bon. 
      </p>
      <p>
        Cependant, cette idée pose deux difficultés majeures : premièrement, elle ne repose sur aucune preuve observationnelle et relève de la spéculation pure. Deuxièmement, tout mécanisme théorique capable de générer des milliards d'univers (comme l'inflation éternelle ou la théorie des cordes) nécessiterait lui-même des lois physiques et des réglages initiaux encore plus complexes !
      </p>

      <h2>4. Une création pensée pour être contemplée</h2>
      <p>
        Plus la cosmologie progresse, plus elle confirme l'intuition que l'univers n'est pas un accident sans lendemain dans le vide sidéral. L'harmonie mathématique profonde des lois du cosmos pointe avec force vers une intention délibérée, ordonnée avec une sagesse et une maîtrise infinies.
      </p>
    `
  },
  {
    id: 'constante-structure-fine-137',
    slug: 'constante-structure-fine-137',
    title: 'Le Mystère du Nombre 137 et les Lois Inébranlables de la Physique',
    featured: false,
    theme: 'physique',
    themeLabel: 'Physique',
    youtubeId: 'dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    summary: 'De Richard Feynman à Wolfgang Pauli, le nombre sans dimension alpha (~1/137) fascine les physiciens. Pourquoi les lois fondamentales sont-elles si précisément paramétrées pour permettre la stabilité de la matière ?',
    date: '15 Septembre 2026',
    datePublished: '2026-09-15T10:00:00+02:00',
    readTime: '9 min de lecture',
    duration: 'PT13M10S',
    thumbnail: 'assets/images/theme-physique.jpg',
    keyTakeaways: [
      'La constante de structure fine alpha (~1/137.036) est un nombre pur sans unité qui gouverne l\'électrodynamique quantique.',
      'Elle détermine la force de liaison entre les électrons et les noyaux atomiques, régissant ainsi toute la chimie.',
      'Les physiciens n\'ont aucune équation pour déduire ce nombre : il apparaît comme une constante délibérément posée dans les fondations du cosmos.'
    ],
    content: `
      <p class="article-lead">
        Il existe en physique un nombre qui hante les esprits des plus grands chercheurs depuis plus d'un siècle. Il ne possède ni mètres, ni kilogrammes, ni secondes : c'est un nombre pur, sans dimension, d'une valeur approximative de 1/137,035999...
      </p>

      <h2>1. Le chiffre qui obsédait Feynman et Pauli</h2>
      <p>
        Le célèbre prix Nobel Richard Feynman écrivait à propos de ce nombre :
      </p>
      <blockquote class="article-quote">
        « C'est un des plus grands mystères de la physique : un nombre magique qui nous arrive sans qu'aucun homme ne le comprenne. Vous pourriez dire que la "main de Dieu" a écrit ce nombre, et que nous ne savons pas comment Il a poussé Son crayon. »
        <cite>— Richard Feynman, QED : L'étrange théorie de la lumière et de la matière</cite>
      </blockquote>
      <p>
        Cette constante, notée alpha (α), combine la charge élémentaire de l'électron, la constante de Planck et la vitesse de la lumière : <code>α = e² / (4πε₀ ħ c)</code>.
      </p>

      <h2>2. Pourquoi ce nombre garantit notre existence</h2>
      <p>
        La constante de structure fine dicte la manière dont les photons interagissent avec les particules chargées. Si sa valeur était différente :
      </p>
      <ul>
        <li><strong>Si alpha était supérieur</strong> : Les électrons seraient attirés trop violemment vers le noyau atomique. Les réactions chimiques ne pourraient pas se produire, et les liaisons moléculaires stables seraient impossibles.</li>
        <li><strong>Si alpha était inférieur</strong> : Les électrons ne resteraient pas en orbite autour des atomes. La matière ne pourrait jamais se condenser en molécules solides ou liquides.</li>
      </ul>

      <h2>3. L'univers : une partition mathématique</h2>
      <p>
        Ce qui frappe l'esprit scientifique, c'est l'intelligibilité du monde. Pourquoi l'univers obéit-il à des lois mathématiques si pures et si élégantes ? Pourquoi notre esprit humain est-il capable de décrypter ces équations cosmiques ?
      </p>
      <p>
        Cette correspondance intime entre les mathématiques abstraites de l'esprit et la réalité physique concrète trouve son explication la plus naturelle dans l'existence d'un Esprit premier, qui a pensé le monde avec géométrie et raison.
      </p>
    `
  },
  {
    id: 'newton-kepler-visionnaires-createur',
    slug: 'newton-kepler-visionnaires-createur',
    title: 'Newton, Kepler, Maxwell : Pourquoi les Géants de la Science Croyaient au Créateur',
    featured: false,
    theme: 'grands-scientifiques',
    themeLabel: 'Grands scientifiques',
    youtubeId: 'dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    summary: 'Loin d\'opposer foi et science, les pères de la révolution scientifique cherchaient à "penser les pensées de Dieu après Lui". Retour sur les citations et manuscrits originaux de ces bâtisseurs du savoir.',
    date: '02 Septembre 2026',
    datePublished: '2026-09-02T10:00:00+02:00',
    readTime: '11 min de lecture',
    duration: 'PT18M20S',
    thumbnail: 'assets/images/theme-grands-scientifiques.jpg',
    keyTakeaways: [
      'La révolution scientifique moderne est née dans un terreau intellectuel qui postulait un univers ordonné et intelligible créé par un Dieu rationnel.',
      'Isaac Newton considérait la gravitation comme la démonstration éclatante d\'un gouvernement intelligent du système solaire.',
      'Johannes Kepler et James Clerk Maxwell puisaient leur motivation de recherche dans l\'émerveillement face aux lois divines.'
    ],
    content: `
      <p class="article-lead">
        Une idée reçue moderne voudrait faire croire que la démarche scientifique s'est construite en opposition à la notion d'un Créateur intelligent. L'Histoire des sciences raconte pourtant une trajectoire exactement inverse : c'est précisément parce que les premiers savants croyaient en un Législateur rationnel qu'ils ont osé chercher des lois dans la nature.
      </p>

      <h2>1. Isaac Newton et le système du monde</h2>
      <p>
        Considéré comme l'un des plus grands esprits de tous les temps, Sir Isaac Newton n'a pas rédigé ses <em>Principia Mathematica</em> pour exclure Dieu du réel. Dans le célèbre « Scolie Général » de son œuvre maîtresse, il écrit :
      </p>
      <blockquote class="article-quote">
        « Cet arrangement si magnifique du soleil, des planètes et des comètes n'a pu être le produit que du conseil et de la domination d'un Être puissant et intelligent. »
        <cite>— Isaac Newton, Principia Mathematica (1687)</cite>
      </blockquote>

      <h2>2. Johannes Kepler : penser les pensées du Créateur</h2>
      <p>
        Lorsque Kepler découvre les lois mathématiques décrivant les orbites elliptiques des planètes, il est submergé par une joie mystique et intellectuelle. Dans son traité <em>Harmonices Mundi</em>, il s'exclame :
      </p>
      <blockquote class="article-quote">
        « Je Vous rends grâce, Créateur et Seigneur, de m'avoir accordé cette joie dans Votre création, ce ravissement devant les œuvres de Vos mains... J'ai simplement pensé Vos pensées après Vous. »
        <cite>— Johannes Kepler</cite>
      </blockquote>

      <h2>3. James Clerk Maxwell et Max Planck : la continuité de l'esprit</h2>
      <p>
        Au XIXe et XXe siècles, la tradition s'est poursuivie avec James Clerk Maxwell (qui a unifié l'électricité, le magnétisme et l'optique) et Max Planck (père de la mécanique quantique). Tous deux rejetaient le matérialisme réducteur et considéraient la conscience et l'esprit comme la matrice première de la matière.
      </p>
      <p>
        Étudier la science, c'est contempler le chef-d'œuvre à la loupe. Loin d'éteindre l'admiration pour le Génie créateur, la rigueur scientifique l'amplifie et lui donne des fondements inébranlables.
      </p>
    `
  },
  {
    id: 'atp-synthase-le-moteur-rotatif-qui-defie-l-evolution',
    slug: 'atp-synthase-le-moteur-rotatif-qui-defie-l-evolution',
    title: 'L\'ATP Synthase : Le Moteur Rotatif Moléculaire Qui Défie le Hasard',
    featured: false,
    theme: 'adn-vivant',
    themeLabel: 'ADN et le vivant',
    youtubeId: 'dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    summary: 'Tournant à près de 9 000 tours par minute à l\'échelle nanométrique, l\'ATP synthase produit le carburant énergétique de toutes vos cellules. Pourquoi cette machine est-elle un exemple parfait de complexité irréductible ?',
    date: '18 Août 2026',
    datePublished: '2026-08-18T10:00:00+02:00',
    readTime: '7 min de lecture',
    duration: 'PT11M50S',
    thumbnail: 'assets/images/theme-adn-vivant.jpg',
    keyTakeaways: [
      'L\'ATP synthase est un véritable moteur rotatif avec rotor, stator, arbre à cames et générateur catalytique.',
      'Son rendement énergétique frôle les 100%, surpassant tous les moteurs jamais conçus par l\'industrie humaine.',
      'Toutes ses sous-unités doivent être présentes et ajustées simultanément pour produire la moindre molécule d\'ATP.'
    ],
    content: `
      <p class="article-lead">
        Dans la membrane de chacune de vos mitochondries tourne actuellement un moteur électrique plus performant qu'une turbine de Formule 1. Il mesure à peine 10 nanomètres de diamètre et génère le carburant chimique universel de la vie : l'adénosine triphosphate (ATP).
      </p>

      <h2>1. Une merveille de micromécanique</h2>
      <p>
        Découverte et modélisée grâce aux travaux des prix Nobel Paul Boyer et John Walker, l'ATP synthase est composée de deux parties principales :
      </p>
      <ul>
        <li><strong>Le rotor F₀</strong> : un anneau intégré dans la membrane cellulaire entraîné par le flux de protons (H⁺), tournant à près de 150 tours par seconde.</li>
        <li><strong>Le stator et l'axe F₁</strong> : un axe excentrique qui déforme les sous-unités catalytiques pour forcer la liaison chimique entre l'ADP et un phosphate inorganique.</li>
      </ul>

      <h2>2. Le défi de la complexité irréductible</h2>
      <p>
        Un moteur sans axe ne tourne pas. Un stator sans fixation se met à tourner sur lui-même et annule la production d'énergie. Une enzyme sans canal de protons reste immobile. 
      </p>
      <p>
        Pour que l'organisme bénéficie d'une seule molécule d'ATP, <em>l'ensemble du système mécanique et électrochimique doit être opérationnel dès le premier instant</em>. La sélection naturelle ne peut retenir que ce qui confère un avantage fonctionnel immédiat ; elle ne peut pas anticiper l'assemblage futur de pièces détachées inutiles prises isolément.
      </p>

      <h2>3. Un témoignage d'ingénierie suprême</h2>
      <p>
        Quand nous voyons une turbine hydroélectrique, nul ne doute de l'intervention d'ingénieurs talentueux. Voir une machine dix millions de fois plus petite, fonctionnant avec un rendement proche de 100 %, et attribuer son existence au pur hasard aveugle heurte le bon sens rationnel.
      </p>
    `
  },
  {
    id: 'big-bang-commencement-espace-temps',
    slug: 'big-bang-commencement-espace-temps',
    title: 'Avant le Big Bang : Quand la Cosmologie Moderne Rencontre le Début Absolu',
    featured: false,
    theme: 'cosmologie',
    themeLabel: 'Cosmologie',
    youtubeId: 'dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    summary: 'Le théorème cosmologique de Borde-Guth-Vilenkin démontre que tout univers en expansion moyenne dans le passé doit avoir eu un commencement temporel absolu. Quelles sont les conséquences incontournables de cette frontière ?',
    date: '04 Août 2026',
    datePublished: '2026-08-04T10:00:00+02:00',
    readTime: '8 min de lecture',
    duration: 'PT15M05S',
    thumbnail: 'assets/images/hero-cosmic.jpg',
    keyTakeaways: [
      'La relativité générale d\'Einstein et le théorème BGV confirment que l\'espace, le temps et la matière ont surgi ensemble.',
      'La cause première de l\'univers doit être non-spatiale, intemporelle, immatérielle et dotée d\'une puissance incommensurable.',
      'Le matérialisme du XIXe siècle fondé sur un univers éternel et statique a été définitivement invalidé par l\'astrophysique contemporaine.'
    ],
    content: `
      <p class="article-lead">
        Pendant des siècles, la philosophie matérialiste s'est reposée sur un axiome confortable : l'univers matériel aurait toujours existé. Si la matière est éternelle, nul besoin de chercher un Auteur à son apparition. Or, au XXe siècle, la cosmologie observationnelle et théorique a pulvérisé ce postulat.
      </p>

      <h2>1. Le triomphe de l'expansion cosmique</h2>
      <p>
        Grâce aux calculs de Georges Lemaître et aux observations télescopiques d'Edwin Hubble, puis à la détection du rayonnement fossile par Penzias et Wilson en 1965, la science a confirmé que l'univers est en expansion. En remontant le film du cosmos à l'envers, toute la matière, l'énergie, mais aussi <strong>l'espace et le temps eux-mêmes</strong> se rejoignent en une singularité initiale il y a environ 13,8 milliards d'années.
      </p>

      <h2>2. Le théorème de Borde-Guth-Vilenkin (BGV)</h2>
      <p>
        En 2003, les cosmologistes Arvin Borde, Alan Guth et Alexander Vilenkin ont établi un théorème mathématique fondamental : <em>tout univers qui présente un taux d'expansion moyen supérieur à zéro doit nécessairement posséder une limite temporelle passée</em>.
      </p>
      <p>
        Ce théorème s'applique à l'univers observable, mais également aux scénarios de multivers ou de branes cosmologiques. Comme l'a déclaré Alexander Vilenkin lui-même :
      </p>
      <blockquote class="article-quote">
        « Tous les éléments de preuve dont nous disposons indiquent que l'univers a eu un commencement. Les physiciens ne peuvent plus s'abriter derrière la possibilité d'un univers passé éternel : il n'y a pas d'échappatoire. »
        <cite>— Alexander Vilenkin, cosmologiste à l'Université Tufts</cite>
      </blockquote>

      <h2>3. La nature de la Cause Première</h2>
      <p>
        Puisque l'espace, le temps et la matière ont commencé d'exister à cet instant initial :
      </p>
      <ul>
        <li>La cause qui a créé l'espace ne peut pas être spatiale.</li>
        <li>La cause qui a créé le temps doit être intemporelle (éternelle).</li>
        <li>La cause qui a créé la matière doit être immatérielle.</li>
        <li>La décision de passer d'un état statique à un univers en création implique une volonté et une intelligence personnelle.</li>
      </ul>
      <p>
        L'astrophysique la plus moderne ne s'éloigne pas de l'idée d'un Créateur : elle en dessine les contours avec une netteté mathématique saisissante.
      </p>
    `
  }
];

// Fonctions utilitaires
function getFeaturedVideo() {
  return VIDEOS.find(v => v.featured) || VIDEOS[0];
}

function getVideoById(id) {
  if (!id) return null;
  return VIDEOS.find(v => v.id.toLowerCase() === id.toLowerCase() || v.slug.toLowerCase() === id.toLowerCase());
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
