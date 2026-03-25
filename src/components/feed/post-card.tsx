"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Post } from "@/types/database";

interface PostCardProps {
  post: Post & {
    author_name: string | null;
    author_avatar: string | null;
    liked_by_me: boolean;
  };
  currentUserId: string;
  onDelete?: (postId: string) => void;
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "agora";
  if (diffMins < 60) return `${diffMins}min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function PostCard({ post, currentUserId, onDelete }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = post.user_id === currentUserId;
  const initial = post.author_name?.[0]?.toUpperCase() || "?";

  async function toggleLike() {
    if (liking) return;
    setLiking(true);

    const supabase = createClient();

    if (liked) {
      // Unlike
      setLiked(false);
      setLikesCount((c) => Math.max(0, c - 1));

      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", currentUserId);

      if (error) {
        setLiked(true);
        setLikesCount((c) => c + 1);
        toast.error("Erro ao descurtir.");
      }
    } else {
      // Like
      setLiked(true);
      setLikesCount((c) => c + 1);

      const { error } = await supabase
        .from("post_likes")
        .insert({ post_id: post.id, user_id: currentUserId });

      if (error) {
        setLiked(false);
        setLikesCount((c) => Math.max(0, c - 1));
        toast.error("Erro ao curtir.");
      }
    }

    setLiking(false);
  }

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);

    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", post.id);

    if (error) {
      toast.error("Erro ao deletar post.");
      setDeleting(false);
      return;
    }

    toast.success("Post deletado.");
    onDelete?.(post.id);
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-9 h-9 rounded-xl bg-grow-primary/10 border border-grow-primary/20 flex items-center justify-center text-xs font-bold text-grow-primary flex-shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-bold text-grow-text truncate">
            {post.author_name || "Grower anonimo"}
          </div>
          <div className="text-[10px] text-grow-muted font-semibold">
            {timeAgo(post.created_at)}
          </div>
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-[10px] text-grow-muted hover:text-grow-danger font-bold transition-colors px-1"
          >
            {deleting ? "..." : "Excluir"}
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-[13px] text-grow-text leading-relaxed whitespace-pre-wrap mb-2">
        {post.content}
      </p>

      {/* Photo */}
      {post.photo_url && (
        <div className="mb-2.5 rounded-xl overflow-hidden border border-grow-border">
          <img
            src={post.photo_url}
            alt="Foto do post"
            className="w-full max-h-80 object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-1 border-t border-grow-border">
        <button
          onClick={toggleLike}
          disabled={liking}
          className={`flex items-center gap-1.5 py-1.5 transition-colors ${
            liked
              ? "text-rose-400"
              : "text-grow-muted hover:text-rose-400"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="text-[11px] font-bold">
            {likesCount > 0 ? likesCount : ""}
          </span>
        </button>
      </div>
    </div>
  );
}
