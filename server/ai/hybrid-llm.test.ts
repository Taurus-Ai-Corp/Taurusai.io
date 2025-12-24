import { describe, it, expect } from 'vitest';
import { generateAIResponse } from './chatService';
import { semanticSearch } from './semanticSearch';

describe('Hybrid LLM Integration (Ollama + Groq)', () => {
  it('should generate embeddings with Ollama and search documents', async () => {
    const results = await semanticSearch('What is BizFlow AI?', {
      matchThreshold: 0.5,
      matchCount: 3
    });

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    
    // Should find BizFlow AI product documentation
    const hasRelevantResult = results.some(r => 
      r.content.toLowerCase().includes('bizflow') ||
      r.metadata?.productSlug === 'bizflow-ai'
    );
    expect(hasRelevantResult).toBe(true);
  }, 30000);

  it('should generate AI responses with Groq using semantic search context', async () => {
    const response = await generateAIResponse(
      'What are the key features of Q-Grid?',
      []
    );

    expect(response).toBeDefined();
    expect(response.message).toBeDefined();
    expect(response.message.length).toBeGreaterThan(0);
    
    // Response should mention Q-Grid features
    const lowerMessage = response.message.toLowerCase();
    const hasRelevantInfo = 
      lowerMessage.includes('q-grid') ||
      lowerMessage.includes('quantum') ||
      lowerMessage.includes('cryptography');
    
    expect(hasRelevantInfo).toBe(true);
  }, 30000);

  it('should handle product-specific queries', async () => {
    const response = await generateAIResponse(
      'How much does BizFlow AI cost?',
      [],
      'bizflow-ai'
    );

    expect(response).toBeDefined();
    expect(response.message).toBeDefined();
    
    // Should mention pricing information
    const lowerMessage = response.message.toLowerCase();
    const hasPricingInfo = 
      lowerMessage.includes('price') ||
      lowerMessage.includes('cost') ||
      lowerMessage.includes('$') ||
      lowerMessage.includes('plan');
    
    expect(hasPricingInfo).toBe(true);
  }, 30000);

  it('should handle FAQ queries', async () => {
    const response = await generateAIResponse(
      'How long does implementation take?',
      []
    );

    expect(response).toBeDefined();
    expect(response.message).toBeDefined();
    
    // Should mention implementation timeframes
    const lowerMessage = response.message.toLowerCase();
    const hasImplementationInfo = 
      lowerMessage.includes('week') ||
      lowerMessage.includes('implementation') ||
      lowerMessage.includes('time');
    
    expect(hasImplementationInfo).toBe(true);
  }, 30000);

  it('should detect escalation keywords', async () => {
    const response = await generateAIResponse(
      'I need to speak with a human representative',
      []
    );

    expect(response).toBeDefined();
    expect(response.shouldEscalate).toBe(true);
  }, 30000);
});
