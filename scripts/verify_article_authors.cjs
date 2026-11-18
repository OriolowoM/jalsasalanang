const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      publishedAt: true,
      author: { select: { id: true, name: true, slug: true } }
    },
    orderBy: { publishedAt: 'desc' }
  });

  console.log(`Total articles: ${articles.length}`);
  console.log(`Newest 5 articles:`);
  articles.slice(0, 5).forEach((a, i) => {
    console.log(`  ${i+1}. [${a.publishedAt?.toISOString().slice(0, 10)}] "${a.title.slice(0, 45)}" -> Author: "${a.author.name}"`);
  });
  console.log(`Oldest 5 articles:`);
  articles.slice(-5).forEach((a, i) => {
    console.log(`  ${i+1}. [${a.publishedAt?.toISOString().slice(0, 10)}] "${a.title.slice(0, 45)}" -> Author: "${a.author.name}"`);
  });

  const authorCounts = {};
  for (const a of articles) {
    const name = a.author?.name || 'UNKNOWN';
    authorCounts[name] = (authorCounts[name] || 0) + 1;
  }

  console.log('\nTop 15 authors by article count:');
  const sorted = Object.entries(authorCounts).sort((a, b) => b[1] - a[1]);
  sorted.slice(0, 15).forEach(([name, count], i) => {
    console.log(`  ${i+1}. ${name}: ${count} articles`);
  });
}

run().finally(() => prisma.$disconnect());
