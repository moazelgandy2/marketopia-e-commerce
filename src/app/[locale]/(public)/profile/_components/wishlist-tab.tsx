import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlists } from "@/hooks/use-wishlists";
import { Wishlist } from "@/types";
import { Heart, Trash2, ShoppingCart, Star, HeartOff } from "lucide-react";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Wishlist
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Items you've saved for later
          </p>
        </div>
        {wishlists && (
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {wishlists.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Saved Items
            </div>
          </div>
        )}
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isWishlistsLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Card
              key={index}
              className="overflow-hidden"
            >
              <div className="aspect-square">
                <Skeleton className="w-full h-full" />
              </div>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))
        ) : isWishlistsError ? (
          <div className="col-span-full">
            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="p-12 text-center">
                <HeartOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
                  Failed to load wishlist
                </h3>
                <p className="text-red-600 dark:text-red-400">
                  Please try refreshing the page or contact support if the
                  problem persists.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : !wishlists || wishlists.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-slate-200 dark:border-slate-700">
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Start adding products you love to your wishlist!
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          wishlists?.map((wishlistItem: Wishlist) => (
            <Card
              key={wishlistItem.id}
              className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-700">
                <Image
                  src={
                    wishlistItem.product.image
                      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${wishlistItem.product.image}`
                      : "/images/default-avatar.jpg"
                  }
                  alt={wishlistItem.product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Remove from wishlist button */}
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => deleteItem(wishlistItem.product.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>

                {/* Heart icon overlay */}
                <div className="absolute top-2 left-2 p-1.5 bg-red-500 rounded-full">
                  <Heart className="w-3 h-3 text-white fill-current" />
                </div>
              </div>

              {/* Product Details */}
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 min-h-[2.5rem]">
                    {wishlistItem.product.name}
                  </h3>

                  {/* Rating (placeholder for now) */}
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < 4
                            ? "text-yellow-400 fill-current"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-slate-500 ml-1">(24)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      $
                      {wishlistItem.product.discount_price ||
                        wishlistItem.product.price}
                    </div>
                    {wishlistItem.product.discount_price && (
                      <div className="text-sm text-slate-500 line-through">
                        ${wishlistItem.product.price}
                      </div>
                    )}
                  </div>

                  {/* Discount badge */}
                  {wishlistItem.product.discount_price && (
                    <div className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-xs px-2 py-1 rounded-full">
                      -
                      {Math.round(
                        ((parseFloat(wishlistItem.product.price) -
                          parseFloat(wishlistItem.product.discount_price)) /
                          parseFloat(wishlistItem.product.price)) *
                          100
                      )}
                      %
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => deleteItem(wishlistItem.product.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Removing...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        Remove
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
