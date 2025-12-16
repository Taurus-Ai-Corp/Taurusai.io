// Stripe Products and Pricing Configuration
export interface PricingTier {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export const subscriptionTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams getting started with quantum-safe infrastructure',
    priceMonthly: 49900,
    priceYearly: 479900,
    features: [
      'Up to 5 users',
      'BizFlow™ Basic',
      'Standard support',
      'API access (1,000 calls/day)',
      'Basic analytics dashboard',
      '99.5% uptime SLA',
    ],
    cta: 'Start Free Trial',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing organizations requiring advanced automation and security',
    priceMonthly: 149900,
    priceYearly: 1439900,
    features: [
      'Up to 25 users',
      'BizFlow™ + Q-Grid™',
      'Priority support',
      'API access (10,000 calls/day)',
      'Advanced analytics & reporting',
      'Quantum-resistant encryption',
      '99.9% uptime SLA',
    ],
    highlighted: true,
    cta: 'Start Free Trial',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Full platform access with dedicated support and custom solutions',
    priceMonthly: 499900,
    priceYearly: 4799900,
    features: [
      'Unlimited users',
      'Full platform access (All products)',
      'Dedicated success manager',
      'Unlimited API access',
      'Custom AI model training',
      'On-premise deployment option',
      'Custom SLA (up to 99.99%)',
    ],
    cta: 'Contact Sales',
  },
];

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function getTierById(id: string): PricingTier | undefined {
  return subscriptionTiers.find(tier => tier.id === id);
}
