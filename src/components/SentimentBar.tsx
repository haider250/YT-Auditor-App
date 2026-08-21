import React from 'react';

interface SentimentBarProps {
  positive: number;
  neutral: number;
  negative: number;
  showLabels?: boolean;
  className?: string;
}

export const SentimentBar: React.FC<SentimentBarProps> = ({
  positive,
  neutral,
  negative,
  showLabels = true,
  className = '',
}) => {
  // Normalize if total doesn't equal 100
  const total = positive + neutral + negative || 100;
  const posPct = Math.round((positive / total) * 100);
  const neuPct = Math.round((neutral / total) * 100);
  const negPct = Math.max(0, 100 - posPct - neuPct);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
        <div
          style={{ width: `${posPct}%` }}
          className="bg-emerald-500 hover:bg-emerald-400 transition-all duration-300"
          title={`Positive Sentiment: ${posPct}%`}
        />
        <div
          style={{ width: `${neuPct}%` }}
          className="bg-amber-400 hover:bg-amber-300 transition-all duration-300"
          title={`Neutral Sentiment: ${neuPct}%`}
        />
        <div
          style={{ width: `${negPct}%` }}
          className="bg-rose-500 hover:bg-rose-400 transition-all duration-300"
          title={`Negative/Skeptical Sentiment: ${negPct}%`}
        />
      </div>

      {showLabels && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {posPct}% Positive / Success
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            {neuPct}% Neutral
          </span>
          <span className="flex items-center gap-1 text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            {negPct}% Negative / Warning
          </span>
        </div>
      )}
    </div>
  );
};
