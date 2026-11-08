import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

export const menusRouter = Router();

// GET /api/v1/menus
menusRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const menus = await prisma.navigationMenu.findMany({
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    const map: Record<string, any[]> = {};
    for (const m of menus) {
      map[m.location] = m.items;
    }

    res.json({ success: true, data: map, list: menus });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/menus/:location/items
menusRouter.post('/:location/items', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { location } = req.params;
    const { items } = req.body; // Array of items: { title, url, sortOrder, target }

    const menu = await prisma.navigationMenu.findFirst({
      where: { location: location as any },
    });

    if (!menu) {
      res.status(404).json({ success: false, message: 'Menu not found for location.' });
      return;
    }

    // Replace items
    await prisma.navigationItem.deleteMany({ where: { menuId: menu.id } });

    if (Array.isArray(items) && items.length > 0) {
      await prisma.navigationItem.createMany({
        data: items.map((item: any, idx: number) => ({
          menuId: menu.id,
          title: item.title,
          url: item.url,
          sortOrder: item.sortOrder ?? idx,
          target: item.target || '_self',
        })),
      });
    }

    res.json({ success: true, message: 'Menu navigation updated.' });
  } catch (err) {
    next(err);
  }
});
