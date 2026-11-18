const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.article.findMany({
    select: { id: true, slug: true, title: true, featuredImage: true, content: true }
  });

  console.log(`Inspecting ${articles.length} articles...`);
  const suspicious = [];
  for (const a of articles) {
    const text = (a.featuredImage || '') + ' ' + a.content;
    if (/customer-|plumbing|why-choose-us|emergency-|360_F_|cirius|dowser|foster|press24/i.test(text)) {
      suspicious.push({ slug: a.slug, title: a.title, feat: a.featuredImage });
    }
  }
  console.log('Suspicious articles:', suspicious);
}

main().catch(console.error).finally(() => prisma.$disconnect());
