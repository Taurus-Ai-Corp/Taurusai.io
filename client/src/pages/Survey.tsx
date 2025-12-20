import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, Star } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Survey() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    position: "",
    rating: 5,
    feedback: "",
    wouldRecommend: "yes",
    canPublish: "yes",
  });

  const submitMutation = trpc.testimonials.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Thank you for your feedback!");
    },
    onError: () => {
      toast.error("Failed to submit survey. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.company || !formData.feedback) {
      toast.error("Please fill in all required fields");
      return;
    }

    submitMutation.mutate({
      name: formData.name,
      company: formData.company,
      position: formData.position,
      content: formData.feedback,
      rating: formData.rating,
      featured: false,
      published: formData.canPublish === "yes",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 py-20">
          <div className="container max-w-2xl">
            <Card className="p-12 text-center border-primary/20">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Thank You for Your Feedback!
              </h1>
              
              <p className="text-muted-foreground mb-8">
                Your insights help us improve our services and better serve our clients.
                {formData.canPublish === "yes" && " Your testimonial may be featured on our website to help other businesses make informed decisions."}
              </p>
              
              <Button onClick={() => window.location.href = "/"} size="lg">
                Return to Homepage
              </Button>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Post-Consultation Survey
            </h1>
            <p className="text-muted-foreground">
              We'd love to hear about your experience with Taurus AI Corp. Your feedback helps us improve our services.
            </p>
          </div>

          <Card className="p-8 border-border/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="e.g., CTO, VP Engineering"
                    />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Overall Experience</h2>
                
                <div>
                  <Label>How would you rate your consultation? *</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="transition-colors"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= formData.rating
                              ? "fill-warning text-warning"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Your Feedback</h2>
                
                <div>
                  <Label htmlFor="feedback">
                    Please share your experience with Taurus AI Corp *
                  </Label>
                  <Textarea
                    id="feedback"
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    rows={6}
                    placeholder="Tell us about your consultation, what you found valuable, and how our solutions can help your business..."
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Minimum 50 characters recommended
                  </p>
                </div>
              </div>

              {/* Recommendation */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Recommendation</h2>
                
                <div>
                  <Label>Would you recommend Taurus AI Corp to others? *</Label>
                  <RadioGroup
                    value={formData.wouldRecommend}
                    onValueChange={(value) => setFormData({ ...formData, wouldRecommend: value })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="recommend-yes" />
                      <Label htmlFor="recommend-yes" className="cursor-pointer">
                        Yes, definitely
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maybe" id="recommend-maybe" />
                      <Label htmlFor="recommend-maybe" className="cursor-pointer">
                        Maybe, depends on the use case
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="recommend-no" />
                      <Label htmlFor="recommend-no" className="cursor-pointer">
                        Not at this time
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Publishing Permission */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Testimonial Usage</h2>
                
                <div>
                  <Label>May we publish your feedback as a testimonial? *</Label>
                  <RadioGroup
                    value={formData.canPublish}
                    onValueChange={(value) => setFormData({ ...formData, canPublish: value })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="publish-yes" />
                      <Label htmlFor="publish-yes" className="cursor-pointer">
                        Yes, you may publish my feedback
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="publish-no" />
                      <Label htmlFor="publish-no" className="cursor-pointer">
                        No, keep my feedback private
                      </Label>
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-muted-foreground mt-2">
                    Published testimonials may appear on our website and marketing materials
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Survey"}
              </Button>
            </form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
