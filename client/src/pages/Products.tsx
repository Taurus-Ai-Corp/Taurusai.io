import { useState } from "react";
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
} from "lucide-react";

const productIcons: Record<string, React.ReactNode> = {
  Workflow: <Workflow className="w-8 h-8" />,
  Database: <Database className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
  Sparkles: <Sparkles className="w-8 h-8" />,
};

const productColors: Record<string, string> = {
  cobalt: "from-cobalt to-cobalt-light",
  quantum: "from-quantum to-cobalt-light",
  charcoal: "from-charcoal to-charcoal-light",
  silver: "from-silver-dark to-silver",
};

export default function Products() {
  const params = useParams<{ slug?: string }>();
  const { data: products } = trpc.products.list.useQuery();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(params.slug || null);

  const activeProduct = products?.find((p) => p.slug === selectedProduct) || products?.[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-muted to-background">
        <div className="container">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4">Product Suite</Badge>
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
      <section className="py-12 border-b border-border sticky top-16 lg:top-20 bg-background/95 backdrop-blur z-40">
        <div className="container">
          <div className="flex flex-wrap gap-4">
            {products?.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product.slug)}
                onMouseEnter={() => setHoveredProduct(product.slug)}
                onMouseLeave={() => setHoveredProduct(null)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedProduct === product.slug || (selectedProduct === null && products[0].slug === product.slug)
                    ? "border-primary bg-primary/5 shadow-lg"
                    : hoveredProduct === product.slug
                    ? "border-primary/50 bg-muted"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    selectedProduct === product.slug || (selectedProduct === null && products[0].slug === product.slug)
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {productIcons[product.icon]}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">{product.name}</div>
                  <div className="text-xs text-muted-foreground">{product.tagline}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail */}
      {activeProduct && (
        <section className="py-16">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Left Column - Info */}
              <div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${productColors[activeProduct.color]} flex items-center justify-center text-white mb-6`}>
                  {productIcons[activeProduct.icon]}
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">{activeProduct.name}</h2>
                <p className="text-lg text-muted-foreground mb-8">{activeProduct.description}</p>

                <h3 className="text-xl font-semibold text-foreground mb-4">Key Features</h3>
                <div className="space-y-3 mb-8">
                  {(activeProduct.features as string[])?.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Link href="/demo">
                    <Button size="lg">
                      Request Demo
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column - Use Cases & Impact */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Use Cases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(activeProduct.useCases as any[])?.map((useCase, i) => (
                        <div key={i} className="flex justify-between items-start p-4 rounded-lg bg-muted">
                          <div>
                            <div className="font-medium text-foreground">{useCase.title}</div>
                            <div className="text-sm text-muted-foreground">{useCase.description}</div>
                          </div>
                          <Badge variant="secondary" className="shrink-0 ml-4">
                            {useCase.metric}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Financial Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {(activeProduct.financialImpact as any[])?.map((impact, i) => (
                        <div key={i} className="flex justify-between items-center p-4 rounded-lg border border-border">
                          <span className="text-muted-foreground">{impact.label}</span>
                          <span className="font-bold text-foreground">{impact.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Comparison Table */}
      <section className="py-24 bg-muted">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Product Comparison</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Compare Our Solutions
            </h2>
            <p className="text-lg text-muted-foreground">
              Find the right combination of products for your enterprise needs.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-xl shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="p-4 text-left font-semibold">Feature</th>
                  {products?.map((product) => (
                    <th key={product.id} className="p-4 text-center font-semibold">
                      {product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Quantum-Safe Security</td>
                  {products?.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <CheckCircle2 className="w-5 h-5 text-success mx-auto" />
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border bg-muted/50">
                  <td className="p-4 font-medium text-foreground">Workflow Automation</td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-success mx-auto" /></td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">Advanced Analytics</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-success mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-success mx-auto" /></td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                </tr>
                <tr className="border-b border-border bg-muted/50">
                  <td className="p-4 font-medium text-foreground">Asset Management</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-success mx-auto" /></td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">User Experience Layer</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-success mx-auto" /></td>
                </tr>
                <tr className="border-b border-border bg-muted/50">
                  <td className="p-4 font-medium text-foreground">Offline Capability</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-success mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-success mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-foreground">WCAG 2.1 AAA</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-success mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Infrastructure?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Let our experts help you choose the right combination of products 
              for your enterprise needs.
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
