import { getProducts } from "@/actions/products";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const productsData = await getProducts(query.trim(), 1, 5);

    const searchResults = productsData.data.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
    }));

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json([]);
  }
}
