export const fr = {
  metadata: {
    title: 'CoWish — Décidez ensemble',
    description:
      'CoWish réunit les options préférées de chacun pour vous aider à choisir plus facilement.'
  },
  navigation: {
    home: 'Accueil CoWish',
    products: 'Ma liste',
    howItWorks: 'Comment ça marche',
    language: 'Langue',
    english: 'Anglais',
    french: 'Français'
  },
  products: {
    metadataTitle: 'Produits — CoWish',
    backHome: 'Retour à l’accueil',
    eyebrow: 'Catalogue de produits',
    title: 'Toutes les options envisagées.',
    introduction: 'Parcourez chaque produit importé et les informations collectées à la source.',
    loading: 'Chargement des produits…',
    emptyTitle: 'Aucun produit pour le moment',
    emptyDescription: 'Les produits importés apparaîtront ici avec leurs dernières informations.',
    errorTitle: 'Impossible de charger les produits',
    errorDescription: 'Vérifiez que l’API CoWish fonctionne, puis réessayez.',
    retry: 'Réessayer',
    import: {
      label: 'URL du produit',
      placeholder: 'https://boutique.example/produit',
      hint: 'Collez un lien pour importer son nom, son prix, sa disponibilité et son image.',
      submit: 'Ajouter le produit',
      submitting: 'Ajout…',
      error: 'Impossible d’importer ce produit. Vérifiez l’URL et réessayez.'
    },
    added: 'Ajouté',
    lastChecked: 'Dernière vérification',
    identifier: 'ID du produit',
    priceHistory_one: '{{count}} relevé de prix',
    priceHistory_other: '{{count}} relevés de prix',
    viewSource: 'Voir le produit original',
    availability: {
      in_stock: 'En stock',
      out_of_stock: 'Rupture de stock',
      unknown: 'Disponibilité inconnue'
    }
  },
  hero: {
    eyebrow: 'Les choix partagés, en plus simple',
    titleStart: 'Trouvez le choix',
    titleMiddle: 'que tout le monde',
    titleEmphasis: 'adore.',
    introduction:
      'Rassemblez vos options préférées, comparez ce qui compte et décidez en groupe—sans perdre vos idées dans la conversation.',
    action: 'Découvrir CoWish',
    illustrationLabel: 'Trois personnes choisissent leur option préférée',
    alexPick: 'Le choix d’Alex',
    cozyCabin: 'Chalet douillet',
    samPick: 'Le choix de Sam',
    beachHouse: 'Maison de plage',
    groupFavorite: 'Coup de cœur du groupe',
    forestHideaway: 'Refuge en forêt',
    activity: '3 votes · 4 commentaires'
  },
  howItWorks: {
    eyebrow: 'Comment ça marche',
    title: 'Un seul endroit pour toute la décision.',
    steps: {
      gather: {
        title: 'Rassemblez vos idées',
        description: 'Enregistrez toutes les options envisagées par votre groupe au même endroit.'
      },
      compare: {
        title: 'Comparez ensemble',
        description: 'Gardez les prix, les détails utiles et les avis de chacun côte à côte.'
      },
      choose: {
        title: 'Choisissez sereinement',
        description: 'Transformez des avis dispersés en une décision comprise de tous.'
      }
    }
  },
  footer: {
    tagline: 'De meilleurs choix, faits ensemble.'
  }
} as const;
