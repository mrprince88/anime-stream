"use client";

import { AnimeCard } from "@/components/features/AnimeCard";
import { searchAnime } from "@/lib/api";
import { Search, Loader2 } from "lucide-react";
import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/lib/hooks"; 

interface AnimeResult {
  id: string;
  title: string;
  image: string;
  rating: number;
  episode: number;
  type: string;
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Get query from URL or default to empty
  const initialQuery = searchParams.get('q') || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Function to perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const data = await searchAnime(searchQuery);
      // Map API data to our UI format
      const mapped = data.map(item => ({
        id: item.id,
        title: item.title,
        image: item.image,
        rating: 0,
        episode: 0,
        type: item.subOrDub || "TV"
      }));
      setResults(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update URL when query changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query !== initialQuery) {
        const params = new URLSearchParams(searchParams);
        if (query) {
          params.set('q', query);
        } else {
          params.delete('q');
        }
        router.replace(`${pathname}?${params.toString()}`);
        performSearch(query);
      } else if (query && !hasSearched) {
          // Initial load with query
          performSearch(query);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, router, pathname, searchParams, initialQuery, performSearch, hasSearched]);


  return (
    <div className="pt-24 pb-20 container mx-auto px-6 min-h-screen">
      {/* Search Header */}
      <div className="flex flex-col gap-8 mb-12">
        <h1 className="text-3xl font-bold text-white text-center">Find Your Next Adventure</h1>
        <div className="relative max-w-2xl mx-auto w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for anime..." 
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-14 pr-4 text-lg text-slate-200 outline-none focus:border-violet-500 shadow-xl focus:shadow-violet-500/10 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div>
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {results.map((anime) => (
              <AnimeCard key={anime.id} {...anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            {hasSearched && !isLoading ? (
               <div className="text-slate-400">
                 <p className="text-xl font-medium mb-2">No results found for "{query}"</p>
                 <p className="text-sm">Try searching for a different title</p>
               </div>
            ) : (
                !isLoading && (
                  <div className="text-slate-500">
                    Type something to start searching...
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
