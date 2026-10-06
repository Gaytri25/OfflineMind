import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { QuizQuestionItem, ActiveTab } from '../types';
import { localTutor } from '../services/localEngine';

interface QuizViewProps {
  onStartStudyTopic: (topic: string, subject: string, actionPrompt?: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  onStartStudyTopic,
  setActiveTab,
}) => {
  const [topic, setTopic] = useState<string>(() => localTutor.getCurrentTopic());
  const [questions, setQuestions] = useState<QuizQuestionItem[]>(() =>
    localTutor.getQuizQuestions(localTutor.getCurrentTopic())
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answersLog, setAnswersLog] = useState<{ [qIdx: number]: boolean }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIndex];
  const isAnswered = selectedOpt !== null;
  const isCorrect = isAnswered && selectedOpt === currentQ?.correctAnswer;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    const correct = idx === currentQ.correctAnswer;
    if (correct) setScore((prev) => prev + 1);
    setAnswersLog((prev) => ({ ...prev, [currentIndex]: correct }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOpt(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = (newTopicName?: string) => {
    const t = newTopicName || topic;
    const qList = localTutor.getQuizQuestions(t);
    setTopic(t);
    setQuestions(qList);
    setCurrentIndex(0);
    setSelectedOpt(null);
    setScore(0);
    setAnswersLog({});
    setIsCompleted(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#17231F] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#18A673]" />
            <span>Interactive MCQ Exam Quiz</span>
          </h2>
          <p className="text-xs text-[#68756F] mt-0.5">
            Test your knowledge one question at a time with instant evaluations and targeted weak topic analysis.
          </p>
        </div>

        {/* Topic Selector */}
        <div className="flex items-center gap-2">
          <select
            value={topic}
            onChange={(e) => handleRestart(e.target.value)}
            className="bg-[#FFFFFF] border border-[#E5EBE7] rounded-xl px-3.5 py-2 text-xs text-[#17231F] cursor-pointer font-bold focus:border-[#18A673] transition-colors shadow-xs"
          >
            <option value="K-Means Clustering">K-Means Clustering</option>
            <option value="Principal Component Analysis (PCA)">Principal Component Analysis (PCA)</option>
            <option value="QuickSort & DAA Algorithms">QuickSort &amp; DAA Algorithms</option>
          </select>
        </div>
      </div>

      {!isCompleted && currentQ && (
        <div className="p-6 sm:p-8 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] space-y-6 shadow-md">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-[#68756F]">
            <span className="font-mono text-[#18A673] font-bold">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="w-36 h-2 bg-[#F8FAF7] rounded-full overflow-hidden border border-[#E5EBE7]">
              <div
                className="h-full bg-[#18A673] transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-[#17231F] leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              let optStyle = 'border-[#E5EBE7] bg-[#F8FAF7] hover:bg-[#F0F8F4] hover:border-[#18A673]/40 text-[#17231F]';
              if (isAnswered) {
                if (optIdx === currentQ.correctAnswer) {
                  optStyle = 'border-[#20B477] bg-[#E8F7F0] text-[#18A673] font-bold';
                } else if (selectedOpt === optIdx) {
                  optStyle = 'border-[#FF6B5F] bg-[#FFF0EF] text-[#FF6B5F] font-bold';
                } else {
                  optStyle = 'opacity-40 border-[#E5EBE7] bg-[#FFFFFF] text-[#68756F]';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between shadow-xs ${optStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#FFFFFF] border border-[#E5EBE7] flex items-center justify-center font-mono text-[11px] text-[#17231F] font-bold shrink-0 shadow-xs">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="font-medium">{opt}</span>
                  </div>

                  {isAnswered && optIdx === currentQ.correctAnswer && (
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#20B477] shrink-0" />
                  )}
                  {isAnswered && selectedOpt === optIdx && optIdx !== currentQ.correctAnswer && (
                    <XCircle className="w-4.5 h-4.5 text-[#FF6B5F] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant feedback explanation */}
          {isAnswered && (
            <div className={`p-4.5 rounded-xl border space-y-2 text-xs ${
              isCorrect ? 'bg-[#E8F7F0] border-[#18A673]/30' : 'bg-[#FFF0EF] border-[#FF6B5F]/30'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {isCorrect ? (
                  <span className="text-[#20B477] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4.5 h-4.5" /> Correct Answer!
                  </span>
                ) : (
                  <span className="text-[#FF6B5F] flex items-center gap-1.5">
                    <XCircle className="w-4.5 h-4.5" /> Incorrect
                  </span>
                )}
              </div>
              <p className="text-[#17231F] leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-[#18A673] hover:bg-[#18A673]/90 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'See Quiz Result'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quiz Result Screen */}
      {isCompleted && (
        <div className="p-8 sm:p-10 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] text-center space-y-6 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-[#E8F7F0] border border-[#18A673]/30 text-[#18A673] flex items-center justify-center mx-auto shadow-xs">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase text-[#18A673] tracking-wider font-bold">
              QUIZ COMPLETED
            </span>
            <h3 className="text-2xl font-extrabold text-[#17231F] mt-1">
              Your Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </h3>
            <p className="text-xs text-[#68756F] mt-1 max-w-md mx-auto">
              {score === questions.length
                ? 'Outstanding! You have mastered this topic for the university exam.'
                : 'Good attempt. Review the weak concepts below to ensure full marks.'}
            </p>
          </div>

          {/* Weak Topics Analysis */}
          <div className="p-4.5 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7] text-left space-y-2 max-w-md mx-auto">
            <span className="text-xs font-bold text-[#17231F] block">Identified Focus Areas:</span>
            <ul className="text-xs text-[#68756F] space-y-1 list-disc list-inside">
              <li>Centroid initialization &amp; K-Means++ heuristic</li>
              <li>Within-Cluster Sum of Squares (WCSS / Inertia) derivation</li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleRestart()}
              className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5EBE7] text-[#17231F] hover:bg-[#F8FAF7] text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>

            {/* Practice Weak Topics Button */}
            <button
              onClick={() =>
                onStartStudyTopic(
                  'K-Means Initialization & WCSS',
                  'Data Science',
                  `Teach me the weak topics from my quiz: Centroid initialization and WCSS formula`
                )
              }
              className="px-6 py-2.5 rounded-xl bg-[#18A673] hover:bg-[#18A673]/90 text-white text-xs font-bold cursor-pointer shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Practice Weak Topics</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
