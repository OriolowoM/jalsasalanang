const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const security = await prisma.page.findUnique({ where: { slug: 'security' } });
  console.log('--- SECURITY CONTENT SAMPLE ---');
  console.log(security?.content);
}

main().catch(console.error).finally(() => prisma.$disconnect());
