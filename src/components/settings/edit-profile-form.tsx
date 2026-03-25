"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface EditProfileFormProps {
  name: string | null;
  onClose: () => void;
}

export function EditProfileForm({ name: initialName, onClose }: EditProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nome e obrigatorio.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Nao autenticado.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ name: name.trim(), updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) {
      toast.error("Erro ao atualizar perfil.");
      setLoading(false);
      return;
    }

    toast.success("Perfil atualizado!");
    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-[430px] bg-grow-surface border-t border-grow-border rounded-t-3xl p-4 pb-8 animate-slide-up">
        <div className="w-10 h-1 rounded-full bg-grow-border mx-auto mb-4" />
        <h3 className="text-section-title mb-3">Editar perfil</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="field">
            <label htmlFor="profileName">Nome</label>
            <input
              id="profileName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              maxLength={50}
              autoFocus
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
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
                <span className="flex items-center gap-2">
                  <Spinner size="sm" /> Salvando...
                </span>
              ) : (
                "Salvar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
