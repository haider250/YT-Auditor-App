import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Zap,
  Layers,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Search,
} from 'lucide-react';

interface LiveAuditHeroProps {
  onQuickSearch: (query: string, niche?: string) => void;
  isSearching: boolean;
}

const FEATURED_AUDITS = [
  {
    title: 'B2B AI Automation Agencies (AAA)',
    category: 'AI & Automation',
    query: 'B2B AI Automation Agency Client Acquisition 2026',
    description: 'Investigate if small businesses are actually paying $1,500 - $5,000 monthly retainers for Make/Zapier automations or if it is guru hype.',
    tag: 'High Interest',
    tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    title: 'Faceless YouTube Shorts & TikTok Channels',
    category: 'Content Creation',
    query: 'Faceless AI YouTube Shorts Monetization RPM Reality',
    description: 'Audit whether AI-generated history/facts channels actually pass YouTube Partner Program monetization or get flagged for reused content.',
    tag: 'High Risk / Saturation',
    tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    title: 'Gumroad Notion Templates & Digital Planners',
    category: 'Digital Products',
    query: 'Selling Notion Templates Gumroad Real Revenue',
    description: 'Verify real sales volume, customer acquisition channels (Pinterest vs Twitter), and true profit margins after Stripe/Gumroad fees.',
    tag: 'Beginner Viable',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    title: 'TikTok Shop Creator Affiliate',
    category: 'Affiliate Marketing',
    query: 'TikTok Shop Affiliate Sample Commission Earnings',
    description: 'Analyze audience reports on sample requests, shadowbans, conversion rates, and the 5,000 follower threshold requirements.',
    tag: 'Fast Payout',
    tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    title: 'Micro-SaaS & AI Wrapper Web Apps',
    category: 'Micro-SaaS',
    query: 'Building Micro SaaS with Claude 3.7 Cursor MRR',
    description: 'Check comment feedback on marketing solo software products, stripe churn rates, and LLM API cost management.',
    tag: 'High Margin',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    title: 'Print-on-Demand Apparel (Etsy / Printify)',
    category: 'Print on Demand & Etsy Stores',
    query: 'Print on Demand Etsy Real Profit Margin Ad Spend 2026',
    description: 'Uncover the hidden costs of Etsy listing fees, Printify shipping delays, customer returns, and Etsy search algorithm changes.',
    tag: 'Competitive',
    tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
];

export const LiveAuditHero: React.FC<LiveAuditHeroProps> = ({ onQuickSearch, isSearching }) => {
  return (
    <div className="space-y-8 py-4">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time YouTube Audience Comment Sentiment Engine</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Audit Any Online Earning Video Against <span className="text-indigo-600">Real Audience Truth</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Don't waste months on inflated guru promises. We search live YouTube uploads, cross-examine real viewer comments, calculate objective feasibility scores, and expose hidden roadblocks.
        </p>
      </div>

      {/* 3 Step Trust Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h3 className="text-sm font-bold text-slate-900">Live Web & YouTube Grounding</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Performs live searches across recent video uploads, transcripts, and channel releases matching your exact niche or custom keyword.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="text-sm font-bold text-slate-900">Viewer Comment Sentiment Audit</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Parses field reports, success stories, hidden catches, software API bills, and scam warnings left by real people who tested the strategy.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h3 className="text-sm font-bold text-slate-900">Feasibility Matrix & Execution Roadmap</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Calculates an unvarnished Feasibility % (0-100), contrasts guru claims with ground reality, and gives you a step-by-step legitimate blueprint.
          </p>
        </div>
      </div>

      {/* Featured Ready-to-Audit Topics */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Explore High-Demand Strategy Inquiries
            </h3>
            <p className="text-xs text-slate-500">
              Select any curated topic below to trigger a live YouTube audience investigation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED_AUDITS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.tagColor}`}>
                    {item.tag}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                disabled={isSearching}
                onClick={() => onQuickSearch(item.query, item.category)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <span>Launch Live Audit</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
