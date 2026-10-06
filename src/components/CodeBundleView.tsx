import React, { useState, useEffect } from 'react';
import {
  Code2,
  Download,
  Copy,
  Check,
  FileText,
  FolderOpen,
  Terminal,
  ShieldCheck,
} from 'lucide-react';

interface BundleFile {
  name: string;
  path: string;
  desc: string;
  content: string;
}

export const CodeBundleView: React.FC = () => {
  const [files, setFiles] = useState<BundleFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<BundleFile | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bundle/files')
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
        if (data.length > 0) setSelectedFile(data[0]);
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback default file list
        const fallback: BundleFile[] = [
          {
            name: 'setup.bat',
            path: 'setup.bat',
            desc: 'Automated 1-click Windows installer script',
            content: `@echo off\necho Installing OfflineMind virtual environment...\npython -m venv .venv\ncall .venv\\Scripts\\activate\npip install -r requirements.txt\ncall npm install\npause`,
          },
          {
            name: 'run.bat',
            path: 'run.bat',
            desc: '1-click Windows start script with environment detection',
            content: `@echo off\necho Starting OfflineMind on http://localhost:3000\ncall .venv\\Scripts\\activate\nstart uvicorn backend.main:app --port 8000\nnpm run dev\npause`,
          },
          {
            name: 'requirements.txt',
            path: 'requirements.txt',
            desc: 'Zero-cloud Python dependencies',
            content: `fastapi>=0.110.0\nuvicorn>=0.28.0\npydantic>=2.6.0\nscikit-learn>=1.4.0\npypdf>=4.1.0\npython-docx>=1.1.0\npandas>=2.2.0\npsutil>=5.9.8`,
          },
        ];
        setFiles(fallback);
        setSelectedFile(fallback[0]);
        setIsLoading(false);
      });
  }, []);

  const handleCopy = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    if (!selectedFile) return;
    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name.split('/').pop() || selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Code2 className="w-4 h-4" />
            <span>STANDALONE DEPLOYMENT ARCHIVE</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">Complete OfflineMind Codebase &amp; Batch Scripts</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect all backend Python modules, setup.bat, run.bat, and benchmark definitions. Download files for standalone local hosting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadFile}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {selectedFile?.name || 'File'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column File Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: File Tree */}
        <div className="lg:col-span-1 p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-emerald-400" />
              <span>Project Files ({files.length})</span>
            </div>
          </div>

          <div className="space-y-1 max-h-[550px] overflow-y-auto pr-1">
            {files.map((file) => {
              const isSelected = selectedFile?.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <span className="truncate">{file.name}</span>
                  {file.name.endsWith('.bat') && (
                    <span className="text-[10px] text-amber-400 font-sans ml-1">bat</span>
                  )}
                  {file.name.endsWith('.py') && (
                    <span className="text-[10px] text-blue-400 font-sans ml-1">py</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-3 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col h-[600px]">
          {/* File Header */}
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold font-mono text-emerald-400">
                {selectedFile?.name || 'File Viewer'}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile?.desc}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
              <button
                onClick={handleDownloadFile}
                className="px-3 py-1.5 text-xs rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Code text content */}
          <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed">
            <pre className="whitespace-pre">{selectedFile?.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
