"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type {
  Plant,
  PlantPhase,
  PlantGenType,
  SubstrateType,
} from "@/types/database";
import { PLANT_PHASES, PLANT_GENETICS, SUBSTRATES } from "@/lib/constants";

const ALL_PHASES: PlantPhase[] = [
  "GERM",
  "SEEDLING",
  "VEG",
  "FLOWER",
  "HARVEST",
  "CURING",
];
const GEN_OPTIONS: PlantGenType[] = ["FEM", "AUTO", "PHOTO", "REGULAR"];
const SUBSTRATE_OPTIONS: SubstrateType[] = ["SOIL", "COCO", "HYDRO", "MIX"];

export function EditPlantForm({ plant }: { plant: Plant }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(plant.name);
  const [strain, setStrain] = useState(plant.strain || "");
  const [genType, setGenType] = useState<PlantGenType>(plant.gen_type);
  const [phase, setPhase] = useState<PlantPhase>(plant.phase);
  const [substrate, setSubstrate] = useState<SubstrateType>(plant.substrate);
  const [seedBank, setSeedBank] = useState(plant.seed_bank || "");
  const [startDate, setStartDate] = useState(
    plant.start_date.split("T")[0]
  );
  const [notes, setNotes] = useState(plant.notes || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nome da planta e obrigatorio.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("plants")
      .update({
        name: name.trim(),
        strain: strain.trim() || null,
        gen_type: genType,
        phase,
        substrate,
        seed_bank: seedBank.trim() || null,
        start_date: startDate,
        notes: notes.trim() || null,
      })
      .eq("id", plant.id);

    if (updateError) {
      setError("Erro ao atualizar planta. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push(`/plants/${plant.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      {error && (
        <div className="bg-grow-danger/10 border border-grow-danger/20 rounded-2xl p-3 mb-2">
          <p className="text-xs text-grow-danger font-semibold">{error}</p>
        </div>
      )}

      <div className="field">
        <label htmlFor="name">Nome da planta *</label>
        <input
          id="name"
          type="text"
          placeholder="Ex: Northern Lights #1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="strain">Strain</label>
        <input
          id="strain"
          type="text"
          placeholder="Ex: Northern Lights"
          value={strain}
          onChange={(e) => setStrain(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="genType">Genetica</label>
        <select
          id="genType"
          value={genType}
          onChange={(e) => setGenType(e.target.value as PlantGenType)}
        >
          {GEN_OPTIONS.map((g) => (
            <option key={g} value={g}>
              {PLANT_GENETICS[g].label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="phase">Fase atual</label>
        <select
          id="phase"
          value={phase}
          onChange={(e) => setPhase(e.target.value as PlantPhase)}
        >
          {ALL_PHASES.map((p) => (
            <option key={p} value={p}>
              {PLANT_PHASES[p].label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="substrate">Substrato</label>
        <select
          id="substrate"
          value={substrate}
          onChange={(e) => setSubstrate(e.target.value as SubstrateType)}
        >
          {SUBSTRATE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {SUBSTRATES[s].label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="seedBank">Banco de sementes</label>
        <input
          id="seedBank"
          type="text"
          placeholder="Ex: Royal Queen Seeds"
          value={seedBank}
          onChange={(e) => setSeedBank(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="startDate">Data de inicio</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="notes">Notas</label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Observacoes sobre a planta..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-ghost flex-1"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="text-xs">Salvando...</span>
          ) : (
            <span>Salvar</span>
          )}
        </button>
      </div>
    </form>
  );
}
