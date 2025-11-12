import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Users, Ticket, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
  category: string;
  ticketTypes: Array<{
    id: string;
    name: string;
    price: number;
    available: number;
  }>;
}

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await api.getEventById(id);
      if (response.data) {
        setEvent(response.data);
      } else if (response.error) {
        toast({
          title: "Erro ao carregar evento",
          description: response.error,
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
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <ParticleBackground />
        <Navbar />
        <div className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <p className="text-xl text-muted-foreground">Carregando evento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden mb-8 animate-fade-in">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="animate-slide-up">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
                  {event.name}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>

              <Card className="glass-panel p-6 animate-slide-up border-primary/20">
                <h2 className="text-2xl font-bold mb-4">Informações do Evento</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Data</p>
                      <p className="text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Horário</p>
                      <p className="text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Local</p>
                      <p className="text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar - Ticket Categories */}
            <div className="lg:col-span-1">
              <Card className="glass-panel p-6 sticky top-24 animate-slide-up border-primary/20">
                <h2 className="text-2xl font-bold mb-6">Ingressos Disponíveis</h2>
                <div className="space-y-4">
                  {event.ticketTypes.map((ticketType) => (
                    <div
                      key={ticketType.id}
                      className="p-4 rounded-lg bg-card/50 border border-primary/20 hover:border-primary/50 transition-colors"
                    >
                      <h3 className="font-bold mb-2">{ticketType.name}</h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-primary">
                          R$ {ticketType.price.toFixed(2).replace(".", ",")}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{ticketType.available} disponíveis</span>
                        </div>
                      </div>
                      <Link to={`/checkout/${event.id}?ticketType=${ticketType.id}`}>
                        <Button 
                          className="w-full gap-2 neon-glow" 
                          disabled={ticketType.available === 0}
                        >
                          <Ticket className="h-4 w-4" />
                          {ticketType.available === 0 ? "Esgotado" : "Comprar Ingresso"}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <p className="text-sm text-center">
                    🔒 Pagamento seguro e ingresso digital enviado por e-mail
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
