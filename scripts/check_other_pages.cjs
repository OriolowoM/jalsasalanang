const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  for (const slug of ['accommodation', 'transportation', 'programme-of-events-jalsa-salana-nigeria-2024', 'press-conference', 'contact', 'privacy-policy']) {
    const p = await prisma.page.findUnique({ where: { slug } });
    console.log(`\n=== SLUG: ${slug} ===`);
    console.log('Has plumbing / lorem:', /plumbing|lorem|perspiciatis|cirius|dowser/i.test(p?.content || ''));
    console.log('Has raw svg:', /<svg/i.test(p?.content || ''));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
