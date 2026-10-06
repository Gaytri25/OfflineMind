import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Send,
  Download,
  Copy,
  Check,
  Calculator,
  HelpCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { StoredDocument, StudyPack, ProblemSolutionResult, ChatMessage } from '../types';
import { localTutor } from '../services/localEngine';
import { processDocumentFile, ExtractionReport } from '../services/pdfExtractor';

interface NotesViewProps {
  documents: StoredDocument[];
  onAddDocument: (name: string, text: string, fileType: string, pages: number) => void;
  onAddProcessedDocument?: (report: ExtractionReport) => void;
  onDeleteDocument: (id: string) => void;
  onStartStudyTopic: (topic: string, subject: string, actionPrompt?: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  documents,
  onAddDocument,
  onAddProcessedDocument,
  onDeleteDocument,
  onStartStudyTopic,
}) => {
  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || '');
  const [interactionMode, setInteractionMode] = useState<'qa' | 'solve'>('qa');

  // Q&A state
  const [noteQuery, setNoteQuery] = useState('');
  const [noteAnswer, setNoteAnswer] = useState<ChatMessage | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [strictMode, setStrictMode] = useState(true);

  // Problem Solving state
  const [problemStatement, setProblemStatement] = useState('');
  const [problemSolution, setProblemSolution] = useState<ProblemSolutionResult | null>(null);
  const [isSolving, setIsSolving] = useState(false);

  // Study Pack state
  const [studyPack, setStudyPack] = useState<StudyPack | null>(null);
  const [isPackLoading, setIsPackLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);

  // File Upload State & Progress
  const [uploadProgress, setUploadProgress] = useState<{
    isUploading: boolean;
    fileName: string;
    step: string;
    percent: number;
  } | null>(null);

  // Paste Text modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadText, setUploadText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  // 1. Q&A Mode Submission (Performs 100% fresh retrieval for currentQuestion)
  const handleAskNotes = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToAsk = (customQuery || noteQuery).trim();
    if (!queryToAsk || isSearching) return;

    setIsSearching(true);
    setNoteAnswer(null);

    try {
      const res = await localTutor.askTutor(
        queryToAsk,
        strictMode,
        'English',
        activeDoc?.id
      );
      setNoteAnswer(res);
    } finally {
      setIsSearching(false);
    }
  };

  // 2. Problem Solving Mode Submission (Performs dedicated 8-step retrieval and solution)
  const handleSolveProblem = async (e?: React.FormEvent, customStatement?: string) => {
    if (e) e.preventDefault();
    const statementToSolve = (customStatement || problemStatement).trim();
    if (!statementToSolve || isSolving) return;

    setIsSolving(true);
    setProblemSolution(null);

    try {
      const result = await localTutor.solveProblem(statementToSolve, activeDoc?.id);
      setProblemSolution(result);
    } finally {
      setIsSolving(false);
    }
  };

  const handleGenerateStudyPack = () => {
    if (!activeDoc) return;
    setIsPackLoading(true);
    setTimeout(() => {
      const pack = localTutor.generateStudyPack(activeDoc.name);
      setStudyPack(pack);
      setIsPackLoading(false);
    }, 350);
  };

  // 3. Robust Local File Processing (Handles PDF, DOCX, TXT with Unicode Cleaning & Chunking)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress({
      isUploading: true,
      fileName: file.name,
      step: 'Extracting content from local file...',
      percent: 25,
    });

    try {
      const report = await processDocumentFile(file, (step, percent) => {
        setUploadProgress({
          isUploading: true,
          fileName: file.name,
          step,
          percent,
        });
      });

      if (onAddProcessedDocument) {
        onAddProcessedDocument(report);
      } else {
        const fullText = report.chunks.map((c) => c.content).join('\n\n');
        onAddDocument(report.filename, fullText, report.fileType, report.totalPages);
      }

      setUploadProgress(null);
    } catch {
      // Fallback text reader
      const reader = new FileReader();
      const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        const estimatedPages = Math.max(1, Math.ceil(text.length / 1500));
        onAddDocument(file.name, text, ext, estimatedPages);
        setUploadProgress(null);
      };
      reader.readAsText(file);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleManualAdd = () => {
    if (!uploadTitle.trim() || !uploadText.trim()) return;
    const pages = Math.max(1, Math.ceil(uploadText.length / 1500));
    onAddDocument(uploadTitle.trim(), uploadText.trim(), 'txt', pages);
    setUploadTitle('');
    setUploadText('');
    setShowAddModal(false);
  };

  const sampleQuestions = [
    { label: 'What is K-Means clustering?', query: 'What is K-Means clustering?' },
    { label: 'Explain why K-Means is unsupervised', query: 'Explain why K-Means is unsupervised.' },
    { label: 'Compare K-Means and hierarchical', query: 'Compare K-Means and hierarchical clustering.' },
    { label: 'What is Chi-Square formula?', query: 'What is the formula and calculation for Chi-Square test?' },
  ];

  const sampleProblems = [
    {
      label: 'K-Means Centroid Numerical',
      problem: 'Given points P1(2,10), P2(2,5), P3(8,4), P4(5,8) and initial centroids m1=(2,10), m2=(2,5), solve the cluster assignment and compute new centroids for k=2 using Euclidean distance.',
    },
    {
      label: 'Chi-Square Contingency Problem',
      problem: 'Solve a Chi-Square test of independence for a 2x2 contingency table with observed frequencies O = [20, 15, 10, 25]. State hypotheses, calculate expected frequencies E, compute χ² test statistic, and give the decision at α = 0.05.',
    },
    {
      label: 'Master Theorem Recurrence',
      problem: 'Solve the recurrence relation T(n) = 2T(n/2) + n using Master Theorem. Identify a, b, f(n), compare with n^(log_b a), and give the final asymptotic bound Θ.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#17231F] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#18A673]" />
            <span>My Notes &amp; Personal Document Grounding</span>
          </h2>
          <p className="text-xs text-[#68756F] mt-0.5">
            100% Local RAG pipeline: Text extraction → Unicode normalization → Dynamic chunking → Local indexing → Step-by-step problem solving.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-4 py-2.5 bg-[#18A673] hover:bg-[#18A673]/90 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all">
            <Upload className="w-4 h-4" />
            <span>Upload File (.pdf, .docx, .txt)</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.docx,.txt,.md,.csv"
            />
          </label>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2.5 bg-[#FFFFFF] border border-[#E5EBE7] text-[#17231F] hover:border-[#18A673] hover:bg-[#F0F8F4] text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-xs"
          >
            Paste Text
          </button>
        </div>
      </div>

      {/* Upload Progress Indicator */}
      {uploadProgress && (
        <div className="p-4 rounded-xl bg-[#E8F7F0] border border-[#18A673]/40 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-[#17231F]">
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#18A673] border-t-transparent animate-spin" />
              <span>Processing: {uploadProgress.fileName}</span>
            </span>
            <span className="font-mono text-[#18A673]">{uploadProgress.percent}%</span>
          </div>
          <p className="text-[11px] text-[#68756F]">{uploadProgress.step}</p>
          <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#18A673] h-1.5 transition-all duration-300"
              style={{ width: `${uploadProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const isSelected = doc.id === activeDoc?.id;
          return (
            <div
              key={doc.id}
              onClick={() => {
                setSelectedDocId(doc.id);
                setNoteAnswer(null);
                setProblemSolution(null);
              }}
              className={`p-4.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between card-hover-lift shadow-xs ${
                isSelected
                  ? 'bg-[#E8F7F0]/40 border-[#18A673] shadow-sm ring-1 ring-[#18A673]/30'
                  : 'bg-[#FFFFFF] border-[#E5EBE7] hover:bg-[#F8FAF7] hover:border-[#18A673]/60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-[#F8FAF7] text-[#18A673] border border-[#E5EBE7]">
                    {doc.fileType}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDocument(doc.id);
                    }}
                    className="text-[#68756F] hover:text-[#FF6B5F] p-1 cursor-pointer transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-xs font-bold text-[#17231F] line-clamp-2">
                  {doc.name}
                </h4>

                <div className="text-[11px] text-[#68756F] font-mono">
                  {doc.pageCount} pages · {doc.chunkCount} vector chunks · {(doc.fileSize / 1024).toFixed(0)} KB
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#E5EBE7] flex items-center justify-between text-[11px]">
                <span className={isSelected ? 'text-[#18A673] font-bold' : 'text-[#68756F]'}>
                  {isSelected ? '✓ Active Source' : 'Click to select'}
                </span>
                <span className="text-[#68756F] font-mono">100% Local</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* WORKFLOW TABS: Ask Notes Q&A vs Solve Problem Mode */}
      {activeDoc && (
        <div className="p-6 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] space-y-6 shadow-sm">
          {/* Top Bar with Mode Switcher & Tools */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5EBE7] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#68756F] font-mono uppercase font-bold">Active Note:</span>
                <span className="text-sm font-bold text-[#18A673]">{activeDoc.name}</span>
              </div>
              <p className="text-[11px] text-[#68756F] mt-0.5">
                Every query executes fresh local retrieval. No cached answers or stale context.
              </p>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-xl bg-[#F8FAF7] border border-[#E5EBE7] p-1">
                <button
                  type="button"
                  onClick={() => setInteractionMode('qa')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                    interactionMode === 'qa'
                      ? 'bg-[#FFFFFF] text-[#18A673] shadow-xs'
                      : 'text-[#68756F] hover:text-[#17231F]'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ask Notes (Q&amp;A)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInteractionMode('solve')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                    interactionMode === 'solve'
                      ? 'bg-[#18A673] text-white shadow-xs'
                      : 'text-[#68756F] hover:text-[#17231F]'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Solve Problem Mode</span>
                </button>
              </div>

              {/* Strict Evidence Toggle */}
              <button
                onClick={() => setStrictMode(!strictMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-colors shadow-xs ${
                  strictMode
                    ? 'bg-[#E8F7F0] border-[#18A673] text-[#18A673]'
                    : 'bg-[#F8FAF7] border-[#E5EBE7] text-[#68756F]'
                }`}
                title="Strict Evidence Mode forces grounding strictly in your notes"
              >
                {strictMode ? <ShieldCheck className="w-3.5 h-3.5 text-[#18A673]" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                <span>Strict: {strictMode ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={handleGenerateStudyPack}
                disabled={isPackLoading}
                className="px-3 py-1.5 bg-[#FFF0EF] hover:bg-[#FFE5E2] text-[#FF6B5F] border border-[#FF6B5F]/30 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isPackLoading ? 'Extracting...' : 'Study Pack'}</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* MODE 1: ASK NOTES (Q&A WORKFLOW) */}
          {/* ============================================================== */}
          {interactionMode === 'qa' && (
            <div className="space-y-4">
              {/* Quick Prompt Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <span className="text-[#68756F] font-mono text-[10px] shrink-0 mr-1">Try Asking:</span>
                {sampleQuestions.map((sq, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNoteQuery(sq.query);
                      handleAskNotes(undefined, sq.query);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#F8FAF7] hover:bg-[#E8F7F0] text-[#17231F] hover:text-[#18A673] border border-[#E5EBE7] hover:border-[#18A673]/40 whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium"
                  >
                    {sq.label}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleAskNotes} className="flex items-center gap-2">
                <input
                  type="text"
                  value={noteQuery}
                  onChange={(e) => setNoteQuery(e.target.value)}
                  placeholder="Ask a question from this document (e.g. 'What is K-Means clustering?', 'Explain why K-Means is unsupervised', 'Compare K-Means and hierarchical clustering')..."
                  className="flex-1 bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl px-4 py-3 text-xs text-[#17231F] placeholder-[#68756F]/60 focus:outline-none focus:border-[#18A673] focus:bg-white transition-colors shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isSearching || !noteQuery.trim()}
                  className="px-5 py-3 bg-[#18A673] hover:bg-[#18A673]/90 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-sm"
                >
                  <span>Ask Note</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Loading Indicator */}
              {isSearching && (
                <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7] text-xs text-[#68756F] flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-[#18A673] border-t-transparent animate-spin" />
                  <span className="font-medium text-[#17231F]">
                    Executing fresh retrieval on {activeDoc.name} and reasoning...
                  </span>
                </div>
              )}

              {/* Answer Display */}
              {noteAnswer && (
                <div className="p-5 rounded-2xl border border-[#E5EBE7] bg-[#F8FAF7] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#E5EBE7] pb-2 text-xs">
                    <span className="font-bold text-[#18A673] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Answer for: "{noteQuery}"</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#68756F]">
                      {noteAnswer.latencyMs} ms · 100% Local
                    </span>
                  </div>

                  <div className="whitespace-pre-line text-xs text-[#17231F] leading-relaxed font-sans">
                    {noteAnswer.content}
                  </div>

                  {/* Sources Cited */}
                  {noteAnswer.sources && noteAnswer.sources.length > 0 && (
                    <div className="pt-3 border-t border-[#E5EBE7] space-y-2">
                      <div className="text-[11px] font-bold text-[#68756F] uppercase tracking-wider font-mono">
                        Sources Retrieved from Notes ({noteAnswer.sources.length}):
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {noteAnswer.sources.map((src, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5EBE7] text-[11px] space-y-1 shadow-xs"
                          >
                            <div className="flex items-center justify-between font-bold text-[#17231F]">
                              <span>Page {src.pageNumber}</span>
                              <span className="font-mono text-[#18A673]">
                                {(src.similarity * 100).toFixed(0)}% match
                              </span>
                            </div>
                            <p className="text-[#68756F] line-clamp-2 italic">
                              "{src.snippet}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up action chips */}
                  {noteAnswer.followUpButtons && noteAnswer.followUpButtons.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] font-mono text-[#68756F] mr-1">Follow up:</span>
                      {noteAnswer.followUpButtons.map((btn, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNoteQuery(btn.prompt);
                            handleAskNotes(undefined, btn.prompt);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#E5EBE7] hover:border-[#18A673] hover:text-[#18A673] text-[11px] text-[#17231F] transition-colors cursor-pointer shadow-xs"
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE 2: SOLVE PROBLEM (STEP-BY-STEP WORKFLOW) */}
          {/* ============================================================== */}
          {interactionMode === 'solve' && (
            <div className="space-y-4">
              <div className="bg-[#E8F7F0]/30 border border-[#18A673]/30 rounded-xl p-3 text-xs text-[#17231F] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#18A673]" />
                  <span className="font-bold">Step-by-Step Problem Solving Workflow</span>
                </div>
                <span className="text-[10px] font-mono text-[#18A673] font-bold uppercase">
                  Notes-Grounded Reasoning
                </span>
              </div>

              {/* Sample Problem Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#68756F] font-mono uppercase">
                  Select Sample University Problem:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sampleProblems.map((sp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setProblemStatement(sp.problem);
                        handleSolveProblem(undefined, sp.problem);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#F8FAF7] hover:bg-[#E8F7F0] border border-[#E5EBE7] hover:border-[#18A673] text-xs font-semibold text-[#17231F] hover:text-[#18A673] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[#18A673]" />
                      <span>{sp.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Problem Statement Large Textarea */}
              <form onSubmit={handleSolveProblem} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#17231F] block mb-1">
                    Problem Statement:
                  </label>
                  <textarea
                    rows={4}
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Enter full problem statement or numerical question here (e.g. 'Given data points A(2,10), B(2,5), C(8,4), D(5,8) and initial centroids m1=(2,10), m2=(2,5), solve the cluster assignment and compute new centroids for k=2', 'Solve recurrence T(n) = 2T(n/2) + n using Master Theorem')..."
                    className="w-full bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-4 text-xs text-[#17231F] placeholder-[#68756F]/60 focus:outline-none focus:border-[#18A673] focus:bg-white transition-colors shadow-inner"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#68756F]">
                    Searches formulas &amp; theorems in "{activeDoc.name}" to solve step-by-step.
                  </span>
                  <button
                    type="submit"
                    disabled={isSolving || !problemStatement.trim()}
                    className="px-6 py-3 bg-[#18A673] hover:bg-[#18A673]/90 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>SOLVE PROBLEM</span>
                  </button>
                </div>
              </form>

              {/* Solving Spinner */}
              {isSolving && (
                <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#E5EBE7] text-xs text-[#68756F] flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-[#18A673] border-t-transparent animate-spin" />
                  <div>
                    <div className="font-bold text-[#17231F]">
                      Retrieving relevant concepts &amp; solving problem step-by-step...
                    </div>
                    <div className="text-[11px] text-[#68756F]">
                      Executing 8-step pipeline: Understand → Search Notes → Apply Formula → Step-by-Step Resolution.
                    </div>
                  </div>
                </div>
              )}

              {/* Problem Solution Presentation */}
              {problemSolution && (
                <div className="space-y-4 pt-2">
                  {/* Top Summary Banner */}
                  <div className="p-4 rounded-2xl bg-[#E8F7F0] border border-[#18A673]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-mono text-[#18A673] font-bold uppercase">
                        Identified Concept &amp; Topic
                      </div>
                      <h4 className="text-sm font-bold text-[#17231F]">
                        {problemSolution.identifiedTopic}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const fullText = `Problem: ${problemSolution.problemStatement}\n\nFinal Answer:\n${problemSolution.finalAnswer}\n\nSteps:\n${problemSolution.steps.map((s) => `Step ${s.stepNumber}: ${s.title}\n${s.explanation}\n${s.mathOrCode || ''}`).join('\n\n')}`;
                          navigator.clipboard.writeText(fullText);
                          setCopiedSolution(true);
                          setTimeout(() => setCopiedSolution(false), 2000);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#E5EBE7] text-xs font-semibold text-[#17231F] hover:bg-[#F0F8F4] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        {copiedSolution ? <Check className="w-3.5 h-3.5 text-[#18A673]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSolution ? 'Copied' : 'Copy Solution'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. Problem Understanding */}
                  <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5EBE7] space-y-1.5 shadow-xs">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#FF6B5F]">
                      1. Problem Understanding
                    </span>
                    <p className="text-xs text-[#17231F] leading-relaxed">
                      {problemSolution.understanding}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {problemSolution.relevantConcepts.map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#F8FAF7] border border-[#E5EBE7] text-[10px] font-mono text-[#68756F]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 2. Step-by-Step Resolution Cards */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-[#17231F] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#18A673]" />
                      <span>Step-by-Step Solution Breakdown:</span>
                    </div>

                    {problemSolution.steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5EBE7] space-y-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-[#17231F] flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#18A673] text-white text-[11px] font-bold flex items-center justify-center">
                              {step.stepNumber}
                            </span>
                            <span>{step.title}</span>
                          </h5>
                          {step.noteCitation && (
                            <span className="text-[10px] font-mono text-[#18A673] font-medium bg-[#E8F7F0] px-2 py-0.5 rounded-md border border-[#18A673]/20">
                              {step.noteCitation}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#68756F] whitespace-pre-line leading-relaxed">
                          {step.explanation}
                        </p>

                        {step.mathOrCode && (
                          <div className="p-3 rounded-lg bg-[#F8FAF7] border border-[#E5EBE7] font-mono text-xs text-[#17231F] whitespace-pre-line shadow-inner">
                            {step.mathOrCode}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 3. Highlighted Final Answer */}
                  <div className="p-5 rounded-2xl bg-[#E8F7F0] border-2 border-[#18A673] space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase font-mono text-[#18A673] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#18A673]" />
                        <span>Final Solution &amp; Answer</span>
                      </span>
                      <span className="text-[10px] font-mono text-[#68756F]">
                        Verified by Local Mathematical Rules
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white border border-[#18A673]/40 text-xs text-[#17231F] font-bold whitespace-pre-line leading-relaxed font-mono">
                      {problemSolution.finalAnswer}
                    </div>
                  </div>

                  {/* 4. Student-Friendly Advice & Exam Tips */}
                  <div className="p-4 rounded-xl bg-[#FEF7EA] border border-[#F4B942]/40 text-xs space-y-1">
                    <div className="font-bold text-[#F4B942] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>STUDENT EXAM STRATEGY</span>
                    </div>
                    <p className="text-[11px] text-[#17231F] leading-relaxed">
                      {problemSolution.studentFriendlySummary}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Generated Study Pack */}
      {studyPack && (
        <div className="p-6 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E5EBE7] pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#FF6B5F] uppercase font-bold">
                Autonomous 9-in-1 Study Pack
              </span>
              <h3 className="text-base font-bold text-[#17231F]">
                {studyPack.documentName}
              </h3>
            </div>
            <button
              onClick={() => {
                const md = JSON.stringify(studyPack, null, 2);
                navigator.clipboard.writeText(md);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#F8FAF7] text-[#17231F] hover:bg-[#F0F8F4] text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-[#E5EBE7] transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#18A673]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Study Pack'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Summary */}
            <div className="p-4.5 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7] space-y-2">
              <h4 className="font-bold text-[#18A673]">Executive Summary</h4>
              <ul className="space-y-1 text-[#17231F] list-disc list-inside">
                {studyPack.summary.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Formulas */}
            <div className="p-4.5 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7] space-y-2">
              <h4 className="font-bold text-[#F4B942]">Key Formulas &amp; Equations</h4>
              {studyPack.formulas.map((f, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-[#FFFFFF] font-mono text-[11px] text-[#17231F] border border-[#E5EBE7] shadow-xs">
                  <span className="font-bold text-[#F4B942]">{f.name}:</span> {f.formula}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manual upload modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E5EBE7] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-[#17231F]">
            <h3 className="text-base font-bold text-[#17231F]">Paste Lecture Notes</h3>
            <div>
              <label className="text-xs text-[#68756F] font-bold block mb-1">Document Title</label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. DAA Unit 4 Notes.txt"
                className="w-full bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-3 text-xs text-[#17231F] focus:outline-none focus:border-[#18A673] focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-[#68756F] font-bold block mb-1">Text Content</label>
              <textarea
                rows={8}
                value={uploadText}
                onChange={(e) => setUploadText(e.target.value)}
                placeholder="Paste chapter notes, lecture summaries, or formulas..."
                className="w-full bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-3 text-xs text-[#17231F] font-mono focus:outline-none focus:border-[#18A673] focus:bg-white transition-colors"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#68756F] hover:text-[#17231F] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleManualAdd}
                className="px-5 py-2 bg-[#18A673] text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-[#18A673]/90 transition-colors shadow-sm"
              >
                Save &amp; Index
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
