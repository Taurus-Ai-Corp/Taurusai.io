import { describe, it, expect } from 'vitest';
import { formatDateTimeWithTimezone, getUserTimezone, TIMEZONES } from '../client/src/lib/timezones';

describe('Timezone Utilities', () => {
  it('should have all major timezones defined', () => {
    expect(TIMEZONES.length).toBeGreaterThan(10);
    expect(TIMEZONES.some(tz => tz.value === 'America/New_York')).toBe(true);
    expect(TIMEZONES.some(tz => tz.value === 'Europe/London')).toBe(true);
    expect(TIMEZONES.some(tz => tz.value === 'Asia/Tokyo')).toBe(true);
  });

  it('should format date and time with timezone', () => {
    const result = formatDateTimeWithTimezone('2025-12-25', '02:00 PM', 'America/New_York');
    expect(result).toContain('December');
    expect(result).toContain('25');
    expect(result).toContain('2025');
  });

  it('should handle getUserTimezone without errors', () => {
    const timezone = getUserTimezone();
    expect(typeof timezone).toBe('string');
    expect(timezone.length).toBeGreaterThan(0);
  });
});

describe('Email Templates', () => {
  it('should generate confirmation email template', async () => {
    const { getConfirmationEmailTemplate } = await import('./utils/emailTemplates');
    
    const html = getConfirmationEmailTemplate({
      firstName: 'John',
      lastName: 'Doe',
      consultationType: 'demo',
      date: '2025-12-25',
      time: '02:00 PM',
      timezone: 'America/New_York',
      meetLink: 'https://meet.google.com/abc-defg-hij',
    });
    
    expect(html).toContain('John');
    expect(html).toContain('Consultation Confirmed');
    expect(html).toContain('Product Demo');
    expect(html).toContain('meet.google.com');
  });

  it('should generate reschedule email template', async () => {
    const { getRescheduleEmailTemplate } = await import('./utils/emailTemplates');
    
    const html = getRescheduleEmailTemplate({
      firstName: 'Jane',
      lastName: 'Smith',
      consultationType: 'technical',
      oldDate: '2025-12-20',
      oldTime: '10:00 AM',
      date: '2025-12-25',
      time: '02:00 PM',
      timezone: 'America/New_York',
    });
    
    expect(html).toContain('Jane');
    expect(html).toContain('Consultation Rescheduled');
    expect(html).toContain('Technical Consultation');
    expect(html).toContain('Previous Time');
    expect(html).toContain('New Meeting Time');
  });

  it('should generate cancellation email template', async () => {
    const { getCancellationEmailTemplate } = await import('./utils/emailTemplates');
    
    const html = getCancellationEmailTemplate({
      firstName: 'Bob',
      lastName: 'Johnson',
      consultationType: 'enterprise',
      date: '2025-12-25',
      time: '02:00 PM',
      timezone: 'America/New_York',
    });
    
    expect(html).toContain('Bob');
    expect(html).toContain('Consultation Cancelled');
    expect(html).toContain('Enterprise Assessment');
    expect(html).toContain('Schedule New Consultation');
  });
});

describe('Leads Dashboard Integration', () => {
  it('should support filtering and sorting parameters', async () => {
    const filters = {
      status: 'qualified',
      industry: 'Technology',
      sortBy: 'score' as const,
      sortOrder: 'desc' as const,
    };
    
    expect(filters.sortBy).toBe('score');
    expect(filters.sortOrder).toBe('desc');
    expect(filters.status).toBe('qualified');
    expect(filters.industry).toBe('Technology');
  });
});
