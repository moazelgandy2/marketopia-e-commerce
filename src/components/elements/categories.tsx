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
  Star,
  ChevronRight,
  Grid3X3,
  ArrowRight,
  Zap,
  Tag,
  Eye,
  Heart,
  Plus,
  Search,
  Filter,
  Menu,
  X,
  Flame,
  Crown,
  Layers,
  ChevronDown,
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
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Main Navigation */}
          <div className="flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center space-x-2">
                {/* All Categories Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-gradient-to-r from-blue-600 to-slate-600 text-white hover:from-blue-700 hover:to-slate-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 border-0 h-10 px-6 rounded-lg text-sm">
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    {t("allCategories")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-4 p-6 w-[600px] lg:w-[800px] grid-cols-3 bg-gradient-to-br from-gray-50 to-white shadow-xl rounded-xl">
                      {/* Popular Categories */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center border-b border-gray-200 pb-2">
                          <Flame className="h-5 w-5 mr-2 text-orange-500" />
                          {t("popular")}
                        </h3>
                        <div className="space-y-2">
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
                        <h3 className="font-bold text-lg text-gray-900 flex items-center border-b border-gray-200 pb-2">
                          <Crown className="h-5 w-5 mr-2 text-amber-500" />
                          {t("featured")}
                        </h3>
                        <div className="space-y-2">
                          {getFeaturedCategories().map((category: any) => (
                            <ModernCategoryLink
                              key={category.name}
                              href={category.href}
                              title={category.name}
                              icon={category.icon}
                              image={category.image}
                              description={category.description}
                            />
                          ))}
                        </div>
                      </div>

                      {/* All Categories */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center border-b border-gray-200 pb-2">
                          <Layers className="h-5 w-5 mr-2 text-blue-500" />
                          {t("allCategoriesTitle")}
                        </h3>
                        <div className="space-y-2">
                          {getParentCategories()
                            .slice(0, 6)
                            .map((category: any) => (
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
                <div className="hidden md:flex items-center space-x-1">
                  {getParentCategories()
                    .slice(0, 5)
                    .map((category: any) => (
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
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* View All Link */}
          <Link
            href="/categories"
            className="hidden md:flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors bg-gray-50 hover:bg-blue-50 px-4 py-2 rounded-lg"
          >
            <Eye className="h-4 w-4" />
            <span>{t("viewAll")}</span>
          </Link>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {getParentCategories()
                .slice(0, 6)
                .map((category: any) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-slate-100 rounded-lg flex items-center justify-center">
                      {getCategoryIcon(category.name)}
                    </div>
                    <span className="font-medium text-gray-900">
                      {category.name}
                    </span>
                  </Link>
                ))}
              <Link
                href="/categories"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-blue-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-slate-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-4 w-4" />
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
        className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-50 transition-all duration-300 border border-transparent hover:border-blue-200 hover:shadow-md"
      >
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-slate-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-slate-200 transition-all duration-300">
            {image ? (
              <div className="w-5 h-5 relative overflow-hidden rounded">
                <Image
                  src={getImageUrl(image)}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="20px"
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
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
              <Flame className="h-2 w-2 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {title}
          </div>
          {description && (
            <div className="text-xs text-gray-500 mt-1 truncate">
              {description}
            </div>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100" />
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
      <NavigationMenuTrigger className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-50 transition-all duration-300 font-medium border border-transparent hover:border-blue-200 hover:shadow-md h-10 px-4 rounded-lg text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 text-blue-600">
            {getCategoryIcon(category.name)}
          </div>
          <span className="truncate max-w-[100px]">{category.name}</span>
        </div>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid gap-4 p-6 w-[500px] grid-cols-2 bg-gradient-to-br from-gray-50 to-white shadow-xl rounded-xl">
          {isLoading && isHovered ? (
            <div className="col-span-2 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-3 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-gray-900 flex items-center border-b border-gray-200 pb-2">
                  <div className="w-5 h-5 mr-2 text-blue-600">
                    {getCategoryIcon(category.name)}
                  </div>
                  {category.name}
                </h3>
                <div className="space-y-2">
                  <ModernCategoryLink
                    href={`/categories/${category.id}`}
                    title={t("allCategory", { categoryName: category.name })}
                    icon={getCategoryIcon(category.name)}
                    image={category.image}
                    description={t("browseAll", {
                      categoryName: category.name.toLowerCase(),
                    })}
                  />
                  {children.slice(0, 4).map((child: any) => (
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
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center border-b border-gray-200 pb-2">
                    <Plus className="h-5 w-5 mr-2 text-green-600" />
                    {t("moreOptions")}
                  </h3>
                  <div className="space-y-2">
                    {children.slice(4, 8).map((child: any) => (
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
