const BASE_URL = "https://api-consumet-ruddy.vercel.app/meta/anilist";

export interface Anime {
  id: string;
  title: string;
  image: string;
  url?: string;
  genres?: string[];
  episodeNumber?: number;
  type?: string;
  releaseDate?: string;
  subOrDub?: string;
  rating?: number;
}

export interface AnimeDetails extends Anime {
  description?: string;
  otherName?: string;
  totalEpisodes?: number;
  status?: string;
  releaseDate?: string;
  subOrDub?: string;
  recommendations?: Anime[];
  episodes?: {
    id: string;
    number: number;
    url?: string;
    isDubbed?: boolean;
    isSubbed?: boolean;
  }[];
}

async function fetchJson(endpoint: string) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

function getTitle(title: any): string {
  if (typeof title === 'string') return title;
  return title?.userPreferred || title?.english || title?.romaji || "Unknown Title";
}

export async function getTrendingAnime(): Promise<Anime[]> {
  const data = await fetchJson("/trending");
  return data?.results?.map((item: any) => ({
    id: item.id,
    title: getTitle(item.title),
    image: item.image,
    url: item.url,
    genres: item.genres,
    rating: item.rating,
    type: item.type
  })) || [];
}


export async function searchAnime(query: string, page: number = 1): Promise<Anime[]> {
  const data = await fetchJson(`/${encodeURIComponent(query)}?page=${page}`);
  return data?.results?.map((item: any) => ({
    id: item.id,
    title: getTitle(item.title),
    image: item.image,
    url: item.url,
    releaseDate: item.releaseDate,
    subOrDub: item.subOrDub,
    rating: item.rating,
    type: item.type
  })) || [];
}

export async function getAnimeDetails(id: string): Promise<AnimeDetails | null> {
  const data = await fetchJson(`/data/${id}`);
  if (!data) return null;

  // Fetch episodes separately since /data/ endpoint doesn't include them
  let episodes: { id: string; number: number; url?: string; isDubbed?: boolean; isSubbed?: boolean }[] | undefined = undefined;
  try {
    const episodesData = await fetchJson(`/episodes/${id}`);
    if (episodesData && Array.isArray(episodesData)) {
      episodes = episodesData.map((ep: any) => ({
        id: ep.id,
        number: ep.number,
        url: ep.url,
        isDubbed: ep.isDubbed,
        isSubbed: ep.isSubbed
      }));
    }
  } catch (error) {
    console.error(`Error fetching episodes for ${id}:`, error);
    // Continue without episodes if fetch fails
  }

  return {
    id: data.id,
    title: getTitle(data.title),
    image: data.image,
    description: data.description,
    otherName: data.otherName,
    totalEpisodes: data.totalEpisodes,
    status: data.status,
    releaseDate: data.releaseDate,
    subOrDub: data.subOrDub,
    genres: data.genres,
    rating: data.rating,
    type: data.type,
    recommendations: data.recommendations?.map((rec: any) => ({
      id: rec.id.toString(),
      title: getTitle(rec.title),
      image: rec.image,
      rating: rec.rating,
      type: rec.type,
      episodeNumber: rec.episodes
    })) || [],
    episodes: episodes
  };
}

export async function getEpisodeSources(episodeId: string, dub: boolean = false) {
  const data = await fetchJson(`/watch/${episodeId}${dub ? '?dub=true' : ''}`);
  return data;
}

