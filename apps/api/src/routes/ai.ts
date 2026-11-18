import { Router, Request, Response } from 'express';
import {
  askJalsaAI,
  generateItineraryAI,
  translateContentAI,
  semanticSearchAI,
  generateArticleSEO,
  checkEditorialPolish,
} from '../services/ai';
import { authenticate } from '../middleware/auth';
import { prisma } from '../lib/prisma';

export const aiRouter = Router();

// -------------------------------------------------------------------
// Feature 1: The "Jalsa Companion" Smart Concierge Chat
// POST /api/v1/ai/chat
// -------------------------------------------------------------------
aiRouter.post('/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, sessionId, history } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ success: false, message: 'A valid question or query is required.' });
      return;
    }

    const result = await askJalsaAI(query, sessionId, history);
    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error in Jalsa Companion chat.', error: err.message });
  }
});

// Backward-compatible alias for existing Ask Jalsa AI widget
aiRouter.post('/ask', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, sessionId } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ success: false, message: 'Please provide a search or question query.' });
      return;
    }

    const result = await askJalsaAI(query, sessionId);
    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error processing AI request.', error: err.message });
  }
});

// -------------------------------------------------------------------
// Feature 2: Personalized Itinerary & Dashboard
// POST /api/v1/ai/itinerary
// -------------------------------------------------------------------
aiRouter.post('/itinerary', async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, travelOrigin, category, userName } = req.body;
    const plan = await generateItineraryAI({
      role: role || 'Member / Delegate',
      travelOrigin: travelOrigin || 'Nigeria',
      category: category || 'General Attendee',
      userName: userName || 'Delegate',
    });

    res.json({
      success: true,
      data: plan,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to generate personalized itinerary.', error: err.message });
  }
});

// -------------------------------------------------------------------
// Feature 4: Automated Multilingual Translation
// POST /api/v1/ai/translate
// -------------------------------------------------------------------
aiRouter.post('/translate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { articleId, title, excerpt, content, locale } = req.body;

    if (!locale || !['YO', 'HA', 'IG', 'AR'].includes(locale)) {
      res.status(400).json({ success: false, message: 'Valid target locale (YO, HA, IG, AR) is required.' });
      return;
    }

    let sourceTitle = title;
    let sourceExcerpt = excerpt || '';
    let sourceContent = content;

    // If articleId is supplied, retrieve from DB if not passed in body
    if (articleId && (!sourceTitle || !sourceContent)) {
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        select: { title: true, excerpt: true, content: true },
      });
      if (!article) {
        res.status(404).json({ success: false, message: 'Article not found.' });
        return;
      }
      sourceTitle = article.title;
      sourceExcerpt = article.excerpt || '';
      sourceContent = article.content;
    }

    if (!sourceTitle || !sourceContent) {
      res.status(400).json({ success: false, message: 'Title and content are required for translation.' });
      return;
    }

    const translated = await translateContentAI(sourceTitle, sourceExcerpt, sourceContent, locale as any);

    // If articleId is present, persist to database in PENDING_REVIEW status
    let savedRecord = null;
    if (articleId) {
      savedRecord = await prisma.articleTranslation.upsert({
        where: {
          articleId_locale: {
            articleId,
            locale: locale as any,
          },
        },
        update: {
          title: translated.title,
          excerpt: translated.excerpt,
          content: translated.content,
          status: 'PENDING_REVIEW',
          updatedAt: new Date(),
        },
        create: {
          articleId,
          locale: locale as any,
          title: translated.title,
          excerpt: translated.excerpt,
          content: translated.content,
          status: 'PENDING_REVIEW',
        },
      });
    }

    res.json({
      success: true,
      data: {
        translation: translated,
        savedRecord,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Translation failed.', error: err.message });
  }
});

// -------------------------------------------------------------------
// Feature 5: Semantic "Thematic" Search
// GET /api/v1/ai/semantic-search?q=...
// -------------------------------------------------------------------
aiRouter.get('/semantic-search', async (req: Request, res: Response): Promise<void> => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      res.json({
        success: true,
        data: {
          thematicSummary: '',
          extractedThemes: [],
          articles: [],
          speeches: [],
          totalResults: 0,
        },
      });
      return;
    }

    // 1. Analyze user intent with Gemini
    const { thematicSummary, extractedThemes, searchTerms } = await semanticSearchAI(q);

    // 2. Build multi-keyword DB lookup
    const searchConditions = [
      { title: { contains: q } },
      { subtitle: { contains: q } },
      { excerpt: { contains: q } },
      ...searchTerms.map((term) => ({ title: { contains: term } })),
      ...searchTerms.map((term) => ({ excerpt: { contains: term } })),
      ...extractedThemes.map((theme) => ({ title: { contains: theme } })),
    ];

    const [articles, speeches] = await Promise.all([
      prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          OR: searchConditions,
        },
        take: 12,
        orderBy: { viewsCount: 'desc' },
        include: {
          author: { select: { name: true, slug: true } },
          categories: { include: { category: true } },
        },
      }),
      prisma.speech.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { summary: { contains: q } },
            ...searchTerms.map((term) => ({ title: { contains: term } })),
          ],
        },
        take: 6,
        include: {
          edition: { select: { year: true, editionNumber: true } },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        thematicSummary,
        extractedThemes,
        articles: articles.map((a) => ({
          ...a,
          categories: a.categories.map((c) => c.category),
        })),
        speeches,
        totalResults: articles.length + speeches.length,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Semantic search failed.', error: err.message });
  }
});

// -------------------------------------------------------------------
// CMS Editorial Helpers (Auth Protected)
// -------------------------------------------------------------------
aiRouter.post('/generate-metadata', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      res.status(400).json({ success: false, message: 'Title and content are required.' });
      return;
    }

    const metadata = await generateArticleSEO(title, content);
    res.json({ success: true, data: metadata });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to generate SEO metadata.', error: err.message });
  }
});

aiRouter.post('/polish', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    if (!content) {
      res.status(400).json({ success: false, message: 'Content is required.' });
      return;
    }

    const report = await checkEditorialPolish(content);
    res.json({ success: true, data: report });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to run editorial polish.', error: err.message });
  }
});
