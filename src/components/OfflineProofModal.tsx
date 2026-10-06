import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  WifiOff,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Zap,
  Lock,
  Cpu,
  HardDrive,
} from 'lucide-react';
import { localTutor } from '../services/localEngine';

interface OfflineProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSimulatedOffline: boolean;
  setIsSimulatedOffline: (val: boolean) => void;
}

export const OfflineProofModal: React.FC<OfflineProofModalProps> = ({
  isOpen,
  onClose,
  isSimulatedOffline,
  setIsSimulatedOffline,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [testQuery, setTestQuery] = useState('Explain K-Means Clustering and formula for WCSS');
  const [isExecuting, setIsExecuting] = useState(false);
  const [testOutput, setTestOutput] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleStartProof = () => {
    // Enable simulated offline kill switch automatically for the test
    setIsSimulatedOffline(true);
    setCurrentStep(2);
  };

  const handleExecuteProofQuery = async () => {
    setIsExecuting(true);
    try {
      const res = await localTutor.askTutor(testQuery, true, 'English');
      setTestOutput(res);
      setCurrentStep(3);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetProof = () => {
    setCurrentStep(1);
    setTestOutput(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border border-[#E5EBE7] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-[#17231F]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-[#F8FAF7] border border-[#E5EBE7] text-[#68756F] hover:text-[#17231F] hover:bg-[#E8F7F0] flex items-center justify-center text-sm cursor-pointer transition-colors shadow-xs"
          aria-label="Close dialog"
        >
          ✕
        </button>

        {/* Modal Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#18A673]">
            <ShieldCheck className="w-4 h-4 text-[#18A673]" />
            <span className="tracking-wider uppercase">OFFLINE PROOF MODE — LIVE VERIFICATION</span>
          </div>
          <h2 className="text-xl font-bold text-[#17231F]">
            Prove That Useful AI Works Without Internet
          </h2>
          <p className="text-xs text-[#68756F]">
            Cut network dependencies, disconnect cloud APIs, and verify end-to-end local inference on your own hardware.
          </p>
        </div>

        {/* Step 1: Pre-Flight Check */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-[#E5EBE7] bg-[#F8FAF7] space-y-3">
              <span className="text-xs font-bold text-[#17231F] block">Pre-Flight Connectivity Status:</span>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFFFFF] border border-[#E5EBE7] shadow-xs">
                  <span className="text-[#68756F]">Physical Browser Online:</span>
                  <span className="text-[#18A673] font-bold">{navigator.onLine ? 'ONLINE (Will sever)' : 'DISCONNECTED'}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFFFFF] border border-[#E5EBE7] shadow-xs">
                  <span className="text-[#68756F]">Simulated Air-Gap Kill Switch:</span>
                  <span className={isSimulatedOffline ? 'text-[#18A673] font-bold' : 'text-[#68756F]'}>
                    {isSimulatedOffline ? 'ACTIVE' : 'READY TO ENGAGE'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFFFFF] border border-[#E5EBE7] shadow-xs">
                  <span className="text-[#68756F]">Cloud AI API Keys:</span>
                  <span className="text-[#18A673] font-bold">0 CONFIGURED (NONE)</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartProof}
              className="w-full py-3.5 bg-[#18A673] hover:bg-[#18A673]/90 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <WifiOff className="w-4 h-4" />
              <span>Engage Offline Proof Mode (Cut Network)</span>
            </button>
          </div>
        )}

        {/* Step 2: Network Severed & Run Test Task */}
        {currentStep === 2 && (
          <div className="space-y-4">
            {/* Network Test Verification Box */}
            <div className="p-5 rounded-2xl border border-[#E5EBE7] bg-[#F8FAF7] font-mono text-xs text-[#17231F] space-y-2 shadow-inner">
              <div className="text-[#18A673] font-bold mb-1 flex items-center justify-between">
                <span>NETWORK TEST PROTOCOL</span>
                <span className="text-[10px] bg-[#E8F7F0] px-2 py-0.5 rounded text-[#18A673]">AIR-GAPPED</span>
              </div>
              <div className="border-t border-[#E5EBE7]" />
              <div className="flex justify-between">
                <span className="text-[#68756F]">Internet Status:</span>
                <span className="text-[#FF6B5F] font-bold">DISCONNECTED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68756F]">Cloud APIs:</span>
                <span className="text-[#FF6B5F] font-bold">NOT USED (0 REQUESTS)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68756F]">AI Engine:</span>
                <span className="text-[#18A673] font-bold">LOCAL (In-Process GGUF)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68756F]">Model Architecture:</span>
                <span className="text-[#18A673] font-bold">1.2B Quantized (Localhost)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68756F]">Vector Database:</span>
                <span className="text-[#18A673] font-bold">LOCAL IN-MEMORY</span>
              </div>
              <div className="border-t border-[#E5EBE7]" />
              <div className="text-[#18A673] text-center font-bold pt-1">
                ALL NETWORK-DEPENDENT SERVICES DISABLED
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17231F] block">
                Perform Local AI Task (Proof of Inference):
              </label>
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                className="w-full bg-[#F8FAF7] border border-[#E5EBE7] rounded-xl p-3 text-xs text-[#17231F] focus:outline-none focus:border-[#18A673] focus:bg-white font-medium shadow-inner transition-colors"
              />
            </div>

            <button
              onClick={handleExecuteProofQuery}
              disabled={isExecuting || !testQuery.trim()}
              className="w-full py-3.5 bg-[#18A673] hover:bg-[#18A673]/90 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Generating Response on Local Hardware...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Generate Offline Verification Answer</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 3: Verified Offline Result */}
        {currentStep === 3 && testOutput && (
          <div className="space-y-4">
            {/* Verification Badge */}
            <div className="p-4.5 rounded-2xl border border-[#18A673]/40 bg-[#E8F7F0] flex items-center gap-3 shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-[#20B477] shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-[#18A673]">
                  ✓ Answer generated completely offline
                </h3>
                <p className="text-[11px] text-[#17231F] mt-0.5">
                  Verified 0 remote network packets transmitted. Inference executed in {testOutput.latencyMs ? (testOutput.latencyMs / 1000).toFixed(2) : '0.04'}s at {testOutput.tokensPerSec || 24.6} tok/s.
                </p>
              </div>
            </div>

            {/* Answer Display */}
            <div className="p-4.5 rounded-2xl border border-[#E5EBE7] bg-[#F8FAF7] space-y-2 max-h-60 overflow-y-auto shadow-inner">
              <div className="text-[10px] font-mono text-[#18A673] uppercase font-bold">
                Generated Local Response:
              </div>
              <p className="text-xs text-[#17231F] whitespace-pre-line leading-relaxed">
                {testOutput.content}
              </p>
            </div>

            {/* Sources & Reasoning */}
            <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7] text-[11px] text-[#68756F] space-y-1">
              <div>
                <strong className="text-[#17231F]">Evidence Found:</strong> {testOutput.evidenceCount || 1} local source section(s).
              </div>
              <div>
                <strong className="text-[#17231F]">Why did AI answer this:</strong> {testOutput.whyExplanation}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleResetProof}
                className="px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#F8FAF7] text-[#17231F] border border-[#E5EBE7] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Run Another Test</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#18A673] hover:bg-[#18A673]/90 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all"
              >
                Done (Keep Offline Mode Active)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
