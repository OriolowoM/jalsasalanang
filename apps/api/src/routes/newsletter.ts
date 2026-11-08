import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { newsletterSubscribeSchema } from '@jalsa/shared';

export const newsletterRouter = Router();

// POST /api/v1/newsletter/subscribe
newsletterRouter.post('/subscribe', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, fullName, websiteHp } = newsletterSubscribeSchema.parse(req.body);

    // Spam honeypot
    if (websiteHp) {
      res.status(400).json({ success: false, message: 'Spam detected.' });
      return;
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.status === 'ACTIVE') {
        res.json({
          success: true,
          message: 'You are already subscribed to Jalsa Salana Nigeria editorial digests.',
        });
        return;
      }

      // Reactivate
      await prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: {
          status: 'ACTIVE',
          unsubscribedAt: null,
          subscribedAt: new Date(),
        },
      });

      res.json({
        success: true,
        message: 'Welcome back! Your subscription has been reactivated.',
      });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        fullName: fullName || null,
        token,
        ipAddress: req.ip || '',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Jazakallah! You have successfully subscribed to Jalsa Salana Nigeria publications.',
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/newsletter/subscribers
newsletterRouter.get('/subscribers', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || '25', 10)));
    const skip = (page - 1) * limit;

    const [subscribers, total, activeTotal] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        skip,
        take: limit,
        orderBy: { subscribedAt: 'desc' },
      }),
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({ where: { status: 'ACTIVE' } }),
    ]);

    res.json({
      success: true,
      data: subscribers,
      metrics: {
        total,
        active: activeTotal,
      },
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

// GET /api/v1/newsletter/export
newsletterRouter.get('/export', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=jalsa-subscribers-${new Date().toISOString().split('T')[0]}.csv`);

    let csv = 'ID,Full Name,Email,Status,Subscribed At,IP Address\n';
    for (const s of subscribers) {
      csv += `"${s.id}","${s.fullName || ''}","${s.email}","${s.status}","${s.subscribedAt.toISOString()}","${s.ipAddress || ''}"\n`;
    }

    res.send(csv);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/newsletter/unsubscribe
newsletterRouter.post('/unsubscribe', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ success: false, message: 'Unsubscribe token is required.' });
      return;
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { token },
    });

    if (!subscriber) {
      res.status(404).json({ success: false, message: 'Invalid unsubscribe token.' });
      return;
    }

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: 'UNSUBSCRIBED',
        unsubscribedAt: new Date(),
      },
    });

    res.json({ success: true, message: 'You have been unsubscribed from our publications.' });
  } catch (err) {
    next(err);
  }
});
