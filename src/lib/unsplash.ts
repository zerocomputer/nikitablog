/**
 * Unsplash image search utility.
 *
 * Uses the public-access Unsplash API (no auth required for search).
 * Rate limit: 50 requests/hour.
 * At build time we only request one image URL per post, so this is fine for
 * a small blog with a few dozen posts.
 *
 * If the API is unavailable or the rate limit is hit, we return a fallback
 * gradient-based placeholder.
 */

export interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;   // 1080px
    small: string;     // 400px
    thumb: string;     // 200px
  };
  alt_description: string | null;
  user: {
    name: string;
    links: { html: string };
  };
  links: {
    html: string;
  };
}

const UNSPLASH_API = "https://api.unsplash.com";
const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY ?? "";

/**
 * Search for a photo on Unsplash and return the best match.
 *
 * @param query - Search terms (e.g. "AI programming books")
 * @param orientation - "landscape", "portrait", or undefined
 */
export async function searchCoverImage(
  query: string,
  orientation?: "landscape" | "portrait"
): Promise<UnsplashPhoto | null> {
  if (!ACCESS_KEY) {
    console.warn(
      "[unsplash] NEXT_PUBLIC_UNSPLASH_ACCESS_KEY not set – skipping search"
    );
    return null;
  }

  const params = new URLSearchParams({
    query,
    per_page: "1",
    ...(orientation ? { orientation } : {}),
  });

  try {
    const res = await fetch(
      `${UNSPLASH_API}/search/photos?${params.toString()}`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      }
    );

    if (!res.ok) {
      console.warn(
        `[unsplash] API error ${res.status}: ${res.statusText}`
      );
      return null;
    }

    const json = await res.json();
    if (!json.results || json.results.length === 0) return null;

    return json.results[0] as UnsplashPhoto;
  } catch (err) {
    console.warn("[unsplash] fetch error:", err);
    return null;
  }
}

/**
 * Build a fallback gradient style string when no cover image is available.
 */
export function fallbackGradient(index: number = 0): string {
  const gradients = [
    "linear-gradient(135deg, #1a1a2e, #16213e)",
    "linear-gradient(135deg, #0f3460, #533483)",
    "linear-gradient(135deg, #2d2d44, #1a1a2e)",
    "linear-gradient(135deg, #1b2838, #2a3f54)",
    "linear-gradient(135deg, #2c1b4d, #1a1a2e)",
  ];
  return gradients[index % gradients.length];
}

/**
 * Generate a search-friendly query from a post's tags and title.
 */
export function buildCoverQuery(title: string, tags: string[]): string {
  // Try tags first (more specific), fall back to title
  const keywords = tags.length > 0 ? tags : title.split(" ").slice(0, 3);
  return keywords.join(" ");
}
