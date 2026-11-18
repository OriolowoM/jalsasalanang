import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const zonesRouter = Router();

// GET /api/v1/zones — List all venue zones with live capacity & alternates
zonesRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type } = req.query;

    const where: any = {};
    if (type && typeof type === 'string') {
      where.type = type.toUpperCase();
    }

    const zones = await prisma.zoneTraffic.findMany({
      where,
      include: {
        alternateZone: {
          select: {
            id: true,
            zoneKey: true,
            name: true,
            status: true,
            currentOccupancy: true,
            maxCapacity: true,
          },
        },
      },
      orderBy: [{ status: 'desc' }, { name: 'asc' }],
    });

    // Summary statistics
    const stats = {
      totalZones: zones.length,
      redCount: zones.filter((z) => z.status === 'RED').length,
      orangeCount: zones.filter((z) => z.status === 'ORANGE').length,
      greenCount: zones.filter((z) => z.status === 'GREEN').length,
      totalOccupancy: zones.reduce((acc, z) => acc + z.currentOccupancy, 0),
      totalCapacity: zones.reduce((acc, z) => acc + z.maxCapacity, 0),
    };

    res.json({
      success: true,
      data: {
        stats,
        zones,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/zones/:keyOrId — Single zone details
zonesRouter.get('/:keyOrId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { keyOrId } = req.params;

    const zone = await prisma.zoneTraffic.findFirst({
      where: {
        OR: [{ id: keyOrId }, { zoneKey: keyOrId }],
      },
      include: {
        alternateZone: true,
        alternativeFor: true,
      },
    });

    if (!zone) {
      res.status(404).json({ success: false, message: 'Zone node not found.' });
      return;
    }

    res.json({
      success: true,
      data: zone,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/zones/:id/traffic — Update zone occupancy and live status
zonesRouter.patch('/:id/traffic', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { currentOccupancy, status, alternateNote, lastUpdatedBy } = req.body;

    const existing = await prisma.zoneTraffic.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Zone node not found.' });
      return;
    }

    // Determine status automatically if occupancy changed and status not explicitly forced
    let newStatus = status || existing.status;
    const newOccupancy = typeof currentOccupancy === 'number' ? currentOccupancy : existing.currentOccupancy;

    if (!status && typeof currentOccupancy === 'number') {
      const ratio = newOccupancy / existing.maxCapacity;
      if (ratio >= 0.9) {
        newStatus = 'RED';
      } else if (ratio >= 0.7) {
        newStatus = 'ORANGE';
      } else {
        newStatus = 'GREEN';
      }
    }

    const updated = await prisma.zoneTraffic.update({
      where: { id },
      data: {
        currentOccupancy: newOccupancy,
        status: newStatus,
        alternateNote: alternateNote !== undefined ? alternateNote : existing.alternateNote,
        lastUpdatedBy: lastUpdatedBy || 'Grounds Marshal',
        updatedAt: new Date(),
      },
      include: {
        alternateZone: true,
      },
    });

    res.json({
      success: true,
      message: `Zone ${updated.name} updated to ${updated.status}.`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/zones/simulate — Quick rush-hour scenario testing
zonesRouter.post('/simulate', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { scenario } = req.body; // 'dining-rush' | 'prayer-rush' | 'normal'

    if (scenario === 'dining-rush') {
      await prisma.zoneTraffic.updateMany({
        where: { zoneKey: 'main-dining-male' },
        data: { currentOccupancy: 2480, status: 'RED' },
      });
      await prisma.zoneTraffic.updateMany({
        where: { zoneKey: 'aux-dining-male' },
        data: { currentOccupancy: 420, status: 'GREEN' },
      });
      await prisma.zoneTraffic.updateMany({
        where: { zoneKey: 'lajna-dining-main' },
        data: { currentOccupancy: 2180, status: 'RED' },
      });
      await prisma.zoneTraffic.updateMany({
        where: { zoneKey: 'lajna-dining-annex' },
        data: { currentOccupancy: 350, status: 'GREEN' },
      });
    } else if (scenario === 'prayer-rush') {
      await prisma.zoneTraffic.updateMany({
        where: { zoneKey: 'sanitary-men-a' },
        data: { currentOccupancy: 395, status: 'RED' },
      });
      await prisma.zoneTraffic.updateMany({
        where: { zoneKey: 'sanitary-men-b' },
        data: { currentOccupancy: 110, status: 'GREEN' },
      });
      await prisma.zoneTraffic.updateMany({
        where: { zoneKey: 'gate-north-1' },
        data: { currentOccupancy: 4900, status: 'RED' },
      });
    } else {
      // Normal balanced state
      await prisma.zoneTraffic.updateMany({
        where: { zoneKey: 'main-dining-male' },
        data: { currentOccupancy: 1400, status: 'ORANGE' },
      });
      await prisma.zoneTraffic.updateMany({
        where: { zoneKey: 'aux-dining-male' },
        data: { currentOccupancy: 300, status: 'GREEN' },
      });
      await prisma.zoneTraffic.updateMany({
        where: { zoneKey: 'gate-north-1' },
        data: { currentOccupancy: 2200, status: 'GREEN' },
      });
      await prisma.zoneTraffic.updateMany({
        where: { zoneKey: 'sanitary-men-a' },
        data: { currentOccupancy: 180, status: 'GREEN' },
      });
    }

    const allZones = await prisma.zoneTraffic.findMany({
      include: { alternateZone: true },
    });

    res.json({
      success: true,
      message: `Grounds scenario '${scenario || 'normal'}' applied.`,
      data: allZones,
    });
  } catch (err) {
    next(err);
  }
});
