import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Building2,
  Users,
  Globe,
} from "lucide-react";

const companySizes = [
  { value: "1-50", label: "1-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-1000", label: "201-1000 employees" },
  { value: "1001-5000", label: "1001-5000 employees" },
  { value: "5000+", label: "5000+ employees" },
];

const industries = [
  { value: "banking", label: "Banking & Financial Services" },
  { value: "fintech", label: "Financial Technology" },
  { value: "insurance", label: "Insurance" },
  { value: "government", label: "Government & Public Sector" },
  { value: "healthcare", label: "Healthcare" },
  { value: "other", label: "Other" },
];

const products = [
  { id: "bizflow", name: "BizFlow™" },
  { id: "q-grid", name: "Q-Grid™" },
  { id: "assetgrid", name: "AssetGrid™" },
  { id: "neovibe", name: "Neovibe™" },
];

export default function Contact() {
  const [location] = useLocation();
  const isDemo = location === "/demo";
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    phone: "",
    country: "",
    companySize: "",
    industry: "",
    message: "",
    productsInterested: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Thank you! We'll be in touch soon.");
    },
    onError: (error) => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await submitLead.mutateAsync({
      ...formData,
      leadType: isDemo ? "demo-request" : "contact",
      source: window.location.href,
    });
    
    setIsSubmitting(false);
  };

  const handleProductToggle = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      productsInterested: prev.productsInterested.includes(productId)
        ? prev.productsInterested.filter((p) => p !== productId)
        : [...prev.productsInterested, productId],
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-24">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Thank You!
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {isDemo
                  ? "Your demo request has been received. Our team will contact you within 24 hours to schedule your personalized demonstration."
                  : "Your message has been received. Our team will get back to you shortly."}
              </p>
              <div className="bg-muted rounded-xl p-6 text-left">
                <h3 className="font-semibold text-foreground mb-4">What happens next?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <p className="text-muted-foreground">Our team will review your inquiry within 24 hours</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <p className="text-muted-foreground">A solutions architect will reach out to discuss your needs</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <p className="text-muted-foreground">We'll schedule a personalized demo tailored to your requirements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-muted to-background">
        <div className="container">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4">
              {isDemo ? "Request Demo" : "Contact Us"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {isDemo
                ? "See Taurus AI in Action"
                : "Get in Touch"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {isDemo
                ? "Schedule a personalized demonstration and discover how Taurus AI can transform your enterprise infrastructure."
                : "Have questions? Our team is here to help. Reach out and we'll respond as soon as possible."}
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Work Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 123 456 7890"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name *</Label>
                        <Input
                          id="company"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Acme Corp"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          value={formData.jobTitle}
                          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                          placeholder="CTO"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companySize">Company Size</Label>
                        <Select
                          value={formData.companySize}
                          onValueChange={(value) => setFormData({ ...formData, companySize: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent>
                            {companySizes.map((size) => (
                              <SelectItem key={size.value} value={size.value}>
                                {size.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select
                          value={formData.industry}
                          onValueChange={(value) => setFormData({ ...formData, industry: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry.value} value={industry.value}>
                                {industry.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {isDemo && (
                      <div className="space-y-3">
                        <Label>Products of Interest</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {products.map((product) => (
                            <div key={product.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={product.id}
                                checked={formData.productsInterested.includes(product.id)}
                                onCheckedChange={() => handleProductToggle(product.id)}
                              />
                              <label
                                htmlFor={product.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {product.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="message">
                        {isDemo ? "Tell us about your requirements" : "Message"}
                      </Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={isDemo
                          ? "Describe your current challenges and what you're looking to achieve..."
                          : "How can we help you?"
                        }
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : isDemo ? "Request Demo" : "Send Message"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">Email</div>
                        <a href="mailto:contact@taurus.ai" className="text-muted-foreground hover:text-primary">
                          contact@taurus.ai
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">Phone</div>
                        <a href="tel:+911234567890" className="text-muted-foreground hover:text-primary">
                          +91 123 456 7890
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">Headquarters</div>
                        <p className="text-muted-foreground">
                          Cyber City, DLF Phase 2<br />
                          Gurugram, Haryana 122002
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground">Business Hours</div>
                        <p className="text-muted-foreground">
                          Mon - Fri: 9:00 AM - 6:00 PM IST
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Why Choose Taurus AI?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">90-day implementation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">99.9% uptime SLA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">SWIFT 2027 compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">24/7 enterprise support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4">Global Offices</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Mumbai, India (HQ)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Singapore</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Dubai, UAE</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">London, UK</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
