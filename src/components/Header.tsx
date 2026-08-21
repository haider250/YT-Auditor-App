import React from 'react';
import {
  Youtube,
  Search,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  SlidersHorizontal,
  Link as LinkIcon,
  BarChart3,
  Layers,
  FileDown,
  Bookmark,
  PlusCircle,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'feed' | 'comparator' | 'url_analyzer' | 'showdown';
  setActiveTab: (tab: 'feed' | 'comparator' | 'url_analyzer' | 'showdown') => void;
  onOpenExport: () => void;
  isSearching: boolean;
  savedCount?: number;
  onViewSaved?: () => void;
  hasReport?: boolean;
  onNewSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenExport,
  isSearching,
  savedCount = 0,
  onViewSaved,
  hasReport = false,
  onNewSearch,
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNewSearch}
              className="flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-8 h-8 bg-indigo-600 group-hover:bg-indigo-700 rounded-lg flex items-center justify-center text-white font-bold shadow-xs transition-colors">
                <span className="text-sm font-black">Y</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  YT Auditor <span className="text-slate-400 font-normal hidden sm:inline">| Online Earning Reality Engine</span>
                </h1>
              </div>
            </button>
          </div>

          {/* Right Status Badge & Navigation Tabs */}
          <div className="flex items-center gap-3">
            {/* Live Indicator Pill */}
            <div className="hidden lg:flex bg-slate-100 rounded-full px-3.5 py-1 items-center gap-2 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-medium text-slate-700">Live Search Grounding</span>
              <span className="text-xs font-semibold text-indigo-600">Dynamic Queries</span>
            </div>

            {/* Navigation Tabs */}
            <nav id="header-nav" className="flex items-center gap-1 sm:gap-1.5">
              {hasReport && (
                <button
                  id="tab-new-audit"
                  onClick={onNewSearch}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer mr-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Query</span>
                </button>
              )}

              <button
                id="tab-feed"
                onClick={() => setActiveTab('feed')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'feed'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Strategy</span> Feed
              </button>

              <button
                id="tab-comparator"
                onClick={() => setActiveTab('comparator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'comparator'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Matrix</span>
              </button>

              <button
                id="tab-url-analyzer"
                onClick={() => setActiveTab('url_analyzer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'url_analyzer'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Inspect URL</span>
              </button>

              <button
                id="tab-showdown"
                onClick={() => setActiveTab('showdown')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'showdown'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="hidden md:inline">Strategy</span> Showdown
              </button>

              {/* Saved Strategies Pill */}
              {savedCount > 0 && onViewSaved && (
                <button
                  type="button"
                  onClick={onViewSaved}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                  title="View Saved Strategies"
                >
                  <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  <span>{savedCount}</span>
                </button>
              )}

              {hasReport && (
                <>
                  <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

                  <button
                    id="btn-export-report"
                    onClick={onOpenExport}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
