import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ArrowRight,
  User,
  Settings,
  Binary,
  Cpu,
  Network,
  Radio,
  Layout,
} from 'lucide-react';
import { SubjectData, StudyProfile, ActiveTab } from '../types';
import { localTutor } from '../services/localEngine';

interface ProgressViewProps {
  subjects: SubjectData[];
  profile: StudyProfile;
  onUpdateProfile: (p: StudyProfile) => void;
  onStartStudyTopic: (topic: string, subject: string, actionPrompt?: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  subjects,
  profile,
  onUpdateProfile,
  onStartStudyTopic,
  setActiveTab,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState<StudyProfile>({ ...profile });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditingProfile(false);
  };

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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#17231F] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#18A673]" />
          <span>My Exam Progress &amp; Study Profile</span>
        </h2>
        <p className="text-xs text-[#68756F] mt-0.5">
          Local performance tracking, weak topics discovery, and personalized revision recommendations.
        </p>
      </div>

      {/* Smart Revision Recommendation */}
      <div className="p-6 rounded-2xl border border-[#F4B942]/40 bg-[#FFFFFF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#F4B942]" />
        <div className="flex items-start gap-3 pl-2">
          <AlertTriangle className="w-5 h-5 text-[#F4B942] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#17231F] tracking-wider uppercase font-mono">
              SMART REVISION RECOMMENDATION
            </span>
            <p className="text-xs text-[#17231F] leading-relaxed">
              “Spend 10 minutes revising <strong className="text-[#18A673]">Dynamic Programming (0/1 Knapsack)</strong>. Your test history indicates lower retention in overlapping subproblem states.”
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pl-2 sm:pl-0">
          <button
            onClick={() => onStartStudyTopic('0/1 Knapsack Problem', 'DAA (Algorithms)', 'Teach me 0/1 Knapsack step by step')}
            className="px-4.5 py-2.5 bg-[#F4B942] hover:bg-[#e0a635] text-[#17231F] font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-xs"
          >
            Revise Now
          </button>
          <button
            onClick={() => {
              localTutor.setCurrentTopic('0/1 Knapsack Problem', 'DAA (Algorithms)');
              setActiveTab('quiz');
            }}
            className="px-4.5 py-2.5 bg-[#FFFFFF] border border-[#E5EBE7] hover:bg-[#F8FAF7] text-[#17231F] text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
          >
            Take Quiz
          </button>
        </div>
      </div>

      {/* Subject Progress Overview */}
      <div className="p-6 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#17231F]">Syllabus Completion &amp; Mastery</h3>
          <span className="text-xs text-[#68756F] font-mono font-bold">Calculated Locally</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subj) => (
            <div
              key={subj.id}
              className="p-4.5 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] hover:border-[#18A673] space-y-3 card-hover-lift shadow-xs transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17231F] flex items-center gap-1.5">
                  {getSubjectIcon(subj.name)}
                  <span>{subj.name}</span>
                </span>
                <span className="text-xs font-mono font-bold text-[#18A673]">
                  {subj.progressPercent}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-[#E5EBE7] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#18A673] rounded-full transition-all duration-300"
                  style={{ width: `${subj.progressPercent}%` }}
                />
              </div>

              {/* Status footer */}
              <div className="flex items-center justify-between text-[11px] text-[#68756F] pt-1 border-t border-[#E5EBE7] font-mono">
                <span>Quiz High: {subj.quizHighScore}%</span>
                <span>{subj.vivaAttempted} Vivas</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Study Profile */}
      <div className="p-6 rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5EBE7] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#17231F] flex items-center gap-2">
              <User className="w-4 h-4 text-[#18A673]" />
              <span>My Study Profile</span>
            </h3>
            <p className="text-[11px] text-[#68756F]">
              Your profile automatically calibrates the tutor's tone, difficulty, and language.
            </p>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-3.5 py-1.5 rounded-xl border border-[#E5EBE7] bg-[#F8FAF7] hover:bg-[#F0F8F4] hover:border-[#18A673] text-[#17231F] text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {!isEditingProfile ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7]">
              <span className="text-[#68756F] text-[10px] uppercase font-mono font-bold block">Program / Course</span>
              <span className="font-bold text-[#17231F] mt-0.5 block">{profile.course}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7]">
              <span className="text-[#68756F] text-[10px] uppercase font-mono font-bold block">Current Semester</span>
              <span className="font-bold text-[#17231F] mt-0.5 block">{profile.semester}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7]">
              <span className="text-[#68756F] text-[10px] uppercase font-mono font-bold block">Target Exam Date</span>
              <span className="font-bold text-[#F4B942] mt-0.5 block">{profile.targetExamDate}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7]">
              <span className="text-[#68756F] text-[10px] uppercase font-mono font-bold block">Preferred Language</span>
              <span className="font-bold text-[#18A673] mt-0.5 block">{profile.preferredLanguage}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7]">
              <span className="text-[#68756F] text-[10px] uppercase font-mono font-bold block">Answer Style</span>
              <span className="font-bold text-[#17231F] mt-0.5 block">{profile.preferredAnswerStyle}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7]">
              <span className="text-[#68756F] text-[10px] uppercase font-mono font-bold block">Exam Level</span>
              <span className="font-bold text-[#FF6B5F] mt-0.5 block">{profile.difficultyLevel}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#68756F] font-bold block mb-1">Course / Degree</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-3 text-[#17231F] text-xs focus:outline-none focus:border-[#18A673] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="text-[#68756F] font-bold block mb-1">Semester</label>
                <input
                  type="text"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-3 text-[#17231F] text-xs focus:outline-none focus:border-[#18A673] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="text-[#68756F] font-bold block mb-1">Exam Date</label>
                <input
                  type="date"
                  value={formData.targetExamDate}
                  onChange={(e) => setFormData({ ...formData, targetExamDate: e.target.value })}
                  className="w-full bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-3 text-[#17231F] text-xs focus:outline-none focus:border-[#18A673] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="text-[#68756F] font-bold block mb-1">Default Language</label>
                <select
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as any })}
                  className="w-full bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-3 text-[#17231F] text-xs focus:outline-none focus:border-[#18A673] focus:bg-white transition-colors"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                </select>
              </div>

              <div>
                <label className="text-[#68756F] font-bold block mb-1">Answer Style</label>
                <select
                  value={formData.preferredAnswerStyle}
                  onChange={(e) => setFormData({ ...formData, preferredAnswerStyle: e.target.value as any })}
                  className="w-full bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-3 text-[#17231F] text-xs focus:outline-none focus:border-[#18A673] focus:bg-white transition-colors"
                >
                  <option value="Point-Wise & Crisp">Point-Wise &amp; Crisp (University Exam)</option>
                  <option value="In-Depth Academic">In-Depth Academic (Detailed)</option>
                  <option value="Conceptual with Real-Life Analogies">Conceptual with Real-Life Analogies</option>
                </select>
              </div>

              <div>
                <label className="text-[#68756F] font-bold block mb-1">Difficulty Level</label>
                <select
                  value={formData.difficultyLevel}
                  onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value as any })}
                  className="w-full bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-3 text-[#17231F] text-xs focus:outline-none focus:border-[#18A673] focus:bg-white transition-colors"
                >
                  <option value="Standard University Exam">Standard University Exam</option>
                  <option value="Competitive / Advanced">Competitive / Advanced (GATE / Interviews)</option>
                  <option value="Foundation / Beginner">Foundation / Beginner</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl text-[#68756F] hover:text-[#17231F] text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#18A673] text-white font-bold text-xs cursor-pointer hover:bg-[#18A673]/90 transition-colors shadow-sm"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
