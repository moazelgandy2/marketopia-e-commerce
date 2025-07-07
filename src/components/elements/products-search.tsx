"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductsSearchProps {
  onSearch: (search: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function ProductsSearch({
  onSearch,
  placeholder = "Search products...",
  initialValue = "",
}: ProductsSearchProps) {
  const [searchValue, setSearchValue] = useState(initialValue);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchValue);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchValue, onSearch]);

  const handleClear = () => {
    setSearchValue("");
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={placeholder}
          className="pl-12 pr-12 h-12 bg-white border-gray-200 rounded-full focus:border-purple-500 focus:ring-purple-500 shadow-sm"
        />
        {searchValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
