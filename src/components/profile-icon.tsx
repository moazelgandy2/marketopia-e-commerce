"use client";

import { UserRoleType } from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, User, Settings, CreditCard, Truck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const statusColors: Record<string, string> = {
  active:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  inactive: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
};

const roleIcons: Record<UserRoleType, React.ReactNode> = {
  [UserRoleType.USER]: <User className="h-4 w-4" />,
  [UserRoleType.DELIVERYMAN]: <Truck className="h-4 w-4" />,
};

export function ProfileIcon() {
  const session = useAuth();

  if (!session)
    return (
      <Skeleton className="h-9 w-9 rounded-full ring-2 ring-offset-2 ring-transparent" />
    );

  const { user } = session;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full p-0 ring-2 ring-offset-2 ring-transparent hover:ring-purple-500 transition-all"
        >
          <img
            src={
              user.image
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.image}`
                : "/images/default-avatar.png"
            }
            alt={user.name}
            className="h-full w-full rounded-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 mt-2 bg-white dark:bg-slate-800 shadow-xl rounded-xl border dark:border-slate-700"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <DropdownMenuLabel className="flex items-center gap-3 p-3">
          <img
            src={
              user.image
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.image}`
                : "/images/default-avatar.png"
            }
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-300"
          />
          <div>
            <p className="font-semibold text-sm">{user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.email || user.phone}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded",
                  statusColors[user.status]
                )}
              >
                {roleIcons[user.user_type]}
                {user.user_type}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Links */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/orders"
              className="cursor-pointer"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Orders
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={async () => {
            await fetch("/ar/api/auth/logout", {
              method: "POST",
              credentials: "include",
            });
            location.href = "/";
          }}
          className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
