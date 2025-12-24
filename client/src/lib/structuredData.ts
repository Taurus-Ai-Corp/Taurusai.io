// Structured Data (JSON-LD) utilities for SEO

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Taurus AI Corp",
  "url": "https://taurusai.io",
  "logo": "https://taurusai.io/logo.png",
  "description": "Enterprise-grade quantum-safe AI infrastructure for financial services and enterprise automation",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "Global"
  },
  "sameAs": [
    "https://linkedin.com/company/taurus-ai",
    "https://twitter.com/taurusai"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Sales",
    "email": "contact@taurusai.io"
  }
};

export const productSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "BizFlow AI",
    "applicationCategory": "BusinessApplication",
    "description": "Conversational commerce platform with AI-powered automation workflows for retail and e-commerce",
    "offers": {
      "@type": "Offer",
      "price": "999",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "999",
        "priceCurrency": "USD",
        "unitText": "MONTH"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    },
    "operatingSystem": "Cloud-based",
    "provider": {
      "@type": "Organization",
      "name": "Taurus AI Corp"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AgriSmart AI",
    "applicationCategory": "BusinessApplication",
    "description": "Agricultural technology platform leveraging AI for crop optimization, precision farming, and sustainable agriculture",
    "offers": {
      "@type": "Offer",
      "price": "1499",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "1499",
        "priceCurrency": "USD",
        "unitText": "MONTH"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "ratingCount": "89"
    },
    "operatingSystem": "Cloud-based",
    "provider": {
      "@type": "Organization",
      "name": "Taurus AI Corp"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "EduSync AI",
    "applicationCategory": "EducationalApplication",
    "description": "Integrated educational management system with AI-powered learning analytics and student engagement tools",
    "offers": {
      "@type": "Offer",
      "price": "799",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "799",
        "priceCurrency": "USD",
        "unitText": "MONTH"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "156"
    },
    "operatingSystem": "Cloud-based",
    "provider": {
      "@type": "Organization",
      "name": "Taurus AI Corp"
    }
  }
];

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const injectStructuredData = (schema: object) => {
  if (typeof window === 'undefined') return;
  
  const scriptId = 'structured-data-' + JSON.stringify(schema).substring(0, 20);
  
  // Remove existing script if present
  const existing = document.getElementById(scriptId);
  if (existing) {
    existing.remove();
  }
  
  const script = document.createElement('script');
  script.id = scriptId;
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
};
