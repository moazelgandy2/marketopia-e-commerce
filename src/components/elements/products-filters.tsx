"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

interface ProductsFiltersProps {
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  onFilterClick?: () => void;
}

export default function ProductsFilters({
  sortBy = "name",
  onSortChange,
  onFilterClick,
}: ProductsFiltersProps) {
  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "name_desc", label: "Name Z-A" },
    { value: "price", label: "Price Low to High" },
    { value: "price_desc", label: "Price High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "popular", label: "Most Popular" },
  ];

  const currentSort = sortOptions.find((option) => option.value === sortBy);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {currentSort?.label || "Name A-Z"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange?.(option.value)}
                className={sortBy === option.value ? "bg-gray-100" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onFilterClick}
        className="flex items-center gap-2"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </Button>
    </div>
  );
}
