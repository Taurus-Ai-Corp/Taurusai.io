import { useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, ArrowRight, Mail, Phone } from "lucide-react";

export default function PaymentSuccess() {
  const searchString = window.location.search;
  const params = new URLSearchParams(searchString);
  const sessionId = params.get('session_id');

  useEffect(() => {
    // Could verify session with backend here if needed
    console.log('Payment session:', sessionId);
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-16">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card className="border-success/30 bg-success/5">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <CardTitle className="text-3xl text-foreground">Payment Successful!</CardTitle>
                <CardDescription className="text-lg">
                  Thank you for your purchase. Your subscription is now active.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-background rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-2">What's Next?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>You'll receive a confirmation email with your receipt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>Our team will reach out within 24 hours to schedule onboarding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>Access your dashboard to start configuring your platform</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Return Home
                    </Button>
                  </Link>
                  <Link href="/contact" className="flex-1">
                    <Button className="w-full">
                      Contact Support <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="pt-4 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground mb-2">Need help?</p>
                  <div className="flex justify-center gap-6 text-sm">
                    <a href="mailto:support@taurusai.io" className="flex items-center gap-1 text-primary hover:underline">
                      <Mail className="w-4 h-4" /> support@taurusai.io
                    </a>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="w-4 h-4" /> +1 (555) 123-4567
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
