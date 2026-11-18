const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const a = await prisma.article.findUnique({
    where: { slug: 'ahmadiyya-to-hold-70th-annual-conference-in-nigeria' }
  });
  console.log('Title:', a.title);
  console.log('Featured Image:', a.featuredImage);
  console.log('Content preview (first 400 chars):');
  console.log(a.content.substring(0, 400));
}

check().finally(() => prisma.$disconnect());
