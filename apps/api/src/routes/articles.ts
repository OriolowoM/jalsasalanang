import { Router, Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import { prisma } from '../lib/prisma';
import { authenticate, requirePermission } from '../middleware/auth';
import { createArticleSchema, updateArticleSchema } from '@jalsa/shared';

export const articlesRouter = Router();

// Helper: Calculate reading time
function calculateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// GET /api/v1/articles
articlesRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || '10', 10)));
    const skip = (page - 1) * limit;

    const { category, edition, status, featuredType, tag, search, author } = req.query;

    const where: any = {};

    // By default, public API only returns PUBLISHED articles
    if (status) {
      where.status = status as string;
    } else if (!req.query.adminView) {
      where.status = 'PUBLISHED';
    }

    if (featuredType) {
      where.featuredType = featuredType as string;
    }

    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category as string,
          },
        },
      };
    }

    if (edition) {
      where.edition = {
        OR: [
          { id: edition as string },
          { year: parseInt(edition as string, 10) || 0 },
        ],
      };
    }

    if (author) {
      where.author = {
        slug: author as string,
      };
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag as string,
          },
        },
      };
    }

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { title: { contains: q } },
        { subtitle: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          author: true,
          edition: {
            select: { id: true, year: true, editionNumber: true, themeEnglish: true },
          },
          categories: {
            include: {
              category: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.json({
      success: true,
      data: articles.map((a) => ({
        ...a,
        categories: a.categories.map((c) => c.category),
        tags: a.tags.map((t) => t.tag),
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/articles/:slugOrId
articlesRouter.get('/:slugOrId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slugOrId } = req.params;

    const article = await prisma.article.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId },
        ],
      },
      include: {
        author: true,
        edition: true,
        translations: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!article) {
      res.status(404).json({ success: false, message: 'Article not found.' });
      return;
    }

    // Increment view count asynchronously
    prisma.article.update({
      where: { id: article.id },
      data: { viewsCount: { increment: 1 } },
    }).catch(console.error);

    // Track detailed view in ArticleView
    prisma.articleView.create({
      data: {
        articleId: article.id,
        ipAddress: req.ip || '',
        userAgent: req.headers['user-agent'] || '',
        referrer: req.headers.referer || '',
      },
    }).catch(console.error);

    // Fetch next and previous articles
    const [previousArticle, nextArticle, relatedArticles] = await Promise.all([
      prisma.article.findFirst({
        where: {
          status: 'PUBLISHED',
          publishedAt: { lt: article.publishedAt || article.createdAt },
        },
        orderBy: { publishedAt: 'desc' },
        select: { id: true, title: true, slug: true, featuredImage: true },
      }),
      prisma.article.findFirst({
        where: {
          status: 'PUBLISHED',
          publishedAt: { gt: article.publishedAt || article.createdAt },
        },
        orderBy: { publishedAt: 'asc' },
        select: { id: true, title: true, slug: true, featuredImage: true },
      }),
      prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          id: { not: article.id },
          categories: {
            some: {
              categoryId: {
                in: article.categories.map((c) => c.categoryId),
              },
            },
          },
        },
        take: 3,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: true,
          categories: { include: { category: true } },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        ...article,
        categories: article.categories.map((c) => c.category),
        tags: article.tags.map((t) => t.tag),
        previousArticle,
        nextArticle,
        relatedArticles: relatedArticles.map((r) => ({
          ...r,
          categories: r.categories.map((c) => c.category),
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/articles
articlesRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = createArticleSchema.parse(req.body);

    const baseSlug = input.slug || slugify(input.title, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let count = 1;
    while (await prisma.article.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    const readingTime = input.readingTime || calculateReadingTime(input.content);

    const article = await prisma.article.create({
      data: {
        title: input.title,
        slug: uniqueSlug,
        subtitle: input.subtitle,
        excerpt: input.excerpt,
        content: input.content,
        featuredImage: input.featuredImage,
        imageCredit: input.imageCredit,
        readingTime,
        featuredType: input.featuredType,
        status: input.status,
        publishedAt: input.status === 'PUBLISHED' ? new Date() : input.publishedAt ? new Date(input.publishedAt) : null,
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
        authorId: input.authorId,
        createdById: req.user!.id,
        editionId: input.editionId || null,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        canonicalUrl: input.canonicalUrl || null,
        ogImage: input.ogImage,
        categories: {
          create: input.categoryIds.map((cid) => ({ categoryId: cid })),
        },
        revisions: {
          create: {
            title: input.title,
            subtitle: input.subtitle,
            excerpt: input.excerpt,
            content: input.content,
            changedById: req.user!.id,
          },
        },
      },
      include: {
        author: true,
        categories: { include: { category: true } },
      },
    });

    // Handle tag connections
    if (input.tagNames && input.tagNames.length > 0) {
      for (const tagName of input.tagNames) {
        const tagSlug = slugify(tagName, { lower: true, strict: true });
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          create: { name: tagName, slug: tagSlug },
          update: {},
        });
        await prisma.articleTag.create({
          data: { articleId: article.id, tagId: tag.id },
        });
      }
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'ARTICLE_CREATED',
        entityType: 'Article',
        entityId: article.id,
        ipAddress: req.ip || '',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/articles/:id
articlesRouter.put('/:id', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const input = updateArticleSchema.parse(req.body);

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Article not found.' });
      return;
    }

    const readingTime = input.content ? calculateReadingTime(input.content) : input.readingTime ?? existing.readingTime;

    const data: any = {
      ...input,
      readingTime,
      updatedAt: new Date(),
    };

    delete data.categoryIds;
    delete data.tagNames;

    if (input.status === 'PUBLISHED' && existing.status !== 'PUBLISHED' && !existing.publishedAt) {
      data.publishedAt = new Date();
    }

    // Update main article
    const updated = await prisma.article.update({
      where: { id },
      data,
    });

    // Create revision snapshot
    await prisma.articleRevision.create({
      data: {
        articleId: id,
        title: updated.title,
        subtitle: updated.subtitle,
        excerpt: updated.excerpt,
        content: updated.content,
        changedById: req.user!.id,
      },
    });

    // Update categories if provided
    if (input.categoryIds) {
      await prisma.articleCategory.deleteMany({ where: { articleId: id } });
      await prisma.articleCategory.createMany({
        data: input.categoryIds.map((cid) => ({ articleId: id, categoryId: cid })),
      });
    }

    // Update tags if provided
    if (input.tagNames) {
      await prisma.articleTag.deleteMany({ where: { articleId: id } });
      for (const tagName of input.tagNames) {
        const tagSlug = slugify(tagName, { lower: true, strict: true });
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          create: { name: tagName, slug: tagSlug },
          update: {},
        });
        await prisma.articleTag.create({
          data: { articleId: id, tagId: tag.id },
        });
      }
    }

    res.json({
      success: true,
      message: 'Article updated successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/articles/:id/status
articlesRouter.patch('/:id/status', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'];
    if (!allowed.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid article status.' });
      return;
    }

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Article not found.' });
      return;
    }

    const updateData: any = { status };
    if (status === 'PUBLISHED' && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updated = await prisma.article.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: `ARTICLE_STATUS_${status}`,
        entityType: 'Article',
        entityId: id,
        ipAddress: req.ip || '',
      },
    });

    res.json({
      success: true,
      message: `Article status updated to ${status}.`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/articles/:id
articlesRouter.delete('/:id', authenticate, requirePermission('delete_articles'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.article.delete({ where: { id } });

    res.json({ success: true, message: 'Article deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/articles/:id/revisions
articlesRouter.get('/:id/revisions', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const revisions = await prisma.articleRevision.findMany({
      where: { articleId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        changedBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    res.json({ success: true, data: revisions });
  } catch (err) {
    next(err);
  }
});
