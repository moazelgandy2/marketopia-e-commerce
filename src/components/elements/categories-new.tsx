"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ShoppingBag,
  Smartphone,
  Laptop,
  Home,
  Car,
  Shirt,
  Book,
  Gamepad2,
  Baby,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Grid3X3,
  Eye,
  Plus,
  Menu,
  X,
  Flame,
  Crown,
  Layers,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  useCategories,
  useParentCategories,
  useCategoryWithChildrenOnHover,
} from "@/hooks/use-categories";
import { Category } from "@/types/category";

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${imagePath}`;
};

const categoryIcons: {
  [key: string]: React.ComponentType<{ className?: string }>;
} = {
  electronics: Smartphone,
  elctronics: Smartphone,
  computers: Laptop,
  home: Home,
  automotive: Car,
  clothing: Shirt,
  clothes: Shirt,
  bags: ShoppingBag,
  watches: TrendingUp,
  drinks: Sparkles,
  milks: Baby,
  canned: Home,
  cannedfood: Home,
  books: Book,
  gaming: Gamepad2,
  baby: Baby,
  beauty: Sparkles,
  sports: TrendingUp,
  default: ShoppingBag,
};

export function CategoryNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { data: categories, isLoading, error } = useCategories();
  const { data: parentCategoriesData, isLoading: isLoadingParent } =
    useParentCategories();
  const t = useTranslations("CategoryNav");

  const getCategoryIcon = (categoryName: string) => {
    const key = categoryName.toLowerCase().replace(/\s+/g, "");
    const IconComponent = categoryIcons[key] || categoryIcons.default;
    return <IconComponent className="h-4 w-4" />;
  };

  const getPopularCategories = () => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories
      .filter((cat: any) => cat.popular > 0)
      .sort((a: any, b: any) => b.popular - a.popular)
      .slice(0, 6);
  };

  const getParentCategories = () => {
    if (!parentCategoriesData) return [];
    return parentCategoriesData.categories;
  };

  const getFeaturedCategories = () => {
    const parentCats = getParentCategories();
    if (parentCats.length >= 3) {
      return parentCats.slice(0, 3).map((cat: any) => ({
        name: cat.name,
        href: `/categories/${cat.id}`,
        image: cat.image,
        description: t("browseAll", { categoryName: cat.name.toLowerCase() }),
        color: "from-blue-500 to-indigo-600",
        icon: getCategoryIcon(cat.name),
      }));
    }
    // If we don't have enough parent categories, return the first few available
    return parentCats.slice(0, 3).map((cat: any) => ({
      name: cat.name,
      href: `/categories/${cat.id}`,
      image: cat.image,
      description: t("browseAll", { categoryName: cat.name.toLowerCase() }),
      color: "from-blue-500 to-indigo-600",
      icon: getCategoryIcon(cat.name),
    }));
  };

  if (isLoading || isLoadingParent) {
    return (
      <div className="w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg"></div>
              <div className="hidden md:flex space-x-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-md"
                    style={{ animationDelay: `${i * 100}ms` }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="h-8 w-24 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-14">
          {/* Main Navigation */}
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center space-x-3">
                {/* All Categories Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-gradient-to-r from-blue-600 to-slate-600 text-white hover:from-blue-700 hover:to-slate-700 transition-all duration-300 font-medium text-xs md:text-sm shadow-md hover:shadow-lg transform hover:scale-102 border-0 h-9 px-4 rounded-full">
                    <Grid3X3 className="h-3.5 w-3.5 mr-1.5" />
                    {t("allCategories")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-4 p-5 w-[600px] lg:w-[800px] grid-cols-3 bg-white/95 backdrop-blur-md shadow-xl rounded-2xl border border-gray-100">
                      {/* Popular Categories */}
                      <div className="space-y-3">
                        <h3 className="font-medium text-base text-gray-900 flex items-center border-b border-gray-100 pb-2">
                          <Flame className="h-4 w-4 mr-2 text-orange-500" />
                          {t("popular")}
                        </h3>
                        <div className="space-y-1.5">
                          {getPopularCategories().map((category: any) => (
                            <ModernCategoryLink
                              key={category.id}
                              href={`/categories/${category.id}`}
                              title={category.name}
                              icon={getCategoryIcon(category.name)}
                              image={category.image}
                              isPopular={true}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Featured Categories */}
                      <div className="space-y-3">
                        <h3 className="font-medium text-base text-gray-900 flex items-center border-b border-gray-100 pb-2">
                          <Crown className="h-4 w-4 mr-2 text-amber-500" />
                          {t("featured")}
                        </h3>
                        <div className="space-y-1.5">
                          {getFeaturedCategories().map((category) => (
                            <ModernCategoryLink
                              key={category.name}
                              href={category.href}
                              title={category.name}
                              icon={category.icon as any}
                              image={category.image}
                              description={category.description}
                            />
                          ))}
                        </div>
                      </div>

                      {/* All Categories */}
                      <div className="space-y-3">
                        <h3 className="font-medium text-base text-gray-900 flex items-center border-b border-gray-100 pb-2">
                          <Layers className="h-4 w-4 mr-2 text-blue-500" />
                          {t("allCategoriesTitle")}
                        </h3>
                        <div className="space-y-1.5">
                          {getParentCategories()
                            .slice(0, 6)
                            .map((category) => (
                              <ModernCategoryLink
                                key={category.id}
                                href={`/categories/${category.id}`}
                                title={category.name}
                                icon={getCategoryIcon(category.name)}
                                image={category.image}
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Top Level Categories */}
                <div className="hidden md:flex items-center space-x-2">
                  {getParentCategories()
                    .slice(0, 5)
                    .map((category) => (
                      <ModernCategoryDropdown
                        key={category.id}
                        category={category}
                        getCategoryIcon={getCategoryIcon}
                      />
                    ))}
                </div>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3">
            <div className="space-y-1">
              {getParentCategories()
                .slice(0, 6)
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-7 h-7 bg-gradient-to-r from-blue-100 to-slate-100 rounded-full flex items-center justify-center">
                      {getCategoryIcon(category.name)}
                    </div>
                    <span className="font-medium text-sm text-gray-800">
                      {category.name}
                    </span>
                  </Link>
                ))}
              <Link
                href="/categories"
                className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-blue-600 font-medium text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-7 h-7 bg-gradient-to-r from-blue-100 to-slate-100 rounded-full flex items-center justify-center">
                  <Eye className="h-3.5 w-3.5" />
                </div>
                <span>{t("viewAllCategories")}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Modern Category Link Component
function ModernCategoryLink({
  href,
  title,
  icon,
  image,
  description,
  isPopular = false,
}: {
  href: string;
  title: string;
  icon?: React.ReactNode;
  image?: string;
  description?: string;
  isPopular?: boolean;
}) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="group flex items-center space-x-2.5 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
      >
        <div className="relative flex-shrink-0">
          <div className="w-7 h-7 bg-gradient-to-r from-blue-100 to-slate-100 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-slate-200 transition-all duration-200 group-hover:scale-105">
            {image ? (
              <div className="w-4.5 h-4.5 relative overflow-hidden rounded-full">
                <Image
                  src={getImageUrl(image)}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="18px"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              icon
            )}
          </div>
          {isPopular && (
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full flex items-center justify-center ring-1 ring-white">
              <Flame className="h-1.5 w-1.5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-800 group-hover:text-blue-600 transition-colors truncate">
            {title}
          </div>
          {description && (
            <div className="text-xs text-gray-500 mt-0.5 truncate">
              {description}
            </div>
          )}
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-0.5 transition-all" />
      </Link>
    </NavigationMenuLink>
  );
}

// Modern Category Dropdown Component
function ModernCategoryDropdown({
  category,
  getCategoryIcon,
}: {
  category: Category;
  getCategoryIcon: (name: string) => React.ReactNode;
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const { data: categoryWithChildren, isLoading } =
    useCategoryWithChildrenOnHover(category.id, isHovered);
  const t = useTranslations("CategoryNav");

  const categoryData = categoryWithChildren || category;
  const children = categoryData.children || [];

  return (
    <NavigationMenuItem
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavigationMenuTrigger className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 font-medium border-0 h-9 px-3 rounded-full text-xs md:text-sm">
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 text-blue-600">
            {getCategoryIcon(category.name)}
          </div>
          <span className="truncate max-w-[80px] md:max-w-[100px]">
            {category.name}
          </span>
        </div>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid gap-3 p-4 w-[480px] grid-cols-2 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl border border-gray-100">
          {isLoading && isHovered ? (
            <div className="col-span-2 space-y-2.5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-2.5 rounded-lg"
                >
                  <div className="w-7 h-7 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-2.5">
                <h3 className="font-medium text-base text-gray-900 flex items-center border-b border-gray-100 pb-2">
                  <div className="w-4 h-4 mr-1.5 text-blue-600">
                    {getCategoryIcon(category.name)}
                  </div>
                  {category.name}
                </h3>
                <div className="space-y-1.5">
                  <ModernCategoryLink
                    href={`/categories/${category.id}`}
                    title={`All ${category.name}`}
                    icon={getCategoryIcon(category.name)}
                    image={category.image}
                    description={`Browse all ${category.name.toLowerCase()} products`}
                  />
                  {children.slice(0, 4).map((child) => (
                    <ModernCategoryLink
                      key={child.id}
                      href={`/categories/${child.id}`}
                      title={child.name}
                      icon={getCategoryIcon(child.name)}
                      image={child.image}
                      isPopular={child.popular > 0}
                    />
                  ))}
                </div>
              </div>

              {children.length > 4 && (
                <div className="space-y-2.5">
                  <h3 className="font-medium text-base text-gray-900 flex items-center border-b border-gray-100 pb-2">
                    <Plus className="h-4 w-4 mr-1.5 text-green-600" />
                    {t("moreOptions")}
                  </h3>
                  <div className="space-y-1.5">
                    {children.slice(4, 8).map((child) => (
                      <ModernCategoryLink
                        key={child.id}
                        href={`/categories/${child.id}`}
                        title={child.name}
                        icon={getCategoryIcon(child.name)}
                        image={child.image}
                        isPopular={child.popular > 0}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

// Deprecated components for backward compatibility
function CategoryLink({ href, title, icon, image }: any) {
  return (
    <ModernCategoryLink
      href={href}
      title={title}
      icon={icon}
      image={image}
    />
  );
}

function ParentCategorySection({ parentCategory, getCategoryIcon }: any) {
  return (
    <ModernCategoryDropdown
      category={parentCategory}
      getCategoryIcon={getCategoryIcon}
    />
  );
}

function DynamicCategoryDropdown({ parentCategory, getCategoryIcon }: any) {
  return (
    <ModernCategoryDropdown
      category={parentCategory}
      getCategoryIcon={getCategoryIcon}
    />
  );
}

function CompactCategoryLink({ href, title, icon, image }: any) {
  return (
    <ModernCategoryLink
      href={href}
      title={title}
      icon={icon}
      image={image}
    />
  );
}
