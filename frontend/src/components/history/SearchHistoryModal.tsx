import React, { useEffect } from 'react';
import type { SearchHistoryItem } from '../../types';
import { History, X, Clock, Search, Trash2, ArrowRight } from 'lucide-react';

interface SearchHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: SearchHistoryItem[];
  onSelectQuery: (query: string) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const SearchHistoryModal: React.FC<SearchHistoryModalProps> = ({
  isOpen,
  onClose,
  historyItems,
  onSelectQuery,
  onClearHistory,
  onDeleteItem,
}) => {
  // Global Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 text-white animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Search & Query History</h3>
              <p className="text-xs text-slate-400">
                Audit trail of recent searches backed by database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {historyItems.length > 0 && (
              <button
                onClick={onClearHistory}
                className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-500/30 rounded-lg transition flex items-center gap-1"
                title="Clear all search history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="my-4 space-y-2 max-h-80 overflow-y-auto">
          {historyItems.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-slate-400">
              <Clock className="w-8 h-8 mx-auto text-slate-600" />
              <div className="text-sm font-semibold text-slate-300">No search history recorded</div>
              <p className="text-xs text-slate-500">
                Queries executed from the search bar will automatically appear here.
              </p>
            </div>
          ) : (
            historyItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between transition-colors group"
              >
                {/* Clickable search query area */}
                <div
                  onClick={() => {
                    onSelectQuery(item.query);
                    onClose();
                  }}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 pr-2"
                >
                  <Search className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="truncate">
                    <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {item.query}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{new Date(item.searchedAt).toLocaleString()}</span>
                      {item.product && (
                        <>
                          <span>•</span>
                          <span className="text-cyan-400 font-medium truncate">
                            {item.product.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectQuery(item.query);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-950 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <span>Re-run</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                    title="Delete this query"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          Click any query to re-execute search and locate on 3D globe
        </div>
      </div>
    </div>
  );
};
