import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const searchRouter = Router();

// GET /api/v1/search
searchRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      res.json({
        success: true,
        data: {
          articles: [],
          speeches: [],
          editions: [],
          authors: [],
          totalResults: 0,
        },
      });
      return;
    }

    const [articles, speeches, editions, authors] = await Promise.all([
      prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: q } },
            { subtitle: { contains: q } },
            { excerpt: { contains: q } },
            { content: { contains: q } },
          ],
        },
        take: 10,
        include: {
          author: { select: { name: true, slug: true } },
          categories: { include: { category: true } },
        },
      }),
      prisma.speech.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { speakerName: { contains: q } },
            { summary: { contains: q } },
            { transcript: { contains: q } },
          ],
        },
        take: 6,
        include: {
          edition: { select: { year: true, editionNumber: true } },
        },
      }),
      prisma.jalsaEdition.findMany({
        where: {
          OR: [
            { themeEnglish: { contains: q } },
            { venue: { contains: q } },
            { editionNumber: { contains: q } },
          ],
        },
        take: 4,
      }),
      prisma.author.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { bio: { contains: q } },
          ],
        },
        take: 4,
      }),
    ]);

    const totalResults = articles.length + speeches.length + editions.length + authors.length;

    res.json({
      success: true,
      query: q,
      data: {
        articles: articles.map((a) => ({
          ...a,
          categories: a.categories.map((c) => c.category),
        })),
        speeches,
        editions,
        authors,
        totalResults,
      },
    });
  } catch (err) {
    next(err);
  }
});
