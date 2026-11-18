const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pagesWithHonesty = await prisma.page.findMany({
    where: { content: { contains: 'honesty' } },
    select: { id: true, slug: true, title: true }
  });
  console.log('Pages with honesty:', pagesWithHonesty);

  const pagesWithCirius = await prisma.page.findMany({
    where: { content: { contains: 'Cirius' } },
    select: { id: true, slug: true, title: true }
  });
  console.log('Pages with Cirius:', pagesWithCirius);

  const pagesWithCallUs = await prisma.page.findMany({
    where: { content: { contains: 'Call Us' } },
    select: { id: true, slug: true, title: true }
  });
  console.log('Pages with Call Us:', pagesWithCallUs);
}

main().catch(console.error).finally(() => prisma.$disconnect());
