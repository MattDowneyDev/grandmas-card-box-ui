import { Recipe } from '../types';

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: '001',
    title: 'ROASTED CHICKEN',
    ingredients: [
      '1 whole chicken (3-4 lbs)',
      '2 tbsp coarse sea salt',
      '1 tbsp black pepper',
      '2 tbsp neutral oil or butter'
    ],
    instructions: [
      'Preheat oven to 425°F (220°C).',
      'Pat chicken completely dry with paper towels.',
      'Rub exterior and cavity liberally with salt, pepper, and oil.',
      'Place in cast iron skillet breast-side up.',
      'Roast for 50-60 minutes until internal temp reaches 165°F.',
      'Rest 10 minutes before carving. Do not touch it.'
    ],
    cookTimeMin: 60,
    tag: 'Dinner',
    warningNote: 'WARNING: IF YOU DO NOT DRY THE SKIN, IT WILL BE SOGGY AND YOU WILL BE SAD.',
    createdAt: '2024-01-10T12:00:00Z',
    isUserUpload: false,
    inMyBox: true,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '042',
    title: 'SOTTO SOUP',
    ingredients: [
      '1 can (28 oz) San Marzano whole peeled tomatoes',
      '1/2 cup heavy cream or Greek yogurt',
      '1/4 cup toasted sliced almonds & fresh herbs'
    ],
    instructions: [
      'Dump canned tomatoes and their juices into a heavy saucepan.',
      'Simmer on medium heat for 10 minutes, crushing tomatoes with a spoon.',
      'Stir in heavy cream and season with salt and cracked pepper.',
      'Ladle into a bowl and top with toasted almonds and fresh herbs.',
      'Eat immediately with crusty bread.'
    ],
    cookTimeMin: 15,
    tag: 'Quick Fix',
    warningNote: 'WARNING: THREE INGREDIENTS. DO NOT OVERTHINK THIS.',
    createdAt: '2024-01-15T14:20:00Z',
    isUserUpload: false,
    inMyBox: true,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '018',
    title: 'BRUTALIST BEEF STEW',
    ingredients: [
      '1 lb stew beef (cubed)',
      '2 large carrots (roughly chopped)',
      '3 cups beef broth or water'
    ],
    instructions: [
      'Chop everything.',
      'Sear beef in a hot pot for 4 minutes until browned.',
      'Toss in chopped carrots.',
      'Pour in liquid to submerge.',
      'Cover and simmer gently for 25-30 minutes until tender.',
      'Season with salt. Serve hot.'
    ],
    cookTimeMin: 30,
    tag: 'Dinner',
    warningNote: 'WARNING: IF THIS TAKES MORE THAN 30 MINUTES, YOU ARE DOING IT WRONG.',
    createdAt: '2024-02-01T10:00:00Z',
    isUserUpload: true,
    inMyBox: true,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '007',
    title: '10-MINUTE CACIO E PEPE',
    ingredients: [
      '200g spaghetti or bucatini',
      '1.5 cups finely grated Pecorino Romano',
      '1 tbsp freshly cracked coarse black pepper',
      'Reserved starchy pasta water'
    ],
    instructions: [
      'Boil pasta in shallow salted water until 2 minutes shy of al dente.',
      'Toast coarse black pepper in a dry wide skillet over medium heat for 1 min.',
      'Add 1/2 cup pasta water to the skillet with pepper.',
      'Transfer pasta directly into the skillet with tongs.',
      'Kill heat, dump in grated cheese, and vigorously stir to create silky emulsion.',
      'Serve immediately on warm plates.'
    ],
    cookTimeMin: 10,
    tag: 'Quick Fix',
    warningNote: 'WARNING: NEVER ADD CREAM. ROMANS WILL HAUNT YOUR DREAMS.',
    createdAt: '2024-02-05T18:30:00Z',
    isUserUpload: false,
    inMyBox: false,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281084?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '023',
    title: 'CAST IRON RIBEYE',
    ingredients: [
      '1 thick-cut bone-in ribeye steak (1.5 lb)',
      '2 tsp coarse kosher salt',
      '2 tbsp unsalted butter'
    ],
    instructions: [
      'Bring steak to room temp for 20 mins; pat bone dry with towels.',
      'Heat cast iron pan on high until smoking.',
      'Drop steak in; sear 3 minutes undisturbed.',
      'Flip steak, add butter to pan, and baste with spoon for 2-3 mins.',
      'Remove from pan onto board. Rest 6 minutes before slicing.'
    ],
    cookTimeMin: 12,
    tag: 'Dinner',
    warningNote: 'WARNING: DO NOT POKE IT EVERY FIVE SECONDS.',
    createdAt: '2024-02-10T19:00:00Z',
    isUserUpload: false,
    inMyBox: false,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '014',
    title: 'CRISPY FRIED EGGS & CHILI CRUNCH',
    ingredients: [
      '2 large eggs',
      '2 tbsp spicy chili crisp oil',
      '1 scallion (chopped)',
      '1 bowl hot steamed rice'
    ],
    instructions: [
      'Heat chili crisp in a small non-stick pan over medium heat.',
      'Crack both eggs directly into the bubbling chili oil.',
      'Cook until egg white edges are frilly, brown, and crispy (3 mins).',
      'Yolk should remain runny.',
      'Slide eggs onto steamed rice. Scatter scallions.'
    ],
    cookTimeMin: 5,
    tag: 'Quick Fix',
    warningNote: 'WARNING: CONSUME WHILE YOLK IS LIQUID.',
    createdAt: '2024-02-12T08:15:00Z',
    isUserUpload: true,
    inMyBox: true,
    servings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '031',
    title: 'COLD SESAME SOBA',
    ingredients: [
      '200g buckwheat soba noodles',
      '2 tbsp toasted sesame oil & soy sauce',
      '1 tbsp toasted sesame seeds',
      '1 cucumber (julienned)'
    ],
    instructions: [
      'Boil soba noodles for 4 minutes.',
      'Drain and immediately shock in an ice bath to stop cooking and remove starch.',
      'Whisk sesame oil and soy sauce in a shallow bowl.',
      'Toss chilled noodles in dressing with cucumber and sesame seeds.'
    ],
    cookTimeMin: 8,
    tag: 'Quick Fix',
    warningNote: 'WARNING: SHOCKING IN ICE WATER IS NON-NEGOTIABLE.',
    createdAt: '2024-02-14T13:00:00Z',
    isUserUpload: false,
    inMyBox: false,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '055',
    title: 'SMASH BURGER WITH CRISPY EDGES',
    ingredients: [
      '1/3 lb 80/20 ground chuck (split into two 2.5oz balls)',
      '2 slices American cheese',
      '1 brioche potato bun (toasted)',
      'Pinch coarse salt and pepper'
    ],
    instructions: [
      'Get stainless steel or cast iron skillet blistering hot.',
      'Place beef balls in skillet; smash completely flat with a sturdy metal spatula.',
      'Season tops aggressively with salt and pepper.',
      'Cook 2 minutes until lace edges are dark and crispy.',
      'Scrape up and flip, immediately slap cheese on top, and stack onto toasted bun.'
    ],
    cookTimeMin: 8,
    tag: 'Dinner',
    warningNote: 'WARNING: SMASH ONCE AND LEAVE IT ALONE.',
    createdAt: '2024-02-15T20:00:00Z',
    isUserUpload: true,
    inMyBox: false,
    servings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '062',
    title: 'BLISTERED SHISHITO PEPPERS',
    ingredients: [
      '1/2 lb fresh shishito peppers',
      '1 tbsp high-heat sesame or avocado oil',
      'Flaky Maldon sea salt',
      '1 lemon wedge'
    ],
    instructions: [
      'Dry peppers thoroughly.',
      'Heat oil in a skillet over high heat until shimmering.',
      'Add peppers in a single layer.',
      'Cook for 4-5 minutes, tossing occasionally until blistered and charred in spots.',
      'Transfer to plate, squeeze lemon, and shower with flaky salt.'
    ],
    cookTimeMin: 6,
    tag: 'Quick Fix',
    warningNote: 'WARNING: 1 IN 10 IS SPICY. EMBRACE THE ROULETTE.',
    createdAt: '2024-02-18T17:45:00Z',
    isUserUpload: false,
    inMyBox: false,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22521?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '088',
    title: 'ONE-PAN CRISPY SALMON',
    ingredients: [
      '2 salmon fillets (skin on)',
      '1 tbsp olive oil',
      '1 lemon (sliced into rounds)',
      '2 sprigs fresh dill or thyme'
    ],
    instructions: [
      'Score salmon skin lightly with a sharp knife and pat dry.',
      'Season skin side with heavy salt.',
      'Heat pan with oil over medium-high heat.',
      'Place salmon skin-side down; press lightly for 30s to keep skin flat.',
      'Cook 6 minutes skin down until 80% cooked and skin is glass-shattering crisp.',
      'Flip for 1 minute with lemon slices and herbs, then remove.'
    ],
    cookTimeMin: 12,
    tag: 'Dinner',
    warningNote: 'WARNING: 90% OF THE COOK TIME HAPPENS ON THE SKIN SIDE.',
    createdAt: '2024-02-20T19:10:00Z',
    isUserUpload: false,
    inMyBox: false,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '094',
    title: 'WHIPPED RICOTTA TOAST',
    ingredients: [
      '2 thick slices artisan sourdough bread',
      '1 cup whole milk ricotta cheese',
      '2 tbsp hot honey & flaky salt'
    ],
    instructions: [
      'Whip ricotta in a bowl with a fork or whisk with a drop of olive oil until silky.',
      'Toast sourdough until dark and sturdy.',
      'Slather generous layer of whipped ricotta across hot toast.',
      'Drizzle with hot chili honey and finish with coarse sea salt.'
    ],
    cookTimeMin: 4,
    tag: 'Quick Fix',
    warningNote: 'WARNING: USE WHOLE MILK RICOTTA OR DO NOT BOTHER.',
    createdAt: '2024-02-22T11:00:00Z',
    isUserUpload: false,
    inMyBox: false,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '102',
    title: 'GARLIC CONFIT PASTA',
    ingredients: [
      '20 cloves garlic (peeled)',
      '1/2 cup extra virgin olive oil',
      '250g rigatoni or penne',
      'Fresh grated parmesan & red pepper flakes'
    ],
    instructions: [
      'Simmer garlic cloves in olive oil on the lowest possible flame for 20 mins until soft as butter.',
      'Boil pasta in salted water.',
      'Mash half the garlic cloves into the warm fragrant oil.',
      'Toss hot drained pasta directly into the garlic oil with parmesan.',
      'Top with the remaining whole soft cloves and chili flakes.'
    ],
    cookTimeMin: 22,
    tag: 'Dinner',
    warningNote: 'WARNING: DO NOT BURN THE GARLIC. KEEP FLAME ULTRA LOW.',
    createdAt: '2024-02-25T18:00:00Z',
    isUserUpload: false,
    inMyBox: false,
    servings: 3,
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80'
  }
];
