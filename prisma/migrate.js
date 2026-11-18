const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

async function runMigration() {
  const report = [];
  const log = (msg) => {
    report.push(`[${new Date().toISOString()}] ${msg}`);
    console.log(msg);
  };

  log('Starting database migration process...');
  const prisma = new PrismaClient();

  try {
    const sqlPath = path.resolve(__dirname, 'schema.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`schema.sql not found at ${sqlPath}`);
    }

    let sqlContent = fs.readFileSync(sqlPath, 'utf8');
    if (sqlContent.charCodeAt(0) === 0xfeff) {
      sqlContent = sqlContent.slice(1);
    }

    const lines = sqlContent.split(/\r?\n/).filter((l) => !l.trim().startsWith('--'));
    const cleanSql = lines.join('\n');

    const statements = cleanSql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    log(`Found ${statements.length} SQL statements to process.`);

    // Check existing tables
    let existingArticles = 0;
    try {
      existingArticles = await prisma.article.count();
    } catch (_) {}

    if (existingArticles === 0) {
      log('Zero articles in database. Performing clean schema rebuild...');
      try {
        await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
        const tableNames = [
          'User', 'Role', 'Permission', 'RolePermission', 'Author', 'Article',
          'ArticleRevision', 'Category', 'ArticleCategory', 'Tag', 'ArticleTag',
          'JalsaEdition', 'Speech', 'Media', 'Gallery', 'GalleryItem', 'Page',
          'NavigationMenu', 'NavigationItem', 'NewsletterSubscriber', 'SiteSetting',
          'Subscriber', 'ContactSubmission', 'ArticleView', 'AuditLog',
          'wordpress_migration_record', 'wordpress_asset', 'zone_traffic',
          'article_translations', 'concierge_queries'
        ];
        for (const t of tableNames) {
          try { await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS \`${t}\`;`); } catch (_) {}
        }
        log('Clean drop completed.');
      } catch (dropErr) {
        log(`Drop notice: ${dropErr.message}`);
      }
    }

    try {
      await prisma.$executeRawUnsafe("SET SESSION default_storage_engine = 'InnoDB';");
      await prisma.$executeRawUnsafe("SET SESSION innodb_strict_mode = 0;");
      await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
      log('Session configured: InnoDB, strict_mode=0, FOREIGN_KEY_CHECKS=0');
    } catch (sessErr) {
      log(`Session configuration notice: ${sessErr.message}`);
    }

    let successCount = 0;
    let failCount = 0;
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await prisma.$executeRawUnsafe(stmt);
        successCount++;
      } catch (stmtErr) {
        failCount++;
        const firstLine = stmt.split('\n')[0].trim();
        log(`Statement ${i + 1} (${firstLine}) FAILED: ${stmtErr.message}`);
      }
    }

    try {
      await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (_) {}

    log(`Execution finished: ${successCount} succeeded, ${failCount} failed.`);

    // Check Article count
    const articleCount = await prisma.article.count().catch((cErr) => {
      log(`Article count check failed: ${cErr.message}`);
      return 0;
    });
    log(`Verified articles present: ${articleCount}`);

    if (articleCount === 0) {
      log('Database empty. Loading seed script...');
      const seedPath = path.resolve(__dirname, 'seed/seed.js');
      if (fs.existsSync(seedPath)) {
        try {
          delete require.cache[require.resolve(seedPath)];
          require(seedPath);
          log('Seed script invoked.');
        } catch (seedErr) {
          log(`Seed script error: ${seedErr.message}`);
        }
      }
    }
  } catch (err) {
    log(`FATAL migration error: ${err.stack || err.message}`);
  } finally {
    await prisma.$disconnect();
  }

  return report;
}

if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
