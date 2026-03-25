import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user!.id)
    .single();

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-6 pb-24 flex flex-col items-center justify-center min-h-full">
        {/* Hero */}
        <div className="relative w-[200px] h-[200px] flex items-center justify-center mb-6">
          <Image
            src="/bud.png"
            alt="GrowMate"
            width={200}
            height={200}
            className="w-full h-full object-contain animate-float"
            style={{
              filter: "drop-shadow(0 0 40px rgb(var(--color-glow))) drop-shadow(0 24px 40px rgba(0,0,0,0.70))",
            }}
          />
        </div>

        <h2 className="font-display text-2xl font-black text-white text-center">
          {profile?.name ? `Ola, ${profile.name}!` : "GrowMate"}
        </h2>
        <p className="text-xs text-grow-muted mt-2 text-center">
          Assistente de cultivo IA
        </p>

        {/* Quick action - start chat */}
        <Link
          href="/chat"
          className="btn-primary px-7 py-3 mt-8 flex items-center gap-2 text-sm"
          style={{
            background: "linear-gradient(270deg, rgb(var(--color-primary)), rgb(var(--color-secondary)), rgb(var(--color-primary)))",
            backgroundSize: "500% 100%",
            animation: "btnFlow 8s linear infinite",
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Comecar a conversar
        </Link>

        <style>{`
          @keyframes btnFlow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}</style>

        {/* Status cards placeholder */}
        <div className="w-full mt-10 grid grid-cols-2 gap-2.5">
          <div className="card flex flex-col items-center py-5 gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-[10px] text-grow-muted font-bold uppercase tracking-wider">Plantas</span>
            <span className="text-lg font-bold text-grow-text">0</span>
          </div>
          <div className="card flex flex-col items-center py-5 gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-[10px] text-grow-muted font-bold uppercase tracking-wider">Setup</span>
            <span className="text-xs text-grow-muted font-semibold">Configurar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
