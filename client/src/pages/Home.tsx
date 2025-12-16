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
  ExternalLink,
} from "lucide-react";

// Product data with images and links
const productData = [
  {
    slug: "bizflow",
    name: "BizFlow™",
    tagline: "AI-Powered Workflow Automation",
    description: "Intelligent automation engine for complex business processes",
    image: "/images/cmgvdpkm.manus.space-BizFlowAI-AdvancedAutomationPlatform-fpscreenshot.png",
    link: "https://cmgvdpkm.manus.space",
    icon: <Workflow className="w-6 h-6" />,
  },
  {
    slug: "q-grid",
    name: "Q-Grid™",
    tagline: "Quantum-Resistant Security",
    description: "Post-quantum cryptography infrastructure for enterprise",
    image: "/images/q-grid.net-q-gridnetapp-fpscreenshot.jpeg",
    link: "https://q-grid.net",
    icon: <Shield className="w-6 h-6" />,
  },
  {
    slug: "assetgrid",
    name: "AssetGrid™",
    tagline: "Hedera-Powered RWA Tokenization",
    description: "Real-world asset tokenization on blockchain",
    image: "/images/FinancialDataDisplay.png",
    link: "https://assetgrid.taurusai.io",
    icon: <Database className="w-6 h-6" />,
  },
  {
    slug: "neovibe",
    name: "Neovibe™",
    tagline: "Creative AI Platform",
    description: "Next-generation AI for creative and marketing automation",
    image: "/images/neovibe.png",
    link: "https://neovibe.taurusai.io",
    icon: <Sparkles className="w-6 h-6" />,
  },
];

export default function Home() {
  const { data: testimonials } = trpc.testimonials.featured.useQuery();
  const { data: caseStudies } = trpc.caseStudies.featured.useQuery();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/FuturisticDataCenterCorridor.png')" }}
        />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-bg opacity-50" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />

        {/* Animated Grid Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan/20 to-transparent" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan/20 to-transparent" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-cyan/20 to-transparent" />
        </div>

        <div className="container relative z-10 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Urgency Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 border border-destructive/30 mb-8">
                <Clock className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-foreground">
                  SWIFT 2027 Deadline: Your RSA-2048 encryption expires in 36 months
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Quantum-Safe Infrastructure{" "}
                <span className="gradient-text">as a Service</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                Complete digital transformation without organizational disruption. 
                Deploy quantum-resistant security, workflow automation, and enterprise 
                intelligence in 90 days.
              </p>

              {/* Value Props */}
              <div className="flex flex-wrap gap-6 mb-10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>99.9% Uptime SLA</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>10,000+ TPS</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>NIST PQC Compliant</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link href="/demo">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-14 btn-glow">
                    Request Demo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/50 text-foreground hover:bg-primary/10 text-lg px-8 h-14"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Explore Platform
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:block relative">
              <div className="relative">
                <img 
                  src="/images/FuturisticHumanoidRobot.png" 
                  alt="Taurus AI" 
                  className="w-full h-auto rounded-2xl float"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent rounded-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-card/80 backdrop-blur border-t border-border">
          <div className="container py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold stat-number">$50M+</div>
                <div className="text-sm text-muted-foreground">Assets Managed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold stat-number">120K+</div>
                <div className="text-sm text-muted-foreground">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold stat-number">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold stat-number">10.2%</div>
                <div className="text-sm text-muted-foreground">APY Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-warning" />
              <span className="text-sm font-medium text-foreground">RBI Harbinger Award Winner</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium text-foreground">SWIFT 2027 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-success" />
              <span className="text-sm font-medium text-foreground">$150K Hedera Grant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 section-gradient">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 tech-badge">Our Platform</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Enterprise-Grade AI Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four integrated platforms powering the future of enterprise technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productData.map((product) => (
              <Card
                key={product.slug}
                className={`card-hover product-card bg-card cursor-pointer transition-all duration-300 ${
                  hoveredProduct === product.slug ? "border-primary glow-cyan" : ""
                }`}
                onMouseEnter={() => setHoveredProduct(product.slug)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative h-40 overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {product.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{product.name}</h3>
                        <p className="text-xs text-primary">{product.tagline}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                    <a 
                      href={product.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      Visit Platform
                      <ExternalLink className="ml-1 w-3 h-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10">
                View All Products
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section className="py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/images/FuturisticCircuitBoardClose-Up.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background" />
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4 tech-badge">Technology</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Built for the Quantum Era
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our infrastructure is designed from the ground up to be quantum-resistant, 
                ensuring your enterprise is protected against emerging threats.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                  <Shield className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">NIST PQC Standards</h4>
                    <p className="text-sm text-muted-foreground">ML-KEM, ML-DSA, and SLH-DSA algorithms</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                  <Zap className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">High Performance</h4>
                    <p className="text-sm text-muted-foreground">10,000+ TPS with 3-5 second finality</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                  <Database className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Hedera Integration</h4>
                    <p className="text-sm text-muted-foreground">Enterprise-grade blockchain infrastructure</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="/images/GlobalConnectivityMap.png" 
                alt="Global Network" 
                className="w-full rounded-2xl border border-border"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl border border-border shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">99.994%</div>
                    <div className="text-sm text-muted-foreground">Cost Savings vs ETH</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Preview */}
      {caseStudies && caseStudies.length > 0 && (
        <section className="py-24 bg-card">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 tech-badge">Success Stories</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See how enterprises are transforming with Taurus AI
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {caseStudies.slice(0, 3).map((study) => (
                <Card key={study.id} className="card-hover bg-background">
                  <CardContent className="p-6">
                    <Badge className="mb-4 tech-badge">{study.industry}</Badge>
                    <h3 className="text-xl font-bold text-foreground mb-2">{study.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{study.challenge}</p>
                    <Link href={`/case-studies/${study.slug}`}>
                      <Button variant="ghost" className="text-primary hover:text-primary/80 p-0">
                        Read Case Study
                        <ChevronRight className="ml-1 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/case-studies">
                <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10">
                  View All Case Studies
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 section-gradient">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 tech-badge">Testimonials</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What Our Clients Say
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((testimonial) => (
                <Card key={testimonial.id} className="card-hover bg-card">
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-primary/30 mb-4" />
                    <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">
                          {testimonial.authorName?.charAt(0) || "C"}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.authorName}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.authorTitle}, {testimonial.companyName}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/ModernControlPanel.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-quantum/90" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Future-Proof Your Enterprise?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Join industry leaders who are already preparing for the quantum era. 
              Get started with a personalized demo today.
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
