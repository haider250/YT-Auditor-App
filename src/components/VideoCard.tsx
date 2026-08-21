import React, { useState } from 'react';
import { VideoAnalysis, CommentSnippet, RedFlagItem } from '../types';
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
  Flame,
  Zap,
  Clock,
  DollarSign,
  UserCheck,
  Sparkles,
  Info,
  Sliders,
  Play,
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
  const [activeTab, setActiveTab] = useState<'comments' | 'truth' | 'roadmap' | 'calculator'>('comments');
  const [commentFilter, setCommentFilter] = useState<'all' | 'proof_of_success' | 'hidden_catch' | 'saturation_warning' | 'scam_alert'>('all');
  const [commentSearch, setCommentSearch] = useState('');
  const [copiedRoadmap, setCopiedRoadmap] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

  // Mini Personal Match Calculator state
  const [userHours, setUserHours] = useState(10);
  const [userBudget, setUserBudget] = useState(50);
  const [userExperience, setUserExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const isHighlyViable = video.realFeasibilityScore >= 70;
  const isModerate = video.realFeasibilityScore >= 45 && video.realFeasibilityScore < 70;
  const isHighClickbait = (video.clickbaitScore || 0) >= 65;

  // Calculate Personal Match Score
  const calculatePersonalScore = () => {
    let score = video.realFeasibilityScore;
    
    // Budget check
    const isZeroBudget = video.startupCapitalNeeded.includes('$0');
    if (userBudget < 20 && !isZeroBudget) {
      score -= 20;
    } else if (userBudget >= 100) {
      score += 5;
    }

    // Time check
    if (userHours < 8) {
      score -= 25;
    } else if (userHours >= 20) {
      score += 10;
    }

    // Skill check
    if (userExperience === 'beginner' && video.skillPrerequisites.length > 2) {
      score -= 15;
    }

    return Math.max(10, Math.min(99, Math.round(score)));
  };

  const personalScore = calculatePersonalScore();

  const handleCopyRoadmap = () => {
    if (!video.actionableRoadmap || video.actionableRoadmap.length === 0) return;
    const text = `Verified Action Roadmap for "${video.strategyName}" (${video.title}):\n\n` +
      `📌 Guru Claim: ${video.guruVsRealityComparison.guruClaim}\n` +
      `⚖️ Audience Reality: ${video.guruVsRealityComparison.actualReality}\n` +
      `💰 Realistic Median Earnings: ${video.realMedianMonthlyIncome}\n` +
      `⏱️ Time Commitment: ${video.realTimeCommitment}\n\n` +
      `Step-by-Step Execution Guide:\n` +
      video.actionableRoadmap.map((step, i) => `${i + 1}. ${step}`).join('\n') +
      `\n\nAnalyzed via YT Auditor Reality Engine (Audience Feasibility: ${video.realFeasibilityScore}%, Clickbait Index: ${video.clickbaitScore}%)`;
    navigator.clipboard.writeText(text);
    setCopiedRoadmap(true);
    setTimeout(() => setCopiedRoadmap(false), 2000);
  };

  const getVerdictBadge = () => {
    const verdict = video.verdict || (isHighlyViable ? 'Genuine & Highly Viable' : 'Partially Viable (High Effort)');
    switch (verdict) {
      case 'Genuine & Highly Viable':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Genuine & Viable
          </span>
        );
      case 'Partially Viable (High Effort)':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            Partially Viable (High Effort)
          </span>
        );
      case 'Clickbait / Misleading Claims':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300">
            <Flame className="w-3.5 h-3.5 text-orange-700" />
            Heavy Clickbait / Hype
          </span>
        );
      case 'Predatory / Course Funnel Trap':
      case 'Overhyped / Extreme Saturation':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-700" />
            {verdict}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            {verdict}
          </span>
        );
    }
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
            <AlertCircle className="w-3 h-3" /> Hidden Catch / Costs
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
    if (commentFilter !== 'all' && cmt.category !== commentFilter) return false;
    if (commentSearch.trim()) {
      const q = commentSearch.toLowerCase();
      return (
        cmt.comment.toLowerCase().includes(q) ||
        (cmt.author && cmt.author.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const hasValidVideoId = video.videoId && video.videoId.length === 11 && !video.videoId.startsWith('vid-');

  return (
    <article
      id={`video-card-${video.id}`}
      className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md ${
        isHighlyViable
          ? 'border-slate-200 hover:border-emerald-400'
          : isModerate
          ? 'border-slate-200 hover:border-amber-400'
          : 'border-slate-200 hover:border-rose-400'
      }`}
    >
      <div className="p-4 sm:p-6 space-y-4">
        {/* Top Header Row: Category, Metadata & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 uppercase tracking-wider">
              #{rankIndex + 1} • {video.strategyCategory}
            </span>

            {getVerdictBadge()}

            {video.publishedDate && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 px-2.5 py-1 rounded-md text-slate-600 font-medium">
                <Calendar className="w-3 h-3 text-slate-400" />
                {video.publishedDate}
              </span>
            )}

            {video.viewsEstimate && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium hidden sm:inline-flex">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {video.viewsEstimate}
              </span>
            )}
          </div>

          {/* Feasibility & Clickbait Scores */}
          <div className="flex items-center gap-2">
            {/* Feasibility pill */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                isHighlyViable
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : isModerate
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
              title="Feasibility Score based on audience sentiment and execution barriers"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{video.realFeasibilityScore}% Viability</span>
            </div>

            {/* Clickbait Hype Index */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                isHighClickbait
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : (video.clickbaitScore || 0) > 35
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
              title="Clickbait Hype Meter: Higher percentage = more exaggerated thumbnail and title promises"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{video.clickbaitScore || 0}% Hype</span>
            </div>

            {/* Bookmark button */}
            {onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark(video.id)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-100 text-amber-700 border-amber-300'
                    : 'bg-slate-50 text-slate-400 hover:text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark strategy'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-700" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Video Main Body: Thumbnail / Player + Title & Channel */}
        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Thumbnail / Embed Preview */}
          <div className="w-full md:w-56 shrink-0 space-y-2">
            {showEmbed && hasValidVideoId ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-xs">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1`}
                  title={video.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 group border border-slate-200 shadow-2xs">
                <img
                  src={
                    video.thumbnailUrl ||
                    (hasValidVideoId
                      ? `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
                      : 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80')
                  }
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  onError={(e) => {
                    // Fallback to high-quality gradient placeholder if image 404s
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                {hasValidVideoId ? (
                  <button
                    type="button"
                    onClick={() => setShowEmbed(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer group"
                    title="Play Preview"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </button>
                ) : (
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-sm">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                )}

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white font-medium drop-shadow-sm">
                  <span className="truncate max-w-[130px]">{video.channelName}</span>
                  <span className="bg-black/60 px-1.5 py-0.5 rounded text-[10px]">YouTube</span>
                </div>
              </div>
            )}

            {showEmbed && (
              <button
                type="button"
                onClick={() => setShowEmbed(false)}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Close Video Player
              </button>
            )}
          </div>

          {/* Title & Core Strategy Description */}
          <div className="flex-1 space-y-2 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 transition-colors inline-flex items-center gap-1.5"
              >
                <span>{video.title}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0 inline" />
              </a>
            </h3>

            <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
              <span className="font-semibold text-slate-800">
                Channel:{' '}
                <a
                  href={video.channelUrl || video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 underline"
                >
                  {video.channelName}
                </a>
              </span>
              <span>•</span>
              <span>
                Model: <strong className="text-slate-800">{video.strategyName}</strong>
              </span>
            </div>

            {/* Audience Verdict Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-900 font-semibold">Audience Consensus:</strong>{' '}
                {video.audienceVerdict}
              </p>
            </div>
          </div>
        </div>

        {/* Guru Claims vs Reality Breakdown Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Guru Promise Box */}
          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                Creator / Guru Promise
              </span>
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                Claim: {video.claimedEarning}
              </span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              "{video.guruVsRealityComparison.guruClaim}"
            </p>
            <div className="text-[11px] text-rose-700 flex items-center gap-2 pt-1">
              <span>Claimed Timeline: <strong>{video.claimedTimeline}</strong></span>
            </div>
          </div>

          {/* Viewer Reality Box */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Audience Execution Reality
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                Real Median: {video.realMedianMonthlyIncome}
              </span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed font-medium">
              {video.guruVsRealityComparison.actualReality}
            </p>
            <div className="text-[11px] text-emerald-800 flex items-center gap-3 pt-1 flex-wrap">
              <span>Time: <strong>{video.realTimeCommitment}</strong></span>
              <span>•</span>
              <span>Success Rate: <strong>{video.estimatedViewerSuccessRate}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Spec Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Startup Capital</span>
            <span className="font-bold text-slate-900">{video.startupCapitalNeeded}</span>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Time to First $</span>
            <span className="font-bold text-slate-900">{video.timeToFirstDollar}</span>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Market Saturation</span>
            <span className={`font-bold ${
              video.saturationLevel === 'Low'
                ? 'text-emerald-600'
                : video.saturationLevel === 'Medium'
                ? 'text-amber-600'
                : 'text-rose-600'
            }`}>
              {video.saturationLevel}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Audience Sentiment</span>
            <span className="font-bold text-slate-900">
              {video.sentimentBreakdown.positivePercent}% Positive
            </span>
          </div>
        </div>

        {/* Sentiment Bar Indicator */}
        <SentimentBar breakdown={video.sentimentBreakdown} />

        {/* Expand / Collapse Action Button */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer py-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Hide Forensic Deep Dive & Comments</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>View Audience Comments ({video.representativeComments.length}), Red Flags & Roadmap</span>
              </>
            )}
          </button>

          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <span>Open on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Expanded Deep Dive Panel */}
        {isExpanded && (
          <div className="pt-4 border-t border-slate-200 space-y-4">
            {/* Tab navigation inside card */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 text-xs flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('comments')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeTab === 'comments'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                💬 Viewer Comments ({video.representativeComments.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('truth')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeTab === 'truth'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🚩 Red Flags & Hidden Catches ({video.hiddenCatches.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('roadmap')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeTab === 'roadmap'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📋 Honest Execution Roadmap
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('calculator')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  activeTab === 'calculator'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                ⚡ Personal Viability Match
              </button>
            </div>

            {/* TAB 1: Viewer Comments */}
            {activeTab === 'comments' && (
              <div className="space-y-3">
                {/* Comment Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-1 flex-wrap text-xs">
                    <button
                      type="button"
                      onClick={() => setCommentFilter('all')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                        commentFilter === 'all'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All ({video.representativeComments.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommentFilter('proof_of_success')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                        commentFilter === 'proof_of_success'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      ✓ Success Proof
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommentFilter('hidden_catch')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                        commentFilter === 'hidden_catch'
                          ? 'bg-amber-600 text-white'
                          : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      ⚠️ Hidden Catches
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommentFilter('saturation_warning')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                        commentFilter === 'saturation_warning'
                          ? 'bg-orange-600 text-white'
                          : 'bg-orange-50 text-orange-800 hover:bg-orange-100'
                      }`}
                    >
                      📉 Saturation
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommentFilter('scam_alert')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                        commentFilter === 'scam_alert'
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                      }`}
                    >
                      ⛔ Scam Alerts
                    </button>
                  </div>

                  <input
                    type="text"
                    value={commentSearch}
                    onChange={(e) => setCommentSearch(e.target.value)}
                    placeholder="Search comment text..."
                    className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 w-full sm:w-44 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Comment Cards */}
                <div className="space-y-2.5">
                  {filteredComments.length > 0 ? (
                    filteredComments.map((cmt, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-1.5 text-xs hover:border-indigo-200 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">
                              {cmt.author || `AudienceMember_${cIdx + 1}`}
                            </span>
                            {getCommentBadge(cmt.category)}
                          </div>
                          {cmt.likes && (
                            <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                              <ThumbsUp className="w-3 h-3 text-slate-400" />
                              {cmt.likes} likes
                            </span>
                          )}
                        </div>

                        <p className="text-slate-700 italic leading-relaxed">
                          "{cmt.comment}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      No comments match the selected filter.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Red Flags & Hidden Truths */}
            {activeTab === 'truth' && (
              <div className="space-y-3 text-xs">
                {/* Red Flag Alerts */}
                {video.redFlags && video.redFlags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-rose-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Critical Red Flags Identified
                    </h4>
                    <div className="space-y-1.5">
                      {video.redFlags.map((rf, rIdx) => (
                        <div
                          key={rIdx}
                          className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex items-start gap-2"
                        >
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">{rf.flag}:</span>{' '}
                            <span>{rf.explanation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hidden Catches list */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                    Hidden Prerequisites & Omitted Costs
                  </h4>
                  <ul className="space-y-1.5">
                    {video.hiddenCatches.map((catchItem, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2 text-amber-950">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                        <span>{catchItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pros vs Cons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Real Advantages
                    </span>
                    <ul className="space-y-1 text-slate-700">
                      {video.pros.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <span className="font-bold text-rose-700 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Real Drawbacks
                    </span>
                    <ul className="space-y-1 text-slate-700">
                      {video.cons.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {video.honestAlternativeRecommendation && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-950 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-indigo-800">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Honest Alternative Approach:
                    </span>
                    <p>{video.honestAlternativeRecommendation}</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Honest Execution Roadmap */}
            {activeTab === 'roadmap' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Step-by-Step Verified Roadmap
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyRoadmap}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {copiedRoadmap ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Roadmap</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  {video.actionableRoadmap.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {sIdx + 1}
                      </div>
                      <p className="text-slate-800 leading-relaxed font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Personal Viability Match Calculator */}
            {activeTab === 'calculator' && (
              <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-4 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-indigo-600" />
                      Personal Viability Calculator
                    </h4>
                    <p className="text-slate-500 text-[11px]">
                      Test if your personal available hours and budget match this strategy's requirements.
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Your Match Score</span>
                    <span className={`text-lg font-black ${
                      personalScore >= 70
                        ? 'text-emerald-600'
                        : personalScore >= 45
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}>
                      {personalScore}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Hours per week */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 flex justify-between">
                      <span>Hours / Week:</span>
                      <strong className="text-indigo-600">{userHours} hrs</strong>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="40"
                      value={userHours}
                      onChange={(e) => setUserHours(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  {/* Budget */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 flex justify-between">
                      <span>Starting Budget:</span>
                      <strong className="text-indigo-600">${userBudget}</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      value={userBudget}
                      onChange={(e) => setUserBudget(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  {/* Experience */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Experience Level:</label>
                    <select
                      value={userExperience}
                      onChange={(e) => setUserExperience(e.target.value as any)}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      <option value="beginner">Beginner (No prior skills)</option>
                      <option value="intermediate">Intermediate (Basic tools)</option>
                      <option value="advanced">Advanced (Sales / Tech expert)</option>
                    </select>
                  </div>
                </div>

                {/* Score diagnosis */}
                <div className="p-3 bg-white border border-indigo-100 rounded-lg text-slate-700 leading-relaxed">
                  {personalScore >= 70 ? (
                    <span className="text-emerald-800 font-medium">
                      ✅ <strong>Great Match:</strong> With {userHours} hrs/week and ${userBudget}, you have enough bandwidth and runway to test this strategy without high financial risk.
                    </span>
                  ) : personalScore >= 45 ? (
                    <span className="text-amber-800 font-medium">
                      ⚠️ <strong>Moderate Risk:</strong> This strategy requires active weekly effort. If your budget is under ${video.startupCapitalNeeded}, expect slower progress.
                    </span>
                  ) : (
                    <span className="text-rose-800 font-medium">
                      ⛔ <strong>High Barrier:</strong> Your current time/budget constraints make this strategy high risk. Consider a $0-capital service arbitrage model instead.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
