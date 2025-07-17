"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
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

  // Debounced fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/ar/api/search?q=${encodeURIComponent(query)}`
        );
        const data: SearchResult[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click-outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKey = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          router.push(`/products/${results[activeIndex].slug}`);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const onSelect = (item: SearchResult) => {
    router.push(`/products/${item.slug}`);
    setIsOpen(false);
    setQuery("");
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
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          className={cn(
            "w-full h-9 pl-10 pr-4 rounded-md border bg-white dark:bg-slate-800",
            "border-slate-300 dark:border-slate-600",
            "focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none",
            "text-sm"
          )}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (query || loading) && (
        <ul
          className={cn(
            "absolute z-20 w-full mt-1 max-h-64 overflow-y-auto",
            "bg-white dark:bg-slate-800 border rounded-md shadow-lg",
            "border-slate-200 dark:border-slate-700"
          )}
        >
          {loading && (
            <li className="px-3 py-2">
              <Skeleton className="h-4 w-full rounded" />
            </li>
          )}

          {!loading && results.length === 0 && query && (
            <li className="px-3 py-2 text-sm text-slate-500">No results</li>
          )}

          {results.map((item, idx) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-left text-sm",
                  "hover:bg-slate-100 dark:hover:bg-slate-700",
                  idx === activeIndex && "bg-slate-100 dark:bg-slate-700"
                )}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-8 w-8 rounded object-cover"
                />
                <span className="truncate">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
