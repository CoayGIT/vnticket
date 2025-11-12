import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ParticleBackground from "@/components/ParticleBackground";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { LogIn, UserPlus } from "lucide-react";
import { api } from "@/lib/api";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupCPF, setSignupCPF] = useState("");
  const [signupPhone, setSignupPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.login(loginEmail, loginPassword);
      
      if (response.error) {
        toast({
          title: "Erro ao fazer login",
          description: response.error,
          variant: "destructive",
        });
      } else {
    toast({ title: "Login realizado com sucesso!" });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
    setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.register({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        cpf: signupCPF || undefined,
        phone: signupPhone || undefined,
      });
      
      if (response.error) {
        toast({
          title: "Erro ao criar conta",
          description: response.error,
          variant: "destructive",
        });
      } else {
    toast({ title: "Conta criada com sucesso!" });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
    setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <ParticleBackground />

      <Card className="w-full max-w-md glass-panel animate-fade-in border-primary/20">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <Logo size="md" animated />
            <h1 className="text-2xl font-bold mt-4 neon-text">VN TICKET</h1>
            <p className="text-muted-foreground">Acesse sua conta</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="glass-panel border-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="glass-panel border-primary/30 focus:border-primary"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 neon-glow"
                  disabled={loading}
                >
                  <LogIn className="h-4 w-4" />
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="glass-panel border-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">E-mail</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="glass-panel border-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="glass-panel border-primary/30 focus:border-primary"
                    placeholder="Mínimo 8 caracteres, com maiúscula, minúscula, número e especial"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-cpf">CPF (opcional)</Label>
                  <Input
                    id="signup-cpf"
                    value={signupCPF}
                    onChange={(e) => setSignupCPF(e.target.value)}
                    className="glass-panel border-primary/30 focus:border-primary"
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-phone">Telefone (opcional)</Label>
                  <Input
                    id="signup-phone"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="glass-panel border-primary/30 focus:border-primary"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 neon-glow"
                  disabled={loading}
                >
                  <UserPlus className="h-4 w-4" />
                  {loading ? "Criando..." : "Criar Conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default Login;
