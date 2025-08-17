# AI Product Search Demo

This is a demonstration project showcasing how to implement AI-powered semantic search for products using Supabase Vector Database (pgvector) and LangChain.

## Features

- AI-powered semantic search using OpenAI embeddings
- Vector similarity search with Supabase pgvector
- Product creation with name, description, and image URL
- Modern UI built with Next.js and shadcn/ui components
- Full-stack TypeScript implementation

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase with pgvector extension
- **AI/ML**: LangChain, OpenAI Embeddings

## Prerequisites

- Node.js 18+ and npm
- Supabase account with pgvector extension enabled
- OpenAI API key

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

4. Set up your Supabase database with the following SQL:

```sql
-- Enable the pgvector extension to work with embedding vectors
create extension vector;

-- Create a table to store your documents
create table documents (
  id bigserial primary key,
  content text, -- corresponds to Document.pageContent
  metadata jsonb, -- corresponds to Document.metadata
  embedding vector(1536) -- 1536 works for OpenAI embeddings, change if needed
);

-- Create a function to search for documents
create function match_documents (
  query_embedding vector(1536),
  match_count int default null,
  filter jsonb DEFAULT '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create a products table
create table products (
  id bigserial primary key,
  name text not null,
  description text not null,
  image_url text,
  created_at timestamp with time zone default now()
);
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Click "Add Product" to create a new product with name, description, and image URL
2. Use the search bar at the top to perform semantic searches across your products
3. View search results with relevance scores

## How It Works

1. When a product is created, its text content (name and description) is embedded using OpenAI's embedding model
2. These embeddings are stored in the Supabase vector database
3. When a search query is entered, the query is also embedded using the same model
4. Supabase's pgvector extension finds products with similar embeddings to the query
5. Results are returned based on vector similarity
