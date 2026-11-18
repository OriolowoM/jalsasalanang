const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function audit() {
  console.log('=== DATABASE VERIFICATION AUDIT ===\n');

  const migrationRecordsCount = await prisma.wordpress_migration_record.count();
  const assetsCount = await prisma.wordpress_asset.count();
  const totalArticles = await prisma.article.count();
  const wpArticles = await prisma.article.count({ where: { wpId: { not: null } } });
  const totalPages = await prisma.page.count();
  const totalAuthors = await prisma.author.count();
  const totalCategories = await prisma.category.count();

  console.log(`Total WP Migration Records: ${migrationRecordsCount}`);
  console.log(`Total WordPress Assets Isolated: ${assetsCount}`);
  console.log(`Total Articles in Database: ${totalArticles} (${wpArticles} migrated from WordPress)`);
  console.log(`Total Pages in Database: ${totalPages}`);
  console.log(`Total Authors in Database: ${totalAuthors}`);
  console.log(`Total Categories in Database: ${totalCategories}`);

  // Breakdown of WP Migration Records by Source Site & Type
  const wpBreakdown = await prisma.wordpress_migration_record.groupBy({
    by: ['sourceSite', 'postType'],
    _count: true
  });
  console.log('\n--- WordPress Migration Records Breakdown ---');
  wpBreakdown.forEach(b => console.log(`  ${b.sourceSite} [${b.postType}]: ${b._count}`));

  // Sample Assets
  console.log('\n--- Sample Isolated Assets (first 5) ---');
  const sampleAssets = await prisma.wordpress_asset.findMany({ take: 5 });
  sampleAssets.forEach(a => console.log(`  [${a.sourceSite}] ${a.fileName} -> ${a.originalUrl}`));

  // Category Distribution for Articles
  console.log('\n--- Article Category Distribution ---');
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { articlecategory: true }
      }
    }
  });
  categories.forEach(c => console.log(`  ${c.name} (${c.slug}): ${c._count.articlecategory} articles`));

  // Sample Migrated Articles
  console.log('\n--- Sample Migrated Articles (first 5) ---');
  const sampleArticles = await prisma.article.findMany({
    where: { wpId: { not: null } },
    take: 5,
    include: {
      author: true,
      articlecategory: { include: { category: true } }
    }
  });
  sampleArticles.forEach(a => {
    console.log(`  - "${a.title}"`);
    console.log(`    Slug: /article/${a.slug}`);
    console.log(`    Author: ${a.author.name} | Read Time: ${a.readingTime} min | Image: ${a.featuredImage ? 'Yes' : 'No'}`);
    console.log(`    Categories: ${a.articlecategory.map(ac => ac.category.name).join(', ')}`);
  });

  // Sample Migrated Pages
  console.log('\n--- Sample Migrated Pages (first 8) ---');
  const samplePages = await prisma.page.findMany({ take: 8 });
  samplePages.forEach(p => console.log(`  - "${p.title}" (slug: /${p.slug}, source: ${p.sourceSite})`));
}

audit()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
