"use client";

import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit3,
  Plus,
  Trash2,
  MapPin,
  Heart,
  Package,
  CreditCard,
} from "lucide-react";
import { OrderType, OrderStatus, AddressType, ProductType } from "@/types";
import { cn } from "@/lib/utils";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-purple-100 text-purple-800",
  confirmed: "bg-blue-100 text-blue-800",
  ready: "bg-sky-100 text-sky-800",
  on_delivery: "bg-amber-100 text-amber-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
};

export default function ProfilePage() {
  const session = useAuth();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [wishlist, setWishlist] = useState<ProductType[]>([]);

  /* fetch real data ----------------------------------------------------- */
  useEffect(() => {
    if (!session) return;
    const id = session.user.id;
    Promise.all([
      fetch(`/ar/api/users/${id}/orders`).then((r) => r.json()),
      fetch(`/ar/api/users/${id}/addresses`).then((r) => r.json()),
      fetch(`/ar/api/users/${id}/wishlist`).then((r) => r.json()),
    ]).then(([o, a, w]) => {
      setOrders(o);
      setAddresses(a);
      setWishlist(w);
    });
  }, [session]);

  /* skeleton fallback ---------------------------------------------------- */
  if (!session)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Skeleton className="h-96 w-full max-w-5xl rounded-xl" />
      </div>
    );

  const { user } = session;

  /* --------------------------------------------------------------------- */
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header --------------------------------------------------------- */}
        <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center gap-6">
          <Image
            src={
              user.image
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.image}`
                : "/images/default-avatar.png"
            }
            alt={user.name}
            width={96}
            height={96}
            className="rounded-full border-4 border-purple-300 dark:border-purple-600"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {user.email}
            </p>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-blue-100 text-blue-800">
                {user.user_type}
              </Badge>
              <Badge
                variant={user.status === "active" ? "default" : "destructive"}
              >
                {user.status}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Tabs ----------------------------------------------------------- */}
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

          {/* Orders ------------------------------------------------------- */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="border rounded-xl p-4 space-y-2 dark:border-slate-700"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">#{o.id}</p>
                        <p className="text-sm text-slate-600">
                          {format(new Date(o.created_at), "PPP")}
                        </p>
                      </div>
                      <Badge className={cn(statusColors[o.status])}>
                        {o.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4" />
                      <span>
                        {o.payment_method} ·{" "}
                        {o.payment_status === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{o.address?.name ?? "No address"}</span>
                    </div>

                    <div className="text-sm font-bold">Total: ${o.total}</div>

                    {/* items */}
                    <div className="space-y-1">
                      {o.order_details.map((d) => (
                        <div
                          key={d.id}
                          className="flex items-center gap-2 text-xs"
                        >
                          <Image
                            src={
                              user.image
                                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.image}`
                                : "/images/default-avatar.png"
                            }
                            alt={d.product.name}
                            width={32}
                            height={32}
                            className="rounded"
                          />
                          <span>
                            {d.product.name} ×{d.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses ---------------------------------------------------- */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Addresses</CardTitle>
                <Button
                  size="sm"
                  className="ml-auto"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.map((a) => (
                  <div
                    key={a.id}
                    className="border rounded-xl p-4 flex justify-between items-start dark:border-slate-700"
                  >
                    <div>
                      <p className="font-bold">{a.name}</p>
                      <p className="text-sm text-slate-600">
                        {a.city.name} ({a.lat}, {a.lng})
                      </p>
                      <p className="text-sm">{a.phone}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist ----------------------------------------------------- */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>Wishlist</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {wishlist.map((p) => (
                  <div
                    key={p.id}
                    className="space-y-1"
                  >
                    <Image
                      src={
                        p.image
                          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${p.image}`
                          : "/images/default-avatar.png"
                      }
                      alt={p.name}
                      width={150}
                      height={150}
                      className="rounded-lg object-cover"
                    />
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-sm">${p.price}</p>
                    <Button
                      size="sm"
                      className="w-full"
                    >
                      <Heart className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account ------------------------------------------------------ */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input defaultValue={user.name} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input defaultValue={user.email || ""} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input defaultValue={user.phone || ""} />
                </div>
                <Button>
                  <Edit3 className="h-4 w-4 mr-1" /> Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
