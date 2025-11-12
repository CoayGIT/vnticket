import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Calendar, MapPin, Ticket } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  ticketTypes: Array<{
    id: string;
    name: string;
    price: number;
    available: number;
  }>;
}

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await api.getEvents();
      if (response.data) {
        setEvents(response.data);
      } else if (response.error) {
        toast({
          title: "Erro ao carregar eventos",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar eventos",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMinPrice = (event: Event) => {
    if (event.ticketTypes.length === 0) return "R$ 0,00";
    const minPrice = Math.min(...event.ticketTypes.map((tt) => tt.price));
    return `R$ ${minPrice.toFixed(2).replace(".", ",")}`;
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 neon-text">
              Eventos Disponíveis
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore os melhores eventos e garanta seu ingresso digital
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar eventos por nome ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg glass-panel border-primary/30 focus:border-primary"
              />
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">Carregando eventos...</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => (
                  <Card
                    key={event.id}
                    className="glass-panel overflow-hidden group hover:scale-105 transition-all duration-300 animate-slide-up border-primary/20"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-primary/20 backdrop-blur-sm rounded-full text-sm border border-primary/50">
                          {event.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {event.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{event.date} | {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{getMinPrice(event)}</span>
                        <Link to={`/evento/${event.id}`}>
                          <Button className="gap-2 neon-glow">
                            <Ticket className="h-4 w-4" />
                            Ver Detalhes
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-xl text-muted-foreground">
                    Nenhum evento encontrado. Tente outro termo de busca.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
