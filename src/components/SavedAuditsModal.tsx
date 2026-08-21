import React from 'react';
import { Cloud, Trash2, Calendar, Search, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ComparisonReport } from '../types';

interface SavedAuditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAudit: (report: ComparisonReport) => void;
}

export const SavedAuditsModal: React.FC<SavedAuditsModalProps> = ({
  isOpen,
  onClose,
  onSelectAudit,
}) => {
  const { user, savedAudits, deleteSavedAudit } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Cloud Saved Reports (Firestore)
              </h3>
              <p className="text-xs text-slate-500">
                Synced securely to account: {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {savedAudits.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl">
              <Cloud className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No cloud audits saved yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                When you run a strategy audit, click "Save to Cloud" to sync reports across devices in Firestore.
              </p>
            </div>
          ) : (
            savedAudits.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-50 hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900 truncate">
                      {item.query || item.niche}
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-semibold rounded-md">
                      {item.niche}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.timeframe}
                    </span>
                    <span>•</span>
                    <span>
                      {item.report?.videos?.length || 0} Videos Analyzed
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectAudit(item.report);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>Load Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSavedAudit(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete saved audit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
