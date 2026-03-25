"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import type { Plant } from "@/types/database";
import { PLANT_PHASES } from "@/lib/constants";

const QUICK_TAGS = [
  "rega",
  "nutriente",
  "poda",
  "transplante",
  "praga",
  "deficiencia",
  "LST",
  "foto",
];

interface DiaryFormProps {
  plants: Plant[];
  preselectedPlantId?: string;
}

export function DiaryForm({ plants, preselectedPlantId }: DiaryFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [plantId, setPlantId] = useState(preselectedPlantId || plants[0]?.id || "");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const selectedPlant = plants.find((p) => p.id === plantId);

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function addCustomTag() {
    const t = customTag.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
    setCustomTag("");
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Foto muito grande. Maximo 5MB.");
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!plantId) {
      toast.error("Selecione uma planta.");
      return;
    }
    if (!content.trim()) {
      toast.error("Escreva algo no registro.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    let photoUrl: string | null = null;

    // Upload photo if exists
    if (photoFile) {
      setUploading(true);
      const ext = photoFile.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `diary/${plantId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, photoFile, {
          contentType: photoFile.type,
          upsert: false,
        });

      if (uploadError) {
        toast.error("Erro ao enviar foto.");
        setLoading(false);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      photoUrl = urlData.publicUrl;
      setUploading(false);
    }

    // Insert diary entry
    const { error: insertError } = await supabase.from("diary_entries").insert({
      plant_id: plantId,
      content: content.trim(),
      tags,
      photo_url: photoUrl,
      phase_at_entry: selectedPlant?.phase || null,
    });

    if (insertError) {
      toast.error("Erro ao salvar registro.");
      setLoading(false);
      return;
    }

    toast.success("Registro salvo!");
    router.push("/diary");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Plant selector */}
      <div className="field">
        <label htmlFor="plant">Planta *</label>
        <select
          id="plant"
          value={plantId}
          onChange={(e) => setPlantId(e.target.value)}
        >
          {plants.length === 0 && (
            <option value="">Nenhuma planta cadastrada</option>
          )}
          {plants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {PLANT_PHASES[p.phase].label}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="field">
        <label htmlFor="content">Registro *</label>
        <textarea
          id="content"
          rows={4}
          placeholder="O que aconteceu hoje? Rega, nutrientes, observacoes..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2000}
        />
        <div className="flex justify-end mt-0.5">
          <span
            className={`text-[9px] font-bold ${
              content.length > 1800 ? "text-grow-danger" : "text-grow-muted"
            }`}
          >
            {content.length}/2000
          </span>
        </div>
      </div>

      {/* Quick tags */}
      <div>
        <label className="text-[10px] text-grow-muted font-bold uppercase tracking-wider block mb-1.5">
          Tags
        </label>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                tags.includes(tag)
                  ? "bg-grow-primary/20 text-grow-primary border-grow-primary/30"
                  : "bg-grow-tint text-grow-muted border-grow-border hover:border-grow-primary/30"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
        {/* Custom tag */}
        <div className="flex gap-1.5 mt-2">
          <input
            type="text"
            placeholder="Tag personalizada..."
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomTag();
              }
            }}
            maxLength={20}
            className="flex-1 bg-grow-surface-alt border border-grow-border rounded-lg px-2.5 py-1.5 text-[11px] text-grow-text placeholder:text-grow-muted outline-none focus:border-grow-primary/25"
          />
          <button
            type="button"
            onClick={addCustomTag}
            disabled={!customTag.trim()}
            className="text-[10px] font-bold text-grow-primary px-2 disabled:opacity-30"
          >
            Adicionar
          </button>
        </div>
        {/* Active tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-bold text-grow-primary bg-grow-primary/10 px-2 py-0.5 rounded-md flex items-center gap-1"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="hover:text-grow-danger"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Photo upload */}
      <div>
        <label className="text-[10px] text-grow-muted font-bold uppercase tracking-wider block mb-1.5">
          Foto
        </label>
        {photoPreview ? (
          <div className="relative rounded-xl overflow-hidden border border-grow-border">
            <img
              src={photoPreview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-xs font-bold"
            >
              x
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-28 rounded-xl border-2 border-dashed border-grow-border hover:border-grow-primary/30 flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-grow-muted"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-[10px] text-grow-muted font-semibold">
              Toque para adicionar foto
            </span>
            <span className="text-[9px] text-grow-muted/60">Max 5MB</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || !plantId || !content.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              {uploading ? "Enviando foto..." : "Salvando..."}
            </span>
          ) : (
            <span>Salvar registro</span>
          )}
        </button>
      </div>
    </form>
  );
}
