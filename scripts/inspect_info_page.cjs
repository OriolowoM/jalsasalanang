const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.page.findUnique({ where: { slug: 'info-emergencies' } });
  console.log('--- INFO EMERGENCIES CONTENT ---');
  console.log(p?.content);
}

main().catch(console.error).finally(() => prisma.$disconnect());
