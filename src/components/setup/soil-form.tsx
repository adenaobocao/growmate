"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Soil } from "@/types/database";

const SOIL_TYPES = [
  { value: "SOIL", label: "Solo" },
  { value: "COCO", label: "Coco" },
  { value: "HYDRO", label: "Hidroponia" },
  { value: "MIX", label: "Mix" },
];

interface SoilFormProps {
  setupId: string;
  soil?: Soil;
  onCancel: () => void;
}

export function SoilForm({ setupId, soil, onCancel }: SoilFormProps) {
  const router = useRouter();
  const isEdit = !!soil;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState(soil?.type || "SOIL");
  const [brand, setBrand] = useState(soil?.brand || "");
  const [nValue, setNValue] = useState<number | "">(soil?.n_value ?? "");
  const [pValue, setPValue] = useState<number | "">(soil?.p_value ?? "");
  const [kValue, setKValue] = useState<number | "">(soil?.k_value ?? "");
  const [ph, setPh] = useState<number | "">(soil?.ph ?? "");
  const [volumeLiters, setVolumeLiters] = useState<number | "">(soil?.volume_liters ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const payload = {
      setup_id: setupId,
      type,
      brand: brand.trim() || null,
      n_value: nValue || null,
      p_value: pValue || null,
      k_value: kValue || null,
      ph: ph || null,
      volume_liters: volumeLiters || null,
    };

    if (isEdit) {
      const { error: err } = await supabase
        .from("soils")
        .update(payload)
        .eq("id", soil.id);
      if (err) {
        setError("Erro ao atualizar.");
        setLoading(false);
        return;
      }
    } else {
      const { error: err } = await supabase.from("soils").insert(payload);
      if (err) {
        setError("Erro ao adicionar.");
        setLoading(false);
        return;
      }
    }

    router.refresh();
    onCancel();
  }

  async function handleDelete() {
    if (!soil) return;
    if (!confirm("Remover este substrato?")) return;

    const supabase = createClient();
    await supabase.from("soils").delete().eq("id", soil.id);
    router.refresh();
    onCancel();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-grow-surface border border-grow-border rounded-2xl p-3 space-y-1">
      {error && (
        <p className="text-xs text-grow-danger font-semibold">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div className="field">
          <label htmlFor="soilType">Tipo</label>
          <select id="soilType" value={type} onChange={(e) => setType(e.target.value)}>
            {SOIL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="soilBrand">Marca</label>
          <input
            id="soilBrand"
            type="text"
            placeholder="Ex: Carolina Soil"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label>NPK</label>
        <div className="grid grid-cols-3 gap-2 mt-1.5">
          <div>
            <input
              type="number"
              placeholder="N"
              value={nValue}
              onChange={(e) => setNValue(e.target.value ? Number(e.target.value) : "")}
              step="0.1"
              min={0}
              className="text-center"
            />
            <span className="block text-[8px] text-grow-muted font-semibold text-center mt-0.5">N</span>
          </div>
          <div>
            <input
              type="number"
              placeholder="P"
              value={pValue}
              onChange={(e) => setPValue(e.target.value ? Number(e.target.value) : "")}
              step="0.1"
              min={0}
              className="text-center"
            />
            <span className="block text-[8px] text-grow-muted font-semibold text-center mt-0.5">P</span>
          </div>
          <div>
            <input
              type="number"
              placeholder="K"
              value={kValue}
              onChange={(e) => setKValue(e.target.value ? Number(e.target.value) : "")}
              step="0.1"
              min={0}
              className="text-center"
            />
            <span className="block text-[8px] text-grow-muted font-semibold text-center mt-0.5">K</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="field">
          <label htmlFor="soilPh">pH</label>
          <input
            id="soilPh"
            type="number"
            placeholder="Ex: 6.5"
            value={ph}
            onChange={(e) => setPh(e.target.value ? Number(e.target.value) : "")}
            step="0.1"
            min={0}
            max={14}
          />
        </div>
        <div className="field">
          <label htmlFor="soilVolume">Volume (L)</label>
          <input
            id="soilVolume"
            type="number"
            placeholder="Ex: 20"
            value={volumeLiters}
            onChange={(e) => setVolumeLiters(e.target.value ? Number(e.target.value) : "")}
            step="0.5"
            min={0}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="h-9 px-3 rounded-xl border border-grow-danger/20 bg-grow-danger/5 text-grow-danger text-[10px] font-bold cursor-pointer"
          >
            Remover
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="btn-ghost flex-1 h-9 text-[10px]"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 h-9 text-[10px]"
        >
          {loading ? "Salvando..." : isEdit ? "Salvar" : "Adicionar"}
        </button>
      </div>
    </form>
  );
}
