import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center px-4">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
            <Search className="w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The category you're looking for doesn't exist or has been removed.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/categories"
            className="block"
          >
            <Button className="w-full flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              Browse All Categories
            </Button>
          </Link>

          <Link
            href="/"
            className="block"
          >
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
