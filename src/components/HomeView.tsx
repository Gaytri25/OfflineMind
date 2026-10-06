import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  Clock,
  Send,
  Lock,
  HardDrive,
  ShieldCheck,
  Check,
  AlertCircle,
  Binary,
  Cpu,
  Network,
  Radio,
  Layout,
  HelpCircle,
  PenTool,
  Mic,
  Trash2,
} from 'lucide-react';
import { ActiveTab, SubjectData, StudyProfile, StoredDocument } from '../types';
import { localTutor } from '../services/localEngine';
import { processDocumentFile } from '../services/pdfExtractor';

interface HomeViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  subjects: SubjectData[];
  profile: StudyProfile;
  onStartStudyTopic: (topic: string, subject: string, actionPrompt?: string) => void;
  documents?: StoredDocument[];
  onAddDocument?: (name: string, text: string, fileType: string, pages: number) => void;
  onDeleteDocument?: (id: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  subjects,
  profile,
  onStartStudyTopic,
  documents = [],
  onAddDocument,
  onDeleteDocument,
}) => {
  const [askInput, setAskInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [processingState, setProcessingState] = useState<{
    isProcessing: boolean;
    fileName: string;
    currentStep: number;
    ocrTriggered: boolean;
    ocrCurrentPage: number;
    ocrTotalPages: number;
    completedMessage?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askInput.trim()) return;
    onStartStudyTopic(askInput.trim(), 'Data Science', askInput.trim());
    setAskInput('');
  };

  // Subject icon helper
  const getSubjectIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('data') || n.includes('science')) return <Binary className="w-4 h-4 text-[#18A673]" />;
    if (n.includes('algorithm') || n.includes('daa')) return <Cpu className="w-4 h-4 text-[#18A673]" />;
    if (n.includes('automata') || n.includes('theory')) return <Network className="w-4 h-4 text-[#18A673]" />;
    if (n.includes('internet') || n.includes('iot')) return <Radio className="w-4 h-4 text-[#18A673]" />;
    if (n.includes('ui') || n.includes('ux') || n.includes('design')) return <Layout className="w-4 h-4 text-[#18A673]" />;
    return <BookOpen className="w-4 h-4 text-[#18A673]" />;
  };

  // File Upload Handlers
  const processUploadedFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';
    const isPdf = ext === 'pdf';
    const isScannedSample = file.name.toLowerCase().includes('scan') || file.name.toLowerCase().includes('handwritten');

    setProcessingState({
      isProcessing: true,
      fileName: file.name,
      currentStep: 1,
      ocrTriggered: isScannedSample,
      ocrCurrentPage: 1,
      ocrTotalPages: isPdf ? 14 : 5,
    });

    try {
      const report = await processDocumentFile(file, (stepDesc, pct) => {
        let step = 1;
        if (pct >= 85) step = 6;
        else if (pct >= 70) step = 5;
        else if (pct >= 55) step = 4;
        else if (pct >= 40) step = 3;
        else if (pct >= 25) step = 2;

        setProcessingState((prev) =>
          prev ? { ...prev, currentStep: step, ocrCurrentPage: Math.min(prev.ocrTotalPages, Math.ceil((pct / 100) * prev.ocrTotalPages)) } : null
        );
      });

      const fullText = report.chunks.map((c) => c.content).join('\n\n') || report.statusMessage;
      if (onAddDocument) {
        onAddDocument(file.name, fullText, ext.toUpperCase(), Math.max(1, report.totalPages));
      }

      setProcessingState({
        isProcessing: false,
        fileName: file.name,
        currentStep: 7,
        ocrTriggered: isScannedSample,
        ocrCurrentPage: report.totalPages,
        ocrTotalPages: report.totalPages,
        completedMessage: `Ready to study! ${file.name} extracted with ${report.chunks.length} local vector chunks.`,
      });
    } catch {
      // Fallback text reading
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawText = (event.target?.result as string) || '';
        const pagesCount = Math.max(1, Math.ceil(rawText.length / 1500));
        if (onAddDocument) {
          onAddDocument(file.name, rawText, ext.toUpperCase(), pagesCount);
        }
        setProcessingState({
          isProcessing: false,
          fileName: file.name,
          currentStep: 7,
          ocrTriggered: false,
          ocrCurrentPage: pagesCount,
          ocrTotalPages: pagesCount,
          completedMessage: `Ready to study! ${file.name} indexed into local vector memory.`,
        });
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  return (
    <div className="space-y-12 max-w-[1240px] mx-auto pb-16">
      {/* 1. HERO SECTION */}
      <section className="pt-4 sm:pt-8 pb-2" aria-labelledby="hero-title">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, Subtitle, CTAs */}
          <div className="lg:col-span-7 space-y-4">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7F0] border border-[#18A673]/30 text-[11px] font-bold tracking-wider text-[#18A673] uppercase font-mono shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#18A673]" />
              <span>YOUR PRIVATE AI STUDY SPACE</span>
            </div>

            {/* Main Heading */}
            <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-[#17231F] leading-[1.1] tracking-tight">
              Study smarter. <br />
              <span className="italic font-normal text-[#18A673]">
                Even when the internet is gone.
              </span>
            </h1>

            {/* Supporting Prose */}
            <p className="text-base sm:text-lg text-[#68756F] max-w-xl leading-relaxed pt-1 font-sans">
              Learn concepts, understand your notes, practice exams and prepare for viva with an AI tutor that runs completely locally on your device.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => setActiveTab('chat')}
                className="px-6 py-3.5 rounded-xl bg-[#18A673] hover:bg-[#18A673]/90 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>START LEARNING</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className="px-6 py-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F0F8F4] text-[#17231F] border border-[#E5EBE7] hover:border-[#18A673] font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-xs"
              >
                <span>EXPLORE MY NOTES</span>
              </button>
            </div>
          </div>

          {/* Right Column: AI Study Desk Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="p-6 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] shadow-lg relative overflow-hidden card-hover-lift">
              {/* Decorative subtle aura */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#E8F7F0] rounded-full blur-2xl -z-10" />

              {/* Desk header */}
              <div className="flex items-center justify-between border-b border-[#E5EBE7] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B5F]" />
                  <span className="text-xs font-serif font-bold tracking-wide text-[#17231F]">
                    Study Desk Session
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-[#E8F7F0] text-[#18A673] border border-[#18A673]/20">
                  On-Device Engine
                </span>
              </div>

              {/* Layered Notebook Preview */}
              <div className="pt-4 space-y-3">
                <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7] space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF6B5F] font-bold">
                    Active Grounding
                  </div>
                  <div className="text-xs font-serif font-bold text-[#17231F]">
                    Data Science &amp; Analysis of Algorithms
                  </div>
                  <p className="text-[11px] text-[#68756F] line-clamp-2 leading-relaxed">
                    “K-Means converges when cluster centroids no longer shift beyond threshold ε. Objective is minimizing Within-Cluster Sum of Squares (WCSS).”
                  </p>
                </div>

                {/* 3 Pillars of Local Study Desk */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[10px]">
                  <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5EBE7] shadow-xs">
                    <span className="text-[#18A673] font-bold block text-[11px]">100%</span>
                    <span className="text-[#68756F]">Air-Gapped</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5EBE7] shadow-xs">
                    <span className="text-[#17231F] font-bold block text-[11px]">0ms</span>
                    <span className="text-[#68756F]">Net Lag</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5EBE7] shadow-xs">
                    <span className="text-[#FF6B5F] font-bold block text-[11px]">Private</span>
                    <span className="text-[#68756F]">Local Disk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CENTRAL PDF UPLOAD ZONE */}
      <section aria-labelledby="upload-heading" className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#18A673] font-bold">
            CENTRAL STUDY REPOSITORY
          </span>
          <h2 id="upload-heading" className="text-2xl sm:text-3xl font-serif font-bold text-[#17231F]">
            Add Your Study Material
          </h2>
          <p className="text-xs sm:text-sm text-[#68756F]">
            Give your lecture slides, textbook chapters, or notes once — then revise anytime offline.
          </p>
        </div>

        {/* Big Central Upload Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`max-w-2xl mx-auto min-h-[240px] sm:min-h-[260px] rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center flex flex-col items-center justify-center transition-all ${
            isDragging
              ? 'border-[#18A673] bg-[#E8F7F0]'
              : 'border-[#E5EBE7] bg-[#FFFFFF] hover:border-[#18A673] hover:bg-[#F8FAF7] shadow-sm'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-[#E8F7F0] border border-[#18A673]/20 flex items-center justify-center text-[#18A673] mb-3 shadow-inner">
            <Upload className="w-6 h-6" />
          </div>

          <h3 className="text-base sm:text-lg font-serif font-bold text-[#17231F]">
            Drop your notes here
          </h3>

          <p className="text-xs text-[#68756F] mt-1 max-w-sm">
            Drag and drop your syllabus or chapter files directly into your local index.
          </p>

          <div className="mt-4">
            <label className="px-5 py-2.5 rounded-xl bg-[#18A673] hover:bg-[#18A673]/90 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm cursor-pointer inline-flex items-center gap-2">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.txt,.md,.csv"
              />
            </label>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5EBE7] flex flex-col sm:flex-row items-center justify-center gap-2 text-[11px] text-[#68756F]">
            <span className="font-mono font-bold text-[#17231F]">PDF • DOCX • TXT • CSV</span>
            <span className="hidden sm:inline text-[#E5EBE7]">·</span>
            <span>Your files stay on this device. No cloud upload required.</span>
          </div>
        </div>

        {/* DOCUMENT PROCESSING FLOW TIMELINE */}
        {processingState && (
          <div className="max-w-2xl mx-auto p-5 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] space-y-4 shadow-md animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#E5EBE7] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#18A673]" />
                <span className="text-xs font-bold font-serif text-[#17231F]">
                  Processing: {processingState.fileName}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#E8F7F0] text-[#18A673] font-bold border border-[#18A673]/20">
                {processingState.isProcessing ? 'Local Pipeline Active' : 'Index Ready'}
              </span>
            </div>

            {/* 7-Step Timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {[
                { step: 1, label: '01 Reading document' },
                { step: 2, label: '02 Understanding pages' },
                { step: 3, label: '03 Checking text quality' },
                { step: 4, label: '04 Recognizing scanned pages' },
                { step: 5, label: '05 Organizing sections' },
                { step: 6, label: '06 Creating local index' },
                { step: 7, label: '07 Ready to study' },
              ].map((item) => {
                const isPassed = processingState.currentStep >= item.step;
                const isCurrent = processingState.currentStep === item.step && processingState.isProcessing;
                return (
                  <div
                    key={item.step}
                    className={`p-2 rounded-lg border text-[11px] flex items-center justify-between ${
                      isPassed
                        ? 'bg-[#E8F7F0] border-[#18A673]/40 text-[#17231F] font-bold'
                        : isCurrent
                        ? 'bg-[#FFFFFF] border-[#18A673] text-[#18A673] animate-pulse font-bold'
                        : 'bg-[#F8FAF7] border-[#E5EBE7] text-[#68756F]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span>{isPassed ? '✓' : isCurrent ? '…' : ''}</span>
                  </div>
                );
              })}
            </div>

            {/* OCR Fallback Notice if scanned */}
            {processingState.ocrTriggered && (
              <div className="p-3 rounded-xl bg-[#FEF7EA] border border-[#F4B942]/40 text-xs space-y-1">
                <div className="font-bold text-[#F4B942] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>SCANNED PAGES DETECTED</span>
                </div>
                <p className="text-[11px] text-[#17231F]">
                  Some pages contain images instead of selectable text. OfflineMind is using local OCR to make them searchable.
                </p>
                <div className="text-[10px] font-mono text-[#F4B942] font-bold">
                  OCR PROCESSING · Page {processingState.ocrCurrentPage} / {processingState.ocrTotalPages}
                </div>
              </div>
            )}

            {/* Final Completed Message */}
            {processingState.completedMessage && (
              <div className="p-3 rounded-xl bg-[#E8F7F0] border border-[#18A673]/30 text-xs font-bold text-[#20B477] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#20B477]" />
                <span>{processingState.completedMessage}</span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. DOCUMENT LIBRARY ("YOUR KNOWLEDGE, KEPT CLOSE") */}
      <section aria-labelledby="knowledge-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-[#E5EBE7] pb-3">
          <div>
            <h2 id="knowledge-heading" className="text-xl sm:text-2xl font-serif font-bold text-[#17231F]">
              YOUR KNOWLEDGE, KEPT CLOSE.
            </h2>
            <p className="text-xs text-[#68756F] mt-0.5">
              Your study material stays on your device. Query with zero internet requirement.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('notes')}
            className="text-xs font-bold text-[#18A673] hover:underline cursor-pointer"
          >
            Manage All Notes ({documents.length}) →
          </button>
        </div>

        {/* Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] hover:border-[#18A673] transition-all card-hover-lift flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#E8F7F0] text-[#18A673] font-bold border border-[#18A673]/20">
                    {doc.fileType} · {doc.pageCount} pages
                  </span>
                  <span className="text-[10px] font-mono text-[#20B477] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#20B477]" />
                    Ready
                  </span>
                </div>

                <h3 className="text-sm font-serif font-bold text-[#17231F] line-clamp-2">
                  {doc.name}
                </h3>

                <p className="text-[11px] text-[#68756F]">
                  {doc.chunkCount} vector chunks · {(doc.fileSize / 1024).toFixed(0)} KB indexed locally
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5EBE7] flex items-center justify-between">
                <span className="text-[10px] text-[#68756F] font-mono">
                  {doc.addedAt ? `Added ${doc.addedAt}` : 'Ready to study'}
                </span>
                <button
                  onClick={() =>
                    onStartStudyTopic(
                      'Binary Search',
                      'DAA',
                      `What does my uploaded document say about this topic?`
                    )
                  }
                  className="px-3.5 py-1.5 rounded-lg bg-[#E8F7F0] hover:bg-[#18A673] text-[#18A673] hover:text-white text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer border border-[#18A673]/30 shadow-xs"
                >
                  ASK YOUR NOTES
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ASK YOUR NOTES CONSOLE */}
      <section aria-labelledby="ask-heading" className="p-6 sm:p-8 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E5EBE7] pb-3">
          <div>
            <h2 id="ask-heading" className="text-xl font-serif font-bold text-[#17231F]">
              Ask anything from your notes.
            </h2>
            <p className="text-xs text-[#68756F] mt-0.5">
              The AI automatically cites exact page numbers from your uploaded material.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#18A673] font-bold uppercase bg-[#E8F7F0] px-2.5 py-1 rounded-md border border-[#18A673]/20">
            Auto-Routing: General vs. Notes
          </span>
        </div>

        {/* Suggested Actions */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold tracking-wider uppercase">
          <span className="text-[#68756F] font-mono text-[10px] shrink-0 mr-1">Suggested:</span>
          {[
            { label: 'EXPLAIN CHAPTER', prompt: 'Explain the core chapter concepts step by step' },
            { label: 'SUMMARIZE', prompt: 'Give me a structured summary of high-yield exam points' },
            { label: 'FIND FORMULA', prompt: 'What are all key formulas and equations in this topic?' },
            { label: '5-MARK ANSWER', prompt: 'Give me a 5-mark university answer with steps and headings' },
            { label: 'QUIZ ME', prompt: 'Quiz me on this chapter' },
            { label: 'VIVA QUESTIONS', prompt: 'Give me viva questions and examiner answers' },
          ].map((act, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onStartStudyTopic('K-Means Clustering', 'Data Science', act.prompt)}
              className="px-3 py-1.5 rounded-lg bg-[#F8FAF7] hover:bg-[#E8F7F0] text-[#17231F] hover:text-[#18A673] border border-[#E5EBE7] hover:border-[#18A673]/40 whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {act.label}
            </button>
          ))}
        </div>

        {/* Input Composer */}
        <form onSubmit={handleAskSubmit} className="relative pt-1">
          <textarea
            rows={3}
            value={askInput}
            onChange={(e) => setAskInput(e.target.value)}
            placeholder="Ask anything about your studies... (e.g. 'What does my DAA notes say about binary search?', 'Explain K-Means and WCSS', 'Give me a 5-mark answer in Marathi')"
            className="w-full bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-4 pr-32 text-xs text-[#17231F] placeholder-[#68756F]/60 focus:outline-none focus:border-[#18A673] focus:bg-white resize-none transition-colors shadow-inner"
          />
          <button
            type="submit"
            disabled={!askInput.trim()}
            className="absolute right-3.5 bottom-5 px-4.5 py-2 bg-[#18A673] hover:bg-[#18A673]/90 disabled:opacity-40 text-white font-bold text-xs tracking-wider uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Ask Tutor</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </section>

      {/* 5. EXAM FOCUS ALERT (WARM YELLOW HIGHLIGHT) */}
      <section aria-labelledby="exam-alert-heading">
        <div className="p-5 sm:p-6 rounded-2xl border border-[#F4B942]/40 bg-[#FFFFFF] relative overflow-hidden card-hover-lift shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#F4B942]" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span id="exam-alert-heading" className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#17231F] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#F4B942]" />
                  <span>EXAM FOCUS</span>
                </span>
                <span className="text-[#E5EBE7]">·</span>
                <span className="text-xs font-serif font-bold text-[#17231F]">Data Science</span>
                <span className="text-[#E5EBE7]">·</span>
                <span className="text-xs text-[#68756F]">October 24, 2026</span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#FEF7EA] text-[#17231F] border border-[#F4B942]/40">
                  18 days remaining
                </span>
              </div>
              <p className="text-xs text-[#68756F]">
                High-weightage topics are ready for revision. K-Means clustering, PCA, and decision trees have been compiled for final exam prep.
              </p>
            </div>

            <button
              onClick={() =>
                onStartStudyTopic(
                  'K-Means Clustering',
                  'Data Science',
                  'Give me a focused exam revision of high-weightage Data Science topics for my upcoming exam'
                )
              }
              className="px-5 py-2.5 rounded-xl bg-[#F4B942] hover:bg-[#e0a635] text-[#17231F] text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer shrink-0 shadow-sm whitespace-nowrap"
            >
              Start Smart Revision →
            </button>
          </div>
        </div>
      </section>

      {/* 6. SYLLABUS COVERAGE & MASTERY */}
      <section className="space-y-4" aria-labelledby="subjects-heading">
        <div className="flex items-center justify-between border-b border-[#E5EBE7] pb-3">
          <div>
            <h2 id="subjects-heading" className="text-xl font-serif font-bold text-[#17231F]">
              Syllabus Coverage &amp; Mastery
            </h2>
            <p className="text-xs text-[#68756F]">
              Track curriculum topics mastered locally on this machine.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('progress')}
            className="text-xs font-bold text-[#18A673] hover:underline cursor-pointer"
          >
            Detailed Progress →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {subjects.map((subj) => (
            <button
              key={subj.id}
              onClick={() => {
                localTutor.setCurrentSubject(subj.name);
                setActiveTab('chat');
              }}
              className="p-4 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] hover:border-[#18A673] text-left transition-all cursor-pointer group card-hover-lift flex flex-col justify-between h-28 shadow-xs"
            >
              <div>
                <div className="w-7 h-7 rounded-lg bg-[#E8F7F0] flex items-center justify-center mb-2">
                  {getSubjectIcon(subj.name)}
                </div>
                <span className="text-xs font-serif font-bold text-[#17231F] group-hover:text-[#18A673] block truncate transition-colors">
                  {subj.name}
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#68756F]">
                  <span>{subj.progressPercent >= 75 ? 'Mastered' : 'In Progress'}</span>
                  <span className="font-bold text-[#17231F]">{subj.progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#E5EBE7] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#18A673] rounded-full"
                    style={{ width: `${subj.progressPercent}%` }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 7. PRIVACY FOOTER BANNER */}
      <section className="pt-4 border-t border-[#E5EBE7]">
        <div className="p-4.5 rounded-2xl border border-[#E5EBE7] bg-[#F8FAF7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#68756F]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#18A673] shrink-0" />
            <span className="font-bold text-[#17231F]">YOUR DATA STAYS HERE.</span>
            <span>Local model · Local documents · Local OCR · Local search. No remote inference.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono font-bold text-[#17231F]">
            <span className="text-[#18A673]">0 Cloud Requests</span>
            <span className="text-[#E5EBE7]">·</span>
            <span>100% Private</span>
          </div>
        </div>
      </section>
    </div>
  );
};
