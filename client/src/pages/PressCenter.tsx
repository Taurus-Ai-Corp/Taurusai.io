import { useState } from "react";
import { useCanonicalUrl } from "@/hooks/useCanonicalUrl";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Download,
  FileText,
  Award,
  Handshake,
  Newspaper,
  Calendar,
  ArrowRight,
  ExternalLink,
  Mail,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "press-release": <Newspaper className="w-5 h-5" />,
  "news": <FileText className="w-5 h-5" />,
  "award": <Award className="w-5 h-5" />,
  "partnership": <Handshake className="w-5 h-5" />,
};

const categoryLabels: Record<string, string> = {
  "press-release": "Press Release",
  "news": "News",
  "award": "Award",
  "partnership": "Partnership",
};

const categoryColors: Record<string, string> = {
  "press-release": "bg-primary/10 text-primary",
  "news": "bg-charcoal/10 text-charcoal",
  "award": "bg-warning/10 text-warning",
  "partnership": "bg-success/10 text-success",
};

export default function PressCenter() {
  useCanonicalUrl("/press");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: pressReleases } = trpc.press.list.useQuery();
  const { data: mediaKit } = trpc.assets.byCategory.useQuery({ category: "media-kit" });
  const trackDownload = trpc.assets.trackDownload.useMutation();

  const filteredReleases = selectedCategory === "all"
    ? pressReleases
    : pressReleases?.filter((pr) => pr.category === selectedCategory);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownload = async (assetId: number, fileUrl: string) => {
    await trackDownload.mutateAsync({ id: assetId });
    window.open(fileUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-muted to-background">
        <div className="container">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4">Press Center</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              News & Media Resources
            </h1>
            <p className="text-xl text-muted-foreground">
              Stay updated with the latest news, press releases, and media resources 
              from Taurus AI. Download our media kit for brand assets and company information.
            </p>
          </div>
        </div>
      </section>

      {/* Media Kit Download */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <div className="bg-gradient-to-r from-primary to-quantum rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Media Kit & Brand Assets
                </h2>
                <p className="text-white/80 mb-6">
                  Download our official media kit including logos, brand guidelines, 
                  executive photos, and company information for press use.
                </p>
                {mediaKit && mediaKit[0] && (
                  <Button
                    onClick={() => handleDownload(mediaKit[0].id, mediaKit[0].fileUrl)}
                    size="lg"
                    variant="secondary"
                  >
                    <Download className="mr-2 w-5 h-5" />
                    Download Media Kit ({mediaKit[0].fileSize})
                  </Button>
                )}
              </div>
              <div className="hidden md:flex justify-end">
                <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center">
                  <FileText className="w-16 h-16 text-white/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border sticky top-16 lg:top-20 bg-background/95 backdrop-blur z-40">
        <div className="container">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All News
            </button>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSelectedCategory(value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {categoryIcons[value]}
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16">
        <div className="container">
          <div className="space-y-6">
            {filteredReleases?.map((release) => (
              <Card key={release.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex items-center gap-4 md:w-48 shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${categoryColors[release.category]}`}>
                        {categoryIcons[release.category]}
                      </div>
                      <div className="md:hidden">
                        <Badge className={categoryColors[release.category]}>
                          {categoryLabels[release.category]}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="hidden md:block mb-2">
                        <Badge className={categoryColors[release.category]}>
                          {categoryLabels[release.category]}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {release.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{release.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(release.publishedAt)}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Read Full Release
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        {release.externalUrl && (
                          <a href={release.externalUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="mr-2 w-4 h-4" />
                              External Link
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReleases?.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No press releases found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Press Highlights */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground mb-8">Press Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-warning mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">RBI Harbinger Award</h3>
                <p className="text-sm text-muted-foreground">
                  Recognized for innovation in quantum-safe CBDC solutions
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-6 text-center">
                <Handshake className="w-12 h-12 text-success mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">SWIFT Partnership</h3>
                <p className="text-sm text-muted-foreground">
                  Strategic partner for PQC migration initiative
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-6 text-center">
                <Newspaper className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">Series B Funding</h3>
                <p className="text-sm text-muted-foreground">
                  $50M raised to accelerate global expansion
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-24 bg-charcoal text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Mail className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Media Inquiries
            </h2>
            <p className="text-xl text-silver mb-10">
              For press inquiries, interview requests, or additional information, 
              please contact our communications team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:press@taurus.ai">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-14">
                  Contact Press Team
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 h-14"
                >
                  General Contact
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
