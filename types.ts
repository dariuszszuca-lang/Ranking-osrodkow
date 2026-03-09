export interface ReviewStats {
  rating: number;
  count: number;
}

export interface Center {
  id: string;
  rank: number;
  name: string;
  location: string;
  description: string;
  expertVerdict: string; // New field for LLM/SEO summary
  pros: string[]; // List of specific advantages
  features: string[];
  priceRange: string; 
  websiteUrl: string;
  isRecommended?: boolean;
  reviews: ReviewStats;
  tags: string[];
}