import CategoryProducts from "@/components/category-products";
import { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;

  // You can enhance this by actually fetching the category data
  // const category = await getCategoryWithChildren(+id);

  return {
    title: `Category Products - Narmer`,
    description: `Browse and shop products from our carefully curated category collection. Find the best deals and latest products.`,
    keywords: "products, category, shopping, e-commerce, deals",
    openGraph: {
      title: `Category Products - Narmer`,
      description: `Browse and shop products from our carefully curated category collection.`,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `Category Products - Narmer`,
      description: `Browse and shop products from our carefully curated category collection.`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;

  return <CategoryProducts categoryId={+id} />;
}
