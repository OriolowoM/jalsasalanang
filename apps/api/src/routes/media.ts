import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

export const mediaRouter = Router();

const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif|gif|svg|mp4|pdf|mp3|wav|ogg|m4a|aac/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Please upload JPEG, PNG, WebP, GIF, SVG, MP4, PDF, or Audio (MP3, WAV, OGG, M4A).'));
    }
  },
});

// GET /api/v1/media
mediaRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.min(200, Math.max(1, parseInt((req.query.limit as string) || '24', 10)));
    const skip = (page - 1) * limit;
    const search = ((req.query.search as string) || '').trim();
    const type = ((req.query.type as string) || '').trim();

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
        { fileUrl: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (type === 'image') {
      where.mimeType = { startsWith: 'image/' };
    } else if (type === 'audio') {
      where.mimeType = { startsWith: 'audio/' };
    } else if (type === 'video') {
      where.mimeType = { startsWith: 'video/' };
    } else if (type === 'document') {
      where.mimeType = { contains: 'pdf' };
    }

    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { edition: { select: { year: true, editionNumber: true } } },
      }),
      prisma.media.count({ where }),
    ]);

    res.json({
      success: true,
      data: items,
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

// POST /api/v1/media/upload
mediaRouter.post(
  '/upload',
  authenticate,
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded.' });
        return;
      }

      const { title, caption, credit, editionId } = req.body;
      const fileUrl = `/uploads/${req.file.filename}`;

      const media = await prisma.media.create({
        data: {
          title: title || req.file.originalname,
          caption: caption || null,
          credit: credit || 'Official Jalsa Media',
          fileUrl,
          mimeType: req.file.mimetype,
          fileSize: req.file.size,
          editionId: editionId || null,
        },
      });

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: media,
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/media/upload-multiple (WordPress-style bulk media upload)
mediaRouter.post(
  '/upload-multiple',
  authenticate,
  upload.array('files', 50),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ success: false, message: 'No files uploaded.' });
        return;
      }

      const { credit, editionId } = req.body;
      const createdMedia = [];

      for (const file of files) {
        const fileUrl = `/uploads/${file.filename}`;
        const cleanTitle = path.basename(file.originalname, path.extname(file.originalname));

        const item = await prisma.media.create({
          data: {
            title: cleanTitle || file.originalname,
            caption: null,
            credit: credit || 'Official Jalsa Media',
            fileUrl,
            mimeType: file.mimetype,
            fileSize: file.size,
            editionId: editionId || null,
          },
        });
        createdMedia.push(item);
      }

      res.status(201).json({
        success: true,
        message: `${createdMedia.length} files uploaded successfully.`,
        data: createdMedia,
      });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/media/:id
mediaRouter.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      res.status(404).json({ success: false, message: 'Media not found.' });
      return;
    }

    // Try deleting physical file if in local uploads
    const filename = path.basename(media.fileUrl);
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.media.delete({ where: { id } });
    res.json({ success: true, message: 'Media deleted successfully.' });
  } catch (err) {
    next(err);
  }
});
