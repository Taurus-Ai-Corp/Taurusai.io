import { useState, useEffect, useMemo } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search as SearchIcon,
  Package,
  FileText,
  Newspaper,
  Building2,
  ChevronRight,
  X,
} from "lucide-react";

interface SearchResult {
  type: "product" | "blog" | "caseStudy" | "press";
  id: number;
  title: string;
  description: string;
  slug: string;
}

const resultTypeIcons: Record<string, React.ReactNode> = {
  product: <Package className="w-4 h-4" />,
  blog: <FileText className="w-4 h-4" />,
  caseStudy: <Building2 className="w-4 h-4" />,
  press: <Newspaper className="w-4 h-4" />,
};

const resultTypeLabels: Record<string, string> = {
  product: "Product",
  blog: "Blog Post",
  caseStudy: "Case Study",
  press: "Press Release",
};

const resultTypeColors: Record<string, string> = {
  product: "bg-primary/10 text-primary",
  blog: "bg-quantum/10 text-quantum",
  caseStudy: "bg-success/10 text-success",
  press: "bg-charcoal/10 text-charcoal",
};

const resultTypeLinks: Record<string, string> = {
  product: "/products",
  blog: "/insights",
  caseStudy: "/case-studies",
  press: "/press",
};

export default function Search() {
  const searchParams = useSearch();
  const urlQuery = new URLSearchParams(searchParams).get("q") || "";
  const [query, setQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { data: searchData, isLoading } = trpc.search.query.useQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length >= 2 }
  );

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Transform search results into flat array
  const results = useMemo<SearchResult[]>(() => {
    if (!searchData) return [];
    
    const flatResults: SearchResult[] = [];
    
    searchData.products?.forEach((p) => {
      flatResults.push({
        type: "product",
        id: p.id,
        title: p.name,
        description: p.tagline,
        slug: p.slug,
      });
    });
    
    searchData.blogPosts?.forEach((b) => {
      flatResults.push({
        type: "blog",
        id: b.id,
        title: b.title,
        description: b.excerpt,
        slug: b.slug,
      });
    });
    
    searchData.caseStudies?.forEach((c) => {
      flatResults.push({
        type: "caseStudy",
        id: c.id,
        title: c.title,
        description: c.challenge,
        slug: c.slug,
      });
    });
    
    searchData.pressReleases?.forEach((p) => {
      flatResults.push({
        type: "press",
        id: p.id,
        title: p.title,
        description: p.excerpt,
        slug: p.slug,
      });
    });
    
    return flatResults;
  }, [searchData]);

  const filteredResults = selectedType
    ? results.filter((r) => r.type === selectedType)
    : results;

  const resultCounts = useMemo(() => ({
    all: results.length,
    product: results.filter((r) => r.type === "product").length,
    blog: results.filter((r) => r.type === "blog").length,
    caseStudy: results.filter((r) => r.type === "caseStudy").length,
    press: results.filter((r) => r.type === "press").length,
  }), [results]);

  const getResultLink = (result: SearchResult) => {
    const baseLink = resultTypeLinks[result.type];
    return `${baseLink}/${result.slug}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Search Header */}
      <section className="pt-32 pb-8 bg-gradient-to-b from-muted to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
              Search Taurus AI
            </h1>
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, documentation, blog posts, news..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-12 h-14 text-lg"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Filter Tabs */}
            {results.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setSelectedType(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedType === null
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  All ({resultCounts.all})
                </button>
                {Object.entries(resultTypeLabels).map(([type, label]) => (
                  resultCounts[type as keyof typeof resultCounts] > 0 && (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedType === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {resultTypeIcons[type]}
                      {label} ({resultCounts[type as keyof typeof resultCounts]})
                    </button>
                  )
                ))}
              </div>
            )}

            {/* Loading State */}
            {isLoading && debouncedQuery.length >= 2 && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-muted rounded-xl" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && debouncedQuery.length < 2 && (
              <div className="text-center py-16">
                <SearchIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enter at least 2 characters to search
                </p>
              </div>
            )}

            {/* No Results */}
            {!isLoading && debouncedQuery.length >= 2 && results.length === 0 && (
              <div className="text-center py-16">
                <SearchIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find anything matching "{debouncedQuery}"
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Try:</p>
                  <ul className="list-disc list-inside">
                    <li>Using different keywords</li>
                    <li>Checking your spelling</li>
                    <li>Using more general terms</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Results List */}
            {!isLoading && filteredResults.length > 0 && (
              <div className="space-y-4">
                {filteredResults.map((result, index) => (
                  <Link key={`${result.type}-${result.id}-${index}`} href={getResultLink(result)}>
                    <Card className="card-hover cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${resultTypeColors[result.type]}`}>
                            {resultTypeIcons[result.type]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {resultTypeLabels[result.type]}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                              {result.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {result.description}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Quick Links */}
            {!debouncedQuery && (
              <div className="mt-12">
                <h3 className="font-semibold text-foreground mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {["quantum security", "BizFlow", "SWIFT 2027", "case studies", "demo"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Browse by Category</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Link href="/products">
              <Card className="card-hover text-center">
                <CardContent className="p-6">
                  <Package className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">Products</h3>
                  <p className="text-sm text-muted-foreground">Explore our platform</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/insights">
              <Card className="card-hover text-center">
                <CardContent className="p-6">
                  <FileText className="w-10 h-10 text-quantum mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">Insights</h3>
                  <p className="text-sm text-muted-foreground">Blog & thought leadership</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/case-studies">
              <Card className="card-hover text-center">
                <CardContent className="p-6">
                  <Building2 className="w-10 h-10 text-success mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">Case Studies</h3>
                  <p className="text-sm text-muted-foreground">Customer success stories</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/press">
              <Card className="card-hover text-center">
                <CardContent className="p-6">
                  <Newspaper className="w-10 h-10 text-charcoal mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">Press</h3>
                  <p className="text-sm text-muted-foreground">News & media</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
