import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-key-for-development-only') as any;
    
    // Verify user exists in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized: User no longer exists' });
      return;
    }

    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
