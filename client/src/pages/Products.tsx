import { useState, useEffect } from "react";
import { useCanonicalUrl } from "@/hooks/useCanonicalUrl";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ChevronRight,
  Target,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import ProductComparisonTable from "@/components/ProductComparisonTable";

// Product data with images and external links
const productData: Record<string, { image: string; screenshot: string; link: string; color: string; logo?: string }> = {
  bizflow: {
    image: "/images/TaurusAI.BizFlow™.png",
    screenshot: "/images/cmgvdpkm.manus.space-BizFlowAI-AdvancedAutomationPlatform-fpscreenshot.png",
    link: "https://cmgvdpkm.manus.space",
    color: "from-cyan to-purple",
    logo: "/images/bizflow-logo.jpg",
  },
  "q-grid": {
    image: "/images/qgrid-logo.png",
    screenshot: "/images/q-grid.net-q-gridnetapp-fpscreenshot.jpeg",
    link: "https://q-grid.net",
    color: "from-quantum to-cyan",
    logo: "/images/qgrid-logo.png",
  },
  assetgrid: {
    image: "/images/FinancialDataDisplay.png",
    screenshot: "/images/8go3y1FWhxQYIxaEf7tkg.png",
    link: "https://assetgrid.taurusai.io",
    color: "from-success to-cyan",
    logo: "/images/assetgrid-logo.png",
  },
  neovibe: {
    image: "/images/neovibe.png",
    screenshot: "/images/GlitchedBrainArtwork.png",
    link: "https://neovibe.taurusai.io",
    color: "from-warning to-quantum",
  },
};

const productIcons: Record<string, React.ReactNode> = {
  Workflow: <Workflow className="w-8 h-8" />,
  Database: <Database className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
  Sparkles: <Sparkles className="w-8 h-8" />,
};

export default function Products() {
  useCanonicalUrl("/products");
  const params = useParams<{ slug?: string }>();
  const { data: products } = trpc.products.list.useQuery();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(params.slug || null);

  useEffect(() => {
    if (params.slug) {
      setSelectedProduct(params.slug);
    }
  }, [params.slug]);

  const activeProduct = products?.find((p) => p.slug === selectedProduct) || products?.[0];
  const activeProductData = activeProduct ? productData[activeProduct.slug] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/images/FuturisticDataCenterCorridor.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 tech-badge">Product Suite</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Quantum-Safe Enterprise Platform
            </h1>
            <p className="text-xl text-muted-foreground">
              Four integrated products designed to transform your financial infrastructure 
              with quantum-resistant security, intelligent automation, and enterprise-grade reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Product Selector */}
      <section className="py-8 border-b border-border sticky top-16 lg:top-20 bg-background/95 backdrop-blur z-40">
        <div className="container">
          <div className="flex flex-wrap gap-4">
            {products?.map((product) => {
              const pData = productData[product.slug];
              return (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product.slug)}
                  onMouseEnter={() => setHoveredProduct(product.slug)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedProduct === product.slug || (selectedProduct === null && products[0].slug === product.slug)
                      ? "border-primary bg-primary/10 shadow-lg glow-cyan"
                      : hoveredProduct === product.slug
                      ? "border-primary/50 bg-card"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pData?.color || 'from-primary to-cyan'} flex items-center justify-center text-white`}>
                    {productIcons[product.icon || "Workflow"]}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-foreground">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.tagline}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Detail */}
      {activeProduct && (
        <section className="py-16">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Product Info */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${activeProductData?.color || 'from-primary to-cyan'} flex items-center justify-center text-white`}>
                    {productIcons[activeProduct.icon || "Workflow"]}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">{activeProduct.name}</h2>
                    <p className="text-primary">{activeProduct.tagline}</p>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground mb-8">{activeProduct.description}</p>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">Key Features</h3>
                  <div className="grid gap-3">
                    {activeProduct.features?.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                        <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use Cases */}
                {activeProduct.useCases && activeProduct.useCases.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-foreground mb-4">Use Cases</h3>
                    <div className="grid gap-3">
                      {activeProduct.useCases.map((useCase, index) => (
                        <div key={index} className="p-3 rounded-lg bg-card border border-border">
                          <div className="font-semibold text-foreground">{useCase.title}</div>
                          <div className="text-sm text-muted-foreground">{useCase.description}</div>
                          {useCase.metric && <div className="text-xs text-primary mt-1">{useCase.metric}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                  {activeProductData?.link && (
                    <a href={activeProductData.link} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 btn-glow">
                        Visit Platform
                        <ExternalLink className="ml-2 w-5 h-5" />
                      </Button>
                    </a>
                  )}
                  <Link href="/demo">
                    <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10">
                      Request Demo
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Product Screenshot */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden border border-border shadow-2xl">
                  <img 
                    src={activeProductData?.screenshot || activeProductData?.image} 
                    alt={activeProduct.name}
                    className="w-full h-auto"
                  />
                </div>
                
                {/* Financial Impact Card */}
                {activeProduct.financialImpact && activeProduct.financialImpact.length > 0 && (
                  <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl border border-border shadow-xl max-w-xs">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-6 h-6 text-success" />
                      <span className="font-semibold text-foreground">Financial Impact</span>
                    </div>
                    <div className="space-y-1">
                      {activeProduct.financialImpact.map((impact, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="text-muted-foreground">{impact.label}: </span>
                          <span className="text-foreground font-medium">{impact.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Comparison Table */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 tech-badge">Comparison</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Platform Comparison</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how our products compare across key enterprise requirements
            </p>
          </div>

          <ProductComparisonTable />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/MinimalistControlPanels.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-quantum/90" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Enterprise?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Get a personalized demo of our quantum-safe platform and see how 
              Taurus AI can accelerate your digital transformation.
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
