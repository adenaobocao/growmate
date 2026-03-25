"use client";

import { useState } from "react";
import { PostCard } from "./post-card";
import type { Post } from "@/types/database";

type PostWithMeta = Post & {
  author_name: string | null;
  author_avatar: string | null;
  liked_by_me: boolean;
};

interface FeedListProps {
  initialPosts: PostWithMeta[];
  currentUserId: string;
}

export function FeedList({ initialPosts, currentUserId }: FeedListProps) {
  const [posts, setPosts] = useState(initialPosts);

  function handleDelete(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-grow-muted/40 mx-auto mb-3"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <p className="text-xs text-grow-muted font-semibold">
          Nenhum post ainda. Seja o primeiro a compartilhar!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
