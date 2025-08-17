import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/vector-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Get search parameters with defaults
    const limit = Number(searchParams.get("limit") || 20); // Increased default limit
    const minScore = Number(searchParams.get("minScore") || 0.7); // Minimum relevance threshold

    // Optional filter parameters
    const filterCategory = searchParams.get("category") || null;

    // Build filter object
    const filter: Record<string, any> = {};
    if (filterCategory) {
      filter["metadata.category"] = filterCategory;
    }

    // Perform enhanced semantic search
    const results = await searchProducts(query, limit, filter, minScore);

    // Add debug info to help understand relevance
    const resultsWithDebug = results.map((result) => ({
      ...result,
      debug: {
        relevancePercentage: `${result.relevanceScore}%`,
      },
    }));

    return NextResponse.json({
      results: resultsWithDebug,
      meta: {
        query,
        totalResults: resultsWithDebug.length,
        searchParams: { limit, minScore, filterCategory },
      },
    });
  } catch (error) {
    console.error("Error during search:", error);
    return NextResponse.json(
      { error: "An error occurred during search" },
      { status: 500 }
    );
  }
}
