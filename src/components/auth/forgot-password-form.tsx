"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/settings`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao enviar email.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-grow-primary/10 border border-grow-primary/20 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#29b554" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 className="font-display text-lg font-bold text-grow-text mb-2">Email enviado!</h2>
        <p className="text-xs text-grow-muted leading-relaxed mb-6">
          Se <strong className="text-grow-text">{email}</strong> estiver cadastrado, voce recebera um link para redefinir sua senha.
        </p>
        <Link href="/login" className="text-xs text-grow-primary font-bold hover:underline">
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto flex flex-col gap-3">
      <p className="text-xs text-grow-muted leading-relaxed mb-2">
        Informe seu email e enviaremos um link para redefinir sua senha.
      </p>

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

      {error && (
        <div className="text-xs text-grow-rose bg-grow-rose/10 border border-grow-rose/20 rounded-xl px-3 py-2.5 font-semibold">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
        {loading ? "Enviando..." : "Enviar link de recuperacao"}
      </button>

      <div className="text-center mt-3">
        <Link href="/login" className="text-xs text-grow-muted hover:text-grow-primary transition-colors font-semibold">
          Voltar para o login
        </Link>
      </div>
    </form>
  );
}
