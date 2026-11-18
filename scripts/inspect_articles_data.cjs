const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkArticles() {
  const articles = await prisma.article.findMany({
    orderBy: [
      { publishedAt: 'desc' },
      { createdAt: 'desc' },
    ],
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      createdAt: true,
      featuredImage: true,
      featuredType: true,
    },
    take: 20,
  });

  console.log(`Found ${articles.length} latest articles:`);
  articles.forEach((a, idx) => {
    console.log(`${idx + 1}. [${a.publishedAt ? a.publishedAt.toISOString().slice(0, 10) : 'NO DATE'}] [${a.featuredType || 'NONE'}] ${a.title.slice(0, 50)}...`);
    console.log(`   Image: ${a.featuredImage || 'NULL'}`);
  });

  const total = await prisma.article.count();
  const withImage = await prisma.article.count({
    where: { featuredImage: { not: null } }
  });
  console.log(`\nTotal articles: ${total}, with featuredImage: ${withImage}`);
}

checkArticles().finally(() => prisma.$disconnect());
