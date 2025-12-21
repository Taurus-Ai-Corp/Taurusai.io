import { getDb } from "../db";
import { leads, emailSequences, sequenceEmails, leadEmailLog } from "../../drizzle/schema";
import { eq, and, lt, sql, isNull } from "drizzle-orm";
import { sendEmail } from "../email/gmail";

/**
 * Email Sequence Scheduler
 * Runs every hour to check for leads that need follow-up emails
 */

interface LeadWithSequence {
  leadId: number;
  leadEmail: string;
  leadFirstName: string;
  leadLastName: string;
  leadCompany: string;
  leadIndustry: string | null;
  leadScore: number;
  leadStatus: string;
  leadCreatedAt: Date;
  sequenceId: number;
  sequenceEmailId: number;
  stepNumber: number;
  delayDays: number;
  subject: string;
  body: string;
}

/**
 * Replace template variables in email content
 */
function replaceTemplateVariables(
  content: string,
  lead: {
    firstName: string;
    lastName: string;
    company: string;
    industry: string | null;
  }
): string {
  return content
    .replace(/\{\{firstName\}\}/g, lead.firstName)
    .replace(/\{\{lastName\}\}/g, lead.lastName)
    .replace(/\{\{company\}\}/g, lead.company)
    .replace(/\{\{industry\}\}/g, lead.industry || "your industry");
}

/**
 * Process email sequences for all eligible leads
 */
export async function processEmailSequences(): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.error("[Email Sequence Scheduler] Database not available");
    return;
  }

  console.log("[Email Sequence Scheduler] Starting sequence processing...");

  try {
    // Find leads that match active sequences and haven't received all emails yet
    const eligibleLeads = await db
      .select({
        leadId: leads.id,
        leadEmail: leads.email,
        leadFirstName: leads.firstName,
        leadLastName: leads.lastName,
        leadCompany: leads.company,
        leadIndustry: leads.industry,
        leadScore: leads.score,
        leadStatus: leads.status,
        leadCreatedAt: leads.createdAt,
        sequenceId: emailSequences.id,
        sequenceEmailId: sequenceEmails.id,
        stepNumber: sequenceEmails.stepNumber,
        delayDays: sequenceEmails.delayDays,
        subject: sequenceEmails.subject,
        body: sequenceEmails.body,
      })
      .from(leads)
      .innerJoin(
        emailSequences,
        and(
          eq(emailSequences.isActive, true),
          sql`${leads.score} >= ${emailSequences.targetScoreMin}`,
          sql`${leads.score} <= ${emailSequences.targetScoreMax}`,
          sql`(${emailSequences.targetStatus} IS NULL OR ${emailSequences.targetStatus} = ${leads.status})`
        )
      )
      .innerJoin(sequenceEmails, eq(sequenceEmails.sequenceId, emailSequences.id))
      .where(
        // Only include leads where this specific sequence email hasn't been sent yet
        sql`NOT EXISTS (
          SELECT 1 FROM ${leadEmailLog}
          WHERE ${leadEmailLog.leadId} = ${leads.id}
          AND ${leadEmailLog.sequenceEmailId} = ${sequenceEmails.id}
        )`
      );

    console.log(`[Email Sequence Scheduler] Found ${eligibleLeads.length} eligible lead-email combinations`);

    let sentCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const lead of eligibleLeads) {
      // Calculate when this email should be sent based on lead creation date + delay
      const leadCreatedTime = new Date(lead.leadCreatedAt).getTime();
      const currentTime = Date.now();
      const delayMs = lead.delayDays * 24 * 60 * 60 * 1000;
      const sendTime = leadCreatedTime + delayMs;

      // Skip if it's not time yet
      if (currentTime < sendTime) {
        skippedCount++;
        continue;
      }

      // Check if previous step was sent (for step 2+)
      if (lead.stepNumber > 1) {
        const previousStepSent = await db
          .select()
          .from(leadEmailLog)
          .where(
            and(
              eq(leadEmailLog.leadId, lead.leadId),
              eq(leadEmailLog.sequenceId, lead.sequenceId),
              sql`${leadEmailLog.sequenceEmailId} IN (
                SELECT id FROM ${sequenceEmails}
                WHERE ${sequenceEmails.sequenceId} = ${lead.sequenceId}
                AND ${sequenceEmails.stepNumber} = ${lead.stepNumber - 1}
              )`
            )
          )
          .limit(1);

        if (previousStepSent.length === 0) {
          // Previous step not sent yet, skip this one
          skippedCount++;
          continue;
        }
      }

      // Replace template variables
      const personalizedSubject = replaceTemplateVariables(lead.subject, {
        firstName: lead.leadFirstName,
        lastName: lead.leadLastName,
        company: lead.leadCompany,
        industry: lead.leadIndustry,
      });

      const personalizedBody = replaceTemplateVariables(lead.body, {
        firstName: lead.leadFirstName,
        lastName: lead.leadLastName,
        company: lead.leadCompany,
        industry: lead.leadIndustry,
      });

      // Send email
      try {
        const result = await sendEmail({
          to: lead.leadEmail,
          subject: personalizedSubject,
          body: personalizedBody,
        });

        // Log the email
        await db.insert(leadEmailLog).values({
          leadId: lead.leadId,
          sequenceId: lead.sequenceId,
          sequenceEmailId: lead.sequenceEmailId,
          subject: personalizedSubject,
          body: personalizedBody,
          status: result.success ? "sent" : "failed",
          errorMessage: result.error || null,
        });

        if (result.success) {
          sentCount++;
          console.log(
            `[Email Sequence Scheduler] Sent email to ${lead.leadEmail} (Sequence: ${lead.sequenceId}, Step: ${lead.stepNumber})`
          );
        } else {
          errorCount++;
          console.error(
            `[Email Sequence Scheduler] Failed to send email to ${lead.leadEmail}: ${result.error}`
          );
        }
      } catch (error) {
        errorCount++;
        console.error(`[Email Sequence Scheduler] Error sending email to ${lead.leadEmail}:`, error);

        // Log the failed attempt
        await db.insert(leadEmailLog).values({
          leadId: lead.leadId,
          sequenceId: lead.sequenceId,
          sequenceEmailId: lead.sequenceEmailId,
          subject: personalizedSubject,
          body: personalizedBody,
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        });
      }

      // Add a small delay between emails to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(
      `[Email Sequence Scheduler] Completed: ${sentCount} sent, ${skippedCount} skipped, ${errorCount} errors`
    );
  } catch (error) {
    console.error("[Email Sequence Scheduler] Error processing sequences:", error);
  }
}

/**
 * Start the email sequence scheduler
 * Runs every hour
 */
export function startEmailSequenceScheduler(): void {
  console.log("[Email Sequence Scheduler] Started - checking for follow-up emails every hour");

  // Run immediately on startup
  processEmailSequences();

  // Then run every hour
  setInterval(processEmailSequences, 60 * 60 * 1000);
}
