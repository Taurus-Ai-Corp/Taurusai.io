import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Products", href: "/products", hasDropdown: true },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Insights", href: "/insights" },
  { label: "Investors", href: "/investors" },
  { label: "Press", href: "/press" },
];

const productItems = [
  { label: "BizFlow™", href: "/products/bizflow", description: "AI Workflow Automation", external: "https://cmgvdpkm.manus.space" },
  { label: "Q-Grid™", href: "/products/q-grid", description: "Quantum-Resistant Security", external: "https://q-grid.net" },
  { label: "AssetGrid™", href: "/products/assetgrid", description: "RWA Tokenization", external: "https://assetgrid.taurusai.io" },
  { label: "Neovibe™", href: "/products/neovibe", description: "Creative AI Platform", external: "https://neovibe.taurusai.io" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/images/Logo.naked.png" 
              alt="Taurus AI" 
              className="h-10 w-auto" style={{backgroundColor: '#0c1813', width: '45px', height: '45px'}}
            />
            <span className="font-bold text-xl text-foreground">Taurus AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.hasDropdown ? (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                        isActive(item.href)
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/products" className="flex flex-col items-start">
                        <span className="font-medium">All Products</span>
                        <span className="text-xs text-muted-foreground">View our complete platform</span>
                      </Link>
                    </DropdownMenuItem>
                    {productItems.map((product) => (
                      <DropdownMenuItem key={product.href} asChild>
                        <Link href={product.href} className="flex flex-col items-start">
                          <span className="font-medium">{product.label}</span>
                          <span className="text-xs text-muted-foreground">{product.description}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/search">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Search className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Contact Us
              </Button>
            </Link>
            <Link href="/demo">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Request Demo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-2">
            <Link href="/search">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Search className="w-5 h-5" />
              </Button>
            </Link>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive(item.href)
                            ? "text-primary bg-primary/10"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t pt-4 flex flex-col gap-3">
                    <Link href="/contact" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Contact Us
                      </Button>
                    </Link>
                    <Link href="/demo" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full">
                        Request Demo
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
