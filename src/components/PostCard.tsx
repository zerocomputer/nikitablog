import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

type Props = {
  post: PostMeta;
  lang: string;
};

const LANG_LABELS: Record<string, { label: string; flag: string }> = {
  ru: { label: "RU", flag: "🇷🇺" },
  en: { label: "EN", flag: "🇬🇧" },
};

export default function PostCard({ post, lang }: Props) {
  const langInfo = LANG_LABELS[post.language] ?? { label: post.language.toUpperCase(), flag: "" };

  return (
    <Link
      href={`/${lang}/blog/${post.slug}`}
      className="group block rounded-2xl bg-[#1a1a22] border border-zinc-800 hover:border-blue-500/50 hover:bg-[#1f1f2a] transition-all overflow-hidden"
    >
      {/* Cover image */}
      {post.coverImage && (
        <div className="relative aspect-[16/9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <article className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <time className="text-xs text-gray-500 uppercase tracking-wide">
            {new Date(post.date).toLocaleDateString(
              post.language === "en" ? "en-US" : "ru-RU",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </time>
          {/* Language badge */}
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded ${
              post.language === "en"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
            }`}
          >
            {langInfo.flag && <span>{langInfo.flag}</span>}
            {langInfo.label}
          </span>
        </div>

        <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
          {post.title}
        </h2>

        <p className="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 text-xs font-medium bg-zinc-800 text-gray-400 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
