import { useState } from "react";
import { useCanonicalUrl } from "@/hooks/useCanonicalUrl";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Quote,
  Building2,
  Clock,
  TrendingUp,
  CheckCircle2,
  X,
} from "lucide-react";

export default function CaseStudies() {
  useCanonicalUrl("/case-studies");
  const params = useParams<{ slug?: string }>();
  const { data: caseStudies } = trpc.caseStudies.list.useQuery();
  const [selectedStudy, setSelectedStudy] = useState<any>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const featuredStudies = caseStudies?.filter((s) => s.isFeatured) || [];

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % featuredStudies.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + featuredStudies.length) % featuredStudies.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-muted to-background">
        <div className="container">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4">Case Studies</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Customer Success Stories
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover how leading financial institutions have transformed their infrastructure 
              and achieved measurable results with Taurus AI.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Carousel */}
      {featuredStudies.length > 0 && (
        <section className="py-16 bg-charcoal text-white">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Featured Success Stories</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
              >
                {featuredStudies.map((study) => (
                  <div key={study.id} className="w-full flex-shrink-0 px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <Badge variant="secondary" className="mb-4">{study.industry}</Badge>
                        <h3 className="text-3xl font-bold mb-4">{study.title}</h3>
                        <p className="text-silver mb-6">{study.challenge}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          {(study.metrics as any[])?.slice(0, 4).map((metric, i) => (
                            <div key={i} className="bg-white/5 rounded-lg p-4">
                              <div className="text-2xl font-bold text-primary">{metric.value}</div>
                              <div className="text-sm text-silver-dark">{metric.label}</div>
                            </div>
                          ))}
                        </div>

                        <Button
                          onClick={() => setSelectedStudy(study)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Read Full Story
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>

                      <div className="bg-white/5 rounded-2xl p-8">
                        <Quote className="w-12 h-12 text-primary/50 mb-4" />
                        <p className="text-xl text-silver-light italic mb-6">
                          "{study.testimonial}"
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{study.testimonialAuthor}</div>
                            <div className="text-sm text-silver-dark">{study.testimonialRole}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {featuredStudies.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === carouselIndex ? "w-8 bg-primary" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Case Studies Grid */}
      <section className="py-24">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground mb-8">All Case Studies</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies?.map((study) => (
              <Card key={study.id} className="card-hover overflow-hidden cursor-pointer" onClick={() => setSelectedStudy(study)}>
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
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{study.industry}</Badge>
                      {study.isFeatured && <Badge className="bg-primary">Featured</Badge>}
                    </div>
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{study.implementationTime} implementation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Modal */}
      <Dialog open={!!selectedStudy} onOpenChange={() => setSelectedStudy(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedStudy && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{selectedStudy.industry}</Badge>
                  {selectedStudy.isFeatured && <Badge className="bg-primary">Featured</Badge>}
                </div>
                <DialogTitle className="text-2xl">{selectedStudy.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-8 mt-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(selectedStudy.metrics as any[])?.map((metric, i) => (
                    <div key={i} className="bg-muted rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{metric.value}</div>
                      <div className="text-xs text-muted-foreground">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Challenge */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive text-sm">1</span>
                    The Challenge
                  </h4>
                  <p className="text-muted-foreground pl-10">{selectedStudy.challenge}</p>
                </div>

                {/* Solution */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">2</span>
                    The Solution
                  </h4>
                  <p className="text-muted-foreground pl-10">{selectedStudy.solution}</p>
                  <div className="flex flex-wrap gap-2 mt-4 pl-10">
                    {(selectedStudy.productsUsed as string[])?.map((product) => (
                      <Badge key={product} variant="outline">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success text-sm">3</span>
                    The Results
                  </h4>
                  <p className="text-muted-foreground pl-10">{selectedStudy.results}</p>
                </div>

                {/* Testimonial */}
                {selectedStudy.testimonial && (
                  <div className="bg-muted rounded-xl p-6">
                    <Quote className="w-10 h-10 text-primary/30 mb-4" />
                    <p className="text-lg text-foreground italic mb-4">
                      "{selectedStudy.testimonial}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{selectedStudy.testimonialAuthor}</div>
                        <div className="text-sm text-muted-foreground">{selectedStudy.testimonialRole}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Implementation Details */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Implementation Time:</span>
                  </div>
                  <span className="font-semibold text-foreground">{selectedStudy.implementationTime}</span>
                </div>

                {/* CTA */}
                <div className="flex gap-4 pt-4">
                  <Link href="/demo">
                    <Button className="flex-1">
                      Get Similar Results
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="flex-1">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Join the leading financial institutions already transforming their 
              infrastructure with Taurus AI.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/demo">
                <Button size="lg" variant="secondary" className="text-lg px-8 h-14">
                  Schedule Demo
                  <ArrowRight className="ml-2 w-5 h-5" />
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
