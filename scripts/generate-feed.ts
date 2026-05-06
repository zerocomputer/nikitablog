/**
 * RSS/Atom feed generator.
 *
 * Run at build time via `next build` hook or manually.
 * Generates `public/feed.xml` and `public/feed.json`.
 *
 * Usage:
 *   npx tsx scripts/generate-feed.ts
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SITE_URL = "https://zerocomputer.ru";
const SITE_TITLE = "zero/dev — Блог Никиты Сарычева";
const SITE_DESCRIPTION = "Блог про AI-инструменты, разработку и технологии.";
const AUTHOR_NAME = "Никита Сарычев";
const AUTHOR_EMAIL = "zerocomputer@yandex.ru";

const postsDir = path.join(process.cwd(), "content", "posts");
const publicDir = path.join(process.cwd(), "public");

interface FeedPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  language: string;
  content: string;
}

function getAllFeedPosts(): FeedPost[] {
  const files = fs.readdirSync(postsDir);
  const posts: FeedPost[] = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    try {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const { data, content } = matter(raw);
      const published = data.published !== false;

      if (!published) continue;

      posts.push({
        slug: file.replace(/\.md$/, ""),
        title: data.title ?? "Untitled",
        date: data.date ?? "",
        excerpt: data.excerpt ?? "",
        tags: data.tags ?? [],
        language: data.language ?? "ru",
        content: content.trim(),
      });
    } catch {
      // skip problematic files
    }
  }

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateAtomFeed(posts: FeedPost[]): string {
  const updated = posts.length > 0 ? posts[0].date : new Date().toISOString();

  const entries = posts
    .map(
      (post) => `
  <entry>
    <id>${SITE_URL}/blog/${post.slug}</id>
    <title>${escapeXml(post.title)}</title>
    <link href="${SITE_URL}/blog/${post.slug}" rel="alternate" />
    <published>${new Date(post.date).toISOString()}</published>
    <updated>${new Date(post.date).toISOString()}</updated>
    <summary type="html">${escapeXml(post.excerpt)}</summary>
    <author>
      <name>${escapeXml(AUTHOR_NAME)}</name>
      <email>${AUTHOR_EMAIL}</email>
    </author>
    ${post.tags.map((tag) => `<category term="${escapeXml(tag)}" />`).join("\n    ")}
  </entry>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_TITLE)}</title>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
  <link href="${SITE_URL}/feed.xml" rel="self" />
  <link href="${SITE_URL}" rel="alternate" />
  <updated>${new Date(updated).toISOString()}</updated>
  <id>${SITE_URL}/</id>
  <author>
    <name>${escapeXml(AUTHOR_NAME)}</name>
    <email>${AUTHOR_EMAIL}</email>
  </author>
  ${entries}
</feed>`;
}

function generateRssFeed(posts: FeedPost[]): string {
  const updated = posts.length > 0 ? posts[0].date : new Date().toISOString();

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ru</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}

function generateJsonFeed(posts: FeedPost[]): string {
  const items = posts.map((post) => ({
    id: `${SITE_URL}/blog/${post.slug}`,
    url: `${SITE_URL}/blog/${post.slug}`,
    title: post.title,
    content_text: post.excerpt,
    summary: post.excerpt,
    date_published: new Date(post.date).toISOString(),
    tags: post.tags,
    _language: post.language,
  }));

  return JSON.stringify(
    {
      version: "https://jsonfeed.org/version/1.1",
      title: SITE_TITLE,
      home_page_url: SITE_URL,
      feed_url: `${SITE_URL}/feed.json`,
      description: SITE_DESCRIPTION,
      author: {
        name: AUTHOR_NAME,
        url: `https://github.com/zerocomputer`,
      },
      items,
    },
    null,
    2
  );
}

// —— Main ——

const posts = getAllFeedPosts();

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Atom
fs.writeFileSync(path.join(publicDir, "feed.xml"), generateAtomFeed(posts), "utf-8");
console.log("✓ Generated public/feed.xml");

// RSS 2.0
fs.writeFileSync(path.join(publicDir, "rss.xml"), generateRssFeed(posts), "utf-8");
console.log("✓ Generated public/rss.xml");

// JSON Feed
fs.writeFileSync(path.join(publicDir, "feed.json"), generateJsonFeed(posts), "utf-8");
console.log("✓ Generated public/feed.json");

console.log(`\nFeed includes ${posts.length} posts.`);
