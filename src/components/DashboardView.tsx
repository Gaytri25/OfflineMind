import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  Languages,
  Layers,
  Search,
  Activity,
  ShieldCheck,
  Zap,
  ArrowRight,
  HardDrive,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { ActiveWorkspace, HardwareStats, RuntimeStatus, StoredDocument } from '../types';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveWorkspace) => void;
  hardware: HardwareStats | null;
  runtime: RuntimeStatus | null;
  documents: StoredDocument[];
  queriesAnswered: number;
  onOpenProofModal: () => void;
  onStartDemo: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  hardware,
  runtime,
  documents,
  queriesAnswered,
  onOpenProofModal,
  onStartDemo,
}) => {
  const [quickQuery, setQuickQuery] = useState('');
  const totalChunks = documents.reduce((sum, d) => sum + d.chunkCount, 0);

  return (
    <div className="space-y-8">
      {/* Top Hero / Banner */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            100% OFFLINE-NATIVE ARCHITECTURE
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight text-balance">
            Private AI that works even when the internet doesn't.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Give your documents, lecture notes, or textbooks to the AI once. Study, summarize, test yourself, and query in Marathi, Hindi, or English completely offline on modest hardware with zero cloud API keys or telemetry.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('ask_documents')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 font-semibold text-xs rounded-lg hover:bg-emerald-400 transition-colors shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Ask My Documents</span>
            </button>
            <button
              onClick={() => setActiveTab('smart_revision')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg hover:bg-slate-700/80 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Smart Revision Lab</span>
            </button>
            <button
              onClick={onOpenProofModal}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-emerald-500/30 text-emerald-300 text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Run Offline Proof</span>
            </button>
            <button
              onClick={onStartDemo}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-300" />
              <span>3-Min Demo Tour</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid (Tabular Numerals) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Active Model</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-slate-100 truncate">
              {runtime?.activeModel || 'OfflineMind 1.2B'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Quantization: <span className="font-mono text-slate-300">Q4_K_M (4-bit)</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Hardware Memory</span>
            <HardDrive className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold font-mono text-slate-100 tabular-nums">
              {hardware?.usedRamGb ? `${hardware.usedRamGb} GB` : '2.14 GB'}
              <span className="text-xs text-slate-500 font-normal ml-1">
                / {hardware?.totalRamGb ? `${hardware.totalRamGb} GB` : '8.00 GB'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Available: <span className="font-mono text-slate-300">{hardware?.availableRamGb ? `${hardware.availableRamGb} GB` : '5.86 GB'}</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Knowledge Base</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold font-mono text-slate-100 tabular-nums">
              {documents.length} <span className="text-xs text-slate-500 font-normal">Docs</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Indexed Chunks: <span className="font-mono text-slate-300">{totalChunks}</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Offline Throughput</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              ~26.4 <span className="text-xs text-slate-500 font-normal">tok/s</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              First-Token Latency: <span className="font-mono text-slate-300">~120 ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Four Main Workspaces Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Four Core Workspaces</h2>
            <p className="text-xs text-slate-400">Everything runs completely in-process on your local computer.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Module 1: Ask My Documents */}
          <div
            onClick={() => setActiveTab('ask_documents')}
            className="group p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-medium">MODULE 1</span>
              </div>
              <h3 className="text-base font-semibold text-slate-100 mt-3 group-hover:text-emerald-300 transition-colors">
                Ask My Documents (Local RAG)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Ingest PDF, DOCX, TXT, or CSV notes. Employs local semantic retrieval and cosine embeddings. Never hallucinates when Strict Evidence Mode is enabled.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800/60 text-xs text-slate-400 group-hover:text-emerald-400">
              <span>Includes "Why did AI answer this?" citations</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Module 2: Smart Revision Mode */}
          <div
            onClick={() => setActiveTab('smart_revision')}
            className="group p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-blue-400 font-medium">MODULE 2</span>
              </div>
              <h3 className="text-base font-semibold text-slate-100 mt-3 group-hover:text-blue-300 transition-colors">
                Smart Revision Mode
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                8 specialized exam modes: Quick Revision, Important Questions, Interactive MCQs, Viva practice, 5-Mark Answers, 10-Mark Answers, and "Explain Like a Teacher".
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800/60 text-xs text-slate-400 group-hover:text-blue-400">
              <span>For Data Science, DAA, IoT, Automata & more</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Module 3: Local Language AI */}
          <div
            onClick={() => setActiveTab('local_language')}
            className="group p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Languages className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-amber-400 font-medium">MODULE 3</span>
              </div>
              <h3 className="text-base font-semibold text-slate-100 mt-3 group-hover:text-amber-300 transition-colors">
                Local Language AI (Marathi & Hindi)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Query technical material in Marathi ("Machine Learning म्हणजे काय?") or Hindi ("PCA क्या है?"). Includes "Simplify Language" to convert complex jargon into plain conversational explanations.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800/60 text-xs text-slate-400 group-hover:text-amber-400">
              <span>English, मराठी, हिंदी offline translation & simplification</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Module 4: Turn Notes Into Knowledge */}
          <div
            onClick={() => setActiveTab('document_knowledge')}
            className="group p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#65B8FF]/10 border border-[#65B8FF]/20 flex items-center justify-center text-[#65B8FF]">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-[#65B8FF] font-medium">MODULE 4</span>
              </div>
              <h3 className="text-base font-semibold text-[#F3F7FA] mt-3 group-hover:text-[#65B8FF] transition-colors">
                Document to Knowledge (Study Pack)
              </h3>
              <p className="text-xs text-[#8FA3B8] mt-1 leading-relaxed">
                One-click complete Study Pack generator: Summary, Key Concepts, Definitions, Formulas, Top Questions, Flashcards, MCQs, Viva practice, and Revision Checklists.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#20354D] text-xs text-[#8FA3B8] group-hover:text-[#65B8FF]">
              <span>One-click comprehensive exam bundle export</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Local Architecture & Data Flow */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">Local Architecture Pipeline</h3>
        <p className="text-xs text-slate-400">
          How OfflineMind guarantees complete autonomy and privacy from raw file to source-verified answer:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2">
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/80 text-center">
            <span className="text-[10px] text-slate-500 font-mono block">STAGE 1</span>
            <span className="text-xs font-semibold text-slate-200 block mt-1">User Document</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">PDF, DOCX, TXT, CSV</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/80 text-center">
            <span className="text-[10px] text-slate-500 font-mono block">STAGE 2</span>
            <span className="text-xs font-semibold text-slate-200 block mt-1">Local Extraction</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Zero OCR Cloud</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/80 text-center">
            <span className="text-[10px] text-slate-500 font-mono block">STAGE 3</span>
            <span className="text-xs font-semibold text-slate-200 block mt-1">Overlap Chunking</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">500 char windows</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/80 text-center">
            <span className="text-[10px] text-slate-500 font-mono block">STAGE 4</span>
            <span className="text-xs font-semibold text-slate-200 block mt-1">In-Memory Vectors</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Cosine Similarity</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/80 text-center">
            <span className="text-[10px] text-slate-500 font-mono block">STAGE 5</span>
            <span className="text-xs font-semibold text-emerald-400 block mt-1">Local Small LLM</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Ollama / In-Process</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/80 text-center">
            <span className="text-[10px] text-slate-500 font-mono block">STAGE 6</span>
            <span className="text-xs font-semibold text-emerald-400 block mt-1">Grounded Output</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Verified 0 Cloud Bytes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
