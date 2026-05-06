import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = {
  title: "Блог / Blog",
  description:
    "Все записи блога: от личных заметок до технических разборов. Blog posts about development, AI tools, and life.",
  openGraph: {
    title: "zero/dev — Блог Никиты Сарычева",
    description:
      "Личный блог: разработка, AI-инструменты, жизнь и проекты.",
    type: "website",
  },
  alternates: {
    languages: {
      "ru": "/blog/ru",
      "en": "/blog/en",
    },
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          zero<span className="text-blue-400">/dev</span>
        </h1>
        <p className="mt-2 text-gray-400 max-w-xl">
          Блог про AI-инструменты, разработку и технологии. 
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Доступен на русском и английском.
        </p>
      </div>

      {/* Language tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <Link
          href="/blog"
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20"
        >
          Все / All
        </Link>
        <Link
          href="/blog/ru"
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-[#1a1a22] text-gray-400 border border-zinc-800 hover:text-blue-400 hover:border-blue-500/30 transition-colors"
        >
          🇷🇺 Русский
        </Link>
        <Link
          href="/blog/en"
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-[#1a1a22] text-gray-400 border border-zinc-800 hover:text-blue-400 hover:border-blue-500/30 transition-colors"
        >
          🇬🇧 English
        </Link>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-8 pb-6 border-b border-zinc-800">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${encodeURIComponent(tag)}`}
              className="inline-block px-2.5 py-1 text-xs font-medium bg-zinc-800 text-gray-400 rounded-md hover:bg-zinc-700 hover:text-gray-200 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Posts grid */}
      {posts.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">Пока нет записей.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
