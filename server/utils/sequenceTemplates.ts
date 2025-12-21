/**
 * Email sequence templates for lead nurturing
 * Organized by lead priority (score-based)
 */

interface SequenceTemplate {
  name: string;
  description: string;
  targetScoreMin: number;
  targetScoreMax: number;
  targetStatus: string | null;
  emails: {
    stepNumber: number;
    delayDays: number;
    subject: string;
    body: string;
  }[];
}

/**
 * High-priority lead sequence (Score >= 60)
 * Aggressive follow-up with personalized outreach
 */
export const highPrioritySequence: SequenceTemplate = {
  name: "High-Priority Lead Nurture",
  description: "Aggressive follow-up sequence for high-value leads with score >= 60",
  targetScoreMin: 60,
  targetScoreMax: 100,
  targetStatus: "new",
  emails: [
    {
      stepNumber: 1,
      delayDays: 0,
      subject: "Welcome to Taurus AI - Let's Secure Your Future",
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Taurus AI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #0066cc 0%, #00cccc 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to Taurus AI</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi {{firstName}},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Thank you for your interest in Taurus AI's quantum-safe infrastructure solutions. With the SWIFT 2027 deadline approaching, enterprises like {{company}} are making the critical transition to post-quantum cryptography.
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                Based on your profile, I believe our <strong>Enterprise Quantum Shield</strong> would be an excellent fit for your organization. Here's why:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px; font-size: 16px; color: #333333;">
                      ✅ <strong>NIST PQC Compliant</strong> - Future-proof encryption algorithms
                    </p>
                    <p style="margin: 0 0 12px; font-size: 16px; color: #333333;">
                      ✅ <strong>99.9% Uptime SLA</strong> - Enterprise-grade reliability
                    </p>
                    <p style="margin: 0 0 12px; font-size: 16px; color: #333333;">
                      ✅ <strong>Seamless Migration</strong> - Deploy in days, not months
                    </p>
                    <p style="margin: 0; font-size: 16px; color: #333333;">
                      ✅ <strong>24/7 Expert Support</strong> - Dedicated security team
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                I'd love to schedule a brief 30-minute call to discuss your specific security requirements and show you how we can help {{company}} stay ahead of quantum threats.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/demo" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Schedule a Demo</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">
                Looking forward to connecting,<br>
                <strong>The Taurus AI Team</strong>
              </p>
            </td>
          </tr>
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
      `.trim(),
    },
    {
      stepNumber: 2,
      delayDays: 3,
      subject: "{{company}}'s Quantum Security Roadmap - Custom Analysis",
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Custom Security Analysis</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi {{firstName}},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                I wanted to follow up and share some insights specific to the <strong>{{industry}}</strong> industry regarding quantum security threats.
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                Recent studies show that organizations in your sector are particularly vulnerable to "harvest now, decrypt later" attacks. Here's what leading enterprises are doing:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3e0; border-radius: 6px; border-left: 4px solid #ff9500; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px; font-size: 16px; color: #333333;">
                      📊 <strong>Industry Benchmark:</strong> 67% of {{industry}} leaders have started PQC migration
                    </p>
                    <p style="margin: 0 0 12px; font-size: 16px; color: #333333;">
                      ⚡ <strong>Average ROI:</strong> 340% over 3 years with reduced breach risk
                    </p>
                    <p style="margin: 0; font-size: 16px; color: #333333;">
                      🎯 <strong>Compliance:</strong> NIST, ISO 27001, and industry-specific standards
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                I've prepared a <strong>custom security assessment</strong> for {{company}} that outlines:
              </p>
              
              <ul style="margin: 0 0 30px; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #333333;">
                <li>Current vulnerability exposure</li>
                <li>Recommended migration timeline</li>
                <li>Cost-benefit analysis</li>
                <li>Implementation roadmap</li>
              </ul>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                Would you be available for a 15-minute call this week to discuss these findings?
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/demo" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Book Your Call</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">
                Best regards,<br>
                <strong>The Taurus AI Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    },
    {
      stepNumber: 3,
      delayDays: 7,
      subject: "Case Study: How {{industry}} Leaders Achieved Quantum Security",
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Success Story</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi {{firstName}},
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                I thought you'd find this case study interesting. A leading {{industry}} organization similar to {{company}} recently completed their quantum security migration with Taurus AI.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8f5e9; border-radius: 6px; border-left: 4px solid #4caf50; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px; font-size: 20px; color: #333333;">Results Achieved:</h3>
                    <p style="margin: 0 0 12px; font-size: 16px; color: #333333;">
                      ✅ <strong>Migration completed in 45 days</strong> (vs. 6-month industry average)
                    </p>
                    <p style="margin: 0 0 12px; font-size: 16px; color: #333333;">
                      ✅ <strong>Zero downtime</strong> during transition
                    </p>
                    <p style="margin: 0 0 12px; font-size: 16px; color: #333333;">
                      ✅ <strong>40% cost savings</strong> compared to in-house development
                    </p>
                    <p style="margin: 0; font-size: 16px; color: #333333;">
                      ✅ <strong>Full NIST PQC compliance</strong> achieved
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                The key to their success? Starting early and partnering with experts who understand the {{industry}} landscape.
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                I'd be happy to share the full case study and discuss how we can replicate these results for {{company}}.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/case-studies" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Read Full Case Study</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">
                Best regards,<br>
                <strong>The Taurus AI Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    },
    {
      stepNumber: 4,
      delayDays: 14,
      subject: "Final Reminder: Quantum Threats Are Real - Let's Talk",
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Final Reminder</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi {{firstName}},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                I haven't heard back from you, so I wanted to reach out one last time before closing your file.
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                The quantum threat landscape is evolving rapidly, and early adopters are gaining significant competitive advantages. I'd hate for {{company}} to fall behind.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffebee; border-radius: 6px; border-left: 4px solid #dc3545; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px; font-size: 16px; color: #333333;">
                      ⚠️ <strong>SWIFT 2027 Deadline:</strong> Only 24 months remaining
                    </p>
                    <p style="margin: 0 0 12px; font-size: 16px; color: #333333;">
                      ⚠️ <strong>Quantum Computers:</strong> Advancing faster than expected
                    </p>
                    <p style="margin: 0; font-size: 16px; color: #333333;">
                      ⚠️ <strong>Data at Risk:</strong> Sensitive information being harvested today
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                If now isn't the right time, I completely understand. However, if you'd like to keep the conversation open for the future, just reply to this email and let me know.
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                Otherwise, I'll assume you're all set and won't reach out again.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/demo" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Last Chance - Schedule Demo</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">
                Wishing you the best,<br>
                <strong>The Taurus AI Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    },
  ],
};

/**
 * Medium-priority lead sequence (Score 40-59)
 * Educational content with softer CTAs
 */
export const mediumPrioritySequence: SequenceTemplate = {
  name: "Medium-Priority Lead Nurture",
  description: "Educational sequence for medium-value leads with score 40-59",
  targetScoreMin: 40,
  targetScoreMax: 59,
  targetStatus: "new",
  emails: [
    {
      stepNumber: 1,
      delayDays: 0,
      subject: "Your Guide to Quantum-Safe Security",
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Quantum Security Guide</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #0066cc 0%, #00cccc 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to Taurus AI</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi {{firstName}},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Thank you for your interest in quantum-safe security solutions. We've put together some helpful resources to get you started.
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                Here's what you'll learn:
              </p>
              
              <ul style="margin: 0 0 30px; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #333333;">
                <li>Understanding quantum computing threats</li>
                <li>NIST post-quantum cryptography standards</li>
                <li>Migration planning and best practices</li>
                <li>Industry-specific compliance requirements</li>
              </ul>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/insights" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Explore Resources</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">
                Best regards,<br>
                <strong>The Taurus AI Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    },
    {
      stepNumber: 2,
      delayDays: 7,
      subject: "Quantum Security Checklist for {{company}}",
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Security Checklist</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi {{firstName}},
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                Here's a practical checklist to assess your organization's quantum readiness:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px; font-size: 16px; color: #333333;">
                      ☐ Inventory of current cryptographic systems
                    </p>
                    <p style="margin: 0 0 12px; font-size: 16px; color: #333333;">
                      ☐ Risk assessment for sensitive data
                    </p>
                    <p style="margin: 0 0 12px; font-size: 16px; color: #333333;">
                      ☐ Compliance requirements review
                    </p>
                    <p style="margin: 0; font-size: 16px; color: #333333;">
                      ☐ Migration timeline planning
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                Need help completing this checklist? Our team can provide a free consultation.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/contact" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Get Free Consultation</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">
                Best regards,<br>
                <strong>The Taurus AI Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    },
    {
      stepNumber: 3,
      delayDays: 14,
      subject: "Staying Connected - Quantum Security Updates",
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Stay Updated</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi {{firstName}},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                I wanted to keep you in the loop on the latest quantum security developments.
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                If you'd like to continue receiving updates, insights, and case studies, feel free to stay subscribed. Otherwise, you can unsubscribe at any time.
              </p>
              
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">
                Best regards,<br>
                <strong>The Taurus AI Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    },
  ],
};

/**
 * Low-priority lead sequence (Score < 40)
 * Minimal touch with educational content
 */
export const lowPrioritySequence: SequenceTemplate = {
  name: "Low-Priority Lead Nurture",
  description: "Light-touch educational sequence for low-value leads with score < 40",
  targetScoreMin: 0,
  targetScoreMax: 39,
  targetStatus: "new",
  emails: [
    {
      stepNumber: 1,
      delayDays: 0,
      subject: "Thanks for Your Interest in Taurus AI",
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank You</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi {{firstName}},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Thank you for your interest in Taurus AI. We're here to help when you're ready to explore quantum-safe security solutions.
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                In the meantime, feel free to explore our resources and case studies at your own pace.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Visit Our Website</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">
                Best regards,<br>
                <strong>The Taurus AI Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    },
    {
      stepNumber: 2,
      delayDays: 14,
      subject: "Quantum Security Resources You Might Find Helpful",
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Helpful Resources</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi {{firstName}},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Here are some helpful resources on quantum security that you might find interesting.
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">
                Feel free to reach out if you have any questions.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/insights" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Browse Resources</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">
                Best regards,<br>
                <strong>The Taurus AI Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    },
  ],
};

export const allSequenceTemplates = [
  highPrioritySequence,
  mediumPrioritySequence,
  lowPrioritySequence,
];
