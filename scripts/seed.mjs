import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

console.log("Seeding database...");

// Seed Products
const productsData = [
  {
    slug: "bizflow",
    name: "BizFlow™",
    tagline: "Intelligent Workflow Automation Engine",
    description: "Automate complex business processes while maintaining human oversight and control. BizFlow™ delivers quantum-resistant transaction integrity verification with natural language workflow definition.",
    icon: "Workflow",
    color: "cobalt",
    features: JSON.stringify([
      "Natural language workflow definition (no coding required)",
      "Real-time process monitoring with predictive alerts",
      "Quantum-resistant transaction integrity verification",
      "Approval routing with multi-factor authentication",
      "Audit trail compliance for regulatory requirements"
    ]),
    useCases: JSON.stringify([
      { title: "Loan Origination Automation", description: "Streamline end-to-end loan processing", metric: "70% process time reduction" },
      { title: "Customer Onboarding Workflows", description: "Accelerate KYC completion", metric: "90-day acceleration" },
      { title: "Document Management", description: "Quantum-safe archival with instant retrieval", metric: "99.9% retrieval accuracy" },
      { title: "Transaction Settlement", description: "Sub-second finality with zero disputes", metric: "0 settlement disputes" },
      { title: "Compliance Reporting", description: "Automated regulatory submission", metric: "100% audit compliance" }
    ]),
    financialImpact: JSON.stringify([
      { label: "Implementation Cost", value: "₹50 Lakhs - 2 Crores" },
      { label: "Payback Period", value: "6-12 months" },
      { label: "Annual Savings", value: "₹3-8 Crores" }
    ]),
    differentiators: JSON.stringify([
      "No-code workflow builder",
      "Quantum-safe processing",
      "Real-time monitoring",
      "Enterprise-grade security"
    ]),
    order: 1,
    isActive: true
  },
  {
    slug: "q-grid",
    name: "Q-Grid™",
    tagline: "Enterprise Query & Intelligence Platform",
    description: "Query vast datasets with quantum-resistant encryption while maintaining sub-second response times. Advanced analytics with machine learning integration and zero-knowledge proof capabilities.",
    icon: "Database",
    color: "quantum",
    features: JSON.stringify([
      "Parallel query processing across distributed quantum-safe ledgers",
      "Advanced analytics with machine learning integration",
      "Real-time data visualization with interactive dashboards",
      "Hierarchical access control with cryptographic permission validation",
      "Zero-knowledge proof capabilities for sensitive analysis"
    ]),
    useCases: JSON.stringify([
      { title: "Portfolio Risk Analysis", description: "Real-time VaR calculations", metric: "100K+ contracts analyzed" },
      { title: "Customer Intelligence", description: "360-degree view with behavioral prediction", metric: "95% prediction accuracy" },
      { title: "Fraud Detection", description: "Real-time transaction monitoring", metric: "99.73% detection rate" },
      { title: "Regulatory Reporting", description: "Automated compliance metrics", metric: "60% faster reporting" },
      { title: "Financial Forecasting", description: "Quantum-resistant Monte Carlo", metric: "Sub-second calculations" }
    ]),
    financialImpact: JSON.stringify([
      { label: "Fraud Prevention", value: "₹50+ Crores annually" },
      { label: "Operational Efficiency", value: "60% reduction in report time" },
      { label: "Risk Mitigation", value: "₹100+ Crores saved" }
    ]),
    differentiators: JSON.stringify([
      "Zero-knowledge proofs",
      "ML-powered analytics",
      "Real-time dashboards",
      "Quantum-safe encryption"
    ]),
    order: 2,
    isActive: true
  },
  {
    slug: "assetgrid",
    name: "AssetGrid™",
    tagline: "Enterprise Asset Management",
    description: "Manage distributed enterprise assets with quantum-resistant ledger integrity. Immutable asset tracking with multi-party consensus and offline transaction capability.",
    icon: "Shield",
    color: "charcoal",
    features: JSON.stringify([
      "Immutable asset tracking with post-quantum cryptography",
      "Multi-party consensus for transaction verification",
      "Offline transaction capability for remote operations",
      "Automatic settlement with deterministic finality",
      "Regulatory reporting with cryptographic proof-of-integrity"
    ]),
    useCases: JSON.stringify([
      { title: "Banking Infrastructure", description: "Quantum-safe deposit management", metric: "99.99% uptime" },
      { title: "Government Institutions", description: "Sovereign digital currency operations", metric: "1M+ daily transactions" },
      { title: "Enterprise Financial Operations", description: "High-value asset custody", metric: "₹1000+ Crores managed" },
      { title: "Cross-Border Payments", description: "International settlement", metric: "50% cost reduction" },
      { title: "Distributed Banking", description: "Branch-level asset management", metric: "Real-time visibility" }
    ]),
    financialImpact: JSON.stringify([
      { label: "Settlement Efficiency", value: "50% cost reduction" },
      { label: "Dispute Resolution", value: "99% reduction" },
      { label: "Compliance Savings", value: "₹2+ Crores annually" }
    ]),
    differentiators: JSON.stringify([
      "Offline capability",
      "Multi-party consensus",
      "Immutable ledger",
      "Cross-border ready"
    ]),
    order: 3,
    isActive: true
  },
  {
    slug: "neovibe",
    name: "Neovibe™",
    tagline: "Intuitive Experience Layer",
    description: "Enterprise-grade functionality with consumer-grade simplicity and accessibility. Accessibility-first design with multi-language support and quantum-resistant session management.",
    icon: "Sparkles",
    color: "silver",
    features: JSON.stringify([
      "Accessibility-first design (WCAG 2.1 AAA compliance)",
      "Multi-language support (20+ languages with cultural adaptation)",
      "Responsive design across all devices and network conditions",
      "Contextual help and guided workflows",
      "Quantum-resistant session management with invisible security"
    ]),
    useCases: JSON.stringify([
      { title: "Digital Banking for All", description: "Inclusive design for diverse populations", metric: "85%+ adoption rate" },
      { title: "Mobile-First Operations", description: "Offline capability for limited connectivity", metric: "100% offline support" },
      { title: "Citizen Services", description: "Government digital identity integration", metric: "1M+ users served" },
      { title: "Enterprise Portals", description: "Employee and customer applications", metric: "70% fewer support tickets" },
      { title: "IoT Integration", description: "Device management with quantum-resistant communication", metric: "10K+ devices" }
    ]),
    financialImpact: JSON.stringify([
      { label: "User Adoption", value: "85%+ (vs 40% industry avg)" },
      { label: "Support Cost Reduction", value: "70% fewer tickets" },
      { label: "Accessibility Compliance", value: "Zero litigation risk" }
    ]),
    differentiators: JSON.stringify([
      "WCAG 2.1 AAA compliant",
      "20+ languages",
      "Offline-first design",
      "Invisible security"
    ]),
    order: 4,
    isActive: true
  }
];

