import React, { useState } from 'react';
import { Search, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { localEngine } from '../services/localEngine';

export const SemanticSearchView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('algorithm complexity');
  const [results, setResults] = useState<any[]>(() =>
    localEngine.searchVectorChunks('algorithm complexity', 6)
  );

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const found = localEngine.searchVectorChunks(q, 6);
    setResults(found);
  };

  const sampleSearches = [
    'algorithm complexity',
    'variance reduction PCA',
    'WCSS inertia',
    'overfitting regularization',
    'Bellman-Ford negative cycles',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Search className="w-4 h-4" />
            <span>OFFLINE SEMANTIC SEARCH ENGINE</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">Local Vector Retrieval Across All Documents</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Instant semantic search and keyword match powered by in-memory cosine embeddings. Zero external requests.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
          Index: In-Memory Cosine Vector
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Type semantic query (e.g. 'algorithm complexity', 'variance reduction')..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 flex-wrap">
          <span>Quick queries:</span>
          {sampleSearches.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(s)}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 text-[11px] cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Found <strong className="text-emerald-400">{results.length}</strong> relevant passages for "{searchQuery}"
          </span>
          <span className="font-mono text-[11px]">Threshold: 0.16 similarity</span>
        </div>

        {results.length === 0 ? (
          <div className="p-12 rounded-xl border border-slate-800 bg-slate-950 text-center text-xs text-slate-500">
            No matching chunks found above threshold in local vector store.
          </div>
        ) : (
          results.map((res, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-medium text-slate-200">{res.chunk.documentName}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400 font-mono">Page {res.chunk.pageNumber}</span>
                </div>
                <div className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Similarity: {(res.score * 100).toFixed(0)}%
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                {res.chunk.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
