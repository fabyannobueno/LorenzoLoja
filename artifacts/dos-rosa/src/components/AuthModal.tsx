import React, { useState } from "react";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { SiGoogle } from "react-icons/si";

function getFirebaseError(code: string): string {
  const map: Record<string, string> = {
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/invalid-email": "E-mail inválido.",
    "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
    "auth/popup-closed-by-user": "Login cancelado.",
    "auth/network-request-failed": "Erro de conexão. Verifique sua internet.",
  };
  return map[code] ?? "Ocorreu um erro. Tente novamente.";
}

export function AuthModal() {
  const {
    signIn, signUp, signInWithGoogle, resetPassword,
    authModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab,
  } = useCustomerAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  function resetForm() {
    setName(""); setEmail(""); setPassword(""); setShowPass(false); setForgotMode(false);
  }

  function switchTab(tab: "login" | "register") {
    setAuthModalTab(tab);
    resetForm();
  }

  function handleClose() {
    setAuthModalOpen(false);
    resetForm();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (forgotMode) {
        await resetPassword(email);
        toast.success("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
        setForgotMode(false);
        return;
      }
      if (authModalTab === "register") {
        if (!name.trim()) { toast.error("Digite seu nome completo"); return; }
        if (password.length < 6) { toast.error("A senha deve ter pelo menos 6 caracteres"); return; }
        await signUp(name.trim(), email, password);
        toast.success(`Bem-vindo, ${name.split(" ")[0]}! 🎉`);
      } else {
        await signIn(email, password);
        toast.success("Login realizado com sucesso! 👋");
      }
      handleClose();
    } catch (err: any) {
      toast.error(getFirebaseError(err?.code ?? ""));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Login com Google realizado! 👋");
      handleClose();
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        toast.error(getFirebaseError(err?.code ?? ""));
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  const isLogin = authModalTab === "login";
  const title = forgotMode ? "Esqueci a senha" : isLogin ? "Entrar na sua conta" : "Criar conta";

  return (
    <Dialog open={authModalOpen} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-3xl">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 pt-6 pb-8">
          <DialogHeader>
            <DialogTitle
              className="text-white text-2xl text-center"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              {title}
            </DialogTitle>
            {!forgotMode && (
              <p className="text-blue-200 text-sm text-center mt-1">
                {isLogin ? "Bem-vindo de volta! 👋" : "Crie sua conta e aproveite! 🛍️"}
              </p>
            )}
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 -mt-4">
          {!forgotMode && (
            <div className="flex rounded-2xl bg-gray-100 p-1 mb-5">
              {(["login", "register"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => switchTab(tab)}
                  className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
                    authModalTab === tab
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={{ fontFamily: "'Fredoka One', sans-serif" }}
                >
                  {tab === "login" ? "Entrar" : "Cadastrar"}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {!forgotMode && !isLogin && (
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Nome completo</Label>
                <Input
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="rounded-xl h-11"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">E-mail</Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="rounded-xl h-11"
              />
            </div>

            {!forgotMode && (
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Senha</Label>
                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    placeholder={isLogin ? "Sua senha" : "Mínimo 6 caracteres"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    className="rounded-xl h-11 pr-10"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setForgotMode(true)}
                    className="text-xs text-primary hover:underline mt-0.5 block text-right w-full"
                  >
                    Esqueci minha senha
                  </button>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base rounded-2xl mt-1"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : forgotMode ? (
                "Enviar e-mail 📧"
              ) : isLogin ? (
                "Entrar 👋"
              ) : (
                "Criar conta 🎉"
              )}
            </Button>

            {forgotMode && (
              <button
                type="button"
                onClick={() => setForgotMode(false)}
                className="text-sm text-gray-500 hover:text-primary w-full text-center"
              >
                ← Voltar ao login
              </button>
            )}
          </form>

          {!forgotMode && (
            <>
              <div className="flex items-center gap-3 my-4">
                <Separator className="flex-1" />
                <span className="text-xs text-gray-400 font-medium">ou continue com</span>
                <Separator className="flex-1" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 rounded-2xl gap-2 font-semibold"
                onClick={handleGoogle}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SiGoogle className="h-4 w-4 text-red-500" />
                )}
                Continuar com Google
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
