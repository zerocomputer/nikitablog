import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  const params: { lang: string; slug: string }[] = [];

  for (const post of posts) {
    const lang = post.language === "en" ? "en" : "ru";
    // Clean slug: strip .en suffix for EN posts
    const slug = post.slug.replace(/\.en$/, "");
    params.push({ lang, slug });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  // For EN locale, try slug.en first
  const lookupSlug = lang === "en" ? slug + ".en" : slug;
  const post = await getPostBySlug(lookupSlug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;
  const lookupSlug = lang === "en" ? slug + ".en" : slug;
  const post = await getPostBySlug(lookupSlug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      {/* Cover image */}
      {post.coverImage && (
        <div className="relative aspect-[21/9] mb-8 rounded-2xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 mb-4">
        <time className="text-sm text-gray-500">
          {new Date(post.date).toLocaleDateString(
            lang === "en" ? "en-US" : "ru-RU",
            { year: "numeric", month: "long", day: "numeric" }
          )}
        </time>
        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
          lang === "en"
            ? "bg-green-500/10 text-green-400 border border-green-500/20"
            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
        }`}>
          {lang === "en" ? "🇬🇧 EN" : "🇷🇺 RU"}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/${lang}/blog/tag/${encodeURIComponent(tag)}`}
              className="px-2.5 py-1 text-xs font-medium bg-zinc-800 text-gray-400 rounded-full hover:bg-zinc-700 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-invert prose-gray max-w-none prose-headings:text-white prose-a:text-blue-400 prose-code:text-blue-300 prose-pre:bg-[#1a1a22] prose-pre:border prose-pre:border-zinc-800"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Language switcher */}
      <div className="mt-12 pt-8 border-t border-zinc-800">
        <Link
          href={`/${lang === "en" ? "ru" : "en"}/blog/${slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 text-gray-300 text-sm rounded-xl hover:bg-zinc-700 transition-colors"
        >
          {lang === "en" ? "🇷🇺 Читать по-русски" : "🇬🇧 Read in English"}
        </Link>
      </div>

      {/* Backlink */}
      <div className="mt-8">
        <Link
          href={`/${lang}/blog`}
          className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
        >
          ← {lang === "en" ? "Back to blog" : "Назад к блогу"}
        </Link>
      </div>
    </article>
  );
}