// Seed Authors
const authorsData = [
  {
    slug: "dr-priya-sharma",
    name: "Dr. Priya Sharma",
    title: "Chief Technology Officer",
    bio: "Dr. Sharma leads Taurus AI's technology strategy with 20+ years of experience in quantum computing and cryptography. Former research lead at ISRO and advisor to RBI on digital currency initiatives.",
    avatar: null,
    linkedIn: "https://linkedin.com/in/priyasharma",
    isActive: true
  },
  {
    slug: "rajesh-kumar",
    name: "Rajesh Kumar",
    title: "VP of Product",
    bio: "Rajesh brings 15 years of enterprise software experience from leading fintech companies. He specializes in building scalable platforms that meet the rigorous demands of financial institutions.",
    avatar: null,
    linkedIn: "https://linkedin.com/in/rajeshkumar",
    isActive: true
  },
  {
    slug: "anita-desai",
    name: "Anita Desai",
    title: "Head of Compliance",
    bio: "Anita is a regulatory expert with deep knowledge of SWIFT, RBI, and international banking compliance frameworks. She ensures Taurus AI stays ahead of evolving regulatory requirements.",
    avatar: null,
    linkedIn: "https://linkedin.com/in/anitadesai",
    isActive: true
  }
];

// Seed Case Studies
const caseStudiesData = [
  {
    slug: "national-bank-quantum-migration",
    title: "National Bank's Quantum-Safe Migration",
    clientName: "Leading National Bank",
    clientLogo: null,
    industry: "Banking & Financial Services",
    challenge: "A $5B national bank faced the urgent need to migrate their entire infrastructure to quantum-resistant security before the SWIFT 2027 deadline. Their legacy RSA-2048 encryption was vulnerable to 'harvest now, decrypt later' attacks.",
    solution: "Taurus AI implemented a comprehensive quantum-safe migration using BizFlow™ for workflow automation and Q-Grid™ for secure data processing. The phased approach ensured zero downtime during the 90-day implementation.",
    results: "The bank achieved full SWIFT 2027 compliance two years ahead of deadline, processing over 1 million quantum-safe transactions in the first month. Operational costs reduced by 45% through automation.",
    testimonial: "Taurus AI transformed our security posture overnight. We went from being vulnerable to being industry leaders in quantum readiness.",
    testimonialAuthor: "Chief Information Security Officer",
    testimonialRole: "Leading National Bank",
    metrics: JSON.stringify([
      { label: "ROI", value: "2,100%", description: "12-month return on investment" },
      { label: "Cost Reduction", value: "45%", description: "Operational cost savings" },
      { label: "Implementation", value: "90 days", description: "Full deployment timeline" },
      { label: "Transactions", value: "1M+", description: "Monthly quantum-safe transactions" }
    ]),
    productsUsed: JSON.stringify(["BizFlow™", "Q-Grid™", "AssetGrid™"]),
    implementationTime: "90 days",
    featuredImage: null,
    isFeatured: true,
    isPublished: true,
    publishedAt: new Date("2025-10-15")
  },
  {
    slug: "central-bank-cbdc-deployment",
    title: "Central Bank CBDC Implementation",
    clientName: "Reserve Bank Institution",
    clientLogo: null,
    industry: "Government & Central Banking",
    challenge: "A central banking institution needed to launch a pilot CBDC program with quantum-safe architecture, supporting offline transactions for rural areas with limited connectivity.",
    solution: "Deployed AssetGrid™ for quantum-resistant ledger management and Neovibe™ for an accessible user interface supporting 15 regional languages. The offline-first architecture ensured financial inclusion.",
    results: "Successfully processed 500,000+ CBDC transactions in the pilot phase with 99.99% uptime. The program reached 2 million citizens in underserved areas.",
    testimonial: "The offline capability was game-changing for our financial inclusion goals. Taurus AI delivered exactly what we needed for our CBDC vision.",
    testimonialAuthor: "Deputy Governor",
    testimonialRole: "Reserve Bank Institution",
    metrics: JSON.stringify([
      { label: "Transactions", value: "500K+", description: "Pilot phase transactions" },
      { label: "Uptime", value: "99.99%", description: "System availability" },
      { label: "Citizens Reached", value: "2M+", description: "Financial inclusion impact" },
      { label: "Languages", value: "15", description: "Regional language support" }
    ]),
    productsUsed: JSON.stringify(["AssetGrid™", "Neovibe™"]),
    implementationTime: "120 days",
    featuredImage: null,
    isFeatured: true,
    isPublished: true,
    publishedAt: new Date("2025-09-20")
  },
  {
    slug: "fintech-scale-transformation",
    title: "Fintech Platform Scaling Success",
    clientName: "Leading Payment Platform",
    clientLogo: null,
    industry: "Financial Technology",
    challenge: "A Series C fintech company needed to scale from 1,000 to 10,000+ transactions per second while maintaining regulatory compliance and preparing for quantum threats.",
    solution: "Implemented Q-Grid™ for high-performance query processing and BizFlow™ for automated compliance workflows. The platform was designed for horizontal scaling with quantum-safe foundations.",
    results: "Achieved 15,000 TPS capacity with sub-100ms latency. Fraud detection improved to 99.73% accuracy, preventing ₹50+ Crores in potential losses annually.",
    testimonial: "Taurus AI gave us enterprise-grade infrastructure without enterprise-grade complexity. Our engineering team was productive from day one.",
    testimonialAuthor: "Chief Technology Officer",
    testimonialRole: "Leading Payment Platform",
    metrics: JSON.stringify([
      { label: "TPS Capacity", value: "15,000", description: "Transactions per second" },
      { label: "Latency", value: "<100ms", description: "Average response time" },
      { label: "Fraud Detection", value: "99.73%", description: "Detection accuracy" },
      { label: "Savings", value: "₹50Cr+", description: "Annual fraud prevention" }
    ]),
    productsUsed: JSON.stringify(["Q-Grid™", "BizFlow™"]),
    implementationTime: "60 days",
    featuredImage: null,
    isFeatured: true,
    isPublished: true,
    publishedAt: new Date("2025-08-10")
  }
];

