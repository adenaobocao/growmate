import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getHealthColor } from "@/lib/constants";

const TIPS = [
  "Mantenha o pH entre 6.0-7.0 no solo para absorcao ideal de nutrientes.",
  "Na flora, reduza o fotoperiodo para 12/12 em fotoperiodicas.",
  "Evite regar em excesso — espere o topo do solo secar antes de regar.",
  "Ventilacao constante previne mofo e fortalece os caules.",
  "Flush de 1-2 semanas antes da colheita melhora o sabor.",
  "Autos florescem independente do fotoperiodo — ideais para iniciantes.",
  "Temperatura ideal: 22-28C na veg, 20-26C na flora.",
  "Umidade ideal: 60-70% na veg, 40-50% na flora.",
];

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [profileRes, plantsRes, setupsRes, chatUsageRes] = await Promise.all([
    supabase.from("profiles").select("name").eq("id", user!.id).single(),
    supabase
      .from("plants")
      .select("id, name, health, phase, start_date")
      .eq("user_id", user!.id)
      .is("archived_at", null),
    supabase
      .from("setups")
      .select("id")
      .eq("user_id", user!.id),
    supabase
      .from("chat_daily_usage")
      .select("count")
      .eq("user_id", user!.id)
      .eq("usage_date", new Date().toISOString().split("T")[0])
      .maybeSingle(),
  ]);

  const profile = profileRes.data;
  const plants = plantsRes.data || [];
  const setups = setupsRes.data || [];
  const chatUsed = chatUsageRes.data?.count || 0;

  const avgHealth =
    plants.length > 0
      ? Math.round(plants.reduce((sum, p) => sum + (p.health || 100), 0) / plants.length)
      : null;

  // Pick a random tip based on the day
  const tipIndex = new Date().getDate() % TIPS.length;
  const tip = TIPS[tipIndex];

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-6 pb-24 flex flex-col items-center min-h-full">
        {/* Hero */}
        <div className="relative w-[160px] h-[160px] flex items-center justify-center mb-5">
          <Image
            src="/bud.png"
            alt="GrowMate"
            width={160}
            height={160}
            className="w-full h-full object-contain animate-float"
            priority
            style={{
              filter:
                "drop-shadow(0 0 40px rgb(var(--color-glow))) drop-shadow(0 24px 40px rgba(0,0,0,0.70))",
            }}
          />
        </div>

        <h2 className="text-page-title text-center">
          {profile?.name ? `Ola, ${profile.name}!` : "GrowMate"}
        </h2>
        <p className="text-body-sm mt-1 text-center">Assistente de cultivo IA</p>

        {/* Quick action - start chat */}
        <Link
          href="/chat"
          className="btn-primary px-7 py-3 mt-6 flex items-center gap-2 text-sm"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Comecar a conversar
        </Link>

        {/* Tip strip */}
        <div className="w-full mt-6 card flex items-start gap-3 py-3 px-3.5">
          <span className="text-grow-primary text-sm mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </span>
          <p className="text-body-sm flex-1 leading-relaxed">{tip}</p>
        </div>

        {/* Dashboard cards */}
        <div className="w-full mt-4 grid grid-cols-2 gap-2.5">
          {/* Plantas */}
          <Link href="/plants" className="card flex flex-col items-center py-4 gap-1.5 active:scale-[0.97] transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-grow-primary">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 8" />
            </svg>
            <span className="text-section-title">Plantas</span>
            <span className="text-xl font-bold text-grow-text">{plants.length}</span>
          </Link>

          {/* Setups */}
          <Link href="/setup" className="card flex flex-col items-center py-4 gap-1.5 active:scale-[0.97] transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-grow-primary">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-section-title">Setups</span>
            <span className="text-xl font-bold text-grow-text">{setups.length}</span>
          </Link>

          {/* Saude media */}
          <div className="card flex flex-col items-center py-4 gap-1.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-grow-primary">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span className="text-section-title">Saude media</span>
            {avgHealth !== null ? (
              <span className="text-xl font-bold" style={{ color: getHealthColor(avgHealth) }}>
                {avgHealth}%
              </span>
            ) : (
              <span className="text-xs text-grow-muted">Sem plantas</span>
            )}
          </div>

          {/* Chat hoje */}
          <Link href="/chat" className="card flex flex-col items-center py-4 gap-1.5 active:scale-[0.97] transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-grow-primary">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-section-title">Chat hoje</span>
            <span className="text-xl font-bold text-grow-text">{chatUsed}/10</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
