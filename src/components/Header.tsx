import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  WifiOff,
  Wifi,
  ShieldCheck,
  Cpu,
  Lock,
  HardDrive,
  Settings,
  ChevronDown,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isSimulatedOffline: boolean;
  setIsSimulatedOffline: (val: boolean) => void;
  onOpenProofModal: () => void;
  currentTopic: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isSimulatedOffline,
  setIsSimulatedOffline,
  onOpenProofModal,
  currentTopic,
}) => {
  const [showStatusPopover, setShowStatusPopover] = useState(false);
  const [showPracticeMenu, setShowPracticeMenu] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const practiceRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowStatusPopover(false);
      }
      if (practiceRef.current && !practiceRef.current.contains(event.target as Node)) {
        setShowPracticeMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPracticeActive = activeTab === 'quiz' || activeTab === 'viva' || activeTab === 'revision';

  return (
    <header className="border-b border-[#E5EBE7] bg-[#FFFFFF]/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Air-Gap / Offline Simulation Banner if active */}
      {isSimulatedOffline && (
        <div className="bg-[#F4B942]/15 border-b border-[#F4B942]/30 px-4 py-1.5 text-xs text-[#17231F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-[#F4B942] shrink-0" />
            <span className="font-bold tracking-wider text-[11px] uppercase text-[#F4B942]">OFFLINE AIR-GAP ENGAGED:</span>
            <span className="text-[12px] text-[#17231F]">
              All study materials, embeddings, and tutor answers are executing 100% locally on your computer.
            </span>
          </div>
          <button
            onClick={() => setIsSimulatedOffline(false)}
            className="text-[11px] font-bold underline hover:text-[#18A673] cursor-pointer transition-colors"
          >
            Re-enable Network
          </button>
        </div>
      )}

      {/* Main Top Header Bar */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand with Simple Knowledge Symbol */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="OfflineMind Home"
        >
          {/* Simple Symbol: Study Book + Local Intelligence Leaf */}
          <div className="w-9 h-9 rounded-xl bg-[#E8F7F0] border border-[#18A673]/30 flex items-center justify-center text-[#18A673] group-hover:bg-[#18A673] group-hover:text-white transition-all shadow-xs relative">
            <BookOpen className="w-4.5 h-4.5 transition-transform group-hover:scale-105" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#18A673] ring-2 ring-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-serif tracking-tight text-[#17231F] group-hover:text-[#18A673] transition-colors">
                OFFLINEMIND
              </span>
            </div>
            <p className="text-[9px] font-semibold tracking-widest text-[#68756F] uppercase font-mono">
              LOCAL AI EXAM TUTOR
            </p>
          </div>
        </div>

        {/* Center: Editorial Navigation Links (STUDY · NOTES · PRACTICE · PROGRESS) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2" aria-label="Main Navigation">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-[#E8F7F0] text-[#18A673] border border-[#18A673]/30 shadow-xs'
                : 'text-[#68756F] hover:text-[#17231F] hover:bg-[#F0F8F4]'
            }`}
          >
            STUDY
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-[#E8F7F0] text-[#18A673] border border-[#18A673]/30 shadow-xs'
                : 'text-[#68756F] hover:text-[#17231F] hover:bg-[#F0F8F4]'
            }`}
          >
            NOTES
          </button>

          {/* PRACTICE with Dropdown (Quiz, Viva, Revision) */}
          <div className="relative" ref={practiceRef}>
            <button
              onClick={() => setShowPracticeMenu(!showPracticeMenu)}
              className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
                isPracticeActive
                  ? 'bg-[#E8F7F0] text-[#18A673] border border-[#18A673]/30 shadow-xs'
                  : 'text-[#68756F] hover:text-[#17231F] hover:bg-[#F0F8F4]'
              }`}
            >
              <span>PRACTICE</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showPracticeMenu ? 'rotate-180' : ''}`} />
            </button>

            {showPracticeMenu && (
              <div className="absolute left-0 mt-2 w-52 rounded-xl bg-[#FFFFFF] border border-[#E5EBE7] shadow-xl p-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    setActiveTab('quiz');
                    setShowPracticeMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                    activeTab === 'quiz' ? 'bg-[#E8F7F0] text-[#18A673] font-bold' : 'text-[#17231F] hover:bg-[#F0F8F4]'
                  }`}
                >
                  <span>Interactive Quiz</span>
                  <span className="text-[10px] text-[#18A673] font-mono font-bold bg-[#E8F7F0] px-1.5 py-0.5 rounded">MCQ</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('viva');
                    setShowPracticeMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                    activeTab === 'viva' ? 'bg-[#FFF0EF] text-[#FF6B5F] font-bold' : 'text-[#17231F] hover:bg-[#F0F8F4]'
                  }`}
                >
                  <span>Oral Viva Simulator</span>
                  <span className="text-[10px] text-[#FF6B5F] font-mono font-bold bg-[#FFF0EF] px-1.5 py-0.5 rounded">Exam</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('revision');
                    setShowPracticeMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                    activeTab === 'revision' ? 'bg-[#FEF7EA] text-[#F4B942] font-bold' : 'text-[#17231F] hover:bg-[#F0F8F4]'
                  }`}
                >
                  <span>Revision &amp; Answers</span>
                  <span className="text-[10px] text-[#F4B942] font-mono font-bold bg-[#FEF7EA] px-1.5 py-0.5 rounded">5-Mark</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('progress')}
            className={`px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
              activeTab === 'progress'
                ? 'bg-[#E8F7F0] text-[#18A673] border border-[#18A673]/30 shadow-xs'
                : 'text-[#68756F] hover:text-[#17231F] hover:bg-[#F0F8F4]'
            }`}
          >
            PROGRESS
          </button>
        </nav>

        {/* Right: LOCAL AI Status & Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* LOCAL AI Status */}
          <div className="relative" ref={popoverRef}>
            <button
              onClick={() => setShowStatusPopover(!showStatusPopover)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7] hover:border-[#18A673] transition-colors cursor-pointer text-left shadow-xs"
              title="Click to view local verification details"
            >
              <span className="w-2 h-2 rounded-full bg-[#18A673] animate-pulse shrink-0" />
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-bold text-[#17231F] tracking-wider uppercase flex items-center gap-1">
                  LOCAL AI
                </span>
                <span className="text-[9px] font-bold text-[#18A673] uppercase font-mono">
                  ACTIVE
                </span>
              </div>
              <ChevronDown className={`w-3 h-3 text-[#68756F] ml-1 transition-transform ${showStatusPopover ? 'rotate-180' : ''}`} />
            </button>

            {/* Offline Status Popover */}
            {showStatusPopover && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#FFFFFF] border border-[#E5EBE7] shadow-xl p-4 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE7]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#18A673]" />
                    <span className="font-bold text-[#17231F]">Local Engine Status</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#18A673] uppercase bg-[#E8F7F0] px-2 py-0.5 rounded-md font-bold border border-[#18A673]/20">
                    Air-Gapped
                  </span>
                </div>

                <div className="space-y-3 py-3">
                  <div className="flex items-start gap-2.5">
                    <Cpu className="w-4 h-4 text-[#18A673] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-[#68756F] tracking-wider uppercase">MODEL INFERENCE</div>
                      <div className="text-[#17231F] font-bold text-[11px]">Running on Device</div>
                      <div className="text-[10px] text-[#68756F] font-mono">OfflineMind Micro-GGUF (1.2B / 3B)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <WifiOff className="w-4 h-4 text-[#FF6B5F] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-[#68756F] tracking-wider uppercase">NETWORK STATE</div>
                      <div className="text-[#17231F] font-bold text-[11px]">Offline · Zero Cloud Calls</div>
                      <div className="text-[10px] text-[#68756F]">Works when Wi-Fi and Ethernet are disconnected</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <HardDrive className="w-4 h-4 text-[#F4B942] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-[#68756F] tracking-wider uppercase">STUDY DATA</div>
                      <div className="text-[#17231F] font-bold text-[11px]">Stored on this Computer</div>
                      <div className="text-[10px] text-[#68756F]">Notes stay in browser storage &amp; local memory</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-[#18A673] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-[#68756F] tracking-wider uppercase">PRIVACY ASSURANCE</div>
                      <div className="text-[#17231F] font-bold text-[11px]">100% Private Study Space</div>
                      <div className="text-[10px] text-[#68756F]">No analytics telemetry or remote tracking</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5EBE7] flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowStatusPopover(false);
                      onOpenProofModal();
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#18A673] hover:bg-[#18A673]/90 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Run Offline Verification</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Air-gap simulation button */}
          <button
            onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
            className={`p-2 rounded-xl border transition-all cursor-pointer shadow-xs ${
              isSimulatedOffline
                ? 'bg-[#FEF7EA] border-[#F4B942] text-[#F4B942]'
                : 'bg-[#F8FAF7] border-[#E5EBE7] text-[#68756F] hover:text-[#17231F] hover:border-[#18A673] hover:bg-[#F0F8F4]'
            }`}
            title={isSimulatedOffline ? 'Air-gap active' : 'Simulate network disconnect'}
          >
            <WifiOff className="w-4 h-4" />
          </button>

          {/* Settings / Technical Diagnostic Icon */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-xl border transition-all cursor-pointer shadow-xs ${
              activeTab === 'settings'
                ? 'bg-[#18A673] text-white border-[#18A673]'
                : 'bg-[#F8FAF7] border-[#E5EBE7] text-[#68756F] hover:text-[#17231F] hover:border-[#18A673] hover:bg-[#F0F8F4]'
            }`}
            title="Performance Lab & System Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="md:hidden flex items-center justify-around px-4 py-2 border-t border-[#E5EBE7] bg-[#F8FAF7] text-xs font-semibold tracking-wider uppercase">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-2.5 py-1.5 rounded-lg transition-colors ${
            activeTab === 'chat' ? 'bg-[#18A673] text-white' : 'text-[#68756F]'
          }`}
        >
          STUDY
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-2.5 py-1.5 rounded-lg transition-colors ${
            activeTab === 'notes' ? 'bg-[#18A673] text-white' : 'text-[#68756F]'
          }`}
        >
          NOTES
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-2.5 py-1.5 rounded-lg transition-colors ${
            isPracticeActive ? 'bg-[#18A673] text-white' : 'text-[#68756F]'
          }`}
        >
          PRACTICE
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-2.5 py-1.5 rounded-lg transition-colors ${
            activeTab === 'progress' ? 'bg-[#18A673] text-white' : 'text-[#68756F]'
          }`}
        >
          PROGRESS
        </button>
      </div>
    </header>
  );
};
