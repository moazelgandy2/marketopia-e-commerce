"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Search, UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ProfileIcon } from "@/components/profile-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SearchInput } from "../search-input";

export const Header = () => {
  const { session } = useAuth();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
      {/* Desktop / Tablet */}
      <div className="hidden md:grid md:grid-cols-3 md:items-center md:h-20 md:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-2"
          >
            <Image
              src="/images/logo.png"
              alt="Marketopia"
              width={80}
              height={80}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Search */}
        <div className="flex justify-center">
          <SearchInput />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          {session ? (
            <ProfileIcon />
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
            >
              <Link
                href="/login"
                className="flex items-center space-x-1"
              >
                <UserIcon className="h-5 w-5" />
                <span>Login</span>
              </Link>
            </Button>
          )}

          <Button
            asChild
            variant="ghost"
            size="sm"
          >
            <Link
              href="/cart"
              className="flex items-center space-x-1"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between h-16 px-4">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center"
        >
          <Image
            src="/images/logo.png"
            alt="Marketopia"
            width={48}
            height={48}
            className="object-contain"
          />
        </Link>

        {/* Center: Search or Title */}
        {showMobileSearch ? (
          <div className="flex-1 px-2">
            <SearchInput />
          </div>
        ) : (
          <span className="font-bold text-lg">Marketopia</span>
        )}

        {/* Right: Icons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle search"
            onClick={() => setShowMobileSearch((s) => !s)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {session ? (
            <ProfileIcon />
          ) : (
            <Button
              asChild
              variant="ghost"
              size="icon"
            >
              <Link
                href="/login"
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
          >
            <Link
              href="/cart"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
