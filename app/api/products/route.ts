import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { storeProductEmbeddings } from "@/lib/vector-utils";

export async function POST(request: NextRequest) {
  try {
    // Handle multipart form data for file upload
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File | null;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createSupabaseAdminClient();
    let imageUrl = null;

    // Handle image upload to Supabase Storage if image is provided
    if (imageFile) {
      // Generate a unique filename with original extension and timestamp
      const timestamp = Date.now();
      const fileName = `${timestamp}-${imageFile.name.replace(/\s+/g, "-")}`;
      const filePath = `${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }

      // Get the public URL for the uploaded image
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    // Create product in database
    const { data: product, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          image_url: imageUrl,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      );
    }

    // Generate and store embeddings
    const embeddingResult = await storeProductEmbeddings([
      {
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.image_url || "",
      },
    ]);

    if (!embeddingResult.success) {
      console.error("Error generating embeddings:", embeddingResult.error);
      // Product was created but embeddings failed
      return NextResponse.json(
        {
          warning: "Product created but embeddings failed",
          product: product,
        },
        { status: 201 }
      );
    }

    return NextResponse.json({ product: product }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    // Transform the data to match our Product interface
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      imageUrl: product.image_url || "",
    }));

    return NextResponse.json({ products: transformedProducts });
  } catch (error) {
    console.error("Error in GET /api/products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
