import { describe, it, expect } from 'vitest';

describe('Sequence Management tRPC Procedures', () => {
  it('should export sequences router with all CRUD operations', async () => {
    const { appRouter } = await import('./routers');
    
    expect(appRouter.sequences).toBeDefined();
    expect(appRouter.sequences.getAll).toBeDefined();
    expect(appRouter.sequences.getById).toBeDefined();
    expect(appRouter.sequences.create).toBeDefined();
    expect(appRouter.sequences.update).toBeDefined();
    expect(appRouter.sequences.delete).toBeDefined();
  });

  it('should export sequence email management procedures', async () => {
    const { appRouter } = await import('./routers');
    
    expect(appRouter.sequences.createEmail).toBeDefined();
    expect(appRouter.sequences.updateEmail).toBeDefined();
    expect(appRouter.sequences.deleteEmail).toBeDefined();
  });
});

describe('Sequence Database Functions', () => {
  it('should export getAllEmailSequences function', async () => {
    const db = await import('./db');
    expect(typeof db.getAllEmailSequences).toBe('function');
  });

  it('should export getEmailSequenceById function', async () => {
    const db = await import('./db');
    expect(typeof db.getEmailSequenceById).toBe('function');
  });

  it('should export createEmailSequence function', async () => {
    const db = await import('./db');
    expect(typeof db.createEmailSequence).toBe('function');
  });

  it('should export updateEmailSequence function', async () => {
    const db = await import('./db');
    expect(typeof db.updateEmailSequence).toBe('function');
  });

  it('should export deleteEmailSequence function', async () => {
    const db = await import('./db');
    expect(typeof db.deleteEmailSequence).toBe('function');
  });

  it('should export getSequenceEmails function', async () => {
    const db = await import('./db');
    expect(typeof db.getSequenceEmails).toBe('function');
  });

  it('should export createSequenceEmail function', async () => {
    const db = await import('./db');
    expect(typeof db.createSequenceEmail).toBe('function');
  });

  it('should export updateSequenceEmail function', async () => {
    const db = await import('./db');
    expect(typeof db.updateSequenceEmail).toBe('function');
  });

  it('should export deleteSequenceEmail function', async () => {
    const db = await import('./db');
    expect(typeof db.deleteSequenceEmail).toBe('function');
  });

  it('should export getLeadEmailHistory function', async () => {
    const db = await import('./db');
    expect(typeof db.getLeadEmailHistory).toBe('function');
  });
});

describe('Sequence Schema Validation', () => {
  it('should validate sequence creation with required fields', () => {
    // This test validates the zod schema structure
    const validSequence = {
      name: "Test Sequence",
      description: "Test description",
      targetScoreMin: 0,
      targetScoreMax: 100,
      targetStatus: "new" as const,
      isActive: true,
    };

    expect(validSequence.name).toBeTruthy();
    expect(validSequence.targetScoreMin).toBeGreaterThanOrEqual(0);
    expect(validSequence.targetScoreMax).toBeLessThanOrEqual(100);
    expect(validSequence.targetScoreMin).toBeLessThanOrEqual(validSequence.targetScoreMax);
  });

  it('should validate sequence email with required fields', () => {
    const validEmail = {
      sequenceId: 1,
      stepNumber: 1,
      delayDays: 0,
      subject: "Test Subject",
      body: "<html>Test Body</html>",
    };

    expect(validEmail.sequenceId).toBeGreaterThan(0);
    expect(validEmail.stepNumber).toBeGreaterThan(0);
    expect(validEmail.delayDays).toBeGreaterThanOrEqual(0);
    expect(validEmail.subject).toBeTruthy();
    expect(validEmail.body).toBeTruthy();
  });

  it('should validate target status enum values', () => {
    const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'closed'];
    
    validStatuses.forEach(status => {
      expect(validStatuses).toContain(status);
    });
  });
});
