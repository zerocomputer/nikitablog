import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.blog.title,
    description: dict.blog.description,
    alternates: {
      languages: {
        ru: "/ru/blog",
        en: "/en/blog",
      },
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const posts = getAllPosts().filter((p) => p.language === lang && p.published);
  const allTags = getAllTags();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        {dict.blog.title}
      </h1>
      <p className="text-gray-400 mb-8">{dict.blog.description}</p>

      {/* Tag cloud */}
      {allTags.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider mr-1 self-center">
            {dict.blog.tags}:
          </span>
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/${lang}/blog/tag/${encodeURIComponent(tag)}`}
              className="px-2.5 py-1 text-xs font-medium bg-zinc-800 text-gray-400 rounded-full hover:bg-zinc-700 hover:text-gray-200 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Posts grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} lang={lang} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-gray-500 text-center py-20">{dict.blog.noPosts}</p>
      )}
    </div>
  );
}
