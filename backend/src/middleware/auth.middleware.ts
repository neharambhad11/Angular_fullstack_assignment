
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
  };
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: 'Authentication token required'
    });
  }

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AuthRequest['user'];

    next();
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
}
