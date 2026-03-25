"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import type { Setup, GrowType } from "@/types/database";

const GROW_TYPES: { value: GrowType; label: string }[] = [
  { value: "INDOOR", label: "Indoor" },
  { value: "OUTDOOR", label: "Outdoor" },
  { value: "GREENHOUSE", label: "Greenhouse" },
];

interface SetupFormProps {
  setup?: Setup;
}

export function SetupForm({ setup }: SetupFormProps) {
  const router = useRouter();
  const isEdit = !!setup;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(setup?.name || "Meu Grow");
  const [growType, setGrowType] = useState<GrowType>(setup?.grow_type || "INDOOR");
  const [city, setCity] = useState(setup?.city || "");
  const [state, setState] = useState(setup?.state || "");
  const [tentType, setTentType] = useState(setup?.tent_type || "");
  const [tentWidth, setTentWidth] = useState<number | "">(setup?.tent_width_cm ?? "");
  const [tentDepth, setTentDepth] = useState<number | "">(setup?.tent_depth_cm ?? "");
  const [tentHeight, setTentHeight] = useState<number | "">(setup?.tent_height_cm ?? "");
  const [tentBrand, setTentBrand] = useState(setup?.tent_brand || "");
  const [maxPlants, setMaxPlants] = useState<number>(setup?.max_plants ?? 4);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nome do grow e obrigatorio.");
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

    const payload = {
      name: name.trim(),
      grow_type: growType,
      city: city.trim() || null,
      state: state.trim() || null,
      country: "BR",
      tent_type: tentType.trim() || null,
      tent_width_cm: tentWidth || null,
      tent_depth_cm: tentDepth || null,
      tent_height_cm: tentHeight || null,
      tent_brand: tentBrand.trim() || null,
      max_plants: maxPlants || null,
    };

    if (isEdit) {
      const { error: updateError } = await supabase
        .from("setups")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", setup.id);

      if (updateError) {
        toast.error("Erro ao atualizar setup.");
        setLoading(false);
        return;
      }

      toast.success("Setup atualizado!");
      router.push(`/setup/${setup.id}`);
      router.refresh();
    } else {
      const { data, error: insertError } = await supabase
        .from("setups")
        .insert({ ...payload, user_id: user.id })
        .select("id")
        .single();

      if (insertError || !data) {
        toast.error("Erro ao criar setup.");
        setLoading(false);
        return;
      }

      toast.success("Setup criado!");
      router.push(`/setup/${data.id}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      {error && (
        <div className="bg-grow-danger/10 border border-grow-danger/20 rounded-2xl p-3 mb-2">
          <p className="text-xs text-grow-danger font-semibold">{error}</p>
        </div>
      )}

      <div className="field">
        <label htmlFor="name">Nome do grow *</label>
        <input
          id="name"
          type="text"
          placeholder="Ex: Meu Grow"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="growType">Tipo de cultivo</label>
        <select
          id="growType"
          value={growType}
          onChange={(e) => setGrowType(e.target.value as GrowType)}
        >
          {GROW_TYPES.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-2">
          <div className="field">
            <label htmlFor="city">Cidade</label>
            <input
              id="city"
              type="text"
              placeholder="Ex: Curitiba"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="state">Estado</label>
            <input
              id="state"
              type="text"
              placeholder="Ex: PR"
              maxLength={2}
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
            />
          </div>
        </div>
        <p className="text-[10px] text-grow-muted/70 font-medium mt-1 leading-relaxed">
          Opcional. Usamos sua cidade para consultar dados meteorologicos (temperatura, umidade) e dar recomendacoes mais precisas para o seu cultivo.
        </p>
      </div>

      <div className="field">
        <label htmlFor="tentType">Tipo de tenda</label>
        <input
          id="tentType"
          type="text"
          placeholder="Ex: Grow tent 80x80x160"
          value={tentType}
          onChange={(e) => setTentType(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Dimensoes (cm)</label>
        <div className="grid grid-cols-3 gap-2 mt-1.5">
          <div>
            <input
              type="number"
              placeholder="Largura"
              value={tentWidth}
              onChange={(e) => setTentWidth(e.target.value ? Number(e.target.value) : "")}
              min={0}
              className="text-center"
            />
            <span className="block text-[8px] text-grow-muted font-semibold text-center mt-0.5">
              Largura
            </span>
          </div>
          <div>
            <input
              type="number"
              placeholder="Prof."
              value={tentDepth}
              onChange={(e) => setTentDepth(e.target.value ? Number(e.target.value) : "")}
              min={0}
              className="text-center"
            />
            <span className="block text-[8px] text-grow-muted font-semibold text-center mt-0.5">
              Profundidade
            </span>
          </div>
          <div>
            <input
              type="number"
              placeholder="Altura"
              value={tentHeight}
              onChange={(e) => setTentHeight(e.target.value ? Number(e.target.value) : "")}
              min={0}
              className="text-center"
            />
            <span className="block text-[8px] text-grow-muted font-semibold text-center mt-0.5">
              Altura
            </span>
          </div>
        </div>
      </div>

      <div className="field">
        <label htmlFor="tentBrand">Marca da tenda</label>
        <input
          id="tentBrand"
          type="text"
          placeholder="Ex: Mars Hydro, Spider Farmer..."
          value={tentBrand}
          onChange={(e) => setTentBrand(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="maxPlants">Max plantas</label>
        <input
          id="maxPlants"
          type="number"
          placeholder="4"
          value={maxPlants}
          onChange={(e) => setMaxPlants(Number(e.target.value) || 0)}
          min={1}
          max={99}
        />
      </div>

      <div className="pt-2 flex gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-ghost flex-1 flex items-center justify-center"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2"><Spinner size="sm" /> Salvando...</span>
          ) : (
            <span>{isEdit ? "Salvar alteracoes" : "Criar setup"}</span>
          )}
        </button>
      </div>
    </form>
  );
}
