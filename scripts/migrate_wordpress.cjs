const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper: Read a CSV file with csv-parser
function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(path.resolve(filePath))
      .pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', () => resolve(rows))
      .on('error', (err) => reject(err));
  });
}

// Helper: Sanitize HTML content
function sanitizeHtml(raw) {
  if (!raw) return '';
  let content = raw;

  // 1. Remove style and script tags and their content
  content = content.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  content = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

  // 2. Remove Gutenberg comments
  content = content.replace(/<!--\s*\/?wp:[^\>]*-->/gi, '');

  // 3. Normalize non-breaking spaces & empty elements
  content = content.replace(/&nbsp;/g, ' ');
  content = content.replace(/<p>\s*<\/p>/gi, '');

  // 4. Clean up repetitive blank lines
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  return content.trim();
}

// Helper: Extract all images from HTML content
function extractImages(content, sourceSite, postTitle) {
  const images = [];
  if (!content) return images;

  const imgSrcRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgSrcRegex.exec(content)) !== null) {
    const url = match[1];
    if (url && (url.includes('wp-content/uploads') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url))) {
      images.push({
        originalUrl: url,
        fileName: path.basename(url.split('?')[0]),
        sourceSite,
        postTitle
      });
    }
  }

  const hrefImgRegex = /<a[^>]+href=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))["']/gi;
  while ((match = hrefImgRegex.exec(content)) !== null) {
    const url = match[1];
    images.push({
      originalUrl: url,
      fileName: path.basename(url.split('?')[0]),
      sourceSite,
      postTitle
    });
  }

  return images;
}

// Helper: Generate URL slug
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

