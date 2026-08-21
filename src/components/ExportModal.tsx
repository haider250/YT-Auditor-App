import React, { useState } from 'react';
import { ComparisonReport } from '../types';
import { X, Copy, Check, Download, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ComparisonReport;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, report }) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'markdown' | 'json'>('markdown');

  if (!isOpen) return null;

  const generateMarkdown = () => {
    return `# YouTube Online Earning Audit Report (${report.timeframe})
**Search Focus:** ${report.searchQuery}  
**Total Uploads Audited:** ${report.videos.length}  

## Executive Summary
${report.summary}

## #1 Truly Effective Strategy
- **Name:** ${report.topRecommendedStrategy.name}
- **Why Effective:** ${report.topRecommendedStrategy.whyEffective}
- **Target Audience:** ${report.topRecommendedStrategy.targetAudience}

## Biggest Trap / Misleading Hype
- **Name:** ${report.biggestTrapStrategy.name}
- **Why Misleading:** ${report.biggestTrapStrategy.whyMisleading}
- **Common Pitfall:** ${report.biggestTrapStrategy.commonPitfall}

## Strategy Reality Matrix
| Strategy | Sentiment Score | Success Rate | Startup Cost | Difficulty | Verdict |
|---|---|---|---|---|---|
${report.strategyComparisonTable
  .map(
    (row) =>
      `| ${row.strategyName} | ${row.communitySentimentScore}% | ${row.practicalSuccessRate} | ${row.startupCost} | ${row.difficulty} | ${row.verdict} |`
  )
  .join('\n')}

## Analyzed YouTube Videos & Comment Sentiment
${report.videos
  .map(
    (v, i) => `### #${i + 1} ${v.title}
- **Channel:** ${v.channelName} (${v.videoUrl})
- **Feasibility Score:** ${v.realFeasibilityScore}% (${v.overallSentiment})
- **Guru Claim:** ${v.claimedEarning} in ${v.claimedTimeline}
- **Ground Reality:** ${v.guruVsRealityComparison.actualReality}
- **Audience Verdict:** ${v.audienceVerdict}
`
  )
  .join('\n')}
`;
  };

  const exportText =
    exportFormat === 'markdown' ? generateMarkdown() : JSON.stringify(report, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([exportText], {
      type: exportFormat === 'markdown' ? 'text/markdown' : 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube-earning-audit-${Date.now()}.${exportFormat === 'markdown' ? 'md' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Export Audit Report</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="px-5 pt-4 flex gap-2">
          <button
            onClick={() => setExportFormat('markdown')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              exportFormat === 'markdown'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Markdown (.md)
          </button>
          <button
            onClick={() => setExportFormat('json')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              exportFormat === 'json'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            JSON Format
          </button>
        </div>

        {/* Preview Area */}
        <div className="p-5 flex-1 overflow-y-auto">
          <pre className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-wrap max-h-72 overflow-y-auto">
            {exportText}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
