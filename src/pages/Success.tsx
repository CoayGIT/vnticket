import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Download, Mail, Ticket } from "lucide-react";
import Logo from "@/components/Logo";

const Success = () => {
  // Mock QR Code - em produção será gerado dinamicamente
  const ticketCode = "FT-VN-2025-ABC123XYZ";

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="bg-green-500/20 p-6 rounded-full neon-glow">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
              Compra Realizada!
            </h1>
            <p className="text-lg text-muted-foreground">
              Seu ingresso digital foi gerado com sucesso
            </p>
          </div>

          <Card className="glass-panel p-8 animate-slide-up border-primary/20">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - Ticket Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Logo size="sm" animated={false} />
                  <span className="text-xl font-bold">FUTURE TECH EXPO 2025</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ATTENDE:</p>
                    <p className="font-semibold">Nome do Participante</p>
                    <p className="text-sm">TIPO: PASSE COMPLETO - 3 DIAS</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">PURCHAS:</p>
                    <p className="text-sm">PEDIDO: #FT-2025-45678 | DATA: 06/11/2025</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">EVENT:</p>
                    <p className="text-sm">DATA: 15-17 DEZEMBRO 2025 | HORÁRIO 09:00-18:00</p>
                    <p className="text-sm">LOCAL: Centro de Convenções, Brasília - DF</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">ACCESS:</p>
                    <p className="text-sm">ACESSO: Todas as palestras, workshops e área VIP</p>
                  </div>

                  <p className="text-xs text-muted-foreground pt-4 border-t border-primary/20">
                    Apresente este ingresso impresso ou formato digital na entrada do evento
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Powered by VN TICKET</span>
                    <span>•</span>
                    <span>www.vnticket.com</span>
                  </div>
                </div>
              </div>

              {/* Right Side - QR Code */}
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-card to-background p-6 rounded-lg border border-primary/20">
                <div className="bg-white p-6 rounded-lg mb-4">
                  <div className="w-48 h-48 bg-black flex items-center justify-center">
                    <Ticket className="h-24 w-24 text-primary" />
                  </div>
                </div>
                <p className="text-xl font-bold text-green-500 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  INGRESSO VÁLIDO
                </p>
                <p className="text-sm font-mono mb-4">{ticketCode}</p>
                <p className="text-xs text-center text-muted-foreground">
                  This ticket grants access... Non-transferable. © event terms... No refunds...
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-primary/20">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2 neon-glow">
                  <Download className="h-4 w-4" />
                  Baixar Ingresso PDF
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-primary/50">
                  <Mail className="h-4 w-4" />
                  Reenviar por E-mail
                </Button>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="gap-2 w-full border-primary/50">
                    Ver Meus Ingressos
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-sm text-center">
                📧 Uma cópia do seu ingresso também foi enviada para seu e-mail
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Success;
