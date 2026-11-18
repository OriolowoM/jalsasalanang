const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const a = await prisma.article.findUnique({
    where: { slug: 'ahmadiyya-to-hold-70th-annual-conference-in-nigeria' }
  });
  console.log('featuredImage:', a.featuredImage);
  console.log('ogImage:', a.ogImage);
  const matches = a.content.match(/https?:\/\/[^\s"',<>]+/g) || [];
  console.log('Matches in content:', matches);
}
check().finally(() => prisma.$disconnect());
