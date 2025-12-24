import { describe, it, expect } from 'vitest';
import { organizationSchema, productSchemas, breadcrumbSchema } from '../client/src/lib/structuredData';

describe('SEO Features', () => {
  it('should have valid Organization schema', () => {
    expect(organizationSchema['@context']).toBe('https://schema.org');
    expect(organizationSchema['@type']).toBe('Organization');
    expect(organizationSchema.name).toBe('Taurus AI Corp');
    expect(organizationSchema.url).toBe('https://taurusai.io');
    expect(organizationSchema.description).toContain('quantum-safe');
  });

  it('should have valid Product schemas', () => {
    expect(productSchemas.length).toBeGreaterThan(0);
    
    productSchemas.forEach(schema => {
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('SoftwareApplication');
      expect(schema.name).toBeTruthy();
      expect(schema.description).toBeTruthy();
      expect(schema.offers).toBeTruthy();
      expect(schema.offers.price).toBeTruthy();
      expect(schema.offers.priceCurrency).toBe('USD');
      expect(schema.aggregateRating).toBeTruthy();
      expect(schema.aggregateRating.ratingValue).toBeTruthy();
    });
  });

  it('should generate valid BreadcrumbList schema', () => {
    const breadcrumbs = breadcrumbSchema([
      { name: 'Home', url: 'https://taurusai.io' },
      { name: 'Products', url: 'https://taurusai.io/products' }
    ]);

    expect(breadcrumbs['@context']).toBe('https://schema.org');
    expect(breadcrumbs['@type']).toBe('BreadcrumbList');
    expect(breadcrumbs.itemListElement).toHaveLength(2);
    expect(breadcrumbs.itemListElement[0].position).toBe(1);
    expect(breadcrumbs.itemListElement[0].name).toBe('Home');
    expect(breadcrumbs.itemListElement[1].position).toBe(2);
    expect(breadcrumbs.itemListElement[1].name).toBe('Products');
  });

  it('should have product schemas with ratings above 4.5', () => {
    productSchemas.forEach(schema => {
      const rating = parseFloat(schema.aggregateRating.ratingValue);
      expect(rating).toBeGreaterThanOrEqual(4.5);
    });
  });

  it('should have product schemas with valid pricing', () => {
    productSchemas.forEach(schema => {
      const price = parseFloat(schema.offers.price);
      expect(price).toBeGreaterThan(0);
      expect(price).toBeLessThan(10000); // Reasonable enterprise pricing
    });
  });
});
