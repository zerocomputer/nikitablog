import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block p-6 rounded-2xl bg-[#1a1a22] border border-zinc-800 hover:border-blue-500/50 hover:bg-[#1f1f2a] transition-all"
    >
      <article>
        <time className="text-xs text-gray-500 uppercase tracking-wide">
          {new Date(post.date).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h2 className="mt-2 text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
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
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
