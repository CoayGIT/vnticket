import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validator.middleware.js';
import { createOrderSchema } from '../utils/validation.js';

const router = Router();

router.post('/', authenticate, validate(createOrderSchema), orderController.createOrder);
router.get('/', authenticate, orderController.getUserOrders);
router.get('/:id', authenticate, orderController.getOrderById);

export default router;
