import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import { ArrowRight, Shield, Zap, Ticket, Instagram, MessageCircle } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4">
        <div className="container mx-auto text-center max-w-5xl">
          <div className="flex justify-center mb-6">
            <Logo size="lg" animated />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-5 animate-fade-in leading-tight">
            Experiências inesquecíveis<br />
            <span className="text-primary">começam aqui</span>
          </h1>
          
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up">
            Garanta seu lugar nos melhores eventos com praticidade e segurança
          </p>

          <Link to="/eventos">
            <Button size="default" className="gap-2 hover:scale-105 transition-transform">
              Explorar Eventos
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
            Por que escolher a <span className="text-primary">VN TICKET</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl hover:bg-card/30 transition-all">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Rápido</h3>
              <p className="text-sm text-muted-foreground">
                Compre e receba seu ingresso na hora
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-card/30 transition-all">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Seguro</h3>
              <p className="text-sm text-muted-foreground">
                QR Code único e criptografado
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-card/30 transition-all">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Prático</h3>
              <p className="text-sm text-muted-foreground">
                Tudo no seu celular, sem fila
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Inovação em <span className="text-primary">Ingressos Digitais</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            A VN TICKET é uma plataforma moderna de venda de ingressos digitais, 
            desenvolvida para proporcionar a melhor experiência aos amantes de eventos. 
            Nossa missão é conectar você aos melhores momentos com segurança, 
            praticidade e tecnologia de ponta.
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="font-semibold text-lg">Victor Nascimento</p>
              <p className="text-sm text-primary">CEO & Fundador</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-primary/20">
        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-6 mb-8">
            <Logo size="sm" animated={false} />
            
            <div className="flex items-center gap-6">
              <a 
                href="https://wa.me/5574988297697" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">(74) 98829-7697</span>
              </a>
              
              <a 
                href="https://instagram.com/vn.ticket" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="text-sm">@vn.ticket</span>
              </a>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-border/50">
            <span className="text-xs text-muted-foreground text-center">
              © 2025 VN TICKET — Tecnologia e Inovação em Ingressos Digitais
            </span>
            
            <div className="flex gap-4 text-xs">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5574988297697"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>
    </div>
  );
};

export default Home;
