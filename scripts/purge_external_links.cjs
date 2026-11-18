const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function purgeExternalStylesheets() {
  const pages = await prisma.page.findMany();
  for (const page of pages) {
    if (page.content && page.content.includes('<link')) {
      const clean = page.content.replace(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi, '');
      await prisma.page.update({
        where: { id: page.id },
        data: { content: clean }
      });
      console.log(`Purged external link stylesheets from page: ${page.title}`);
    }
  }

  const articles = await prisma.article.findMany();
  for (const article of articles) {
    if (article.content && article.content.includes('<link')) {
      const clean = article.content.replace(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi, '');
      await prisma.article.update({
        where: { id: article.id },
        data: { content: clean }
      });
      console.log(`Purged external link stylesheets from article: ${article.title}`);
    }
  }
}

purgeExternalStylesheets()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
