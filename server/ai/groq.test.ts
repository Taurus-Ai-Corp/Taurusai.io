import { describe, it, expect } from 'vitest';
import { ENV } from '../_core/env';

describe('Groq API Integration', () => {
  it('should have Groq API key configured', () => {
    expect(ENV.groqApiKey).toBeDefined();
    expect(ENV.groqApiKey.length).toBeGreaterThan(0);
  });

  it('should generate chat completions with Groq API', async () => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ENV.groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say "Hello from Groq!" if you can read this.' }
        ],
        temperature: 0.7,
        max_tokens: 50
      })
    });

    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data).toBeDefined();
    expect(data.choices).toBeDefined();
    expect(data.choices.length).toBeGreaterThan(0);
    expect(data.choices[0].message.content).toBeDefined();
    expect(data.choices[0].message.content.length).toBeGreaterThan(0);
    
    console.log('Groq response:', data.choices[0].message.content);
  }, 30000);

  it('should generate embeddings with Ollama', async () => {
    const response = await fetch('http://localhost:11434/api/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'nomic-embed-text',
        prompt: 'Test embedding generation'
      })
    });

    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data).toBeDefined();
    expect(data.embedding).toBeDefined();
    expect(Array.isArray(data.embedding)).toBe(true);
    expect(data.embedding.length).toBe(768); // nomic-embed-text produces 768-dimensional embeddings
    
    console.log('Ollama embedding dimensions:', data.embedding.length);
  }, 30000);
});
