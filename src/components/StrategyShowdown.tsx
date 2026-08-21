import React, { useState } from 'react';
import { Layers, Sparkles, RefreshCw, Trophy, ShieldCheck, AlertTriangle, ArrowRight, Zap, CheckCircle2, XCircle } from 'lucide-react';

interface StrategyShowdownProps {
  onRunShowdown: (strategies: string[]) => Promise<any>;
}

const AVAILABLE_STRATEGIES = [
  'B2B AI Automation Agency (AAS)',
  'AI Faceless YouTube Channels',
  'Notion Templates & Digital Products',
  'TikTok Shop Affiliate Reviews',
  'E-commerce Dropshipping (Shopify)',
  'Print-on-Demand (Etsy / Printify)',
  'Freelance Technical Copywriting',
  'Micro-SaaS & AI Wrapper Web Apps',
];

const PRESET_SHOWDOWNS = [
  {
    title: 'AI Automation vs Faceless Channels',
    description: 'B2B Client Workflows vs Automated Social Media Content',
    strategies: ['B2B AI Automation Agency (AAS)', 'AI Faceless YouTube Channels'],
  },
  {
    title: 'Digital Products vs Print-on-Demand',
    description: 'Gumroad Notion Templates vs Physical Etsy Apparel',
    strategies: ['Notion Templates & Digital Products', 'Print-on-Demand (Etsy / Printify)'],
  },
  {
    title: 'Affiliate Marketing vs Dropshipping',
    description: 'TikTok Shop Affiliate vs Shopify E-commerce Store',
    strategies: ['TikTok Shop Affiliate Reviews', 'E-commerce Dropshipping (Shopify)'],
  },
];

export const StrategyShowdown: React.FC<StrategyShowdownProps> = ({ onRunShowdown }) => {
  const [selected, setSelected] = useState<string[]>([
    'B2B AI Automation Agency (AAS)',
    'AI Faceless YouTube Channels',
    'Notion Templates & Digital Products',
  ]);
  const [showdownResult, setShowdownResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleStrategy = (strategy: string) => {
    if (selected.includes(strategy)) {
      if (selected.length > 2) {
        setSelected(selected.filter((s) => s !== strategy));
      }
    } else {
      if (selected.length < 4) {
        setSelected([...selected, strategy]);
      }
    }
  };

  const handleExecuteShowdown = async (strategiesToUse = selected) => {
    setIsLoading(true);
    try {
      const data = await onRunShowdown(strategiesToUse);
      setShowdownResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (strategies: string[]) => {
    setSelected(strategies);
    handleExecuteShowdown(strategies);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Head-to-Head Strategy Showdown
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Select 2 to 4 online earning strategies to run a comparative reality check on audience success rates, capital requirements, and failure modes.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2 pt-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Quick Comparison Presets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {PRESET_SHOWDOWNS.map((preset, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleSelectPreset(preset.strategies)}
                className="text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 bg-slate-50/70 transition-all cursor-pointer space-y-1 group"
              >
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 flex items-center justify-between">
                  <span>{preset.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Multi-select chips */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Custom Selection ({selected.length}/4 selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_STRATEGIES.map((strat) => {
              const isChecked = selected.includes(strat);
              return (
                <button
                  key={strat}
                  type="button"
                  onClick={() => toggleStrategy(strat)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {strat}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleExecuteShowdown()}
          disabled={isLoading || selected.length < 2}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-70 text-white text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Comparing Community Consensus...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run Head-to-Head Showdown</span>
            </>
          )}
        </button>
      </div>

      {/* Showdown Results */}
      {showdownResult && (
        <div className="space-y-4">
          {/* Executive Overview Header */}
          <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Trophy className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-100">
                {showdownResult.comparisonHeadline || 'Community Reality Showdown Verdict'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {showdownResult.comparisonSummary}
            </p>
          </div>

          {/* Ranked Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {showdownResult.rankedStrategies?.map((item: any, idx: number) => {
              const isLeader = idx === 0;
              return (
                <div
                  key={item.name + idx}
                  className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between space-y-4 ${
                    isLeader ? 'border-indigo-300 ring-2 ring-indigo-500/20' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center ${
                          isLeader ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        #{item.rank || idx + 1}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        Score: {item.effectivenessScore}/100
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">
                      {item.name}
                    </h4>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Realistic Income:</span>
                        <span className="font-semibold text-slate-900">{item.averageRealisticMonthlyIncome}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Time to First Profit:</span>
                        <span className="font-semibold text-slate-900">{item.timeToFirstProfit}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Startup Capital:</span>
                        <span className="font-semibold text-slate-900">{item.startupCost}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Saturation:</span>
                        <span className="font-semibold text-slate-900">{item.saturationScore}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">Audience Sentiment:</span>
                        <span className="font-bold text-emerald-700">{item.communitySentiment}</span>
                      </div>
                    </div>

                    {/* Top Pros & Cons */}
                    {item.topPros && item.topPros.length > 0 && (
                      <div className="pt-2 space-y-1 text-xs text-emerald-800">
                        <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-700 block">
                          Key Strengths
                        </span>
                        {item.topPros.map((p: string, pIdx: number) => (
                          <div key={pIdx} className="flex items-start gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.topCons && item.topCons.length > 0 && (
                      <div className="pt-1 space-y-1 text-xs text-rose-800">
                        <span className="font-bold text-[11px] uppercase tracking-wider text-rose-700 block">
                          Major Caveats
                        </span>
                        {item.topCons.map((c: string, cIdx: number) => (
                          <div key={cIdx} className="flex items-start gap-1">
                            <XCircle className="w-3 h-3 text-rose-600 shrink-0 mt-0.5" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs space-y-2">
                    <p className="text-slate-700 font-medium">
                      <strong>Verdict:</strong> {item.verdict}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Takeaways */}
          {showdownResult.keyTakeaways && showdownResult.keyTakeaways.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Audience Consensus Takeaways
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {showdownResult.keyTakeaways.map((takeaway: string, tIdx: number) => (
                  <li key={tIdx} className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
