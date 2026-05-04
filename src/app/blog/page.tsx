import { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = {
  title: "Блог",
  description: "Все записи блога.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-white">Блог</h1>
      <p className="mt-2 text-gray-400">Все записи: от личных заметок до технических разборов.</p>

      {posts.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">Пока нет записей.</p>
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
