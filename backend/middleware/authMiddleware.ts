// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwtUtils';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await verifyJWT(token);
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};