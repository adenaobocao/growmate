"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface AuthFormProps {
  mode: "login" | "register";
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Fraca", color: "bg-grow-danger" };
  if (score <= 2) return { score: 2, label: "Razoavel", color: "bg-grow-warning" };
  if (score <= 3) return { score: 3, label: "Boa", color: "bg-grow-primary" };
  return { score: 4, label: "Forte", color: "bg-grow-success" };
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const isLogin = mode === "login";

  const passwordStrength = useMemo(
    () => (!isLogin && password.length > 0 ? getPasswordStrength(password) : null),
    [password, isLogin]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Login realizado!");
        router.push("/");
        router.refresh();
      } else {
        if (password.length < 6) {
          throw new Error("A senha deve ter pelo menos 6 caracteres.");
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        });
        if (error) throw error;

        if (data.session) {
          toast.success("Conta criada com sucesso!");
          router.push("/");
          router.refresh();
        } else {
          setSuccess("Conta criada! Verifique seu email para confirmar.");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro inesperado.";
      if (msg.includes("Invalid login")) {
        setError("Email ou senha incorretos.");
      } else if (msg.includes("already registered")) {
        setError("Este email ja esta cadastrado.");
      } else if (msg.includes("Email not confirmed")) {
        setError("Confirme seu email antes de entrar.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) {
      toast.error("Erro ao conectar com Google. Tente novamente.");
      setGoogleLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto flex flex-col gap-3">
      {!isLogin && (
        <div className="field">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
            maxLength={60}
          />
        </div>
      )}

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          autoComplete="email"
        />
      </div>

      <div className="field">
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isLogin ? "Sua senha" : "Minimo 6 caracteres"}
          required
          minLength={6}
          autoComplete={isLogin ? "current-password" : "new-password"}
        />

        {/* Password strength indicator */}
        {passwordStrength && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    level <= passwordStrength.score
                      ? passwordStrength.color
                      : "bg-grow-muted/15"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-grow-muted">
              {passwordStrength.label}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="text-xs text-grow-danger bg-grow-danger/10 border border-grow-danger/20 rounded-xl px-3 py-2.5 font-semibold animate-fade-in">
          {error}
        </div>
      )}

      {success && (
        <div className="text-xs text-grow-primary bg-grow-primary/10 border border-grow-primary/20 rounded-xl px-3 py-2.5 font-semibold animate-fade-in">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full mt-1"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" />
            Aguarde...
          </span>
        ) : isLogin ? (
          "Entrar"
        ) : (
          "Criar conta"
        )}
      </button>

      <div className="relative flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-grow-border" />
        <span className="text-[10px] text-grow-muted font-bold uppercase tracking-wider">ou</span>
        <div className="flex-1 h-px bg-grow-border" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="btn-ghost w-full flex items-center justify-center gap-2"
      >
        {googleLoading ? (
          <Spinner size="sm" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Entrar com Google
      </button>

      <div className="text-center mt-3">
        {isLogin ? (
          <>
            <Link
              href="/forgot-password"
              className="text-xs text-grow-muted hover:text-grow-primary transition-colors font-semibold"
            >
              Esqueceu a senha?
            </Link>
            <div className="mt-3 text-xs text-grow-muted">
              Nao tem conta?{" "}
              <Link href="/register" className="text-grow-primary font-bold hover:underline">
                Criar conta
              </Link>
            </div>
          </>
        ) : (
          <div className="text-xs text-grow-muted">
            Ja tem conta?{" "}
            <Link href="/login" className="text-grow-primary font-bold hover:underline">
              Entrar
            </Link>
          </div>
        )}
      </div>
    </form>
  );
}
