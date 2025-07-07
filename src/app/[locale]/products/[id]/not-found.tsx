import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Product Not Found
            </h1>
            <p className="text-gray-600">
              The product you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/products">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>

            <Link href="/">
              <Button
                variant="outline"
                className="w-full"
              >
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
