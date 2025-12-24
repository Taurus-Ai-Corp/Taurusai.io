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
 * Generate embeddings using Ollama's nomic-embed-text model (local, no rate limits)
 * Falls back to HuggingFace if Ollama is not available
 */
async function generateEmbedding(text: string): Promise<number[]> {
  // Try Ollama first (local, unlimited, free)
  try {
    const ollamaResponse = await fetch('http://localhost:11434/api/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'nomic-embed-text',
        prompt: text
      })
    });

    if (ollamaResponse.ok) {
      const data = await ollamaResponse.json();
      let embedding = data.embedding;
      
      // Pad to 1536 dimensions if needed (Ollama nomic-embed-text is 768)
      if (embedding.length < 1536) {
        embedding = [...embedding, ...Array(1536 - embedding.length).fill(0)];
      }
      
      return embedding;
    }
  } catch (error) {
    console.warn('Ollama not available, falling back to HuggingFace:', error);
  }

  // Fallback to HuggingFace (free tier, some rate limits)
  if (ENV.hfApiKey) {
    const hfResponse = await fetch('https://api-inference.huggingface.co/models/BAAI/bge-large-en-v1.5', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ENV.hfApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: text })
    });

    if (hfResponse.ok) {
      const embedding = await hfResponse.json();
      return embedding;
    }
  }

  // Final fallback to OpenAI if available
  if (ENV.openaiApiKey) {
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

  throw new Error('No embedding service available (Ollama, HuggingFace, or OpenAI)');
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
  id: string,
  content: string,
  metadata: Record<string, any> = {}
): Promise<string> {
  // Generate embedding
  const embedding = await generateEmbedding(content);

  // Store in database
  const { data, error } = await supabaseAdmin
    .from('documents')
    .insert({
      id,
      content,
      metadata,
      embedding,
      product_slug: metadata.productSlug
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
