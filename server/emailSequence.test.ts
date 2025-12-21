import { describe, it, expect } from 'vitest';

describe('Email Sequence System', () => {
  it('should have three sequence templates defined', async () => {
    const { allSequenceTemplates } = await import('./utils/sequenceTemplates');
    
    expect(allSequenceTemplates).toHaveLength(3);
    expect(allSequenceTemplates[0].name).toBe('High-Priority Lead Nurture');
    expect(allSequenceTemplates[1].name).toBe('Medium-Priority Lead Nurture');
    expect(allSequenceTemplates[2].name).toBe('Low-Priority Lead Nurture');
  });

  it('should have correct score ranges for each sequence', async () => {
    const { highPrioritySequence, mediumPrioritySequence, lowPrioritySequence } = await import('./utils/sequenceTemplates');
    
    // High priority: 60-100
    expect(highPrioritySequence.targetScoreMin).toBe(60);
    expect(highPrioritySequence.targetScoreMax).toBe(100);
    
    // Medium priority: 40-59
    expect(mediumPrioritySequence.targetScoreMin).toBe(40);
    expect(mediumPrioritySequence.targetScoreMax).toBe(59);
    
    // Low priority: 0-39
    expect(lowPrioritySequence.targetScoreMin).toBe(0);
    expect(lowPrioritySequence.targetScoreMax).toBe(39);
  });

  it('should have appropriate email counts for each sequence', async () => {
    const { highPrioritySequence, mediumPrioritySequence, lowPrioritySequence } = await import('./utils/sequenceTemplates');
    
    // High priority gets 4 emails (aggressive)
    expect(highPrioritySequence.emails).toHaveLength(4);
    
    // Medium priority gets 3 emails (moderate)
    expect(mediumPrioritySequence.emails).toHaveLength(3);
    
    // Low priority gets 2 emails (light touch)
    expect(lowPrioritySequence.emails).toHaveLength(2);
  });

  it('should have correct delay patterns', async () => {
    const { highPrioritySequence } = await import('./utils/sequenceTemplates');
    
    // High priority sequence: Day 0, 3, 7, 14
    expect(highPrioritySequence.emails[0].delayDays).toBe(0);
    expect(highPrioritySequence.emails[1].delayDays).toBe(3);
    expect(highPrioritySequence.emails[2].delayDays).toBe(7);
    expect(highPrioritySequence.emails[3].delayDays).toBe(14);
  });

  it('should have template variables in email content', async () => {
    const { highPrioritySequence } = await import('./utils/sequenceTemplates');
    
    const firstEmail = highPrioritySequence.emails[0];
    
    // Check that body contains template variables
    expect(firstEmail.body).toContain('{{firstName}}');
    expect(firstEmail.body).toContain('{{company}}');
  });

  it('should have sequential step numbers', async () => {
    const { highPrioritySequence } = await import('./utils/sequenceTemplates');
    
    highPrioritySequence.emails.forEach((email, index) => {
      expect(email.stepNumber).toBe(index + 1);
    });
  });

  it('should target new leads by default', async () => {
    const { allSequenceTemplates } = await import('./utils/sequenceTemplates');
    
    allSequenceTemplates.forEach(sequence => {
      expect(sequence.targetStatus).toBe('new');
    });
  });

  it('should have HTML email bodies', async () => {
    const { highPrioritySequence } = await import('./utils/sequenceTemplates');
    
    highPrioritySequence.emails.forEach(email => {
      expect(email.body).toContain('<!DOCTYPE html>');
      expect(email.body).toContain('</html>');
    });
  });

  it('should have appropriate CTAs for each priority level', async () => {
    const { highPrioritySequence, mediumPrioritySequence, lowPrioritySequence } = await import('./utils/sequenceTemplates');
    
    // High priority: aggressive CTAs (Schedule Demo)
    expect(highPrioritySequence.emails[0].body).toContain('Schedule a Demo');
    
    // Medium priority: softer CTAs (Explore Resources)
    expect(mediumPrioritySequence.emails[0].body).toContain('Explore Resources');
    
    // Low priority: minimal CTAs (Visit Our Website)
    expect(lowPrioritySequence.emails[0].body).toContain('Visit Our Website');
  });
});

describe('Email Sequence Scheduler', () => {
  it('should export processEmailSequences function', async () => {
    const { processEmailSequences } = await import('./scheduler/emailSequenceScheduler');
    
    expect(typeof processEmailSequences).toBe('function');
  });

  it('should export startEmailSequenceScheduler function', async () => {
    const { startEmailSequenceScheduler } = await import('./scheduler/emailSequenceScheduler');
    
    expect(typeof startEmailSequenceScheduler).toBe('function');
  });
});
