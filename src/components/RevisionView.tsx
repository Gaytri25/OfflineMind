import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  Languages,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { localTutor } from '../services/localEngine';
import { FlashcardItem, ActiveTab } from '../types';

interface RevisionViewProps {
  onStartStudyTopic: (topic: string, subject: string, actionPrompt?: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const RevisionView: React.FC<RevisionViewProps> = ({
  onStartStudyTopic,
  setActiveTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'quick' | 'exam' | 'flashcards' | 'simplify'>('quick');
  const [topicInput, setTopicInput] = useState('K-Means Clustering');
  const [revisionOutput, setRevisionOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Flashcards state
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>(() =>
    localTutor.getFlashcards('K-Means Clustering')
  );
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Simplify text state
  const [heavyText, setHeavyText] = useState(
    'Support Vector Machines identify an optimal hyper-plane which maximizes the functional margin between bipartite training manifolds subject to Karush-Kuhn-Tucker saddle point conditions.'
  );
  const [simplifyLang, setSimplifyLang] = useState<'English' | 'Hindi' | 'Marathi'>('Marathi');
  const [simplifiedResult, setSimplifiedResult] = useState<string | null>(null);

  const handleGenerateRevision = async (mode: string) => {
    setIsLoading(true);
    setRevisionOutput(null);

    let prompt = `Quick revision of ${topicInput}`;
    if (mode === '1-minute') prompt = `Give me a 1-minute compressed exam revision of ${topicInput}`;
    if (mode === '2-mark') prompt = `Give me a 2-mark university answer for ${topicInput}`;
    if (mode === '5-mark') prompt = `Give me a 5-mark university answer for ${topicInput}`;
    if (mode === '10-mark') prompt = `Give me a 10-mark university answer for ${topicInput}`;
    if (mode === 'diagram') prompt = `Give me an ASCII architecture diagram for ${topicInput}`;

    try {
      const res = await localTutor.askTutor(prompt, false, 'English');
      setRevisionOutput(res.content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimplifyText = () => {
    if (!heavyText.trim()) return;
    if (simplifyLang === 'Marathi') {
      setSimplifiedResult(
        `सोप्या भाषेत स्पष्टीकरण (Simple Marathi):\n\n` +
        `• सोपा अर्थ: दोन वेगवेगळ्या गटांमध्ये अंतर ठेवणारी सर्वोत्तम रेषा (Border line) शोधणे म्हणजे SVM.\n` +
        `• दैनंदिन उदाहरण: मैदानात दोन संघांमध्ये खडूने अशी रेषा आखणे जी दोन्ही संघांच्या खेळाडूंपासून जास्तीत जास्त लांब असेल.\n` +
        `• परीक्षेसाठी टीप: तांत्रिक सूत्रांपेक्षा 'कमाल अंतर (Max Margin)' हा मुख्य शब्द उत्तरात लिहा.`
      );
    } else if (simplifyLang === 'Hindi') {
      setSimplifiedResult(
        `सरल हिंदी में व्याख्या (Simple Hindi):\n\n` +
        `• सरल अर्थ: दो अलग-अलग प्रकार के डेटा पॉइंट्स के बीच सबसे सुरक्षित विभाजन रेखा खोजना।\n` +
        `• वास्तविक उदाहरण: जैसे दो पड़ोसी राज्यों के बीच ऐसी सीमा बनाना जिससे दोनों तरफ पर्याप्त जगह बचे।\n` +
        `• परीक्षा टिप: 'हाइपरप्लेन' और 'मैक्सिमम मार्जिन' शब्द उत्तर में जरूर लिखें।`
      );
    } else {
      setSimplifiedResult(
        `Everyday Simple English:\n\n` +
        `• Core Meaning: Finding the widest possible street that separates two different neighborhoods of data.\n` +
        `• Real-World Metaphor: Like building a fence right down the middle so both sides have maximum clear space.\n` +
        `• Exam Tip: Remember the phrase "widest margin separator".`
      );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#17231F] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#F4B942]" />
            <span>Revision &amp; Exam Answer Studio</span>
          </h2>
          <p className="text-xs text-[#68756F] mt-0.5">
            1-minute summaries, 2/5/10 mark model answers, interactive flashcards, and language simplification.
          </p>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1 bg-[#F8FAF7] border border-[#E5EBE7] p-1 rounded-xl text-xs overflow-x-auto shadow-xs">
          <button
            onClick={() => setActiveSubTab('quick')}
            className={`px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors font-semibold ${
              activeSubTab === 'quick' ? 'bg-[#FFFFFF] text-[#F4B942] font-bold border border-[#E5EBE7] shadow-xs' : 'text-[#68756F] hover:text-[#17231F]'
            }`}
          >
            Quick Revision
          </button>
          <button
            onClick={() => setActiveSubTab('exam')}
            className={`px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors font-semibold ${
              activeSubTab === 'exam' ? 'bg-[#FFFFFF] text-[#18A673] font-bold border border-[#E5EBE7] shadow-xs' : 'text-[#68756F] hover:text-[#17231F]'
            }`}
          >
            Exam Answers (2/5/10 Marks)
          </button>
          <button
            onClick={() => setActiveSubTab('flashcards')}
            className={`px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors font-semibold ${
              activeSubTab === 'flashcards' ? 'bg-[#FFFFFF] text-[#18A673] font-bold border border-[#E5EBE7] shadow-xs' : 'text-[#68756F] hover:text-[#17231F]'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setActiveSubTab('simplify')}
            className={`px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors font-semibold ${
              activeSubTab === 'simplify' ? 'bg-[#FFFFFF] text-[#18A673] font-bold border border-[#E5EBE7] shadow-xs' : 'text-[#68756F] hover:text-[#17231F]'
            }`}
          >
            Simplify Jargon
          </button>
        </div>
      </div>

      {/* 1. Quick Revision Subtab */}
      {activeSubTab === 'quick' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] space-y-3 shadow-sm">
            <label className="text-xs font-bold text-[#17231F] block">Topic to Revise</label>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. K-Means Clustering, QuickSort, PCA..."
                className="w-full sm:flex-1 bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl px-4 py-2.5 text-xs text-[#17231F] focus:outline-none focus:border-[#18A673] focus:bg-white transition-colors"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleGenerateRevision('quick')}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-[#F4B942] hover:bg-[#e0a635] text-[#17231F] font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  Standard Revision
                </button>
                <button
                  onClick={() => handleGenerateRevision('1-minute')}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#F0F8F4] text-[#17231F] font-bold text-xs rounded-xl cursor-pointer border border-[#E5EBE7] hover:border-[#18A673] transition-colors shadow-xs"
                >
                  1-Minute Cram
                </button>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="p-8 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] text-center text-xs text-[#68756F] shadow-sm">
              <div className="w-5 h-5 rounded-full border-2 border-[#18A673] border-t-transparent animate-spin mx-auto mb-2" />
              <span>Synthesizing compressed revision notes locally...</span>
            </div>
          )}

          {revisionOutput && (
            <div className="p-6 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE7]">
                <span className="text-xs font-bold text-[#F4B942] font-mono">
                  REVISION NOTE: {topicInput}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(revisionOutput);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-[#68756F] hover:text-[#17231F] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#18A673]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="whitespace-pre-line text-xs text-[#17231F] font-sans leading-relaxed bg-[#F8FAF7] p-4.5 rounded-xl border border-[#E5EBE7]">
                {revisionOutput}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Exam Answer Generator Subtab */}
      {activeSubTab === 'exam' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] space-y-4 shadow-sm">
            <label className="text-xs font-bold text-[#17231F] block">Select Mark Scheme for Topic: {topicInput}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => handleGenerateRevision('2-mark')}
                className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7] hover:border-[#18A673] hover:bg-[#E8F7F0]/40 text-left cursor-pointer transition-all shadow-xs"
              >
                <span className="text-xs font-bold text-[#18A673] block">2 Marks</span>
                <span className="text-[10px] text-[#68756F] block mt-0.5">Definition &amp; Core Law</span>
              </button>
              <button
                onClick={() => handleGenerateRevision('5-mark')}
                className="p-3.5 rounded-xl bg-[#E8F7F0] border border-[#18A673]/30 text-left cursor-pointer transition-all shadow-xs"
              >
                <span className="text-xs font-bold text-[#18A673] block">5 Marks</span>
                <span className="text-[10px] text-[#17231F] block mt-0.5 font-medium">Standard Steps + Formula</span>
              </button>
              <button
                onClick={() => handleGenerateRevision('10-mark')}
                className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7] hover:border-[#FF6B5F] hover:bg-[#FFF0EF]/40 text-left cursor-pointer transition-all shadow-xs"
              >
                <span className="text-xs font-bold text-[#FF6B5F] block">10 Marks</span>
                <span className="text-[10px] text-[#68756F] block mt-0.5">Full Architecture + Proofs</span>
              </button>
              <button
                onClick={() => handleGenerateRevision('diagram')}
                className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7] hover:border-[#F4B942] hover:bg-[#FEF7EA]/40 text-left cursor-pointer transition-all shadow-xs"
              >
                <span className="text-xs font-bold text-[#F4B942] block">Add Diagram</span>
                <span className="text-[10px] text-[#68756F] block mt-0.5">ASCII Architecture Flow</span>
              </button>
            </div>
          </div>

          {revisionOutput && (
            <div className="p-6 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE7]">
                <span className="text-xs font-bold text-[#18A673] font-mono">
                  MODEL UNIVERSITY ANSWER
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartStudyTopic(topicInput, 'Data Science', `Quiz me on ${topicInput}`)}
                    className="px-3 py-1 rounded-lg bg-[#E8F7F0] text-[#18A673] text-[11px] font-bold border border-[#18A673]/30 hover:bg-[#18A673] hover:text-white cursor-pointer transition-colors shadow-xs"
                  >
                    Quiz Me on This
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(revisionOutput);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-xs text-[#68756F] hover:text-[#17231F] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#18A673]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="whitespace-pre-line text-xs text-[#17231F] font-mono leading-relaxed bg-[#F8FAF7] p-4.5 rounded-xl border border-[#E5EBE7]">
                {revisionOutput}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Flashcards Subtab */}
      {activeSubTab === 'flashcards' && (
        <div className="space-y-4 max-w-lg mx-auto py-2">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="h-60 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] p-6 flex flex-col justify-between cursor-pointer hover:border-[#18A673] transition-all shadow-md select-none card-hover-lift"
          >
            <div className="flex items-center justify-between text-xs text-[#68756F]">
              <span className="font-mono font-bold">Card {cardIdx + 1} of {flashcards.length}</span>
              <span className="text-[#18A673] text-[11px] font-bold">
                Click card to {isFlipped ? 'Show Question' : 'Reveal Answer'}
              </span>
            </div>

            <div className="text-center py-4">
              {!isFlipped ? (
                <div className="text-base font-bold text-[#17231F]">
                  {flashcards[cardIdx].front}
                </div>
              ) : (
                <div className="text-xs text-[#18A673] whitespace-pre-line leading-relaxed font-sans font-bold">
                  {flashcards[cardIdx].back}
                </div>
              )}
            </div>

            <div className="text-center text-[10px] text-[#68756F] font-mono">
              Active Recall · Tap to flip
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setCardIdx((prev) => Math.max(0, prev - 1));
                setIsFlipped(false);
              }}
              disabled={cardIdx === 0}
              className="px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E5EBE7] text-[#17231F] hover:bg-[#F8FAF7] text-xs font-bold disabled:opacity-30 cursor-pointer transition-colors shadow-xs"
            >
              Previous
            </button>

            <button
              onClick={() => {
                const updated = [...flashcards];
                updated[cardIdx].mastered = true;
                setFlashcards(updated);
                if (cardIdx < flashcards.length - 1) {
                  setCardIdx(cardIdx + 1);
                  setIsFlipped(false);
                }
              }}
              className="px-4 py-2 rounded-xl bg-[#E8F7F0] border border-[#18A673]/30 text-[#18A673] text-xs font-bold cursor-pointer hover:bg-[#18A673] hover:text-white transition-colors shadow-xs"
            >
              I Know This ✓
            </button>

            <button
              onClick={() => {
                if (cardIdx < flashcards.length - 1) {
                  setCardIdx(cardIdx + 1);
                  setIsFlipped(false);
                }
              }}
              disabled={cardIdx === 0 && cardIdx === flashcards.length - 1}
              className="px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E5EBE7] text-[#17231F] hover:bg-[#F8FAF7] text-xs font-bold disabled:opacity-30 cursor-pointer transition-colors shadow-xs"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* 4. Simplify Language Subtab */}
      {activeSubTab === 'simplify' && (
        <div className="p-6 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] space-y-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-[#17231F]">Convert Academic Jargon into Simple Language</h3>
            <p className="text-xs text-[#68756F]">
              Paste confusing textbook sentences and convert them to simple English, Marathi, or Hindi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-[#68756F] font-bold block">Complex Technical Text</label>
              <textarea
                rows={5}
                value={heavyText}
                onChange={(e) => setHeavyText(e.target.value)}
                className="w-full bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-3 text-xs text-[#17231F] font-mono focus:outline-none focus:border-[#18A673] focus:bg-white transition-colors shadow-inner"
              />

              <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#68756F] font-semibold">Target:</span>
                  <select
                    value={simplifyLang}
                    onChange={(e) => setSimplifyLang(e.target.value as any)}
                    className="bg-[#FFFFFF] border border-[#E5EBE7] rounded-xl px-2.5 py-1 text-xs text-[#17231F] font-semibold shadow-xs"
                  >
                    <option value="Marathi">सोपी मराठी (Simple Marathi)</option>
                    <option value="Hindi">सरल हिंदी (Simple Hindi)</option>
                    <option value="English">Simple Everyday English</option>
                  </select>
                </div>

                <button
                  onClick={handleSimplifyText}
                  className="px-4.5 py-2 bg-[#18A673] hover:bg-[#18A673]/90 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm"
                >
                  Simplify Locally
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[#68756F] font-bold block">Simplified Tutor Explanation</label>
              <div className="h-[145px] bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-3.5 text-xs text-[#18A673] font-medium overflow-y-auto whitespace-pre-line leading-relaxed shadow-inner">
                {simplifiedResult || (
                  <span className="text-[#68756F] italic font-normal">
                    Click 'Simplify Locally' to see everyday breakdown...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
