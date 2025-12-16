import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Clock, User, Calendar, Linkedin, Twitter, Share2 } from "lucide-react";

const categories = [
  { value: "thought-leadership", label: "Thought Leadership" },
  { value: "product-capabilities", label: "Product Capabilities" },
  { value: "customer-success", label: "Customer Success" },
  { value: "regulatory-compliance", label: "Regulatory Compliance" },
  { value: "industry-news", label: "Industry News" },
];

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading } = trpc.blog.bySlug.useQuery({ slug: params.slug || "" });
  const { data: author } = trpc.authors.byId.useQuery(
    { id: post?.authorId || 0 },
    { enabled: !!post?.authorId }
  );
  const { data: relatedPosts } = trpc.blog.byCategory.useQuery(
    { category: post?.category as any },
    { enabled: !!post?.category }
  );

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 pb-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <Link href="/insights">
            <Button>Back to Insights</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const otherPosts = relatedPosts?.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Article Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-muted to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Link href="/insights">
              <Button variant="ghost" className="mb-6 -ml-4">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Insights
              </Button>
            </Link>

            <Badge className="mb-4">
              {categories.find((c) => c.value === post.category)?.label}
            </Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              {author && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-quantum flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {author.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{author.name}</div>
                    <div className="text-xs">{author.title}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none text-foreground">
              <p className="text-muted-foreground leading-relaxed">{post.content}</p>
              
              {/* Placeholder for full article content */}
              <div className="my-8 p-8 bg-muted rounded-xl">
                <p className="text-center text-muted-foreground italic">
                  Full article content would be rendered here with rich formatting, 
                  images, code blocks, and other elements.
                </p>
              </div>
            </div>

            {/* Tags */}
            {post.tags && (post.tags as string[]).length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h4 className="font-semibold text-foreground mb-4">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {(post.tags as string[]).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mt-8 pt-8 border-t border-border">
              <h4 className="font-semibold text-foreground mb-4">Share this article</h4>
              <div className="flex gap-3">
                <Button variant="outline" size="icon">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Author Bio */}
            {author && (
              <div className="mt-12 p-8 bg-muted rounded-xl">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-quantum flex items-center justify-center shrink-0">
                    <span className="text-2xl font-bold text-white">
                      {author.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">{author.name}</h4>
                    <p className="text-primary font-medium mb-2">{author.title}</p>
                    <p className="text-muted-foreground text-sm mb-4">{author.bio}</p>
                    {author.linkedIn && (
                      <a
                        href={author.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center gap-2"
                      >
                        <Linkedin className="w-4 h-4" />
                        Connect on LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {otherPosts && otherPosts.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {otherPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/insights/${relatedPost.slug}`}>
                  <div className="bg-card rounded-xl p-6 card-hover">
                    <Badge className="mb-3">
                      {categories.find((c) => c.value === relatedPost.category)?.label}
                    </Badge>
                    <h3 className="font-bold text-foreground mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{relatedPost.readTime} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Want to Learn More?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Schedule a demo to see how Taurus AI can transform your infrastructure.
            </p>
            <Link href="/demo">
              <Button size="lg" variant="secondary">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
