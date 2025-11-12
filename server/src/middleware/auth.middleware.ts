import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token de autenticação não fornecido' });
      return;
    }
    
    const token = authHeader.substring(7);
    
    try {
      const payload = verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      logger.warn('Token inválido', { ip: req.ip, token: token.substring(0, 20) + '...' });
      res.status(401).json({ error: 'Token inválido ou expirado' });
      return;
    }
  } catch (error) {
    logger.error('Erro na autenticação', { error });
    res.status(500).json({ error: 'Erro interno do servidor' });
    return;
  }
};
