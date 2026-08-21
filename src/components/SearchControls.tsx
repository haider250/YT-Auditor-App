import React from 'react';
import {
  Search,
  Sparkles,
  Filter,
  Calendar,
  DollarSign,
  Gauge,
  RefreshCw,
  X,
  History,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { VoiceTranscriber } from './VoiceTranscriber';

interface SearchControlsProps {
  niche: string;
  setNiche: (niche: string) => void;
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  budget: string;
  setBudget: (budget: string) => void;
  customKeywords: string;
  setCustomKeywords: (kw: string) => void;
  onSearch: (overrideQuery?: string) => void;
  isSearching: boolean;
  recentSearches?: string[];
  onSelectRecent?: (query: string) => void;
  onClearRecent?: () => void;
  compact?: boolean;
}

const NICHES = [
  'All Online Earning Strategies',
  'AI Automation & B2B Workflows',
  'Faceless YouTube & Shorts Channels',
  'Digital Products, Notion & Gumroad',
  'TikTok Shop & Creator Affiliate',
  'Freelancing & High-Income Tech Skills',
  'Print on Demand & Etsy Stores',
  'E-commerce & Dropshipping',
  'Micro-SaaS & AI Wrapper Web Apps',
  'Substack & Paid Newsletters',
];

const TRENDING_QUERIES = [
  { label: 'AI Automation Agency (AAA)', category: 'AI & Automation' },
  { label: 'Faceless YouTube Shorts Monetization', category: 'Content Creation' },
  { label: 'Notion Templates on Gumroad', category: 'Digital Products' },
  { label: 'TikTok Shop Affiliate in 2026', category: 'Affiliate' },
  { label: 'Etsy Print on Demand Real Profit', category: 'E-commerce' },
  { label: 'Cursor & Claude Micro-SaaS', category: 'Tech/Code' },
  { label: 'Upwork AI Prompt Engineering', category: 'Freelancing' },
];

export const SearchControls: React.FC<SearchControlsProps> = ({
  niche,
  setNiche,
  timeframe,
  setTimeframe,
  difficulty,
  setDifficulty,
  budget,
  setBudget,
  customKeywords,
  setCustomKeywords,
  onSearch,
  isSearching,
  recentSearches = [],
  onSelectRecent,
  onClearRecent,
  compact = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleSelectPreset = (query: string) => {
    setCustomKeywords(query);
    onSearch(query);
  };

  const handleVoiceTranscription = (spokenText: string) => {
    setCustomKeywords(spokenText);
    onSearch(spokenText);
  };

  return (
    <section
      id="search-controls-section"
      className={`bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 transition-all ${
        compact ? 'p-4 sm:p-5' : 'p-5 sm:p-7'
      }`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Search Input */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="search-input-keywords"
              type="text"
              value={customKeywords}
              onChange={(e) => setCustomKeywords(e.target.value)}
              placeholder="Search any earning strategy, video topic, or creator (e.g. 'Faceless AI Shorts', 'Etsy digital products')..."
              className="w-full pl-11 pr-24 py-3.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
            />
            
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {customKeywords && (
                <button
                  type="button"
                  onClick={() => setCustomKeywords('')}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/60 cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <VoiceTranscriber
                onTranscriptionComplete={handleVoiceTranscription}
                disabled={isSearching}
              />
            </div>
          </div>

          <button
            id="btn-run-live-search"
            type="submit"
            disabled={isSearching}
            className="flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-70 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            {isSearching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing Live YouTube Discourse...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Audit YouTube Comments</span>
              </>
            )}
          </button>
        </div>

        {/* Filter Selectors Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Niche selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Category / Focus
            </label>
            <select
              id="select-niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {NICHES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Upload Window
            </label>
            <select
              id="select-timeframe"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Previous 1 month">Previous 1 Month (Past 30 Days)</option>
              <option value="Previous 2 weeks">Previous 2 Weeks (Past 14 Days)</option>
              <option value="Previous 7 days">Previous 7 Days (Fresh uploads)</option>
              <option value="Previous 3 months">Previous 3 Months (Quarterly trends)</option>
            </select>
          </div>

          {/* Difficulty selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              Skill Barrier
            </label>
            <select
              id="select-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All Levels">All Levels</option>
              <option value="Beginner Friendly">Beginner Friendly ($0-low skill)</option>
              <option value="Intermediate">Intermediate (Logic / Outreach)</option>
              <option value="Advanced">Advanced (Coding / High-ticket)</option>
            </select>
          </div>

          {/* Budget selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              Initial Capital
            </label>
            <select
              id="select-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All Budgets">All Budgets</option>
              <option value="$0 Free Start">$0 (Zero Initial Investment)</option>
              <option value="Under $50">Under $50 (Basic software/domain)</option>
              <option value="$100 - $300">$100 - $300 (Samples/Ads/Tools)</option>
              <option value="$500+">$500+ (Inventory / Paid Traffic)</option>
            </select>
          </div>
        </div>
      </form>

      {/* Trending / Preset Quick Search Chips */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Trending Strategy Inquiries:
          </span>
          <span className="text-[11px] text-slate-400">Click to audit live</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {TRENDING_QUERIES.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleSelectPreset(preset.label)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-indigo-200"
            >
              <span>{preset.label}</span>
              <span className="text-[10px] text-slate-400 font-normal">({preset.category})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Searches history if any */}
      {recentSearches.length > 0 && onSelectRecent && (
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-slate-400" />
              Recent Searches:
            </span>
            {recentSearches.slice(0, 4).map((query, qIdx) => (
              <button
                key={qIdx}
                type="button"
                onClick={() => onSelectRecent(query)}
                className="px-2 py-0.5 text-xs text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 cursor-pointer"
              >
                {query}
              </button>
            ))}
          </div>
          {onClearRecent && (
            <button
              type="button"
              onClick={onClearRecent}
              className="text-[11px] text-slate-400 hover:text-rose-600 underline cursor-pointer shrink-0"
            >
              Clear History
            </button>
          )}
        </div>
      )}
    </section>
  );
};
