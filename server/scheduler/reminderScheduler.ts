import * as db from "../db";
import { sendEmail } from "../email/gmail";

/**
 * Check for consultations happening in 24 hours and send reminder emails
 */
export async function sendConsultationReminders(): Promise<void> {
  try {
    // Get tomorrow's date in YYYY-MM-DD format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    // Get all scheduled consultations for tomorrow
    const consultations = await db.getConsultationsByDate(tomorrowStr);
    
    if (!consultations || consultations.length === 0) {
      console.log(`[Reminder Scheduler] No consultations scheduled for ${tomorrowStr}`);
      return;
    }
    
    console.log(`[Reminder Scheduler] Found ${consultations.length} consultations for ${tomorrowStr}`);
    
    // Send reminder email for each consultation
    for (const consultation of consultations) {
      if (consultation.status !== 'scheduled') {
        continue; // Skip non-scheduled consultations
      }
      
      const emailContent = formatReminderEmail(
        consultation.firstName,
        consultation.lastName,
        consultation.consultationType,
        consultation.date,
        consultation.time,
        consultation.meetLink || '',
        consultation.company
      );
      
      const result = await sendEmail({
        to: consultation.email,
        subject: emailContent.subject,
        body: emailContent.body,
      });
      
      if (result.success) {
        console.log(`[Reminder Scheduler] Sent reminder to ${consultation.email}`);
        // Update consultation to mark reminder sent
        await db.updateConsultation(consultation.id, {
          notes: `${consultation.notes || ''}\n[System] Reminder email sent on ${new Date().toISOString()}`.trim(),
        });
      } else {
        console.error(`[Reminder Scheduler] Failed to send reminder to ${consultation.email}:`, result.error);
      }
    }
  } catch (error) {
    console.error('[Reminder Scheduler] Error sending reminders:', error);
  }
}

function formatReminderEmail(
  firstName: string,
  lastName: string,
  consultationType: string,
  date: string,
  time: string,
  meetLink: string,
  company: string
): { subject: string; body: string } {
  const typeLabels: Record<string, string> = {
    discovery: "Discovery Call (30 minutes)",
    demo: "Product Demo (45 minutes)",
    technical: "Technical Consultation (60 minutes)",
    enterprise: "Enterprise Assessment (90 minutes)",
  };

  const typeLabel = typeLabels[consultationType] || "Consultation";

  const subject = `Reminder: Your ${typeLabel} Tomorrow at ${time}`;

  const body = `Dear ${firstName} ${lastName},

This is a friendly reminder about your upcoming consultation with Taurus AI Corp scheduled for tomorrow.

📅 CONSULTATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: ${typeLabel}
Date: ${date}
Time: ${time} IST
Company: ${company}

📹 JOIN THE MEETING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${meetLink ? `Google Meet Link: ${meetLink}` : 'Meeting link will be provided separately'}

⏰ WHAT TO DO NOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Add this meeting to your calendar if you haven't already
• Test your audio and video setup
• Review our products at https://taurusai.io/products
• Prepare any questions you'd like to discuss
• Invite relevant team members to join

💡 NEED TO RESCHEDULE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If something has come up and you need to reschedule, please let us know as soon as possible:
• Email: taurus.ai@taas-ai.com
• Email: admin@taurusai.io

We're looking forward to speaking with you tomorrow!

Best regards,
The Taurus AI Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Taurus AI Corp
Quantum-Safe Infrastructure as a Service
Website: https://taurusai.io
Email: taurus.ai@taas-ai.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  return { subject, body };
}

/**
 * Start the reminder scheduler (runs every hour)
 */
export function startReminderScheduler(): void {
  // Run immediately on startup
  sendConsultationReminders();
  
  // Then run every hour
  setInterval(() => {
    sendConsultationReminders();
  }, 60 * 60 * 1000); // 1 hour
  
  console.log('[Reminder Scheduler] Started - checking for reminders every hour');
}
