"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/subscription/portal", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao abrir portal.");
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Erro ao abrir portal de assinatura.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-[11px] font-bold text-grow-primary hover:text-grow-primary/80 flex items-center gap-1.5 transition-colors"
    >
      {loading ? (
        <>
          <Spinner size="sm" /> Abrindo...
        </>
      ) : (
        "Gerenciar assinatura"
      )}
    </button>
  );
}
