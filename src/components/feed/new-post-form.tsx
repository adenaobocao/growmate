"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export function NewPostForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

    if (!content.trim()) {
      toast.error("Escreva algo no post.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    let photoUrl: string | null = null;

    if (photoFile) {
      setUploading(true);
      const ext = photoFile.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `feed/${fileName}`;

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

    const { error: insertError } = await supabase.from("posts").insert({
      content: content.trim(),
      photo_url: photoUrl,
    });

    if (insertError) {
      toast.error("Erro ao publicar.");
      setLoading(false);
      return;
    }

    toast.success("Post publicado!");
    router.push("/feed");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Content */}
      <div className="field">
        <label htmlFor="postContent">O que esta acontecendo no seu grow?</label>
        <textarea
          id="postContent"
          rows={4}
          placeholder="Compartilhe com a comunidade..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1500}
          autoFocus
        />
        <div className="flex justify-end mt-0.5">
          <span
            className={`text-[9px] font-bold ${
              content.length > 1300 ? "text-grow-danger" : "text-grow-muted"
            }`}
          >
            {content.length}/1500
          </span>
        </div>
      </div>

      {/* Photo */}
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
            className="w-full h-24 rounded-xl border-2 border-dashed border-grow-border hover:border-grow-primary/30 flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <svg
              width="22"
              height="22"
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
              Adicionar foto (max 5MB)
            </span>
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
      <div className="pt-1">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              {uploading ? "Enviando foto..." : "Publicando..."}
            </span>
          ) : (
            "Publicar"
          )}
        </button>
      </div>
    </form>
  );
}
