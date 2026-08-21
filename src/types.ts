export interface CommentSnippet {
  author?: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'warning';
  comment: string;
  likes?: string;
  category: 'proof_of_success' | 'hidden_catch' | 'saturation_warning' | 'appreciation' | 'scam_alert';
}

export interface VideoAnalysis {
  id: string;
  title: string;
  channelName: string;
  channelUrl?: string;
  videoUrl: string;
  videoId?: string;
  thumbnailUrl?: string;
  publishedDate?: string;
  viewsEstimate?: string;
  
  // Strategy details
  strategyName: string;
  strategyCategory: 'Affiliate Marketing' | 'AI & Automation' | 'Content Creation' | 'Digital Products' | 'Freelancing & Services' | 'E-commerce & Dropshipping' | 'Micro-SaaS' | 'Trading/Crypto' | 'Other';
  claimedEarning: string;
  claimedTimeline: string;
  
  // True reality assessment
  realFeasibilityScore: number; // 0 - 100
  effectivenessRating: 'Highly Effective' | 'Moderately Effective' | 'Low Effectiveness' | 'High Risk / Misleading';
  sentimentBreakdown: {
    positivePercent: number;
    neutralPercent: number;
    negativePercent: number;
  };
  overallSentiment: 'Overwhelmingly Positive' | 'Cautiously Optimistic' | 'Mixed & Divided' | 'Largely Skeptical' | 'Scam / Red Flagged';
  
  // Analysis parameters
  startupCapitalNeeded: string; // e.g. "$0 - $50"
  timeToFirstDollar: string; // e.g. "2 - 4 weeks"
  saturationLevel: 'Low' | 'Medium' | 'High' | 'Extremely Saturated';
  skillPrerequisites: string[];
  hiddenCatches: string[];
  pros: string[];
  cons: string[];
  
  // Viewer comment insights
  representativeComments: CommentSnippet[];
  audienceVerdict: string;
  guruVsRealityComparison: {
    guruClaim: string;
    actualReality: string;
  };
  
  // Actionable tips
  actionableRoadmap: string[];
  isRecommended: boolean;
}

export interface ComparisonReport {
  summary: string;
  timeframe: string;
  searchQuery: string;
  totalAnalyzed: number;
  topRecommendedStrategy: {
    name: string;
    whyEffective: string;
    targetAudience: string;
  };
  biggestTrapStrategy: {
    name: string;
    whyMisleading: string;
    commonPitfall: string;
  };
  strategyComparisonTable: {
    strategyName: string;
    communitySentimentScore: number;
    practicalSuccessRate: string;
    startupCost: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    keyPros: string;
    keyCons: string;
    verdict: string;
  }[];
  videos: VideoAnalysis[];
  groundingSources?: { title: string; url: string }[];
}

export interface SearchFilterState {
  niche: string;
  timeframe: string;
  difficulty: string;
  budget: string;
}
