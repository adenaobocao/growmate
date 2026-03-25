import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PlantCard } from "@/components/plants/plant-card";
import { PlantsTabToggle } from "@/components/plants/plants-tab-toggle";

export default async function PlantsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const tab = searchParams.tab === "arquivo" ? "arquivo" : "ativas";
  const supabase = createClient();

  const { data: plants } = await supabase
    .from("plants")
    .select("*")
    .eq("archived", tab === "arquivo")
    .order("created_at", { ascending: false });

  const plantList = plants || [];

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <div className="text-[10px] text-grow-muted font-bold uppercase tracking-wider mb-3">
          minhas plantas
        </div>

        {/* Tab toggle */}
        <PlantsTabToggle activeTab={tab} />

        {plantList.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-4xl mb-3 opacity-40">
              {tab === "ativas" ? (
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
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 8" />
                  <path d="M20.71 4.63A2 2 0 0 0 19 4h-1.5A4.5 4.5 0 0 0 13 8.5V9" />
                </svg>
              ) : (
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-grow-muted"
                >
                  <polyline points="21 8 21 21 3 21 3 8" />
                  <rect x="1" y="3" width="22" height="5" />
                  <line x1="10" y1="12" x2="14" y2="12" />
                </svg>
              )}
            </div>
            <p className="text-sm text-grow-muted font-semibold text-center mb-1">
              {tab === "ativas"
                ? "Nenhuma planta ativa"
                : "Nenhuma planta arquivada"}
            </p>
            <p className="text-[11px] text-grow-muted text-center mb-5 opacity-70">
              {tab === "ativas"
                ? "Adicione sua primeira planta para comecar o cultivo"
                : "Plantas arquivadas aparecem aqui"}
            </p>
            {tab === "ativas" && (
              <Link
                href="/plants/new"
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
                Adicionar planta
              </Link>
            )}
          </div>
        ) : (
          /* Plant cards grid */
          <div className="grid grid-cols-1 gap-2.5 mt-3">
            {plantList.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}
      </div>

      {/* FAB - floating add button */}
      {tab === "ativas" && (
        <Link
          href="/plants/new"
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
