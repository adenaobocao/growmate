"use client";

import Link from "next/link";
import type { Plant } from "@/types/database";
import {
  PLANT_PHASES,
  PLANT_GENETICS,
  SUBSTRATES,
  getPlantDays,
  getPlantWeek,
  getHealthColor,
} from "@/lib/constants";

const PHASE_BADGE_COLORS: Record<string, string> = {
  GERM: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  SEEDLING: "bg-lime-500/20 text-lime-400 border-lime-500/30",
  VEG: "bg-green-500/20 text-green-400 border-green-500/30",
  FLOWER: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  HARVEST: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  CURING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export function PlantCard({ plant }: { plant: Plant }) {
  const days = getPlantDays(plant.start_date);
  const week = getPlantWeek(plant.start_date);
  const healthColor = getHealthColor(plant.health);
  const phaseInfo = PLANT_PHASES[plant.phase];
  const genInfo = PLANT_GENETICS[plant.gen_type];
  const substrateInfo = SUBSTRATES[plant.substrate];
  const badgeClass = PHASE_BADGE_COLORS[plant.phase] || PHASE_BADGE_COLORS.VEG;

  return (
    <Link href={`/plants/${plant.id}`} className="block">
      <div className="card hover:border-grow-border-strong transition-colors animate-fade-in">
        {/* Top row: name + phase badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-grow-text truncate">
              {plant.name}
            </h3>
            {plant.strain && (
              <p className="text-[10px] text-grow-muted font-semibold truncate mt-0.5">
                {plant.strain}
              </p>
            )}
          </div>
          <span
            className={`flex-shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-xl border ${badgeClass}`}
          >
            {phaseInfo.label}
          </span>
        </div>

        {/* Health bar */}
        <div className="mb-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-grow-muted font-bold uppercase tracking-wider">
              Saude
            </span>
            <span className="text-[10px] font-bold" style={{ color: healthColor }}>
              {plant.health}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-grow-tint overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${plant.health}%`,
                background: healthColor,
                boxShadow: `0 0 8px ${healthColor}40`,
              }}
            />
          </div>
        </div>

        {/* Bottom row: metadata chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] font-bold text-grow-muted bg-grow-tint px-2 py-0.5 rounded-lg">
            {days}d / S{week}
          </span>
          <span className="text-[9px] font-bold text-grow-muted bg-grow-tint px-2 py-0.5 rounded-lg">
            {genInfo.label}
          </span>
          <span className="text-[9px] font-bold text-grow-muted bg-grow-tint px-2 py-0.5 rounded-lg">
            {substrateInfo.label}
          </span>
        </div>
      </div>
    </Link>
  );
}
