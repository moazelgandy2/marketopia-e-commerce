"use client";

import Image from "next/image";
import SearchInput from "./search-input";
import { ShoppingCart, UserIcon } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full h-[90px] grid grid-cols-3 border-b px-4">
      <div className="w-full col-span-1 flex items-center justify-start">
        <div className="relative w-[97px] h-[97px]">
          <Image
            src={"/images/logo.png"}
            fill
            alt="logo"
            className="object-contain"
          />
        </div>
      </div>
      <div className="w-full col-span-1 flex items-center justify-center">
        <SearchInput />
      </div>
      <div className="w-full col-span-1 flex items-center justify-end gap-5">
        <div className="flex items-center cursor-pointer">
          <UserIcon className="w-5 h-5 text-primary" />
          <span className="text-[#666666] font-bold text-xs">
            SignUp / Register
          </span>
        </div>
        <div className="flex items-center cursor-pointer">
          <ShoppingCart className="w-5 h-5 text-primary" />
          <span className="text-[#666666] font-bold text-xs">Cart</span>
        </div>
      </div>
    </header>
  );
};
