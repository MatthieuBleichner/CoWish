export const en = {
  metadata: {
    title: 'CoWish — Decide together',
    description: "CoWish brings everyone's favorite options together, so choosing feels easier."
  },
  navigation: {
    home: 'CoWish home',
    products: 'My products',
    howItWorks: 'How it works',
    language: 'Language',
    english: 'English',
    french: 'French'
  },
  products: {
    metadataTitle: 'Products — CoWish',
    backHome: 'Back to home',
    eyebrow: 'Product library',
    title: 'Everything you’re considering.',
    introduction: 'Browse every imported product and the details collected from its source.',
    loading: 'Loading products…',
    emptyTitle: 'No products yet',
    emptyDescription: 'Imported products will appear here with their latest metadata.',
    errorTitle: 'Products could not be loaded',
    errorDescription: 'Check that the CoWish API is running, then try again.',
    retry: 'Try again',
    added: 'Added',
    lastChecked: 'Last checked',
    identifier: 'Product ID',
    priceHistory_one: '{{count}} price observation',
    priceHistory_other: '{{count}} price observations',
    viewSource: 'View original product',
    availability: {
      in_stock: 'In stock',
      out_of_stock: 'Out of stock',
      unknown: 'Availability unknown'
    }
  },
  hero: {
    eyebrow: 'Shared choices, made simpler',
    titleStart: 'Find the choice',
    titleMiddle: 'everyone',
    titleEmphasis: 'loves.',
    introduction:
      'Bring your favorite options together, compare what matters, and make decisions as a group—without losing ideas in the chat.',
    action: 'Discover CoWish',
    illustrationLabel: 'Three people choosing their shared favorite',
    alexPick: 'Alex’s pick',
    cozyCabin: 'Cozy cabin',
    samPick: 'Sam’s pick',
    beachHouse: 'Beach house',
    groupFavorite: 'Group favorite',
    forestHideaway: 'Forest hideaway',
    activity: '3 votes · 4 comments'
  },
  howItWorks: {
    eyebrow: 'How it works',
    title: 'One place for the whole decision.',
    steps: {
      gather: {
        title: 'Gather ideas',
        description: 'Save all the options your group is considering in one shared place.'
      },
      compare: {
        title: 'Compare together',
        description: 'Keep prices, useful details, and everyone’s thoughts side by side.'
      },
      choose: {
        title: 'Choose with confidence',
        description: 'Turn scattered opinions into a decision everyone understands.'
      }
    }
  },
  footer: {
    tagline: 'Better choices, made together.'
  }
} as const;
