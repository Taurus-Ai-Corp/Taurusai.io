-- Create the match_documents function for vector similarity search
-- This function should be run in your Supabase SQL editor

CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_product text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  product_slug text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    documents.metadata,
    documents.product_slug,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 
    (filter_product IS NULL OR documents.product_slug = filter_product)
    AND 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION match_documents TO authenticated;
GRANT EXECUTE ON FUNCTION match_documents TO anon;
