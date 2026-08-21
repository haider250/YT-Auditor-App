import React, { useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Users,
  Award,
  ExternalLink,
  Activity,
  Flame,
  Zap,
  Target,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  History,
  Cloud,
} from 'lucide-react';
import { ComparisonReport } from '../types';
import { FeasibilitySentimentChart } from './FeasibilitySentimentChart';
import { useAuth } from '../context/AuthContext';

interface ExecutiveSummaryProps {
  report: ComparisonReport;
  onFilterRecommended?: () => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  report,
  onFilterRecommended,
}) => {
  const { user, savedAudits } = useAuth();

  const avgFeasibility = report.marketRealityOverview?.avgFeasibilityScore || Math.round(
    report.videos.reduce((acc, v) => acc + v.realFeasibilityScore, 0) / (report.videos.length || 1)
  );

  const avgClickbait = report.marketRealityOverview?.avgClickbaitScore || Math.round(
    report.videos.reduce((acc, v) => acc + (v.clickbaitScore || 45), 0) / (report.videos.length || 1)
  );

  const recommendedCount = report.videos.filter((v) => v.realFeasibilityScore >= 70).length;
  const trapCount = report.videos.filter((v) => (v.clickbaitScore || 0) >= 65 || v.realFeasibilityScore <= 45).length;
  const partialCount = Math.max(0, report.videos.length - recommendedCount - trapCount);

  // Sentiment ratio aggregates with safe guards
  const totalPositivePct = Math.round(
    report.videos.reduce((acc, v) => acc + (v.sentimentBreakdown?.positivePercent || 0), 0) / (report.videos.length || 1)
  );
  const totalNegativePct = Math.round(
    report.videos.reduce((acc, v) => acc + (v.sentimentBreakdown?.negativePercent || 0), 0) / (report.videos.length || 1)
  );
  const totalNeutralPct = Math.max(0, 100 - totalPositivePct - totalNegativePct);

  // Firestore Saved Audits Sentiment Drift Tracker
  const currentQueryNorm = (report.searchQuery || '').toLowerCase().trim();

  const matchingAudits = useMemo(() => {
    if (!savedAudits || savedAudits.length === 0) return [];
    return savedAudits
      .filter((audit) => {
        const q = (audit.query || audit.niche || '').toLowerCase().trim();
        if (!q || !currentQueryNorm) return false;
        return (
          q === currentQueryNorm ||
          currentQueryNorm.includes(q) ||
          q.includes(currentQueryNorm)
        );
      })
      .sort((a, b) => {
        const tsA = a.savedAt ? new Date(a.savedAt).getTime() : 0;
        const tsB = b.savedAt ? new Date(b.savedAt).getTime() : 0;
        return tsB - tsA;
      });
  }, [savedAudits, currentQueryNorm]);

  const sentimentComparison = useMemo(() => {
    if (matchingAudits.length === 0) {
      return {
        hasPriorAudit: false,
        status: 'no_prior' as const,
        delta: null,
        prevScore: null,
        prevDate: null,
        auditCount: 0,
        message: user
          ? 'First audit recorded in Firestore for this niche. Baseline established.'
          : 'Sign in to compare against historical Firestore audits.',
      };
    }

    const prevAudit = matchingAudits[0];
    const prevVideos = prevAudit.report?.videos || [];
    const prevScore = prevVideos.length > 0
      ? Math.round(
          prevVideos.reduce((acc: number, v: any) => acc + (v.sentimentBreakdown?.positivePercent || 0), 0) /
          prevVideos.length
        )
      : 50;

    const delta = totalPositivePct - prevScore;
    let formattedDate = 'Prior Audit';
    if (prevAudit.savedAt) {
      try {
        const dateObj = new Date(prevAudit.savedAt);
        formattedDate = dateObj.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        });
      } catch {
        formattedDate = 'Prior Audit';
      }
    }

    if (delta >= 5) {
      return {
        hasPriorAudit: true,
        status: 'significantly_improved' as const,
        delta,
        prevScore,
        prevDate: formattedDate,
        auditCount: matchingAudits.length,
        message: `Audience sentiment surged by +${delta}% compared to ${formattedDate} saved audit (${prevScore}% → ${totalPositivePct}%).`,
      };
    } else if (delta <= -5) {
      return {
        hasPriorAudit: true,
        status: 'significantly_dropped' as const,
        delta,
        prevScore,
        prevDate: formattedDate,
        auditCount: matchingAudits.length,
        message: `Audience sentiment dropped by ${delta}% compared to ${formattedDate} saved audit (${prevScore}% → ${totalPositivePct}%). Skepticism is growing.`,
      };
    } else {
      return {
        hasPriorAudit: true,
        status: 'steady' as const,
        delta,
        prevScore,
        prevDate: formattedDate,
        auditCount: matchingAudits.length,
        message: `Audience sentiment remains steady (${delta >= 0 ? '+' : ''}${delta}% vs ${formattedDate} audit at ${prevScore}%).`,
      };
    }
  }, [matchingAudits, totalPositivePct, user]);

  return (
    <section id="executive-summary-section" className="space-y-4">
      {/* 4-Column Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Audited Uploads */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            <span>Audited Uploads</span>
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {report.videos.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              in {report.timeframe}
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Search grounded via Gemini 3.5
          </div>
        </div>

        {/* Metric 2: Average Viability Score */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            <span>Real Viability Score</span>
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-black ${
              avgFeasibility >= 70 ? 'text-emerald-600' : avgFeasibility >= 50 ? 'text-indigo-600' : 'text-rose-600'
            }`}>
              {avgFeasibility}%
            </span>
            <span className="text-xs font-semibold text-slate-500">Viability Index</span>
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Audience execution consensus
          </div>
        </div>

        {/* Metric 3: Clickbait Hype Index */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            <span>Clickbait & Hype Level</span>
            <Flame className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-black ${
              avgClickbait >= 60 ? 'text-rose-600' : avgClickbait >= 35 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {avgClickbait}%
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {avgClickbait >= 60 ? 'High Sensationalism' : 'Moderate Hype'}
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Exaggerated thumbnail/claims index
          </div>
        </div>

        {/* Metric 4: Verified vs Traps */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            <span>Genuine vs Trap Split</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              {recommendedCount}
            </span>
            <span className="text-xs font-bold text-slate-400">/</span>
            <span className="text-2xl sm:text-3xl font-black text-rose-500">
              {trapCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              (Legit / Traps)
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            {partialCount} partially viable models
          </div>
        </div>
      </div>

      {/* Synthesis & Executive Report Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Synthesis & Executive Report */}
        <div className="lg:col-span-2 bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Forensic Market Intelligence & Audience Verdict
                </h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {sentimentComparison.hasPriorAudit && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs ${
                    sentimentComparison.status === 'significantly_improved'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : sentimentComparison.status === 'significantly_dropped'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {sentimentComparison.status === 'significantly_improved' && <ArrowUpRight className="w-3 h-3 text-emerald-400 stroke-[2.5]" />}
                    {sentimentComparison.status === 'significantly_dropped' && <ArrowDownRight className="w-3 h-3 text-rose-400 stroke-[2.5]" />}
                    {sentimentComparison.status === 'steady' && <Activity className="w-3 h-3 text-indigo-400" />}
                    <span>
                      {sentimentComparison.status === 'significantly_improved' ? `+${sentimentComparison.delta}% Sentiment Surge` :
                       sentimentComparison.status === 'significantly_dropped' ? `${sentimentComparison.delta}% Sentiment Drop` :
                       `Sentiment Steady (${sentimentComparison.delta! >= 0 ? '+' : ''}${sentimentComparison.delta}%)`}
                    </span>
                  </span>
                )}
                <span className="text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2.5 py-0.5 rounded-full">
                  Gemini 3.5 Grounded Analysis
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {report.summary}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Query Focus:</span>
              <span className="text-xs font-bold text-indigo-300 bg-slate-800 px-2.5 py-1 rounded-md">
                {report.searchQuery}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-400">
              Timeframe: {report.timeframe}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Geometric Sentiment & Consensus Map */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Audience Sentiment Map</span>
              </h3>

              {/* Dynamic Firestore Week-over-Week Sentiment Drift Indicator */}
              {sentimentComparison.status === 'significantly_improved' && (
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs animate-pulse"
                  title={`Previous Firestore audit on ${sentimentComparison.prevDate} had ${sentimentComparison.prevScore}% positive sentiment`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  <span>+{sentimentComparison.delta}% vs. Prev Week Audit</span>
                </div>
              )}

              {sentimentComparison.status === 'significantly_dropped' && (
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs animate-pulse"
                  title={`Previous Firestore audit on ${sentimentComparison.prevDate} had ${sentimentComparison.prevScore}% positive sentiment`}
                >
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
                  <span>{sentimentComparison.delta}% Sentiment Drop</span>
                </div>
              )}

              {sentimentComparison.status === 'steady' && (
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200"
                  title={`Prior audit on ${sentimentComparison.prevDate}: ${sentimentComparison.prevScore}%`}
                >
                  <Activity className="w-3 h-3 text-indigo-500" />
                  <span>Steady ({sentimentComparison.delta! >= 0 ? '+' : ''}{sentimentComparison.delta}%)</span>
                </div>
              )}

              {sentimentComparison.status === 'no_prior' && (
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200"
                  title={user ? 'First recorded audit for this niche' : 'Sign in to track cloud history'}
                >
                  <Database className="w-3 h-3 text-slate-400" />
                  <span>Firestore Baseline</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-emerald-50/70 rounded-xl">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">{totalPositivePct}%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mt-0.5">Success Proof</div>
              </div>
              <div className="p-2 bg-rose-50/70 rounded-xl">
                <div className="text-2xl sm:text-3xl font-black text-rose-500">{totalNegativePct}%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-800 mt-0.5">Red Flags</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <div className="text-2xl sm:text-3xl font-black text-slate-500">{totalNeutralPct}%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">Neutral</div>
              </div>
            </div>

            {/* Geometric Multi-Segment Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 flex overflow-hidden">
              <div style={{ width: `${totalPositivePct}%` }} className="bg-emerald-500 h-full" title={`Positive ${totalPositivePct}%`}></div>
              <div style={{ width: `${totalNegativePct}%` }} className="bg-rose-400 h-full" title={`Negative ${totalNegativePct}%`}></div>
              <div style={{ width: `${totalNeutralPct}%` }} className="bg-slate-300 h-full" title={`Neutral ${totalNeutralPct}%`}></div>
            </div>
          </div>

          {/* Detailed Dynamic Indicator Context Callout */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
              sentimentComparison.status === 'significantly_improved'
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                : sentimentComparison.status === 'significantly_dropped'
                ? 'bg-rose-50/90 border-rose-200 text-rose-950'
                : sentimentComparison.status === 'steady'
                ? 'bg-indigo-50/60 border-indigo-100 text-indigo-950'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              {sentimentComparison.status === 'significantly_improved' && (
                <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {sentimentComparison.status === 'significantly_dropped' && (
                <TrendingDown className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              {sentimentComparison.status === 'steady' && (
                <Activity className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              )}
              {sentimentComparison.status === 'no_prior' && (
                <History className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              )}
              <div className="leading-snug">
                <span className="font-bold">
                  {sentimentComparison.status === 'significantly_improved' && 'Sentiment Surge: '}
                  {sentimentComparison.status === 'significantly_dropped' && 'Sentiment Alert: '}
                  {sentimentComparison.status === 'steady' && 'Week-over-Week Stable: '}
                  {sentimentComparison.status === 'no_prior' && 'Cloud Audit Baseline: '}
                </span>
                <span>{sentimentComparison.message}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* D3.js Feasibility vs Sentiment Correlation Line Chart */}
      <FeasibilitySentimentChart
        videos={report.videos}
        timeframe={report.timeframe}
      />

      {/* Top Winner vs Biggest Trap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Recommended Strategy */}
        <div className="p-4 sm:p-5 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                #1 Verified Effective Strategy
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                Verified Audience ROI
              </span>
            </div>

            <p className="text-base font-bold text-emerald-950 leading-snug">
              {report.topRecommendedStrategy.name}
            </p>

            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              {report.topRecommendedStrategy.whyEffective}
            </p>
          </div>

          <div className="pt-3 border-t border-emerald-200/80 space-y-1 text-xs text-emerald-950 font-medium">
            <div>
              <strong>Target Audience:</strong> {report.topRecommendedStrategy.targetAudience}
            </div>
            {report.topRecommendedStrategy.expectedOutcome && (
              <div>
                <strong>Expected Realistic Outcome:</strong> {report.topRecommendedStrategy.expectedOutcome}
              </div>
            )}
          </div>
        </div>

        {/* Biggest Trap / Overhyped Strategy */}
        <div className="p-4 sm:p-5 bg-rose-50/80 rounded-2xl border border-rose-200 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Biggest "Trap / Clickbait" Strategy
              </span>
              <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
                High Failure in Comments
              </span>
            </div>

            <p className="text-base font-bold text-rose-950 leading-snug">
              {report.biggestTrapStrategy.name}
            </p>

            <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
              {report.biggestTrapStrategy.whyMisleading}
            </p>
          </div>

          <div className="pt-3 border-t border-rose-200/80 space-y-1 text-xs text-rose-950 font-medium">
            <div>
              <strong>Common Pitfall:</strong> {report.biggestTrapStrategy.commonPitfall}
            </div>
            {report.biggestTrapStrategy.hiddenCosts && (
              <div>
                <strong>Hidden Costs:</strong> {report.biggestTrapStrategy.hiddenCosts}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
