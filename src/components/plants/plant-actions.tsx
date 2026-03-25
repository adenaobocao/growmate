"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Plant } from "@/types/database";

export function PlantActions({ plant }: { plant: Plant }) {
  const router = useRouter();
  const [archiving, setArchiving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { dialogProps, confirm } = useConfirmDialog();

  async function handleArchiveToggle() {
    setArchiving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("plants")
      .update({ archived: !plant.archived })
      .eq("id", plant.id);

    if (error) {
      toast.error("Erro ao atualizar planta.");
      setArchiving(false);
      return;
    }

    toast.success(plant.archived ? "Planta reativada!" : "Planta arquivada!");
    router.push("/plants");
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = await confirm({
      title: "Excluir planta",
      description: `Tem certeza que deseja excluir "${plant.name}"? Esta acao nao pode ser desfeita.`,
      variant: "danger",
    });
    if (!confirmed) return;

    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("plants")
      .delete()
      .eq("id", plant.id);

    if (error) {
      toast.error("Erro ao excluir planta.");
      setDeleting(false);
      return;
    }

    toast.success("Planta excluida!");
    router.push("/plants");
    router.refresh();
  }

  const isLoading = archiving || deleting;

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleArchiveToggle}
          disabled={isLoading}
          className="btn-ghost flex-1 flex items-center justify-center gap-1.5 text-[11px]"
        >
          {archiving ? (
            <Spinner size="sm" />
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {plant.archived ? (
                <>
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </>
              ) : (
                <>
                  <polyline points="21 8 21 21 3 21 3 8" />
                  <rect x="1" y="3" width="22" height="5" />
                  <line x1="10" y1="12" x2="14" y2="12" />
                </>
              )}
            </svg>
          )}
          {plant.archived ? "Reativar" : "Arquivar"}
        </button>

        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="btn-ghost flex-1 flex items-center justify-center gap-1.5 text-[11px] border-grow-danger/20 text-grow-danger hover:bg-grow-danger/10"
        >
          {deleting ? (
            <Spinner size="sm" />
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          )}
          Excluir
        </button>
      </div>
      <ConfirmDialog {...dialogProps} />
    </>
  );
}
