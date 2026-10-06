import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Play,
  Award,
  Sparkles,
  HelpCircle,
  FileText,
  Binary,
  Cpu,
  Network,
  Radio,
  Layout,
} from 'lucide-react';
import { SubjectData, ActiveTab } from '../types';
import { localTutor } from '../services/localEngine';

interface SubjectsViewProps {
  subjects: SubjectData[];
  onStartStudyTopic: (topic: string, subject: string, actionPrompt?: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  subjects,
  onStartStudyTopic,
  setActiveTab,
}) => {
  const [selectedSubjId, setSelectedSubjId] = useState(subjects[0]?.id || 'subj-ds');
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjName, setNewSubjName] = useState('');

  const currentSubject = subjects.find((s) => s.id === selectedSubjId) || subjects[0];

  const getSubjectIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('data') || n.includes('science')) return <Binary className="w-4 h-4 text-[#18A673]" />;
    if (n.includes('algorithm') || n.includes('daa')) return <Cpu className="w-4 h-4 text-[#18A673]" />;
    if (n.includes('automata') || n.includes('theory')) return <Network className="w-4 h-4 text-[#18A673]" />;
    if (n.includes('internet') || n.includes('iot')) return <Radio className="w-4 h-4 text-[#18A673]" />;
    if (n.includes('ui') || n.includes('ux') || n.includes('design')) return <Layout className="w-4 h-4 text-[#18A673]" />;
    return <BookOpen className="w-4 h-4 text-[#18A673]" />;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#17231F] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#18A673]" />
            <span>My Subjects &amp; Syllabus Manager</span>
          </h2>
          <p className="text-xs text-[#68756F] mt-0.5">
            Track syllabus coverage, mastered topics, and weak areas needing revision.
          </p>
        </div>

        <button
          onClick={() => setShowAddSubject(true)}
          className="px-4 py-2.5 bg-[#FFFFFF] border border-[#E5EBE7] hover:border-[#18A673] hover:bg-[#F0F8F4] text-[#17231F] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 text-[#18A673]" />
          <span>Add Custom Subject</span>
        </button>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {subjects.map((subj) => {
          const isSelected = subj.id === selectedSubjId;
          return (
            <button
              key={subj.id}
              onClick={() => setSelectedSubjId(subj.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border shadow-xs ${
                isSelected
                  ? 'bg-[#E8F7F0] text-[#18A673] font-bold border-[#18A673]/40'
                  : 'bg-[#FFFFFF] text-[#68756F] hover:text-[#17231F] border-[#E5EBE7] hover:bg-[#F8FAF7]'
              }`}
            >
              <span>{getSubjectIcon(subj.name)}</span>
              <span>{subj.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#F8FAF7] text-[#18A673] border border-[#E5EBE7] font-bold">
                {subj.progressPercent}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Subject Overview */}
      {currentSubject && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4.5 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] shadow-xs">
              <span className="text-[11px] text-[#68756F] font-bold block uppercase tracking-wider">Syllabus Mastered</span>
              <div className="text-2xl font-bold font-mono text-[#18A673] mt-1">
                {currentSubject.progressPercent}%
              </div>
            </div>

            <div className="p-4.5 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] shadow-xs">
              <span className="text-[11px] text-[#68756F] font-bold block uppercase tracking-wider">Quiz High Score</span>
              <div className="text-2xl font-bold font-mono text-[#FF6B5F] mt-1">
                {currentSubject.quizHighScore}%
              </div>
            </div>

            <div className="p-4.5 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] shadow-xs">
              <span className="text-[11px] text-[#68756F] font-bold block uppercase tracking-wider">Vivas Attempted</span>
              <div className="text-2xl font-bold font-mono text-[#F4B942] mt-1">
                {currentSubject.vivaAttempted}
              </div>
            </div>

            <div className="p-4.5 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] shadow-xs">
              <span className="text-[11px] text-[#68756F] font-bold block uppercase tracking-wider">Notes Linked</span>
              <div className="text-2xl font-bold font-mono text-[#17231F] mt-1">
                {currentSubject.notesCount} Files
              </div>
            </div>
          </div>

          {/* Topics List with Mastery & Actions */}
          <div className="p-6 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#17231F]">
                  {currentSubject.name} — Topic Checklist &amp; Exam Status
                </h3>
                <p className="text-[11px] text-[#68756F]">
                  Click any topic to start teaching, generate a 5-mark answer, or quiz yourself.
                </p>
              </div>

              <span className="text-xs font-mono text-[#68756F] font-bold">
                {currentSubject.topics.length} Key Topics
              </span>
            </div>

            <div className="space-y-2.5">
              {currentSubject.topics.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-[#E5EBE7] bg-[#F8FAF7] hover:bg-[#F0F8F4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {t.mastered ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#18A673] shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4.5 h-4.5 text-[#F4B942] shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-[#17231F] block">
                        {t.name}
                      </span>
                      <span className="text-[10px] text-[#68756F] font-mono">
                        {t.revisionCount} revisions · {t.isWeak ? '⚠ High Exam Risk (Weak Topic)' : '✓ Confident'}
                      </span>
                    </div>
                  </div>

                  {/* Actions for this topic */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => onStartStudyTopic(t.name, currentSubject.name, `Teach me ${t.name} step by step`)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5EBE7] hover:border-[#18A673]/40 text-[#17231F] hover:text-[#18A673] text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                    >
                      Teach Me
                    </button>
                    <button
                      onClick={() => onStartStudyTopic(t.name, currentSubject.name, `Give me a 5-mark answer for ${t.name}`)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E5EBE7] hover:border-[#18A673]/40 text-[#17231F] hover:text-[#18A673] text-[11px] font-semibold cursor-pointer transition-colors shadow-xs"
                    >
                      5-Mark
                    </button>
                    <button
                      onClick={() => {
                        localTutor.setCurrentTopic(t.name, currentSubject.name);
                        setActiveTab('quiz');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#E8F7F0] border border-[#18A673]/30 text-[#18A673] hover:bg-[#18A673] hover:text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      Quiz
                    </button>
                    <button
                      onClick={() => {
                        localTutor.setCurrentTopic(t.name, currentSubject.name);
                        setActiveTab('viva');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#FFF0EF] border border-[#FF6B5F]/30 text-[#FF6B5F] hover:bg-[#FF6B5F] hover:text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      Viva
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding custom subject */}
      {showAddSubject && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E5EBE7] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-[#17231F]">
            <h3 className="text-base font-bold text-[#17231F]">Add New Subject</h3>
            <div>
              <label className="text-xs text-[#68756F] font-bold block mb-1">Subject Name</label>
              <input
                type="text"
                value={newSubjName}
                onChange={(e) => setNewSubjName(e.target.value)}
                placeholder="e.g. Distributed Database Systems"
                className="w-full bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-3 text-xs text-[#17231F] focus:outline-none focus:border-[#18A673] focus:bg-white transition-colors"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddSubject(false)}
                className="px-4 py-2 text-xs font-semibold text-[#68756F] hover:text-[#17231F] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newSubjName.trim()) {
                    subjects.push({
                      id: `subj-${Date.now()}`,
                      name: newSubjName.trim(),
                      icon: '📘',
                      progressPercent: 20,
                      notesCount: 0,
                      quizHighScore: 0,
                      vivaAttempted: 0,
                      topics: [
                        { id: `t-custom-1`, name: 'Module 1 Overview', mastered: false, revisionCount: 0 },
                        { id: `t-custom-2`, name: 'Core Architectures', mastered: false, isWeak: true, revisionCount: 0 },
                      ],
                    });
                    setNewSubjName('');
                    setShowAddSubject(false);
                  }
                }}
                className="px-5 py-2 bg-[#18A673] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#18A673]/90 transition-colors shadow-sm"
              >
                Save Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
