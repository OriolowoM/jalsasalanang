const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- SEARCHING PAGES FOR DUMMY / UNRELATED CONTENT ---');
  const allPages = await prisma.page.findMany({
    select: { id: true, slug: true, title: true, content: true, sourceSite: true }
  });

  const suspiciousPages = [];
  for (const p of allPages) {
    const text = (p.title + ' ' + p.content).toLowerCase();
    const hasLorem = text.includes('lorem') || text.includes('perspiciatis') || text.includes('bryan cirius') || text.includes('jane dowser') || text.includes('call us today');
    const hasSvgCheck = text.includes('<svg') || text.includes('dashicons') || text.includes('elementor-icon') || text.includes('check');
    if (hasLorem || text.includes('cirius') || text.includes('dowser') || text.includes('press24') || text.includes('sample-page') || text.includes('sample page')) {
      suspiciousPages.push({
        id: p.id,
        slug: p.slug,
        title: p.title,
        sourceSite: p.sourceSite,
        hasLorem,
        contentLength: p.content.length
      });
    }
  }
  console.log('Found suspicious pages:', suspiciousPages);

  console.log('\n--- ALL PAGES IN DB ---');
  allPages.forEach(p => console.log(`[${p.id}] slug: "${p.slug}", title: "${p.title}", length: ${p.content.length}`));

  console.log('\n--- SEARCHING ARTICLES FOR DUMMY / UNRELATED CONTENT ---');
  const allArticles = await prisma.article.findMany({
    select: { id: true, slug: true, title: true, content: true }
  });
  const suspiciousArticles = [];
  for (const a of allArticles) {
    const text = (a.title + ' ' + a.content).toLowerCase();
    if (text.includes('lorem') || text.includes('perspiciatis') || text.includes('bryan cirius') || text.includes('jane dowser') || text.includes('call us today')) {
      suspiciousArticles.push({
        id: a.id,
        slug: a.slug,
        title: a.title,
      });
    }
  }
  console.log('Found suspicious articles:', suspiciousArticles);
}

main().catch(console.error).finally(() => prisma.$disconnect());
