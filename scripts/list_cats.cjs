const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listCategories() {
  const cats = await prisma.category.findMany();
  console.log(cats);
}

listCategories().finally(() => prisma.$disconnect());
