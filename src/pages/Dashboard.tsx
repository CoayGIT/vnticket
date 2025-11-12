import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Ticket, User, History, Download, QrCode } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TicketData {
  id: string;
  code: string;
  status: string;
  event: {
    id: string;
    name: string;
    date: string;
    time: string;
    location: string;
  };
  ticketType: {
    name: string;
    price: number;
  };
  order: {
    id: string;
    total: number;
    createdAt: string;
  };
}

interface OrderData {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  tickets: TicketData[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!api.isAuthenticated()) {
      navigate("/login");
      return;
    }
    loadTickets();
    loadOrders();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await api.getUserTickets();
      if (response.data) {
        setTickets(response.data);
      } else if (response.error) {
        toast({
          title: "Erro ao carregar ingressos",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar ingressos",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await api.getUserOrders();
      if (response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      // Silently fail for orders
    } finally {
      setOrdersLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2 neon-text">Minha Conta</h1>
            <p className="text-muted-foreground">Gerencie seus ingressos e perfil</p>
          </div>

          <Tabs defaultValue="tickets" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="tickets" className="gap-2">
                <Ticket className="h-4 w-4" />
                Meus Ingressos
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                Histórico
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Perfil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tickets">
              {loading ? (
                <Card className="glass-panel p-6 animate-slide-up border-primary/20">
                  <p className="text-center text-muted-foreground">Carregando ingressos...</p>
                </Card>
              ) : tickets.length === 0 ? (
                <Card className="glass-panel p-6 animate-slide-up border-primary/20">
                  <p className="text-center text-muted-foreground py-8">
                    Você ainda não possui ingressos. Explore nossos eventos!
                  </p>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {tickets.map((ticket) => (
                    <Card key={ticket.id} className="glass-panel p-6 animate-slide-up border-primary/20">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{ticket.event.name}</h3>
                          <p className="text-muted-foreground mb-1">{ticket.event.date} | {ticket.event.time}</p>
                          <p className="text-sm text-muted-foreground mb-1">{ticket.event.location}</p>
                          <p className="text-sm font-mono text-primary mt-2">{ticket.code}</p>
                          <p className="text-sm text-muted-foreground mt-1">{ticket.ticketType.name}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={`px-4 py-2 rounded-lg text-sm font-semibold text-center ${
                            ticket.status === 'valid' 
                              ? 'bg-green-500/20 text-green-500' 
                              : ticket.status === 'used'
                              ? 'bg-gray-500/20 text-gray-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {ticket.status === 'valid' ? 'Válido' : ticket.status === 'used' ? 'Usado' : 'Cancelado'}
                          </span>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="gap-2 border-primary/50"
                                >
                                  <QrCode className="h-4 w-4" />
                                  QR Code
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>QR Code do Ingresso</DialogTitle>
                                  <DialogDescription>
                                    Apresente este QR code na entrada do evento
                                  </DialogDescription>
                                </DialogHeader>
                                <TicketQRCodeDisplay ticketId={ticket.id} />
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2 border-primary/50"
                              onClick={() => {
                                // Criar um blob com os dados do ingresso para download
                                const ticketData = `
INGRESSO - ${ticket.event.name}
Código: ${ticket.code}
Evento: ${ticket.event.name}
Data: ${ticket.event.date}
Horário: ${ticket.event.time}
Local: ${ticket.event.location}
Tipo: ${ticket.ticketType.name}
Status: ${ticket.status === 'valid' ? 'Válido' : ticket.status === 'used' ? 'Usado' : 'Cancelado'}
                                `.trim();
                                const blob = new Blob([ticketData], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `ingresso-${ticket.code}.txt`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                            >
                              <Download className="h-4 w-4" />
                              Baixar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {ordersLoading ? (
                <Card className="glass-panel p-6 animate-slide-up border-primary/20">
                  <p className="text-center text-muted-foreground">Carregando histórico...</p>
                </Card>
              ) : orders.length === 0 ? (
                <Card className="glass-panel p-6 animate-slide-up border-primary/20">
                  <p className="text-center text-muted-foreground py-8">
                    Seu histórico de compras aparecerá aqui
                  </p>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {orders.map((order) => (
                    <Card key={order.id} className="glass-panel p-6 animate-slide-up border-primary/20">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Pedido #{order.id.slice(0, 8)}</p>
                          <p className="text-lg font-bold">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-xl font-bold text-primary">R$ {order.total.toFixed(2).replace(".", ",")}</p>
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === 'completed' 
                              ? 'bg-green-500/20 text-green-500' 
                              : order.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {order.status === 'completed' ? 'Concluído' : order.status === 'pending' ? 'Pendente' : 'Cancelado'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.tickets.map((ticket) => (
                          <div key={ticket.id} className="flex justify-between text-sm">
                            <span>{ticket.event.name} - {ticket.ticketType.name}</span>
                            <span className="font-mono text-primary">{ticket.code}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="profile">
              <Card className="glass-panel p-6 animate-slide-up border-primary/20">
                <h2 className="text-2xl font-bold mb-6">Dados do Perfil</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Funcionalidade de edição de perfil em breve.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      api.logout();
                      navigate("/login");
                      toast({ title: "Logout realizado com sucesso" });
                    }}
                  >
                    Sair
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const TicketQRCodeDisplay = ({ ticketId }: { ticketId: string }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadQRCode = async () => {
      try {
        setLoading(true);
        const response = await api.getTicketQRCode(ticketId);
        if (response.data) {
          setQrCode(response.data.qrCode);
        } else {
          toast({
            title: "Erro ao carregar QR code",
            description: response.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Erro ao carregar QR code",
          description: "Ocorreu um erro inesperado",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadQRCode();
  }, [ticketId]);

  if (loading) {
    return <div className="p-8 text-center">Carregando QR code...</div>;
  }

  if (!qrCode) {
    return <div className="p-8 text-center text-muted-foreground">QR code não disponível</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <img src={qrCode} alt="QR Code" className="w-64 h-64 border-2 border-primary/20 rounded-lg" />
      <p className="text-sm text-muted-foreground text-center">
        Escaneie este QR code na entrada do evento
      </p>
    </div>
  );
};

export default Dashboard;
