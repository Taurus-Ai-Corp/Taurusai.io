/**
 * Email Template Library
 * Pre-designed HTML email templates for common use cases
 */

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  subject: string;
  body: string;
  previewImage?: string;
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: "welcome-series-1",
    category: "Welcome Series",
    name: "Welcome - Introduction",
    description: "First email in welcome series introducing your company and value proposition",
    subject: "Welcome to {{company}} - Let's Get Started!",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h1 style="color: #1f2937; font-size: 28px; margin-bottom: 20px;">Welcome, {{firstName}}!</h1>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
      We're thrilled to have you join us at {{company}}. You've taken the first step toward transforming your business with quantum-safe AI solutions.
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
      Here's what you can expect from us:
    </p>
    
    <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">
      <li>Cutting-edge quantum-resistant security</li>
      <li>AI-powered automation that scales with your needs</li>
      <li>Dedicated support from our expert team</li>
      <li>Regular insights and industry updates</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://taurusai.io/get-started" style="background-color: #3b82f6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
        Get Started Now
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      Questions? Reply to this email or visit our <a href="https://taurusai.io/support" style="color: #3b82f6;">support center</a>.
    </p>
  </div>
</div>`,
  },
  
  {
    id: "product-announcement",
    category: "Product Updates",
    name: "Product Launch Announcement",
    description: "Announce new product features or launches to your audience",
    subject: "Introducing {{productName}} - The Future is Here",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 32px; margin: 0;">🚀 Big News, {{firstName}}!</h1>
    </div>
    
    <div style="padding: 40px;">
      <h2 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">Introducing Our Latest Innovation</h2>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        We're excited to announce the launch of our newest product designed specifically for {{industry}} leaders like you.
      </p>
      
      <div style="background-color: #f3f4f6; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <h3 style="color: #1f2937; font-size: 18px; margin-top: 0;">Key Benefits:</h3>
        <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0;">
          <li>50% faster processing with quantum-safe encryption</li>
          <li>Seamless integration with existing systems</li>
          <li>Real-time analytics and insights</li>
          <li>24/7 dedicated support</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://taurusai.io/products/new" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
          Learn More
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center; margin-top: 30px;">
        Early adopters get 20% off for the first 3 months
      </p>
    </div>
  </div>
</div>`,
  },
  
  {
    id: "re-engagement",
    category: "Re-engagement",
    name: "We Miss You",
    description: "Win back inactive leads with a compelling re-engagement email",
    subject: "{{firstName}}, we'd love to have you back",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="font-size: 48px; margin-bottom: 20px;">👋</div>
    
    <h1 style="color: #1f2937; font-size: 28px; margin-bottom: 20px;">We Miss You, {{firstName}}!</h1>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
      It's been a while since we last heard from you. We wanted to reach out and see if there's anything we can do to help {{company}} achieve its goals.
    </p>
    
    <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin: 30px 0;">
      <p style="color: #92400e; font-size: 16px; font-weight: 600; margin: 0;">
        🎁 Special Offer: 30% off any plan for returning customers
      </p>
    </div>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
      Since you've been away, we've added some exciting new features:
    </p>
    
    <div style="text-align: left; max-width: 400px; margin: 0 auto 30px;">
      <div style="display: flex; align-items: start; margin-bottom: 15px;">
        <span style="color: #10b981; font-size: 20px; margin-right: 10px;">✓</span>
        <span style="color: #4b5563; font-size: 15px;">Advanced quantum-safe encryption</span>
      </div>
      <div style="display: flex; align-items: start; margin-bottom: 15px;">
        <span style="color: #10b981; font-size: 20px; margin-right: 10px;">✓</span>
        <span style="color: #4b5563; font-size: 15px;">AI-powered workflow automation</span>
      </div>
      <div style="display: flex; align-items: start;">
        <span style="color: #10b981; font-size: 20px; margin-right: 10px;">✓</span>
        <span style="color: #4b5563; font-size: 15px;">Real-time collaboration tools</span>
      </div>
    </div>
    
    <div style="margin: 30px 0;">
      <a href="https://taurusai.io/welcome-back" style="background-color: #3b82f6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; margin-right: 10px;">
        Claim Your Offer
      </a>
      <a href="https://taurusai.io/whats-new" style="background-color: #ffffff; color: #3b82f6; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; border: 2px solid #3b82f6;">
        See What's New
      </a>
    </div>
    
    <p style="color: #9ca3af; font-size: 13px; margin-top: 30px;">
      Not interested? <a href="#" style="color: #9ca3af; text-decoration: underline;">Unsubscribe here</a>
    </p>
  </div>
</div>`,
  },
  
  {
    id: "educational-content",
    category: "Educational",
    name: "Industry Insights",
    description: "Share valuable industry insights and establish thought leadership",
    subject: "The Future of {{industry}}: Key Trends for 2025",
    body: `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px;">
    <h1 style="color: #1f2937; font-size: 32px; margin: 0; font-style: italic;">Industry Insights</h1>
    <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Exclusive research for {{industry}} leaders</p>
  </div>
  
  <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
    Dear {{firstName}},
  </p>
  
  <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
    As we move into 2025, the {{industry}} landscape is evolving faster than ever. We've compiled the top trends that will shape your industry in the coming year.
  </p>
  
  <h2 style="color: #1f2937; font-size: 22px; margin: 30px 0 15px 0; font-style: italic;">Key Trends to Watch:</h2>
  
  <div style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0;">
    <h3 style="color: #1f2937; font-size: 18px; margin-top: 0;">1. Quantum-Safe Security</h3>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0;">
      With quantum computing on the horizon, organizations are racing to implement quantum-resistant encryption. Early adopters will have a significant competitive advantage.
    </p>
  </div>
  
  <div style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0;">
    <h3 style="color: #1f2937; font-size: 18px; margin-top: 0;">2. AI-Driven Automation</h3>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0;">
      Intelligent automation is no longer optional. Companies leveraging AI for workflow optimization are seeing 40-60% efficiency gains.
    </p>
  </div>
  
  <div style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0;">
    <h3 style="color: #1f2937; font-size: 18px; margin-top: 0;">3. Real-Time Data Analytics</h3>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0;">
      Decision-making powered by real-time insights is becoming the norm. Organizations that can't access instant analytics risk falling behind.
    </p>
  </div>
  
  <div style="background-color: #eff6ff; border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center;">
    <p style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">
      Want to learn how {{company}} can prepare for these trends?
    </p>
    <a href="https://taurusai.io/consultation" style="background-color: #3b82f6; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
      Schedule a Free Consultation
    </a>
  </div>
  
  <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
    Best regards,<br>
    <strong>The Taurus AI Team</strong>
  </p>
</div>`,
  },
  
  {
    id: "case-study",
    category: "Social Proof",
    name: "Customer Success Story",
    description: "Showcase customer success stories to build credibility",
    subject: "How {{companyName}} Achieved 300% ROI in 6 Months",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Customer Success Story</h1>
      <p style="color: #d1fae5; font-size: 16px; margin: 10px 0 0 0;">Real results from real businesses</p>
    </div>
    
    <div style="padding: 40px;">
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Hi {{firstName}},
      </p>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
        We wanted to share an inspiring success story from one of our {{industry}} clients that achieved remarkable results.
      </p>
      
      <div style="background-color: #f0fdf4; border-radius: 8px; padding: 25px; margin: 30px 0;">
        <h2 style="color: #065f46; font-size: 22px; margin-top: 0;">The Challenge</h2>
        <p style="color: #047857; font-size: 15px; line-height: 1.7; margin: 0;">
          A mid-sized enterprise was struggling with legacy systems, security vulnerabilities, and manual processes that limited growth.
        </p>
      </div>
      
      <div style="background-color: #eff6ff; border-radius: 8px; padding: 25px; margin: 30px 0;">
        <h2 style="color: #1e40af; font-size: 22px; margin-top: 0;">The Solution</h2>
        <p style="color: #1e40af; font-size: 15px; line-height: 1.7; margin: 0;">
          We implemented our quantum-safe infrastructure with AI-powered automation, transforming their entire operation.
        </p>
      </div>
      
      <h2 style="color: #1f2937; font-size: 22px; margin: 30px 0 20px 0;">The Results</h2>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 30px 0;">
        <div style="text-align: center; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <div style="color: #10b981; font-size: 36px; font-weight: 700;">300%</div>
          <div style="color: #6b7280; font-size: 14px;">ROI Increase</div>
        </div>
        <div style="text-align: center; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <div style="color: #10b981; font-size: 36px; font-weight: 700;">60%</div>
          <div style="color: #6b7280; font-size: 14px;">Time Saved</div>
        </div>
        <div style="text-align: center; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <div style="color: #10b981; font-size: 36px; font-weight: 700;">Zero</div>
          <div style="color: #6b7280; font-size: 14px;">Security Breaches</div>
        </div>
      </div>
      
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin: 30px 0;">
        <p style="color: #78350f; font-size: 15px; font-style: italic; margin: 0;">
          "Taurus AI transformed our business. The quantum-safe security gives us peace of mind, and the automation freed up our team to focus on growth."
        </p>
        <p style="color: #92400e; font-size: 14px; font-weight: 600; margin: 10px 0 0 0;">
          — CTO, Fortune 500 Company
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://taurusai.io/case-studies" style="background-color: #10b981; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
          Read Full Case Study
        </a>
      </div>
      
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-top: 30px;">
        Ready to achieve similar results for {{company}}? Let's talk about your goals.
      </p>
    </div>
  </div>
</div>`,
  },
  
  {
    id: "limited-offer",
    category: "Promotional",
    name: "Limited Time Offer",
    description: "Create urgency with time-sensitive promotional offers",
    subject: "⏰ Last Chance: 40% Off Ends Tonight!",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #7c2d12;">
  <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
    <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px; text-align: center;">
      <div style="background-color: #fef2f2; color: #991b1b; display: inline-block; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 700; margin-bottom: 15px;">
        ⏰ ENDS TONIGHT AT MIDNIGHT
      </div>
      <h1 style="color: #ffffff; font-size: 36px; margin: 0; font-weight: 700;">40% OFF</h1>
      <p style="color: #fecaca; font-size: 18px; margin: 10px 0 0 0;">All Enterprise Plans</p>
    </div>
    
    <div style="padding: 40px;">
      <p style="color: #1f2937; font-size: 18px; font-weight: 600; margin-bottom: 20px;">
        Hi {{firstName}},
      </p>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        This is your final reminder—our biggest sale of the year ends in just a few hours!
      </p>
      
      <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center;">
        <div style="color: #991b1b; font-size: 48px; font-weight: 700; margin-bottom: 10px;">40% OFF</div>
        <div style="color: #7f1d1d; font-size: 18px; font-weight: 600;">Save up to $12,000/year</div>
      </div>
      
      <h2 style="color: #1f2937; font-size: 20px; margin: 30px 0 15px 0;">What You Get:</h2>
      
      <ul style="color: #4b5563; font-size: 16px; line-height: 2; margin-bottom: 30px; padding-left: 20px;">
        <li>Quantum-safe encryption for all data</li>
        <li>AI-powered workflow automation</li>
        <li>24/7 priority support</li>
        <li>Unlimited team members</li>
        <li>Advanced analytics dashboard</li>
      </ul>
      
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
        <div style="color: #78350f; font-size: 16px; font-weight: 600; margin-bottom: 10px;">
          ⏰ Offer expires in:
        </div>
        <div style="color: #92400e; font-size: 32px; font-weight: 700;">
          8 hours 23 minutes
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://taurusai.io/claim-offer" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff; padding: 18px 48px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 18px; display: inline-block; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.4);">
          Claim Your 40% Discount
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
        This offer is exclusive to {{company}} and expires at midnight tonight.
      </p>
    </div>
  </div>
</div>`,
  },
  
  {
    id: "feedback-request",
    category: "Engagement",
    name: "Feedback Request",
    description: "Gather valuable feedback from customers to improve your service",
    subject: "{{firstName}}, we'd love your feedback",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 64px; margin-bottom: 10px;">💬</div>
      <h1 style="color: #1f2937; font-size: 28px; margin: 0;">We Value Your Opinion</h1>
    </div>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
      Hi {{firstName}},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
      Your experience matters to us! We're constantly working to improve our services, and your feedback helps us understand what we're doing right and where we can do better.
    </p>
    
    <div style="background-color: #eff6ff; border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center;">
      <p style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 20px 0;">
        How would you rate your experience with {{company}}?
      </p>
      <div style="display: flex; justify-content: center; gap: 15px;">
        <a href="https://taurusai.io/feedback?rating=5" style="background-color: #10b981; color: #ffffff; width: 50px; height: 50px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; font-size: 24px;">😊</a>
        <a href="https://taurusai.io/feedback?rating=3" style="background-color: #f59e0b; color: #ffffff; width: 50px; height: 50px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; font-size: 24px;">😐</a>
        <a href="https://taurusai.io/feedback?rating=1" style="background-color: #ef4444; color: #ffffff; width: 50px; height: 50px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; font-size: 24px;">😞</a>
      </div>
    </div>
    
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 30px 0;">
      Your feedback takes less than 2 minutes and helps us serve you better. As a thank you, we'll enter you into our monthly draw for a $500 Amazon gift card.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://taurusai.io/feedback" style="background-color: #3b82f6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
        Share Your Feedback
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      Thank you for being a valued member of the {{company}} community!
    </p>
  </div>
</div>`,
  },
];

/**
 * Get all templates
 */
export function getAllTemplates(): EmailTemplate[] {
  return emailTemplates;
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): EmailTemplate[] {
  return emailTemplates.filter(t => t.category === category);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): EmailTemplate | undefined {
  return emailTemplates.find(t => t.id === id);
}

/**
 * Get all unique categories
 */
export function getTemplateCategories(): string[] {
  return Array.from(new Set(emailTemplates.map(t => t.category)));
}
