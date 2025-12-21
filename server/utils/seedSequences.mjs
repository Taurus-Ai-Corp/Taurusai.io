/**
 * Seed email sequences into the database
 * Run with: node server/utils/seedSequences.mjs
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const sequences = [
  {
    name: "High-Priority Lead Nurture",
    description: "Aggressive follow-up sequence for high-value leads with score >= 60",
    targetScoreMin: 60,
    targetScoreMax: 100,
    targetStatus: "new",
    isActive: true,
    emails: [
      {
        stepNumber: 1,
        delayDays: 0,
        subject: "Welcome to Taurus AI - Let's Secure Your Future",
        body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome to Taurus AI</title></head>
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
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">Hi {{firstName}},</p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">Thank you for your interest in Taurus AI's quantum-safe infrastructure solutions. With the SWIFT 2027 deadline approaching, enterprises like {{company}} are making the critical transition to post-quantum cryptography.</p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">Based on your profile, I believe our <strong>Enterprise Quantum Shield</strong> would be an excellent fit for your organization.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/demo" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Schedule a Demo</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">Looking forward to connecting,<br><strong>The Taurus AI Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
      {
        stepNumber: 2,
        delayDays: 3,
        subject: "{{company}}'s Quantum Security Roadmap - Custom Analysis",
        body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Custom Security Analysis</title></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">Hi {{firstName}},</p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">I wanted to follow up and share some insights specific to the <strong>{{industry}}</strong> industry regarding quantum security threats.</p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">Would you be available for a 15-minute call this week to discuss these findings?</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/demo" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Book Your Call</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">Best regards,<br><strong>The Taurus AI Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
      {
        stepNumber: 3,
        delayDays: 7,
        subject: "Case Study: How {{industry}} Leaders Achieved Quantum Security",
        body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Success Story</title></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">Hi {{firstName}},</p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">I thought you'd find this case study interesting. A leading {{industry}} organization similar to {{company}} recently completed their quantum security migration with Taurus AI.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/case-studies" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Read Full Case Study</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">Best regards,<br><strong>The Taurus AI Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
      {
        stepNumber: 4,
        delayDays: 14,
        subject: "Final Reminder: Quantum Threats Are Real - Let's Talk",
        body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Final Reminder</title></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">Hi {{firstName}},</p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">I haven't heard back from you, so I wanted to reach out one last time before closing your file.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/demo" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Last Chance - Schedule Demo</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">Wishing you the best,<br><strong>The Taurus AI Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
    ],
  },
  {
    name: "Medium-Priority Lead Nurture",
    description: "Educational sequence for medium-value leads with score 40-59",
    targetScoreMin: 40,
    targetScoreMax: 59,
    targetStatus: "new",
    isActive: true,
    emails: [
      {
        stepNumber: 1,
        delayDays: 0,
        subject: "Your Guide to Quantum-Safe Security",
        body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Quantum Security Guide</title></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">Hi {{firstName}},</p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">Thank you for your interest in quantum-safe security solutions. We've put together some helpful resources to get you started.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/insights" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Explore Resources</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">Best regards,<br><strong>The Taurus AI Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
      {
        stepNumber: 2,
        delayDays: 7,
        subject: "Quantum Security Checklist for {{company}}",
        body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Security Checklist</title></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">Hi {{firstName}},</p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #333333;">Here's a practical checklist to assess your organization's quantum readiness.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/contact" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Get Free Consultation</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">Best regards,<br><strong>The Taurus AI Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
      {
        stepNumber: 3,
        delayDays: 14,
        subject: "Staying Connected - Quantum Security Updates",
        body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Stay Updated</title></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">Hi {{firstName}},</p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">I wanted to keep you in the loop on the latest quantum security developments.</p>
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">Best regards,<br><strong>The Taurus AI Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
    ],
  },
  {
    name: "Low-Priority Lead Nurture",
    description: "Light-touch educational sequence for low-value leads with score < 40",
    targetScoreMin: 0,
    targetScoreMax: 39,
    targetStatus: "new",
    isActive: true,
    emails: [
      {
        stepNumber: 1,
        delayDays: 0,
        subject: "Thanks for Your Interest in Taurus AI",
        body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Thank You</title></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">Hi {{firstName}},</p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">Thank you for your interest in Taurus AI. We're here to help when you're ready to explore quantum-safe security solutions.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Visit Our Website</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">Best regards,<br><strong>The Taurus AI Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
      {
        stepNumber: 2,
        delayDays: 14,
        subject: "Quantum Security Resources You Might Find Helpful",
        body: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Helpful Resources</title></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">Hi {{firstName}},</p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">Here are some helpful resources on quantum security that you might find interesting.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://taurusai.io/insights" style="display: inline-block; padding: 14px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Browse Resources</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">Best regards,<br><strong>The Taurus AI Team</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
    ],
  },
];

async function seedSequences() {
  console.log("Connecting to database...");
  
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  console.log("Seeding email sequences...");

  for (const sequence of sequences) {
    console.log(`\nCreating sequence: ${sequence.name}`);
    
    // Insert sequence
    const [seqResult] = await connection.execute(
      `INSERT INTO emailSequences (name, description, targetScoreMin, targetScoreMax, targetStatus, isActive) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        sequence.name,
        sequence.description,
        sequence.targetScoreMin,
        sequence.targetScoreMax,
        sequence.targetStatus,
        sequence.isActive,
      ]
    );

    const sequenceId = seqResult.insertId;
    console.log(`  Created sequence with ID: ${sequenceId}`);

    // Insert emails for this sequence
    for (const email of sequence.emails) {
      await connection.execute(
        `INSERT INTO sequenceEmails (sequenceId, stepNumber, delayDays, subject, body) 
         VALUES (?, ?, ?, ?, ?)`,
        [sequenceId, email.stepNumber, email.delayDays, email.subject, email.body]
      );
      console.log(`    Added email step ${email.stepNumber}: "${email.subject}"`);
    }
  }

  await connection.end();
  console.log("\n✅ Email sequences seeded successfully!");
}

seedSequences().catch((error) => {
  console.error("Error seeding sequences:", error);
  process.exit(1);
});
