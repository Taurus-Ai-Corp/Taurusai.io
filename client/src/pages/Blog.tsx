import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Clock, User, Calendar, ChevronRight } from "lucide-react";

const categories = [
  { value: "all", label: "All Posts" },
  { value: "thought-leadership", label: "Thought Leadership" },
  { value: "product-capabilities", label: "Product Capabilities" },
  { value: "customer-success", label: "Customer Success" },
  { value: "regulatory-compliance", label: "Regulatory Compliance" },
  { value: "industry-news", label: "Industry News" },
];

const categoryColors: Record<string, string> = {
  "thought-leadership": "bg-primary/10 text-primary",
  "product-capabilities": "bg-quantum/10 text-quantum",
  "customer-success": "bg-success/10 text-success",
  "regulatory-compliance": "bg-warning/10 text-warning",
  "industry-news": "bg-charcoal/10 text-charcoal",
};

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: allPosts } = trpc.blog.list.useQuery();
  const { data: authors } = trpc.authors.list.useQuery();
  const { data: featuredPosts } = trpc.blog.featured.useQuery();

  const filteredPosts = selectedCategory === "all" 
    ? allPosts 
    : allPosts?.filter((post) => post.category === selectedCategory);

  const getAuthor = (authorId: number) => authors?.find((a) => a.id === authorId);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-muted to-background">
        <div className="container">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4">Insights Hub</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Industry Insights & Thought Leadership
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert perspectives on quantum-safe security, enterprise automation, 
              regulatory compliance, and the future of financial infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPosts && featuredPosts[0] && (
        <section className="py-12 border-b border-border">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-primary/20 to-quantum/20 rounded-2xl h-80 flex items-center justify-center">
                <div className="text-6xl font-bold text-primary/30">Featured</div>
              </div>
              <div>
                <Badge className={categoryColors[featuredPosts[0].category]}>
                  {categories.find((c) => c.value === featuredPosts[0].category)?.label}
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mt-4 mb-4">
                  {featuredPosts[0].title}
                </h2>
                <p className="text-muted-foreground mb-6">{featuredPosts[0].excerpt}</p>
                <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{getAuthor(featuredPosts[0].authorId)?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(featuredPosts[0].publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPosts[0].readTime} min read</span>
                  </div>
                </div>
                <Link href={`/insights/${featuredPosts[0].slug}`}>
                  <Button>
                    Read Article
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 border-b border-border sticky top-16 lg:top-20 bg-background/95 backdrop-blur z-40">
        <div className="container">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts?.map((post) => {
              const author = getAuthor(post.authorId);
              return (
                <Card key={post.id} className="card-hover overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-quantum/10 flex items-center justify-center">
                      <Badge className={categoryColors[post.category]}>
                        {categories.find((c) => c.value === post.category)?.label}
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {author?.name?.charAt(0)}
                            </span>
                          </div>
                          <span>{author?.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime} min</span>
                        </div>
                      </div>
                      <Link href={`/insights/${post.slug}`}>
                        <Button variant="ghost" className="w-full justify-between">
                          Read More
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredPosts?.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No posts found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Authors Section */}
      <section className="py-24 bg-muted">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Our Authors</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Thought Leaders
            </h2>
            <p className="text-lg text-muted-foreground">
              Industry experts sharing insights on quantum security, enterprise technology, 
              and regulatory compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {authors?.map((author) => (
              <Card key={author.id} className="text-center">
                <CardContent className="p-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-quantum mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {author.name?.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{author.name}</h3>
                  <p className="text-primary font-medium mb-4">{author.title}</p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{author.bio}</p>
                  {author.linkedIn && (
                    <a
                      href={author.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Connect on LinkedIn
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Stay Ahead of the Curve
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Subscribe to our newsletter for the latest insights on quantum security, 
              regulatory updates, and enterprise technology trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button variant="secondary" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
