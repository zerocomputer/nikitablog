import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://zerocomputer.ru";
  const entries: MetadataRoute.Sitemap = [];

  // Root pages per language
  for (const lang of ["ru", "en"] as const) {
    entries.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1.0,
    });

    // Blog listing
    entries.push({
      url: `${baseUrl}/${lang}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    });

    // Projects listing
    entries.push({
      url: `${baseUrl}/${lang}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });

    // Blog posts for this language
    const posts = getAllPosts().filter((p) => p.language === lang);
    for (const post of posts) {
      entries.push({
        url: `${baseUrl}/${lang}/blog/${post.slug.replace(/\.en$/, "")}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });

      // Tag pages for this post's tags
      for (const tag of post.tags || []) {
        entries.push({
          url: `${baseUrl}/${lang}/blog/tag/${encodeURIComponent(tag)}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.4,
        });
      }
    }
  }

  // Projects slug pages
  const projects = [
    "sources-admission",
    "yes-crm",
    "messenger",
    "nikitablog",
  ];
  for (const lang of ["ru", "en"] as const) {
    for (const slug of projects) {
      entries.push({
        url: `${baseUrl}/${lang}/projects/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
  }

  return entries;
}
