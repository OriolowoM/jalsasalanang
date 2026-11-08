import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

export const settingsRouter = Router();

// GET /api/v1/settings
settingsRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    res.json({ success: true, data: map, list: settings });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/settings
settingsRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { settings } = req.body; // Key-value object
    if (typeof settings !== 'object' || settings === null) {
      res.status(400).json({ success: false, message: 'Settings object is required.' });
      return;
    }

    for (const [key, value] of Object.entries(settings)) {
      await prisma.siteSetting.upsert({
        where: { key },
        create: { key, value: String(value) },
        update: { value: String(value) },
      });
    }

    res.json({ success: true, message: 'Settings saved successfully.' });
  } catch (err) {
    next(err);
  }
});
