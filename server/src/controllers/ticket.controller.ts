import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/db.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { generateQRCodeImage, validateQRCode } from '../utils/qrcode.js';
import { logger } from '../utils/logger.js';

export const getUserTickets = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    
    const tickets = await prisma.ticket.findMany({
      where: { userId },
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
        order: {
          select: {
            id: true,
            total: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    
    const ticket = await prisma.ticket.findFirst({
      where: {
        id,
        userId,
      },
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
            description: true,
          },
        },
        order: {
          select: {
            id: true,
            total: true,
            createdAt: true,
          },
        },
      },
    });
    
    if (!ticket) {
      res.status(404).json({ error: 'Ingresso não encontrado' });
      return;
    }
    
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

export const getTicketByCode = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code } = req.params;
    const userId = req.user!.userId;
    
    const ticket = await prisma.ticket.findFirst({
      where: {
        code,
        userId,
      },
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
            description: true,
          },
        },
        order: {
          select: {
            id: true,
            total: true,
            createdAt: true,
          },
        },
      },
    });
    
    if (!ticket) {
      res.status(404).json({ error: 'Ingresso não encontrado' });
      return;
    }
    
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

// Obter QR code do ingresso como imagem
export const getTicketQRCode = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    
    const ticket = await prisma.ticket.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!ticket) {
      res.status(404).json({ error: 'Ingresso não encontrado' });
      return;
    }
    
    if (!ticket.qrCode) {
      res.status(400).json({ error: 'QR code não disponível para este ingresso' });
      return;
    }
    
    // Gerar imagem do QR code
    const qrCodeImage = await generateQRCodeImage(ticket.qrCode);
    
    res.json({
      qrCode: qrCodeImage,
      ticketCode: ticket.code,
    });
  } catch (error) {
    next(error);
  }
};

// Validar QR code (para organizadores)
export const validateTicketQRCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      res.status(400).json({ error: 'QR code não fornecido' });
      return;
    }
    
    // Decodificar QR code (formato: ticketId:ticketCode:hash)
    const parts = qrData.split(':');
    
    if (parts.length !== 3) {
      res.status(400).json({ error: 'QR code inválido' });
      return;
    }
    
    const [ticketId, ticketCode] = parts;
    
    // Buscar ingresso
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        code: ticketCode,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
            time: true,
            location: true,
          },
        },
        ticketType: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    if (!ticket) {
      res.status(404).json({ error: 'Ingresso não encontrado' });
      return;
    }
    
    // Validar QR code
    const isValid = validateQRCode(qrData, ticket.id, ticket.code);
    
    if (!isValid) {
      res.status(400).json({ error: 'QR code inválido ou alterado' });
      return;
    }
    
    // Verificar se já foi usado
    if (ticket.status === 'used') {
      res.json({
        valid: true,
        used: true,
        message: 'Ingresso já foi utilizado',
        ticket: {
          id: ticket.id,
          code: ticket.code,
          event: ticket.event,
          ticketType: ticket.ticketType,
          user: ticket.user,
          validatedAt: ticket.validatedAt,
        },
      });
      return;
    }
    
    // Verificar se está cancelado
    if (ticket.status === 'cancelled') {
      res.status(400).json({ error: 'Ingresso cancelado' });
      return;
    }
    
    // Marcar como usado (opcional - pode ser feito manualmente)
    // await prisma.ticket.update({
    //   where: { id: ticket.id },
    //   data: {
    //     status: 'used',
    //     validatedAt: new Date(),
    //     validatedBy: req.user?.userId, // Se tiver autenticação de organizador
    //   },
    // });
    
    res.json({
      valid: true,
      used: false,
      message: 'Ingresso válido',
      ticket: {
        id: ticket.id,
        code: ticket.code,
        event: ticket.event,
        ticketType: ticket.ticketType,
        user: ticket.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Marcar ingresso como usado
export const markTicketAsUsed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ticketId } = req.body;
    const validatorId = (req as any).user?.userId || 'system';
    
    if (!ticketId) {
      res.status(400).json({ error: 'ID do ingresso não fornecido' });
      return;
    }
    
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    
    if (!ticket) {
      res.status(404).json({ error: 'Ingresso não encontrado' });
      return;
    }
    
    if (ticket.status === 'used') {
      res.status(400).json({ error: 'Ingresso já foi utilizado' });
      return;
    }
    
    if (ticket.status === 'cancelled') {
      res.status(400).json({ error: 'Ingresso cancelado' });
      return;
    }
    
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: 'used',
        validatedAt: new Date(),
        validatedBy: validatorId,
      },
    });
    
    logger.info('Ingresso marcado como usado', {
      ticketId: updatedTicket.id,
      code: updatedTicket.code,
      validatedBy: validatorId,
    });
    
    res.json({
      success: true,
      ticket: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};