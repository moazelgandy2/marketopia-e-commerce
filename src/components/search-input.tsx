"use client";

import { cn } from "@/lib/utils";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type SearchResult = {
  id: number;
  name: string;
  slug: string;
  image: string;
};

export function SearchInput({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      setIsOpen(false);
      return;
    }

    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setIsOpen(true);
      try {
        const res = await fetch(
          `/${
            window.location.pathname.split("/")[1]
          }/api/search?q=${encodeURIComponent(query.trim())}`
        );
        if (res.ok) {
          const data: SearchResult[] = await res.json();
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (!isOpen || (!loading && results.length === 0)) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          onSelect(results[activeIndex]);
        } else if (query.trim()) {
          router.push(`/products?search=${encodeURIComponent(query.trim())}`);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const onSelect = (item: SearchResult) => {
    router.push(`/products/${item.id}`);
    setIsOpen(false);
    setQuery("");
    setActiveIndex(-1);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div
      ref={ref}
      className={cn("relative w-full max-w-md", className)}
      onKeyDown={handleKey}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          className={cn(
            "w-full h-10 pl-10 pr-10 rounded-lg border bg-white dark:bg-slate-900",
            "border-slate-200 dark:border-slate-700",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none",
            "text-sm placeholder:text-slate-400",
            "transition-all duration-200"
          )}
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (query.trim().length >= 2 || loading) && (
        <div
          className={cn(
            "absolute z-50 w-full mt-2 max-h-80 overflow-y-auto",
            "bg-white dark:bg-slate-900 border rounded-lg shadow-xl",
            "border-slate-200 dark:border-slate-700",
            "animate-in fade-in-0 zoom-in-95 duration-100"
          )}
        >
          {loading && (
            <div className="flex items-center gap-3 px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span className="text-sm text-slate-500">Searching...</span>
            </div>
          )}

          {!loading && results.length === 0 && query.trim() && (
            <div className="px-4 py-8 text-center">
              <Search className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500 mb-1">No products found</p>
              <p className="text-xs text-slate-400">
                Try searching with different keywords
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="py-2">
              {results.map((item, idx) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left",
                      "hover:bg-slate-50 dark:hover:bg-slate-800",
                      "focus:bg-slate-50 dark:focus:bg-slate-800 focus:outline-none",
                      "transition-colors duration-150",
                      idx === activeIndex && "bg-slate-50 dark:bg-slate-800"
                    )}
                  >
                    <div className="relative">
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.image}`}
                        alt={item.name}
                        className="h-10 w-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/placeholder-product.svg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {item.name}
                      </p>
                    </div>
                    <Search className="h-4 w-4 text-slate-400" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!loading && results.length > 0 && query.trim() && (
            <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  router.push(
                    `/products?search=${encodeURIComponent(query.trim())}`
                  );
                  setIsOpen(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                View all results for "{query.trim()}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
