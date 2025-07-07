import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Home, Grid3X3 } from "lucide-react";

export default function AllCategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link
            href="/"
            className="hover:text-primary transition-colors flex items-center"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <ArrowRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">All Categories</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse All Categories
          </h1>
          <p className="text-gray-600">
            Discover products across all our categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for categories - you can fetch this from your API */}
          <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Grid3X3 className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">All Categories</h3>
              <p className="text-gray-600 text-sm mb-4">
                Browse through all available product categories
              </p>
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center gap-2"
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
