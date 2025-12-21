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

export async function getRecentEpisodes(): Promise<Anime[]> {
  const data = await fetchJson("/recent-episodes");
  return data?.results?.map((item: any) => ({
    id: item.id,
    title: getTitle(item.title),
    image: item.image,
    url: item.url,
    episodeNumber: item.episodeNumber,
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
  const data = await fetchJson(`/info/${id}`);
  if (!data) return null;
  
  return {
    id: data.id,
    title: getTitle(data.title),
    image: data.image,
    description: data.description,
    otherName: data.otherName, // Anilist might not have this or it might be synonyms
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
    episodes: data.episodes?.map((ep: any) => ({
      id: ep.id,
      number: ep.number,
      url: ep.url
    }))
  };
}

export async function getEpisodeSources(episodeId: string) {
  const data = await fetchJson(`/watch/${episodeId}`);
  return data;
}

// AnimeKai category endpoints
export async function getTVAnime(page: number = 1): Promise<Anime[]> {
  try {
    const res = await fetch(`https://api.consumet.org/anime/animekai/tv?page=${page}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    const data = await res.json();
    return data?.results?.map((item: any) => ({
      id: item.id,
      title: getTitle(item.title),
      image: item.image,
      url: item.url,
      type: 'TV',
      subOrDub: item.subOrDub
    })) || [];
  } catch (error) {
    console.error('Error fetching TV anime:', error);
    return [];
  }
}

export async function getOVAAnime(page: number = 1): Promise<Anime[]> {
  try {
    const res = await fetch(`https://api.consumet.org/anime/animekai/ova?page=${page}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    const data = await res.json();
    return data?.results?.map((item: any) => ({
      id: item.id,
      title: getTitle(item.title),
      image: item.image,
      url: item.url,
      type: 'OVA',
      subOrDub: item.subOrDub
    })) || [];
  } catch (error) {
    console.error('Error fetching OVA anime:', error);
    return [];
  }
}

export async function getSpecialAnime(page: number = 1): Promise<Anime[]> {
  try {
    const res = await fetch(`https://api.consumet.org/anime/animekai/special?page=${page}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    const data = await res.json();
    return data?.results?.map((item: any) => ({
      id: item.id,
      title: getTitle(item.title),
      image: item.image,
      url: item.url,
      type: 'Special',
      subOrDub: item.subOrDub
    })) || [];
  } catch (error) {
    console.error('Error fetching special anime:', error);
    return [];
  }
}
