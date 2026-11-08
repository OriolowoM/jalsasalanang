import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

export const analyticsRouter = Router();

// GET /api/v1/analytics/dashboard
analyticsRouter.get('/dashboard', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      pendingArticles,
      approvedArticles,
      scheduledArticles,
      archivedArticles,
      totalSpeeches,
      totalEditions,
      totalGalleries,
      totalSubscribers,
      totalAuthors,
      viewsSum,
      mostViewed,
      categories,
      recentActivity,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({ where: { status: 'DRAFT' } }),
      prisma.article.count({ where: { status: 'PENDING_REVIEW' } }),
      prisma.article.count({ where: { status: 'APPROVED' } }),
      prisma.article.count({ where: { status: 'SCHEDULED' } }),
      prisma.article.count({ where: { status: 'ARCHIVED' } }),
      prisma.speech.count(),
      prisma.jalsaEdition.count(),
      prisma.gallery.count(),
      prisma.newsletterSubscriber.count({ where: { status: 'ACTIVE' } }),
      prisma.author.count(),
      prisma.article.aggregate({ _sum: { viewsCount: true } }),
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { viewsCount: 'desc' },
        take: 5,
        select: { id: true, title: true, slug: true, viewsCount: true, publishedAt: true },
      }),
      prisma.category.findMany({
        take: 6,
        include: {
          _count: { select: { articles: true } },
        },
      }),
      prisma.auditLog.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
      }),
    ]);

    // Simulated / tracked 7-day view distribution
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const viewsByDay = await prisma.articleView.groupBy({
      by: ['viewedAt'],
      where: {
        viewedAt: { gte: sevenDaysAgo },
      },
      _count: { id: true },
    });

    res.json({
      success: true,
      data: {
        counts: {
          totalArticles,
          publishedArticles,
          draftArticles,
          pendingArticles,
          approvedArticles,
          scheduledArticles,
          archivedArticles,
          totalSpeeches,
          totalEditions,
          totalGalleries,
          totalSubscribers,
          totalAuthors,
          totalViews: viewsSum._sum.viewsCount || 0,
        },
        mostViewed,
        categories: categories.map((c) => ({
          name: c.name,
          slug: c.slug,
          count: c._count.articles,
        })),
        recentActivity: recentActivity.map((a) => ({
          id: a.id,
          action: a.action,
          entityType: a.entityType,
          entityId: a.entityId,
          createdAt: a.createdAt,
          user: a.user ? `${a.user.firstName} ${a.user.lastName}` : 'System',
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});