// Seed Blog Posts
const blogPostsData = [
  {
    slug: "quantum-threat-timeline-2027",
    title: "The Quantum Threat Timeline: Why 2027 Changes Everything",
    excerpt: "RSA-2048 encryption will become vulnerable to quantum attacks within 36 months. Here's what enterprise leaders need to know about the SWIFT 2027 mandate and how to prepare.",
    content: "The quantum computing revolution is no longer a distant possibility—it's an imminent reality that will fundamentally reshape enterprise security...",
    featuredImage: null,
    authorId: 1,
    category: "thought-leadership",
    tags: JSON.stringify(["quantum computing", "security", "SWIFT 2027", "enterprise"]),
    readTime: 8,
    isFeatured: true,
    isPublished: true,
    publishedAt: new Date("2025-12-01")
  },
  {
    slug: "bizflow-natural-language-workflows",
    title: "Building Enterprise Workflows with Natural Language",
    excerpt: "Discover how BizFlow™'s natural language processing enables business users to create complex workflows without writing a single line of code.",
    content: "Traditional workflow automation required specialized developers and months of implementation. BizFlow™ changes this paradigm entirely...",
    featuredImage: null,
    authorId: 2,
    category: "product-capabilities",
    tags: JSON.stringify(["BizFlow", "automation", "no-code", "workflows"]),
    readTime: 6,
    isFeatured: false,
    isPublished: true,
    publishedAt: new Date("2025-11-28")
  },
  {
    slug: "rbi-harbinger-recognition",
    title: "Taurus AI Wins RBI Harbinger Innovation Award",
    excerpt: "Our quantum-safe CBDC solution has been recognized by the Reserve Bank of India's prestigious innovation program, validating our approach to financial infrastructure.",
    content: "We are honored to announce that Taurus AI has been selected as a winner of the RBI Harbinger innovation program...",
    featuredImage: null,
    authorId: 3,
    category: "customer-success",
    tags: JSON.stringify(["RBI", "award", "CBDC", "innovation"]),
    readTime: 4,
    isFeatured: true,
    isPublished: true,
    publishedAt: new Date("2025-11-15")
  },
  {
    slug: "swift-pqc-compliance-guide",
    title: "Complete Guide to SWIFT PQC 2027 Compliance",
    excerpt: "A comprehensive breakdown of SWIFT's post-quantum cryptography requirements and a step-by-step roadmap for achieving compliance ahead of the deadline.",
    content: "The SWIFT network's 2027 post-quantum cryptography mandate represents the largest coordinated security upgrade in financial history...",
    featuredImage: null,
    authorId: 3,
    category: "regulatory-compliance",
    tags: JSON.stringify(["SWIFT", "compliance", "PQC", "regulations"]),
    readTime: 12,
    isFeatured: false,
    isPublished: true,
    publishedAt: new Date("2025-11-10")
  },
  {
    slug: "quantum-computing-banking-2025",
    title: "Quantum Computing in Banking: 2025 Industry Report",
    excerpt: "Our analysis of quantum computing adoption across the global banking sector reveals accelerating investment and growing urgency around security upgrades.",
    content: "The banking industry's relationship with quantum computing has shifted dramatically over the past year...",
    featuredImage: null,
    authorId: 1,
    category: "industry-news",
    tags: JSON.stringify(["quantum computing", "banking", "industry trends", "research"]),
    readTime: 10,
    isFeatured: false,
    isPublished: true,
    publishedAt: new Date("2025-11-05")
  }
];

