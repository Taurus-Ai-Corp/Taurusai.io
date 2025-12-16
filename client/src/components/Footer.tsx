import { Link } from "wouter";
import { Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  products: [
    { label: "BizFlow™", href: "/products/bizflow" },
    { label: "Q-Grid™", href: "/products/q-grid" },
    { label: "AssetGrid™", href: "/products/assetgrid" },
    { label: "Neovibe™", href: "/products/neovibe" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Insights", href: "/insights" },
    { label: "Careers", href: "/careers" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api" },
    { label: "Whitepapers", href: "/investors" },
    { label: "Press Kit", href: "/press" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security", href: "/security" },
    { label: "Compliance", href: "/compliance" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-charcoal-dark text-white">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">T</span>
              </div>
              <span className="font-bold text-xl">Taurus AI</span>
            </Link>
            <p className="text-silver-dark mb-6 leading-relaxed">
              Enterprise-grade quantum-safe infrastructure for the financial services industry. 
              Leading the transition to post-quantum security.
            </p>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com/company/taurusai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/taurusai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@taurus.ai"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Products</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-silver-dark hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-silver-dark hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-silver-dark hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-silver-dark text-sm">
                  Cyber City, DLF Phase 2<br />
                  Gurugram, Haryana 122002
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+911234567890" className="text-silver-dark hover:text-white text-sm">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:contact@taurus.ai" className="text-silver-dark hover:text-white text-sm">
                  contact@taurus.ai
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-silver-dark text-sm">
              © {new Date().getFullYear()} Taurus AI Corp. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-silver-dark hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="border-t border-white/10 bg-charcoal-dark/50">
        <div className="container py-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-silver-dark">
            <span>🏆 RBI Harbinger Winner</span>
            <span>•</span>
            <span>🔒 NIST PQC Compliant</span>
            <span>•</span>
            <span>✓ SWIFT 2027 Ready</span>
            <span>•</span>
            <span>🌐 ISO 27001 Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
