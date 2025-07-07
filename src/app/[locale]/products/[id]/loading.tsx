import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <Skeleton className="w-full h-96 rounded-2xl" />
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-20 h-20 rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-20 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <div className="flex space-x-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
