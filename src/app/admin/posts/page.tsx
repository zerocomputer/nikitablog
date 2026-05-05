"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { listPosts, getPost } from "@/lib/github-admin";
import matter from "gray-matter";

interface PostItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export default function AdminPosts() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) {
      router.push("/admin");
      return;
    }

    loadPosts(token);
  }, [router]);

  async function loadPosts(token: string) {
    try {
      const files = await listPosts(token);

      const parsed: PostItem[] = [];

      for (const file of files) {
        const slug = file.name.replace(/\.md$/, "");
        const data = await getPost(token, slug);

        if (data) {
          const { data: frontmatter } = matter(data.content);
          parsed.push({
            slug,
            title: frontmatter.title ?? slug,
            date: frontmatter.date ?? "",
            excerpt: frontmatter.excerpt ?? "",
            tags: frontmatter.tags ?? [],
          });
        }
      }

      parsed.sort((a, b) => (a.date > b.date ? -1 : 1));
      setPosts(parsed);
    } catch (err) {
      setError("Не удалось загрузить посты");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleNewPost = () => {
    const slug = prompt("Введите slug для нового поста (латиница, без .md):");
    if (slug && slug.trim()) {
      router.push(`/admin/posts/edit?slug=${slug.trim()}&new=true`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Посты</h1>
        <button
          onClick={handleNewPost}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          + Новый пост
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-gray-500 text-center py-16">
          Постов пока нет
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/admin/posts/edit?slug=${post.slug}`}
              className="group block p-5 rounded-2xl bg-[#1a1a22] border border-zinc-800 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-1 text-sm text-gray-400 line-clamp-1">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                {post.date && (
                  <time className="shrink-0 text-xs text-gray-500">
                    {new Date(post.date).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                )}
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-0.5 text-xs font-medium bg-zinc-800 text-gray-400 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
