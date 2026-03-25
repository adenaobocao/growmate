"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Fert } from "@/types/database";

interface FertFormProps {
  setupId: string;
  fert?: Fert;
  onCancel: () => void;
}

export function FertForm({ setupId, fert, onCancel }: FertFormProps) {
  const router = useRouter();
  const isEdit = !!fert;

  const [loading, setLoading] = useState(false);
  const { dialogProps, confirm } = useConfirmDialog();

  const [name, setName] = useState(fert?.name || "");
  const [brand, setBrand] = useState(fert?.brand || "");
  const [nValue, setNValue] = useState<number | "">(fert?.n_value ?? "");
  const [pValue, setPValue] = useState<number | "">(fert?.p_value ?? "");
  const [kValue, setKValue] = useState<number | "">(fert?.k_value ?? "");
  const [ec, setEc] = useState<number | "">(fert?.ec ?? "");
  const [ph, setPh] = useState<number | "">(fert?.ph ?? "");
  const [notes, setNotes] = useState(fert?.notes || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    const payload = {
      setup_id: setupId,
      name: name.trim() || null,
      brand: brand.trim() || null,
      n_value: nValue || null,
      p_value: pValue || null,
      k_value: kValue || null,
      ec: ec || null,
      ph: ph || null,
      notes: notes.trim() || null,
    };

    if (isEdit) {
      const { error: err } = await supabase
        .from("ferts")
        .update(payload)
        .eq("id", fert.id);
      if (err) {
        toast.error("Erro ao atualizar fertilizante.");
        setLoading(false);
        return;
      }
      toast.success("Fertilizante atualizado!");
    } else {
      const { error: err } = await supabase.from("ferts").insert(payload);
      if (err) {
        toast.error("Erro ao adicionar fertilizante.");
        setLoading(false);
        return;
      }
      toast.success("Fertilizante adicionado!");
    }

    router.refresh();
    onCancel();
  }

  async function handleDelete() {
    if (!fert) return;
    const confirmed = await confirm({
      title: "Remover fertilizante",
      description: "Tem certeza que deseja remover este fertilizante?",
      variant: "danger",
    });
    if (!confirmed) return;

    const supabase = createClient();
    const { error } = await supabase.from("ferts").delete().eq("id", fert.id);
    if (error) {
      toast.error("Erro ao remover fertilizante.");
      return;
    }
    toast.success("Fertilizante removido!");
    router.refresh();
    onCancel();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-grow-surface border border-grow-border rounded-2xl p-3 space-y-1">
      <div className="grid grid-cols-2 gap-2">
        <div className="field">
          <label htmlFor="fertName">Nome</label>
          <input id="fertName" type="text" placeholder="Ex: Bio Bloom" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="fertBrand">Marca</label>
          <input id="fertBrand" type="text" placeholder="Ex: BioBizz" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>NPK</label>
        <div className="grid grid-cols-3 gap-2 mt-1.5">
          <div>
            <input type="number" placeholder="N" value={nValue} onChange={(e) => setNValue(e.target.value ? Number(e.target.value) : "")} step="0.1" min={0} className="text-center" />
            <span className="block text-[8px] text-grow-muted font-semibold text-center mt-0.5">N</span>
          </div>
          <div>
            <input type="number" placeholder="P" value={pValue} onChange={(e) => setPValue(e.target.value ? Number(e.target.value) : "")} step="0.1" min={0} className="text-center" />
            <span className="block text-[8px] text-grow-muted font-semibold text-center mt-0.5">P</span>
          </div>
          <div>
            <input type="number" placeholder="K" value={kValue} onChange={(e) => setKValue(e.target.value ? Number(e.target.value) : "")} step="0.1" min={0} className="text-center" />
            <span className="block text-[8px] text-grow-muted font-semibold text-center mt-0.5">K</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="field">
          <label htmlFor="fertEc">EC</label>
          <input id="fertEc" type="number" placeholder="Ex: 1.4" value={ec} onChange={(e) => setEc(e.target.value ? Number(e.target.value) : "")} step="0.1" min={0} />
        </div>
        <div className="field">
          <label htmlFor="fertPh">pH</label>
          <input id="fertPh" type="number" placeholder="Ex: 6.2" value={ph} onChange={(e) => setPh(e.target.value ? Number(e.target.value) : "")} step="0.1" min={0} max={14} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="fertNotes">Notas</label>
        <textarea id="fertNotes" rows={2} placeholder="Observacoes sobre o produto..." value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} />
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
