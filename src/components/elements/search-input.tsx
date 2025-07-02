import React, { useState } from "react";
import { Search, Menu } from "lucide-react";

export default function SearchInput() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative flex items-center bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-center w-12 h-12 ml-2">
          <Search
            className="w-6 h-6 text-purple-600"
            strokeWidth={2}
          />
        </div>

        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search essentials, groceries and more..."
          className="flex-1 h-12 px-4 text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none text-base"
        />

        <div className="flex items-center justify-center w-12 h-12 mr-2 cursor-pointer hover:bg-gray-50 rounded-full transition-colors duration-200">
          <div className="flex flex-col space-y-1">
            <div className="w-6 h-0.5 bg-purple-600 rounded-full"></div>
            <div className="w-6 h-0.5 bg-purple-600 rounded-full"></div>
            <div className="w-6 h-0.5 bg-purple-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
