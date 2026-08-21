import React, { useState } from 'react';
import { VideoAnalysis, CommentSnippet } from '../types';
import { SentimentBar } from './SentimentBar';
import {
  ExternalLink,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingDown,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Calendar,
  Eye,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface VideoCardProps {
  video: VideoAnalysis;
  rankIndex: number;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  rankIndex,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'comments' | 'truth' | 'roadmap'>('comments');
  const [commentFilter, setCommentFilter] = useState<'all' | 'proof_of_success' | 'hidden_catch' | 'saturation_warning' | 'scam_alert'>('all');
  const [copiedRoadmap, setCopiedRoadmap] = useState(false);

  const isHighlyRecommended = video.realFeasibilityScore >= 75;
  const isModerate = video.realFeasibilityScore >= 50 && video.realFeasibilityScore < 75;

  const handleCopyRoadmap = () => {
    if (!video.actionableRoadmap || video.actionableRoadmap.length === 0) return;
    const text = `Roadmap for "${video.strategyName}" (${video.title}):\n` +
      video.actionableRoadmap.map((step, i) => `${i + 1}. ${step}`).join('\n') +
      `\n\nAnalyzed via YT Auditor | Audience Feasibility: ${video.realFeasibilityScore}%`;
    navigator.clipboard.writeText(text);
    setCopiedRoadmap(true);
    setTimeout(() => setCopiedRoadmap(false), 2000);
  };

  const getCommentBadge = (category: CommentSnippet['category']) => {
    switch (category) {
      case 'proof_of_success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Proof of Success
          </span>
        );
      case 'hidden_catch':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3" /> Hidden Catch
          </span>
        );
      case 'saturation_warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            <TrendingDown className="w-3 h-3" /> Saturation Warning
          </span>
        );
      case 'scam_alert':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3" /> Red Flag / Trap
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <HelpCircle className="w-3 h-3" /> Viewer Feedback
          </span>
        );
    }
  };

  const filteredComments = (video.representativeComments || []).filter((cmt) => {
    if (commentFilter === 'all') return true;
    return cmt.category === commentFilter;
  });

  return (
    <article
      id={`video-card-${video.id}`}
      className={`bg-white rounded-xl border transition-all duration-200 shadow-xs hover:shadow-sm ${
        isHighlyRecommended
          ? 'border-slate-200 hover:border-emerald-300'
          : isModerate
          ? 'border-slate-200 hover:border-amber-300'
          : 'border-slate-200 hover:border-rose-300'
      }`}
    >
      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
              #{rankIndex + 1} • {video.strategyCategory}
            </span>
            {video.publishedDate && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                <Calendar className="w-3 h-3 text-slate-400" />
                {video.publishedDate}
              </span>
            )}
            {video.viewsEstimate && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium hidden sm:inline-flex">
                <Eye className="w-3 h-3" />
                {video.viewsEstimate}
              </span>
            )}
          </div>

          {/* Feasibility Score Badge & Bookmark Toggle */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                isHighlyRecommended
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : isModerate
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {isHighlyRecommended ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : isModerate ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
              )}
              <span>{video.realFeasibilityScore}% Feasibility</span>
            </div>

            {onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark(video.id)}
                title={isBookmarked ? 'Remove from Saved' : 'Save Strategy'}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-50 border-amber-300 text-amber-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-200'
                }`}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Video Title & Channel Header */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors inline-flex items-center gap-1.5"
            >
              <span>{video.title}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 inline shrink-0" />
            </a>
          </h3>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span>Creator: <strong className="text-slate-700">{video.channelName}</strong></span>
            {video.videoUrl && (
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline text-xs font-semibold inline-flex items-center gap-1"
              >
                <span>Watch on YouTube</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Claimed vs Real Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">Guru Claim</span>
            <span className="font-bold text-slate-900 text-sm">
              {video.claimedEarning}
            </span>
            <span className="text-slate-400 text-xs block">in {video.claimedTimeline}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">Real Time to $1</span>
            <span className="font-bold text-slate-800 text-sm">
              {video.timeToFirstDollar}
            </span>
            <span className="text-slate-400 text-xs block">with effort</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">Startup Capital</span>
            <span className="font-bold text-slate-800 text-sm">
              {video.startupCapitalNeeded}
            </span>
            <span className="text-slate-400 text-xs block">software / ads</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">Market Saturation</span>
            <span className={`font-bold text-sm ${
              video.saturationLevel === 'Low'
                ? 'text-emerald-700'
                : video.saturationLevel === 'Medium'
                ? 'text-amber-700'
                : 'text-rose-700'
            }`}>
              {video.saturationLevel}
            </span>
            <span className="text-slate-400 text-xs block">barrier to entry</span>
          </div>
        </div>

        {/* Sentiment Analysis Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              Audience Sentiment Consensus ({video.overallSentiment})
            </span>
            <span className="text-slate-500 font-normal text-xs">
              Analyzed from viewer comments
            </span>
          </div>
          <SentimentBar
            positive={video.sentimentBreakdown?.positivePercent ?? 60}
            neutral={video.sentimentBreakdown?.neutralPercent ?? 25}
            negative={video.sentimentBreakdown?.negativePercent ?? 15}
          />
        </div>

        {/* Audience Verdict Synthesis */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong className="text-slate-900 font-semibold">Audience Consensus: </strong>
          {video.audienceVerdict}
        </div>

        {/* Tabs for Detailed Inspection */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('comments');
                  setIsExpanded(true);
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'comments' && isExpanded
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Viewer Comments ({video.representativeComments?.length || 0})
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('truth');
                  setIsExpanded(true);
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'truth' && isExpanded
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Guru Claim vs Reality
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('roadmap');
                  setIsExpanded(true);
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'roadmap' && isExpanded
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Execution Roadmap
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>{isExpanded ? 'Collapse' : 'Inspect'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expanded Tab Content */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
              {/* Tab 1: Representative Viewer Comments with category filtering */}
              {activeTab === 'comments' && (
                <div className="space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Audience Feedback & Field Reports
                    </div>
                    {/* Comment category filter pills */}
                    <div className="flex items-center gap-1 flex-wrap text-xs">
                      {(['all', 'proof_of_success', 'hidden_catch', 'saturation_warning', 'scam_alert'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCommentFilter(cat)}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                            commentFilter === cat
                              ? 'bg-slate-900 text-white font-semibold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat === 'all'
                            ? 'All'
                            : cat === 'proof_of_success'
                            ? 'Success Proof'
                            : cat === 'hidden_catch'
                            ? 'Hidden Catches'
                            : cat === 'saturation_warning'
                            ? 'Saturation'
                            : 'Scam Alerts'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredComments.length > 0 ? (
                    <div className="space-y-2">
                      {filteredComments.map((cmt, cIdx) => (
                        <div
                          key={cIdx}
                          className={`p-3 rounded-lg border text-xs sm:text-sm space-y-1.5 ${
                            cmt.sentiment === 'positive'
                              ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                              : cmt.sentiment === 'negative'
                              ? 'bg-rose-50/50 border-rose-200 text-rose-950'
                              : 'bg-amber-50/50 border-amber-200 text-amber-950'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">
                                @{cmt.author || 'Viewer'}
                              </span>
                              {getCommentBadge(cmt.category)}
                            </div>
                            {cmt.likes && (
                              <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                <ThumbsUp className="w-3 h-3" /> {cmt.likes}
                              </span>
                            )}
                          </div>
                          <p className="leading-relaxed text-slate-700 italic">
                            "{cmt.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 p-2 text-center bg-slate-50 rounded-lg">
                      No comments matching "{commentFilter.replace('_', ' ')}".
                    </p>
                  )}
                </div>
              )}

              {/* Tab 2: Guru vs Reality & Hidden Catches */}
              {activeTab === 'truth' && (
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-1">
                      <span className="text-[11px] font-bold uppercase text-amber-800 tracking-wider">
                        Guru Hook / Claim
                      </span>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        "{video.guruVsRealityComparison.guruClaim}"
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 text-white rounded-lg space-y-1">
                      <span className="text-[11px] font-bold uppercase text-emerald-400 tracking-wider">
                        Ground Truth / Reality
                      </span>
                      <p className="text-slate-200 leading-relaxed">
                        {video.guruVsRealityComparison.actualReality}
                      </p>
                    </div>
                  </div>

                  {/* Hidden Catches list */}
                  {video.hiddenCatches && video.hiddenCatches.length > 0 && (
                    <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase text-rose-800 tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Hidden Catches & Omissions
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-rose-950">
                        {video.hiddenCatches.map((catchItem, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {catchItem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {video.skillPrerequisites && video.skillPrerequisites.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                        Actual Skill Prerequisites
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {video.skillPrerequisites.map((req, rIdx) => (
                          <span
                            key={rIdx}
                            className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-md"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Actionable Step-by-Step Roadmap */}
              {activeTab === 'roadmap' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      How To Execute This Strategy Legitimately
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyRoadmap}
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer"
                    >
                      {copiedRoadmap ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Roadmap</span>
                        </>
                      )}
                    </button>
                  </div>
                  {video.actionableRoadmap && video.actionableRoadmap.length > 0 ? (
                    <ol className="space-y-2">
                      {video.actionableRoadmap.map((step, sIdx) => (
                        <li
                          key={sIdx}
                          className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800"
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-xs text-slate-500">No specific roadmap available.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
