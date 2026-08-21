import React, { useState } from 'react';
import { ComparisonReport } from '../types';
import {
  ArrowUpDown,
  ShieldCheck,
  AlertTriangle,
  Info,
  Sparkles,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Flame,
  Zap,
} from 'lucide-react';

interface StrategyComparisonTableProps {
  report: ComparisonReport;
  onSelectStrategy?: (strategyName: string) => void;
}

export const StrategyComparisonTable: React.FC<StrategyComparisonTableProps> = ({
  report,
  onSelectStrategy,
}) => {
  const [sortKey, setSortKey] = useState<'sentiment' | 'feasibility' | 'name'>('feasibility');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const tableData = [...(report.strategyComparisonTable || [])];

  const sortedData = tableData
    .filter((row) =>
      row.strategyName.toLowerCase().includes(filterText.toLowerCase()) ||
      row.verdict.toLowerCase().includes(filterText.toLowerCase()) ||
      row.difficulty.toLowerCase().includes(filterText.toLowerCase()) ||
      (row.keyPros && row.keyPros.toLowerCase().includes(filterText.toLowerCase())) ||
      (row.keyCons && row.keyCons.toLowerCase().includes(filterText.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortKey === 'feasibility') {
        const aScore = a.feasibilityScore ?? a.communitySentimentScore;
        const bScore = b.feasibilityScore ?? b.communitySentimentScore;
        return sortAsc ? aScore - bScore : bScore - aScore;
      }
      if (sortKey === 'sentiment') {
        return sortAsc
          ? a.communitySentimentScore - b.communitySentimentScore
          : b.communitySentimentScore - a.communitySentimentScore;
      }
      if (sortKey === 'name') {
        return sortAsc
          ? a.strategyName.localeCompare(b.strategyName)
          : b.strategyName.localeCompare(a.strategyName);
      }
      return 0;
    });

  const toggleSort = (key: 'sentiment' | 'feasibility' | 'name') => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <section id="strategy-comparison-table-section" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Strategy Reality Matrix: Real Comment Sentiment vs Creator Hype
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Side-by-side benchmark of verified audience ROI, community approval, clickbait levels, and startup capital
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter matrix strategies..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-full sm:w-60"
          />
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <th
                onClick={() => toggleSort('name')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Strategy Model</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('feasibility')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Viability Score</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Clickbait / Hype</th>
              <th className="py-3.5 px-4">Practical Success Rate</th>
              <th className="py-3.5 px-4">Startup Capital</th>
              <th className="py-3.5 px-4">Skill Level</th>
              <th className="py-3.5 px-4">Verdict</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {sortedData.map((row, idx) => {
              const viability = row.feasibilityScore ?? row.communitySentimentScore;
              const isHigh = viability >= 70;
              const isMed = viability >= 45 && viability < 70;
              const isExpanded = expandedRow === idx;

              return (
                <React.Fragment key={row.strategyName + idx}>
                  <tr
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isExpanded ? 'bg-slate-50/60' : ''
                    }`}
                  >
                    {/* Strategy Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        {isHigh ? (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : isMed ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <span>{row.strategyName}</span>
                      </div>
                    </td>

                    {/* Viability Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isHigh ? 'text-emerald-600' : isMed ? 'text-amber-600' : 'text-rose-600'}`}>
                          {viability}%
                        </span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            style={{ width: `${viability}%` }}
                            className={`h-full ${isHigh ? 'bg-emerald-500' : isMed ? 'bg-amber-500' : 'bg-rose-500'}`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Clickbait Hype Level */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.clickbaitLevel?.includes('High') || row.clickbaitLevel?.includes('Sensational')
                          ? 'bg-rose-100 text-rose-800'
                          : row.clickbaitLevel?.includes('Moderate')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        <Flame className="w-3 h-3" />
                        {row.clickbaitLevel || 'Moderate'}
                      </span>
                    </td>

                    {/* Practical Success Rate */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {row.practicalSuccessRate}
                    </td>

                    {/* Startup Capital */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {row.startupCost}
                    </td>

                    {/* Skill Level */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                        {row.difficulty}
                      </span>
                    </td>

                    {/* Verdict */}
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-bold ${
                        isHigh ? 'text-emerald-700' : isMed ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {row.verdict}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedRow(isExpanded ? null : idx)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                          title="Toggle Details"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {onSelectStrategy && (
                          <button
                            type="button"
                            onClick={() => onSelectStrategy(row.strategyName)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Filter Feed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row: Pros & Cons */}
                  {isExpanded && (
                    <tr className="bg-slate-50/70 border-b border-slate-100">
                      <td colSpan={8} className="py-3 px-6 text-xs text-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-white border border-emerald-100 rounded-xl">
                            <strong className="text-emerald-700 font-bold block mb-1">
                              ✓ Verified Pros & Advantages:
                            </strong>
                            <p className="text-slate-700">{row.keyPros}</p>
                          </div>
                          <div className="p-3 bg-white border border-rose-100 rounded-xl">
                            <strong className="text-rose-700 font-bold block mb-1">
                              ✗ Pitfalls & Hidden Traps:
                            </strong>
                            <p className="text-slate-700">{row.keyCons}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
