import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

export const pagesRouter = Router();

// GET /api/v1/pages
pagesRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { title: 'asc' },
    });
    res.json({ success: true, data: pages });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/pages/:slug
pagesRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const page = await prisma.page.findUnique({
      where: { slug },
    });

    if (!page) {
      res.status(404).json({ success: false, message: 'Page not found.' });
      return;
    }

    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/pages
pagesRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, slug, content, metaTitle, metaDescription, isPublished } = req.body;
    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        metaTitle,
        metaDescription,
        isPublished: isPublished ?? true,
      },
    });

    res.status(201).json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/pages/:id
pagesRouter.put('/:id', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, metaTitle, metaDescription, isPublished } = req.body;

    const page = await prisma.page.update({
      where: { id },
      data: {
        title,
        content,
        metaTitle,
        metaDescription,
        isPublished,
      },
    });

    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
});
