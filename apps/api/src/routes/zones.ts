import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

const DEFAULT_ZONE_TELEMETRY = [
  {
    id: 'zone-male-gah',
    zoneKey: 'male-jalsa-gah',
    name: 'Jalsa Male Gah (Main Arena & Tahajjud)',
    sector: 'LEFT_MALE',
    type: 'PRAYER',
    status: 'GREEN',
    currentOccupancy: 8400,
    maxCapacity: 12000,
    mapCoordinates: { x: 30, y: 62, label: 'Male Gah (Left)' },
    alternateNote: 'Main convention marquee on the LEFT sector. Holds Tahajjud, Friday Jumu’ah, keynote lectures, and closing prayers.',
  },
  {
    id: 'zone-female-gah',
    zoneKey: 'female-jalsa-gah',
    name: 'Female Gah (Lajna Pavilion & Crèche)',
    sector: 'RIGHT_FEMALE',
    type: 'PRAYER',
    status: 'GREEN',
    currentOccupancy: 6200,
    maxCapacity: 9500,
    mapCoordinates: { x: 68, y: 38, label: 'Female Gah (Right)' },
    alternateNote: 'Dedicated Lajna Ima’illah marquee on the RIGHT sector with mother-care rooms, audio relays, and security protocol.',
  },
  {
    id: 'zone-central-stage',
    zoneKey: 'central-stage',
    name: 'Central Podium & Scholar Rostrum',
    sector: 'CENTRAL',
    type: 'PRAYER',
    status: 'GREEN',
    currentOccupancy: 120,
    maxCapacity: 180,
    mapCoordinates: { x: 48, y: 48, label: 'Central Stage' },
    alternateNote: 'Official dais for Amir Sahib, Missionary In-Charge, scholars, and award presentations.',
  },
  {
    id: 'zone-clinic',
    zoneKey: 'central-clinic',
    name: 'Central Medical Clinic & 24/7 Ambulance Bay',
    sector: 'CENTRAL',
    type: 'CLINIC',
    status: 'GREEN',
    currentOccupancy: 28,
    maxCapacity: 150,
    mapCoordinates: { x: 50, y: 26, label: 'Central Clinic' },
    alternateNote: 'Emergency triage post, ambulance bay, and pharmacy team staffed around the clock.',
  },
  {
    id: 'zone-gate-1',
    zoneKey: 'gate-north-1',
    name: 'Gate 1 (North Expressway Entry)',
    sector: 'PERIMETER',
    type: 'ENTRANCE',
    status: 'GREEN',
    currentOccupancy: 2400,
    maxCapacity: 5000,
    mapCoordinates: { x: 82, y: 16, label: 'Gate 1 (North Entry)' },
    alternateNote: 'Primary vehicular access road from the Ilaro Expressway.',
  },
  {
    id: 'zone-gate-2',
    zoneKey: 'gate-west-2',
    name: 'Gate 2 (West Registration Hub)',
    sector: 'PERIMETER',
    type: 'ENTRANCE',
    status: 'GREEN',
    currentOccupancy: 1600,
    maxCapacity: 4500,
    mapCoordinates: { x: 14, y: 46, label: 'Gate 2 (West Hub)' },
    alternateNote: 'Interstate coach terminal with 8 rapid biometric accreditation lanes.',
  },
  {
    id: 'zone-dining-male',
    zoneKey: 'main-dining-male',
    name: 'Men’s Main Dining Marquee',
    sector: 'LEFT_MALE',
    type: 'DINING',
    status: 'GREEN',
    currentOccupancy: 1450,
    maxCapacity: 2500,
    alternateZoneId: 'zone-dining-aux-b',
    alternateZone: {
      id: 'zone-dining-aux-b',
      zoneKey: 'aux-dining-male',
      name: 'Auxiliary Dining Marquee B',
      status: 'GREEN',
      currentOccupancy: 340,
      maxCapacity: 1200,
    },
    mapCoordinates: { x: 22, y: 80, label: 'Men’s Dining' },
    alternateNote: 'Catering hub for male delegates. If at peak capacity, delegates are rerouted to Auxiliary Marquee B.',
  },
  {
    id: 'zone-dining-aux-b',
    zoneKey: 'aux-dining-male',
    name: 'Auxiliary Dining Marquee B',
    sector: 'LEFT_MALE',
    type: 'DINING',
    status: 'GREEN',
    currentOccupancy: 340,
    maxCapacity: 1200,
    mapCoordinates: { x: 36, y: 84, label: 'Aux Dining B' },
    alternateNote: 'Overflow catering pavilion adjacent to the Men’s accommodation grounds.',
  },
  {
    id: 'zone-dining-lajna',
    zoneKey: 'lajna-dining-main',
    name: 'Lajna Ladies’ Dining Pavilion',
    sector: 'RIGHT_FEMALE',
    type: 'DINING',
    status: 'GREEN',
    currentOccupancy: 1250,
    maxCapacity: 2200,
    mapCoordinates: { x: 78, y: 58, label: 'Lajna Dining' },
    alternateNote: 'Dedicated catering pavilion situated securely within the Lajna grounds enclosure on the right.',
  },
  {
    id: 'zone-wudhu-men',
    zoneKey: 'sanitary-men-a',
    name: 'Men’s Central Wudhu Complex',
    sector: 'LEFT_MALE',
    type: 'SANITARY',
    status: 'GREEN',
    currentOccupancy: 180,
    maxCapacity: 400,
    mapCoordinates: { x: 24, y: 36, label: 'Men’s Wudhu' },
    alternateNote: 'Ablution bays and modern sanitary facilities located west of the main prayer marquee.',
  },
  {
    id: 'zone-wudhu-lajna',
    zoneKey: 'sanitary-lajna',
    name: 'Lajna Wudhu & Comfort Station',
    sector: 'RIGHT_FEMALE',
    type: 'SANITARY',
    status: 'GREEN',
    currentOccupancy: 140,
    maxCapacity: 350,
    mapCoordinates: { x: 74, y: 26, label: 'Lajna Wudhu' },
    alternateNote: 'Dedicated ablution bays and nursery facilities enclosed within the female sector.',
  },
];

export const zonesRouter = Router();

// GET /api/v1/zones — List all venue zones with live capacity & alternates
zonesRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type } = req.query;

    const where: any = {};
    if (type && typeof type === 'string') {
      where.type = type.toUpperCase();
    }

    let zones = await prisma.zoneTraffic.findMany({
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

    if (zones.length === 0) {
      zones = DEFAULT_ZONE_TELEMETRY.filter((z) => {
        if (!where.type) return true;
        return z.type === where.type;
      }) as any;
    }

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
