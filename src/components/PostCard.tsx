import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block p-6 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all"
    >
      <article>
        <time className="text-xs text-gray-400 uppercase tracking-wide">
          {new Date(post.date).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h2 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-50 text-gray-500 rounded-full"
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
