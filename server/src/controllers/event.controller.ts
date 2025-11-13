import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/db.js';
import { logger } from '../utils/logger.js';
import { createEventSchema } from '../utils/validation.js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://exzyywcdclgzafbqsfkg.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4enl5d2NkY2xnemFmYnFzZmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzk5OTcsImV4cCI6MjA3ODM5OTk5N30.nvJ_9ltSuuQTBRxJ7W_McxJSv20uEL_St92CX0uPBFs';

async function getEventsFromSupabase(search?: string, category?: string) {
  // Tentar diferentes formatos de nome de tabela
  const tableNames = ['"Event"', 'Event', 'event'];
  let lastError: any = null;
  
  for (const tableName of tableNames) {
    try {
      let url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*,TicketType(*)&order=createdAt.desc`;
      
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
          'Prefer': 'return=representation',
        },
      });

      if (!response.ok) {
        lastError = new Error(`Supabase API error: ${response.status}`);
        continue; // Tentar próximo nome de tabela
      }

      const events = await response.json();
      
      // Transformar a resposta do Supabase para o formato esperado
      const transformedEvents = (Array.isArray(events) ? events : [events]).map((event: any) => {
        // Se TicketType vier como array, usar diretamente
        // Se vier como objeto único, transformar em array
        let ticketTypes = [];
        if (event.TicketType) {
          ticketTypes = Array.isArray(event.TicketType) ? event.TicketType : [event.TicketType];
        }
        
        return {
          id: event.id,
          name: event.name,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
          image: event.image,
          category: event.category,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
          ticketTypes: ticketTypes.map((tt: any) => ({
            id: tt.id,
            name: tt.name,
            price: parseFloat(tt.price) || 0,
            available: parseInt(tt.available) || 0,
          })),
        };
      });
      
      // Filtrar por localização se houver busca
      if (search) {
        const searchLower = search.toLowerCase();
        return transformedEvents.filter((event: any) => 
          event.name?.toLowerCase().includes(searchLower) ||
          event.location?.toLowerCase().includes(searchLower)
        );
      }
      
      return transformedEvents;
    } catch (error: any) {
      lastError = error;
      continue; // Tentar próximo nome de tabela
    }
  }
  
  // Se nenhum nome de tabela funcionou, lançar erro
  logger.error('Error fetching events from Supabase - all table names failed', { error: lastError?.message });
  throw lastError || new Error('Não foi possível conectar ao Supabase');
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
      
      try {
        const events = await getEventsFromSupabase(
          search as string | undefined,
          category as string | undefined
        );
        
        res.json(events);
      } catch (supabaseError: any) {
        logger.error('Supabase API fallback also failed', { error: supabaseError.message });
        res.status(500).json({ 
          error: 'Erro ao carregar eventos',
          details: supabaseError.message 
        });
      }
    }
  } catch (error: any) {
    logger.error('Unexpected error in getEvents', { error: error.message });
    res.status(500).json({ 
      error: 'Erro ao carregar eventos',
      details: error.message 
    });
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
      
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/"Event"?id=eq.${id}&select=*,TicketType(*)`,
          {
            method: 'GET',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation',
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          logger.error('Supabase API error in getEventById', { status: response.status, error: errorText });
          res.status(404).json({ error: 'Evento não encontrado' });
          return;
        }

        const events = await response.json();
        
        if (!events || events.length === 0) {
          res.status(404).json({ error: 'Evento não encontrado' });
          return;
        }
        
        const event = events[0];
        
        // Transformar TicketType para o formato esperado
        let ticketTypes = [];
        if (event.TicketType) {
          ticketTypes = Array.isArray(event.TicketType) ? event.TicketType : [event.TicketType];
        }
        
        const transformedEvent = {
          id: event.id,
          name: event.name,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
          image: event.image,
          category: event.category,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
          ticketTypes: ticketTypes.map((tt: any) => ({
            id: tt.id,
            name: tt.name,
            price: parseFloat(tt.price) || 0,
            available: parseInt(tt.available) || 0,
          })),
        };
        
        res.json(transformedEvent);
      } catch (supabaseError: any) {
        logger.error('Supabase API fallback also failed in getEventById', { error: supabaseError.message });
        res.status(500).json({ 
          error: 'Erro ao carregar evento',
          details: supabaseError.message 
        });
      }
    }
  } catch (error: any) {
    logger.error('Unexpected error in getEventById', { error: error.message });
    res.status(500).json({ 
      error: 'Erro ao carregar evento',
      details: error.message 
    });
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
