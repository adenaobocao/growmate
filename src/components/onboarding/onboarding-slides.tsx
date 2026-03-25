"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const SLIDES = [
  {
    title: "Bem-vindo ao GrowMate",
    desc: "Seu assistente completo de cultivo. Acompanhe suas plantas, converse com IA especializada e documente todo o processo.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-grow-primary">
        <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
      </svg>
    ),
  },
  {
    title: "Cadastre suas plantas",
    desc: "Adicione strain, genetica, substrato e acompanhe cada fase do cultivo com saude e timeline.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    title: "Converse com o Bud",
    desc: "IA especializada em cultivo. Pergunte sobre rega, nutrientes, pragas, colheita e muito mais.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Documente tudo",
    desc: "Use o diario para registrar regas, nutrientes, podas e fotos. Crie um historico completo do seu grow.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];

export function OnboardingSlides() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  const isLast = current === SLIDES.length - 1;
  const slide = SLIDES[current];

  async function handleFinish() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("profiles")
        .update({ onboarding_done: true })
        .eq("id", user.id);
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-grow-bg">
      <div className="flex flex-col items-center text-center max-w-[300px]">
        {/* Icon */}
        <div className="w-24 h-24 rounded-3xl bg-grow-surface border border-grow-border flex items-center justify-center mb-8">
          {slide.icon}
        </div>

        {/* Title */}
        <h1 className="font-display text-xl font-black text-grow-text mb-3">
          {slide.title}
        </h1>

        {/* Description */}
        <p className="text-body-sm leading-relaxed">{slide.desc}</p>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-10">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current
                ? "bg-grow-primary w-6"
                : "bg-grow-border"
            }`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="w-full max-w-[300px] mt-8 flex flex-col gap-2">
        {isLast ? (
          <button
            onClick={handleFinish}
            className="btn-primary w-full py-3 text-sm font-bold"
          >
            Comecar a usar
          </button>
        ) : (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="btn-primary w-full py-3 text-sm font-bold"
          >
            Proximo
          </button>
        )}
        {!isLast && (
          <button
            onClick={handleFinish}
            className="text-xs text-grow-muted font-semibold hover:text-grow-text transition-colors py-2"
          >
            Pular
          </button>
        )}
      </div>
    </div>
  );
}
