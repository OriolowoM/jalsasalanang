import { Router, Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

export const authorsRouter = Router();

// GET /api/v1/authors
authorsRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    res.json({
      success: true,
      data: authors.map((a) => ({
        ...a,
        articlesCount: a._count.articles,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/authors/:slug
authorsRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const author = await prisma.author.findUnique({
      where: { slug },
      include: {
        articles: {
          where: { status: 'PUBLISHED' },
          orderBy: { publishedAt: 'desc' },
          include: {
            categories: { include: { category: true } },
          },
        },
      },
    });

    if (!author) {
      res.status(404).json({ success: false, message: 'Author not found.' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...author,
        articles: author.articles.map((a) => ({
          ...a,
          categories: a.categories.map((c) => c.category),
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/authors
authorsRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, title, bio, avatar, email, twitter, linkedin } = req.body;
    const baseSlug = slugify(name, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let count = 1;
    while (await prisma.author.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    const author = await prisma.author.create({
      data: {
        name,
        slug: uniqueSlug,
        title,
        bio,
        avatar,
        email,
        twitter,
        linkedin,
      },
    });

    res.status(201).json({ success: true, data: author });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/authors/:id
authorsRouter.put('/:id', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, title, bio, avatar, email, twitter, linkedin } = req.body;

    const updated = await prisma.author.update({
      where: { id },
      data: { name, title, bio, avatar, email, twitter, linkedin },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});
