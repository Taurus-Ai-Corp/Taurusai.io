import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Download,
  FileText,
  TrendingUp,
  Users,
  Globe,
  Award,
  Calendar,
  ArrowRight,
  Building2,
  BarChart3,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "annual-report": <BarChart3 className="w-5 h-5" />,
  "quarterly-report": <TrendingUp className="w-5 h-5" />,
  "media-kit": <FileText className="w-5 h-5" />,
  "pitch-deck": <Building2 className="w-5 h-5" />,
  "whitepaper": <FileText className="w-5 h-5" />,
  "press-release": <FileText className="w-5 h-5" />,
  "fact-sheet": <FileText className="w-5 h-5" />,
};

const categoryLabels: Record<string, string> = {
  "annual-report": "Annual Report",
  "quarterly-report": "Quarterly Report",
  "media-kit": "Media Kit",
  "pitch-deck": "Pitch Deck",
  "whitepaper": "Whitepaper",
  "press-release": "Press Release",
  "fact-sheet": "Fact Sheet",
};

export default function InvestorRelations() {
  const { data: assets } = trpc.assets.list.useQuery();
  const trackDownload = trpc.assets.trackDownload.useMutation();

  const handleDownload = async (assetId: number, fileUrl: string) => {
    await trackDownload.mutateAsync({ id: assetId });
    // In production, this would trigger actual file download
    window.open(fileUrl, "_blank");
  };

  const reports = assets?.filter((a) => 
    ["annual-report", "quarterly-report"].includes(a.category)
  );
  const documents = assets?.filter((a) => 
    ["whitepaper", "fact-sheet"].includes(a.category)
  );
  const presentations = assets?.filter((a) => 
    ["pitch-deck", "media-kit"].includes(a.category)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-muted to-background">
        <div className="container">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4">Investor Relations</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Investor Information Center
            </h1>
            <p className="text-xl text-muted-foreground">
              Access financial reports, investor presentations, and company information. 
              Taurus AI is committed to transparency and shareholder value.
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">$50M</div>
              <div className="text-sm text-muted-foreground">Series B Funding</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-sm text-muted-foreground">Enterprise Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">300%</div>
              <div className="text-sm text-muted-foreground">YoY Revenue Growth</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15</div>
              <div className="text-sm text-muted-foreground">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Reports */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-primary" />
            Financial Reports
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports?.map((asset) => (
              <Card key={asset.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {categoryIcons[asset.category]}
                    </div>
                    <Badge variant="secondary">{categoryLabels[asset.category]}</Badge>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{asset.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{asset.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{asset.fileType} • {asset.fileSize}</span>
                    <span>{asset.downloadCount} downloads</span>
                  </div>
                  <Button
                    onClick={() => handleDownload(asset.id, asset.fileUrl)}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="mr-2 w-4 h-4" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Presentations */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Building2 className="w-6 h-6 text-primary" />
            Investor Presentations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {presentations?.map((asset) => (
              <Card key={asset.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-quantum flex items-center justify-center text-white shrink-0">
                      {categoryIcons[asset.category]}
                    </div>
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">{categoryLabels[asset.category]}</Badge>
                      <h3 className="font-bold text-foreground mb-2">{asset.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{asset.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {asset.fileType} • {asset.fileSize}
                        </span>
                        <Button
                          onClick={() => handleDownload(asset.id, asset.fileUrl)}
                          size="sm"
                        >
                          <Download className="mr-2 w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Whitepapers & Documents */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            Technical Documents & Whitepapers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents?.map((asset) => (
              <Card key={asset.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-quantum/10 flex items-center justify-center text-quantum">
                      {categoryIcons[asset.category]}
                    </div>
                    <Badge variant="outline">{categoryLabels[asset.category]}</Badge>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{asset.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{asset.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{asset.fileType} • {asset.fileSize}</span>
                  </div>
                  <Button
                    onClick={() => handleDownload(asset.id, asset.fileUrl)}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="mr-2 w-4 h-4" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-charcoal text-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-white/30 text-white">Company Overview</Badge>
              <h2 className="text-3xl font-bold mb-6">
                Leading the Quantum-Safe Revolution
              </h2>
              <p className="text-silver mb-8">
                Taurus AI is pioneering quantum-safe infrastructure for the financial services 
                industry. Our platform enables enterprises to achieve regulatory compliance, 
                enhance security, and drive operational efficiency.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <span>RBI Harbinger Innovation Award Winner</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <span>Operating in 15+ countries globally</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <span>200+ employees across 5 offices</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Leadership Team</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">VS</span>
                  </div>
                  <div>
                    <div className="font-semibold">Vikram Singh</div>
                    <div className="text-sm text-silver-dark">CEO & Co-Founder</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">PS</span>
                  </div>
                  <div>
                    <div className="font-semibold">Dr. Priya Sharma</div>
                    <div className="text-sm text-silver-dark">CTO & Co-Founder</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">AM</span>
                  </div>
                  <div>
                    <div className="font-semibold">Amit Mehta</div>
                    <div className="text-sm text-silver-dark">CFO</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact IR */}
      <section className="py-24 bg-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Investor Inquiries
            </h2>
            <p className="text-xl text-white/80 mb-10">
              For investor relations inquiries, please contact our IR team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:investors@taurus.ai">
                <Button size="lg" variant="secondary" className="text-lg px-8 h-14">
                  Contact IR Team
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 h-14"
                >
                  General Inquiries
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