// Category endpoints using Anilist Advanced Search
export async function getTVAnime(page: number = 1): Promise<Anime[]> {
  try {
    const res = await fetch(`${BASE_URL}/advanced-search?format=TV&sort=["POPULARITY_DESC"]&page=${page}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    const data = await res.json();
    return data?.results?.map((item: any) => ({
      id: item.id,
      title: getTitle(item.title),
      image: item.image,
      url: item.url,
      type: 'TV',
      subOrDub: item.subOrDub,
      rating: item.rating ? Math.round(item.rating / 10 * 10) / 10 : undefined,
      episodeNumber: item.episodeNumber || item.totalEpisodes
    })) || [];
  } catch (error) {
    console.error('Error fetching TV anime:', error);
    return [];
  }
}

export async function getOVAAnime(page: number = 1): Promise<Anime[]> {
  try {
    const res = await fetch(`${BASE_URL}/advanced-search?format=OVA&sort=["POPULARITY_DESC"]&page=${page}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    const data = await res.json();
    return data?.results?.map((item: any) => ({
      id: item.id,
      title: getTitle(item.title),
      image: item.image,
      url: item.url,
      type: 'OVA',
      subOrDub: item.subOrDub,
      rating: item.rating ? Math.round(item.rating / 10 * 10) / 10 : undefined,
      episodeNumber: item.episodeNumber || item.totalEpisodes
    })) || [];
  } catch (error) {
    console.error('Error fetching OVA anime:', error);
    return [];
  }
}

export async function getSpecialAnime(page: number = 1): Promise<Anime[]> {
  try {
    const res = await fetch(`${BASE_URL}/advanced-search?format=SPECIAL&sort=["POPULARITY_DESC"]&page=${page}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    const data = await res.json();
    return data?.results?.map((item: any) => ({
      id: item.id,
      title: getTitle(item.title),
      image: item.image,
      url: item.url,
      type: 'Special',
      subOrDub: item.subOrDub,
      rating: item.rating ? Math.round(item.rating / 10 * 10) / 10 : undefined,
      episodeNumber: item.episodeNumber || item.totalEpisodes
    })) || [];
  } catch (error) {
    console.error('Error fetching special anime:', error);
    return [];
  }
}

export async function getMovies(page: number = 1): Promise<Anime[]> {
  try {
    const res = await fetch(`${BASE_URL}/advanced-search?format=MOVIE&sort=["POPULARITY_DESC"]&page=${page}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    const data = await res.json();
    return data?.results?.map((item: any) => ({
      id: item.id,
      title: getTitle(item.title),
      image: item.image,
      url: item.url,
      type: 'MOVIE',
      subOrDub: item.subOrDub,
      rating: item.rating ? Math.round(item.rating / 10 * 10) / 10 : undefined
    })) || [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

export async function getONA(page: number = 1): Promise<Anime[]> {
  try {
    const res = await fetch(`${BASE_URL}/advanced-search?format=ONA&sort=["POPULARITY_DESC"]&page=${page}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    const data = await res.json();
    return data?.results?.map((item: any) => ({
      id: item.id,
      title: getTitle(item.title),
      image: item.image,
      url: item.url,
      type: 'ONA',
      subOrDub: item.subOrDub,
      rating: item.rating ? Math.round(item.rating / 10 * 10) / 10 : undefined,
      episodeNumber: item.episodeNumber || item.totalEpisodes
    })) || [];
  } catch (error) {
    console.error('Error fetching ONA:', error);
    return [];
  }
}

export async function getRecentEpisodes(page: number = 1): Promise<Anime[]> {
  try {
    const res = await fetch(`${BASE_URL}/advanced-search?status=RELEASING&sort=["UPDATED_AT_DESC"]&page=${page}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    const data = await res.json();
    return data?.results?.map((item: any) => ({
      id: item.id,
      title: getTitle(item.title),
      image: item.image,
      url: item.url,
      type: 'TV',
      subOrDub: item.subOrDub,
      rating: item.rating ? Math.round(item.rating / 10 * 10) / 10 : undefined,
      episodeNumber: item.episodeNumber || item.currentEpisode || item.totalEpisodes
    })) || [];
  } catch (error) {
    console.error('Error fetching recent episodes:', error);
    return [];
  }
}

export async function getRecentAdded(page: number = 1): Promise<Anime[]> {
  try {
    const res = await fetch(`${BASE_URL}/advanced-search?sort=["ID_DESC"]&page=${page}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    const data = await res.json();
    return data?.results?.map((item: any) => ({
      id: item.id,
      title: getTitle(item.title),
      image: item.image,
      url: item.url,
      type: 'TV',
      subOrDub: item.subOrDub,
      rating: item.rating ? Math.round(item.rating / 10 * 10) / 10 : undefined,
      episodeNumber: item.episodeNumber || item.totalEpisodes
    })) || [];
  } catch (error) {
    console.error('Error fetching recent added:', error);
    return [];
  }
}
