const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: 'apps/api/.env' });
const https = require('https');

const prisma = new PrismaClient();

// Translation function using Gemini
async function translateWithGemini(title, excerpt, content, locale) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

  const languageNames = {
    YO: 'Yoruba (Èdè Yorùbá)',
    HA: 'Hausa (Harshen Hausa)',
    IG: 'Igbo (Asụsụ Igbo)',
  };

  const targetLang = languageNames[locale] || 'Yoruba';

  const systemInstruction = `You are an expert Islamic and theological translator specializing in Nigerian languages (${targetLang}).
Translate the provided English article into fluent, dignified ${targetLang} suitable for Ahmadiyya Muslim Jama'at Nigeria publications.
Rules:
- Preserve all HTML formatting tags (<p>, <h2>, <blockquote>, <strong>).
- Preserve Islamic honorifics: (saw), (as), (aba), (ra).
- Keep Quranic Arabic script unchanged.
Return strictly valid JSON:
{
  "title": "translated title",
  "excerpt": "translated excerpt",
  "content": "translated content preserving HTML"
}`;

  const prompt = `Title: ${title}\nExcerpt: ${excerpt || ''}\nContent:\n${content.substring(0, 3000)}`;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { maxOutputTokens: 2500, temperature: 0.2 },
  };

  const postData = JSON.stringify(payload);

  const models = ['gemini-3.1-flash-lite-preview', 'gemini-3-flash-preview'];

  for (const model of models) {
    try {
      const responseText = await new Promise((resolve, reject) => {
        const req = https.request(
          {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(postData),
            },
            timeout: 25000,
          },
          (res) => {
            let data = '';
            res.on('data', (c) => (data += c));
            res.on('end', () => {
              if (res.statusCode >= 200 && res.statusCode < 300) resolve(data);
              else reject(new Error(`Status ${res.statusCode}: ${data}`));
            });
          }
        );
        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Timed out'));
        });
        req.write(postData);
        req.end();
      });

      const parsed = JSON.parse(responseText);
      const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (e) {
      console.warn(`[${model}] Translation warning for ${locale}:`, e.message);
    }
  }

  return {
    title: `[${locale}] ${title}`,
    excerpt: `[${locale}] ${excerpt || ''}`,
    content: `<div class="translation-pending"><p><em>(${targetLang} translation queued for review)</em></p>${content}</div>`,
  };
}

async function runBatchTranslation() {
  console.log('=== STARTING BATCH ARTICLE TRANSLATION ENGINE ===\n');

  // Fetch top 3 published articles
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    take: 3,
    orderBy: { viewsCount: 'desc' },
    select: { id: true, title: true, excerpt: true, content: true, slug: true },
  });

  console.log(`Found ${articles.length} prominent articles to translate.`);

  const locales = ['YO', 'HA', 'IG'];

  for (const art of articles) {
    console.log(`\nProcessing: "${art.title}" (${art.slug})`);

    for (const locale of locales) {
      // Check if already translated
      const existing = await prisma.articleTranslation.findUnique({
        where: { articleId_locale: { articleId: art.id, locale } },
      });

      if (existing) {
        console.log(`  -> [${locale}] Already exists in database (${existing.status}). Skipping.`);
        continue;
      }

      console.log(`  -> [${locale}] Translating with Gemini AI...`);
      const startTime = Date.now();

      try {
        const translated = await translateWithGemini(art.title, art.excerpt, art.content, locale);
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        await prisma.articleTranslation.create({
          data: {
            articleId: art.id,
            locale,
            title: translated.title,
            excerpt: translated.excerpt,
            content: translated.content,
            status: 'PENDING_REVIEW',
            translatedBy: 'GEMINI_AI',
          },
        });

        console.log(`     [${locale}] Translated & saved in ${duration}s -> "${translated.title.substring(0, 45)}..." (Status: PENDING_REVIEW)`);
      } catch (err) {
        console.error(`     [${locale}] Translation error:`, err.message);
      }
    }
  }

  // Count total translations in DB
  const totalInDb = await prisma.articleTranslation.count();
  console.log(`\n=== BATCH TRANSLATION COMPLETED ===`);
  console.log(`Total localized article records in database: ${totalInDb}`);

  await prisma.$disconnect();
}

runBatchTranslation().catch((e) => {
  console.error(e);
  process.exit(1);
});
