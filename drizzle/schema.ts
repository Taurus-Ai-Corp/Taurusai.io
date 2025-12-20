import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

// Users table - core authentication
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Products table - BizFlow, Q-Grid, AssetGrid, Neovibe
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  tagline: varchar("tagline", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  features: json("features").$type<string[]>().notNull(),
  useCases: json("useCases").$type<{ title: string; description: string; metric: string }[]>().notNull(),
  financialImpact: json("financialImpact").$type<{ label: string; value: string }[]>().notNull(),
  differentiators: json("differentiators").$type<string[]>().notNull(),
  order: int("order").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Case Studies table
export const caseStudies = mysqlTable("caseStudies", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  clientName: varchar("clientName", { length: 100 }).notNull(),
  clientLogo: varchar("clientLogo", { length: 500 }),
  industry: varchar("industry", { length: 100 }).notNull(),
  challenge: text("challenge").notNull(),
  solution: text("solution").notNull(),
  results: text("results").notNull(),
  testimonial: text("testimonial"),
  testimonialAuthor: varchar("testimonialAuthor", { length: 100 }),
  testimonialRole: varchar("testimonialRole", { length: 100 }),
  metrics: json("metrics").$type<{ label: string; value: string; description: string }[]>().notNull(),
  productsUsed: json("productsUsed").$type<string[]>().notNull(),
  implementationTime: varchar("implementationTime", { length: 50 }),
  featuredImage: varchar("featuredImage", { length: 500 }),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CaseStudy = typeof caseStudies.$inferSelect;
export type InsertCaseStudy = typeof caseStudies.$inferInsert;

// Blog Authors table
export const authors = mysqlTable("authors", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  bio: text("bio"),
  avatar: varchar("avatar", { length: 500 }),
  linkedIn: varchar("linkedIn", { length: 255 }),
  twitter: varchar("twitter", { length: 255 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Author = typeof authors.$inferSelect;
export type InsertAuthor = typeof authors.$inferInsert;

// Blog Posts table
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: varchar("featuredImage", { length: 500 }),
  authorId: int("authorId").notNull(),
  category: mysqlEnum("category", [
    "thought-leadership",
    "product-capabilities",
    "customer-success",
    "regulatory-compliance",
    "industry-news"
  ]).notNull(),
  tags: json("tags").$type<string[]>(),
  readTime: int("readTime").default(5).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isPublished: boolean("isPublished").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// Downloadable Assets (Reports, Media Kits, Pitch Decks)
export const downloadableAssets = mysqlTable("downloadableAssets", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "annual-report",
    "quarterly-report",
    "media-kit",
    "pitch-deck",
    "whitepaper",
    "press-release",
    "fact-sheet"
  ]).notNull(),
  fileUrl: varchar("fileUrl", { length: 500 }).notNull(),
  fileSize: varchar("fileSize", { length: 50 }),
  fileType: varchar("fileType", { length: 20 }).notNull(),
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
  downloadCount: int("downloadCount").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DownloadableAsset = typeof downloadableAssets.$inferSelect;
export type InsertDownloadableAsset = typeof downloadableAssets.$inferInsert;

// Contact/Demo Leads table
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 200 }).notNull(),
  jobTitle: varchar("jobTitle", { length: 100 }),
  phone: varchar("phone", { length: 50 }),
  country: varchar("country", { length: 100 }),
  companySize: varchar("companySize", { length: 50 }),
  industry: varchar("industry", { length: 100 }),
  message: text("message"),
  leadType: mysqlEnum("leadType", ["demo-request", "contact", "newsletter", "whitepaper"]).notNull(),
  source: varchar("source", { length: 100 }),
  productsInterested: json("productsInterested").$type<string[]>(),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "converted", "closed"]).default("new").notNull(),
  score: int("score").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// Press/News items
export const pressReleases = mysqlTable("pressReleases", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: mysqlEnum("category", ["press-release", "news", "award", "partnership"]).notNull(),
  featuredImage: varchar("featuredImage", { length: 500 }),
  externalUrl: varchar("externalUrl", { length: 500 }),
  isPublished: boolean("isPublished").default(true).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PressRelease = typeof pressReleases.$inferSelect;
export type InsertPressRelease = typeof pressReleases.$inferInsert;

// Testimonials table
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  quote: text("quote").notNull(),
  authorName: varchar("authorName", { length: 100 }).notNull(),
  authorTitle: varchar("authorTitle", { length: 100 }).notNull(),
  companyName: varchar("companyName", { length: 100 }).notNull(),
  companyLogo: varchar("companyLogo", { length: 500 }),
  rating: int("rating").default(5),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

// Consultations table - for booking management
export const consultations = mysqlTable("consultations", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 200 }).notNull(),
  consultationType: mysqlEnum("consultationType", ["discovery", "demo", "technical", "enterprise"]).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  time: varchar("time", { length: 50 }).notNull(),
  timezone: varchar("timezone", { length: 100 }).default("America/New_York").notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "rescheduled"]).default("scheduled").notNull(),
  calendarEventId: varchar("calendarEventId", { length: 500 }),
  meetLink: varchar("meetLink", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = typeof consultations.$inferInsert;
