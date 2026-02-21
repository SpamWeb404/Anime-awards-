import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.upsert({
      where: { slug: 'first-vote' },
      update: {},
      create: {
        name: 'First Binding',
        slug: 'first-vote',
        description: 'Cast your first vote in the realm',
        icon: '💫',
        rarity: 'common',
        condition: 'first_vote',
      },
    }),
    prisma.achievement.upsert({
      where: { slug: 'hidden-gem-hunter' },
      update: {},
      create: {
        name: 'Hidden Gem Hunter',
        slug: 'hidden-gem-hunter',
        description: 'Vote for 3 hidden gems (high quality, low votes)',
        icon: '💎',
        rarity: 'rare',
        condition: 'hidden_gem_hunter',
      },
    }),
    prisma.achievement.upsert({
      where: { slug: 'completionist' },
      update: {},
      create: {
        name: 'Completionist',
        slug: 'completionist',
        description: 'Vote in all categories',
        icon: '🏆',
        rarity: 'epic',
        condition: 'completionist',
      },
    }),
    prisma.achievement.upsert({
      where: { slug: 'early-soul' },
      update: {},
      create: {
        name: 'Early Soul',
        slug: 'early-soul',
        description: 'Vote within 24 hours of the awards opening',
        icon: '⚡',
        rarity: 'rare',
        condition: 'early_soul',
      },
    }),
    prisma.achievement.upsert({
      where: { slug: 'loyal-spirit' },
      update: {},
      create: {
        name: 'Loyal Spirit',
        slug: 'loyal-spirit',
        description: 'Return to the realm for 3 consecutive days',
        icon: '🔥',
        rarity: 'epic',
        condition: 'loyal_spirit',
      },
    }),
    prisma.achievement.upsert({
      where: { slug: 'dedicated-voter' },
      update: {},
      create: {
        name: 'Dedicated Voter',
        slug: 'dedicated-voter',
        description: 'Cast 10 or more votes',
        icon: '⭐',
        rarity: 'legendary',
        condition: 'dedicated_voter',
      },
    }),
  ]);

  console.log(`Created ${achievements.length} achievements`);

  // Create default categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'best-action' },
      update: {},
      create: {
        name: 'Best Action',
        slug: 'best-action',
        element: 'fire',
        description: 'Heart-pounding battles and adrenaline-fueled sequences',
        order: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'best-drama' },
      update: {},
      create: {
        name: 'Best Drama',
        slug: 'best-drama',
        element: 'water',
        description: 'Emotional stories that moved our souls',
        order: 2,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'best-comedy' },
      update: {},
      create: {
        name: 'Best Comedy',
        slug: 'best-comedy',
        element: 'light',
        description: 'Series that made us laugh out loud',
        order: 3,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'best-romance' },
      update: {},
      create: {
        name: 'Best Romance',
        slug: 'best-romance',
        element: 'cosmos',
        description: 'Love stories that warmed our hearts',
        order: 4,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'best-fantasy' },
      update: {},
      create: {
        name: 'Best Fantasy',
        slug: 'best-fantasy',
        element: 'nature',
        description: 'Magical worlds and impossible adventures',
        order: 5,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'best-sci-fi' },
      update: {},
      create: {
        name: 'Best Sci-Fi',
        slug: 'best-sci-fi',
        element: 'thunder',
        description: 'Futuristic visions and technological wonders',
        order: 6,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'best-villain' },
      update: {},
      create: {
        name: 'Best Villain',
        slug: 'best-villain',
        element: 'shadow',
        description: 'Antagonists we loved to hate',
        order: 7,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'best-slice-of-life' },
      update: {},
      create: {
        name: 'Best Slice of Life',
        slug: 'best-slice-of-life',
        element: 'wind',
        description: 'Quiet moments of everyday beauty',
        order: 8,
        isActive: true,
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Create a default voting period
  const votingPeriod = await prisma.votingPeriod.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Isekai Awards 2024',
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
      description: 'The main voting period for Isekai Awards 2024',
    },
  });

  console.log('Created voting period:', votingPeriod.name);

  // Create sample nominees (optional - for testing)
  const actionCategory = categories.find((c) => c.slug === 'best-action');
  if (actionCategory) {
    const sampleNominees = await Promise.all([
      prisma.nominee.upsert({
        where: { id: 'sample-1' },
        update: {},
        create: {
          id: 'sample-1',
          categoryId: actionCategory.id,
          title: 'Attack on Titan: The Final Season',
          studio: 'MAPPA',
          imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          description:
            'The epic conclusion to the story of Eren Yeager and the fight for humanity\'s survival.',
          hiddenGemScore: 20,
        },
      }),
      prisma.nominee.upsert({
        where: { id: 'sample-2' },
        update: {},
        create: {
          id: 'sample-2',
          categoryId: actionCategory.id,
          title: 'Jujutsu Kaisen Season 2',
          studio: 'MAPPA',
          imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          description:
            'Yuji Itadori and his fellow sorcerers face their greatest challenges yet.',
          hiddenGemScore: 30,
        },
      }),
    ]);

    console.log(`Created ${sampleNominees.length} sample nominees`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
