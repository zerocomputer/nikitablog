import type { Metadata } from "next";
import Link from "next/link";
import { getPostsByLanguage } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = {
  title: "Blog — English",
  description: "Blog posts in English.",
  alternates: {
    languages: {
      ru: "/blog/ru",
      en: "/blog/en",
    },
  },
};

export default function BlogEnPage() {
  const posts = getPostsByLanguage("en");

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          zero<span className="text-blue-400">/dev</span>
          <span className="ml-2 text-lg font-normal text-gray-500">🇬🇧 English</span>
        </h1>
        <p className="mt-2 text-gray-400">
          Posts in English about AI tools, development, and technology.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <Link
          href="/blog"
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-[#1a1a22] text-gray-400 border border-zinc-800 hover:text-blue-400 transition-colors"
        >
          Все / All
        </Link>
        <Link
          href="/blog/ru"
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-[#1a1a22] text-gray-400 border border-zinc-800 hover:text-blue-400 transition-colors"
        >
          🇷🇺 Русский
        </Link>
        <Link
          href="/blog/en"
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20"
        >
          🇬🇧 English
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">
          No posts in English yet.
        </p>
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
