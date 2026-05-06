import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getPostsByTag, getAllTags } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `#${decodedTag} — zero/dev`,
    description: `Записи блога по тегу #${decodedTag}.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  if (posts.length === 0) notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-gray-500 hover:text-blue-400 transition-colors mb-4"
        >
          ← Назад к блогу
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          #<span className="text-blue-400">{decodedTag}</span>
        </h1>
        <p className="mt-2 text-gray-400">
          {posts.length}{" "}
          {posts.length === 1 ? "запись" : "записей"} с этим тегом.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
