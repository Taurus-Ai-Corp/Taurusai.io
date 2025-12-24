import { describe, it, expect, vi } from 'vitest';
import { generateAIChatResponse, shouldEscalateToHuman } from './chatService';

// Mock semantic search
vi.mock('./semanticSearch', () => ({
  semanticSearch: vi.fn().mockResolvedValue([
    {
      content: 'Taurus AI offers BizFlow AI for business workflow automation.',
      similarity: 0.85
    },
    {
      content: 'Q-Grid provides quantum-safe infrastructure with post-quantum cryptography.',
      similarity: 0.82
    }
  ])
}));

describe('AI Chat Service', () => {
  describe('generateAIChatResponse', () => {
    it('should generate AI response with context from semantic search', async () => {
      const response = await generateAIChatResponse(
        'Tell me about your products',
        []
      );

      expect(response).toBeDefined();
      expect(response.message).toBeTruthy();
      expect(typeof response.message).toBe('string');
      expect(response.confidence).toBeGreaterThan(0);
      expect(response.confidence).toBeLessThanOrEqual(1);
      expect(response.sources).toBeDefined();
      expect(response.sources?.length).toBeGreaterThan(0);
    }, 30000); // 30 second timeout for API call

    it('should include conversation history in context', async () => {
      const conversationHistory = [
        { role: 'user' as const, content: 'Hello' },
        { role: 'assistant' as const, content: 'Hi! How can I help you?' }
      ];

      const response = await generateAIChatResponse(
        'What products do you offer?',
        conversationHistory
      );

      expect(response).toBeDefined();
      expect(response.message).toBeTruthy();
    }, 30000);
  });

  describe('shouldEscalateToHuman', () => {
    it('should escalate when user explicitly requests human', () => {
      expect(shouldEscalateToHuman('I want to speak to a human', 0.9)).toBe(true);
      expect(shouldEscalateToHuman('Can I talk to a real person?', 0.9)).toBe(true);
      expect(shouldEscalateToHuman('Get me a human agent', 0.9)).toBe(true);
    });

    it('should escalate when confidence is low', () => {
      expect(shouldEscalateToHuman('What is your pricing?', 0.5)).toBe(true);
      expect(shouldEscalateToHuman('Tell me about your services', 0.4)).toBe(true);
    });

    it('should not escalate for normal queries with good confidence', () => {
      expect(shouldEscalateToHuman('What products do you offer?', 0.8)).toBe(false);
      expect(shouldEscalateToHuman('Tell me about Q-Grid', 0.75)).toBe(false);
    });

    it('should escalate for urgent or complaint keywords', () => {
      expect(shouldEscalateToHuman('This is urgent!', 0.8)).toBe(true);
      expect(shouldEscalateToHuman('I have a complaint', 0.8)).toBe(true);
      expect(shouldEscalateToHuman('This is not working', 0.8)).toBe(true);
    });
  });
});
