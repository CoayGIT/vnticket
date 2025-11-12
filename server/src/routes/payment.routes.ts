import { Router } from 'express';
import express from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Webhook do Stripe (não usa autenticação, usa assinatura)
// Precisa do body raw para verificar assinatura do Stripe
router.post('/webhook', 
  express.raw({ type: 'application/json' }),
  paymentController.stripeWebhook
);

// Verificar status do pagamento (requer autenticação)
router.get('/status/:orderId', authenticate, paymentController.checkPaymentStatus);

export default router;