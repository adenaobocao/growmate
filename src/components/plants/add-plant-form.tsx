"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import type { PlantPhase, PlantGenType, SubstrateType } from "@/types/database";
import { PLANT_PHASES, PLANT_GENETICS, SUBSTRATES } from "@/lib/constants";

const STARTING_PHASES: PlantPhase[] = ["GERM", "SEEDLING", "VEG", "FLOWER"];
const GEN_OPTIONS: PlantGenType[] = ["FEM", "AUTO", "PHOTO", "REGULAR"];
const SUBSTRATE_OPTIONS: SubstrateType[] = ["SOIL", "COCO", "HYDRO", "MIX"];

function todayISO() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export function AddPlantForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [strain, setStrain] = useState("");
  const [genType, setGenType] = useState<PlantGenType>("FEM");
  const [phase, setPhase] = useState<PlantPhase>("GERM");
  const [substrate, setSubstrate] = useState<SubstrateType>("SOIL");
  const [seedBank, setSeedBank] = useState("");
  const [startDate, setStartDate] = useState(todayISO());
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nome da planta e obrigatorio.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Voce precisa estar logado.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("plants").insert({
      user_id: user.id,
      name: name.trim(),
      strain: strain.trim() || null,
      gen_type: genType,
      phase,
      substrate,
      seed_bank: seedBank.trim() || null,
      start_date: startDate,
      notes: notes.trim() || null,
      health: 100,
      archived: false,
    });

    if (insertError) {
      toast.error("Erro ao criar planta.");
      setLoading(false);
      return;
    }

    toast.success("Planta criada!");
    router.push("/plants");
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
          {STARTING_PHASES.map((p) => (
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

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2"><Spinner size="sm" /> Criando...</span>
          ) : (
            <>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Adicionar planta</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
