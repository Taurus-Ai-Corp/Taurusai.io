import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, FileText } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  subject: string;
  body: string;
}

interface TemplateBrowserProps {
  open: boolean;
  onClose: () => void;
  onSelect: (template: EmailTemplate) => void;
}

// Import templates from server (in real app, fetch via tRPC)
const templates: EmailTemplate[] = [
  {
    id: "welcome-series-1",
    category: "Welcome Series",
    name: "Welcome - Introduction",
    description: "First email in welcome series introducing your company and value proposition",
    subject: "Welcome to {{company}} - Let's Get Started!",
    body: "<p>Welcome email body...</p>",
  },
  {
    id: "product-announcement",
    category: "Product Updates",
    name: "Product Launch Announcement",
    description: "Announce new product features or launches to your audience",
    subject: "Introducing {{productName}} - The Future is Here",
    body: "<p>Product announcement body...</p>",
  },
  {
    id: "re-engagement",
    category: "Re-engagement",
    name: "We Miss You",
    description: "Win back inactive leads with a compelling re-engagement email",
    subject: "{{firstName}}, we'd love to have you back",
    body: "<p>Re-engagement body...</p>",
  },
  {
    id: "educational-content",
    category: "Educational",
    name: "Industry Insights",
    description: "Share valuable industry insights and establish thought leadership",
    subject: "The Future of {{industry}}: Key Trends for 2025",
    body: "<p>Educational content body...</p>",
  },
  {
    id: "case-study",
    category: "Social Proof",
    name: "Customer Success Story",
    description: "Showcase customer success stories to build credibility",
    subject: "How {{companyName}} Achieved 300% ROI in 6 Months",
    body: "<p>Case study body...</p>",
  },
  {
    id: "limited-offer",
    category: "Promotional",
    name: "Limited Time Offer",
    description: "Create urgency with time-sensitive promotional offers",
    subject: "⏰ Last Chance: 40% Off Ends Tonight!",
    body: "<p>Limited offer body...</p>",
  },
  {
    id: "feedback-request",
    category: "Engagement",
    name: "Feedback Request",
    description: "Gather valuable feedback from customers to improve your service",
    subject: "{{firstName}}, we'd love your feedback",
    body: "<p>Feedback request body...</p>",
  },
];

export default function TemplateBrowser({ open, onClose, onSelect }: TemplateBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email Template Library</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredTemplates.map(template => (
              <Card
                key={template.id}
                className="p-4 hover:border-primary cursor-pointer transition-colors"
                onClick={() => {
                  onSelect(template);
                  onClose();
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-sm">{template.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {template.description}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      Subject: {template.subject}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No templates found matching your search.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
