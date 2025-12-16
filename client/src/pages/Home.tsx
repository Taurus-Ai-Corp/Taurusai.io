import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Shield,
  Zap,
  Database,
  Sparkles,
  Workflow,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  Play,
  Quote,
} from "lucide-react";

// Product icons mapping
const productIcons: Record<string, React.ReactNode> = {
  Workflow: <Workflow className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
};

export default function Home() {
  const { data: products } = trpc.products.list.useQuery();
  const { data: testimonials } = trpc.testimonials.featured.useQuery();
  const { data: caseStudies } = trpc.caseStudies.featured.useQuery();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 geometric-pattern opacity-30" />
        
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cobalt-light/20 to-transparent" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-cobalt-light/20 to-transparent" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-cobalt-light/20 to-transparent" />
        </div>

        <div className="container relative z-10 pt-32 pb-20">
          <div className="max-w-4xl">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 border border-destructive/30 mb-8">
              <Clock className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-white">
                SWIFT 2027 Deadline: Your RSA-2048 encryption expires in 36 months
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Quantum-Safe Infrastructure for{" "}
              <span className="gradient-text">Enterprise Finance</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-silver leading-relaxed mb-8 max-w-2xl">
              Complete digital transformation without organizational disruption. 
              Deploy quantum-resistant security, workflow automation, and enterprise 
              intelligence in 90 days.
            </p>

            {/* Value Props */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2 text-silver-light">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center gap-2 text-silver-light">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>10,000+ TPS</span>
              </div>
              <div className="flex items-center gap-2 text-silver-light">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>NIST PQC Compliant</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/demo">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-14">
                  Request Demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/case-studies">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8 h-14"
                >
                  <Play className="mr-2 w-5 h-5" />
                  View Case Studies
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-10 border-t border-white/10">
            <div>
              <div className="text-4xl font-bold text-white mb-1">1M+</div>
              <div className="text-silver-dark text-sm">Transactions Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-1">2,500%</div>
              <div className="text-silver-dark text-sm">Average ROI</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-1">90</div>
              <div className="text-silver-dark text-sm">Days to Deploy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-1">99.73%</div>
              <div className="text-silver-dark text-sm">Fraud Detection Rate</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-8 bg-muted border-y border-border">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              <span className="font-semibold text-foreground">RBI Harbinger Winner</span>
            </div>
            <div className="h-8 w-px bg-border hidden md:block" />
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="text-sm">Trusted by leading institutions:</span>
              <div className="flex gap-6 items-center">
                <span className="font-semibold text-foreground">National Banks</span>
                <span className="font-semibold text-foreground">Central Banks</span>
                <span className="font-semibold text-foreground">Fintech Leaders</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Our Platform</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Quantum-Ready Enterprise Solutions
            </h2>
            <p className="text-lg text-muted-foreground">
              Four integrated products designed to transform your financial infrastructure 
              with quantum-safe security at the core.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <Card
                key={product.id}
                className={`card-hover cursor-pointer border-2 transition-all duration-300 ${
                  hoveredProduct === product.slug
                    ? "border-primary shadow-lg glow-primary"
                    : "border-transparent"
                }`}
                onMouseEnter={() => setHoveredProduct(product.slug)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                      hoveredProduct === product.slug
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {productIcons[product.icon]}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{product.tagline}</p>
                  <div className="space-y-2">
                    {(product.differentiators as string[])?.slice(0, 3).map((diff, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        <span className="text-muted-foreground">{diff}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={`/products/${product.slug}`}>
                    <Button
                      variant="ghost"
                      className="mt-4 w-full justify-between text-primary hover:text-primary"
                    >
                      Learn More
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline">
                Compare All Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Taurus AI Section */}
      <section className="py-24 bg-muted geometric-pattern">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Why Taurus AI</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Lead Your Industry in Regulatory Compliance
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Don't just meet requirements—set the standard. Taurus AI positions your 
                organization two years ahead of the SWIFT 2027 deadline with proven, 
                production-ready quantum-safe infrastructure.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Quantum-Ready Architecture</h4>
                    <p className="text-muted-foreground text-sm">
                      NIST-approved post-quantum cryptography built into the platform foundation.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">90-Day Implementation</h4>
                    <p className="text-muted-foreground text-sm">
                      Complete digital transformation without organizational disruption.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Proven ROI</h4>
                    <p className="text-muted-foreground text-sm">
                      Average 1,700%-2,500% return on investment within 12 months.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="p-8 bg-card shadow-xl">
                <h3 className="text-xl font-bold text-foreground mb-6">Competitive Advantage</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Quantum Resistance</span>
                    <Badge className="bg-success text-white">Built-in</Badge>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Implementation Time</span>
                    <span className="font-semibold text-foreground">90 days</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Uptime Guarantee</span>
                    <span className="font-semibold text-foreground">99.9% SLA</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Transaction Capacity</span>
                    <span className="font-semibold text-foreground">10,000+ TPS</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-muted-foreground">SWIFT 2027 Ready</span>
                    <Badge className="bg-success text-white">Compliant</Badge>
                  </div>
                </div>
              </Card>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-quantum/10 rounded-xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Preview */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Success Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-muted-foreground">
              See how leading financial institutions have transformed their infrastructure 
              with Taurus AI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies?.slice(0, 3).map((study) => (
              <Card key={study.id} className="card-hover overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-quantum/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {(study.metrics as any[])?.[0]?.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {(study.metrics as any[])?.[0]?.label}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-3">{study.industry}</Badge>
                    <h3 className="text-lg font-bold text-foreground mb-2">{study.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {study.challenge}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(study.productsUsed as string[])?.map((product) => (
                        <Badge key={product} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                    <Link href={`/case-studies/${study.slug}`}>
                      <Button variant="ghost" className="w-full justify-between">
                        Read Case Study
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/case-studies">
              <Button size="lg">
                View All Case Studies
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-charcoal text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 border-white/30 text-white">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials?.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <Quote className="w-10 h-10 text-primary/50 mb-4" />
                  <p className="text-silver-light mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {testimonial.authorName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.authorName}</div>
                      <div className="text-sm text-silver-dark">{testimonial.companyName}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Future-Proof Your Infrastructure?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Join the leading financial institutions already securing their future 
              with quantum-safe technology. Schedule a demo today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/demo">
                <Button size="lg" variant="secondary" className="text-lg px-8 h-14">
                  Schedule Demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 h-14"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
