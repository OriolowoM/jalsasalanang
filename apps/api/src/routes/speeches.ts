import { Router, Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { speechSchema } from '@jalsa/shared';

export const speechesRouter = Router();

// GET /api/v1/speeches
speechesRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) || '12', 10)));
    const skip = (page - 1) * limit;

    const { edition, speaker, speechType, search } = req.query;

    const where: any = {};

    if (edition) {
      where.edition = {
        OR: [
          { id: edition as string },
          { year: parseInt(edition as string, 10) || 0 },
        ],
      };
    }

    if (speaker) {
      where.speakerName = { contains: speaker as string };
    }

    if (speechType) {
      where.speechType = speechType as string;
    }

    if (search) {
      const q = String(search).trim();
      where.OR = [
        { title: { contains: q } },
        { speakerName: { contains: q } },
        { summary: { contains: q } },
        { transcript: { contains: q } },
      ];
    }

    const [speeches, total] = await Promise.all([
      prisma.speech.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          edition: {
            select: { id: true, year: true, editionNumber: true, themeEnglish: true },
          },
        },
      }),
      prisma.speech.count({ where }),
    ]);

    res.json({
      success: true,
      data: speeches,
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

// GET /api/v1/speeches/:slugOrId
speechesRouter.get('/:slugOrId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slugOrId } = req.params;

    const speech = await prisma.speech.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId },
        ],
      },
      include: {
        edition: true,
      },
    });

    if (!speech) {
      res.status(404).json({ success: false, message: 'Speech not found.' });
      return;
    }

    // Related speeches from same speaker or edition
    const related = await prisma.speech.findMany({
      where: {
        id: { not: speech.id },
        OR: [
          { speakerName: speech.speakerName },
          { editionId: speech.editionId },
        ],
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        edition: {
          select: { year: true, editionNumber: true },
        },
      },
    });

    res.json({
      success: true,
      data: {
        ...speech,
        relatedSpeeches: related,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/speeches
speechesRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = speechSchema.parse(req.body);

    const baseSlug = input.slug || slugify(input.title, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let count = 1;
    while (await prisma.speech.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    const speech = await prisma.speech.create({
      data: {
        ...input,
        slug: uniqueSlug,
      },
      include: { edition: true },
    });

    res.status(201).json({ success: true, data: speech });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/speeches/:id
speechesRouter.put('/:id', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const input = speechSchema.partial().parse(req.body);

    const updated = await prisma.speech.update({
      where: { id },
      data: input,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/speeches/:id
speechesRouter.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.speech.delete({ where: { id } });
    res.json({ success: true, message: 'Speech deleted successfully.' });
  } catch (err) {
    next(err);
  }
});
