import { Router, Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

export const galleriesRouter = Router();

// GET /api/v1/galleries
galleriesRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { edition } = req.query;
    const where: any = {};

    if (edition) {
      where.edition = {
        OR: [
          { id: edition as string },
          { year: parseInt(edition as string, 10) || 0 },
        ],
      };
    }

    const galleries = await prisma.gallery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        edition: {
          select: { id: true, year: true, editionNumber: true },
        },
        items: {
          include: { media: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    res.json({
      success: true,
      data: galleries.map((g) => ({
        ...g,
        photosCount: g.items.length,
        photos: g.items.map((i) => ({
          id: i.media.id,
          title: i.media.title,
          url: i.media.fileUrl,
          caption: i.captionOverride || i.media.caption,
          credit: i.media.credit,
          width: i.media.width,
          height: i.media.height,
        })),
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/galleries/:slugOrId
galleriesRouter.get('/:slugOrId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slugOrId } = req.params;

    const gallery = await prisma.gallery.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId },
        ],
      },
      include: {
        edition: true,
        items: {
          include: { media: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!gallery) {
      res.status(404).json({ success: false, message: 'Gallery not found.' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...gallery,
        photos: gallery.items.map((i) => ({
          id: i.media.id,
          title: i.media.title,
          url: i.media.fileUrl,
          caption: i.captionOverride || i.media.caption,
          credit: i.media.credit,
          width: i.media.width,
          height: i.media.height,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/galleries
galleriesRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, coverImage, photographer, eventDay, videoUrl, editionId, mediaIds } = req.body;

    const baseSlug = slugify(title, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let count = 1;
    while (await prisma.gallery.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        slug: uniqueSlug,
        description,
        coverImage,
        photographer,
        eventDay,
        videoUrl,
        editionId: editionId || null,
        items: Array.isArray(mediaIds)
          ? {
              create: mediaIds.map((mId: string, idx: number) => ({
                mediaId: mId,
                sortOrder: idx,
              })),
            }
          : undefined,
      },
    });

    res.status(201).json({ success: true, data: gallery });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/galleries/:id
galleriesRouter.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.gallery.delete({ where: { id } });
    res.json({ success: true, message: 'Gallery deleted successfully.' });
  } catch (err) {
    next(err);
  }
});
