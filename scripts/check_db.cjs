const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const authors = await prisma.author.findMany();
  const categories = await prisma.category.findMany();
  const articlesCount = await prisma.article.count();
  const pagesCount = await prisma.page.count();
  console.log('Authors count:', authors.length);
  console.log('Categories count:', categories.length);
  console.log('Articles count:', articlesCount);
  console.log('Pages count:', pagesCount);
  if (authors.length > 0) console.log('Default author:', authors[0].name, 'id:', authors[0].id);
  if (categories.length > 0) console.log('Sample categories:', categories.slice(0, 5).map(c => c.name));
}

check().catch(console.error).finally(() => prisma.$disconnect());
