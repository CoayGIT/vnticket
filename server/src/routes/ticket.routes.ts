import { Router } from 'express';
import * as ticketController from '../controllers/ticket.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, ticketController.getUserTickets);
router.get('/:id', authenticate, ticketController.getTicketById);
router.get('/:id/qrcode', authenticate, ticketController.getTicketQRCode);
router.get('/code/:code', authenticate, ticketController.getTicketByCode);
router.post('/validate', ticketController.validateTicketQRCode);
router.post('/mark-used', ticketController.markTicketAsUsed);

export default router;
