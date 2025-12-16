import { eq, desc, and, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  products, Product, InsertProduct,
  caseStudies, CaseStudy, InsertCaseStudy,
  authors, Author, InsertAuthor,
  blogPosts, BlogPost, InsertBlogPost,
  downloadableAssets, DownloadableAsset, InsertDownloadableAsset,
  leads, Lead, InsertLead,
  pressReleases, PressRelease, InsertPressRelease,
  testimonials, Testimonial, InsertTestimonial
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER FUNCTIONS ============
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ PRODUCTS FUNCTIONS ============
export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.isActive, true)).orderBy(products.order);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result[0];
}

export async function createProduct(product: InsertProduct): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(products).values(product);
}

// ============ CASE STUDIES FUNCTIONS ============
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(caseStudies).where(eq(caseStudies.isPublished, true)).orderBy(desc(caseStudies.publishedAt));
}

export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(caseStudies)
    .where(and(eq(caseStudies.isPublished, true), eq(caseStudies.isFeatured, true)))
    .orderBy(desc(caseStudies.publishedAt));
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(caseStudies).where(eq(caseStudies.slug, slug)).limit(1);
  return result[0];
}

export async function createCaseStudy(caseStudy: InsertCaseStudy): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(caseStudies).values(caseStudy);
}

// ============ AUTHORS FUNCTIONS ============
export async function getAllAuthors(): Promise<Author[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(authors).where(eq(authors.isActive, true));
}

export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(authors).where(eq(authors.slug, slug)).limit(1);
  return result[0];
}

export async function getAuthorById(id: number): Promise<Author | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(authors).where(eq(authors.id, id)).limit(1);
  return result[0];
}

export async function createAuthor(author: InsertAuthor): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(authors).values(author);
}

// ============ BLOG POSTS FUNCTIONS ============
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).where(eq(blogPosts.isPublished, true)).orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostsByCategory(category: BlogPost["category"]): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts)
    .where(and(eq(blogPosts.isPublished, true), eq(blogPosts.category, category)))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts)
    .where(and(eq(blogPosts.isPublished, true), eq(blogPosts.isFeatured, true)))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(5);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result[0];
}

export async function getBlogPostsByAuthor(authorId: number): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts)
    .where(and(eq(blogPosts.isPublished, true), eq(blogPosts.authorId, authorId)))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function createBlogPost(post: InsertBlogPost): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(blogPosts).values(post);
}

// ============ DOWNLOADABLE ASSETS FUNCTIONS ============
export async function getAllDownloadableAssets(): Promise<DownloadableAsset[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(downloadableAssets).where(eq(downloadableAssets.isPublished, true)).orderBy(desc(downloadableAssets.publishedAt));
}

export async function getDownloadableAssetsByCategory(category: DownloadableAsset["category"]): Promise<DownloadableAsset[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(downloadableAssets)
    .where(and(eq(downloadableAssets.isPublished, true), eq(downloadableAssets.category, category)))
    .orderBy(desc(downloadableAssets.publishedAt));
}

export async function getDownloadableAssetBySlug(slug: string): Promise<DownloadableAsset | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(downloadableAssets).where(eq(downloadableAssets.slug, slug)).limit(1);
  return result[0];
}

export async function incrementDownloadCount(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(downloadableAssets)
    .set({ downloadCount: sql`${downloadableAssets.downloadCount} + 1` })
    .where(eq(downloadableAssets.id, id));
}

export async function createDownloadableAsset(asset: InsertDownloadableAsset): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(downloadableAssets).values(asset);
}

// ============ LEADS FUNCTIONS ============
export async function createLead(lead: InsertLead): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.insert(leads).values(lead);
  return result[0].insertId;
}

export async function getAllLeads(): Promise<Lead[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function updateLeadStatus(id: number, status: Lead["status"]): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(leads).set({ status }).where(eq(leads.id, id));
}

// ============ PRESS RELEASES FUNCTIONS ============
export async function getAllPressReleases(): Promise<PressRelease[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pressReleases).where(eq(pressReleases.isPublished, true)).orderBy(desc(pressReleases.publishedAt));
}

export async function getPressReleasesByCategory(category: PressRelease["category"]): Promise<PressRelease[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pressReleases)
    .where(and(eq(pressReleases.isPublished, true), eq(pressReleases.category, category)))
    .orderBy(desc(pressReleases.publishedAt));
}

export async function getPressReleaseBySlug(slug: string): Promise<PressRelease | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pressReleases).where(eq(pressReleases.slug, slug)).limit(1);
  return result[0];
}

export async function createPressRelease(release: InsertPressRelease): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(pressReleases).values(release);
}

// ============ TESTIMONIALS FUNCTIONS ============
export async function getAllTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).where(eq(testimonials.isPublished, true)).orderBy(testimonials.order);
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials)
    .where(and(eq(testimonials.isPublished, true), eq(testimonials.isFeatured, true)))
    .orderBy(testimonials.order);
}

export async function createTestimonial(testimonial: InsertTestimonial): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(testimonials).values(testimonial);
}

// ============ GLOBAL SEARCH FUNCTION ============
export async function globalSearch(query: string): Promise<{
  products: Product[];
  caseStudies: CaseStudy[];
  blogPosts: BlogPost[];
  pressReleases: PressRelease[];
  assets: DownloadableAsset[];
}> {
  const db = await getDb();
  if (!db) return { products: [], caseStudies: [], blogPosts: [], pressReleases: [], assets: [] };

  const searchPattern = `%${query}%`;

  const [productsResult, caseStudiesResult, blogPostsResult, pressReleasesResult, assetsResult] = await Promise.all([
    db.select().from(products)
      .where(and(
        eq(products.isActive, true),
        or(like(products.name, searchPattern), like(products.description, searchPattern), like(products.tagline, searchPattern))
      ))
      .limit(5),
    db.select().from(caseStudies)
      .where(and(
        eq(caseStudies.isPublished, true),
        or(like(caseStudies.title, searchPattern), like(caseStudies.clientName, searchPattern), like(caseStudies.challenge, searchPattern))
      ))
      .limit(5),
    db.select().from(blogPosts)
      .where(and(
        eq(blogPosts.isPublished, true),
        or(like(blogPosts.title, searchPattern), like(blogPosts.excerpt, searchPattern), like(blogPosts.content, searchPattern))
      ))
      .limit(5),
    db.select().from(pressReleases)
      .where(and(
        eq(pressReleases.isPublished, true),
        or(like(pressReleases.title, searchPattern), like(pressReleases.excerpt, searchPattern))
      ))
      .limit(5),
    db.select().from(downloadableAssets)
      .where(and(
        eq(downloadableAssets.isPublished, true),
        or(like(downloadableAssets.title, searchPattern), like(downloadableAssets.description, searchPattern))
      ))
      .limit(5),
  ]);

  return {
    products: productsResult,
    caseStudies: caseStudiesResult,
    blogPosts: blogPostsResult,
    pressReleases: pressReleasesResult,
    assets: assetsResult,
  };
}
