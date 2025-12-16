import { useState } from "react";
import { CheckCircle2, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  name: string;
  category: string;
  bizflow: boolean | "partial";
  qgrid: boolean | "partial";
  assetgrid: boolean | "partial";
  neovibe: boolean | "partial";
}

const features: Feature[] = [
  // Security Features
  { name: "Quantum-Resistant Encryption", category: "Security", bizflow: true, qgrid: true, assetgrid: true, neovibe: true },
  { name: "NIST PQC Compliant", category: "Security", bizflow: true, qgrid: true, assetgrid: true, neovibe: "partial" },
  { name: "Zero-Trust Architecture", category: "Security", bizflow: true, qgrid: true, assetgrid: true, neovibe: true },
  { name: "End-to-End Encryption", category: "Security", bizflow: true, qgrid: true, assetgrid: true, neovibe: true },
  
  // AI & Automation
  { name: "AI-Powered Workflows", category: "AI & Automation", bizflow: true, qgrid: "partial", assetgrid: true, neovibe: true },
  { name: "Natural Language Processing", category: "AI & Automation", bizflow: true, qgrid: false, assetgrid: "partial", neovibe: true },
  { name: "Predictive Analytics", category: "AI & Automation", bizflow: true, qgrid: true, assetgrid: true, neovibe: "partial" },
  { name: "Automated Compliance", category: "AI & Automation", bizflow: true, qgrid: true, assetgrid: true, neovibe: false },
  
  // Integration
  { name: "Blockchain Integration", category: "Integration", bizflow: "partial", qgrid: true, assetgrid: true, neovibe: false },
  { name: "Hedera Hashgraph", category: "Integration", bizflow: false, qgrid: true, assetgrid: true, neovibe: false },
  { name: "REST API Access", category: "Integration", bizflow: true, qgrid: true, assetgrid: true, neovibe: true },
  { name: "Webhook Support", category: "Integration", bizflow: true, qgrid: true, assetgrid: true, neovibe: true },
  
  // Enterprise
  { name: "Enterprise SSO", category: "Enterprise", bizflow: true, qgrid: true, assetgrid: true, neovibe: true },
  { name: "Role-Based Access", category: "Enterprise", bizflow: true, qgrid: true, assetgrid: true, neovibe: true },
  { name: "Audit Logging", category: "Enterprise", bizflow: true, qgrid: true, assetgrid: true, neovibe: "partial" },
  { name: "99.9% SLA", category: "Enterprise", bizflow: true, qgrid: true, assetgrid: true, neovibe: true },
];

const products = [
  { key: "bizflow", name: "BizFlow™", color: "from-cyan to-purple" },
  { key: "qgrid", name: "Q-Grid™", color: "from-quantum to-cyan" },
  { key: "assetgrid", name: "AssetGrid™", color: "from-success to-cyan" },
  { key: "neovibe", name: "Neovibe™", color: "from-warning to-quantum" },
];

function FeatureIcon({ value }: { value: boolean | "partial" }) {
  if (value === true) {
    return <CheckCircle2 className="w-5 h-5 text-success" />;
  }
  if (value === "partial") {
    return <Minus className="w-5 h-5 text-warning" />;
  }
  return <X className="w-5 h-5 text-muted-foreground/30" />;
}

export default function ProductComparisonTable() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(features.map(f => f.category)));
  const filteredFeatures = selectedCategory 
    ? features.filter(f => f.category === selectedCategory)
    : features;

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            selectedCategory === null
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          All Features
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-card">
              <th className="text-left p-4 text-foreground font-semibold border-b border-border min-w-[200px]">
                Feature
              </th>
              {products.map(product => (
                <th
                  key={product.key}
                  onMouseEnter={() => setHoveredCol(product.key)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={cn(
                    "text-center p-4 font-semibold border-b border-border min-w-[120px] transition-all duration-300",
                    hoveredCol === product.key && "bg-primary/10"
                  )}
                >
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r text-white text-sm",
                    product.color
                  )}>
                    {product.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredFeatures.map((feature, index) => (
              <tr
                key={feature.name}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                className={cn(
                  "border-b border-border transition-all duration-300",
                  hoveredRow === index && "bg-primary/5",
                  index % 2 === 0 ? "bg-background" : "bg-card/50"
                )}
              >
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className={cn(
                      "text-foreground font-medium transition-all",
                      hoveredRow === index && "text-primary"
                    )}>
                      {feature.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{feature.category}</span>
                  </div>
                </td>
                {products.map(product => (
                  <td
                    key={product.key}
                    className={cn(
                      "text-center p-4 transition-all duration-300",
                      hoveredCol === product.key && "bg-primary/10",
                      hoveredRow === index && hoveredCol === product.key && "bg-primary/20 scale-110"
                    )}
                  >
                    <div className={cn(
                      "flex justify-center transition-transform duration-300",
                      hoveredRow === index && "scale-125"
                    )}>
                      <FeatureIcon value={feature[product.key as keyof Feature] as boolean | "partial"} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span>Full Support</span>
        </div>
        <div className="flex items-center gap-2">
          <Minus className="w-4 h-4 text-warning" />
          <span>Partial Support</span>
        </div>
        <div className="flex items-center gap-2">
          <X className="w-4 h-4 text-muted-foreground/30" />
          <span>Not Available</span>
        </div>
      </div>
    </div>
  );
}
