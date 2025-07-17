"use client";

import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "./_components/profile-header";
import { OrdersTab } from "./_components/orders-tab";
import { AddressesTab } from "./_components/addresses-tab";
import { WishlistTab } from "./_components/wishlist-tab";
import { AccountTab } from "./_components/account-tab";

export default function ProfilePage() {
  const { session } = useAuth();

  if (!session)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Skeleton className="h-96 w-full max-w-5xl rounded-xl" />
      </div>
    );

  const { user } = session;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <ProfileHeader user={user} />

        <Tabs
          defaultValue="orders"
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
          <TabsContent value="addresses">
            <AddressesTab />
          </TabsContent>
          <TabsContent value="wishlist">
            <WishlistTab />
          </TabsContent>
          <TabsContent value="account">
            <AccountTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
