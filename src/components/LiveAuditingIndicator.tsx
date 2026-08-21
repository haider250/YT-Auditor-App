import React, { useEffect, useState } from 'react';
import { RefreshCw, Search, MessageSquare, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface LiveAuditingIndicatorProps {
  query: string;
  niche: string;
}

const STEPS = [
  {
    icon: Search,
    title: 'Searching YouTube & Google Grounding',
    desc: 'Locating recent video uploads, transcripts, and creator publications...',
  },
  {
    icon: MessageSquare,
    title: 'Extracting Audience Comments & Feedback',
    desc: 'Analyzing viewer sentiment, proof of earnings, complaints, and failure modes...',
  },
  {
    icon: ShieldCheck,
    title: 'Fact-Checking Guru Claims vs Reality',
    desc: 'Auditing startup costs, true time to first dollar, and market saturation...',
  },
  {
    icon: Sparkles,
    title: 'Synthesizing Feasibility Matrix & Roadmaps',
    desc: 'Compiling representative comments, consensus scores, and verified blueprints...',
  },
];

export const LiveAuditingIndicator: React.FC<LiveAuditingIndicatorProps> = ({ query, niche }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 2200);
    const timer2 = setTimeout(() => setCurrentStep(2), 5200);
    const timer3 = setTimeout(() => setCurrentStep(3), 8500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center space-y-6 max-w-2xl mx-auto my-6">
      {/* Top spinner */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <RefreshCw className="w-7 h-7 animate-spin text-indigo-600" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
          </span>
        </div>
      </div>

      {/* Target query summary */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">
          Live Search Grounding in Progress
        </span>
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
          Auditing: "{query || niche}"
        </h3>
        <p className="text-xs text-slate-500">
          Searching real-time YouTube uploads and viewer discussions via Gemini Search Grounding
        </p>
      </div>

      {/* Multi-step progress list */}
      <div className="space-y-2.5 text-left pt-2">
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                isCurrent
                  ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950 shadow-xs'
                  : isDone
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white animate-pulse'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
              </div>

              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="text-xs font-bold truncate">
                  {step.title}
                </div>
                <div className="text-[11px] opacity-80 truncate">
                  {step.desc}
                </div>
              </div>

              {isCurrent && (
                <div className="text-[11px] font-bold text-indigo-600 animate-pulse shrink-0">
                  Processing...
                </div>
              )}
              {isDone && (
                <div className="text-[11px] font-bold text-emerald-600 shrink-0">
                  Done
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
