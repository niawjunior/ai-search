import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import z from "zod";
import { searchProducts } from "@/lib/vector-utils";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4.1"),
    system: `You are a product search assistant for an e-commerce store. Your primary role is to help users find products using semantic search technology. You have access to a database of products with names, descriptions, and images stored in Supabase with pgvector for similarity search.

When responding to users:
1. Focus on helping them find products based on their queries
2. Provide relevant product information including names, descriptions, and similarity match percentages
3. Be concise and helpful in your product descriptions
4. If asked about specific product details that aren't in the search results, politely explain that you can only provide information about products in the search results
5. Suggest refining search terms if results aren't what the user is looking for
6. Format product listings in a clear, readable way with product names in bold

Your goal is to create a seamless product discovery experience through natural conversation.`,
    messages: convertToModelMessages(messages),
    tools: {
      search: {
        description: "Search for products in the database",
        inputSchema: z.object({
          query: z.string().describe("The search query"),
        }),
        execute: async ({ query }: { query: string }) => {
          try {
            // Directly use the searchProducts function instead of making a server-side fetch
            // This avoids URL encoding issues and is more efficient

            // Get search results with default parameters
            const limit = 10;
            const minScore = 0.1;
            const filter = {};

            console.log("Searching for products with query:", query);
            const results = await searchProducts(
              query,
              limit,
              filter,
              minScore
            );

            // Add debug info to help understand relevance
            const resultsWithDebug = results.map((result) => ({
              ...result,
              debug: {
                relevancePercentage: `${result.relevanceScore}%`,
              },
            }));

            console.log(`Found ${resultsWithDebug} results`);
            return resultsWithDebug;
          } catch (error) {
            console.error("Error searching products:", error);
            return [];
          }
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
