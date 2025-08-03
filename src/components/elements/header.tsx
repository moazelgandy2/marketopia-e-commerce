"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Search, UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ProfileIcon } from "@/components/profile-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SearchInput } from "../search-input";
import { useCart } from "@/hooks/use-cart";
import { LocaleSwitcherDropdown } from "@/components/locale-switcher";

export const Header = () => {
  const { session } = useAuth();
  const { data: cartData } = useCart();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const cartItemsCount = cartData?.data?.items?.length || 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-md dark:bg-slate-900/70 shadow-sm">
      {/* Desktop / Tablet */}
      <div className="hidden md:flex md:items-center md:justify-between md:h-16 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105"
          >
            <Image
              src="/logo.png"
              alt="Narmer"
              width={60}
              height={60}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Search */}
        <div className="flex-grow max-w-md mx-6">
          <SearchInput />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Locale Switcher */}
          <div className="w-32">
            <LocaleSwitcherDropdown />
          </div>

          {session ? (
            <div className="transition-transform hover:scale-105">
              <ProfileIcon />
            </div>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Link
                href="/auth/login"
                className="flex items-center space-x-1"
              >
                <UserIcon className="h-5 w-5" />
                <span className="font-medium">Login</span>
              </Link>
            </Button>
          )}

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Link
              href="/cart"
              className="flex items-center space-x-1 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="font-medium">Cart</span>
              {cartItemsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between h-16 px-4">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center transition-transform hover:scale-105"
        >
          <Image
            src="/logo.png"
            alt="Narmer"
            width={40}
            height={40}
            className="object-contain"
          />
        </Link>

        {/* Center: Search or Title */}
        {showMobileSearch ? (
          <div className="flex-1 px-2">
            <SearchInput />
          </div>
        ) : (
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Narmer
          </span>
        )}

        {/* Right: Icons */}
        <div className="flex items-center space-x-2">
          {/* Mobile Locale Switcher - Compact */}
          <div className="w-20">
            <LocaleSwitcherDropdown />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle search"
            onClick={() => setShowMobileSearch((s) => !s)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {session ? (
            <div className="transition-transform hover:scale-105">
              <ProfileIcon />
            </div>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Link
                href="/auth/login"
                aria-label="Login"
              >
                <UserIcon className="h-5 w-5" />
              </Link>
            </Button>
          )}

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
