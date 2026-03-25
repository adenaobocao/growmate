"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Light } from "@/types/database";

const LIGHT_TYPES = ["LED", "HPS", "CFL", "CMH", "T5", "SOLAR"];
const LIGHT_CYCLES = ["18/6", "20/4", "12/12", "24/0"];

interface LightFormProps {
  setupId: string;
  light?: Light;
  onCancel: () => void;
}

export function LightForm({ setupId, light, onCancel }: LightFormProps) {
  const router = useRouter();
  const isEdit = !!light;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState(light?.type || "LED");
  const [watts, setWatts] = useState<number | "">(light?.watts ?? "");
  const [ppfd, setPpfd] = useState<number | "">(light?.ppfd ?? "");
  const [heightCm, setHeightCm] = useState<number | "">(light?.height_cm ?? "");
  const [cycle, setCycle] = useState(light?.cycle || "18/6");
  const [brand, setBrand] = useState(light?.brand || "");
  const [model, setModel] = useState(light?.model || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const payload = {
      setup_id: setupId,
      type,
      watts: watts || null,
      ppfd: ppfd || null,
      height_cm: heightCm || null,
      cycle: cycle || null,
      brand: brand.trim() || null,
      model: model.trim() || null,
    };

    if (isEdit) {
      const { error: err } = await supabase
        .from("lights")
        .update(payload)
        .eq("id", light.id);
      if (err) {
        setError("Erro ao atualizar.");
        setLoading(false);
        return;
      }
    } else {
      const { error: err } = await supabase.from("lights").insert(payload);
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
    if (!light) return;
    if (!confirm("Remover esta luz?")) return;

    const supabase = createClient();
    await supabase.from("lights").delete().eq("id", light.id);
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
          <label htmlFor="lightType">Tipo</label>
          <select id="lightType" value={type} onChange={(e) => setType(e.target.value)}>
            {LIGHT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="lightWatts">Watts</label>
          <input
            id="lightWatts"
            type="number"
            placeholder="Ex: 200"
            value={watts}
            onChange={(e) => setWatts(e.target.value ? Number(e.target.value) : "")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="field">
          <label htmlFor="lightPpfd">PPFD</label>
          <input
            id="lightPpfd"
            type="number"
            placeholder="umol/m2/s"
            value={ppfd}
            onChange={(e) => setPpfd(e.target.value ? Number(e.target.value) : "")}
          />
        </div>
        <div className="field">
          <label htmlFor="lightHeight">Altura (cm)</label>
          <input
            id="lightHeight"
            type="number"
            placeholder="Ex: 30"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : "")}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="lightCycle">Ciclo</label>
        <select id="lightCycle" value={cycle} onChange={(e) => setCycle(e.target.value)}>
          {LIGHT_CYCLES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="field">
          <label htmlFor="lightBrand">Marca</label>
          <input
            id="lightBrand"
            type="text"
            placeholder="Ex: Samsung"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="lightModel">Modelo</label>
          <input
            id="lightModel"
            type="text"
            placeholder="Ex: LM301H"
            value={model}
            onChange={(e) => setModel(e.target.value)}
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
