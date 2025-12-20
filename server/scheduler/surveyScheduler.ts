import * as db from "../db";
import { sendEmail } from "../email/gmail";

/**
 * Check for completed consultations and send survey emails
 */
export async function sendSurveyEmails(): Promise<void> {
  try {
    // Get all completed consultations
    const consultations = await db.getAllConsultations();
    
    if (!consultations || !Array.isArray(consultations) || consultations.length === 0) {
      console.log('[Survey Scheduler] No consultations found');
      return;
    }
    
    // Filter for recently completed consultations (within last 24 hours)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentlyCompleted = consultations.filter(c => {
      if (c.status !== 'completed') return false;
      
      // Check if notes contain survey sent marker
      if (c.notes && c.notes.includes('[System] Survey email sent')) {
        return false;
      }
      
      // Check if updated within last 24 hours (status changed to completed)
      const updatedAt = new Date(c.updatedAt);
      return updatedAt >= oneDayAgo;
    });
    
    if (recentlyCompleted.length === 0) {
      console.log('[Survey Scheduler] No recently completed consultations needing surveys');
      return;
    }
    
    console.log(`[Survey Scheduler] Found ${recentlyCompleted.length} consultations needing survey emails`);
    
    // Send survey email for each consultation
    for (const consultation of recentlyCompleted) {
      const emailContent = formatSurveyEmail(
        consultation.firstName,
        consultation.lastName,
        consultation.consultationType,
        consultation.company
      );
      
      const result = await sendEmail({
        to: consultation.email,
        subject: emailContent.subject,
        body: emailContent.body,
      });
      
      if (result.success) {
        console.log(`[Survey Scheduler] Sent survey to ${consultation.email}`);
        // Update consultation to mark survey sent
        await db.updateConsultation(consultation.id, {
          notes: `${consultation.notes || ''}\n[System] Survey email sent on ${new Date().toISOString()}`.trim(),
        });
      } else {
        console.error(`[Survey Scheduler] Failed to send survey to ${consultation.email}:`, result.error);
      }
    }
  } catch (error) {
    console.error('[Survey Scheduler] Error sending surveys:', error);
  }
}

function formatSurveyEmail(
  firstName: string,
  lastName: string,
  consultationType: string,
  company: string
): { subject: string; body: string } {
  const typeLabels: Record<string, string> = {
    discovery: "Discovery Call",
    demo: "Product Demo",
    technical: "Technical Consultation",
    enterprise: "Enterprise Assessment",
  };

  const typeLabel = typeLabels[consultationType] || "Consultation";

  const subject = `We'd Love Your Feedback on Your ${typeLabel}`;

  const body = `Dear ${firstName} ${lastName},

Thank you for meeting with Taurus AI Corp for your ${typeLabel}. We hope you found our discussion valuable and insightful.

📝 SHARE YOUR EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your feedback helps us improve our services and assists other businesses in making informed decisions. We'd greatly appreciate if you could take 3-5 minutes to complete our post-consultation survey:

🔗 Survey Link: https://taurusai.io/survey

💡 YOUR FEEDBACK MATTERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Help us understand what worked well
• Share suggestions for improvement
• Tell us how Taurus AI can better serve ${company}
• Optionally allow us to feature your testimonial

🎁 AS A THANK YOU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Survey participants who provide detailed feedback will receive:
• Priority access to new product features
• Exclusive invitations to webinars and events
• Early access to industry research and whitepapers

📞 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If you'd like to continue the conversation or have additional questions:
• Schedule a follow-up: https://taurusai.io/contact
• Email us: taurus.ai@taas-ai.com
• Call us: [Your Phone Number]

We're committed to helping ${company} achieve quantum-safe infrastructure excellence.

Best regards,
The Taurus AI Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Taurus AI Corp
Quantum-Safe Infrastructure as a Service
Website: https://taurusai.io
Email: taurus.ai@taas-ai.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

P.S. Your feedback is completely confidential unless you explicitly grant permission to publish it as a testimonial.`;

  return { subject, body };
}

/**
 * Start the survey scheduler (runs every 6 hours)
 */
export function startSurveyScheduler(): void {
  // Run immediately on startup
  sendSurveyEmails();
  
  // Then run every 6 hours
  setInterval(() => {
    sendSurveyEmails();
  }, 6 * 60 * 60 * 1000); // 6 hours
  
  console.log('[Survey Scheduler] Started - checking for completed consultations every 6 hours');
}
