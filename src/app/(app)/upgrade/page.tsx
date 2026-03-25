"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
        <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
      </svg>
    ),
    title: "Ate 6 plantas",
    desc: "vs 1 no plano gratuito",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Chat IA ilimitado",
    desc: "vs 10 msgs/dia no gratuito",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Historico completo",
    desc: "Chat e diario sem limite",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: "Diagnostico por foto",
    desc: "IA analisa suas folhas",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    title: "Alertas proativos",
    desc: "Risco de pragas, nutrientes",
  },
];

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("cancelled") === "true") {
      toast("Pagamento cancelado. Voce pode tentar novamente quando quiser.");
    }
  }, [searchParams]);

  async function handleSubscribe() {
    setLoading(true);
    try {
      const res = await fetch("/api/subscription", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao iniciar pagamento.");
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Erro ao conectar com o pagamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-6 pb-24 flex flex-col items-center">
        {/* Badge */}
        <div className="w-20 h-20 rounded-3xl bg-grow-primary/10 border border-grow-primary/20 flex items-center justify-center mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-grow-primary">
            <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
          </svg>
        </div>

        <h2 className="font-display text-xl font-black text-white text-center">
          GrowMate <span className="text-grow-primary">PRO</span>
        </h2>
        <p className="text-xs text-grow-muted mt-2 text-center">
          Leve seu cultivo ao proximo nivel
        </p>

        {/* Price */}
        <div className="mt-6 text-center">
          <span className="text-3xl font-black text-white">R$9,90</span>
          <span className="text-xs text-grow-muted font-semibold">/mes</span>
        </div>

        {/* Features */}
        <div className="w-full mt-8 flex flex-col gap-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card flex items-start gap-3">
              <span className="flex-shrink-0 mt-0.5">{f.icon}</span>
              <div>
                <div className="text-xs font-bold text-grow-text">
                  {f.title}
                </div>
                <div className="text-[10px] text-grow-muted font-medium mt-0.5">
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="btn-primary w-full mt-8 text-sm font-bold py-3.5 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Spinner size="sm" /> Redirecionando...
            </>
          ) : (
            "Assinar PRO — R$9,90/mes"
          )}
        </button>
        <p className="text-[10px] text-grow-muted mt-3 text-center">
          Cartao de credito. Cancele quando quiser.
        </p>
      </div>
    </div>
  );
}
