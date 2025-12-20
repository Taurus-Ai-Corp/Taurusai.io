/**
 * Lead Scoring System
 * Calculates priority scores for leads based on company size, industry, and consultation type
 * Higher scores indicate higher-value prospects that should be prioritized by sales team
 */

export interface LeadScoringInput {
  companySize?: string;
  industry?: string;
  consultationType?: string;
  productsInterested?: string[];
}

/**
 * Calculate lead score based on multiple factors
 * Score range: 0-100
 */
export function calculateLeadScore(input: LeadScoringInput): number {
  let score = 0;

  // Company Size Scoring (0-30 points)
  // Larger companies = higher potential contract value
  const companySizeScores: Record<string, number> = {
    "1-10": 5,
    "11-50": 10,
    "51-200": 15,
    "201-500": 20,
    "501-1000": 25,
    "1000+": 30,
  };
  
  if (input.companySize && companySizeScores[input.companySize]) {
    score += companySizeScores[input.companySize];
  }

  // Industry Scoring (0-25 points)
  // Industries with higher security/compliance needs = better fit
  const industryScores: Record<string, number> = {
    "Financial Services": 25,
    "Healthcare": 23,
    "Government": 22,
    "Technology": 20,
    "Retail": 18,
    "Manufacturing": 15,
    "Education": 12,
    "Other": 10,
  };
  
  if (input.industry && industryScores[input.industry]) {
    score += industryScores[input.industry];
  }

  // Consultation Type Scoring (0-25 points)
  // More specific/advanced consultations = higher intent
  const consultationTypeScores: Record<string, number> = {
    "Enterprise Implementation": 25,
    "Technical Deep Dive": 22,
    "Security Assessment": 20,
    "Product Demo": 15,
    "General Inquiry": 10,
  };
  
  if (input.consultationType && consultationTypeScores[input.consultationType]) {
    score += consultationTypeScores[input.consultationType];
  }

  // Products Interested Scoring (0-20 points)
  // Multiple products = broader interest, higher potential deal size
  if (input.productsInterested && input.productsInterested.length > 0) {
    const productScore = Math.min(input.productsInterested.length * 5, 20);
    score += productScore;
  }

  return Math.min(score, 100); // Cap at 100
}

/**
 * Get priority label based on score
 */
export function getLeadPriority(score: number): "Critical" | "High" | "Medium" | "Low" {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

/**
 * Get recommended action based on score
 */
export function getRecommendedAction(score: number): string {
  if (score >= 80) {
    return "Immediate follow-up required. Assign to senior sales representative.";
  }
  if (score >= 60) {
    return "Follow up within 24 hours. High potential for conversion.";
  }
  if (score >= 40) {
    return "Follow up within 48 hours. Good fit for standard sales process.";
  }
  return "Add to nurture campaign. Follow up within 1 week.";
}
