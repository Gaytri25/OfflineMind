import React, { useState } from 'react';
import {
  Languages,
  Sparkles,
  Send,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { localEngine } from '../services/localEngine';

export const LocalLanguageView: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<'Marathi' | 'Hindi' | 'English'>('Marathi');
  const [queryInput, setQueryInput] = useState('Machine Learning म्हणजे काय?');
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<{ latencyMs: number; tokSec: number } | null>(null);
  const [copied, setCopied] = useState(false);

  // Simplify Language Tool State
  const [simplifyInput, setSimplifyInput] = useState(
    'Support Vector Machines identify an optimal hyper-plane which maximizes the functional margin between bipartite training manifolds subject to Karush-Kuhn-Tucker saddle point conditions.'
  );
  const [simplifyLang, setSimplifyLang] = useState<'Marathi' | 'Hindi' | 'English'>('Marathi');
  const [simplifiedOutput, setSimplifiedOutput] = useState<string | null>(null);

  const presets = [
    {
      lang: 'Marathi',
      title: 'Machine Learning म्हणजे काय?',
      query: 'Machine Learning म्हणजे काय? दैनंदिन जीवनातील उदाहरणासह समजावून सांगा.',
    },
    {
      lang: 'Marathi',
      title: 'PCA तंत्राचे महत्त्व',
      query: 'Principal Component Analysis (PCA) म्हणजे काय आणि ते का वापरले जाते?',
    },
    {
      lang: 'Hindi',
      title: 'Machine Learning क्या है?',
      query: 'Machine Learning क्या है? इसके मुख्य प्रकार कौन से हैं?',
    },
    {
      lang: 'Hindi',
      title: 'Overfitting vs Underfitting',
      query: 'Overfitting और Underfitting में क्या अंतर है? आसान भाषा में समझाएं।',
    },
    {
      lang: 'English',
      title: 'What is Machine Learning?',
      query: 'What is machine learning and how does it differ from traditional programming?',
    },
  ];

  const handleQuery = async (customQ?: string) => {
    const q = customQ || queryInput;
    if (!q.trim() || isProcessing) return;

    setIsProcessing(true);
    setResponseText(null);

    try {
      const res = await localEngine.askQuestion(q, false, selectedLang, 'Standard');
      setResponseText(res.content);
      setTelemetry({
        latencyMs: res.latencyMs || 42.1,
        tokSec: res.tokensPerSec || 22.4,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimplify = () => {
    if (!simplifyInput.trim()) return;
    const res = localEngine.simplifyLanguageText(simplifyInput, simplifyLang);
    setSimplifiedOutput(res);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Languages className="w-4 h-4" />
            <span>MODULE 3 — LOCAL LANGUAGE INTELLIGENCE</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Offline Multilingual AI (English · हिंदी · मराठी)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Break language barriers on localhost. Local models generate native Indian language explanations without cloud translation APIs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero Cloud Translation APIs</span>
        </div>
      </div>

      {/* Main Section 1: Multilingual Consultation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Language selector & presets */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
            <label className="text-xs font-semibold text-slate-300 block">Select Target Language</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
              <button
                onClick={() => {
                  setSelectedLang('Marathi');
                  setQueryInput('Machine Learning म्हणजे काय?');
                }}
                className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedLang === 'Marathi'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                मराठी (Marathi)
              </button>
              <button
                onClick={() => {
                  setSelectedLang('Hindi');
                  setQueryInput('Machine Learning क्या है?');
                }}
                className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedLang === 'Hindi'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                onClick={() => {
                  setSelectedLang('English');
                  setQueryInput('What is machine learning?');
                }}
                className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedLang === 'English'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">Suggested Multilingual Queries</span>
            <div className="space-y-1.5">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedLang(p.lang as any);
                    setQueryInput(p.query);
                    handleQuery(p.query);
                  }}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-amber-500/40 text-xs transition-colors cursor-pointer group"
                >
                  <div className="text-[10px] text-amber-400/80 font-mono mb-0.5">{p.lang}</div>
                  <div className="font-medium text-slate-200 group-hover:text-amber-300">{p.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Query Input & Local Output */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Local Language Query</span>
              <span className="text-[11px] text-slate-400">
                Mode: <strong className="text-amber-400">{selectedLang} Local Synthesis</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Type question in Marathi, Hindi, or English..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => handleQuery()}
                disabled={isProcessing || !queryInput.trim()}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask Locally</span>
              </button>
            </div>

            {/* Response area */}
            {isProcessing && (
              <div className="p-6 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-center gap-3 text-xs text-slate-400">
                <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                <span>Generating {selectedLang} response on local CPU...</span>
              </div>
            )}

            {responseText && !isProcessing && (
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-amber-400">Local AI ({selectedLang})</span>
                    <span className="text-slate-700">·</span>
                    <span className="font-mono text-slate-300">
                      {telemetry?.latencyMs ? (telemetry.latencyMs / 1000).toFixed(2) : '0.04'} sec
                    </span>
                    <span className="text-slate-700">·</span>
                    <span className="font-mono text-slate-300">{telemetry?.tokSec || 22.4} tok/s</span>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(responseText);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="text-[13px] text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {responseText}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature 2: "Simplify Language" Tool */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>SPECIAL FEATURE — SIMPLIFY LANGUAGE</span>
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-1">
            Convert Heavy Academic Jargon into Simple Language
          </h3>
          <p className="text-xs text-slate-400">
            Paste difficult textbook passages. The local AI breaks them down into accessible, intuitive explanations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Input side */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 block">Original Complex Text / Academic Sentence</label>
            <textarea
              rows={5}
              value={simplifyInput}
              onChange={(e) => setSimplifyInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Target:</span>
                <select
                  value={simplifyLang}
                  onChange={(e) => setSimplifyLang(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded-md px-2 py-1 text-xs text-slate-200"
                >
                  <option value="Marathi">सोपी मराठी (Simple Marathi)</option>
                  <option value="Hindi">सरल हिंदी (Simple Hindi)</option>
                  <option value="English">Simple Everyday English</option>
                </select>
              </div>

              <button
                onClick={handleSimplify}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Simplify Locally
              </button>
            </div>
          </div>

          {/* Output side */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 block">Simplified Local Explanation</label>
            <div className="h-[140px] bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-xs text-emerald-300 overflow-y-auto whitespace-pre-line leading-relaxed">
              {simplifiedOutput || (
                <span className="text-slate-500 italic">
                  Click 'Simplify Locally' to see plain everyday breakdown...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
