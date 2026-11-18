const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const THEMED_IMAGES = {
  scholars: [
    '/images/jalsa-scholars.jpg',
    '/images/jalsa-stage.jpg',
  ],
  prayers: [
    '/images/jalsa-prayer.jpg',
  ],
  press: [
    '/uploads/migrated/blog.jalsasalana.ng/Press-Jalsa-Conference-8.jpg',
  ],
  medical: [
    '/uploads/migrated/blog.jalsasalana.ng/WhatsApp-Image-2026-01-02-at-12.31.44_9f2c1dca.jpg',
  ],
  volunteers: [
    '/uploads/migrated/blog.jalsasalana.ng/DSC_3990-scaled.jpg',
    '/images/jalsa-convention-a.jpg',
  ],
  poetry: [
    '/images/jalsa-audience.jpg',
    '/uploads/migrated/blog.jalsasalana.ng/Audience2.jpeg',
  ],
  international: [
    '/images/jalsa-international.jpg',
    '/images/guest-aregbesola.jpg',
  ],
  general: [
    '/images/jalsa-convention-a.jpg',
    '/images/jalsa-convention-b.jpg',
    '/images/jalsa-convention-c.jpg',
    '/images/70th-jalsa-hero.jpg',
    '/uploads/migrated/blog.jalsasalana.ng/DSC_4021-scaled.jpg',
  ],
};

function pickImage(title, categoryName, index) {
  const text = (title + ' ' + (categoryName || '')).toLowerCase();

  if (/amir|alatoye|lecture|speech|discourse|keynote|address|caliph/i.test(text)) {
    return THEMED_IMAGES.scholars[index % THEMED_IMAGES.scholars.length];
  }
  if (/prayer|dua|tahajjud|supplication|taqwa|god|faith|tarbiyya|spiritual|adversity|patience/i.test(text)) {
    return THEMED_IMAGES.prayers[index % THEMED_IMAGES.prayers.length];
  }
  if (/press|journalis|conference|media|news|communique|release/i.test(text)) {
    return THEMED_IMAGES.press[index % THEMED_IMAGES.press.length];
  }
  if (/medic|health|amlan|clinic|doctor|outreach|blood/i.test(text)) {
    return THEMED_IMAGES.medical[index % THEMED_IMAGES.medical.length];
  }
  if (/volunteer|service|duty|traffic|kitchen|food|feed|langar|security|sanitation|hands/i.test(text)) {
    return THEMED_IMAGES.volunteers[index % THEMED_IMAGES.volunteers.length];
  }
  if (/poem|poetry|echo|diversity|story|reflection|haven|unite|beauty|memory|memories/i.test(text)) {
    return THEMED_IMAGES.poetry[index % THEMED_IMAGES.poetry.length];
  }
  if (/international|guest|foreign|dignitary|governor|aregbesola|delegat/i.test(text)) {
    return THEMED_IMAGES.international[index % THEMED_IMAGES.international.length];
  }
  return THEMED_IMAGES.general[index % THEMED_IMAGES.general.length];
}

async function main() {
  const articlesWithoutImage = await prisma.article.findMany({
    where: { featuredImage: null },
    include: {
      categories: {
        include: { category: true }
      }
    }
  });

  console.log(`Found ${articlesWithoutImage.length} articles without a featured image.`);

  let updated = 0;
  for (let i = 0; i < articlesWithoutImage.length; i++) {
    const article = articlesWithoutImage[i];
    const catName = article.categories?.[0]?.category?.name || '';
    const imagePath = pickImage(article.title, catName, i);

    await prisma.article.update({
      where: { id: article.id },
      data: { featuredImage: imagePath },
    });
    updated++;
  }

  console.log(`Successfully updated ${updated} articles with authentic website featured images.`);

  const remaining = await prisma.article.count({ where: { featuredImage: null } });
  const total = await prisma.article.count();
  console.log(`Verification: Total articles = ${total}, remaining without image = ${remaining}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
