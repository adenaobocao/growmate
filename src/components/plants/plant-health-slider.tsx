"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getHealthColor } from "@/lib/constants";

export function PlantHealthSlider({
  plantId,
  currentHealth,
}: {
  plantId: string;
  currentHealth: number;
}) {
  const router = useRouter();
  const [health, setHealth] = useState(currentHealth);
  const [saving, setSaving] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const healthColor = getHealthColor(health);

  function handleChange(value: number) {
    setHealth(value);

    // Debounce save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveHealth(value);
    }, 600);
  }

  async function saveHealth(value: number) {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("plants")
      .update({ health: value })
      .eq("id", plantId);

    if (error) {
      alert("Erro ao atualizar saude.");
      setHealth(currentHealth);
    } else {
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold" style={{ color: healthColor }}>
          {health}%
        </span>
        {saving && (
          <span className="text-[9px] text-grow-muted font-semibold animate-pulse">
            Salvando...
          </span>
        )}
      </div>

      <div className="relative">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={health}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${healthColor} 0%, ${healthColor} ${health}%, rgb(var(--color-tint)) ${health}%, rgb(var(--color-tint)) 100%)`,
            WebkitAppearance: "none",
          }}
        />
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${healthColor};
          box-shadow: 0 0 10px ${healthColor}60, 0 2px 6px rgba(0,0,0,0.4);
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${healthColor};
          box-shadow: 0 0 10px ${healthColor}60, 0 2px 6px rgba(0,0,0,0.4);
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
