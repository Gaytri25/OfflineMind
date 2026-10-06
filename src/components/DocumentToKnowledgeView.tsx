import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ListOrdered,
  HelpCircle,
  Award,
  Check,
  FileText,
  Copy,
  Download,
} from 'lucide-react';
import { StoredDocument, StudyPack } from '../types';
import { localTutor } from '../services/localEngine';

interface DocumentToKnowledgeViewProps {
  documents: StoredDocument[];
}

export const DocumentToKnowledgeView: React.FC<DocumentToKnowledgeViewProps> = ({ documents }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [studyPack, setStudyPack] = useState<StudyPack | null>(() => {
    if (documents.length > 0) {
      return localTutor.generateStudyPack(documents[0].name);
    }
    return null;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'summary' | 'concepts' | 'definitions' | 'formulas' | 'questions' | 'mcqs' | 'viva' | 'checklist'
  >('summary');
  const [copied, setCopied] = useState(false);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleGenerate = () => {
    if (!selectedDoc) return;
    setIsGenerating(true);
    setTimeout(() => {
      const generated = localTutor.generateStudyPack(selectedDoc.name);
      setStudyPack(generated);
      setIsGenerating(false);
    }, 400);
  };

  const handleToggleChecklist = (idx: number) => {
    if (!studyPack) return;
    const updated = { ...studyPack };
    updated.checklist[idx].completed = !updated.checklist[idx].completed;
    setStudyPack(updated);
  };

  const handleCopyPack = () => {
    if (!studyPack) return;
    const md = JSON.stringify(studyPack, null, 2);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-xl border border-[#20354D] bg-[#0D1B2A] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#65B8FF]">
            <Layers className="w-4 h-4" />
            <span className="uppercase tracking-wider font-mono">MODULE 4 — TURN MY NOTES INTO KNOWLEDGE</span>
          </div>
          <h2 className="text-xl font-bold text-[#F3F7FA] mt-1">Autonomous 9-in-1 Study Pack Generator</h2>
          <p className="text-xs text-[#8FA3B8] mt-0.5">
            Extracts summaries, definitions, formulas, top questions, MCQs, viva prep, and checklists from local notes in one click.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedDoc}
          className="px-5 py-2.5 bg-[#39E6B0] hover:bg-[#39E6B0]/90 disabled:opacity-40 text-[#07111F] font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>GENERATE STUDY PACK</span>
        </button>
      </div>

      {/* Document Selector bar */}
      <div className="p-4 rounded-xl border border-[#20354D] bg-[#07111F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#65B8FF] shrink-0" />
          <div>
            <label className="text-xs text-[#8FA3B8] block">Active Document Source</label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="bg-[#0A1626] border border-[#20354D] text-[#F3F7FA] text-xs rounded-lg px-3 py-1.5 mt-0.5 cursor-pointer font-medium"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.chunkCount} vector chunks)
                </option>
              ))}
            </select>
          </div>
        </div>

        {studyPack && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPack}
              className="px-3 py-1.5 rounded-lg border border-[#20354D] bg-[#0A1626] text-xs text-[#8FA3B8] hover:text-[#F3F7FA] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#39E6B0]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isGenerating && (
        <div className="p-12 rounded-xl border border-[#20354D] bg-[#0D1B2A] text-center space-y-3">
          <div className="w-6 h-6 rounded-full border-2 border-[#39E6B0] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-[#8FA3B8]">Extracting formulas, definitions, MCQs & study material locally...</p>
        </div>
      )}

      {/* Main Study Pack View */}
      {studyPack && !isGenerating && (
        <div className="rounded-xl border border-[#20354D] bg-[#0D1B2A] overflow-hidden shadow-xl">
          {/* Subtabs Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto p-2 border-b border-[#20354D] bg-[#0A1626]">
            {[
              { id: 'summary', label: '1. Summary' },
              { id: 'concepts', label: '2. Key Concepts' },
              { id: 'definitions', label: '3. Definitions' },
              { id: 'formulas', label: '4. Formulas' },
              { id: 'questions', label: '5. Exam Questions' },
              { id: 'mcqs', label: '6. MCQs' },
              { id: 'viva', label: '7. Viva Questions' },
              { id: 'checklist', label: '8. Revision Checklist' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#122338] text-[#39E6B0] border border-[#39E6B0]/30 font-semibold'
                    : 'text-[#8FA3B8] hover:text-[#F3F7FA] hover:bg-[#122338]/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* 1. Summary */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#F3F7FA]">Executive Document Summary</h3>
                <ul className="space-y-2">
                  {studyPack.summary.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#F3F7FA] leading-relaxed">
                      <span className="text-[#39E6B0] font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 2. Key Concepts */}
            {activeTab === 'concepts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyPack.keyConcepts.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#20354D] bg-[#07111F] space-y-1.5">
                    <h4 className="text-xs font-bold text-[#65B8FF]">{item.concept}</h4>
                    <p className="text-xs text-[#8FA3B8] leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Definitions */}
            {activeTab === 'definitions' && (
              <div className="space-y-3">
                {studyPack.definitions.map((def, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-[#20354D] bg-[#07111F] text-xs flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="font-semibold text-[#39E6B0] font-mono shrink-0 sm:w-44">
                      {def.term}:
                    </span>
                    <span className="text-[#8FA3B8] leading-relaxed">{def.description}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Formulas */}
            {activeTab === 'formulas' && (
              <div className="space-y-3">
                {studyPack.formulas.map((f, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#20354D] bg-[#07111F] space-y-2">
                    <div className="text-xs font-semibold text-[#F3F7FA]">{f.name}</div>
                    <div className="p-2.5 rounded bg-[#0A1626] font-mono text-xs text-[#FFC857] border border-[#20354D]">
                      {f.formula}
                    </div>
                    <div className="text-[11px] text-[#8FA3B8]">{f.note}</div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Exam Questions */}
            {activeTab === 'questions' && (
              <div className="space-y-4">
                {studyPack.importantQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#20354D] bg-[#07111F] space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#F3F7FA]">
                      <span>Question {idx + 1}: {q.question}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#65B8FF]/15 text-[#65B8FF] border border-[#65B8FF]/30">
                        {q.marks} Marks
                      </span>
                    </div>
                    <div className="text-xs text-[#8FA3B8] bg-[#0A1626] p-3 rounded-lg border border-[#20354D] leading-relaxed">
                      <strong className="text-[#39E6B0] font-medium">Model Answer: </strong>
                      {q.answer}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. MCQs */}
            {activeTab === 'mcqs' && (
              <div className="space-y-4">
                {studyPack.mcqs.map((mcq, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#20354D] bg-[#07111F] space-y-2.5">
                    <div className="text-xs font-semibold text-[#F3F7FA]">
                      MCQ {idx + 1}: {mcq.question}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {mcq.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2 rounded-lg border text-xs ${
                            optIdx === mcq.correctAnswer
                              ? 'border-[#42D392]/60 bg-[#42D392]/15 text-[#42D392] font-semibold'
                              : 'border-[#20354D] bg-[#0A1626] text-[#8FA3B8]'
                          }`}
                        >
                          {opt} {optIdx === mcq.correctAnswer && '✓ (Correct)'}
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] text-[#8FA3B8] pt-1">
                      <strong>Explanation:</strong> {mcq.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. Viva Questions */}
            {activeTab === 'viva' && (
              <div className="space-y-3">
                {studyPack.vivaQuestions.map((v, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#20354D] bg-[#07111F] space-y-2">
                    <div className="text-xs font-semibold text-[#65B8FF]">
                      Viva Q{idx + 1}: "{v.question}"
                    </div>
                    <div className="text-xs text-[#8FA3B8] leading-relaxed bg-[#0A1626] p-3 rounded-lg border border-[#20354D]">
                      <strong className="text-[#39E6B0] font-medium">Expected Oral Defense: </strong>
                      {v.answer}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 8. Checklist */}
            {activeTab === 'checklist' && (
              <div className="space-y-2.5">
                <div className="text-xs text-[#8FA3B8] mb-3">
                  Check off topics as you master them for your upcoming exam:
                </div>
                {studyPack.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleChecklist(idx)}
                    className="p-3 rounded-lg border border-[#20354D] bg-[#07111F] hover:bg-[#122338]/60 flex items-center gap-3 cursor-pointer transition-colors"
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        item.completed
                          ? 'bg-[#39E6B0] border-[#39E6B0] text-[#07111F]'
                          : 'border-[#20354D] bg-[#0A1626]'
                      }`}
                    >
                      {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs ${
                        item.completed ? 'line-through text-[#8FA3B8]/60' : 'text-[#F3F7FA]'
                      }`}
                    >
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!studyPack && !isGenerating && (
        <div className="p-12 rounded-xl border border-[#20354D] bg-[#0D1B2A] text-center space-y-2">
          <BookOpen className="w-8 h-8 text-[#8FA3B8] mx-auto" />
          <h4 className="text-sm font-semibold text-[#F3F7FA]">No Study Pack Generated Yet</h4>
          <p className="text-xs text-[#8FA3B8] max-w-sm mx-auto">
            Click 'GENERATE STUDY PACK' above to analyze your notes and synthesize a comprehensive 9-in-1 study kit.
          </p>
        </div>
      )}
    </div>
  );
};
