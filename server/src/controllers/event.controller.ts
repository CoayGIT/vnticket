import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/db.js';
import { logger } from '../utils/logger.js';
import { createEventSchema } from '../utils/validation.js';

export const getEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, category } = req.query;
    
    const where: any = {};
    
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      where.OR = [
        { name: { contains: searchTerm } },
        { location: { contains: searchTerm } },
      ];
    }
    
    if (category) {
      where.category = category as string;
    }
    
    const events = await prisma.event.findMany({
      where,
      include: {
        ticketTypes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.json(events);
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        ticketTypes: true,
      },
    });
    
    if (!event) {
      res.status(404).json({ error: 'Evento não encontrado' });
      return;
    }
    
    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createEventSchema.parse(req.body);
    
    const event = await prisma.event.create({
      data: {
        name: data.name,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        image: data.image,
        category: data.category,
        ticketTypes: {
          create: data.ticketTypes,
        },
      },
      include: {
        ticketTypes: true,
      },
    });
    
    logger.info('Evento criado', { eventId: event.id, name: event.name });
    
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const event = await prisma.event.update({
      where: { id },
      data,
      include: {
        ticketTypes: true,
      },
    });
    
    logger.info('Evento atualizado', { eventId: event.id });
    
    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    await prisma.event.delete({
      where: { id },
    });
    
    logger.info('Evento deletado', { eventId: id });
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
