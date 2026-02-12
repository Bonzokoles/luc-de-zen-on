/**
 * HuggingFace MiniHelper - Semantic Search Example
 * 
 * This endpoint demonstrates how to use HuggingFace's lightweight embedding models
 * for semantic search without requiring large language models.
 * 
 * Model: sentence-transformers/all-MiniLM-L6-v2 (80MB, very fast)
 * Use case: Search for similar documents based on query
 */

import type { APIRoute } from 'astro';

const HF_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { query, documents } = await request.json();
    const env = locals.runtime?.env || import.meta.env;
    
    // Validate input
    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query is required and must be a string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Documents array is required and cannot be empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get HF token from environment
    const hfToken = Object.entries(env).find(([k]) => k.trim() === 'HF_TOKEN')?.[1];
    
    if (!hfToken) {
      return new Response(
        JSON.stringify({ 
          error: 'HF_TOKEN not configured',
          hint: 'Run: npx wrangler pages secret put HF_TOKEN'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query, hfToken);
    
    // Generate embeddings for all documents
    // Note: In production, these should be pre-computed and cached
    const docResults = await Promise.all(
      documents.map(async (doc, idx) => {
        const text = typeof doc === 'string' ? doc : doc.text || '';
        const embedding = await generateEmbedding(text, hfToken);
        const similarity = cosineSimilarity(queryEmbedding, embedding);
        
        return {
          index: idx,
          text,
          title: typeof doc === 'object' ? doc.title : `Document ${idx + 1}`,
          similarity,
          metadata: typeof doc === 'object' ? doc.metadata : {}
        };
      })
    );
    
    // Sort by similarity (highest first) and take top 5
    const results = docResults
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);
    
    return new Response(
      JSON.stringify({
        query,
        results,
        model: HF_MODEL,
        totalDocuments: documents.length
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error: any) {
    console.error('Semantic search error:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        details: error.response?.statusText
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

/**
 * Generate embedding using HuggingFace Inference API
 */
async function generateEmbedding(text: string, token: string): Promise<number[]> {
  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: text,
      options: { wait_for_model: true }
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HuggingFace API error (${response.status}): ${errorText}`);
  }
  
  const result = await response.json();
  
  // HF API returns array directly for embedding models
  return Array.isArray(result) ? result : result.embeddings || [];
}

/**
 * Calculate cosine similarity between two vectors
 * Returns value between -1 and 1 (higher = more similar)
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}