// Seed Testimonials
const testimonialsData = [
  {
    quote: "Taurus AI transformed our security posture overnight. We went from being vulnerable to being industry leaders in quantum readiness.",
    authorName: "Chief Information Security Officer",
    authorTitle: "CISO",
    companyName: "Leading National Bank",
    companyLogo: null,
    rating: 5,
    isFeatured: true,
    isPublished: true,
    order: 1
  },
  {
    quote: "The offline capability was game-changing for our financial inclusion goals. Taurus AI delivered exactly what we needed for our CBDC vision.",
    authorName: "Deputy Governor",
    authorTitle: "Deputy Governor",
    companyName: "Reserve Bank Institution",
    companyLogo: null,
    rating: 5,
    isFeatured: true,
    isPublished: true,
    order: 2
  },
  {
    quote: "Taurus AI gave us enterprise-grade infrastructure without enterprise-grade complexity. Our engineering team was productive from day one.",
    authorName: "Chief Technology Officer",
    authorTitle: "CTO",
    companyName: "Leading Payment Platform",
    companyLogo: null,
    rating: 5,
    isFeatured: true,
    isPublished: true,
    order: 3
  },
  {
    quote: "The ROI exceeded our projections by 40%. BizFlow™ automated processes we thought would require years of custom development.",
    authorName: "VP of Operations",
    authorTitle: "VP Operations",
    companyName: "Enterprise Financial Services",
    companyLogo: null,
    rating: 5,
    isFeatured: false,
    isPublished: true,
    order: 4
  }
];

