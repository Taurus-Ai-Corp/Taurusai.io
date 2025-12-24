import { storeDocument } from '../server/ai/semanticSearch';
import { randomUUID } from 'crypto';

/**
 * Seed the knowledge base with product information, FAQs, and technical content
 */
async function seedKnowledgeBase() {
  console.log('🌱 Starting knowledge base seeding...\n');

  const documents = [
    // Product: BizFlow AI
    {
      slug: 'product-bizflow-overview',
      content: `BizFlow AI is an enterprise business workflow automation platform powered by agentic AI. 
      It enables organizations to automate complex business processes, reduce manual work, and improve operational efficiency. 
      Key features include intelligent document processing, automated decision-making, workflow orchestration, and seamless integration with existing enterprise systems. 
      BizFlow AI uses advanced machine learning models to understand context, make recommendations, and execute tasks autonomously.`,
      metadata: { type: 'product', productSlug: 'bizflow-ai', category: 'overview' }
    },
    {
      slug: 'product-bizflow-features',
      content: `BizFlow AI Features:
      - Intelligent Process Automation: Automate repetitive tasks and complex workflows
      - Document Intelligence: Extract, classify, and process documents automatically
      - Decision Automation: AI-powered decision engines for business rules
      - Integration Hub: Connect with 100+ enterprise applications (Salesforce, SAP, Oracle, etc.)
      - Real-time Analytics: Monitor workflow performance and identify bottlenecks
      - Compliance & Audit: Built-in compliance tracking and audit trails
      - Multi-language Support: Process documents and workflows in 50+ languages`,
      metadata: { type: 'product', productSlug: 'bizflow-ai', category: 'features' }
    },
    {
      slug: 'product-bizflow-pricing',
      content: `BizFlow AI Pricing:
      - Starter Plan: $2,999/month - Up to 10,000 workflow executions, 5 users, basic integrations
      - Professional Plan: $7,999/month - Up to 50,000 workflow executions, 25 users, advanced integrations, priority support
      - Enterprise Plan: Custom pricing - Unlimited executions, unlimited users, dedicated support, custom integrations, SLA guarantees
      All plans include free training, onboarding support, and regular updates.`,
      metadata: { type: 'product', productSlug: 'bizflow-ai', category: 'pricing' }
    },

    // Product: Q-Grid
    {
      slug: 'product-qgrid-overview',
      content: `Q-Grid is a quantum computing grid infrastructure platform with built-in post-quantum cryptography (PQC). 
      It provides enterprise-grade quantum-safe security for distributed computing workloads. 
      Q-Grid enables organizations to prepare for the quantum computing era by implementing quantum-resistant encryption today. 
      The platform combines classical and quantum computing resources in a unified grid, with automatic workload distribution and quantum-safe communication protocols.`,
      metadata: { type: 'product', productSlug: 'q-grid', category: 'overview' }
    },
    {
      slug: 'product-qgrid-features',
      content: `Q-Grid Features:
      - Post-Quantum Cryptography: NIST-approved quantum-resistant encryption algorithms (CRYSTALS-Kyber, CRYSTALS-Dilithium)
      - Hybrid Computing: Seamlessly distribute workloads between classical and quantum processors
      - 99.9% Uptime SLA: Enterprise-grade reliability with redundant infrastructure
      - 10,000+ TPS: High-throughput transaction processing
      - NIST PQC Compliant: Meets latest post-quantum cryptography standards
      - Zero-Trust Architecture: Advanced security with continuous verification
      - Quantum Key Distribution (QKD): Ultra-secure key exchange using quantum mechanics`,
      metadata: { type: 'product', productSlug: 'q-grid', category: 'features' }
    },
    {
      slug: 'product-qgrid-security',
      content: `Q-Grid Security & Compliance:
      - NIST Post-Quantum Cryptography standards compliant
      - SWIFT 2027 deadline ready - RSA-2048 encryption expires in 36 months
      - Financial institutions must migrate to quantum-safe infrastructure before 2027
      - SOC 2 Type II certified
      - ISO 27001 compliant
      - GDPR and CCPA compliant
      - Regular security audits and penetration testing`,
      metadata: { type: 'product', productSlug: 'q-grid', category: 'security' }
    },

    // Product: NeoVibe
    {
      slug: 'product-neovibe-overview',
      content: `NeoVibe is a next-generation creative AI platform for content creation, design, and multimedia production. 
      It combines multiple AI models (text, image, video, audio) to enable seamless creative workflows. 
      NeoVibe is designed for marketing teams, content creators, and creative agencies who need to produce high-quality content at scale.`,
      metadata: { type: 'product', productSlug: 'neovibe', category: 'overview' }
    },
    {
      slug: 'product-neovibe-features',
      content: `NeoVibe Features:
      - Multi-modal AI: Generate text, images, videos, and audio from simple prompts
      - Brand Consistency: Maintain brand guidelines across all generated content
      - Template Library: 1000+ professional templates for marketing materials
      - Collaboration Tools: Real-time collaboration for creative teams
      - Asset Management: Organize and manage all creative assets in one place
      - Export Formats: Support for all major file formats (PNG, JPG, MP4, MP3, PDF, etc.)
      - API Access: Integrate NeoVibe into your existing creative workflows`,
      metadata: { type: 'product', productSlug: 'neovibe', category: 'features' }
    },

    // Product: AssetGrid
    {
      slug: 'product-assetgrid-overview',
      content: `AssetGrid is an enterprise digital asset management (DAM) system with AI-powered organization and search. 
      It helps organizations manage, organize, and distribute digital assets at scale. 
      AssetGrid uses computer vision and natural language processing to automatically tag, categorize, and make assets searchable.`,
      metadata: { type: 'product', productSlug: 'assetgrid', category: 'overview' }
    },
    {
      slug: 'product-assetgrid-features',
      content: `AssetGrid Features:
      - AI-Powered Tagging: Automatic image recognition and metadata extraction
      - Smart Search: Find assets using natural language queries
      - Version Control: Track all versions and changes to assets
      - Access Control: Granular permissions and role-based access
      - CDN Integration: Fast global content delivery
      - Brand Portal: Self-service portal for partners and agencies
      - Analytics: Track asset usage and engagement metrics`,
      metadata: { type: 'product', productSlug: 'assetgrid', category: 'features' }
    },

    // FAQs
    {
      slug: 'faq-implementation-time',
      content: `FAQ: How long does implementation take?
      Answer: Implementation time varies by product and organization size:
      - BizFlow AI: 4-8 weeks for standard implementation, 12-16 weeks for enterprise
      - Q-Grid: 6-10 weeks for standard implementation, 16-24 weeks for enterprise
      - NeoVibe: 2-4 weeks for standard implementation, 6-8 weeks for enterprise
      - AssetGrid: 3-6 weeks for standard implementation, 8-12 weeks for enterprise
      We provide dedicated implementation teams, training, and ongoing support.`,
      metadata: { type: 'faq', category: 'implementation' }
    },
    {
      slug: 'faq-support',
      content: `FAQ: What support options are available?
      Answer: We offer multiple support tiers:
      - Standard Support: Email support, 24-hour response time, business hours coverage
      - Priority Support: Email and phone support, 4-hour response time, extended hours coverage
      - Enterprise Support: 24/7 phone and email support, 1-hour response time, dedicated account manager, quarterly business reviews
      All plans include access to our knowledge base, documentation, and community forums.`,
      metadata: { type: 'faq', category: 'support' }
    },
    {
      slug: 'faq-security',
      content: `FAQ: How secure is Taurus AI's infrastructure?
      Answer: Security is our top priority. All products include:
      - End-to-end encryption for data in transit and at rest
      - SOC 2 Type II certification
      - ISO 27001 compliance
      - Regular third-party security audits
      - GDPR and CCPA compliance
      - Zero-trust architecture
      - Multi-factor authentication (MFA)
      - Role-based access control (RBAC)
      For Q-Grid specifically, we use NIST-approved post-quantum cryptography algorithms.`,
      metadata: { type: 'faq', category: 'security' }
    },
    {
      slug: 'faq-integration',
      content: `FAQ: Can Taurus AI products integrate with our existing systems?
      Answer: Yes, all our products are designed for seamless integration:
      - Pre-built connectors for 100+ enterprise applications (Salesforce, SAP, Oracle, Microsoft, Google, etc.)
      - RESTful APIs for custom integrations
      - Webhook support for real-time events
      - SAML/OAuth for single sign-on (SSO)
      - Support for industry-standard protocols (SOAP, REST, GraphQL)
      Our integration team can help with custom integration requirements.`,
      metadata: { type: 'faq', category: 'integration' }
    },
    {
      slug: 'faq-pricing-custom',
      content: `FAQ: Do you offer custom pricing for large enterprises?
      Answer: Yes, we offer flexible pricing for enterprise customers:
      - Volume discounts for multi-year contracts
      - Custom pricing based on usage and user count
      - Bundled pricing for multiple products
      - Flexible payment terms
      - Proof-of-concept (POC) programs
      Contact our sales team to discuss your specific requirements and get a custom quote.`,
      metadata: { type: 'faq', category: 'pricing' }
    },

    // Company Information
    {
      slug: 'company-overview',
      content: `Taurus AI Corp is an enterprise AI company specializing in quantum-safe infrastructure and agentic AI solutions. 
      Founded with a mission to help organizations prepare for the quantum computing era while leveraging the power of artificial intelligence today. 
      We serve Fortune 500 companies, government agencies, and fast-growing enterprises across finance, healthcare, manufacturing, and technology sectors. 
      Our products are trusted by organizations that require the highest levels of security, reliability, and performance.`,
      metadata: { type: 'company', category: 'overview' }
    },
    {
      slug: 'company-contact',
      content: `Contact Taurus AI:
      - Email: taurus.ai@taas-ai.com
      - Request a demo or consultation through our website
      - Schedule a call with our sales team
      - Join our webinars and events
      - Follow us on social media for updates and insights
      Our team typically responds within 24 hours during business days.`,
      metadata: { type: 'company', category: 'contact' }
    },

    // Use Cases
    {
      slug: 'usecase-financial-services',
      content: `Use Case: Financial Services & Banking
      Taurus AI helps financial institutions prepare for quantum computing threats:
      - Migrate to quantum-safe encryption before SWIFT 2027 deadline
      - Automate compliance reporting and regulatory workflows with BizFlow AI
      - Secure transaction processing with Q-Grid's post-quantum cryptography
      - Reduce operational costs by 40% through intelligent automation
      - Meet NIST PQC compliance requirements
      Case Study: A global bank reduced fraud detection time by 75% using BizFlow AI.`,
      metadata: { type: 'usecase', category: 'financial-services' }
    },
    {
      slug: 'usecase-healthcare',
      content: `Use Case: Healthcare & Life Sciences
      Taurus AI enables secure, efficient healthcare operations:
      - HIPAA-compliant workflow automation for patient data processing
      - Quantum-safe encryption for sensitive medical records
      - AI-powered document processing for insurance claims
      - Automated appointment scheduling and patient communication
      - Secure collaboration between healthcare providers
      Case Study: A healthcare network reduced claim processing time by 60% with BizFlow AI.`,
      metadata: { type: 'usecase', category: 'healthcare' }
    },
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const doc of documents) {
    try {
      // Add slug to metadata for identification
      const metadata = { ...doc.metadata, slug: doc.slug };
      await storeDocument(randomUUID(), doc.content, metadata);
      console.log(`✅ Stored: ${doc.slug}`);
      successCount++;
      
      // Add delay to avoid rate limiting (OpenAI embeddings API)
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    } catch (error) {
      console.error(`❌ Failed to store ${doc.id}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Seeding complete:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total: ${documents.length}`);
}

// Run the seeding script
seedKnowledgeBase()
  .then(() => {
    console.log('\n✨ Knowledge base seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Knowledge base seeding failed:', error);
    process.exit(1);
  });
