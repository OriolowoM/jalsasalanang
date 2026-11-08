import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../lib/prisma';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  roleName: string;
  roleSlug: string;
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let token = req.cookies?.jalsa_auth_token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      res.status(401).json({ success: false, message: 'User not found or account inactive.' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      roleName: user.role.name,
      roleSlug: user.role.slug,
      permissions: user.role.permissions.map((rp) => rp.permission.slug),
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    // Super Administrator has universal access
    if (req.user.roleSlug === 'super_administrator') {
      next();
      return;
    }

    if (!allowedRoles.includes(req.user.roleSlug)) {
      res.status(403).json({ success: false, message: 'Permission denied: Insufficient role permissions.' });
      return;
    }

    next();
  };
}

export function requirePermission(permissionSlug: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    // Super Administrator has universal access
    if (req.user.roleSlug === 'super_administrator') {
      next();
      return;
    }

    if (!req.user.permissions.includes(permissionSlug)) {
      res.status(403).json({ success: false, message: `Permission denied: Missing '${permissionSlug}' permission.` });
      return;
    }

    next();
  };
}
