import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

interface StripeCheckoutProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CheckoutForm = ({ clientSecret, onSuccess, onError }: StripeCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/success",
        },
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "Erro ao processar pagamento");
        toast({
          title: "Erro no pagamento",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess();
        toast({
          title: "Pagamento realizado com sucesso!",
          description: "Seus ingressos serão gerados em instantes.",
        });
      }
    } catch (err) {
      onError("Erro inesperado ao processar pagamento");
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full gap-2"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          "Confirmar Pagamento"
        )}
      </Button>
    </form>
  );
};

export const StripeCheckout = ({ clientSecret, onSuccess, onError }: StripeCheckoutProps) => {
  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="p-4 border border-yellow-500 rounded-lg bg-yellow-500/10">
        <p className="text-sm text-yellow-700 dark:text-yellow-400">
          Stripe não configurado. Configure VITE_STRIPE_PUBLISHABLE_KEY no arquivo .env
        </p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
        },
      }}
    >
      <CheckoutForm clientSecret={clientSecret} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};
