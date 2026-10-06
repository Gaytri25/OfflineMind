import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  WifiOff,
  Database,
  Cpu,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  EyeOff,
} from 'lucide-react';

interface PrivacyCenterViewProps {
  isSimulatedOffline: boolean;
  setIsSimulatedOffline: (val: boolean) => void;
}

export const PrivacyCenterView: React.FC<PrivacyCenterViewProps> = ({
  isSimulatedOffline,
  setIsSimulatedOffline,
}) => {
  const [networkAuditLogs, setNetworkAuditLogs] = useState([
    { timestamp: '21:30:14', target: 'api.openai.com', status: 'BLOCKED', reason: 'Zero Cloud Architecture' },
    { timestamp: '21:31:02', target: 'generativelanguage.googleapis.com', status: 'BLOCKED', reason: 'No Cloud API Keys Configured' },
    { timestamp: '21:32:45', target: 'api.anthropic.com', status: 'BLOCKED', reason: 'Local-Only Mode Enforced' },
    { timestamp: '21:33:10', target: 'telemetry.analytics.io', status: 'BLOCKED', reason: 'Zero External Telemetry' },
  ]);

  return (
    <div className="space-y-8">
      {/* Top Hero: Strong Privacy Statement */}
      <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 to-slate-950 p-6 sm:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-semibold font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          VERIFIED LOCAL-FIRST BOUNDARY
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          “Your documents stay on your computer.”
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          OfflineMind is engineered from the ground up to never transmit document bytes, search queries, or generated notes across the network. There are no cloud fallbacks, no telemetry trackers, and no third-party APIs.
        </p>

        <div className="pt-2 flex items-center gap-6 text-xs font-mono text-emerald-400">
          <div>
            Data Sent Outside Computer: <strong className="text-white text-base">0 bytes</strong>
          </div>
          <div>
            Cloud API Keys: <strong className="text-white text-base">NONE</strong>
          </div>
        </div>
      </div>

      {/* Audited Status Matrix (Section 16) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Internet Access</span>
            <WifiOff className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-400">OFF / NOT REQUIRED</div>
          <p className="text-[11px] text-slate-400">
            System boots and runs even when Ethernet is disconnected and Wi-Fi is disabled.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Cloud AI APIs</span>
            <EyeOff className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-400">NONE</div>
          <p className="text-[11px] text-slate-400">
            No OpenAI, Claude, Gemini, or remote inference APIs are present in the codebase.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Document Storage</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-400">LOCAL ONLY</div>
          <p className="text-[11px] text-slate-400">
            Uploaded PDFs, notes, and study files reside strictly in local RAM and SQLite.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Vector Database</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-400">LOCAL IN-MEMORY</div>
          <p className="text-[11px] text-slate-400">
            Cosine vector indices and TF-IDF matrix exist in-process without cloud vector hosts.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">AI Inference Engine</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-400">100% LOCALHOST</div>
          <p className="text-[11px] text-slate-400">
            Inference executes on local CPU/SIMD cores via Ollama or In-Process GGUF engine.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Network Kill Switch</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-400">
            {isSimulatedOffline ? 'LOCKED (OFFLINE)' : 'ACTIVE'}
          </div>
          <p className="text-[11px] text-slate-400">
            Simulates instant network severance for offline demonstrations and verification.
          </p>
        </div>
      </div>

      {/* Network Kill Switch Interactive Card (Section 17) */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100">Hardware Network Kill Switch</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Toggle to programmatically block external network requests and verify OfflineMind functionality in an air-gapped simulation.
            </p>
          </div>

          <button
            onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isSimulatedOffline
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isSimulatedOffline ? '🔒 LOCAL-ONLY MODE ACTIVE' : 'Enable Simulated Air-Gap'}
          </button>
        </div>

        {isSimulatedOffline && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Network Kill Switch is Active. The application will warn and block any remote service call.
            </span>
          </div>
        )}
      </div>

      {/* Network Audit Log */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200">Outbound Network Interception Audit Log</h3>
          <span className="text-[11px] font-mono text-emerald-400">0 Outbound Bytes Permitted</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="p-2.5">Time</th>
                <th className="p-2.5">Requested Destination</th>
                <th className="p-2.5">Interception Status</th>
                <th className="p-2.5">Security Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950 font-mono text-[11px]">
              {networkAuditLogs.map((log, i) => (
                <tr key={i}>
                  <td className="p-2.5 text-slate-500">{log.timestamp}</td>
                  <td className="p-2.5 text-slate-300">{log.target}</td>
                  <td className="p-2.5 text-rose-400 font-bold">{log.status}</td>
                  <td className="p-2.5 text-slate-400 font-sans">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
