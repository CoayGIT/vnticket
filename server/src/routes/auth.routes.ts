import { Router } from 'express';
import { loginSchema, registerSchema } from '../utils/validation.js';
import { validate } from '../middleware/validator.middleware.js';
import * as authController from '../controllers/auth.controller.js';
import { rateLimit } from 'express-rate-limit';

const router = Router();

// Rate limiting específico para autenticação (mais restritivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas por IP
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);

export default router;
