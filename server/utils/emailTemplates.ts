import { formatDateTimeWithTimezone } from "../../client/src/lib/timezones";

interface BookingDetails {
  firstName: string;
  lastName: string;
  consultationType: string;
  date: string;
  time: string;
  timezone: string;
  meetLink?: string | null;
}

interface RescheduleDetails extends BookingDetails {
  oldDate: string;
  oldTime: string;
}

/**
 * Generate HTML email template for consultation confirmation
 */
export function getConfirmationEmailTemplate(details: BookingDetails): string {
  const consultationTypeLabels: Record<string, string> = {
    discovery: "Discovery Call",
    demo: "Product Demo",
    technical: "Technical Consultation",
    enterprise: "Enterprise Assessment",
  };

  const typeLabel = consultationTypeLabels[details.consultationType] || details.consultationType;
  const dateTimeStr = formatDateTimeWithTimezone(details.date, details.time, details.timezone);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Confirmed - Taurus AI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0066cc 0%, #00cccc 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Consultation Confirmed</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi ${details.firstName},
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                Your <strong>${typeLabel}</strong> with Taurus AI has been confirmed!
              </p>
              
              <!-- Meeting Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; border-left: 4px solid #0066cc; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Meeting Details</p>
                    
                    <p style="margin: 0 0 8px; font-size: 16px; color: #333333;">
                      <strong>📅 Date & Time:</strong><br>
                      <span style="font-size: 18px; color: #0066cc;">${dateTimeStr}</span>
                    </p>
                    
                    <p style="margin: 0 0 8px; font-size: 16px; color: #333333;">
                      <strong>⏱️ Duration:</strong> ${getDuration(details.consultationType)}
                    </p>
                    
                    ${details.meetLink ? `
                    <p style="margin: 16px 0 0; font-size: 16px; color: #333333;">
                      <strong>🎥 Google Meet Link:</strong><br>
                      <a href="${details.meetLink}" style="color: #0066cc; text-decoration: none; word-break: break-all;">${details.meetLink}</a>
                    </p>
                    ` : ''}
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                A calendar invite has been sent to your email. We look forward to speaking with you!
              </p>
              
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">
                Best regards,<br>
                <strong>The Taurus AI Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 14px; color: #666666;">
                © ${new Date().getFullYear()} Taurus AI Corp. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate HTML email template for rescheduled consultation
 */
export function getRescheduleEmailTemplate(details: RescheduleDetails): string {
  const consultationTypeLabels: Record<string, string> = {
    discovery: "Discovery Call",
    demo: "Product Demo",
    technical: "Technical Consultation",
    enterprise: "Enterprise Assessment",
  };

  const typeLabel = consultationTypeLabels[details.consultationType] || details.consultationType;
  const oldDateTimeStr = formatDateTimeWithTimezone(details.oldDate, details.oldTime, details.timezone);
  const newDateTimeStr = formatDateTimeWithTimezone(details.date, details.time, details.timezone);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Rescheduled - Taurus AI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ff9500 0%, #ffcc00 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Consultation Rescheduled</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi ${details.firstName},
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                Your <strong>${typeLabel}</strong> with Taurus AI has been rescheduled.
              </p>
              
              <!-- Old Time Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3e0; border-radius: 6px; border-left: 4px solid #ff9500; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Previous Time</p>
                    <p style="margin: 0; font-size: 16px; color: #666666; text-decoration: line-through;">
                      ${oldDateTimeStr}
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- New Time Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8f5e9; border-radius: 6px; border-left: 4px solid #4caf50; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">New Meeting Time</p>
                    
                    <p style="margin: 0 0 8px; font-size: 16px; color: #333333;">
                      <strong>📅 Date & Time:</strong><br>
                      <span style="font-size: 18px; color: #4caf50;">${newDateTimeStr}</span>
                    </p>
                    
                    <p style="margin: 0 0 8px; font-size: 16px; color: #333333;">
                      <strong>⏱️ Duration:</strong> ${getDuration(details.consultationType)}
                    </p>
                    
                    ${details.meetLink ? `
                    <p style="margin: 16px 0 0; font-size: 16px; color: #333333;">
                      <strong>🎥 Google Meet Link:</strong><br>
                      <a href="${details.meetLink}" style="color: #4caf50; text-decoration: none; word-break: break-all;">${details.meetLink}</a>
                    </p>
                    ` : ''}
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                An updated calendar invite has been sent to your email. We look forward to speaking with you at the new time!
              </p>
              
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">
                Best regards,<br>
                <strong>The Taurus AI Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 14px; color: #666666;">
                © ${new Date().getFullYear()} Taurus AI Corp. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate HTML email template for cancelled consultation
 */
export function getCancellationEmailTemplate(details: BookingDetails): string {
  const consultationTypeLabels: Record<string, string> = {
    discovery: "Discovery Call",
    demo: "Product Demo",
    technical: "Technical Consultation",
    enterprise: "Enterprise Assessment",
  };

  const typeLabel = consultationTypeLabels[details.consultationType] || details.consultationType;
  const dateTimeStr = formatDateTimeWithTimezone(details.date, details.time, details.timezone);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Cancelled - Taurus AI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Consultation Cancelled</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi ${details.firstName},
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                Your <strong>${typeLabel}</strong> with Taurus AI has been cancelled.
              </p>
              
              <!-- Cancelled Meeting Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffebee; border-radius: 6px; border-left: 4px solid #dc3545; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Cancelled Meeting</p>
                    
                    <p style="margin: 0; font-size: 16px; color: #666666; text-decoration: line-through;">
                      ${dateTimeStr}
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                If you'd like to reschedule or have any questions, please don't hesitate to reach out to us.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/demo" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Schedule New Consultation</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">
                Best regards,<br>
                <strong>The Taurus AI Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 14px; color: #666666;">
                © ${new Date().getFullYear()} Taurus AI Corp. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Get duration label for consultation type
 */
function getDuration(consultationType: string): string {
  const durations: Record<string, string> = {
    discovery: "30 minutes",
    demo: "45 minutes",
    technical: "60 minutes",
    enterprise: "90 minutes",
  };
  return durations[consultationType] || "30 minutes";
}
