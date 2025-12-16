import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Check, Zap, Shield, ArrowRight, Clock, Users } from "lucide-react";

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  
  const { data: pricing } = trpc.stripe.getPricing.useQuery();
  const { data: stripeConfig } = trpc.stripe.isConfigured.useQuery();
  
  const createSubscriptionCheckout = trpc.stripe.createSubscriptionCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.success("Redirecting to checkout...");
        window.open(data.checkoutUrl, '_blank');
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create checkout session");
    },
  });

  const handleSubscribe = (tierId: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (tierId === 'enterprise') {
      window.location.href = '/contact?type=enterprise';
      return;
    }
    createSubscriptionCheckout.mutate({ tierId, billingPeriod });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 tech-badge">
              <Zap className="w-3 h-3 mr-1" />
              Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Choose the plan that fits your organization's needs. All plans include quantum-safe security.
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <Label htmlFor="billing" className={billingPeriod === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}>Monthly</Label>
              <Switch id="billing" checked={billingPeriod === 'yearly'} onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')} />
              <Label htmlFor="billing" className={billingPeriod === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}>
                Yearly <Badge variant="secondary" className="ml-2 bg-success/20 text-success">Save 20%</Badge>
              </Label>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing?.subscriptions.map((tier) => (
              <Card key={tier.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${tier.highlighted ? 'border-primary shadow-lg shadow-primary/20 scale-105' : 'border-border hover:border-primary/50'}`}>
                {tier.highlighted && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-cyan to-quantum" />}
                <CardHeader>
                  {tier.highlighted && <Badge className="w-fit mb-2 bg-primary/20 text-primary">Most Popular</Badge>}
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">{billingPeriod === 'monthly' ? tier.priceMonthlyFormatted : tier.priceYearlyFormatted}</span>
                    <span className="text-muted-foreground">/{billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={tier.highlighted ? "default" : "outline"} onClick={() => handleSubscribe(tier.id)} disabled={createSubscriptionCheckout.isPending}>
                    {tier.cta} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card/50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Enterprise Security</h3>
                <p className="text-sm text-muted-foreground">SOC 2 Type II certified with quantum-resistant encryption</p>
              </div>
              <div className="p-6">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">14-Day Free Trial</h3>
                <p className="text-sm text-muted-foreground">Try any plan risk-free with full access to all features</p>
              </div>
              <div className="p-6">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Dedicated Support</h3>
                <p className="text-sm text-muted-foreground">24/7 support from our enterprise success team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {stripeConfig?.configured && (
        <section className="py-8 bg-warning/10 border-y border-warning/30">
          <div className="container text-center">
            <p className="text-warning font-medium">🧪 Test Mode - Use card <code className="bg-background px-2 py-1 rounded">4242 4242 4242 4242</code></p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
