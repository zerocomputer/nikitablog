import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://zerocomputer.ru";
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/blog/ru`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/blog/en`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/projects`, priority: 0.7, changeFrequency: "monthly" as const },
  ];

  for (const page of staticPages) {
    entries.push({
      url: page.url,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  // Blog posts
  const posts = getAllPosts();
  for (const post of posts) {
    entries.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    });
  }

  // Tag pages
  const tags = getAllTags();
  for (const tag of tags) {
    entries.push({
      url: `${baseUrl}/blog/tag/${encodeURIComponent(tag)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.4,
    });
  }

  return entries;
}
