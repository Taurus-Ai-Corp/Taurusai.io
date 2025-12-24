import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Hook to set canonical URL for the current page
 * Helps prevent duplicate content issues and consolidate SEO authority
 */
export function useCanonicalUrl(path?: string) {
  const [location] = useLocation();
  const canonicalPath = path || location;
  
  useEffect(() => {
    const baseUrl = 'https://taurusai.io';
    const canonicalUrl = `${baseUrl}${canonicalPath}`;
    
    // Remove existing canonical link if present
    const existing = document.querySelector('link[rel="canonical"]');
    if (existing) {
      existing.remove();
    }
    
    // Add new canonical link
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = canonicalUrl;
    document.head.appendChild(link);
    
    // Cleanup on unmount
    return () => {
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.remove();
      }
    };
  }, [canonicalPath]);
}
