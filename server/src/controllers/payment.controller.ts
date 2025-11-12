import { Request, Response, NextFunction } from 'express';
import { stripe, getStripeWebhookSecret } from '../utils/stripe.js';
import prisma from '../utils/db.js';
import { logger } from '../utils/logger.js';
import { generateQRCodeString } from '../utils/qrcode.js';
import { generateTicketCode } from '../utils/order.helper.js';
import Stripe from 'stripe';

// Webhook do Stripe para processar pagamentos
export const stripeWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = getStripeWebhookSecret();

  if (!stripe || !sig || !webhookSecret) {
    res.status(400).send('Webhook signature ou secret não configurado');
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    logger.error('Erro ao verificar webhook do Stripe', { error: err });
    res.status(400).send(`Webhook Error: ${err}`);
    return;
  }

  try {
    // Processar evento
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        logger.info('Evento do Stripe não processado', { type: event.type });
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Erro ao processar webhook do Stripe', { error });
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
};

// Processar pagamento bem-sucedido
const handlePaymentIntentSucceeded = async (paymentIntent: Stripe.PaymentIntent): Promise<void> => {
  const paymentIntentId = paymentIntent.id;
  const metadata = paymentIntent.metadata;

  logger.info('Payment Intent bem-sucedido', { paymentIntentId, metadata });

  // Buscar ordem pelo Payment Intent ID
  const order = await prisma.order.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
    include: {
      user: true,
    },
  });

  if (!order) {
    logger.error('Ordem não encontrada para Payment Intent', { paymentIntentId });
    return;
  }

  if (order.status === 'paid' || order.status === 'completed') {
    logger.info('Ordem já processada', { orderId: order.id });
    return;
  }

  // Atualizar ordem e criar ingressos
  const result = await prisma.$transaction(async (tx) => {
    // Atualizar status da ordem
    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: 'paid',
        paymentId: paymentIntentId,
      },
    });

    // Buscar dados do evento e tipo de ingresso
    const eventId = metadata.eventId;
    const ticketTypeId = metadata.ticketTypeId;
    const quantity = parseInt(metadata.quantity || '1');

    if (!eventId || !ticketTypeId) {
      throw new Error('Dados do evento não encontrados no metadata');
    }

    // Atualizar disponibilidade
    await tx.ticketType.update({
      where: { id: ticketTypeId },
      data: {
        available: {
          decrement: quantity,
        },
      },
    });

    // Criar ingressos com QR codes
    const tickets = await Promise.all(
      Array.from({ length: quantity }).map(async () => {
        const ticketCode = generateTicketCode();
        const ticket = await tx.ticket.create({
          data: {
            orderId: order.id,
            userId: order.userId,
            ticketTypeId: ticketTypeId,
            eventId: eventId,
            code: ticketCode,
            qrCode: '', // Será atualizado
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

    return { order: updatedOrder, tickets };
  });

  logger.info('Ingressos criados após pagamento', {
    orderId: result.order.id,
    ticketsCount: result.tickets.length,
  });
};

// Processar pagamento falhado
const handlePaymentIntentFailed = async (paymentIntent: Stripe.PaymentIntent): Promise<void> => {
  const paymentIntentId = paymentIntent.id;

  logger.warn('Payment Intent falhou', { paymentIntentId });

  // Atualizar status da ordem para cancelled
  await prisma.order.updateMany({
    where: { stripePaymentIntentId: paymentIntentId },
    data: {
      status: 'cancelled',
    },
  });
};

// Verificar status do pagamento
export const checkPaymentStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderId } = req.params;
    const userId = (req as any).user?.userId;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        ...(userId && { userId }),
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

    res.json({
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
      },
      tickets: order.tickets,
    });
  } catch (error) {
    next(error);
  }
};
