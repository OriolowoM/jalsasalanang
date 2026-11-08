import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { editionSchema } from '@jalsa/shared';

export const editionsRouter = Router();

// GET /api/v1/editions
editionsRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const editions = await prisma.jalsaEdition.findMany({
      orderBy: { year: 'desc' },
      include: {
        _count: {
          select: {
            articles: true,
            speeches: true,
            galleries: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: editions.map((e) => ({
        ...e,
        articlesCount: e._count.articles,
        speechesCount: e._count.speeches,
        galleriesCount: e._count.galleries,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/editions/current
editionsRouter.get('/current', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let current = await prisma.jalsaEdition.findFirst({
      where: { isCurrent: true },
      include: {
        speeches: { take: 5 },
        galleries: { take: 4 },
        articles: {
          where: { status: 'PUBLISHED' },
          take: 6,
          include: { author: true },
        },
      },
    });

    if (!current) {
      // Fallback to highest year
      current = await prisma.jalsaEdition.findFirst({
        orderBy: { year: 'desc' },
        include: {
          speeches: { take: 5 },
          galleries: { take: 4 },
          articles: {
            where: { status: 'PUBLISHED' },
            take: 6,
            include: { author: true },
          },
        },
      });
    }

    res.json({ success: true, data: current });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/editions/:yearOrId
editionsRouter.get('/:yearOrId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { yearOrId } = req.params;
    const year = parseInt(yearOrId, 10);

    const edition = await prisma.jalsaEdition.findFirst({
      where: {
        OR: [
          { id: yearOrId },
          ...(isNaN(year) ? [] : [{ year }]),
        ],
      },
      include: {
        speeches: {
          orderBy: { createdAt: 'desc' },
        },
        galleries: {
          include: {
            items: {
              include: { media: true },
              take: 6,
            },
          },
        },
        articles: {
          where: { status: 'PUBLISHED' },
          orderBy: { publishedAt: 'desc' },
          include: { author: true, categories: { include: { category: true } } },
        },
      },
    });

    if (!edition) {
      res.status(404).json({ success: false, message: 'Jalsa edition archive not found.' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...edition,
        articles: edition.articles.map((a) => ({
          ...a,
          categories: a.categories.map((c) => c.category),
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/editions
editionsRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = editionSchema.parse(req.body);

    // If marked current, unset other current editions
    if (input.isCurrent) {
      await prisma.jalsaEdition.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    const edition = await prisma.jalsaEdition.create({
      data: input,
    });

    res.status(201).json({ success: true, data: edition });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/editions/:id
editionsRouter.put('/:id', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const input = editionSchema.partial().parse(req.body);

    if (input.isCurrent) {
      await prisma.jalsaEdition.updateMany({
        where: { isCurrent: true, id: { not: id } },
        data: { isCurrent: false },
      });
    }

    const updated = await prisma.jalsaEdition.update({
      where: { id },
      data: input,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/editions/:id
editionsRouter.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.jalsaEdition.delete({ where: { id } });
    res.json({ success: true, message: 'Edition deleted successfully.' });
  } catch (err) {
    next(err);
  }
});
