import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/db.js';
import { logger } from '../utils/logger.js';
import { createEventSchema } from '../utils/validation.js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://exzyywcdclgzafbqsfkg.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4enl5d2NkY2xnemFmYnFzZmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzk5OTcsImV4cCI6MjA3ODM5OTk5N30.nvJ_9ltSuuQTBRxJ7W_McxJSv20uEL_St92CX0uPBFs';

async function getEventsFromSupabase(search?: string, category?: string) {
  let url = `${SUPABASE_URL}/rest/v1/Event?select=*,TicketType(*)&order=createdAt.desc`;
  
  if (search) {
    url += `&name=ilike.%25${encodeURIComponent(search)}%25`;
  }
  
  if (category) {
    url += `&category=eq.${encodeURIComponent(category)}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase API error: ${response.status}`);
  }

  const events = await response.json();
  
  // Filtrar por localização se houver busca
  if (search) {
    const searchLower = search.toLowerCase();
    return events.filter((event: any) => 
      event.name?.toLowerCase().includes(searchLower) ||
      event.location?.toLowerCase().includes(searchLower)
    );
  }
  
  return events;
}

export const getEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, category } = req.query;
    
    // Tentar usar Prisma primeiro
    try {
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
      return;
    } catch (prismaError: any) {
      // Se Prisma falhar, usar Supabase API como fallback
      logger.warn('Prisma connection failed, using Supabase API fallback', { error: prismaError.message });
      
      const events = await getEventsFromSupabase(
        search as string | undefined,
        category as string | undefined
      );
      
      res.json(events);
    }
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Tentar usar Prisma primeiro
    try {
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
      return;
    } catch (prismaError: any) {
      // Se Prisma falhar, usar Supabase API como fallback
      logger.warn('Prisma connection failed, using Supabase API fallback', { error: prismaError.message });
      
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/Event?id=eq.${id}&select=*,TicketType(*)`,
        {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        res.status(404).json({ error: 'Evento não encontrado' });
        return;
      }

      const events = await response.json();
      
      if (!events || events.length === 0) {
        res.status(404).json({ error: 'Evento não encontrado' });
        return;
      }
      
      res.json(events[0]);
    }
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
