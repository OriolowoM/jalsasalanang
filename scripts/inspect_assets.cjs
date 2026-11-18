const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAssets() {
  const count = await prisma.wordPressAsset.count();
  console.log(`Total WordPress Assets in DB: ${count}`);

  const bySource = await prisma.wordPressAsset.groupBy({
    by: ['sourceSite'],
    _count: true
  });
  console.log('Breakdown by Source:');
  bySource.forEach(s => console.log(`  ${s.sourceSite}: ${s._count}`));

  const samples = await prisma.wordPressAsset.findMany({ take: 10 });
  console.log('\nSample Asset Records:');
  samples.forEach(a => {
    console.log(`- [${a.sourceSite}] ${a.fileName}`);
    console.log(`  URL: ${a.originalUrl}`);
    console.log(`  LocalPath: ${a.localPath}`);
  });
}

checkAssets()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
