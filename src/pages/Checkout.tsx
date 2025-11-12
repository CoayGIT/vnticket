import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Lock, ShoppingCart } from "lucide-react";
import { api } from "@/lib/api";

interface Event {
  id: string;
  name: string;
  ticketTypes: Array<{
    id: string;
    name: string;
    price: number;
    available: number;
  }>;
}

const Checkout = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentIntent, setPaymentIntent] = useState<{ id: string; clientSecret: string } | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const ticketTypeId = searchParams.get("ticketType");
  const selectedTicketType = event?.ticketTypes.find(tt => tt.id === ticketTypeId);
  
  // Verificar status do pagamento periodicamente
  useEffect(() => {
    if (orderId && !paymentSuccess && paymentIntent) {
      const interval = setInterval(async () => {
        try {
          const response = await api.checkPaymentStatus(orderId);
          if (response.data?.order?.status === 'paid' || response.data?.order?.status === 'completed') {
            setPaymentSuccess(true);
            toast({
              title: "Pagamento confirmado!",
              description: "Seus ingressos foram gerados com sucesso.",
            });
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          }
        } catch (error) {
          // Ignorar erros de polling
        }
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [orderId, paymentSuccess, paymentIntent, navigate, toast]);

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    if (!id) return;
    
    try {
      setEventLoading(true);
      const response = await api.getEventById(id);
      if (response.data) {
        setEvent(response.data);
      } else {
        toast({
          title: "Erro ao carregar evento",
          description: response.error || "Evento não encontrado",
          variant: "destructive",
        });
        navigate("/eventos");
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar evento",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      navigate("/eventos");
    } finally {
      setEventLoading(false);
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!api.isAuthenticated()) {
      toast({
        title: "Autenticação necessária",
        description: "Por favor, faça login para continuar",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!id || !ticketTypeId || !selectedTicketType) {
      toast({
        title: "Erro",
        description: "Dados do evento não encontrados",
        variant: "destructive",
      });
      return;
    }

    if (selectedTicketType.available < quantity) {
      toast({
        title: "Ingressos insuficientes",
        description: "Não há ingressos suficientes disponíveis",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.createOrder({
        eventId: id,
        ticketTypeId: ticketTypeId,
        quantity: quantity,
        buyerData: {
          name,
          cpf,
          email,
          phone,
        },
      });

      if (response.error) {
        toast({
          title: "Erro ao processar pedido",
          description: response.error,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Se tem Payment Intent, mostrar checkout do Stripe
      if (response.data?.paymentIntent) {
        setPaymentIntent({
          id: response.data.paymentIntent.id,
          clientSecret: response.data.paymentIntent.clientSecret,
        });
        setOrderId(response.data.order.id);
        setLoading(false);
      } else if (response.data?.order) {
        // Se não tem Stripe, ordem foi criada diretamente
        toast({
          title: "Compra realizada com sucesso!",
          description: "Seu ingresso foi gerado e está disponível no seu dashboard.",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Erro ao processar pedido",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    // Aguardar um pouco para o webhook processar
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Erro no pagamento",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
              Finalizar Compra
            </h1>
            <p className="text-muted-foreground">
              Complete seus dados para garantir seu ingresso
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="glass-panel p-6 animate-slide-up border-primary/20">
                <form onSubmit={handlePurchase} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <ShoppingCart className="h-6 w-6 text-primary" />
                      Dados do Comprador
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="glass-panel border-primary/30 focus:border-primary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        required
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="glass-panel border-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="glass-panel border-primary/30 focus:border-primary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="glass-panel border-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>

                  {paymentIntent ? (
                    <div className="pt-4 border-t border-primary/20">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Pagamento com Stripe
                      </h3>
                      <StripeCheckout
                        clientSecret={paymentIntent.clientSecret}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </div>
                  ) : (
                    <>
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full gap-2 neon-glow"
                        disabled={loading}
                      >
                        <Lock className="h-4 w-4" />
                        {loading ? "Processando..." : "Finalizar Compra"}
                      </Button>

                      <p className="text-sm text-center text-muted-foreground">
                        🔒 Pagamento seguro e criptografado
                      </p>
                    </>
                  )}
                </form>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="glass-panel p-6 sticky top-24 animate-slide-up border-primary/20">
                <h3 className="text-xl font-bold mb-4">Resumo do Pedido</h3>
                {eventLoading ? (
                  <p className="text-muted-foreground">Carregando...</p>
                ) : event && selectedTicketType ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Evento</p>
                      <p className="font-semibold">{event.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Ingresso</p>
                      <p className="font-semibold">{selectedTicketType.name}</p>
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantidade</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={Math.min(10, selectedTicketType.available)}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                        className="glass-panel border-primary/30 focus:border-primary"
                      />
                    </div>
                    <div className="pt-4 border-t border-primary/20">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>R$ {(selectedTicketType.price * quantity).toFixed(2).replace(".", ",")}</span>
                      </div>
                      <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                        <span>Taxa de serviço (10%)</span>
                        <span>R$ {((selectedTicketType.price * quantity) * 0.1).toFixed(2).replace(".", ",")}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t border-primary/20">
                        <span>Total</span>
                        <span>R$ {((selectedTicketType.price * quantity) * 1.1).toFixed(2).replace(".", ",")}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Evento não encontrado</p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
