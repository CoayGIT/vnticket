import { useState } from "react";
import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { QrCode, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const ValidateTicket = () => {
  const { toast } = useToast();
  const [qrData, setQrData] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!qrData.trim()) {
      toast({
        title: "QR Code necessário",
        description: "Por favor, insira ou escaneie o QR code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setValidationResult(null);

    try {
      const response = await api.validateTicketQRCode(qrData);
      
      if (response.error) {
        setValidationResult({
          valid: false,
          error: response.error,
        });
        toast({
          title: "QR Code inválido",
          description: response.error,
          variant: "destructive",
        });
      } else if (response.data) {
        setValidationResult(response.data);
        if (response.data.valid && !response.data.used) {
          toast({
            title: "Ingresso válido!",
            description: "Ingresso confirmado e pronto para uso",
          });
        } else if (response.data.used) {
          toast({
            title: "Ingresso já utilizado",
            description: "Este ingresso já foi validado anteriormente",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro ao validar",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsUsed = async () => {
    if (!validationResult?.ticket?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/tickets/mark-used`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId: validationResult.ticket.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Erro ao marcar ingresso",
          description: data.error || "Erro desconhecido",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Ingresso marcado como usado",
          description: "Ingresso validado com sucesso",
        });
        setValidationResult({
          ...validationResult,
          used: true,
        });
      }
    } catch (error) {
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
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
              Validar Ingresso
            </h1>
            <p className="text-muted-foreground">
              Escaneie ou digite o QR code do ingresso para validar
            </p>
          </div>

          <Card className="glass-panel p-6 animate-slide-up border-primary/20">
            <form onSubmit={handleValidate} className="space-y-6">
              <div>
                <Label htmlFor="qrcode" className="flex items-center gap-2 mb-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  QR Code do Ingresso
                </Label>
                <Input
                  id="qrcode"
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  placeholder="Cole ou digite o QR code aqui"
                  className="glass-panel border-primary/30 focus:border-primary font-mono"
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Escaneie o QR code do ingresso ou cole o código manualmente
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 neon-glow"
                disabled={loading}
              >
                {loading ? "Validando..." : "Validar Ingresso"}
              </Button>
            </form>

            {validationResult && (
              <div className="mt-6 pt-6 border-t border-primary/20">
                {validationResult.valid ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="h-6 w-6" />
                      <span className="text-lg font-bold">Ingresso Válido</span>
                    </div>
                    
                    {validationResult.used ? (
                      <div className="flex items-center gap-2 text-yellow-500">
                        <AlertCircle className="h-5 w-5" />
                        <span>Este ingresso já foi utilizado</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle className="h-5 w-5" />
                        <span>Ingresso disponível para uso</span>
                      </div>
                    )}

                    {validationResult.ticket && (
                      <div className="mt-4 p-4 bg-card/50 rounded-lg space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Evento</p>
                          <p className="font-semibold">{validationResult.ticket.event.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Data</p>
                          <p className="font-semibold">
                            {validationResult.ticket.event.date} | {validationResult.ticket.event.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Local</p>
                          <p className="font-semibold">{validationResult.ticket.event.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tipo de Ingresso</p>
                          <p className="font-semibold">{validationResult.ticket.ticketType.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Comprador</p>
                          <p className="font-semibold">{validationResult.ticket.user.name}</p>
                          <p className="text-sm text-muted-foreground">{validationResult.ticket.user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Código</p>
                          <p className="font-mono text-primary">{validationResult.ticket.code}</p>
                        </div>

                        {!validationResult.used && (
                          <Button
                            onClick={handleMarkAsUsed}
                            disabled={loading}
                            className="w-full mt-4 gap-2"
                            size="lg"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Marcar como Usado
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-500">
                    <XCircle className="h-6 w-6" />
                    <span className="text-lg font-bold">Ingresso Inválido</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ValidateTicket;
