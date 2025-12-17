import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const input = JSON.stringify({
      messages: [
        {
          to: [options.to],
          subject: options.subject,
          body: options.body,
        },
      ],
    });

    const command = `manus-mcp-cli tool call gmail_send_messages --server gmail --input '${input.replace(/'/g, "'\\''")}' 2>&1`;
    
    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    if (stderr && !stderr.includes("OAuth")) {
      console.error("[Gmail] Error sending email:", stderr);
      return { success: false, error: stderr };
    }

    console.log("[Gmail] Email sent successfully:", stdout);
    return { success: true };
  } catch (error) {
    console.error("[Gmail] Failed to send email:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

export function formatConsultationConfirmationEmail(
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

  const subject = `Consultation Confirmed: ${typeLabel} - ${date}`;

  const body = `Dear ${firstName} ${lastName},

Thank you for booking a consultation with Taurus AI Corp. We're excited to discuss how our quantum-safe infrastructure solutions can benefit ${company}.

📅 CONSULTATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: ${typeLabel}
Date: ${date}
Time: ${time} IST
Company: ${company}

📹 JOIN THE MEETING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Google Meet Link: ${meetLink}

Please join the meeting at the scheduled time using the link above.

📝 WHAT TO EXPECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Our team will:
• Understand your business challenges and requirements
• Demonstrate relevant features of our platform
• Discuss implementation strategies
• Answer your technical and business questions
• Provide next steps and recommendations

💡 PREPARE FOR THE CALL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To make the most of our time together:
• Review our products at https://taurusai.io/products
• Prepare specific questions or use cases
• Have relevant stakeholders join the call
• Test your audio/video before the meeting

📧 NEED TO RESCHEDULE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If you need to change the time, please contact us at:
• Email: taurus.ai@taas-ai.com
• Email: admin@taurusai.io

We look forward to speaking with you!

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
