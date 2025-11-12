import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

if (!stripeSecretKey) {
  console.warn('⚠️  STRIPE_SECRET_KEY não configurado. Pagamentos não funcionarão.');
}

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

export const getStripeWebhookSecret = () => stripeWebhookSecret;

// Converter valor em centavos (Stripe usa centavos)
export const convertToCents = (value: number): number => {
  return Math.round(value * 100);
};

// Converter valor de centavos para reais
export const convertFromCents = (value: number): number => {
  return value / 100;
};

// Criar Payment Intent
export const createPaymentIntent = async (
  amount: number,
  currency: string = 'brl',
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> => {
  if (!stripe) {
    throw new Error('Stripe não está configurado');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: convertToCents(amount),
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
};

// Verificar status do Payment Intent
export const getPaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  if (!stripe) {
    throw new Error('Stripe não está configurado');
  }

  return await stripe.paymentIntents.retrieve(paymentIntentId);
};
