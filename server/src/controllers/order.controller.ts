import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/db.js';
import { logger } from '../utils/logger.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { createOrderSchema } from '../utils/validation.js';
import { createPaymentIntent, stripe } from '../utils/stripe.js';
import { generateQRCodeString } from '../utils/qrcode.js';
import { generateTicketCode } from '../utils/order.helper.js';

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createOrderSchema.parse(req.body);
    const userId = req.user!.userId;
    
    // Buscar evento e tipo de ingresso
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
      include: {
        ticketTypes: {
          where: { id: data.ticketTypeId },
        },
      },
    });
    
    if (!event) {
      res.status(404).json({ error: 'Evento não encontrado' });
      return;
    }
    
    const ticketType = event.ticketTypes[0];
    
    if (!ticketType) {
      res.status(404).json({ error: 'Tipo de ingresso não encontrado' });
      return;
    }
    
    // Verificar disponibilidade
    if (ticketType.available < data.quantity) {
      res.status(400).json({ error: 'Ingressos insuficientes disponíveis' });
      return;
    }
    
    // Calcular total (preço + taxa de serviço de 10%)
    const subtotal = ticketType.price * data.quantity;
    const serviceFee = subtotal * 0.1;
    const total = subtotal + serviceFee;
    
    // Criar Payment Intent no Stripe
    let paymentIntent;
    let paymentIntentId: string | null = null;
    
    if (stripe) {
      try {
        paymentIntent = await createPaymentIntent(total, 'brl', {
          userId,
          eventId: data.eventId,
          ticketTypeId: data.ticketTypeId,
          quantity: data.quantity.toString(),
        });
        paymentIntentId = paymentIntent.id;
      } catch (error) {
        logger.error('Erro ao criar Payment Intent', { error });
        res.status(500).json({ error: 'Erro ao processar pagamento' });
        return;
      }
    }
    
    // Criar ordem com status pending (será atualizado pelo webhook)
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: stripe ? 'pending' : 'completed', // Se não tem Stripe, completa direto
        stripePaymentIntentId: paymentIntentId,
      },
    });
    
    // Se não tem Stripe, criar ingressos imediatamente
    if (!stripe) {
      const result = await prisma.$transaction(async (tx) => {
        // Atualizar disponibilidade
        await tx.ticketType.update({
          where: { id: data.ticketTypeId },
          data: {
            available: {
              decrement: data.quantity,
            },
          },
        });
        
        // Criar ingressos com QR codes
        const tickets = await Promise.all(
          Array.from({ length: data.quantity }).map(async () => {
            const ticketCode = generateTicketCode();
            const ticket = await tx.ticket.create({
              data: {
                orderId: order.id,
                userId,
                ticketTypeId: data.ticketTypeId,
                eventId: data.eventId,
                code: ticketCode,
                qrCode: '', // Será atualizado após criação
                status: 'valid',
              },
            });
            
            // Gerar QR code único
            const qrCodeString = generateQRCodeString(ticketCode, ticket.id);
            
            // Atualizar ticket com QR code
            return await tx.ticket.update({
              where: { id: ticket.id },
              data: { qrCode: qrCodeString },
            });
          })
        );
        
        return { order, tickets };
      });
      
      logger.info('Ordem criada (sem Stripe)', {
        orderId: result.order.id,
        userId,
        eventId: data.eventId,
        quantity: data.quantity,
      });
      
      // Retornar ordem com ingressos
      const orderWithTickets = await prisma.order.findUnique({
        where: { id: result.order.id },
        include: {
          tickets: {
            include: {
              ticketType: true,
            },
          },
        },
      });
      
      res.status(201).json(orderWithTickets);
      return;
    }
    
    // Se tem Stripe, retornar Payment Intent para o frontend processar
    logger.info('Payment Intent criado', {
      orderId: order.id,
      paymentIntentId,
      userId,
      eventId: data.eventId,
      quantity: data.quantity,
    });
    
    res.status(201).json({
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
      },
      paymentIntent: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        tickets: {
          include: {
            ticketType: true,
            event: {
              select: {
                id: true,
                name: true,
                date: true,
                time: true,
                location: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    
    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
            event: {
              select: {
                id: true,
                name: true,
                date: true,
                time: true,
                location: true,
                image: true,
              },
            },
          },
        },
      },
    });
    
    if (!order) {
      res.status(404).json({ error: 'Ordem não encontrada' });
      return;
    }
    
    res.json(order);
  } catch (error) {
    next(error);
  }
};
