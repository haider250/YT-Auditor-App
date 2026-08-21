export interface CommentSnippet {
  author?: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'warning';
  comment: string;
  likes?: string;
  category: 'proof_of_success' | 'hidden_catch' | 'saturation_warning' | 'appreciation' | 'scam_alert';
  timestamp?: string;
  verifiedStudent?: boolean;
}

export type VerdictType = 
  | 'Genuine & Highly Viable'
  | 'Partially Viable (High Effort)'
  | 'Overhyped / Extreme Saturation'
  | 'Clickbait / Misleading Claims'
  | 'Predatory / Course Funnel Trap';

export interface RedFlagItem {
  flag: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
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
  
  // True reality assessment & Clickbait Forensic Index
  realFeasibilityScore: number; // 0 - 100
  clickbaitScore: number; // 0 - 100 (0 = 100% honest, 100 = pure sensationalism)
  verdict: VerdictType;
  effectivenessRating: 'Highly Effective' | 'Moderately Effective' | 'Low Effectiveness' | 'High Risk / Misleading';
  
  // Realistic financial projections vs Guru claims
  realMedianMonthlyIncome: string; // e.g. "$200 - $800/mo realistic"
  realTimeCommitment: string; // e.g. "15-20 hrs/week"
  estimatedViewerSuccessRate: string; // e.g. "12% of serious implementers"
  
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
  redFlags?: RedFlagItem[];
  pros: string[];
  cons: string[];
  
  // Viewer comment insights
  representativeComments: CommentSnippet[];
  audienceVerdict: string;
  guruVsRealityComparison: {
    guruClaim: string;
    actualReality: string;
  };
  
  // Actionable tips & alternative honest approach
  actionableRoadmap: string[];
  honestAlternativeRecommendation?: string;
  isRecommended: boolean;
}

export interface ComparisonReport {
  summary: string;
  timeframe: string;
  searchQuery: string;
  totalAnalyzed: number;
  marketRealityOverview?: {
    avgFeasibilityScore: number;
    avgClickbaitScore: number;
    legitStrategiesCount: number;
    trapStrategiesCount: number;
  };
  topRecommendedStrategy: {
    name: string;
    whyEffective: string;
    targetAudience: string;
    expectedOutcome: string;
  };
  biggestTrapStrategy: {
    name: string;
    whyMisleading: string;
    commonPitfall: string;
    hiddenCosts: string;
  };
  strategyComparisonTable: {
    strategyName: string;
    communitySentimentScore: number;
    feasibilityScore: number;
    clickbaitLevel: string;
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