// Seed Downloadable Assets
const assetsData = [
  {
    slug: "annual-report-2025",
    title: "Taurus AI Annual Report 2025",
    description: "Comprehensive overview of our financial performance, strategic initiatives, and technology roadmap for the year.",
    category: "annual-report",
    fileUrl: "/downloads/taurus-ai-annual-report-2025.pdf",
    fileSize: "4.2 MB",
    fileType: "PDF",
    thumbnailUrl: null,
    downloadCount: 0,
    isPublished: true,
    publishedAt: new Date("2025-03-15")
  },
  {
    slug: "media-kit-2025",
    title: "Taurus AI Media Kit",
    description: "Official logos, brand guidelines, executive photos, and company information for press and media use.",
    category: "media-kit",
    fileUrl: "/downloads/taurus-ai-media-kit.zip",
    fileSize: "15.8 MB",
    fileType: "ZIP",
    thumbnailUrl: null,
    downloadCount: 0,
    isPublished: true,
    publishedAt: new Date("2025-01-01")
  },
  {
    slug: "investor-pitch-deck",
    title: "Investor Presentation",
    description: "Detailed presentation covering market opportunity, technology differentiation, financial projections, and growth strategy.",
    category: "pitch-deck",
    fileUrl: "/downloads/taurus-ai-investor-deck.pdf",
    fileSize: "8.5 MB",
    fileType: "PDF",
    thumbnailUrl: null,
    downloadCount: 0,
    isPublished: true,
    publishedAt: new Date("2025-06-01")
  },
  {
    slug: "quantum-security-whitepaper",
    title: "Post-Quantum Cryptography Whitepaper",
    description: "Technical deep-dive into our quantum-resistant security architecture, NIST standards compliance, and implementation methodology.",
    category: "whitepaper",
    fileUrl: "/downloads/pqc-whitepaper.pdf",
    fileSize: "2.1 MB",
    fileType: "PDF",
    thumbnailUrl: null,
    downloadCount: 0,
    isPublished: true,
    publishedAt: new Date("2025-09-01")
  },
  {
    slug: "company-fact-sheet",
    title: "Company Fact Sheet",
    description: "One-page overview of Taurus AI including key metrics, product portfolio, and contact information.",
    category: "fact-sheet",
    fileUrl: "/downloads/taurus-ai-fact-sheet.pdf",
    fileSize: "512 KB",
    fileType: "PDF",
    thumbnailUrl: null,
    downloadCount: 0,
    isPublished: true,
    publishedAt: new Date("2025-01-01")
  }
];

// Seed Press Releases
const pressReleasesData = [
  {
    slug: "rbi-harbinger-award-2025",
    title: "Taurus AI Wins RBI Harbinger Innovation Award",
    excerpt: "Taurus AI's quantum-safe CBDC solution recognized by Reserve Bank of India's prestigious innovation program.",
    content: "Mumbai, India - Taurus AI today announced that it has been selected as a winner of the Reserve Bank of India's Harbinger innovation program...",
    category: "award",
    featuredImage: null,
    externalUrl: null,
    isPublished: true,
    publishedAt: new Date("2025-11-15")
  },
  {
    slug: "series-b-funding-announcement",
    title: "Taurus AI Raises $50M Series B to Accelerate Quantum-Safe Infrastructure",
    excerpt: "Funding round led by top-tier investors will fuel expansion into global markets and accelerate product development.",
    content: "Mumbai, India - Taurus AI, the leading provider of quantum-safe enterprise infrastructure, today announced the completion of a $50 million Series B funding round...",
    category: "press-release",
    featuredImage: null,
    externalUrl: null,
    isPublished: true,
    publishedAt: new Date("2025-09-01")
  },
  {
    slug: "swift-partnership-announcement",
    title: "Taurus AI Partners with SWIFT for PQC Migration Initiative",
    excerpt: "Strategic partnership will help financial institutions worldwide achieve quantum-safe compliance ahead of 2027 deadline.",
    content: "Mumbai, India - Taurus AI today announced a strategic partnership with SWIFT to support the global financial network's post-quantum cryptography migration initiative...",
    category: "partnership",
    featuredImage: null,
    externalUrl: null,
    isPublished: true,
    publishedAt: new Date("2025-07-15")
  }
];

