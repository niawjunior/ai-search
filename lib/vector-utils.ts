import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { createSupabaseAdminClient } from "./supabase";

// Product type definition
export interface Product {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  metadata?: Record<string, any>;
}

// Create embeddings for products and store them in Supabase
export async function storeProductEmbeddings(products: Product[]) {
  try {
    const client = createSupabaseAdminClient();
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Convert products to documents for LangChain
    const documents = products.map(
      (product) =>
        new Document({
          pageContent: `${product.name} ${product.description}`,
          metadata: {
            id: product.id,
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            ...product.metadata,
          },
        })
    );

    // Store documents with embeddings
    await SupabaseVectorStore.fromDocuments(documents, embeddings, {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

    return { success: true };
  } catch (error) {
    console.error("Error storing product embeddings:", error);
    return { success: false, error };
  }
}

// Search for products using semantic search with improved relevance ranking
export async function searchProducts(
  query: string,
  limit = 10,
  filter = {},
  minScore = 0.7
) {
  try {
    const client = createSupabaseAdminClient();
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Create vector store
    const vectorStore = new SupabaseVectorStore(embeddings, {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

    // Perform similarity search with scores
    const results = await vectorStore.similaritySearchWithScore(
      query,
      limit,
      filter
    );

    // Process results with scores
    const processedResults = results
      .map(([doc, score]) => ({
        id: doc.metadata.id,
        name: doc.metadata.name,
        description: doc.metadata.description,
        imageUrl: doc.metadata.imageUrl,
        // Convert cosine similarity score to percentage (0-100)
        // In LangChain's similaritySearchWithScore, higher scores (closer to 1) mean more similar
        // The score is a cosine similarity, so 1 is perfect match and lower numbers are worse matches
        relevanceScore: Math.round(score * 100),
        similarity: doc.metadata.similarity,
        // Add additional ranking factors if available
        ...(doc.metadata.popularity && { popularity: doc.metadata.popularity }),
        ...(doc.metadata.rating && { rating: doc.metadata.rating }),
      }))
      // Filter out results with very low relevance
      .filter((result) => result.relevanceScore / 100 >= minScore)
      // Sort by relevance score (highest first)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    return processedResults;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}
