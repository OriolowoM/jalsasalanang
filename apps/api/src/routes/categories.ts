import { Router, Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { categorySchema } from '@jalsa/shared';

export const categoriesRouter = Router();

// GET /api/v1/categories
categoriesRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    res.json({
      success: true,
      data: categories.map((c) => ({
        ...c,
        articlesCount: c._count.articles,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/categories/:slug
categoriesRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        articles: {
          where: { article: { status: 'PUBLISHED' } },
          take: 12,
          include: {
            article: {
              include: { author: true },
            },
          },
        },
      },
    });

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...category,
        articles: category.articles.map((a) => a.article),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/categories
categoriesRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = categorySchema.parse(req.body);
    const slug = input.slug || slugify(input.name, { lower: true, strict: true });

    const category = await prisma.category.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        image: input.image,
        color: input.color,
        sortOrder: input.sortOrder || 0,
      },
    });

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/categories/:id
categoriesRouter.put('/:id', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const input = categorySchema.partial().parse(req.body);

    const updated = await prisma.category.update({
      where: { id },
      data: input,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/categories/:id
categoriesRouter.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err) {
    next(err);
  }
});
