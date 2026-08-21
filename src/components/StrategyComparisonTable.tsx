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
} from 'lucide-react';

interface StrategyComparisonTableProps {
  report: ComparisonReport;
  onSelectStrategy?: (strategyName: string) => void;
}

export const StrategyComparisonTable: React.FC<StrategyComparisonTableProps> = ({
  report,
  onSelectStrategy,
}) => {
  const [sortKey, setSortKey] = useState<'sentiment' | 'difficulty' | 'name'>('sentiment');
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

  const toggleSort = (key: 'sentiment' | 'difficulty' | 'name') => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <section id="strategy-comparison-table-section" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Strategy Reality Matrix: Real Comment Sentiment vs Creator Hype
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Side-by-side benchmark of verified audience ROI, community approval, and capital requirements
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search matrix strategies..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
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
                className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Strategy & Business Model</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('sentiment')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Audience Sentiment</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Practical Success Rate</th>
              <th className="py-3 px-4">Startup Capital</th>
              <th className="py-3 px-4">Skill Level</th>
              <th className="py-3 px-4">Key Pros & Pitfalls</th>
              <th className="py-3 px-4">Final Verdict</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {sortedData.map((row, idx) => {
              const isHigh = row.communitySentimentScore >= 75;
              const isMed = row.communitySentimentScore >= 50 && row.communitySentimentScore < 75;
              const isExpanded = expandedRow === idx;

              return (
                <React.Fragment key={row.strategyName + idx}>
                  <tr
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isExpanded ? 'bg-slate-50/60' : ''
                    }`}
                  >
                    {/* Strategy Name */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        {isHigh ? (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : isMed ? (
                          <Info className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <span>{row.strategyName}</span>
                      </div>
                    </td>

                    {/* Sentiment Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${row.communitySentimentScore}%` }}
                            className={`h-full ${
                              isHigh
                                ? 'bg-emerald-500'
                                : isMed
                                ? 'bg-amber-400'
                                : 'bg-rose-500'
                            }`}
                          />
                        </div>
                        <span
                          className={`font-bold ${
                            isHigh
                              ? 'text-emerald-700'
                              : isMed
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {row.communitySentimentScore}%
                        </span>
                      </div>
                    </td>

                    {/* Practical Success Rate */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {row.practicalSuccessRate}
                    </td>

                    {/* Startup Cost */}
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {row.startupCost}
                    </td>

                    {/* Difficulty */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          row.difficulty === 'Beginner'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : row.difficulty === 'Intermediate'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {row.difficulty}
                      </span>
                    </td>

                    {/* Pros & Cons */}
                    <td className="py-3.5 px-4 max-w-xs space-y-0.5">
                      <div className="text-emerald-700 font-medium truncate text-xs" title={row.keyPros}>
                        + {row.keyPros}
                      </div>
                      <div className="text-rose-700 font-medium truncate text-xs" title={row.keyCons}>
                        - {row.keyCons}
                      </div>
                    </td>

                    {/* Verdict Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                          row.verdict.toLowerCase().includes('top') || row.verdict.toLowerCase().includes('verified')
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : row.verdict.toLowerCase().includes('viable') || row.verdict.toLowerCase().includes('moderate')
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {row.verdict}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setExpandedRow(isExpanded ? null : idx)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Expand details"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {onSelectStrategy && (
                          <button
                            type="button"
                            onClick={() => onSelectStrategy(row.strategyName)}
                            className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Audit Feed</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Detail Drawer */}
                  {isExpanded && (
                    <tr className="bg-slate-50/80 border-b border-slate-200">
                      <td colSpan={8} className="p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Key Verified Advantages (What actually worked in comments)
                            </span>
                            <p className="text-emerald-950 leading-relaxed font-medium">
                              {row.keyPros}
                            </p>
                          </div>

                          <div className="p-3 bg-rose-50/70 rounded-lg border border-rose-200 space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              Common Pitfalls & Hidden Roadblocks
                            </span>
                            <p className="text-rose-950 leading-relaxed font-medium">
                              {row.keyCons}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-xs text-slate-500 font-medium">
                          <span>
                            Startup Requirement: <strong className="text-slate-800">{row.startupCost}</strong> • Skill: <strong className="text-slate-800">{row.difficulty}</strong>
                          </span>
                          {onSelectStrategy && (
                            <button
                              type="button"
                              onClick={() => onSelectStrategy(row.strategyName)}
                              className="text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
                            >
                              Search recent YouTube video uploads for "{row.strategyName}" →
                            </button>
                          )}
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
