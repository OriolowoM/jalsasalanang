const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function cleanAuthorName(rawName) {
  if (!rawName) return null;
  let name = rawName
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/^[:\s\-–—]+|[:\s\-–—]+$/g, '')
    .trim();

  // Remove common prefixes
  name = name.replace(/^(?:By|Written by|Report by|Article by)[:\s]*/i, '').trim();

  // If there's an author title like "Muballigh Silsila" or trailing dash
  name = name.replace(/[-–—].*$/, '').trim();

  // Normalize quotes and spaces
  name = name.replace(/\s+/g, ' ');

  if (name.length < 3 || name.length > 50) return null;

  // Filter out non-names (e.g. if regex captured a sentence)
  const nonNameStarts = /^(the|in|a|an|welcome|this|during|speaking|when|after|before|as|it)\b/i;
  if (nonNameStarts.test(name)) return null;

  return name;
}

function extractAuthorFromContent(content) {
  if (!content) return null;
  const snippet = content.slice(0, 500);

  // 1. Check HTML tags containing "By: Name" or "By Name"
  const tagMatch = snippet.match(/<(?:strong|em|span|p|b|h\d)[^>]*>\s*(?:By|Written by|Report by|Article by):?\s*([^<]+)<\/(?:strong|em|span|p|b|h\d)>/i);
  if (tagMatch) {
    const cleaned = cleanAuthorName(tagMatch[1]);
    if (cleaned) return cleaned;
  }

  // 2. Check line break based "By: Name"
  const lineMatch = snippet.match(/(?:^|\n|\r|<br\s*\/?>)\s*(?:By|Written by|Report by|Article by):?\s*([A-Za-z\s\.\-–—\(\)'’]{3,50}?)(?:-|\r|\n|<br\s*\/?>|<\/)/i);
  if (lineMatch) {
    const cleaned = cleanAuthorName(lineMatch[1]);
    if (cleaned) return cleaned;
  }

  return null;
}

async function main() {
  console.log('=== Step 1: Delete articles from February 2026 onwards ===');
  const futureCutoff = new Date('2026-02-01T00:00:00.000Z');
  const futureArticles = await prisma.article.findMany({
    where: { publishedAt: { gte: futureCutoff } },
    select: { id: true, title: true, slug: true, publishedAt: true }
  });

  console.log(`Found ${futureArticles.length} future articles to delete:`);
  for (const fa of futureArticles) {
    console.log(` - [${fa.publishedAt?.toISOString()}] ${fa.slug} ("${fa.title}")`);
    await prisma.article.delete({ where: { id: fa.id } });
  }
  console.log(`Successfully deleted ${futureArticles.length} future articles.`);

  console.log('\n=== Step 2: Ensure "Editor" author exists ===');
  let editorAuthor = await prisma.author.findFirst({
    where: {
      OR: [
        { slug: 'editor' },
        { name: 'Editor' }
      ]
    }
  });

  if (!editorAuthor) {
    editorAuthor = await prisma.author.create({
      data: {
        id: 'auth_editor_desk_official',
        name: 'Editor',
        slug: 'editor',
        title: 'Editorial Desk, Jalsa Salana Nigeria',
        bio: 'The official digital editorial desk of Jalsa Salana Nigeria.',
        avatar: '/images/jalsa-logo.png',
        email: 'editor@jalsasalana.ng'
      }
    });
    console.log('Created new "Editor" author:', editorAuthor.id);
  } else {
    console.log('Found existing "Editor" author:', editorAuthor.id, editorAuthor.name);
  }

  console.log('\n=== Step 3: Update Admin User Name ===');
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@jalsasalana.ng' }
  });
  if (adminUser) {
    await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        firstName: 'Admin',
        lastName: ''
      }
    });
    console.log(`Updated admin user (${adminUser.email}) name to: firstName="Admin", lastName=""`);
  } else {
    console.log('Admin user not found by email admin@jalsasalana.ng');
  }

  console.log('\n=== Step 4: Re-attribute all articles with "By [Author]" or Amir attribution ===');
  const remainingArticles = await prisma.article.findMany({
    include: { author: true }
  });
  console.log(`Processing ${remainingArticles.length} remaining articles...`);

  let extractedCount = 0;
  let amirReassignedCount = 0;
  let unchangedCount = 0;

  for (const article of remainingArticles) {
    const isAmir = article.author?.name?.toLowerCase().includes('alatoye');
    const isBogusAuthor = article.author?.name?.startsWith('the ');

    const extractedName = extractAuthorFromContent(article.content);

    if (extractedName) {
      // Find or create this author
      const authorSlug = slugify(extractedName);
      let author = await prisma.author.findFirst({
        where: {
          OR: [
            { slug: authorSlug },
            { name: { equals: extractedName } }
          ]
        }
      });

      if (!author) {
        author = await prisma.author.create({
          data: {
            name: extractedName,
            slug: authorSlug,
            title: 'Contributing Writer',
            bio: `${extractedName} is a contributor to Jalsa Salana Nigeria digital publications.`
          }
        });
        console.log(` Created new Author record: "${extractedName}" (${authorSlug})`);
      }

      if (article.authorId !== author.id) {
        await prisma.article.update({
          where: { id: article.id },
          data: { authorId: author.id }
        });
        console.log(` Updated article "${article.title.slice(0, 45)}" -> Author: "${author.name}" (was: "${article.author?.name}")`);
        extractedCount++;
      } else {
        unchangedCount++;
      }
    } else if (isAmir || isBogusAuthor) {
      // No By found in content, but author was Amir or bogus! Reassign to Editor.
      await prisma.article.update({
        where: { id: article.id },
        data: { authorId: editorAuthor.id }
      });
      console.log(` Reassigned Amir/Bogus article "${article.title.slice(0, 45)}" to "Editor" (was: "${article.author?.name}")`);
      amirReassignedCount++;
    } else {
      unchangedCount++;
    }
  }

  console.log(`\nRe-attribution Summary:`);
  console.log(` - Re-attributed to real By-lines: ${extractedCount}`);
  console.log(` - Reassigned Amir/Bogus to Editor: ${amirReassignedCount}`);
  console.log(` - Unchanged: ${unchangedCount}`);

  console.log('\n=== Step 5: Clean up unused bogus author records ===');
  const bogusAuthors = await prisma.author.findMany({
    where: {
      name: { startsWith: 'the ' }
    },
    include: { articles: true }
  });

  for (const ba of bogusAuthors) {
    if (ba.articles.length === 0) {
      await prisma.author.delete({ where: { id: ba.id } });
      console.log(` Deleted unused bogus author: "${ba.name}"`);
    } else {
      console.log(` Bogus author still has ${ba.articles.length} articles: "${ba.name}"`);
    }
  }

  console.log('\n=== Step 6: Final Verification ===');
  const totalArticles = await prisma.article.count();
  const futureRemaining = await prisma.article.count({
    where: { publishedAt: { gte: futureCutoff } }
  });
  const amirRemainingArticles = await prisma.article.count({
    where: { author: { name: { contains: 'Alatoye' } } }
  });

  console.log(`Total articles in DB: ${totalArticles}`);
  console.log(`Articles published >= Feb 2026: ${futureRemaining} (Must be 0)`);
  console.log(`Articles assigned to Amir: ${amirRemainingArticles} (Must be 0)`);
}

main()
  .catch((e) => {
    console.error('Error during cleanup:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
