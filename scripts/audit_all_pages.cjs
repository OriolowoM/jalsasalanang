const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany();
  console.log(`Total pages: ${pages.length}\n`);

  for (const p of pages) {
    console.log(`========================================`);
    console.log(`ID: ${p.id} | Slug: ${p.slug} | Title: ${p.title} | Source: ${p.sourceSite}`);
    console.log(`Content length: ${p.content.length}`);
    const snippet = p.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
    console.log(`Snippet: ${snippet}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
