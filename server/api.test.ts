import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getAllProducts: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: "bizflow",
      name: "BizFlow™",
      tagline: "Intelligent Workflow Automation Engine",
      description: "Automate complex business processes",
      icon: "Workflow",
      color: "cobalt",
      features: ["Feature 1", "Feature 2"],
      useCases: [{ title: "Use Case 1", description: "Description", metric: "70%" }],
      financialImpact: [{ label: "ROI", value: "2,100%" }],
      differentiators: ["No-code", "Quantum-safe"],
      order: 1,
      isActive: true,
    },
  ]),
  getProductBySlug: vi.fn().mockResolvedValue({
    id: 1,
    slug: "bizflow",
    name: "BizFlow™",
    tagline: "Intelligent Workflow Automation Engine",
  }),
  getAllCaseStudies: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: "national-bank-quantum-migration",
      title: "National Bank's Quantum-Safe Migration",
      clientName: "Leading National Bank",
      industry: "Banking",
      isFeatured: true,
    },
  ]),
  getFeaturedCaseStudies: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: "national-bank-quantum-migration",
      title: "National Bank's Quantum-Safe Migration",
      isFeatured: true,
    },
  ]),
  getCaseStudyBySlug: vi.fn().mockResolvedValue({
    id: 1,
    slug: "national-bank-quantum-migration",
    title: "National Bank's Quantum-Safe Migration",
  }),
  getAllAuthors: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: "dr-priya-sharma",
      name: "Dr. Priya Sharma",
      title: "CTO",
      isActive: true,
    },
  ]),
  getAuthorBySlug: vi.fn().mockResolvedValue({
    id: 1,
    slug: "dr-priya-sharma",
    name: "Dr. Priya Sharma",
  }),
  getAuthorById: vi.fn().mockResolvedValue({
    id: 1,
    name: "Dr. Priya Sharma",
  }),
  getAllBlogPosts: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: "quantum-threat-timeline-2027",
      title: "The Quantum Threat Timeline",
      category: "thought-leadership",
      isFeatured: true,
    },
  ]),
  getFeaturedBlogPosts: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: "quantum-threat-timeline-2027",
      title: "The Quantum Threat Timeline",
      isFeatured: true,
    },
  ]),
  getBlogPostsByCategory: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: "quantum-threat-timeline-2027",
      title: "The Quantum Threat Timeline",
      category: "thought-leadership",
    },
  ]),
  getBlogPostBySlug: vi.fn().mockResolvedValue({
    id: 1,
    slug: "quantum-threat-timeline-2027",
    title: "The Quantum Threat Timeline",
  }),
  getBlogPostsByAuthor: vi.fn().mockResolvedValue([]),
  getAllDownloadableAssets: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: "annual-report-2025",
      title: "Annual Report 2025",
      category: "annual-report",
    },
  ]),
  getDownloadableAssetsByCategory: vi.fn().mockResolvedValue([]),
  getDownloadableAssetBySlug: vi.fn().mockResolvedValue(null),
  incrementDownloadCount: vi.fn().mockResolvedValue(undefined),
  getAllPressReleases: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: "rbi-harbinger-award-2025",
      title: "Taurus AI Wins RBI Harbinger Award",
      category: "award",
    },
  ]),
  getPressReleasesByCategory: vi.fn().mockResolvedValue([]),
  getPressReleaseBySlug: vi.fn().mockResolvedValue(null),
  getAllTestimonials: vi.fn().mockResolvedValue([
    {
      id: 1,
      quote: "Taurus AI transformed our security posture overnight.",
      authorName: "CISO",
      companyName: "Leading National Bank",
      isFeatured: true,
    },
  ]),
  getFeaturedTestimonials: vi.fn().mockResolvedValue([
    {
      id: 1,
      quote: "Taurus AI transformed our security posture overnight.",
      isFeatured: true,
    },
  ]),
  createLead: vi.fn().mockResolvedValue(1),
  globalSearch: vi.fn().mockResolvedValue({
    products: [],
    caseStudies: [],
    blogPosts: [],
    pressReleases: [],
    assets: [],
  }),
}));

// Mock notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Products Router", () => {
  it("returns list of products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const products = await caller.products.list();
    
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty("name");
    expect(products[0]).toHaveProperty("slug");
  });

  it("returns product by slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const product = await caller.products.bySlug({ slug: "bizflow" });
    
    expect(product).toBeDefined();
    expect(product?.slug).toBe("bizflow");
  });
});

describe("Case Studies Router", () => {
  it("returns list of case studies", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const caseStudies = await caller.caseStudies.list();
    
    expect(caseStudies).toBeDefined();
    expect(Array.isArray(caseStudies)).toBe(true);
  });

  it("returns featured case studies", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const featured = await caller.caseStudies.featured();
    
    expect(featured).toBeDefined();
    expect(Array.isArray(featured)).toBe(true);
  });
});

describe("Blog Router", () => {
  it("returns list of blog posts", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const posts = await caller.blog.list();
    
    expect(posts).toBeDefined();
    expect(Array.isArray(posts)).toBe(true);
  });

  it("returns posts by category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const posts = await caller.blog.byCategory({ category: "thought-leadership" });
    
    expect(posts).toBeDefined();
    expect(Array.isArray(posts)).toBe(true);
  });

  it("returns featured blog posts", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const featured = await caller.blog.featured();
    
    expect(featured).toBeDefined();
    expect(Array.isArray(featured)).toBe(true);
  });
});

describe("Authors Router", () => {
  it("returns list of authors", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const authors = await caller.authors.list();
    
    expect(authors).toBeDefined();
    expect(Array.isArray(authors)).toBe(true);
  });

  it("returns author by slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const author = await caller.authors.bySlug({ slug: "dr-priya-sharma" });
    
    expect(author).toBeDefined();
    expect(author?.slug).toBe("dr-priya-sharma");
  });
});

describe("Testimonials Router", () => {
  it("returns list of testimonials", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const testimonials = await caller.testimonials.list();
    
    expect(testimonials).toBeDefined();
    expect(Array.isArray(testimonials)).toBe(true);
  });

  it("returns featured testimonials", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const featured = await caller.testimonials.featured();
    
    expect(featured).toBeDefined();
    expect(Array.isArray(featured)).toBe(true);
  });
});

describe("Assets Router", () => {
  it("returns list of downloadable assets", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const assets = await caller.assets.list();
    
    expect(assets).toBeDefined();
    expect(Array.isArray(assets)).toBe(true);
  });

  it("tracks download count", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.assets.trackDownload({ id: 1 });
    
    expect(result).toEqual({ success: true });
  });
});

describe("Press Router", () => {
  it("returns list of press releases", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const releases = await caller.press.list();
    
    expect(releases).toBeDefined();
    expect(Array.isArray(releases)).toBe(true);
  });
});

describe("Leads Router", () => {
  it("submits a lead successfully", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.leads.submit({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      company: "Test Corp",
      leadType: "demo-request",
    });
    
    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("leadId");
  });
});

describe("Search Router", () => {
  it("returns search results", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const results = await caller.search.query({ query: "quantum" });
    
    expect(results).toBeDefined();
    expect(results).toHaveProperty("products");
    expect(results).toHaveProperty("caseStudies");
    expect(results).toHaveProperty("blogPosts");
    expect(results).toHaveProperty("pressReleases");
  });
});
