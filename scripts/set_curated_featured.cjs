const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  // 1. Set HERO
  await prisma.article.updateMany({
    where: { id: 'cmw7zfk0n000vw4d9s2kt2wx6' },
    data: {
      featuredType: 'HERO',
      featuredImage: '/images/jalsa_gallery/jalsa-main-stage-keynote-podium.jpg',
    },
  });

  // 2. Set SECONDARY
  await prisma.article.updateMany({
    where: { id: 'cmw7zfk0x000xw4d9m7rate9p' },
    data: {
      featuredType: 'SECONDARY',
      featuredImage: '/images/jalsa_gallery/jalsa-governor-abiodun-amir-handshake.jpg',
    },
  });

  await prisma.article.updateMany({
    where: { id: 'cmw7zfk16000zw4d9sfdk3q5k' },
    data: {
      featuredType: 'SECONDARY',
      featuredImage: '/images/jalsa_gallery/jalsa-amir-stage-address.jpg',
    },
  });

  await prisma.article.updateMany({
    where: { id: 'cmw7zfk1s0013w4d9ha8keut0' },
    data: {
      featuredType: 'SECONDARY',
      featuredImage: '/images/jalsa_gallery/jalsa-khuddam-security-discipline.jpg',
    },
  });

  // 3. Set EDITORS_PICK
  await prisma.article.updateMany({
    where: { id: 'cmw7zfk1h0011w4d9uf8uuduw' },
    data: {
      featuredType: 'EDITORS_PICK',
      featuredImage: '/images/jalsa_gallery/jalsa-female-dignitary-reception.jpg',
    },
  });

  // Find cycling article for EDITORS_PICK
  const cyclingArticle = await prisma.article.findFirst({
    where: { title: { contains: 'Cycling Association' } },
  });
  if (cyclingArticle) {
    await prisma.article.update({
      where: { id: cyclingArticle.id },
      data: {
        featuredType: 'EDITORS_PICK',
        featuredImage: '/images/jalsa_gallery/jalsa-cycling-association-arrival.jpg',
      },
    });
  }

  // Find brotherhood article
  const brotherhoodArticle = await prisma.article.findFirst({
    where: { title: { contains: 'BROTHERHOOD AND PIETY' } },
  });
  if (brotherhoodArticle) {
    await prisma.article.update({
      where: { id: brotherhoodArticle.id },
      data: {
        featuredType: 'EDITORS_PICK',
        featuredImage: '/images/jalsa_gallery/jalsa-night-marquee-tahajjud.jpg',
      },
    });
  }

  console.log('Successfully set curated HERO, SECONDARY, and EDITORS_PICK articles with authentic photos!');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
