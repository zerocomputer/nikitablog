import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const ogImage = post.coverImage
    ? [{ url: post.coverImage, width: 1200, height: 630 }]
    : [];

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      images: ogImage,
    },
    alternates: {
      languages: {
        ru: `/blog/ru/${post.slug}`,
        en: `/blog/en/${post.slug}`,
      },
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const isEnglish = post.language === "en";

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-400 transition-colors mb-8"
      >
        ← {isEnglish ? "Back to blog" : "Назад к блогу"}
      </Link>

      {/* Cover image */}
      {post.coverImage && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto object-cover"
            loading="eager"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <time className="text-xs text-gray-500 uppercase tracking-wide">
            {new Date(post.date).toLocaleDateString(
              isEnglish ? "en-US" : "ru-RU",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </time>
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded ${
              isEnglish
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
            }`}
          >
            {isEnglish ? "🇬🇧 EN" : "🇷🇺 RU"}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          {post.title}
        </h1>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="inline-block px-2 py-0.5 text-xs font-medium bg-zinc-800 text-gray-400 rounded-md hover:bg-zinc-700 hover:text-gray-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div
        className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-blue-400 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Language switcher hint */}
      <div className="mt-12 pt-6 border-t border-zinc-800">
        {isEnglish ? (
          <p className="text-sm text-gray-500">
            This post is available in{" "}
            <Link
              href={`/blog/ru/${slug}`}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              🇷🇺 Russian
            </Link>
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Этот пост доступен на{" "}
            <Link
              href={`/blog/en/${slug}`}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              🇬🇧 English
            </Link>
          </p>
        )}
      </div>
    </article>
  );
}
