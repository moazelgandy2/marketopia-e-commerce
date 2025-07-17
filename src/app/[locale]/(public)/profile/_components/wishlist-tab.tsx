import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlists } from "@/hooks/use-wishlists";
import { Wishlist } from "@/types";
import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";

export const WishlistTab = () => {
  const {
    wishlists,
    isWishlistsLoading,
    isWishlistsError,
    deleteItem,
    isDeleting,
  } = useWishlists();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wishlist</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isWishlistsLoading ? (
          <>
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </>
        ) : isWishlistsError ? (
          <div className="text-red-500 col-span-full">
            Failed to load wishlist. Please try again later.
          </div>
        ) : (
          wishlists?.map((wishlistItem: Wishlist) => (
            <div
              key={wishlistItem.id}
              className="space-y-1"
            >
              <Image
                src={
                  wishlistItem.product.image
                    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${wishlistItem.product.image}`
                    : "/images/default-avatar.png"
                }
                alt={wishlistItem.product.name}
                width={150}
                height={150}
                className="rounded-lg object-cover"
              />
              <p className="text-sm font-semibold truncate">
                {wishlistItem.product.name}
              </p>
              <p className="text-sm">${wishlistItem.product.price}</p>
              <Button
                size="sm"
                className="w-full"
                variant="destructive"
                onClick={() => deleteItem(wishlistItem.product.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Remove
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
