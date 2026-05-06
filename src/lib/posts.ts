import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  language: "ru" | "en";
  coverImage: string;
  published: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

/**
 * Read a single post file and return its parsed frontmatter + content.
 * Returns null if the file does not exist or parsing fails.
 */
function readPostFile(fileName: string): {
  slug: string;
  data: Record<string, unknown>;
  content: string;
} | null {
  try {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(fileContents);
    return { slug, data: data as Record<string, unknown>, content };
  } catch {
    return null;
  }
}

/**
 * Normalise a raw post record into a PostMeta.
 */
function toPostMeta(
  slug: string,
  data: Record<string, unknown>
): PostMeta {
  return {
    slug,
    title: (data.title as string) ?? "Untitled",
    date: (data.date as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    language: (data.language as "ru" | "en") ?? "ru",
    coverImage: (data.coverImage as string) ?? "",
    published: (data.published as boolean) ?? true,
  };
}

/**
 * Get all published posts sorted by date (newest first).
 */
export function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts: PostMeta[] = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith(".md")) continue;
    const result = readPostFile(fileName);
    if (!result) continue;
    const meta = toPostMeta(result.slug, result.data);
    if (!meta.published) continue;
    allPosts.push(meta);
  }

  return allPosts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

/**
 * Get posts filtered by language.
 */
export function getPostsByLanguage(language: "ru" | "en"): PostMeta[] {
  return getAllPosts().filter((p) => p.language === language);
}

/**
 * Get posts filtered by tag (case-insensitive).
 */
export function getPostsByTag(tag: string): PostMeta[] {
  const lowerTag = tag.toLowerCase();
  return getAllPosts().filter((p) =>
    p.tags.some((t) => t.toLowerCase() === lowerTag)
  );
}

/**
 * Get a single post by slug.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const result = readPostFile(`${slug}.md`);
  if (!result) return null;

  const meta = toPostMeta(result.slug, result.data);
  if (!meta.published) return null;

  const processedContent = await remark().use(html).process(result.content);
  const contentHtml = processedContent.toString();

  return { ...meta, content: contentHtml };
}

/**
 * Get all unique tags across published posts.
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

/**
 * Check if a post has a sibling (same base slug, different language).
 */
export function getSiblingPost(
  slug: string,
  language: "ru" | "en"
): PostMeta | null {
  // Try to find: base name without language suffix, then the other language
  // Convention: hello-world.ru.md or hello-world.en.md
  // OR we use a "slug-group" concept
  // Simpler approach: find post by exact slug and return sibling by language code

  const current = getAllPosts().find((p) => p.slug === slug);
  if (!current) return null;
  if (current.language === language) return current;

  // Try to find the sibling with the same title prefix
  // For simplicity, return null — the frontend will generate the link
  return null;
}
