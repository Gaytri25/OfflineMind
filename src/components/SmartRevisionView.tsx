import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RotateCcw,
  Zap,
  GraduationCap,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { localEngine } from '../services/localEngine';

export const SmartRevisionView: React.FC = () => {
  const subjects = [
    'Data Science & ML',
    'Design & Analysis of Algorithms (DAA)',
    'Automata Theory (FLAT)',
    'Internet of Things (IoT)',
    'UI/UX Design Systems',
    'Custom Subject',
  ];

  const modes = [
    { id: 'Quick Revision', label: 'Quick Revision', icon: '⚡' },
    { id: 'Explain Simply', label: 'Explain Like a Teacher', icon: '👨‍🏫' },
    { id: '5-Mark Answer', label: '5-Mark Answer', icon: '📝' },
    { id: '10-Mark Answer', label: '10-Mark Answer', icon: '📑' },
    { id: 'Important Questions', label: 'Important Questions', icon: '🎯' },
    { id: 'MCQ Test', label: 'MCQ Test (Quiz)', icon: '🔘' },
    { id: 'Viva Mode', label: 'Viva Oral Exam', icon: '🎙️' },
    { id: 'Flashcards', label: 'Flashcards', icon: '🎴' },
  ];

  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [customSubject, setCustomSubject] = useState('');
  const [selectedMode, setSelectedMode] = useState('Quick Revision');
  const [topicPrompt, setTopicPrompt] = useState('K-Means Clustering');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // MCQ state
  const [mcqAnswers, setMcqAnswers] = useState<{ [index: number]: number }>({});
  const [showMcqResults, setShowMcqResults] = useState(false);

  const sampleTopics: { [subj: string]: string[] } = {
    'Data Science & ML': ['K-Means Clustering', 'Principal Component Analysis (PCA)', 'Bias-Variance Tradeoff', 'Support Vector Machines'],
    'Design & Analysis of Algorithms (DAA)': ['QuickSort Partitioning', 'Bellman-Ford Algorithm', '0/1 Knapsack vs Fractional', 'Master Theorem'],
    'Automata Theory (FLAT)': ['DFA Minimization', 'Pumping Lemma for Regular Languages', 'Turing Machine Halting Problem', 'Context-Free Grammars'],
    'Internet of Things (IoT)': ['MQTT vs CoAP Architecture', 'Sensor Node Power Management', 'Edge Gateway Protocols', 'BLE Beacon Tracking'],
    'UI/UX Design Systems': ['Visual Hierarchy & Contrast', 'Design Tokens & Typography', 'Fitts’s Law & Affordance', 'Micro-interactions'],
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedOutput(null);
    setIsFlipped(false);
    setFlashcardIndex(0);
    setMcqAnswers({});
    setShowMcqResults(false);

    const activeSubjectName = selectedSubject === 'Custom Subject' ? customSubject || 'Computer Science' : selectedSubject;

    try {
      if (selectedMode === 'MCQ Test' || selectedMode === 'Flashcards' || selectedMode === 'Viva Mode') {
        // Will render specialized interactive widgets below
        setGeneratedOutput('READY');
      } else {
        const query = `${selectedMode} for topic: "${topicPrompt}" in subject: "${activeSubjectName}"`;
        const res = await localEngine.askQuestion(query, false, 'English', selectedMode);
        setGeneratedOutput(res.content);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedOutput) {
      navigator.clipboard.writeText(generatedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Preset interactive study data
  const sampleFlashcards = [
    { front: `What is the objective function of ${topicPrompt}?`, back: 'Minimizing Within-Cluster Sum of Squares (WCSS / Inertia): Σ Σ ||x - μ_i||²' },
    { front: `What are the stopping criteria for ${topicPrompt}?`, back: '1. Centroid coordinates stabilize.\n2. Maximum predefined iterations reached.\n3. Convergence below tolerance threshold.' },
    { front: `How do you select the optimal k in ${topicPrompt}?`, back: 'Use the Elbow Method (identifying the inflection point on the WCSS curve) and Silhouette Analysis.' },
    { front: `Is ${topicPrompt} sensitive to outliers and scaling?`, back: 'Yes! Euclidean distance requires feature standardization (zero mean, unit variance) to prevent high-scale features from dominating.' },
  ];

  const sampleMCQs = [
    {
      q: `Which distance metric does standard ${topicPrompt} typically minimize?`,
      opts: ['Manhattan Distance', 'Euclidean Distance (Squared)', 'Cosine Similarity', 'Hamming Distance'],
      correct: 1,
      exp: 'K-Means optimizes the sum of squared Euclidean distances (WCSS) between points and cluster centroids.',
    },
    {
      q: 'What is the theoretical time complexity per iteration of K-Means?',
      opts: ['O(n * k * d)', 'O(n²)', 'O(k * log n)', 'O(d!)'],
      correct: 0,
      exp: 'Where n is the number of points, k is number of clusters, and d is the dimensionality.',
    },
    {
      q: 'Which technique is recommended to avoid poor random initialization in K-Means?',
      opts: ['Gradient Clipping', 'K-Means++', 'Dropout', 'Batch Normalization'],
      correct: 1,
      exp: 'K-Means++ seeds initial centroids spread far apart, accelerating convergence and avoiding poor local minima.',
    },
  ];

  const sampleVivaQuestions = [
    { q: 'Can K-Means discover clusters of non-spherical or arbitrary shapes?', a: 'No, standard K-Means assumes convex, spherical clusters of roughly equal variance. For non-spherical clusters, DBSCAN or Spectral Clustering is preferred.' },
    { q: 'Why is K-Means called an unsupervised algorithm?', a: 'Because it partitions unlabeled data without requiring ground truth target classes or teacher guidance.' },
    { q: 'What happens if two centroids overlap during initialization?', a: 'They will attract the same neighborhood of points; K-Means++ prevents this by enforcing distance proportional probability during initialization.' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
            <GraduationCap className="w-4 h-4" />
            <span>MODULE 2 — SMART REVISION LAB</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">Study Assistant for University Students</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Turn your local syllabus notes into structured exam answers, viva defense cards, and interactive MCQs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Local Engine: Active</span>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-5">
        {/* Step 1: Subject Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">1. Select Subject</label>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedSubject === subj
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-xs'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          {selectedSubject === 'Custom Subject' && (
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="Enter custom course name (e.g. Distributed Operating Systems)..."
              className="mt-2 w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          )}
        </div>

        {/* Step 2: Mode Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">2. Select Study Format</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                className={`p-2.5 rounded-lg text-left text-xs transition-all cursor-pointer border ${
                  selectedMode === m.id
                    ? 'bg-blue-500/15 text-blue-300 border-blue-500/40 font-semibold shadow-xs'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800/80 hover:bg-slate-900/80'
                }`}
              >
                <div className="text-sm mb-1">{m.icon}</div>
                <div>{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Topic Prompt */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300">3. Topic / Concept to Revise</label>
            {sampleTopics[selectedSubject] && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span>Suggestions:</span>
                {sampleTopics[selectedSubject].slice(0, 3).map((st, i) => (
                  <button
                    key={i}
                    onClick={() => setTopicPrompt(st)}
                    className="text-blue-400 hover:underline cursor-pointer ml-1"
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="e.g. K-Means Clustering, QuickSort, DFA Minimization..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topicPrompt.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Offline Study Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isGenerating && (
        <div className="p-8 rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center space-y-3">
          <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400">Generating {selectedMode} using local model weights...</p>
        </div>
      )}

      {/* Generated Content Output */}
      {generatedOutput && !isGenerating && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-blue-400 font-semibold block">
                {selectedSubject} · {selectedMode}
              </span>
              <h3 className="text-base font-bold text-slate-100">{topicPrompt}</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Flashcards Mode */}
          {selectedMode === 'Flashcards' && (
            <div className="py-4 space-y-4 max-w-lg mx-auto">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="h-56 rounded-xl border border-slate-700 bg-slate-900/90 p-6 flex flex-col justify-between cursor-pointer hover:border-blue-500/50 transition-all shadow-md select-none"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono">Card {flashcardIndex + 1} of {sampleFlashcards.length}</span>
                  <span className="text-blue-400 text-[11px]">Click to {isFlipped ? 'Show Question' : 'Reveal Answer'}</span>
                </div>

                <div className="text-center py-4">
                  {!isFlipped ? (
                    <div className="text-sm font-semibold text-slate-100">
                      {sampleFlashcards[flashcardIndex].front}
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-300 whitespace-pre-line leading-relaxed">
                      {sampleFlashcards[flashcardIndex].back}
                    </div>
                  )}
                </div>

                <div className="text-center text-[10px] text-slate-500">
                  {isFlipped ? 'Tap to flip back' : 'Active recall practice'}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  disabled={flashcardIndex === 0}
                  onClick={() => {
                    setFlashcardIndex((prev) => Math.max(0, prev - 1));
                    setIsFlipped(false);
                  }}
                  className="px-3 py-1.5 rounded bg-slate-900 text-slate-300 disabled:opacity-40 cursor-pointer"
                >
                  Previous Card
                </button>
                <span className="text-slate-500 text-[11px]">Use arrows or click card</span>
                <button
                  disabled={flashcardIndex === sampleFlashcards.length - 1}
                  onClick={() => {
                    setFlashcardIndex((prev) => Math.min(sampleFlashcards.length - 1, prev + 1));
                    setIsFlipped(false);
                  }}
                  className="px-3 py-1.5 rounded bg-blue-600 text-white disabled:opacity-40 cursor-pointer"
                >
                  Next Card
                </button>
              </div>
            </div>
          )}

          {/* Interactive MCQ Quiz Mode */}
          {selectedMode === 'MCQ Test' && (
            <div className="space-y-5 py-2">
              {sampleMCQs.map((mcq, idx) => {
                const selected = mcqAnswers[idx];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === mcq.correct;

                return (
                  <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
                    <div className="text-xs font-semibold text-slate-200">
                      Q{idx + 1}. {mcq.q}
                    </div>

                    <div className="space-y-1.5">
                      {mcq.opts.map((opt, optIdx) => {
                        let optStyle = 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900';
                        if (isAnswered) {
                          if (optIdx === mcq.correct) {
                            optStyle = 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300 font-semibold';
                          } else if (selected === optIdx) {
                            optStyle = 'border-rose-500/50 bg-rose-500/15 text-rose-300';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isAnswered}
                            onClick={() => setMcqAnswers((prev) => ({ ...prev, [idx]: optIdx }))}
                            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs border transition-colors cursor-pointer flex items-center justify-between ${optStyle}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && optIdx === mcq.correct && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                            {isAnswered && selected === optIdx && optIdx !== mcq.correct && (
                              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="p-2.5 rounded bg-slate-950 text-[11px] text-slate-400 border border-slate-800">
                        <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                          {isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}
                        </strong>
                        {mcq.exp}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Interactive Viva Mode */}
          {selectedMode === 'Viva Mode' && (
            <div className="space-y-4 py-2">
              <div className="text-xs text-slate-400 bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                🎙️ <strong>Viva Exam Simulation:</strong> The examiner asks unexpected practical edge-case questions. Review each question and formulate your mental answer before revealing the model answer.
              </div>

              {sampleVivaQuestions.map((vq, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
                  <div className="text-xs font-semibold text-blue-300">
                    Examiner Question {idx + 1}: "{vq.q}"
                  </div>
                  <div className="text-xs text-slate-300 pt-1 border-t border-slate-800/80 leading-relaxed">
                    <strong className="text-emerald-400 font-medium">Model Viva Answer: </strong>
                    {vq.a}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Standard Text Revision (Quick Revision, 5-Mark, 10-Mark, Explain Simply) */}
          {selectedMode !== 'Flashcards' && selectedMode !== 'MCQ Test' && selectedMode !== 'Viva Mode' && (
            <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line text-[12px]">
              {generatedOutput}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