// Helper: Calculate reading time
function calculateReadingTime(text) {
  const plainText = text.replace(/<[^>]*>/g, '');
  const wordCount = plainText.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// Helper: Extract author from byline or content
function extractAuthorName(title, content) {
  // Check for common byline patterns
  const bylineMatch = content.match(/(?:<strong>\s*)?By\s+([A-Za-z\s\.'\(\)]+?)(?:<\/strong>|\n|<br|\s*<span|<\/p>)/i);
  if (bylineMatch && bylineMatch[1] && bylineMatch[1].trim().length > 2 && bylineMatch[1].trim().length < 50) {
    return bylineMatch[1].trim();
  }

  if (/Amir/i.test(title) || /Alatoye/i.test(title)) {
    return 'Alhaji (Barr.) Alatoye Folorunso Azeez';
  }

  if (/Mukarram\s+([A-Za-z\s]+)/i.test(title)) {
    const match = title.match(/Mukarram\s+([A-Za-z\s]+)/i);
    return 'Mukarram ' + match[1].trim();
  }

  if (/Muballigh\s+([A-Za-z\s]+)/i.test(title)) {
    const match = title.match(/Muballigh\s+([A-Za-z\s]+)/i);
    return 'Muballigh ' + match[1].trim();
  }

  return 'Editorial Board, Jalsa Salana Nigeria';
}

// Helper: Categorize content
function categorizeContent(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  const slugs = [];

  if (text.includes('press conference') || text.includes('communique') || text.includes('media briefing')) {
    slugs.push('press-conference');
  }
  if (text.includes('amir') || text.includes('alatoye') || text.includes('missionaries') || text.includes('volunteer')) {
    slugs.push('amirs-corner');
  }
  if (text.includes('peace') || text.includes('justice') || text.includes('politicians') || text.includes('palliatives') || text.includes('social justice')) {
    slugs.push('social-justice-peace');
  }
  if (text.includes('khilafat') || text.includes('masroor') || text.includes('khalifa') || text.includes('prophecy') || text.includes('blessings from thy garments')) {
    slugs.push('khilafat-guidance');
  }
  if (text.includes('tarbiyya') || text.includes('youth') || text.includes('social media') || text.includes('ladies') || text.includes('women') || text.includes('khadija') || text.includes('nusrat jahan') || text.includes('wedding')) {
    slugs.push('tarbiyya-youth');
  }
  if (text.includes('taqwa') || text.includes('righteousness') || text.includes('prayer') || text.includes('sacrifice') || text.includes('faith') || text.includes('connection with allah')) {
    slugs.push('faith-spirituality');
  }
  if (text.includes('lecture') || text.includes('annual convention') || text.includes('jalsa nigeria 2023 lecture') || text.includes('address')) {
    slugs.push('convention-lectures');
  }
  if (text.includes('poem') || text.includes('united in diversity') || text.includes('unforgettable') || text.includes('echoes of ameen') || text.includes('personal story') || text.includes('story of sacrifice')) {
    slugs.push('poems-reflections');
  }

  if (slugs.length === 0) {
    slugs.push('news-reports');
  }

  return [...new Set(slugs)];
}

async function ensureCategories() {
  const categoriesToEnsure = [
    { name: 'Faith & Spirituality', slug: 'faith-spirituality', color: '#064e3b', description: 'Theological treatises, commentary on the Holy Quran, and reflections on spiritual purification.' },
    { name: 'Social Justice & Peace', slug: 'social-justice-peace', color: '#b45309', description: 'Islamic prescriptions for equitable governance, poverty alleviation, and peaceful coexistence.' },
    { name: 'Khilafat & Guidance', slug: 'khilafat-guidance', color: '#1d4ed8', description: 'Divine leadership, guidance of the Khalifatul Masih, and the unity of the global community.' },
    { name: 'Tarbiyya & Youth', slug: 'tarbiyya-youth', color: '#047857', description: 'Moral training, character development, and empowering the next generation of leadership.' },
    { name: 'Press Conferences', slug: 'press-conference', color: '#6b21a8', description: 'Official communiques, media briefings, and public declarations issued at Jalsa Salana.' },
    { name: 'History & Heritage', slug: 'history-heritage', color: '#991b1b', description: 'Over a century of Ahmadiyya history in Nigeria and documentary records of past Jalsa editions.' },
    { name: 'Guest Impressions', slug: 'guest-impressions', color: '#0e7490', description: 'Reflections and testimonies from national dignitaries, traditional rulers, and interfaith guests.' },
    { name: 'News & Reports', slug: 'news-reports', color: '#0f766e', description: 'Comprehensive news coverage, reports, and real-time updates from Jalsa Salana events.' },
    { name: "Amir's Corner", slug: 'amirs-corner', color: '#15803d', description: 'Direct addresses, guidance, and key messages from Amir Sahib Ahmadiyya Muslim Jamaat Nigeria.' },
    { name: 'Convention Lectures', slug: 'convention-lectures', color: '#4338ca', description: 'Transcripts, summaries, and recordings of scholarly lectures delivered during Jalsa sessions.' },
    { name: 'Poems & Reflections', slug: 'poems-reflections', color: '#a21caf', description: 'Heartfelt poems, personal memories, and spiritual reflections penned by attendees and volunteers.' }
  ];

  const categoryMap = new Map();
  for (const cat of categoriesToEnsure) {
    let existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!existing) {
      existing = await prisma.category.create({
        data: {
          id: 'cat_' + slugify(cat.slug),
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          color: cat.color,
          sortOrder: 10,
          updatedAt: new Date()
        }
      });
      console.log(`[Category] Created: ${cat.name} (${cat.slug})`);
    }
    categoryMap.set(cat.slug, existing);
  }
  return categoryMap;
}

async function ensureAuthor(name) {
  const slug = slugify(name);
  let author = await prisma.author.findUnique({ where: { slug } });
  if (!author) {
    author = await prisma.author.create({
      data: {
        id: 'auth_' + slug.replace(/[^a-z0-9]/g, '_').substring(0, 25) + '_' + Date.now().toString(36),
        name,
        slug,
        title: name.includes('Alatoye') ? 'Amir (National Head), Ahmadiyya Muslim Jamaat Nigeria' : 'Contributing Writer & Editorial Correspondent',
        bio: `${name} is an esteemed contributor to Jalsa Salana Nigeria digital editorial publications.`,
        updatedAt: new Date()
      }
    });
    console.log(`[Author] Created: ${name} (${slug})`);
  }
  return author;
}

async function main() {
  console.log('======================================================');
  console.log('   JALSA SALANA NIGERIA — WORDPRESS CSV INGESTION     ');
  console.log('======================================================\n');

  // 1. Ensure categories are created/mapped
  console.log('Phase 1.1: Ensuring Category Taxonomies...');
  const categoryMap = await ensureCategories();

  // 2. Load all 4 CSV datasets
  console.log('\nPhase 1.2: Reading CSV files via csv-parser...');
  const blogPosts = await readCsv('data/csv_exports/wp_blog_posts.csv');
  const mainPosts = await readCsv('data/csv_exports/wp_main_posts.csv');
  const blogPages = await readCsv('data/csv_exports/wp_blog_pages.csv');
  const mainPages = await readCsv('data/csv_exports/wp_main_pages.csv');

  console.log(`  - wp_blog_posts.csv: ${blogPosts.length} records`);
  console.log(`  - wp_main_posts.csv: ${mainPosts.length} records`);
  console.log(`  - wp_blog_pages.csv: ${blogPages.length} records`);
  console.log(`  - wp_main_pages.csv: ${mainPages.length} records`);

  const assetMap = new Map(); // originalUrl -> asset record

  // Helper to register asset
  async function registerAsset(img) {
    if (!img.originalUrl) return;
    const cleanUrl = img.originalUrl.trim();
    if (!assetMap.has(cleanUrl)) {
      try {
        const localPath = `/uploads/migrated/${img.sourceSite}/${img.fileName}`;
        const asset = await prisma.wordpress_asset.upsert({
          where: { originalUrl: cleanUrl },
          update: {
            referenceCount: { increment: 1 }
          },
          create: {
            originalUrl: cleanUrl,
            localPath,
            sourceSite: img.sourceSite,
            fileName: img.fileName,
            postOrPageTitle: img.postTitle || 'Untitled',
            status: 'DISCOVERED'
          }
        });
        assetMap.set(cleanUrl, asset);
      } catch (e) {
        // Ignored or logged
      }
    }
  }

  // 3. Ingest WordPress Migration Records & WordPress Assets
  console.log('\nPhase 1.3: Ingesting Raw WordPress Records & Isolating Assets...');

  // A. Ingest Blog Posts
  let wpRecordsCount = 0;
  for (const row of blogPosts) {
    const wpId = parseInt(row.ID, 10);
    const title = (row.Title || 'Untitled').trim();
    const rawContent = row.Content || '';
    const cleanContent = sanitizeHtml(rawContent);
    const excerpt = (row.Excerpt || '').trim();
    const permalink = (row.Permalink || '').trim();
    const date = row.Date ? new Date(row.Date) : new Date();
    const postType = (row['Post Type'] || 'post').trim();

    // Extract images
    const images = extractImages(rawContent, 'blog.jalsasalana.ng', title);
    for (const img of images) {
      await registerAsset(img);
    }
    const featuredImage = images.length > 0 ? images[0].originalUrl : null;

    // Derived slug
    let slug = permalink ? permalink.replace(/^https?:\/\/[^\/]+\//, '').replace(/\/+$/, '') : slugify(title);
    if (!slug) slug = `post-${wpId}`;

    await prisma.wordpress_migration_record.upsert({
      where: {
        sourceSite_wpId_postType: {
          sourceSite: 'blog.jalsasalana.ng',
          wpId,
          postType
        }
      },
      update: {
        title,
        slug,
        date,
        originalUrl: permalink,
        cleanContent,
        rawContent,
        excerpt,
        featuredImage,
        associatedType: 'ARTICLE'
      },
      create: {
        sourceSite: 'blog.jalsasalana.ng',
        wpId,
        postType,
        title,
        slug,
        date,
        originalUrl: permalink,
        cleanContent,
        rawContent,
        excerpt,
        featuredImage,
        associatedType: 'ARTICLE'
      }
    });
    wpRecordsCount++;
  }

  // B. Ingest Main Posts
  for (const row of mainPosts) {
    const wpId = parseInt(row['﻿id'] || row.id || row.ID, 10);
    const title = (row.Title || 'Untitled').trim();
    const rawContent = row.Content || '';
    const cleanContent = sanitizeHtml(rawContent);
    const permalink = `https://jalsasalana.ng/?p=${wpId}`;
    const slug = slugify(title) || `main-post-${wpId}`;

    const images = extractImages(rawContent, 'jalsasalana.ng', title);
    for (const img of images) {
      await registerAsset(img);
    }
    const featuredImage = images.length > 0 ? images[0].originalUrl : null;

    await prisma.wordpress_migration_record.upsert({
      where: {
        sourceSite_wpId_postType: {
          sourceSite: 'jalsasalana.ng',
          wpId,
          postType: 'post'
        }
      },
      update: {
        title,
        slug,
        date: new Date('2023-12-22T10:00:00Z'),
        originalUrl: permalink,
        cleanContent,
        rawContent,
        excerpt: '',
        featuredImage,
        associatedType: 'ARTICLE'
      },
      create: {
        sourceSite: 'jalsasalana.ng',
        wpId,
        postType: 'post',
        title,
        slug,
        date: new Date('2023-12-22T10:00:00Z'),
        originalUrl: permalink,
        cleanContent,
        rawContent,
        excerpt: '',
        featuredImage,
        associatedType: 'ARTICLE'
      }
    });
    wpRecordsCount++;
  }

  // C. Ingest Blog Pages
  for (const row of blogPages) {
    const wpId = parseInt(row.ID, 10);
    const title = (row.Title || 'Untitled').trim();
    const rawContent = row.Content || '';
    const cleanContent = sanitizeHtml(rawContent);
    const excerpt = (row.Excerpt || '').trim();
    const permalink = (row.Permalink || '').trim();
    const date = row.Date ? new Date(row.Date) : new Date();
    const postType = (row['Post Type'] || 'page').trim();

    const images = extractImages(rawContent, 'blog.jalsasalana.ng', title);
    for (const img of images) {
      await registerAsset(img);
    }
    const featuredImage = images.length > 0 ? images[0].originalUrl : null;
    let slug = permalink ? permalink.replace(/^https?:\/\/[^\/]+\//, '').replace(/\/+$/, '') : slugify(title);
    if (!slug) slug = `page-${wpId}`;

    await prisma.wordpress_migration_record.upsert({
      where: {
        sourceSite_wpId_postType: {
          sourceSite: 'blog.jalsasalana.ng',
          wpId,
          postType
        }
      },
      update: {
        title,
        slug,
        date,
        originalUrl: permalink,
        cleanContent,
        rawContent,
        excerpt,
        featuredImage,
        associatedType: 'PAGE'
      },
      create: {
        sourceSite: 'blog.jalsasalana.ng',
        wpId,
        postType,
        title,
        slug,
        date,
        originalUrl: permalink,
        cleanContent,
        rawContent,
        excerpt,
        featuredImage,
        associatedType: 'PAGE'
      }
    });
    wpRecordsCount++;
  }

  // D. Ingest Main Pages
  for (const row of mainPages) {
    const wpId = parseInt(row['﻿id'] || row.id || row.ID, 10);
    const title = (row.Title || 'Untitled').trim();
    const rawContent = row.Content || '';
    const cleanContent = sanitizeHtml(rawContent);
    const permalink = `https://jalsasalana.ng/?page_id=${wpId}`;
    const slug = slugify(title) || `main-page-${wpId}`;

    const images = extractImages(rawContent, 'jalsasalana.ng', title);
    for (const img of images) {
      await registerAsset(img);
    }
    const featuredImage = images.length > 0 ? images[0].originalUrl : null;

    await prisma.wordpress_migration_record.upsert({
      where: {
        sourceSite_wpId_postType: {
          sourceSite: 'jalsasalana.ng',
          wpId,
          postType: 'page'
        }
      },
      update: {
        title,
        slug,
        date: new Date('2024-01-01T10:00:00Z'),
        originalUrl: permalink,
        cleanContent,
        rawContent,
        excerpt: '',
        featuredImage,
        associatedType: 'PAGE'
      },
      create: {
        sourceSite: 'jalsasalana.ng',
        wpId,
        postType: 'page',
        title,
        slug,
        date: new Date('2024-01-01T10:00:00Z'),
        originalUrl: permalink,
        cleanContent,
        rawContent,
        excerpt: '',
        featuredImage,
        associatedType: 'PAGE'
      }
    });
    wpRecordsCount++;
  }

  console.log(`[Migration Records] Ingested ${wpRecordsCount} raw WordPress records into wordpress_migration_record.`);
  const assetCount = await prisma.wordpress_asset.count();
  console.log(`[WordPress Assets] Isolated and mapped ${assetCount} unique media assets into wordpress_asset.`);

  // 4. Ingest into Core Article & Page models for seamless live platform use
  console.log('\nPhase 1.4: Ingesting into Core Article & Page models...');

  let articleUpsertCount = 0;
  for (const row of blogPosts) {
    const wpId = parseInt(row.ID, 10);
    const title = (row.Title || 'Untitled').trim();
    if (!title || title.toLowerCase() === 'sample page') continue;

    const rawContent = row.Content || '';
    const cleanContent = sanitizeHtml(rawContent);
    const permalink = (row.Permalink || '').trim();
    const date = row.Date ? new Date(row.Date) : new Date();

    // Derived slug
    let slug = permalink ? permalink.replace(/^https?:\/\/[^\/]+\//, '').replace(/\/+$/, '') : slugify(title);
    if (!slug) slug = `article-${wpId}`;

    // Extract author
    const authorName = extractAuthorName(title, rawContent);
    const author = await ensureAuthor(authorName);

    // Images & Reading time
    const images = extractImages(rawContent, 'blog.jalsasalana.ng', title);
    const featuredImage = images.length > 0 ? images[0].originalUrl : null;
    const readingTime = calculateReadingTime(cleanContent);

    // Excerpt: use provided excerpt or first 200 characters of clean content
    let excerpt = (row.Excerpt || '').trim();
    if (!excerpt) {
      const textOnly = cleanContent.replace(/<[^>]*>/g, '').trim();
      excerpt = textOnly.length > 200 ? textOnly.substring(0, 197) + '...' : textOnly;
    }

    // Determine category
    const catSlugs = categorizeContent(title, cleanContent);

    // Upsert Article
    let article = await prisma.article.findUnique({ where: { slug } });
    if (article) {
      article = await prisma.article.update({
        where: { slug },
        data: {
          title,
          content: cleanContent,
          excerpt,
          featuredImage: featuredImage || article.featuredImage,
          readingTime,
          wpId,
          sourceSite: 'blog.jalsasalana.ng',
          originalUrl: permalink,
          publishedAt: date,
          status: 'PUBLISHED',
          updatedAt: new Date()
        }
      });
    } else {
      article = await prisma.article.create({
        data: {
          id: 'wp_art_' + wpId + '_' + Date.now().toString(36),
          title,
          slug,
          content: cleanContent,
          excerpt,
          featuredImage,
          readingTime,
          status: 'PUBLISHED',
          publishedAt: date,
          authorId: author.id,
          wpId,
          sourceSite: 'blog.jalsasalana.ng',
          originalUrl: permalink,
          updatedAt: new Date()
        }
      });
    }

    // Connect Categories
    for (const catSlug of catSlugs) {
      const cat = categoryMap.get(catSlug);
      if (cat) {
        await prisma.articlecategory.upsert({
          where: {
            articleId_categoryId: {
              articleId: article.id,
              categoryId: cat.id
            }
          },
          update: {},
          create: {
            articleId: article.id,
            categoryId: cat.id
          }
        });
      }
    }

    articleUpsertCount++;
  }

  console.log(`[Core Articles] Successfully ingested and mapped ${articleUpsertCount} articles with categories and authors.`);

  // Ingest Core Pages
  let pageUpsertCount = 0;
  for (const row of mainPages) {
    const wpId = parseInt(row['﻿id'] || row.id || row.ID, 10);
    const title = (row.Title || 'Untitled').trim();
    if (!title || title.toLowerCase() === 'sample page') continue;

    const rawContent = row.Content || '';
    const cleanContent = sanitizeHtml(rawContent);
    const slug = slugify(title) || `page-${wpId}`;
    const images = extractImages(rawContent, 'jalsasalana.ng', title);
    const featuredImage = images.length > 0 ? images[0].originalUrl : null;

    const textOnly = cleanContent.replace(/<[^>]*>/g, '').trim();
    const excerpt = textOnly.length > 200 ? textOnly.substring(0, 197) + '...' : textOnly;

    await prisma.page.upsert({
      where: { slug },
      update: {
        title,
        content: cleanContent,
        wpId,
        sourceSite: 'jalsasalana.ng',
        originalUrl: `https://jalsasalana.ng/?page_id=${wpId}`,
        featuredImage,
        excerpt,
        isPublished: true,
        updatedAt: new Date()
      },
      create: {
        id: 'wp_pg_' + wpId + '_' + Date.now().toString(36),
        title,
        slug,
        content: cleanContent,
        wpId,
        sourceSite: 'jalsasalana.ng',
        originalUrl: `https://jalsasalana.ng/?page_id=${wpId}`,
        featuredImage,
        excerpt,
        isPublished: true,
        updatedAt: new Date()
      }
    });
    pageUpsertCount++;
  }

  // Also ingest editorial pages from blog pages that aren't sample/privacy duplicate
  for (const row of blogPages) {
    const wpId = parseInt(row.ID, 10);
    const title = (row.Title || 'Untitled').trim();
    if (!title || title.toLowerCase() === 'sample page' || title.toLowerCase() === 'privacy policy') continue;

    const rawContent = row.Content || '';
    const cleanContent = sanitizeHtml(rawContent);
    let slug = row.Permalink ? row.Permalink.replace(/^https?:\/\/[^\/]+\//, '').replace(/\/+$/, '') : slugify(title);
    if (!slug) slug = `blog-page-${wpId}`;

    const images = extractImages(rawContent, 'blog.jalsasalana.ng', title);
    const featuredImage = images.length > 0 ? images[0].originalUrl : null;
    const textOnly = cleanContent.replace(/<[^>]*>/g, '').trim();
    const excerpt = textOnly.length > 200 ? textOnly.substring(0, 197) + '...' : textOnly;

    await prisma.page.upsert({
      where: { slug },
      update: {
        title,
        content: cleanContent,
        wpId,
        sourceSite: 'blog.jalsasalana.ng',
        originalUrl: row.Permalink || `https://blog.jalsasalana.ng/?page_id=${wpId}`,
        featuredImage,
        excerpt,
        isPublished: true,
        updatedAt: new Date()
      },
      create: {
        id: 'wp_bpg_' + wpId + '_' + Date.now().toString(36),
        title,
        slug,
        content: cleanContent,
        wpId,
        sourceSite: 'blog.jalsasalana.ng',
        originalUrl: row.Permalink || `https://blog.jalsasalana.ng/?page_id=${wpId}`,
        featuredImage,
        excerpt,
        isPublished: true,
        updatedAt: new Date()
      }
    });
    pageUpsertCount++;
  }

  console.log(`[Core Pages] Successfully ingested and published ${pageUpsertCount} static and editorial pages.`);

  console.log('\n======================================================');
  console.log('         MIGRATION PHASE 1 EXECUTION COMPLETE          ');
  console.log('======================================================');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
