import { Router } from 'express';
import * as eventController from '../controllers/event.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validator.middleware.js';
import { createEventSchema } from '../utils/validation.js';

const router = Router();

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authenticate, validate(createEventSchema), eventController.createEvent);
router.put('/:id', authenticate, eventController.updateEvent);
router.delete('/:id', authenticate, eventController.deleteEvent);

export default router;
