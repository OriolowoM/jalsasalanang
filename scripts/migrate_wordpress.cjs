const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper: Read a CSV file with csv-parser
function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`[CSV] File not found: ${fullPath}`);
      return resolve([]);
    }
    fs.createReadStream(fullPath)
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
  content = content.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  content = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<!--\s*\/?wp:[^\>]*-->/gi, '');
  content = content.replace(/&nbsp;/g, ' ');
  content = content.replace(/<p>\s*<\/p>/gi, '');
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
      images.push(url);
    }
  }

  const hrefImgRegex = /<a[^>]+href=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))["']/gi;
  while ((match = hrefImgRegex.exec(content)) !== null) {
    images.push(match[1]);
  }

  return [...new Set(images)];
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
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          color: cat.color,
          sortOrder: 10,
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
        name,
        slug,
        title: name.includes('Alatoye') ? 'Amir (National Head), Ahmadiyya Muslim Jamaat Nigeria' : 'Contributing Writer & Editorial Correspondent',
        bio: `${name} is an esteemed contributor to Jalsa Salana Nigeria digital editorial publications.`,
      }
    });
    console.log(`[Author] Created: ${name} (${slug})`);
  }
  return author;
}

async function main() {
  console.log('[Migrate WP] Starting WordPress Article & Page Ingestion...');

  // 1. Ensure Categories
  const categoryMap = await ensureCategories();

  // 2. Load CSV Datasets
  const blogPosts = await readCsv('data/csv_exports/wp_blog_posts.csv');
  const mainPosts = await readCsv('data/csv_exports/wp_main_posts.csv');
  const mainPages = await readCsv('data/csv_exports/wp_main_pages.csv');

  console.log(`[Migrate WP] Loaded ${blogPosts.length} blog posts, ${mainPosts.length} main posts, ${mainPages.length} pages.`);

  const artCategoryModel = prisma.articleCategory || prisma.articlecategory;

  // 3. Ingest Blog Posts into Article
  let articleUpsertCount = 0;
  for (const row of blogPosts) {
    const wpId = parseInt(row.ID, 10);
    const title = (row.Title || 'Untitled').trim();
    if (!title || title.toLowerCase() === 'sample page' || title.toLowerCase() === 'hello world!') continue;

    const rawContent = row.Content || '';
    const cleanContent = sanitizeHtml(rawContent);
    if (!cleanContent) continue;

    const permalink = (row.Permalink || '').trim();
    const date = row.Date ? new Date(row.Date) : new Date();

    let slug = permalink ? permalink.replace(/^https?:\/\/[^\/]+\//, '').replace(/\/+$/, '') : slugify(title);
    if (!slug) slug = `article-${wpId}`;

    const authorName = extractAuthorName(title, rawContent);
    const author = await ensureAuthor(authorName);

    const images = extractImages(rawContent, 'blog.jalsasalana.ng', title);
    const featuredImage = images.length > 0 ? images[0] : null;
    const readingTime = calculateReadingTime(cleanContent);

    let excerpt = (row.Excerpt || '').trim();
    if (!excerpt) {
      const textOnly = cleanContent.replace(/<[^>]*>/g, '').trim();
      excerpt = textOnly.length > 200 ? textOnly.substring(0, 197) + '...' : textOnly;
    }

    const catSlugs = categorizeContent(title, cleanContent);

    try {
      const article = await prisma.article.upsert({
        where: { slug },
        update: {
          title,
          content: cleanContent,
          excerpt,
          featuredImage: featuredImage || undefined,
          readingTime,
          wpId,
          sourceSite: 'blog.jalsasalana.ng',
          originalUrl: permalink,
          publishedAt: date,
          status: 'PUBLISHED',
        },
        create: {
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
        }
      });

      if (artCategoryModel) {
        for (const catSlug of catSlugs) {
          const cat = categoryMap.get(catSlug);
          if (cat) {
            try {
              await artCategoryModel.upsert({
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
            } catch (_) {}
          }
        }
      }

      articleUpsertCount++;
    } catch (artErr) {
      console.warn(`[Migrate WP] Article notice for "${title}":`, artErr.message);
    }
  }

  // 4. Ingest Main Posts into Article
  for (const row of mainPosts) {
    const wpId = parseInt(row['﻿id'] || row.id || row.ID, 10);
    const title = (row.Title || 'Untitled').trim();
    if (!title || title.toLowerCase() === 'sample page' || title.toLowerCase() === 'hello world!') continue;

    const rawContent = row.Content || '';
    const cleanContent = sanitizeHtml(rawContent);
    if (!cleanContent) continue;

    const permalink = `https://jalsasalana.ng/?p=${wpId}`;
    const slug = slugify(title) || `main-post-${wpId}`;

    const authorName = extractAuthorName(title, rawContent);
    const author = await ensureAuthor(authorName);

    const images = extractImages(rawContent, 'jalsasalana.ng', title);
    const featuredImage = images.length > 0 ? images[0] : null;
    const readingTime = calculateReadingTime(cleanContent);

    const textOnly = cleanContent.replace(/<[^>]*>/g, '').trim();
    const excerpt = textOnly.length > 200 ? textOnly.substring(0, 197) + '...' : textOnly;

    const catSlugs = categorizeContent(title, cleanContent);

    try {
      const article = await prisma.article.upsert({
        where: { slug },
        update: {
          title,
          content: cleanContent,
          excerpt,
          featuredImage: featuredImage || undefined,
          readingTime,
          wpId,
          sourceSite: 'jalsasalana.ng',
          originalUrl: permalink,
          publishedAt: new Date('2023-12-22T10:00:00Z'),
          status: 'PUBLISHED',
        },
        create: {
          title,
          slug,
          content: cleanContent,
          excerpt,
          featuredImage,
          readingTime,
          status: 'PUBLISHED',
          publishedAt: new Date('2023-12-22T10:00:00Z'),
          authorId: author.id,
          wpId,
          sourceSite: 'jalsasalana.ng',
          originalUrl: permalink,
        }
      });

      if (artCategoryModel) {
        for (const catSlug of catSlugs) {
          const cat = categoryMap.get(catSlug);
          if (cat) {
            try {
              await artCategoryModel.upsert({
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
            } catch (_) {}
          }
        }
      }

      articleUpsertCount++;
    } catch (artErr) {
      console.warn(`[Migrate WP] Main post notice for "${title}":`, artErr.message);
    }
  }

  console.log(`[Migrate WP] Successfully ingested ${articleUpsertCount} articles with categories and authors.`);
  return articleUpsertCount;
}

module.exports = { main };

if (require.main === module) {
  main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
}
