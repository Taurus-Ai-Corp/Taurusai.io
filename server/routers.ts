import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";
import { isStripeConfigured, getOrCreateCustomer, createCheckoutSession, createCustomerPortalSession } from "./stripe/stripe";
import { createCalendarEvent, formatConsultationEvent, generateMeetLink } from "./calendar/googleCalendar";
import { subscriptionTiers, formatPrice } from "./stripe/products";
import { sendEmail, formatConsultationConfirmationEmail } from "./email/gmail";
import { calculateLeadScore, getLeadPriority, getRecommendedAction } from "./utils/leadScoring";

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
    submit: publicProcedure
      .input(z.object({
        name: z.string(),
        company: z.string(),
        position: z.string(),
        content: z.string(),
        rating: z.number().min(1).max(5),
        featured: z.boolean().default(false),
        published: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        await db.createTestimonial({
          quote: input.content,
          authorName: input.name,
          authorTitle: input.position,
          companyName: input.company,
          rating: input.rating,
          isFeatured: input.featured,
          isPublished: input.published,
        });
        return { success: true };
      }),
  }),

  // Leads Router
  leads: router({
    getAll: protectedProcedure
      .input(z.object({
        status: z.string().optional(),
        industry: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        sortBy: z.enum(["score", "createdAt", "company"]).default("score"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return db.getAllLeads(input);
      }),
    
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
        // Calculate lead score
        const score = calculateLeadScore({
          companySize: input.companySize,
          industry: input.industry,
          productsInterested: input.productsInterested,
        });
        
        const leadId = await db.createLead({ ...input, score });
        
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
        
        // Get priority and recommended action
        const priority = getLeadPriority(score);
        const recommendedAction = getRecommendedAction(score);
        
        const notificationContent = `
👤 Contact: ${input.firstName} ${input.lastName}
🏢 Company: ${input.company}${input.jobTitle ? ` (${input.jobTitle})` : ''}
📧 Email: ${input.email}${input.phone ? `\n📞 Phone: ${input.phone}` : ''}${input.country ? `\n🌍 Location: ${input.country}` : ''}${input.companySize ? `\n👥 Company Size: ${input.companySize}` : ''}${input.industry ? `\n🏭 Industry: ${input.industry}` : ''}${productsText}${input.message ? `\n\n💬 Message:\n${input.message}` : ''}

🎯 Lead Score: ${score}/100 (${priority} Priority)
📋 Recommended Action: ${recommendedAction}

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
    
    // Consultation booking with calendar integration
    bookConsultation: publicProcedure
      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        company: z.string().min(1),
        companySize: z.string().optional(),
        industry: z.string().optional(),
        consultationType: z.enum(["discovery", "demo", "technical", "enterprise"]),
        date: z.string(), // YYYY-MM-DD format
        time: z.string(), // e.g., "09:00 AM"
        timezone: z.string().default("America/New_York"),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Map consultation type to scoring format
        const consultationTypeMap: Record<string, string> = {
          "discovery": "General Inquiry",
          "demo": "Product Demo",
          "technical": "Technical Deep Dive",
          "enterprise": "Enterprise Implementation",
        };
        
        // Calculate lead score
        const score = calculateLeadScore({
          companySize: input.companySize,
          industry: input.industry,
          consultationType: consultationTypeMap[input.consultationType],
        });
        
        // Create lead record with score
        const leadId = await db.createLead({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          company: input.company,
          companySize: input.companySize,
          industry: input.industry,
          message: `Consultation: ${input.consultationType} on ${input.date} at ${input.time}\n${input.message || ''}`,
          leadType: "demo-request",
          source: "consultation_booking",
          score,
        });
        
        // Format and create calendar event
        const calendarEvent = formatConsultationEvent(
          input.consultationType,
          input.date,
          input.time,
          `${input.firstName} ${input.lastName}`,
          input.email,
          input.company,
          input.message
        );
        
        const calendarResult = await createCalendarEvent(calendarEvent);
        
        // Get the meet link from calendar result or generate one
        const meetLink = calendarResult.meetLink || generateMeetLink(
          input.consultationType,
          input.date,
          `${input.firstName} ${input.lastName}`
        );
        
        // Save consultation to database
        const consultationId = await db.createConsultation({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          company: input.company,
          consultationType: input.consultationType,
          date: input.date,
          time: input.time,
          timezone: input.timezone,
          message: input.message,
          status: "scheduled",
          calendarEventId: calendarResult.eventId,
          meetLink,
        });
        
        // Get consultation type label for notification
        const typeLabels: Record<string, string> = {
          discovery: "Discovery Call (30 min)",
          demo: "Product Demo (45 min)",
          technical: "Technical Consultation (60 min)",
          enterprise: "Enterprise Assessment (90 min)",
        };
        const typeLabel = typeLabels[input.consultationType] || "Consultation";
        
        // Send confirmation email to attendee
        const emailContent = formatConsultationConfirmationEmail(
          input.firstName,
          input.lastName,
          input.consultationType,
          input.date,
          input.time,
          meetLink,
          input.company
        );
        
        const emailResult = await sendEmail({
          to: input.email,
          subject: emailContent.subject,
          body: emailContent.body,
        });
        
        // Notify owner
        await notifyOwner({
          title: `📅 New Consultation Booked: ${input.firstName} ${input.lastName}`,
          content: `🗓️ Consultation Details:
- Type: ${typeLabel}
- Date: ${input.date}
- Time: ${input.time} IST

👤 Contact: ${input.firstName} ${input.lastName}
🏢 Company: ${input.company}
📧 Email: ${input.email}

${input.message ? `💬 Notes:\n${input.message}\n\n` : ''}📆 Calendar: ${calendarResult.success ? 'Event created successfully' : 'Failed to create event'}
📹 Google Meet: ${meetLink}

---
📨 Notification sent to: taurus.ai@taas-ai.com, admin@taurusai.io`.trim(),
        });
        
        return { 
          success: true, 
          leadId,
          calendarEventCreated: calendarResult.success,
          calendarEventId: calendarResult.eventId,
          meetLink,
        };
      }),
  }),

  // Consultation Management Router
  consultations: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }
      return db.getAllConsultations();
    }),
    
    getUpcoming: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }
      return db.getUpcomingConsultations();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return db.getConsultationById(input.id);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        date: z.string().optional(),
        time: z.string().optional(),
        status: z.enum(["scheduled", "completed", "cancelled", "rescheduled"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        const { id, ...updates } = input;
        
        // Get original consultation for comparison
        const original = await db.getConsultationById(id);
        if (!original) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Consultation not found' });
        }
        
        // Update the consultation
        await db.updateConsultation(id, updates);
        
        // Send reschedule email if date or time changed
        if ((input.date && input.date !== original.date) || (input.time && input.time !== original.time)) {
          const { getRescheduleEmailTemplate } = await import('./utils/emailTemplates');
          const { sendEmail } = await import('./email/gmail');
          
          const emailHtml = getRescheduleEmailTemplate({
            firstName: original.firstName,
            lastName: original.lastName,
            consultationType: original.consultationType,
            oldDate: original.date,
            oldTime: original.time,
            date: input.date || original.date,
            time: input.time || original.time,
            timezone: original.timezone,
            meetLink: original.meetLink,
          });
          
          try {
            await sendEmail({
              to: original.email,
              subject: 'Consultation Rescheduled - Taurus AI',
              body: emailHtml,
            });
          } catch (error) {
            console.error('Failed to send reschedule email:', error);
          }
        }
        
        return { success: true };
      }),
    
    cancel: protectedProcedure
      .input(z.object({
        id: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        
        // Get consultation details before cancelling
        const consultation = await db.getConsultationById(input.id);
        if (!consultation) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Consultation not found' });
        }
        
        // Cancel the consultation
        await db.cancelConsultation(input.id, input.notes);
        
        // Send cancellation email
        const { getCancellationEmailTemplate } = await import('./utils/emailTemplates');
        const { sendEmail } = await import('./email/gmail');
        
        const emailHtml = getCancellationEmailTemplate({
          firstName: consultation.firstName,
          lastName: consultation.lastName,
          consultationType: consultation.consultationType,
          date: consultation.date,
          time: consultation.time,
          timezone: consultation.timezone,
          meetLink: consultation.meetLink,
        });
        
        try {
          await sendEmail({
            to: consultation.email,
            subject: 'Consultation Cancelled - Taurus AI',
            body: emailHtml,
          });
        } catch (error) {
          console.error('Failed to send cancellation email:', error);
        }
        
        return { success: true };
      }),
    
    analytics: protectedProcedure
      .input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return db.getConsultationAnalytics(input.startDate, input.endDate);
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

  // Stripe Payment Router
  stripe: router({
    isConfigured: publicProcedure.query(() => ({ configured: isStripeConfigured() })),

    getPricing: publicProcedure.query(() => ({
      subscriptions: subscriptionTiers.map(tier => ({
        ...tier,
        priceMonthlyFormatted: formatPrice(tier.priceMonthly),
        priceYearlyFormatted: formatPrice(tier.priceYearly),
      })),
    })),

    createSubscriptionCheckout: protectedProcedure
      .input(z.object({
        tierId: z.string(),
        billingPeriod: z.enum(['monthly', 'yearly']),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!isStripeConfigured()) {
          throw new Error('Stripe is not configured');
        }

        const tier = subscriptionTiers.find(t => t.id === input.tierId);
        if (!tier) throw new Error('Invalid tier');

        const customerId = await getOrCreateCustomer(
          ctx.user.id,
          ctx.user.email || '',
          ctx.user.name || undefined,
          ctx.user.stripeCustomerId
        );

        if (!customerId) throw new Error('Failed to create customer');

        if (!ctx.user.stripeCustomerId) {
          await db.updateUserStripeCustomerId(ctx.user.id, customerId);
        }

        const amount = input.billingPeriod === 'monthly' ? tier.priceMonthly : tier.priceYearly;
        const origin = ctx.req.headers.origin || 'http://localhost:3000';
        
        const checkoutUrl = await createCheckoutSession(
          customerId,
          tier.id,
          tier.name,
          amount,
          input.billingPeriod,
          ctx.user.id,
          ctx.user.email || '',
          ctx.user.name,
          origin
        );

        return { checkoutUrl };
      }),

    getPortalUrl: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user.stripeCustomerId) throw new Error('No subscription found');
      const origin = ctx.req.headers.origin || 'http://localhost:3000';
      const portalUrl = await createCustomerPortalSession(ctx.user.stripeCustomerId, `${origin}/account`);
      return { portalUrl };
    }),
  }),

  // Email Sequences Router
  sequences: router({
    getAll: protectedProcedure.query(async () => {
      return db.getAllEmailSequences();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const sequence = await db.getEmailSequenceById(input.id);
        if (!sequence) throw new Error('Sequence not found');
        const emails = await db.getSequenceEmails(input.id);
        return { ...sequence, emails };
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string(),
        targetScoreMin: z.number().min(0).max(100),
        targetScoreMax: z.number().min(0).max(100),
        targetStatus: z.enum(['new', 'contacted', 'qualified', 'converted', 'closed']).nullable(),
        isActive: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createEmailSequence(input);
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        targetScoreMin: z.number().min(0).max(100).optional(),
        targetScoreMax: z.number().min(0).max(100).optional(),
        targetStatus: z.enum(['new', 'contacted', 'qualified', 'converted', 'closed']).nullable().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateEmailSequence(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteEmailSequence(input.id);
        return { success: true };
      }),

    // Sequence Email Management
    createEmail: protectedProcedure
      .input(z.object({
        sequenceId: z.number(),
        stepNumber: z.number(),
        delayDays: z.number(),
        subject: z.string(),
        body: z.string(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createSequenceEmail(input);
        return { id };
      }),

    updateEmail: protectedProcedure
      .input(z.object({
        id: z.number(),
        stepNumber: z.number().optional(),
        delayDays: z.number().optional(),
        subject: z.string().optional(),
        body: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateSequenceEmail(id, updates);
        return { success: true };
      }),

    deleteEmail: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteSequenceEmail(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
