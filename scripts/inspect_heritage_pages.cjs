const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  for (const slug of ['khilafat', 'ahmadiyya', 'jalsa-salana', 'about']) {
    const p = await prisma.page.findUnique({ where: { slug } });
    console.log(`\n============================`);
    console.log(`SLUG: ${slug} | TITLE: ${p?.title}`);
    console.log(p?.content);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
