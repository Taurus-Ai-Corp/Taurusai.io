import { supabaseAdmin } from '../supabase';
import { ENV } from '../_core/env';

export interface SearchResult {
  id: string;
  content: string;
  metadata: Record<string, any>;
  product_slug?: string;
  similarity: number;
}

/**
 * Generate embedding for text using OpenAI
 */
async function generateEmbedding(text: string): Promise<number[]> {
  if (!ENV.openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ENV.openaiApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Perform semantic search using vector similarity
 */
export async function semanticSearch(
  query: string,
  options: {
    productSlug?: string;
    matchThreshold?: number;
    matchCount?: number;
  } = {}
): Promise<SearchResult[]> {
  const {
    productSlug,
    matchThreshold = 0.78,
    matchCount = 10
  } = options;

  // Generate embedding for search query
  const queryEmbedding = await generateEmbedding(query);

  // Search using cosine similarity
  const { data, error } = await supabaseAdmin.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
    filter_product: productSlug || null
  });

  if (error) {
    throw new Error(`Semantic search error: ${error.message}`);
  }

  return data || [];
}

/**
 * Store document with embedding in vector database
 */
export async function storeDocument(
  content: string,
  metadata: Record<string, any> = {},
  productSlug?: string
): Promise<string> {
  // Generate embedding
  const embedding = await generateEmbedding(content);

  // Store in database
  const { data, error } = await supabaseAdmin
    .from('documents')
    .insert({
      content,
      metadata,
      embedding,
      product_slug: productSlug
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to store document: ${error.message}`);
  }

  return data.id;
}

/**
 * Update document embedding
 */
export async function updateDocument(
  documentId: string,
  content: string,
  metadata?: Record<string, any>
): Promise<void> {
  // Generate new embedding
  const embedding = await generateEmbedding(content);

  // Update in database
  const updateData: any = {
    content,
    embedding
  };

  if (metadata) {
    updateData.metadata = metadata;
  }

  const { error } = await supabaseAdmin
    .from('documents')
    .update(updateData)
    .eq('id', documentId);

  if (error) {
    throw new Error(`Failed to update document: ${error.message}`);
  }
}

/**
 * Delete document from vector database
 */
export async function deleteDocument(documentId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('documents')
    .delete()
    .eq('id', documentId);

  if (error) {
    throw new Error(`Failed to delete document: ${error.message}`);
  }
}
