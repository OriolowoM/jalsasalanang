const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const sampleArticles = await prisma.article.findMany({
    where: { featuredImage: { not: null } },
    take: 8,
    select: { title: true, slug: true, featuredImage: true }
  });
  console.log('Sample Articles with Local Featured Images:');
  sampleArticles.forEach(a => console.log('  -', a.title, '->', a.featuredImage));

  const samplePages = await prisma.page.findMany({
    where: { featuredImage: { not: null } },
    take: 8,
    select: { title: true, slug: true, featuredImage: true }
  });
  console.log('\nSample Pages with Local Featured Images:');
  samplePages.forEach(p => console.log('  -', p.title, '->', p.featuredImage));

  const remainingRemoteArticles = await prisma.article.count({
    where: {
      OR: [
        { content: { contains: 'blog.jalsasalana.ng/wp-content' } },
        { content: { contains: 'jalsasalana.ng/wp-content' } }
      ]
    }
  });
  console.log('\nRemaining Articles with remote wp-content URLs:', remainingRemoteArticles);

  const remainingRemotePages = await prisma.page.count({
    where: {
      OR: [
        { content: { contains: 'blog.jalsasalana.ng/wp-content' } },
        { content: { contains: 'jalsasalana.ng/wp-content' } }
      ]
    }
  });
  console.log('Remaining Pages with remote wp-content URLs:', remainingRemotePages);

  // Test live HTTP page rendering
  try {
    const res = await fetch('http://localhost:3000/articles/ahmadiyya-to-hold-70th-annual-conference-in-nigeria');
    const html = await res.text();
    console.log('\n--- Live HTTP Article Page Verification ---');
    console.log('Status:', res.status);
    const hasExternalWp = html.includes('wp-content/uploads');
    console.log('Contains external wp-content/uploads:', hasExternalWp);
    const localImgMatches = html.match(/\/uploads\/migrated\/[^\s"'<>]+/g) || [];
    console.log('Local migrated image paths in HTML:', [...new Set(localImgMatches)]);
  } catch(e) {
    console.log('Live HTTP test error:', e.message);
  }

  if (remainingRemotePages > 0) {
    const p = await prisma.page.findFirst({
      where: {
        OR: [
          { content: { contains: 'blog.jalsasalana.ng/wp-content' } },
          { content: { contains: 'jalsasalana.ng/wp-content' } }
        ]
      },
      select: { title: true, slug: true, content: true }
    });
    console.log('Page:', p.title, 'slug:', p.slug);
    const urls = p.content.match(/https?:\/\/[^\s"',<>]+/g) || [];
    console.log('URLs in page:', urls.filter(u => u.includes('wp-content')));
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
