import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  ArrowRight,
  FileText,
  HelpCircle,
  Activity,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
} from 'lucide-react';
import { ActiveWorkspace } from '../types';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveWorkspace) => void;
  setIsSimulatedOffline: (val: boolean) => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  setIsSimulatedOffline,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Step 1: Ingest Local Documents',
      subtitle: 'Zero Cloud Upload / Local Text Processing',
      description:
        'OfflineMind loads sample engineering notes ("Data Science & ML Master Notes.pdf"). The system extracts text locally, segments it into overlapping windows, and compiles in-memory cosine vector representations.',
      actionText: 'Next: Ask Document Query',
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      highlightTab: 'ask_documents' as ActiveWorkspace,
      preview: {
        header: 'Document Indexed:',
        detail: 'Data Science & Machine Learning Master Notes.pdf · 14 pages · 6 chunks · 0 bytes sent outside.',
      },
    },
    {
      title: 'Step 2: Semantic Retrieval & Source-Aware Answer',
      subtitle: 'Strict Evidence Hallucination Protection',
      description:
        'We query: "What is PCA?". The local semantic matcher retrieves Page 2, formulates an answer, and presents exact page numbers, similarity scores, and an expandable "Why did AI answer this?" rationale.',
      actionText: 'Next: Local Language Intelligence',
      icon: <HelpCircle className="w-5 h-5 text-blue-400" />,
      highlightTab: 'ask_documents' as ActiveWorkspace,
      preview: {
        header: 'Synthesized with Evidence:',
        detail: 'PCA extracts orthogonal eigenvectors along directions of maximum variance. Latency: 0.04s · 24 tok/s · Confidence: High.',
      },
    },
    {
      title: 'Step 3: Multilingual Assistance (मराठी & हिंदी)',
      subtitle: 'No Google Translate / Offline Local Language',
      description:
        'OfflineMind generates technical explanations natively in Marathi ("Machine Learning म्हणजे काय?") and Hindi, and includes a "Simplify Language" tool to convert dense textbook jargon into plain everyday analogies.',
      actionText: 'Next: Hardware & Benchmarks',
      icon: <Layers className="w-5 h-5 text-amber-400" />,
      highlightTab: 'local_language' as ActiveWorkspace,
      preview: {
        header: 'Marathi Local Output:',
        detail: 'मशीन लर्निंग ही AI ची शाखा आहे जिथे संगणक डेटावरून स्वतः शिकतो. Verified 0 cloud translation calls.',
      },
    },
    {
      title: 'Step 4: Benchmarks & "When Does Small Become Too Small?"',
      subtitle: 'Measuring the Pareto Frontier on Modest Hardware',
      description:
        'The Performance Lab runs the 25-question evaluation suite, calculates the 84/100 Offline AI Score, and experimentally demonstrates that 3B quantized models hit the ideal sweet spot for student laptops.',
      actionText: 'Complete Tour & Explore',
      icon: <TrendingUp className="w-5 h-5 text-[#65B8FF]" />,
      highlightTab: 'performance_lab' as ActiveWorkspace,
      preview: {
        header: 'Offline AI Score:',
        detail: '84/100 · 3B Quantized model identified as optimal threshold balancing RAM (<3.5GB) with reasoning (84%).',
      },
    },
  ];

  const activeStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setActiveTab(steps[nextStep].highlightTab);
    } else {
      setIsSimulatedOffline(true);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-100 text-sm cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 font-mono">
            <Play className="w-3.5 h-3.5 fill-emerald-400" />
            <span>3-MINUTE INTERACTIVE GUIDED DEMO</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">{activeStepData.title}</h2>
          <p className="text-xs text-emerald-400/90 font-medium">{activeStepData.subtitle}</p>
        </div>

        {/* Progress indicator */}
        <div className="grid grid-cols-4 gap-1.5 py-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-colors ${
                i <= currentStep ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Description body */}
        <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
          <p>{activeStepData.description}</p>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1 font-mono text-[11px]">
            <span className="text-emerald-400 font-bold block">{activeStepData.preview.header}</span>
            <span className="text-slate-300 block">{activeStepData.preview.detail}</span>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            disabled={currentStep === 0}
            onClick={() => {
              const prev = currentStep - 1;
              setCurrentStep(prev);
              setActiveTab(steps[prev].highlightTab);
            }}
            className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>{activeStepData.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
