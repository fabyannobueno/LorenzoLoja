import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { LogIn, AlertCircle } from "lucide-react";

const LOGO = "https://static.wixstatic.com/media/503d91_c7b6678363f848ea973886ce8f9491d9~mv2.png/v1/fill/w_900,h_360,al_c,q_85,enc_webp/file.webp";

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Redirect to="/admin" />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("E-mail ou senha incorretos.");
      } else if (code === "auth/user-not-found") {
        setError("Usuário não encontrado.");
      } else if (code === "auth/too-many-requests") {
        setError("Muitas tentativas. Aguarde e tente novamente.");
      } else {
        setError("Erro ao fazer login. Verifique suas credenciais.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src={LOGO} alt="MC Lorenzo" className="h-16 w-auto object-contain" />
        </div>

        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Painel Administrativo</CardTitle>
            <CardDescription>Entre com sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="flex items-center gap-2 py-2 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Spinner className="h-4 w-4 mr-2" />
                ) : (
                  <LogIn className="h-4 w-4 mr-2" />
                )}
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          © {new Date().getFullYear()} MC Lorenzo — Acesso restrito
        </p>
      </div>
    </div>
  );
}
