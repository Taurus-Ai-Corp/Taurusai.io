import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { origin: "http://localhost:3000" },
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    stripeCustomerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: { origin: "http://localhost:3000" },
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("stripe.isConfigured", () => {
  it("returns configuration status", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.stripe.isConfigured();
    expect(result).toHaveProperty("configured");
    expect(typeof result.configured).toBe("boolean");
  });
});

describe("stripe.getPricing", () => {
  it("returns subscription tiers with formatted prices", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.stripe.getPricing();
    
    expect(result).toHaveProperty("subscriptions");
    expect(Array.isArray(result.subscriptions)).toBe(true);
    expect(result.subscriptions.length).toBeGreaterThan(0);
    
    const tier = result.subscriptions[0];
    expect(tier).toHaveProperty("id");
    expect(tier).toHaveProperty("name");
    expect(tier).toHaveProperty("priceMonthly");
    expect(tier).toHaveProperty("priceYearly");
    expect(tier).toHaveProperty("priceMonthlyFormatted");
    expect(tier).toHaveProperty("priceYearlyFormatted");
    expect(tier).toHaveProperty("features");
    expect(Array.isArray(tier.features)).toBe(true);
  });

  it("includes starter, professional, and enterprise tiers", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.stripe.getPricing();
    
    const tierIds = result.subscriptions.map(t => t.id);
    expect(tierIds).toContain("starter");
    expect(tierIds).toContain("professional");
    expect(tierIds).toContain("enterprise");
  });
});

describe("stripe.createSubscriptionCheckout", () => {
  it("requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    await expect(
      caller.stripe.createSubscriptionCheckout({
        tierId: "starter",
        billingPeriod: "monthly",
      })
    ).rejects.toThrow();
  });
});
