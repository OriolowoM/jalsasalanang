const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const articlesWithSvg = await prisma.article.findMany({
    where: { content: { contains: '<svg' } },
    select: { id: true, slug: true, title: true }
  });
  console.log('Articles with SVG:', articlesWithSvg.length);
  articlesWithSvg.forEach(a => console.log(`- [${a.slug}] ${a.title}`));

  const articlesWithLorem = await prisma.article.findMany({
    where: {
      OR: [
        { content: { contains: 'lorem' } },
        { content: { contains: 'perspiciatis' } },
        { content: { contains: 'cirius' } },
        { content: { contains: 'dowser' } },
        { content: { contains: 'plumbing' } }
      ]
    },
    select: { id: true, slug: true, title: true }
  });
  console.log('Articles with dummy/lorem:', articlesWithLorem.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
