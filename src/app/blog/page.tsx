import { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = {
  title: "Блог",
  description: "Все посты блога Никиты — жизнь, проекты, технологии.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Блог
      </h1>
      <p className="mt-2 text-gray-600">
        Все посты: от личных заметок до технических разборов.
      </p>

      {posts.length === 0 ? (
        <p className="mt-12 text-center text-gray-400">Пока нет постов.</p>
      ) : (
        <div className="mt-8 grid gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
