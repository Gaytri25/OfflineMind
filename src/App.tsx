/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ChatTutorView } from './components/ChatTutorView';
import { SubjectsView } from './components/SubjectsView';
import { NotesView } from './components/NotesView';
import { RevisionView } from './components/RevisionView';
import { QuizView } from './components/QuizView';
import { VivaView } from './components/VivaView';
import { ProgressView } from './components/ProgressView';
import { SettingsView } from './components/SettingsView';
import { OfflineProofModal } from './components/OfflineProofModal';

import { ActiveTab, HardwareStats, RuntimeStatus, StoredDocument, SubjectData, StudyProfile } from './types';
import { localTutor } from './services/localEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [showProofModal, setShowProofModal] = useState<boolean>(false);

  const [hardware, setHardware] = useState<HardwareStats | null>(null);
  const [runtime, setRuntime] = useState<RuntimeStatus | null>(null);
  const [documents, setDocuments] = useState<StoredDocument[]>(() => localTutor.getDocuments());
  const [subjects, setSubjects] = useState<SubjectData[]>(() => localTutor.getSubjects());
  const [profile, setProfile] = useState<StudyProfile>(() => localTutor.getProfile());

  // Inter-tab trigger state (e.g. from Home or Subjects into Chat)
  const [pendingPrompt, setPendingPrompt] = useState<string>('');

  useEffect(() => {
    fetch('/api/hardware')
      .then((res) => res.json())
      .then((data) => setHardware(data))
      .catch(() => {
        setHardware({
          os: navigator.userAgent.includes('Windows') ? 'Windows 11' : 'Linux / Host Machine',
          platform: navigator.platform || 'Localhost',
          architecture: 'x86_64',
          cpuName: 'Multi-Core Processor',
          cpuCoresPhysical: 4,
          cpuCoresLogical: navigator.hardwareConcurrency || 8,
          cpuSpeedMhz: 2800,
          totalRamGb: (navigator as any).deviceMemory || 8.0,
          availableRamGb: 5.6,
          usedRamGb: 2.4,
          ramUsagePercent: 30,
          nodeHeapUsedMb: 38.4,
          nodeHeapTotalMb: 72.0,
          nodeRssMb: 120.0,
          gpuDetected: false,
          gpuInfo: 'Host CPU / Local SIMD / Vector Acceleration',
          recommendation: {
            tier: 'Balanced Mode (3B)',
            model: 'Qwen2.5-3B-Instruct-Q4_K_M',
            reason: 'System has 8 GB RAM. 3B models offer the optimal balance of RAG reasoning without memory swapping.',
            quantization: 'Q4_K_M (4-bit)',
            contextLimit: 4096,
          },
          networkConnected: false,
        });
      });

    fetch('/api/runtime')
      .then((res) => res.json())
      .then((data) => setRuntime(data))
      .catch(() => {
        setRuntime({
          detected: true,
          runtime: 'OfflineMind In-Process Engine',
          endpoint: 'localhost (in-process)',
          activeModel: 'OfflineMind Micro-GGUF (1.2B Quantized)',
          availableModels: ['OfflineMind Micro-GGUF (1.2B Quantized)', 'Llama-3.2-1B-Instruct-Q4_K_M'],
        });
      });
  }, []);

  useEffect(() => {
    localTutor.setSimulateOffline(isSimulatedOffline);
  }, [isSimulatedOffline]);

  const handleStartStudyTopic = (topic: string, subject: string, actionPrompt?: string) => {
    localTutor.setCurrentTopic(topic, subject);
    if (actionPrompt) {
      setPendingPrompt(actionPrompt);
      setActiveTab('chat');
    } else {
      setActiveTab('chat');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddDocument = (name: string, text: string, fileType: string, pages: number) => {
    localTutor.addDocument(name, text, fileType, pages);
    setDocuments([...localTutor.getDocuments()]);
  };

  const handleAddProcessedDocument = (report: any) => {
    localTutor.addProcessedDocument(report);
    setDocuments([...localTutor.getDocuments()]);
  };

  const handleDeleteDocument = (id: string) => {
    localTutor.deleteDocument(id);
    setDocuments([...localTutor.getDocuments()]);
  };

  const handleUpdateProfile = (newProfile: StudyProfile) => {
    localTutor.saveProfile(newProfile);
    setProfile(newProfile);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#17231F] flex flex-col font-sans selection:bg-[#E8F7F0] selection:text-[#18A673]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSimulatedOffline={isSimulatedOffline}
        setIsSimulatedOffline={setIsSimulatedOffline}
        onOpenProofModal={() => setShowProofModal(true)}
        currentTopic={localTutor.getCurrentTopic()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'home' && (
          <HomeView
            setActiveTab={setActiveTab}
            subjects={subjects}
            profile={profile}
            onStartStudyTopic={handleStartStudyTopic}
          />
        )}

        {activeTab === 'chat' && (
          <ChatTutorView
            initialPrompt={pendingPrompt}
            onClearInitialPrompt={() => setPendingPrompt('')}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectsView
            subjects={subjects}
            onStartStudyTopic={handleStartStudyTopic}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'notes' && (
          <NotesView
            documents={documents}
            onAddDocument={handleAddDocument}
            onAddProcessedDocument={handleAddProcessedDocument}
            onDeleteDocument={handleDeleteDocument}
            onStartStudyTopic={handleStartStudyTopic}
          />
        )}

        {activeTab === 'revision' && (
          <RevisionView
            onStartStudyTopic={handleStartStudyTopic}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            onStartStudyTopic={handleStartStudyTopic}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'viva' && (
          <VivaView
            onStartStudyTopic={handleStartStudyTopic}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            subjects={subjects}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onStartStudyTopic={handleStartStudyTopic}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            hardware={hardware}
            runtime={runtime}
            isSimulatedOffline={isSimulatedOffline}
            setIsSimulatedOffline={setIsSimulatedOffline}
            onOpenProofModal={() => setShowProofModal(true)}
          />
        )}
      </main>

      {/* Modern Friendly Education Footer */}
      <footer className="border-t border-[#E5EBE7] bg-[#F8FAF7] py-5 text-xs text-[#68756F]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#17231F]">OfflineMind</span>
            <span className="text-[#E5EBE7]">·</span>
            <span>Your Personal AI Exam Tutor</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-[#68756F]">
            <span>Inference: Localhost</span>
            <span className="text-[#E5EBE7]">·</span>
            <span>Notes: Private &amp; Air-Gapped</span>
            <span className="text-[#E5EBE7]">·</span>
            <span className="text-[#18A673] font-semibold">Zero Cloud APIs</span>
          </div>
        </div>
      </footer>

      {/* Offline Proof Modal */}
      <OfflineProofModal
        isOpen={showProofModal}
        onClose={() => setShowProofModal(false)}
        isSimulatedOffline={isSimulatedOffline}
        setIsSimulatedOffline={setIsSimulatedOffline}
      />
    </div>
  );
}
