import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Products Router
  products: router({
    list: publicProcedure.query(async () => {
      return db.getAllProducts();
    }),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getProductBySlug(input.slug);
      }),
  }),

  // Case Studies Router
  caseStudies: router({
    list: publicProcedure.query(async () => {
      return db.getAllCaseStudies();
    }),
    featured: publicProcedure.query(async () => {
      return db.getFeaturedCaseStudies();
    }),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getCaseStudyBySlug(input.slug);
      }),
  }),

  // Authors Router
  authors: router({
    list: publicProcedure.query(async () => {
      return db.getAllAuthors();
    }),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getAuthorBySlug(input.slug);
      }),
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getAuthorById(input.id);
      }),
  }),

  // Blog Posts Router
  blog: router({
    list: publicProcedure.query(async () => {
      return db.getAllBlogPosts();
    }),
    featured: publicProcedure.query(async () => {
      return db.getFeaturedBlogPosts();
    }),
    byCategory: publicProcedure
      .input(z.object({ 
        category: z.enum([
          "thought-leadership",
          "product-capabilities",
          "customer-success",
          "regulatory-compliance",
          "industry-news"
        ])
      }))
      .query(async ({ input }) => {
        return db.getBlogPostsByCategory(input.category);
      }),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getBlogPostBySlug(input.slug);
      }),
    byAuthor: publicProcedure
      .input(z.object({ authorId: z.number() }))
      .query(async ({ input }) => {
        return db.getBlogPostsByAuthor(input.authorId);
      }),
  }),

  // Downloadable Assets Router
  assets: router({
    list: publicProcedure.query(async () => {
      return db.getAllDownloadableAssets();
    }),
    byCategory: publicProcedure
      .input(z.object({ 
        category: z.enum([
          "annual-report",
          "quarterly-report",
          "media-kit",
          "pitch-deck",
          "whitepaper",
          "press-release",
          "fact-sheet"
        ])
      }))
      .query(async ({ input }) => {
        return db.getDownloadableAssetsByCategory(input.category);
      }),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getDownloadableAssetBySlug(input.slug);
      }),
    trackDownload: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.incrementDownloadCount(input.id);
        return { success: true };
      }),
  }),

  // Press Releases Router
  press: router({
    list: publicProcedure.query(async () => {
      return db.getAllPressReleases();
    }),
    byCategory: publicProcedure
      .input(z.object({ 
        category: z.enum(["press-release", "news", "award", "partnership"])
      }))
      .query(async ({ input }) => {
        return db.getPressReleasesByCategory(input.category);
      }),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getPressReleaseBySlug(input.slug);
      }),
  }),

  // Testimonials Router
  testimonials: router({
    list: publicProcedure.query(async () => {
      return db.getAllTestimonials();
    }),
    featured: publicProcedure.query(async () => {
      return db.getFeaturedTestimonials();
    }),
  }),

  // Leads Router
  leads: router({
    submit: publicProcedure
      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        company: z.string().min(1),
        jobTitle: z.string().optional(),
        phone: z.string().optional(),
        country: z.string().optional(),
        companySize: z.string().optional(),
        industry: z.string().optional(),
        message: z.string().optional(),
        leadType: z.enum(["demo-request", "contact", "newsletter", "whitepaper"]),
        source: z.string().optional(),
        productsInterested: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const leadId = await db.createLead(input);
        
        // Build detailed notification content
        const leadTypeLabel = {
          'demo-request': '🎯 Demo Request',
          'contact': '📧 Contact Form',
          'newsletter': '📰 Newsletter Signup',
          'whitepaper': '📄 Whitepaper Download'
        }[input.leadType] || 'New Lead';
        
        const productsText = input.productsInterested?.length 
          ? `\n\n📦 Products Interested:\n${input.productsInterested.join(', ')}`
          : '';
        
        const notificationContent = `
👤 Contact: ${input.firstName} ${input.lastName}
🏢 Company: ${input.company}${input.jobTitle ? ` (${input.jobTitle})` : ''}
📧 Email: ${input.email}${input.phone ? `\n📞 Phone: ${input.phone}` : ''}${input.country ? `\n🌍 Location: ${input.country}` : ''}${input.companySize ? `\n👥 Company Size: ${input.companySize}` : ''}${input.industry ? `\n🏭 Industry: ${input.industry}` : ''}${productsText}${input.message ? `\n\n💬 Message:\n${input.message}` : ''}

---
📨 Notification sent to: taurus.ai@taas-ai.com, admin@taurusai.io
        `.trim();
        
        // Notify owner of new lead
        await notifyOwner({
          title: `${leadTypeLabel} from ${input.firstName} ${input.lastName} at ${input.company}`,
          content: notificationContent,
        });
        
        return { success: true, leadId };
      }),
  }),

  // Global Search Router
  search: router({
    query: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input }) => {
        return db.globalSearch(input.query);
      }),
  }),
});

export type AppRouter = typeof appRouter;
