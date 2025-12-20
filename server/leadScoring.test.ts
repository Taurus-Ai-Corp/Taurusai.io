import { describe, it, expect } from 'vitest';
import { calculateLeadScore, getLeadPriority, getRecommendedAction } from './utils/leadScoring';

describe('Lead Scoring System', () => {
  describe('calculateLeadScore', () => {
    it('should calculate score based on company size', () => {
      const score = calculateLeadScore({
        companySize: '1000+',
      });
      expect(score).toBe(30); // 30 points for largest company size
    });

    it('should calculate score based on industry', () => {
      const score = calculateLeadScore({
        industry: 'Financial Services',
      });
      expect(score).toBe(25); // 25 points for financial services
    });

    it('should calculate score based on consultation type', () => {
      const score = calculateLeadScore({
        consultationType: 'Enterprise Implementation',
      });
      expect(score).toBe(25); // 25 points for enterprise implementation
    });

    it('should calculate score based on products interested', () => {
      const score = calculateLeadScore({
        productsInterested: ['BizFlow', 'Q-Grid', 'AssetGrid'],
      });
      expect(score).toBe(15); // 3 products * 5 points each
    });

    it('should calculate combined score correctly', () => {
      const score = calculateLeadScore({
        companySize: '1000+',
        industry: 'Financial Services',
        consultationType: 'Enterprise Implementation',
        productsInterested: ['BizFlow', 'Q-Grid', 'AssetGrid', 'Neovibe'],
      });
      // 30 (company) + 25 (industry) + 25 (consultation) + 20 (4 products, capped at 20) = 100
      expect(score).toBe(100);
    });

    it('should cap score at 100', () => {
      const score = calculateLeadScore({
        companySize: '1000+',
        industry: 'Financial Services',
        consultationType: 'Enterprise Implementation',
        productsInterested: ['BizFlow', 'Q-Grid', 'AssetGrid', 'Neovibe', 'Extra'],
      });
      expect(score).toBe(100); // Should not exceed 100
    });

    it('should handle missing fields gracefully', () => {
      const score = calculateLeadScore({});
      expect(score).toBe(0); // No points for missing fields
    });

    it('should handle small company correctly', () => {
      const score = calculateLeadScore({
        companySize: '1-10',
        industry: 'Other',
        consultationType: 'General Inquiry',
      });
      // 5 (small company) + 10 (other industry) + 10 (general inquiry) = 25
      expect(score).toBe(25);
    });
  });

  describe('getLeadPriority', () => {
    it('should return Critical for score >= 80', () => {
      expect(getLeadPriority(80)).toBe('Critical');
      expect(getLeadPriority(90)).toBe('Critical');
      expect(getLeadPriority(100)).toBe('Critical');
    });

    it('should return High for score >= 60 and < 80', () => {
      expect(getLeadPriority(60)).toBe('High');
      expect(getLeadPriority(70)).toBe('High');
      expect(getLeadPriority(79)).toBe('High');
    });

    it('should return Medium for score >= 40 and < 60', () => {
      expect(getLeadPriority(40)).toBe('Medium');
      expect(getLeadPriority(50)).toBe('Medium');
      expect(getLeadPriority(59)).toBe('Medium');
    });

    it('should return Low for score < 40', () => {
      expect(getLeadPriority(0)).toBe('Low');
      expect(getLeadPriority(20)).toBe('Low');
      expect(getLeadPriority(39)).toBe('Low');
    });
  });

  describe('getRecommendedAction', () => {
    it('should recommend immediate follow-up for critical leads', () => {
      const action = getRecommendedAction(85);
      expect(action).toContain('Immediate follow-up');
      expect(action).toContain('senior sales representative');
    });

    it('should recommend 24-hour follow-up for high priority leads', () => {
      const action = getRecommendedAction(65);
      expect(action).toContain('24 hours');
      expect(action).toContain('High potential');
    });

    it('should recommend 48-hour follow-up for medium priority leads', () => {
      const action = getRecommendedAction(45);
      expect(action).toContain('48 hours');
      expect(action).toContain('standard sales process');
    });

    it('should recommend nurture campaign for low priority leads', () => {
      const action = getRecommendedAction(25);
      expect(action).toContain('nurture campaign');
      expect(action).toContain('1 week');
    });
  });

  describe('Real-world scenarios', () => {
    it('should score enterprise financial services lead as Critical', () => {
      const score = calculateLeadScore({
        companySize: '1000+',
        industry: 'Financial Services',
        consultationType: 'Enterprise Implementation',
        productsInterested: ['BizFlow', 'Q-Grid'],
      });
      expect(score).toBeGreaterThanOrEqual(80);
      expect(getLeadPriority(score)).toBe('Critical');
    });

    it('should score mid-size healthcare lead as High', () => {
      const score = calculateLeadScore({
        companySize: '201-500',
        industry: 'Healthcare',
        consultationType: 'Technical Deep Dive',
        productsInterested: ['AssetGrid'],
      });
      expect(score).toBeGreaterThanOrEqual(60);
      expect(score).toBeLessThan(80);
      expect(getLeadPriority(score)).toBe('High');
    });

    it('should score small retail demo request as Medium', () => {
      const score = calculateLeadScore({
        companySize: '51-200',
        industry: 'Retail',
        consultationType: 'Product Demo',
        productsInterested: ['Neovibe'],
      });
      expect(score).toBeGreaterThanOrEqual(40);
      expect(score).toBeLessThan(60);
      expect(getLeadPriority(score)).toBe('Medium');
    });

    it('should score small education inquiry as Low', () => {
      const score = calculateLeadScore({
        companySize: '11-50',
        industry: 'Education',
        consultationType: 'General Inquiry',
      });
      expect(score).toBeLessThan(40);
      expect(getLeadPriority(score)).toBe('Low');
    });
  });
});
