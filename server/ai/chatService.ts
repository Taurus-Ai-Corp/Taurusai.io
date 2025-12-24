import { semanticSearch } from './semanticSearch';
import { ENV } from '../_core/env';

export interface ChatContext {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  confidence: number;
  sources?: Array<{ content: string; similarity: number }>;
}

/**
 * Generate AI response using OpenAI with semantic search context
 */
export async function generateAIChatResponse(
  userMessage: string,
  conversationHistory: ChatContext[] = [],
  productSlug?: string
): Promise<ChatResponse> {
  if (!ENV.openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // Search for relevant context using semantic search
  const relevantDocs = await semanticSearch(userMessage, {
    productSlug,
    matchThreshold: 0.75,
    matchCount: 3
  });

  // Build context from search results
  const contextText = relevantDocs.length > 0
    ? relevantDocs.map(doc => doc.content).join('\n\n')
    : '';

  // System prompt with company context
  const systemPrompt = `You are a helpful AI assistant for Taurus AI Corp, an enterprise AI company specializing in quantum-safe infrastructure and agentic AI solutions.

Our products:
- BizFlow AI: Business workflow automation platform
- Q-Grid: Quantum computing grid infrastructure with post-quantum cryptography
- NeoVibe: Next-generation creative AI platform
- AssetGrid: Digital asset management system

${contextText ? `Relevant information from our knowledge base:\n${contextText}\n\n` : ''}

Guidelines:
- Be professional, helpful, and concise
- If you don't know something, admit it and offer to connect them with a human expert
- Focus on understanding their needs and recommending the right solution
- Mention specific products when relevant
- If they want to schedule a consultation or demo, encourage them to use the "Request Demo" button
- If the question is complex or requires human expertise, suggest escalating to a human support agent`;

  // Build messages array
  const messages: ChatContext[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  // Call OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ENV.openaiApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const aiMessage = data.choices[0].message.content;

  // Calculate confidence based on semantic search results
  const avgSimilarity = relevantDocs.length > 0
    ? relevantDocs.reduce((sum, doc) => sum + doc.similarity, 0) / relevantDocs.length
    : 0.5;

  return {
    message: aiMessage,
    confidence: avgSimilarity,
    sources: relevantDocs.map(doc => ({
      content: doc.content.substring(0, 200) + '...',
      similarity: doc.similarity
    }))
  };
}

/**
 * Stream AI response for real-time chat experience
 */
export async function* streamAIChatResponse(
  userMessage: string,
  conversationHistory: ChatContext[] = [],
  productSlug?: string
): AsyncGenerator<string> {
  if (!ENV.openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // Search for relevant context
  const relevantDocs = await semanticSearch(userMessage, {
    productSlug,
    matchThreshold: 0.75,
    matchCount: 3
  });

  const contextText = relevantDocs.length > 0
    ? relevantDocs.map(doc => doc.content).join('\n\n')
    : '';

  const systemPrompt = `You are a helpful AI assistant for Taurus AI Corp, an enterprise AI company specializing in quantum-safe infrastructure and agentic AI solutions.

Our products:
- BizFlow AI: Business workflow automation platform
- Q-Grid: Quantum computing grid infrastructure with post-quantum cryptography
- NeoVibe: Next-generation creative AI platform
- AssetGrid: Digital asset management system

${contextText ? `Relevant information:\n${contextText}\n\n` : ''}

Be professional, helpful, and concise. If unsure, offer to connect them with a human expert.`;

  const messages: ChatContext[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ENV.openaiApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }
}

/**
 * Determine if a message should be escalated to human support
 */
export function shouldEscalateToHuman(
  userMessage: string,
  confidence: number
): boolean {
  const escalationKeywords = [
    'speak to a human',
    'speak to human',
    'talk to a real person',
    'talk to person',
    'real person',
    'human support',
    'human agent',
    'agent',
    'representative',
    'urgent',
    'complaint',
    'problem',
    'issue',
    'not working',
    'broken',
    'frustrated'
  ];

  const lowerMessage = userMessage.toLowerCase();
  const hasEscalationKeyword = escalationKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );

  // Escalate if:
  // 1. User explicitly asks for human
  // 2. AI confidence is low (< 0.6)
  return hasEscalationKeyword || confidence < 0.6;
}
