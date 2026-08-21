import React, { useState } from 'react';
import { VideoAnalysis } from '../types';
import { VideoCard } from './VideoCard';
import { Search, Link as LinkIcon, Sparkles, RefreshCw, AlertCircle, PlayCircle } from 'lucide-react';

interface SingleVideoAnalyzerProps {
  onAnalyzeVideo: (urlOrQuery: string) => Promise<VideoAnalysis | null>;
}

export const SingleVideoAnalyzer: React.FC<SingleVideoAnalyzerProps> = ({ onAnalyzeVideo }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [analyzedVideo, setAnalyzedVideo] = useState<VideoAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleUrls = [
    { label: 'AI Cold Emailing Guru Video', query: 'Make $5000/mo cold emailing with AI automation Make.com' },
    { label: 'Faceless YouTube Shorts Claim', query: 'Make $10k/month 100% AI Faceless YouTube Shorts' },
    { label: 'Etsy Digital Products Blueprint', query: 'How I sell Notion templates on Gumroad digital products' },
  ];

  const handleAnalyze = async (queryToAnalyze?: string) => {
    const target = queryToAnalyze || inputUrl;
    if (!target.trim()) {
      setErrorMsg('Please enter a YouTube video URL or topic to investigate.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const result = await onAnalyzeVideo(target);
      if (result) {
        setAnalyzedVideo(result);
      } else {
        setErrorMsg('Could not find or analyze the requested video. Please check the URL.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Analysis failed. Please try another URL.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-indigo-600" />
            Inspect Any YouTube Video URL or Earning Topic
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Paste a YouTube video link or title to run forensic audience comment sentiment analysis, catch hidden paywalls, and check the true feasibility score.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste YouTube URL e.g. https://www.youtube.com/watch?v=... or topic"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-70 text-white text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing Comments...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Audit Video</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Sample Links */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Quick Tests:</span>
          {sampleUrls.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                setInputUrl(s.query);
                handleAnalyze(s.query);
              }}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Result Display */}
      {analyzedVideo && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-emerald-600" />
              Forensic Audit Results
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Real-time comment sentiment extracted
            </span>
          </div>

          <VideoCard video={analyzedVideo} rankIndex={0} />
        </div>
      )}
    </div>
  );
};
