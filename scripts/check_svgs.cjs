const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  for (const slug of ['programme-of-events-jalsa-salana-nigeria-2024', 'press-conference', 'contact']) {
    const p = await prisma.page.findUnique({ where: { slug } });
    console.log(`\n=== SLUG: ${slug} ===`);
    const svgs = p.content.match(/<svg[^>]*>[\s\S]*?<\/svg>/gi) || [];
    console.log(`Found ${svgs.length} SVGs:`);
    svgs.forEach((s, i) => console.log(`SVG ${i}:`, s.substring(0, 150)));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
