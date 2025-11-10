export type Anime = {
  mal_id: number;
  title: string;
  year?: number | null;
  score?: number | null;
  images?: { jpg?: { image_url?: string; large_image_url?: string } };
  episodes?: number | null;
  synopsis?: string | null;
  trailer?: { url?: string | null };
};

export type SearchResponse = {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page?: number;
    items?: { count: number; total: number; per_page: number }
  }
};

export async function searchAnime(query: string, page = 1, signal?: AbortSignal): Promise<SearchResponse> {
  const q = encodeURIComponent(query.trim());
  const url = `https://api.jikan.moe/v4/anime?q=${q}&page=${page}&limit=12&sfw=true&order_by=score&sort=desc`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Search failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function getAnimeById(id: number, signal?: AbortSignal): Promise<{ data: Anime }> {
  const url = `https://api.jikan.moe/v4/anime/${id}/full`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Detail failed (${res.status}): ${text}`);
  }
  return res.json();
}
