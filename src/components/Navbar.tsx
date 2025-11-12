import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "./Logo";
import { Ticket, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-xl font-bold neon-text">VN TICKET</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/eventos" className="text-foreground hover:text-primary transition-colors">
              Eventos
            </Link>
            <Link to="/login" className="text-foreground hover:text-primary transition-colors">
              Login
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                Minha Conta
              </Button>
            </Link>
            <Link to="/eventos">
              <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 neon-glow">
                <Ticket className="h-4 w-4" />
                Ver Eventos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
