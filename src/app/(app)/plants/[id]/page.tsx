import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  PLANT_PHASES,
  PLANT_GENETICS,
  SUBSTRATES,
  getPlantDays,
  getPlantWeek,
  getHealthColor,
} from "@/lib/constants";
import { PlantActions } from "@/components/plants/plant-actions";
import { PlantPhaseSelector } from "@/components/plants/plant-phase-selector";
import { PlantHealthSlider } from "@/components/plants/plant-health-slider";

const PHASE_BADGE_COLORS: Record<string, string> = {
  GERM: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  SEEDLING: "bg-lime-500/20 text-lime-400 border-lime-500/30",
  VEG: "bg-green-500/20 text-green-400 border-green-500/30",
  FLOWER: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  HARVEST: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  CURING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const GEN_BADGE_COLORS: Record<string, string> = {
  FEM: "bg-pink-500/15 text-pink-400 border-pink-500/25",
  AUTO: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  PHOTO: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  REGULAR: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
};

export default async function PlantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: plant } = await supabase
    .from("plants")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!plant) {
    notFound();
  }

  const days = getPlantDays(plant.start_date);
  const week = getPlantWeek(plant.start_date);
  const healthColor = getHealthColor(plant.health);
  const phaseInfo = PLANT_PHASES[plant.phase as keyof typeof PLANT_PHASES];
  const genInfo = PLANT_GENETICS[plant.gen_type as keyof typeof PLANT_GENETICS];
  const substrateInfo = SUBSTRATES[plant.substrate as keyof typeof SUBSTRATES];
  const phaseBadge = PHASE_BADGE_COLORS[plant.phase] || PHASE_BADGE_COLORS.VEG;
  const genBadge = GEN_BADGE_COLORS[plant.gen_type] || GEN_BADGE_COLORS.FEM;

  const startFormatted = new Date(plant.start_date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        {/* Back + Edit */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/plants"
            className="inline-flex items-center gap-1.5 text-xs text-grow-muted font-semibold hover:text-grow-text transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar
          </Link>
          <Link
            href={`/plants/${plant.id}/edit`}
            className="btn-ghost px-3 h-8 flex items-center gap-1.5 text-[10px]"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar
          </Link>
        </div>

        {/* Header card */}
        <div className="card mb-3">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h1 className="text-lg font-bold text-grow-text">{plant.name}</h1>
              {plant.strain && (
                <p className="text-xs text-grow-muted font-semibold mt-0.5">
                  {plant.strain}
                </p>
              )}
            </div>
            {plant.archived && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-xl border bg-grow-surface-alt text-grow-muted border-grow-border-strong">
                Arquivada
              </span>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl border ${phaseBadge}`}
            >
              {phaseInfo.label}
            </span>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl border ${genBadge}`}
            >
              {genInfo.label}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl border bg-grow-tint text-grow-muted border-grow-border-strong">
              {substrateInfo.label}
            </span>
          </div>

          {/* Health bar */}
          <div className="mb-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-grow-muted font-bold uppercase tracking-wider">
                Saude
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: healthColor }}
              >
                {plant.health}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-grow-tint overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${plant.health}%`,
                  background: healthColor,
                  boxShadow: `0 0 10px ${healthColor}50`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="card flex flex-col items-center py-3 gap-1">
            <span className="text-[9px] text-grow-muted font-bold uppercase tracking-wider">
              Dias
            </span>
            <span className="text-lg font-bold text-grow-text">{days}</span>
          </div>
          <div className="card flex flex-col items-center py-3 gap-1">
            <span className="text-[9px] text-grow-muted font-bold uppercase tracking-wider">
              Semana
            </span>
            <span className="text-lg font-bold text-grow-text">{week}</span>
          </div>
          <div className="card flex flex-col items-center py-3 gap-1">
            <span className="text-[9px] text-grow-muted font-bold uppercase tracking-wider">
              Inicio
            </span>
            <span className="text-[10px] font-bold text-grow-text text-center leading-tight">
              {startFormatted}
            </span>
          </div>
        </div>

        {/* Details card */}
        <div className="card mb-3 space-y-3">
          <h3 className="text-[10px] text-grow-muted font-bold uppercase tracking-wider">
            Detalhes
          </h3>

          {plant.seed_bank && (
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-grow-muted font-semibold">
                Banco de sementes
              </span>
              <span className="text-xs text-grow-text font-semibold">
                {plant.seed_bank}
              </span>
            </div>
          )}

          {plant.notes && (
            <div>
              <span className="text-[11px] text-grow-muted font-semibold block mb-1">
                Notas
              </span>
              <p className="text-xs text-grow-text leading-relaxed whitespace-pre-wrap">
                {plant.notes}
              </p>
            </div>
          )}

          {!plant.seed_bank && !plant.notes && (
            <p className="text-[11px] text-grow-muted italic">
              Nenhum detalhe adicional.
            </p>
          )}
        </div>

        {/* Phase selector */}
        <div className="card mb-3">
          <h3 className="text-[10px] text-grow-muted font-bold uppercase tracking-wider mb-2">
            Alterar fase
          </h3>
          <PlantPhaseSelector plantId={plant.id} currentPhase={plant.phase} />
        </div>

        {/* Health slider */}
        <div className="card mb-3">
          <h3 className="text-[10px] text-grow-muted font-bold uppercase tracking-wider mb-2">
            Ajustar saude
          </h3>
          <PlantHealthSlider plantId={plant.id} currentHealth={plant.health} />
        </div>

        {/* Actions */}
        <div className="mt-4">
          <PlantActions plant={plant} />
        </div>
      </div>
    </div>
  );
}
