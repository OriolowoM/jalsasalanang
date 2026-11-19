import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';

export const usersRouter = Router();

// GET /api/v1/users/me/dashboard — Feature 2: Personalized Dashboard Data
usersRouter.get('/me/dashboard', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        role: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const currentEdition = await prisma.jalsaEdition.findFirst({
      where: { isCurrent: true },
      include: {
        speeches: { take: 5 },
      },
    });

    const liveZones = await prisma.zoneTraffic.findMany({
      take: 6,
      orderBy: { status: 'desc' },
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role.name,
          roleSlug: user.role.slug,
          attendeeCategory: user.attendeeCategory || 'MEMBER',
          travelOrigin: user.travelOrigin || 'Lagos, Nigeria',
          assignedGate: user.assignedGate || 'Gate 2 (West Registration Hub)',
        },
        currentEdition,
        liveZones,
      },
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/users/me/profile — Update attendee profile (travel origin, attendee category)
usersRouter.put('/me/profile', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { travelOrigin, attendeeCategory, assignedGate } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(travelOrigin ? { travelOrigin } : {}),
        ...(attendeeCategory ? { attendeeCategory } : {}),
        ...(assignedGate ? { assignedGate } : {}),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        attendeeCategory: true,
        travelOrigin: true,
        assignedGate: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile preferences updated.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/users
usersRouter.get('/', authenticate, requireRole('super_administrator', 'editor_in_chief'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        status: true,
        roleId: true,
        role: { select: { id: true, name: true, slug: true } },
        createdAt: true,
      },
    });

    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/users/roles
usersRouter.get('/roles', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: { include: { permission: true } },
      },
    });

    res.json({
      success: true,
      data: roles.map((r) => ({
        ...r,
        permissions: r.permissions.map((p) => p.permission),
      })),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/users
usersRouter.post('/', authenticate, requireRole('super_administrator'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, firstName, lastName, roleId } = req.body;

    if (!email || !password || !firstName || !lastName || !roleId) {
      res.status(400).json({ success: false, message: 'All fields are required.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        roleId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roleId: true,
        status: true,
        role: { select: { id: true, name: true, slug: true } },
        createdAt: true,
      },
    });

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/users/:id
usersRouter.put('/:id', authenticate, requireRole('super_administrator'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { firstName, lastName, roleId, status, password } = req.body;

    const data: any = { firstName, lastName, roleId, status };
    if (password && password.length >= 6) {
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        roleId: true,
        role: { select: { id: true, name: true, slug: true } },
        createdAt: true,
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/users/:id
usersRouter.delete('/:id', authenticate, requireRole('super_administrator'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (id === req.user!.id) {
      res.status(400).json({ success: false, message: 'Cannot delete your own administrator account.' });
      return;
    }

    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
});
