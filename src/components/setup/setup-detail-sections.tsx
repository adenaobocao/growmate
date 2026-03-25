"use client";

import { useState } from "react";
import type { Light, Soil, Vent, Fert } from "@/types/database";
import { SetupSection } from "./setup-section";
import { LightForm } from "./light-form";
import { SoilForm } from "./soil-form";
import { VentForm } from "./vent-form";
import { FertForm } from "./fert-form";

interface SetupDetailSectionsProps {
  setupId: string;
  lights: Light[];
  soils: Soil[];
  vents: Vent[];
  ferts: Fert[];
}

const SOIL_TYPE_LABELS: Record<string, string> = {
  SOIL: "Solo",
  COCO: "Coco",
  HYDRO: "Hidroponia",
  MIX: "Mix",
};

const VENT_TYPE_LABELS: Record<string, string> = {
  EXAUSTOR: "Exaustor",
  CIRCULADOR: "Circulador",
  INTAKE: "Intake",
};

export function SetupDetailSections({
  setupId,
  lights,
  soils,
  vents,
  ferts,
}: SetupDetailSectionsProps) {
  const [addingLight, setAddingLight] = useState(false);
  const [editingLight, setEditingLight] = useState<Light | null>(null);
  const [addingSoil, setAddingSoil] = useState(false);
  const [editingSoil, setEditingSoil] = useState<Soil | null>(null);
  const [addingVent, setAddingVent] = useState(false);
  const [editingVent, setEditingVent] = useState<Vent | null>(null);
  const [addingFert, setAddingFert] = useState(false);
  const [editingFert, setEditingFert] = useState<Fert | null>(null);

  return (
    <>
      {/* Iluminacao */}
      <SetupSection
        title="Iluminacao"
        count={lights.length}
        onAdd={() => { setAddingLight(true); setEditingLight(null); }}
        addLabel="Adicionar"
      >
        {addingLight && (
          <LightForm setupId={setupId} onCancel={() => setAddingLight(false)} />
        )}
        {editingLight && (
          <LightForm
            setupId={setupId}
            light={editingLight}
            onCancel={() => setEditingLight(null)}
          />
        )}
        {lights.length === 0 && !addingLight ? (
          <p className="text-[11px] text-grow-muted italic py-1">
            Nenhuma luz configurada.
          </p>
        ) : (
          lights.map((light) => (
            <button
              key={light.id}
              type="button"
              onClick={() => { setEditingLight(light); setAddingLight(false); }}
              className="w-full text-left bg-grow-tint border border-grow-border rounded-xl p-2.5 cursor-pointer hover:border-grow-border-strong transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-grow-text">
                  {light.type}{light.watts ? ` ${light.watts}W` : ""}
                </span>
                {light.cycle && (
                  <span className="text-[9px] font-bold text-grow-muted bg-grow-tint px-1.5 py-0.5 rounded-lg">
                    {light.cycle}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {light.ppfd && (
                  <span className="text-[9px] text-grow-muted font-semibold">
                    {light.ppfd} PPFD
                  </span>
                )}
                {light.height_cm && (
                  <span className="text-[9px] text-grow-muted font-semibold">
                    {light.height_cm}cm
                  </span>
                )}
                {(light.brand || light.model) && (
                  <span className="text-[9px] text-grow-muted font-semibold">
                    {[light.brand, light.model].filter(Boolean).join(" ")}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </SetupSection>

      {/* Substrato */}
      <SetupSection
        title="Substrato"
        count={soils.length}
        onAdd={() => { setAddingSoil(true); setEditingSoil(null); }}
        addLabel="Adicionar"
      >
        {addingSoil && (
          <SoilForm setupId={setupId} onCancel={() => setAddingSoil(false)} />
        )}
        {editingSoil && (
          <SoilForm
            setupId={setupId}
            soil={editingSoil}
            onCancel={() => setEditingSoil(null)}
          />
        )}
        {soils.length === 0 && !addingSoil ? (
          <p className="text-[11px] text-grow-muted italic py-1">
            Nenhum substrato configurado.
          </p>
        ) : (
          soils.map((soil) => (
            <button
              key={soil.id}
              type="button"
              onClick={() => { setEditingSoil(soil); setAddingSoil(false); }}
              className="w-full text-left bg-grow-tint border border-grow-border rounded-xl p-2.5 cursor-pointer hover:border-grow-border-strong transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-grow-text">
                  {SOIL_TYPE_LABELS[soil.type] || soil.type}
                </span>
                {soil.volume_liters && (
                  <span className="text-[9px] font-bold text-grow-muted bg-grow-tint px-1.5 py-0.5 rounded-lg">
                    {soil.volume_liters}L
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {soil.brand && (
                  <span className="text-[9px] text-grow-muted font-semibold">
                    {soil.brand}
                  </span>
                )}
                {(soil.n_value != null || soil.p_value != null || soil.k_value != null) && (
                  <span className="text-[9px] text-grow-muted font-semibold">
                    NPK: {soil.n_value ?? 0}-{soil.p_value ?? 0}-{soil.k_value ?? 0}
                  </span>
                )}
                {soil.ph && (
                  <span className="text-[9px] text-grow-muted font-semibold">
                    pH {soil.ph}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </SetupSection>

      {/* Ventilacao */}
      <SetupSection
        title="Ventilacao"
        count={vents.length}
        onAdd={() => { setAddingVent(true); setEditingVent(null); }}
        addLabel="Adicionar"
      >
        {addingVent && (
          <VentForm setupId={setupId} onCancel={() => setAddingVent(false)} />
        )}
        {editingVent && (
          <VentForm
            setupId={setupId}
            vent={editingVent}
            onCancel={() => setEditingVent(null)}
          />
        )}
        {vents.length === 0 && !addingVent ? (
          <p className="text-[11px] text-grow-muted italic py-1">
            Nenhuma ventilacao configurada.
          </p>
        ) : (
          vents.map((vent) => (
            <button
              key={vent.id}
              type="button"
              onClick={() => { setEditingVent(vent); setAddingVent(false); }}
              className="w-full text-left bg-grow-tint border border-grow-border rounded-xl p-2.5 cursor-pointer hover:border-grow-border-strong transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-grow-text">
                  {VENT_TYPE_LABELS[vent.type] || vent.type}
                </span>
                {vent.has_carbon_filter && (
                  <span className="text-[9px] font-bold text-grow-primary bg-grow-primary/10 px-1.5 py-0.5 rounded-lg">
                    Filtro carvao
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {vent.brand && (
                  <span className="text-[9px] text-grow-muted font-semibold">
                    {vent.brand}
                  </span>
                )}
                {vent.cfm && (
                  <span className="text-[9px] text-grow-muted font-semibold">
                    {vent.cfm} CFM
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </SetupSection>

      {/* Nutricao */}
      <SetupSection
        title="Nutricao"
        count={ferts.length}
        onAdd={() => { setAddingFert(true); setEditingFert(null); }}
        addLabel="Adicionar"
      >
        {addingFert && (
          <FertForm setupId={setupId} onCancel={() => setAddingFert(false)} />
        )}
        {editingFert && (
          <FertForm
            setupId={setupId}
            fert={editingFert}
            onCancel={() => setEditingFert(null)}
          />
        )}
        {ferts.length === 0 && !addingFert ? (
          <p className="text-[11px] text-grow-muted italic py-1">
            Nenhum fertilizante configurado.
          </p>
        ) : (
          ferts.map((fert) => (
            <button
              key={fert.id}
              type="button"
              onClick={() => { setEditingFert(fert); setAddingFert(false); }}
              className="w-full text-left bg-grow-tint border border-grow-border rounded-xl p-2.5 cursor-pointer hover:border-grow-border-strong transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-grow-text">
                  {fert.name || "Sem nome"}
                </span>
                {fert.ec && (
                  <span className="text-[9px] font-bold text-grow-muted bg-grow-tint px-1.5 py-0.5 rounded-lg">
                    EC {fert.ec}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {fert.brand && (
                  <span className="text-[9px] text-grow-muted font-semibold">
                    {fert.brand}
                  </span>
                )}
                {(fert.n_value != null || fert.p_value != null || fert.k_value != null) && (
                  <span className="text-[9px] text-grow-muted font-semibold">
                    NPK: {fert.n_value ?? 0}-{fert.p_value ?? 0}-{fert.k_value ?? 0}
                  </span>
                )}
                {fert.ph && (
                  <span className="text-[9px] text-grow-muted font-semibold">
                    pH {fert.ph}
                  </span>
                )}
                {fert.notes && (
                  <span className="text-[9px] text-grow-muted font-semibold truncate max-w-[150px]">
                    {fert.notes}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </SetupSection>
    </>
  );
}
