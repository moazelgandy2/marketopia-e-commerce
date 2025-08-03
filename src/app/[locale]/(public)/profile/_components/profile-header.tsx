"use client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UserType } from "@/types";
import Image from "next/image";
import { Calendar, Mail, Shield, Verified, Camera } from "lucide-react";
import { useOrders } from "@/hooks/use-orders";
import { useWishlists } from "@/hooks/use-wishlists";
import { useAddresses } from "@/hooks/use-addresses";
import { useTranslations } from "next-intl";

export const ProfileHeader = ({ user }: { user: UserType }) => {
  const { orders, isOrdersLoading } = useOrders();
  const { wishlists, isWishlistsLoading } = useWishlists();
  const { addresses, isAddressesLoading } = useAddresses();
  const t = useTranslations("ProfilePage.header");

  const ordersCount = isOrdersLoading ? "..." : orders?.length || 0;
  const wishlistsCount = isWishlistsLoading ? "..." : wishlists?.length || 0;
  const addressesCount = isAddressesLoading ? "..." : addresses?.length || 0;

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px] rounded-2xl" />

      <Card className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Profile Image */}
            <div className="relative group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white dark:bg-slate-800 p-1 rounded-2xl">
                  <Image
                    src={
                      user.image
                        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.image}`
                        : "/images/default-avatar.jpg"
                    }
                    alt={user.name}
                    width={120}
                    height={120}
                    className="rounded-xl object-cover w-[120px] h-[120px]"
                  />
                </div>
              </div>

              {/* Camera Icon Overlay */}
              <div className="absolute bottom-2 right-2 bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    {user.name}
                  </h1>
                  {user.status === "active" && (
                    <Verified className="w-6 h-6 text-blue-500" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-3 py-1"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {user.user_type}
                </Badge>

                <Badge
                  variant={user.status === "active" ? "default" : "destructive"}
                  className={
                    user.status === "active"
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 px-3 py-1"
                      : "px-3 py-1"
                  }
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      user.status === "active" ? "bg-white" : "bg-red-200"
                    }`}
                  />
                  {user.status}
                </Badge>

                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1"
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  {t("memberSince")}
                </Badge>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {ordersCount}
                </div>
                <div className="text-xs text-blue-600/70 dark:text-blue-400/70">
                  {t("stats.orders")}
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {wishlistsCount}
                </div>
                <div className="text-xs text-purple-600/70 dark:text-purple-400/70">
                  {t("stats.wishlist")}
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {addressesCount}
                </div>
                <div className="text-xs text-green-600/70 dark:text-green-400/70">
                  {t("stats.addresses")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
