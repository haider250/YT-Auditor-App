import React from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, CheckCircle2, XCircle, Users, Award, ExternalLink, Activity } from 'lucide-react';
import { ComparisonReport } from '../types';

interface ExecutiveSummaryProps {
  report: ComparisonReport;
  onFilterRecommended?: () => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  report,
  onFilterRecommended,
}) => {
  const avgFeasibility = Math.round(
    report.videos.reduce((acc, v) => acc + v.realFeasibilityScore, 0) / (report.videos.length || 1)
  );

  const recommendedCount = report.videos.filter((v) => v.isRecommended).length;
  const trapCount = report.videos.length - recommendedCount;

  // Sentiment ratio aggregates with safe guards
  const totalPositivePct = Math.round(
    report.videos.reduce((acc, v) => acc + (v.sentimentBreakdown?.positivePercent || 0), 0) / (report.videos.length || 1)
  );
  const totalNegativePct = Math.round(
    report.videos.reduce((acc, v) => acc + (v.sentimentBreakdown?.negativePercent || 0), 0) / (report.videos.length || 1)
  );
  const totalNeutralPct = Math.max(0, 100 - totalPositivePct - totalNegativePct);

  return (
    <section id="executive-summary-section" className="space-y-4">
      {/* 4-Column Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Audited Uploads
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {report.videos.length}
            </span>
            <span className="text-xs font-medium text-slate-500">
              in {report.timeframe}
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Searched across recent uploads
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Average Feasibility
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-bold ${
              avgFeasibility >= 70 ? 'text-emerald-600' : avgFeasibility >= 50 ? 'text-indigo-600' : 'text-rose-600'
            }`}>
              {avgFeasibility}%
            </span>
            <span className="text-xs font-medium text-slate-500">Success Index</span>
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            Audience comment consensus
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Truly Effective
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {recommendedCount}
            </span>
            <span className="text-xs font-medium text-slate-500">
              of {report.videos.length} verified
            </span>
          </div>
          <div className="mt-1 text-xs text-emerald-700 font-semibold">
            Positive viewer ROI reported
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Red Flag / Trap Ratio
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-rose-500">
              {trapCount}
            </span>
            <span className="text-xs font-medium text-slate-500">Overhyped</span>
          </div>
          <div className="mt-1 text-xs text-rose-600 font-semibold">
            High failure / hidden costs
          </div>
        </div>
      </div>

      {/* Sentiment Comparison & Executive Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Synthesis & Executive Report */}
        <div className="lg:col-span-2 bg-slate-900 text-white rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Audience Sentiment Intelligence & Executive Summary
                </h2>
              </div>
              <span className="text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
                Gemini Grounded Analysis
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {report.summary}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">Search Scope:</span>
              <span className="text-xs font-semibold text-indigo-300 bg-slate-800 px-2.5 py-1 rounded-md">
                {report.searchQuery}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-400">
              {report.timeframe}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Geometric Sentiment Stats */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Aggregate Sentiment Map
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-500">{totalPositivePct}%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Positive</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-rose-400">{totalNegativePct}%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Red Flags</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-400">{totalNeutralPct}%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Neutral</div>
              </div>
            </div>

            {/* Geometric Multi-Segment Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mt-4 flex overflow-hidden">
              <div style={{ width: `${totalPositivePct}%` }} className="bg-emerald-500 h-full"></div>
              <div style={{ width: `${totalNegativePct}%` }} className="bg-rose-400 h-full"></div>
              <div style={{ width: `${totalNeutralPct}%` }} className="bg-slate-300 h-full"></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500 font-medium">
              Calculated across all comment threads
            </span>
          </div>
        </div>
      </div>

      {/* Top Winner vs Biggest Trap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Recommended Strategy */}
        <div className="p-4 sm:p-5 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Top "Verified" Effective Strategy
              </span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Verified Audience ROI
              </span>
            </div>

            <p className="text-base font-bold text-emerald-900 mb-1.5 italic">
              "{report.topRecommendedStrategy.name}"
            </p>

            <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
              {report.topRecommendedStrategy.whyEffective}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900 font-semibold">
            <span>
              <strong>Target Audience:</strong> {report.topRecommendedStrategy.targetAudience}
            </span>
          </div>
        </div>

        {/* Biggest Trap / Overhyped Strategy */}
        <div className="p-4 sm:p-5 bg-rose-50 rounded-xl border border-rose-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Top "Red Flag" Strategy
              </span>
              <span className="text-[10px] font-semibold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                High Failure in Comments
              </span>
            </div>

            <p className="text-base font-bold text-rose-900 mb-1.5 italic">
              "{report.biggestTrapStrategy.name}"
            </p>

            <p className="text-xs sm:text-sm text-rose-800 leading-relaxed">
              {report.biggestTrapStrategy.whyMisleading}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-200/80 flex items-center justify-between text-xs text-rose-900 font-semibold">
            <span>
              <strong>Common Pitfall:</strong> {report.biggestTrapStrategy.commonPitfall}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
