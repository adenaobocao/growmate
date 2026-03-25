"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { PlantPhase } from "@/types/database";
import { PLANT_PHASES } from "@/lib/constants";

const ALL_PHASES: PlantPhase[] = [
  "GERM",
  "SEEDLING",
  "VEG",
  "FLOWER",
  "HARVEST",
  "CURING",
];

const PHASE_COLORS: Record<string, string> = {
  GERM: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-cyan-500/10",
  SEEDLING: "bg-lime-500/20 text-lime-400 border-lime-500/30 shadow-lime-500/10",
  VEG: "bg-green-500/20 text-green-400 border-green-500/30 shadow-green-500/10",
  FLOWER: "bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-amber-500/10",
  HARVEST: "bg-orange-500/20 text-orange-400 border-orange-500/30 shadow-orange-500/10",
  CURING: "bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-purple-500/10",
};

const PHASE_ACTIVE: Record<string, string> = {
  GERM: "bg-cyan-500/35 text-cyan-300 border-cyan-400/50 shadow-md",
  SEEDLING: "bg-lime-500/35 text-lime-300 border-lime-400/50 shadow-md",
  VEG: "bg-green-500/35 text-green-300 border-green-400/50 shadow-md",
  FLOWER: "bg-amber-500/35 text-amber-300 border-amber-400/50 shadow-md",
  HARVEST: "bg-orange-500/35 text-orange-300 border-orange-400/50 shadow-md",
  CURING: "bg-purple-500/35 text-purple-300 border-purple-400/50 shadow-md",
};

export function PlantPhaseSelector({
  plantId,
  currentPhase,
}: {
  plantId: string;
  currentPhase: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState(currentPhase);
  const [loading, setLoading] = useState(false);

  async function handlePhaseChange(newPhase: PlantPhase) {
    if (newPhase === phase) return;

    setLoading(true);
    setPhase(newPhase);

    const supabase = createClient();
    const { error } = await supabase
      .from("plants")
      .update({ phase: newPhase })
      .eq("id", plantId);

    if (error) {
      setPhase(currentPhase);
      toast.error("Erro ao atualizar fase.");
    } else {
      toast.success(`Fase atualizada para ${PLANT_PHASES[newPhase].label}!`);
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {ALL_PHASES.map((p) => {
        const isActive = p === phase;
        const colorClass = isActive ? PHASE_ACTIVE[p] : PHASE_COLORS[p];
        return (
          <button
            key={p}
            onClick={() => handlePhaseChange(p)}
            disabled={loading}
            className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl border transition-all ${colorClass} ${
              loading ? "opacity-50" : ""
            }`}
          >
            {PLANT_PHASES[p].label}
          </button>
        );
      })}
    </div>
  );
}
