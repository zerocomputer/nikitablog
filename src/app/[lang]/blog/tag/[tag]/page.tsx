import type { Metadata } from "next";
import Link from "next/link";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  params: Promise<{ lang: string; tag: string }>;
};

export async function generateStaticParams() {
  const tags = getAllTags();
  const params: { lang: string; tag: string }[] = [];
  for (const lang of locales) {
    for (const tag of tags) {
      params.push({ lang, tag: encodeURIComponent(tag) });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag, lang } = await params;
  const decodedTag = decodeURIComponent(tag);
  const dict = await getDictionary(lang as Locale);
  return {
    title: `#${decodedTag} — ${dict.site.title}`,
    description: `${dict.blog.filteredByTag} #${decodedTag}.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag, lang } = await params;
  const decodedTag = decodeURIComponent(tag);
  const allPosts = getPostsByTag(decodedTag);
  const posts = allPosts.filter((p) => p.language === lang);
  const dict = await getDictionary(lang as Locale);

  if (posts.length === 0) notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-blue-400 transition-colors mb-4"
        >
          {dict.blog.backToBlog}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          #<span className="text-blue-400">{decodedTag}</span>
        </h1>
        <p className="mt-2 text-gray-400">
          {posts.length}{" "}
          {lang === "en"
            ? posts.length === 1 ? "post" : "posts"
            : posts.length === 1 ? "запись" : "записей"}
          {" "}
          {lang === "en" ? "with this tag" : "с этим тегом"}.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} lang={lang} />
        ))}
      </div>
    </div>
  );
}
