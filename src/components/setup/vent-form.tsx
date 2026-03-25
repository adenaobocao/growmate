"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Vent } from "@/types/database";

const VENT_TYPES = [
  { value: "EXAUSTOR", label: "Exaustor" },
  { value: "CIRCULADOR", label: "Circulador" },
  { value: "INTAKE", label: "Intake" },
];

interface VentFormProps {
  setupId: string;
  vent?: Vent;
  onCancel: () => void;
}

export function VentForm({ setupId, vent, onCancel }: VentFormProps) {
  const router = useRouter();
  const isEdit = !!vent;

  const [loading, setLoading] = useState(false);
  const { dialogProps, confirm } = useConfirmDialog();

  const [type, setType] = useState(vent?.type || "EXAUSTOR");
  const [brand, setBrand] = useState(vent?.brand || "");
  const [cfm, setCfm] = useState<number | "">(vent?.cfm ?? "");
  const [hasCarbonFilter, setHasCarbonFilter] = useState(vent?.has_carbon_filter ?? false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    const payload = {
      setup_id: setupId,
      type,
      brand: brand.trim() || null,
      cfm: cfm || null,
      has_carbon_filter: hasCarbonFilter,
    };

    if (isEdit) {
      const { error: err } = await supabase
        .from("vents")
        .update(payload)
        .eq("id", vent.id);
      if (err) {
        toast.error("Erro ao atualizar ventilacao.");
        setLoading(false);
        return;
      }
      toast.success("Ventilacao atualizada!");
    } else {
      const { error: err } = await supabase.from("vents").insert(payload);
      if (err) {
        toast.error("Erro ao adicionar ventilacao.");
        setLoading(false);
        return;
      }
      toast.success("Ventilacao adicionada!");
    }

    router.refresh();
    onCancel();
  }

  async function handleDelete() {
    if (!vent) return;
    const confirmed = await confirm({
      title: "Remover ventilacao",
      description: "Tem certeza que deseja remover esta ventilacao?",
      variant: "danger",
    });
    if (!confirmed) return;

    const supabase = createClient();
    const { error } = await supabase.from("vents").delete().eq("id", vent.id);
    if (error) {
      toast.error("Erro ao remover ventilacao.");
      return;
    }
    toast.success("Ventilacao removida!");
    router.refresh();
    onCancel();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-grow-surface border border-grow-border rounded-2xl p-3 space-y-1">
      <div className="grid grid-cols-2 gap-2">
        <div className="field">
          <label htmlFor="ventType">Tipo</label>
          <select id="ventType" value={type} onChange={(e) => setType(e.target.value)}>
            {VENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ventBrand">Marca</label>
          <input id="ventBrand" type="text" placeholder="Ex: AC Infinity" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="ventCfm">CFM</label>
        <input id="ventCfm" type="number" placeholder="Ex: 200" value={cfm} onChange={(e) => setCfm(e.target.value ? Number(e.target.value) : "")} min={0} />
      </div>

      <div className="field">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasCarbonFilter}
            onChange={(e) => setHasCarbonFilter(e.target.checked)}
            className="w-4 h-4 rounded border-grow-border-strong bg-transparent accent-emerald-500 cursor-pointer"
          />
          <span className="text-[10px] text-grow-muted font-bold uppercase tracking-wider">
            Filtro de carvao
          </span>
        </label>
      </div>

      <div className="flex gap-2 pt-1">
        {isEdit && (
          <button type="button" onClick={handleDelete} className="h-9 px-3 rounded-xl border border-grow-danger/20 bg-grow-danger/5 text-grow-danger text-[10px] font-bold cursor-pointer">
            Remover
          </button>
        )}
        <button type="button" onClick={onCancel} className="btn-ghost flex-1 h-9 text-[10px]">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex-1 h-9 text-[10px]">
          {loading ? <span className="flex items-center gap-1"><Spinner size="sm" /> Salvando...</span> : isEdit ? "Salvar" : "Adicionar"}
        </button>
      </div>
      <ConfirmDialog {...dialogProps} />
    </form>
  );
}
