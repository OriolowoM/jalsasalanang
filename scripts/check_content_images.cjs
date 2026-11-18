const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkContentImages() {
  const articlesWithoutImage = await prisma.article.findMany({
    where: { featuredImage: null },
    select: { id: true, title: true, content: true },
  });

  let withImgInContent = 0;
  for (const a of articlesWithoutImage) {
    const match = a.content && a.content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match) {
      withImgInContent++;
    }
  }

  console.log(`Articles without featuredImage: ${articlesWithoutImage.length}`);
  console.log(`Articles with <img> in content: ${withImgInContent}`);
}

checkContentImages().finally(() => prisma.$disconnect());
