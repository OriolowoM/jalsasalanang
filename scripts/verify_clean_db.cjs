const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== VERIFYING CLEAN DATABASE STATE ===');
  const pages = await prisma.page.findMany();
  console.log(`Remaining pages count: ${pages.length}`);

  let dummyHits = 0;
  for (const p of pages) {
    const text = (p.title + ' ' + p.content).toLowerCase();
    const matches = text.match(/cirius|dowser|martin foster|we strive to provide|why choose us|customer-|360_f_|we're here to help|call us today|sed ut|perspiciatis|<svg/gi);
    if (matches) {
      console.log(`[ALERT] Page ${p.slug} has matches:`, matches);
      dummyHits++;
    } else {
      console.log(`[PASS] Page "${p.slug}" is completely clean! (${p.content.length} chars)`);
    }
  }

  console.log(`\n=== CHECKING ALL 148 ARTICLES ===`);
  const articles = await prisma.article.findMany();
  let articleHits = 0;
  for (const a of articles) {
    const text = (a.title + ' ' + a.content + ' ' + (a.featuredImage || '')).toLowerCase();
    const matches = text.match(/cirius|dowser|martin foster|we strive to provide|why choose us|customer-|360_f_|we're here to help|call us today|sed ut|perspiciatis|<svg/gi);
    if (matches) {
      console.log(`[ALERT] Article ${a.slug} has matches:`, matches);
      articleHits++;
    }
  }
  console.log(`\nResults:`);
  console.log(`Article dummy hits: ${articleHits}`);
  console.log(`Page dummy hits: ${dummyHits}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
