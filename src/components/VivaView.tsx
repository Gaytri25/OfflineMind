import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Sparkles,
  Send,
  Award,
  ArrowRight,
  Mic,
} from 'lucide-react';
import { VivaQuestionItem, ActiveTab } from '../types';
import { localTutor } from '../services/localEngine';

interface VivaViewProps {
  onStartStudyTopic: (topic: string, subject: string, actionPrompt?: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const VivaView: React.FC<VivaViewProps> = ({
  onStartStudyTopic,
  setActiveTab,
}) => {
  const [topic, setTopic] = useState('K-Means Clustering');
  const [questions, setQuestions] = useState<VivaQuestionItem[]>(() =>
    localTutor.getVivaQuestions('K-Means Clustering')
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [studentInput, setStudentInput] = useState('');
  const [evaluation, setEvaluation] = useState<{ rating: 'correct' | 'partial' | 'incorrect'; feedback: string } | null>(null);
  const [answersLog, setAnswersLog] = useState<{ [idx: number]: 'correct' | 'partial' | 'incorrect' }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIdx];

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInput.trim() || evaluation) return;

    const result = localTutor.evaluateVivaAnswer(currentQ, studentInput);
    setEvaluation(result);
    setAnswersLog((prev) => ({ ...prev, [currentIdx]: result.rating }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setStudentInput('');
      setEvaluation(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    const fresh = localTutor.getVivaQuestions(topic);
    setQuestions(fresh);
    setCurrentIdx(0);
    setStudentInput('');
    setEvaluation(null);
    setAnswersLog({});
    setIsCompleted(false);
  };

  const correctCount = Object.values(answersLog).filter((r) => r === 'correct').length;
  const partialCount = Object.values(answersLog).filter((r) => r === 'partial').length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#17231F] flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#FF6B5F]" />
            <span>Viva Oral Examination Simulator</span>
          </h2>
          <p className="text-xs text-[#68756F] mt-0.5">
            The AI acts as your university external examiner. Answer oral questions and receive live evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#17231F] font-mono font-bold bg-[#F8FAF7] px-3 py-1 rounded-xl border border-[#E5EBE7] shadow-xs">
            Topic: {topic}
          </span>
        </div>
      </div>

      {!isCompleted && currentQ && (
        <div className="p-6 sm:p-8 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] space-y-6 shadow-md">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-[#68756F]">
            <span className="font-mono text-[#FF6B5F] font-bold">
              Viva Question {currentIdx + 1} of {questions.length}
            </span>
            <span className="text-[11px] text-[#68756F] font-mono font-semibold">
              Examiner Strictness: Standard Academic
            </span>
          </div>

          {/* Examiner question card */}
          <div className="p-5 rounded-2xl border border-[#FF6B5F]/30 bg-[#FFF0EF] space-y-2 shadow-xs">
            <div className="text-[11px] font-mono text-[#FF6B5F] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>Examiner Speaks:</span>
            </div>
            <h3 className="text-base font-bold text-[#17231F] leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Student response form */}
          {!evaluation ? (
            <form onSubmit={handleSubmitAnswer} className="space-y-3">
              <label className="text-xs text-[#17231F] block font-bold">
                Your Spoken / Written Defense:
              </label>
              <textarea
                rows={4}
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                placeholder="Type your oral answer concisely as you would explain to an examiner..."
                className="w-full bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-4 text-xs text-[#17231F] placeholder-[#68756F]/60 focus:outline-none focus:border-[#18A673] focus:bg-white font-sans transition-colors shadow-inner"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!studentInput.trim()}
                  className="px-6 py-3 bg-[#18A673] hover:bg-[#18A673]/90 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <span>Submit Defense</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Evaluation rating banner */}
              <div
                className={`p-4.5 rounded-xl border flex items-start gap-3 ${
                  evaluation.rating === 'correct'
                    ? 'border-[#18A673]/30 bg-[#E8F7F0] text-[#17231F]'
                    : evaluation.rating === 'partial'
                    ? 'border-[#F4B942]/40 bg-[#FEF7EA] text-[#17231F]'
                    : 'border-[#FF6B5F]/30 bg-[#FFF0EF] text-[#17231F]'
                }`}
              >
                {evaluation.rating === 'correct' && <CheckCircle2 className="w-5 h-5 text-[#20B477] shrink-0 mt-0.5" />}
                {evaluation.rating === 'partial' && <AlertTriangle className="w-5 h-5 text-[#F4B942] shrink-0 mt-0.5" />}
                {evaluation.rating === 'incorrect' && <XCircle className="w-5 h-5 text-[#FF6B5F] shrink-0 mt-0.5" />}
                <div className="text-xs leading-relaxed space-y-1">
                  <div className="font-bold">
                    {evaluation.rating === 'correct'
                      ? '✓ Fully Correct'
                      : evaluation.rating === 'partial'
                      ? '⚠ Partially Correct'
                      : '✗ Incorrect Defense'}
                  </div>
                  <div>{evaluation.feedback}</div>
                </div>
              </div>

              {/* Model Viva Answer */}
              <div className="p-4.5 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7] text-xs space-y-1.5">
                <span className="font-bold text-[#17231F] block">Expected Model Answer:</span>
                <p className="text-[#68756F] leading-relaxed">{currentQ.modelAnswer}</p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#18A673] hover:bg-[#18A673]/90 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <span>{currentIdx < questions.length - 1 ? 'Next Viva Question' : 'View Viva Report'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Viva Final Report Screen */}
      {isCompleted && (
        <div className="p-8 sm:p-10 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] text-center space-y-6 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF0EF] border border-[#FF6B5F]/30 text-[#FF6B5F] flex items-center justify-center mx-auto shadow-xs">
            <Mic className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase text-[#FF6B5F] tracking-wider font-bold">
              VIVA REPORT
            </span>
            <h3 className="text-2xl font-extrabold text-[#17231F] mt-1">
              Oral Defense Evaluation
            </h3>
            <p className="text-xs text-[#68756F] mt-1">
              Examiner assessment completed on localhost with zero network latency.
            </p>
          </div>

          {/* Metrics Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-4 rounded-xl border border-[#E5EBE7] bg-[#F8FAF7] shadow-xs">
              <span className="text-[10px] text-[#68756F] font-mono font-bold block uppercase">Knowledge Score</span>
              <div className="text-xl font-bold font-mono text-[#18A673] mt-1">
                {Math.round(((correctCount + partialCount * 0.5) / questions.length) * 100)}%
              </div>
            </div>
            <div className="p-4 rounded-xl border border-[#E5EBE7] bg-[#F8FAF7] shadow-xs">
              <span className="text-[10px] text-[#68756F] font-mono font-bold block uppercase">Attempted</span>
              <div className="text-xl font-bold font-mono text-[#17231F] mt-1">
                {questions.length} Questions
              </div>
            </div>
            <div className="p-4 rounded-xl border border-[#E5EBE7] bg-[#F8FAF7] shadow-xs">
              <span className="text-[10px] text-[#68756F] font-mono font-bold block uppercase">Fully Correct</span>
              <div className="text-xl font-bold font-mono text-[#20B477] mt-1">
                {correctCount}
              </div>
            </div>
            <div className="p-4 rounded-xl border border-[#E5EBE7] bg-[#F8FAF7] shadow-xs">
              <span className="text-[10px] text-[#68756F] font-mono font-bold block uppercase">Partial / Review</span>
              <div className="text-xl font-bold font-mono text-[#F4B942] mt-1">
                {partialCount}
              </div>
            </div>
          </div>

          {/* Weak Topics */}
          <div className="p-4.5 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7] text-left space-y-1.5 max-w-md mx-auto">
            <span className="text-xs font-bold text-[#17231F] block">Viva Preparation Advice:</span>
            <p className="text-xs text-[#68756F] leading-relaxed">
              Review arbitrary non-convex cluster limitations and explain distance metric sensitivity clearly when asked by the external examiner.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5EBE7] text-[#17231F] hover:bg-[#F8FAF7] text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Viva</span>
            </button>
            <button
              onClick={() =>
                onStartStudyTopic(
                  topic,
                  'Data Science',
                  `Teach me the theoretical viva edge-cases for ${topic}`
                )
              }
              className="px-6 py-2.5 rounded-xl bg-[#18A673] hover:bg-[#18A673]/90 text-white text-xs font-bold cursor-pointer shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Review with Tutor</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
