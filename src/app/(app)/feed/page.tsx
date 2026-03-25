import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FeedList } from "@/components/feed/feed-list";
import type { Post } from "@/types/database";

export default async function FeedPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch posts with author profile
  const { data: rawPosts } = await supabase
    .from("posts")
    .select("*, profiles:user_id(name, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(50);

  // Fetch user's likes to know which posts they liked
  const { data: userLikes } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("user_id", user!.id);

  const likedPostIds = new Set((userLikes || []).map((l: { post_id: string }) => l.post_id));

  type RawPost = Post & { profiles: { name: string | null; avatar_url: string | null } | null };

  const posts = ((rawPosts as RawPost[]) || []).map((p) => ({
    id: p.id,
    user_id: p.user_id,
    content: p.content,
    photo_url: p.photo_url,
    likes_count: p.likes_count,
    created_at: p.created_at,
    author_name: p.profiles?.name || null,
    author_avatar: p.profiles?.avatar_url || null,
    liked_by_me: likedPostIds.has(p.id),
  }));

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="px-4 py-4 pb-24">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] text-grow-muted font-bold uppercase tracking-wider">
            comunidade
          </div>
          <Link
            href="/feed/new"
            className="btn-primary px-3 py-1.5 text-[10px] flex items-center gap-1.5 no-underline"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Novo post
          </Link>
        </div>

        <FeedList initialPosts={posts} currentUserId={user!.id} />
      </div>
    </div>
  );
}
