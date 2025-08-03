"use client";

import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "./_components/profile-header";
import { OrdersTab } from "./_components/orders-tab";
import { AddressesTab } from "./_components/addresses-tab";
import { WishlistTab } from "./_components/wishlist-tab";
import { AccountTab } from "./_components/account-tab";
import { Package, MapPin, Heart, User, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const { session } = useAuth();
  const t = useTranslations("ProfilePage");

  if (!session)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="w-full max-w-6xl px-4">
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );

  const { user } = session;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <ShoppingBag className="w-4 h-4" />
          <span>{t("breadcrumb.dashboard")}</span>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-medium">
            {t("breadcrumb.profile")}
          </span>
        </div>

        <ProfileHeader user={user} />

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <Tabs
            defaultValue="orders"
            className="w-full"
          >
            <div className="border-b pb-4 border-slate-200/50 dark:border-slate-700/50 px-6 pt-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 h-12 bg-slate-100/80 dark:bg-slate-700/50 rounded-xl p-1">
                <TabsTrigger
                  value="orders"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-600 transition-all duration-200"
                >
                  <Package className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("tabs.orders")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="addresses"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-600 transition-all duration-200"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {t("tabs.addresses")}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="wishlist"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-600 transition-all duration-200"
                >
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("tabs.wishlist")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-600 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("tabs.account")}</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 ">
              <TabsContent
                value="orders"
                className="mt-0"
              >
                <OrdersTab />
              </TabsContent>
              <TabsContent
                value="addresses"
                className="mt-0"
              >
                <AddressesTab />
              </TabsContent>
              <TabsContent
                value="wishlist"
                className="mt-0"
              >
                <WishlistTab />
              </TabsContent>
              <TabsContent
                value="account"
                className="mt-0"
              >
                <AccountTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
