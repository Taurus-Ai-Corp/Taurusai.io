import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('[Stripe] STRIPE_SECRET_KEY not configured.');
}

export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export function isStripeConfigured(): boolean {
  return !!stripe;
}

export async function getOrCreateCustomer(
  userId: number,
  email: string,
  name?: string,
  existingCustomerId?: string | null
): Promise<string | null> {
  if (!stripe) return null;
  if (existingCustomerId) return existingCustomerId;
  
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: { user_id: userId.toString() },
  });
  return customer.id;
}

export async function createCheckoutSession(
  customerId: string,
  tierId: string,
  tierName: string,
  amount: number,
  billingPeriod: 'monthly' | 'yearly',
  userId: number,
  userEmail: string,
  userName: string | null,
  origin: string
): Promise<string | null> {
  if (!stripe) return null;
  
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `${tierName} Plan (${billingPeriod})` },
        unit_amount: amount,
        recurring: { interval: billingPeriod === 'monthly' ? 'month' : 'year' },
      },
      quantity: 1,
    }],
    success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?canceled=true`,
    allow_promotion_codes: true,
    client_reference_id: userId.toString(),
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail,
      customer_name: userName || '',
      tier_id: tierId,
    },
  });
  
  return session.url;
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string | null> {
  if (!stripe) return null;
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session.url;
}

export function constructWebhookEvent(
  payload: Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event | null {
  if (!stripe) return null;
  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('[Stripe] Webhook signature verification failed:', error);
    return null;
  }
}
