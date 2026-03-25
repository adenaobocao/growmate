import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SetupCard } from "@/components/setup/setup-card";

export default async function SetupPage() {
  const supabase = createClient();

  const { data: setups } = await supabase
    .from("setups")
    .select("*")
    .order("created_at", { ascending: false });

  const setupList = setups || [];

  // Fetch counts for each setup
  const setupsWithCounts = await Promise.all(
    setupList.map(async (setup) => {
      const [lightsRes, soilsRes, ventsRes, fertsRes] = await Promise.all([
        supabase.from("lights").select("id", { count: "exact", head: true }).eq("setup_id", setup.id),
        supabase.from("soils").select("id", { count: "exact", head: true }).eq("setup_id", setup.id),
        supabase.from("vents").select("id", { count: "exact", head: true }).eq("setup_id", setup.id),
        supabase.from("ferts").select("id", { count: "exact", head: true }).eq("setup_id", setup.id),
      ]);

      return {
        ...setup,
        _counts: {
          lights: lightsRes.count ?? 0,
          soils: soilsRes.count ?? 0,
          vents: ventsRes.count ?? 0,
          ferts: fertsRes.count ?? 0,
        },
      };
    })
  );

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <div className="text-[10px] text-grow-muted font-bold uppercase tracking-wider mb-3">
          meus setups
        </div>

        {setupsWithCounts.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-4xl mb-3 opacity-40">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-grow-primary"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <p className="text-sm text-grow-muted font-semibold text-center mb-1">
              Nenhum setup configurado
            </p>
            <p className="text-[11px] text-grow-muted text-center mb-5 opacity-70">
              Crie seu primeiro setup para configurar luzes, substrato, ventilacao e nutricao
            </p>
            <Link
              href="/setup/new"
              className="btn-primary px-6 flex items-center gap-2 text-xs"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Criar primeiro setup
            </Link>
          </div>
        ) : (
          /* Setup cards */
          <div className="grid grid-cols-1 gap-2.5">
            {setupsWithCounts.map((setup) => (
              <SetupCard key={setup.id} setup={setup} />
            ))}
          </div>
        )}
      </div>

      {/* FAB - floating add button */}
      {setupList.length > 0 && (
        <Link
          href="/setup/new"
          className="fixed bottom-24 right-4 z-30 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: "linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-secondary)))",
            boxShadow:
              "0 4px 20px rgb(var(--color-glow)), 0 0 0 4px rgb(var(--color-tint))",
            maxWidth: "430px",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Link>
      )}
    </div>
  );
}