// Execute seeding
try {
  console.log("Inserting products...");
  for (const product of productsData) {
    await connection.execute(
      `INSERT INTO products (slug, name, tagline, description, icon, color, features, useCases, financialImpact, differentiators, \`order\`, isActive) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name)`,
      [product.slug, product.name, product.tagline, product.description, product.icon, product.color, 
       product.features, product.useCases, product.financialImpact, product.differentiators, product.order, product.isActive]
    );
  }

  console.log("Inserting authors...");
  for (const author of authorsData) {
    await connection.execute(
      `INSERT INTO authors (slug, name, title, bio, avatar, linkedIn, isActive) 
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name)`,
      [author.slug, author.name, author.title, author.bio, author.avatar, author.linkedIn, author.isActive]
    );
  }

  console.log("Inserting case studies...");
  for (const cs of caseStudiesData) {
    await connection.execute(
      `INSERT INTO caseStudies (slug, title, clientName, clientLogo, industry, challenge, solution, results, testimonial, testimonialAuthor, testimonialRole, metrics, productsUsed, implementationTime, featuredImage, isFeatured, isPublished, publishedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title)`,
      [cs.slug, cs.title, cs.clientName, cs.clientLogo, cs.industry, cs.challenge, cs.solution, cs.results, 
       cs.testimonial, cs.testimonialAuthor, cs.testimonialRole, cs.metrics, cs.productsUsed, 
       cs.implementationTime, cs.featuredImage, cs.isFeatured, cs.isPublished, cs.publishedAt]
    );
  }

  console.log("Inserting blog posts...");
  for (const post of blogPostsData) {
    await connection.execute(
      `INSERT INTO blogPosts (slug, title, excerpt, content, featuredImage, authorId, category, tags, readTime, isFeatured, isPublished, publishedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title)`,
      [post.slug, post.title, post.excerpt, post.content, post.featuredImage, post.authorId, 
       post.category, post.tags, post.readTime, post.isFeatured, post.isPublished, post.publishedAt]
    );
  }

  console.log("Inserting testimonials...");
  for (const t of testimonialsData) {
    await connection.execute(
      `INSERT INTO testimonials (quote, authorName, authorTitle, companyName, companyLogo, rating, isFeatured, isPublished, \`order\`) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [t.quote, t.authorName, t.authorTitle, t.companyName, t.companyLogo, t.rating, t.isFeatured, t.isPublished, t.order]
    );
  }

  console.log("Inserting downloadable assets...");
  for (const asset of assetsData) {
    await connection.execute(
      `INSERT INTO downloadableAssets (slug, title, description, category, fileUrl, fileSize, fileType, thumbnailUrl, downloadCount, isPublished, publishedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title)`,
      [asset.slug, asset.title, asset.description, asset.category, asset.fileUrl, asset.fileSize, 
       asset.fileType, asset.thumbnailUrl, asset.downloadCount, asset.isPublished, asset.publishedAt]
    );
  }

  console.log("Inserting press releases...");
  for (const pr of pressReleasesData) {
    await connection.execute(
      `INSERT INTO pressReleases (slug, title, excerpt, content, category, featuredImage, externalUrl, isPublished, publishedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title)`,
      [pr.slug, pr.title, pr.excerpt, pr.content, pr.category, pr.featuredImage, pr.externalUrl, pr.isPublished, pr.publishedAt]
    );
  }

  console.log("✅ Database seeded successfully!");
} catch (error) {
  console.error("Error seeding database:", error);
} finally {
  await connection.end();
}
