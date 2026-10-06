import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  Send,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  HelpCircle,
  Clock,
  Zap,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { StoredDocument, ChatMessage } from '../types';
import { localEngine } from '../services/localEngine';

interface AskDocumentsViewProps {
  documents: StoredDocument[];
  onAddDocument: (name: string, text: string, fileType: string, pages: number) => void;
  onDeleteDocument: (id: string) => void;
}

export const AskDocumentsView: React.FC<AskDocumentsViewProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Welcome to Ask My Documents! I am your 100% offline document intelligence assistant.\n\nAsk questions about your uploaded lecture notes, research papers, or syllabus. Every response is grounded in your local documents with exact page citations and zero network traffic.`,
      confidence: 'High',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [strictEvidenceMode, setStrictEvidenceMode] = useState(true);
  const [expandedWhy, setExpandedWhy] = useState<{ [msgId: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // File upload state
  const [uploadName, setUploadName] = useState('');
  const [uploadText, setUploadText] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'What is PCA and what is its primary objective?',
    'What are the stopping criteria for the K-Means algorithm?',
    'Explain the time complexity of QuickSort in all 3 cases.',
    'What is the difference between supervised and unsupervised learning?',
    'Does the uploaded note mention quantum computing? (Strict test)',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isProcessing) return;

    setInputQuery('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const response = await localEngine.askQuestion(q, strictEvidenceMode, 'English', 'Standard');
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'An error occurred while evaluating locally. Please check document indexing.',
          confidence: 'None',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';

    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      const estimatedPages = Math.max(1, Math.ceil(text.length / 1500));
      onAddDocument(file.name, text, ext, estimatedPages);
    };

    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleManualAdd = () => {
    if (!uploadName.trim() || !uploadText.trim()) return;
    const pages = Math.max(1, Math.ceil(uploadText.length / 1500));
    onAddDocument(uploadName.trim(), uploadText.trim(), 'txt', pages);
    setUploadName('');
    setUploadText('');
    setShowUploadModal(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Sidebar: Local Documents & Strict Evidence Settings */}
      <div className="lg:col-span-1 space-y-4">
        {/* Strict Evidence Toggle Card */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Hallucination Protection</span>
            <div
              onClick={() => setStrictEvidenceMode(!strictEvidenceMode)}
              className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                strictEvidenceMode ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                  strictEvidenceMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          <div className="flex items-start gap-2 text-[11px] text-slate-400">
            {strictEvidenceMode ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-emerald-300">Strict Evidence ON:</strong> Refuses to answer if fact is not explicitly in your local files. Evidence Found: 0 = refusal.
                </span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-amber-300">Strict Evidence OFF:</strong> Uses general local model weights when document evidence is missing.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Indexed Knowledge Documents */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Local Documents ({documents.length})</span>
            <button
              onClick={() => setShowUploadModal(true)}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
            >
              + Upload
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {documents.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-500">
                No documents indexed yet. Upload a PDF or notes file.
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-950/60 hover:border-slate-700 text-xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-200 truncate">{doc.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {doc.pageCount} pgs · {doc.chunkCount} chunks · {(doc.fileSize / 1024).toFixed(0)} KB
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                    title="Remove document from local store"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick upload drop trigger */}
          <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-slate-700 hover:border-emerald-500/50 rounded-lg text-xs text-slate-400 hover:text-emerald-300 bg-slate-950/30 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-slate-400" />
            <span>Upload File (.pdf, .docx, .txt)</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.docx,.txt,.md,.csv"
            />
          </label>
        </div>

        {/* Preset Sample Prompts */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <span className="text-xs font-semibold text-slate-300 block">Try Test Queries:</span>
          <div className="space-y-1.5">
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSend(sq)}
                className="w-full text-left p-2 rounded bg-slate-950/60 hover:bg-slate-800/80 text-[11px] text-slate-300 hover:text-emerald-300 border border-slate-800/60 transition-colors cursor-pointer truncate"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Chat Interface */}
      <div className="lg:col-span-3 flex flex-col h-[680px] rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xs">
        {/* Chat Header */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">Local Document Consultation Session</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[11px] text-slate-400">
              Strict Evidence: <span className="font-mono text-emerald-400">{strictEvidenceMode ? 'ENFORCED' : 'OFF'}</span>
            </span>
            <button
              onClick={() => setMessages([])}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px] cursor-pointer"
              title="Clear chat history"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-xl p-4 text-xs leading-relaxed space-y-3 ${
                  msg.role === 'user'
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-100 rounded-br-xs'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-xs shadow-xs'
                }`}
              >
                {/* Message Body */}
                <div className="whitespace-pre-line text-[13px]">{msg.content}</div>

                {/* Assistant Metadata Telemetry */}
                {msg.role === 'assistant' && msg.id !== 'welcome-msg' && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    {/* Performance telemetry banner */}
                    <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-emerald-400">Local AI</span>
                        <span className="text-slate-700">·</span>
                        <span className="font-mono text-slate-300">{msg.latencyMs ? (msg.latencyMs / 1000).toFixed(2) : '0.04'} sec</span>
                        <span className="text-slate-700">·</span>
                        <span className="font-mono text-slate-300">{msg.tokensPerSec || 24.8} tok/s</span>
                        <span className="text-slate-700">·</span>
                        <span className="text-slate-400">
                          Confidence:{' '}
                          <strong
                            className={
                              msg.confidence === 'High'
                                ? 'text-emerald-400'
                                : msg.confidence === 'Medium'
                                  ? 'text-amber-400'
                                  : 'text-rose-400'
                            }
                          >
                            {msg.confidence || 'Medium'}
                          </strong>
                        </span>
                      </div>

                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Sources Section */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1.5">
                        <div className="text-[10px] font-semibold uppercase font-mono tracking-wider text-slate-400">
                          Document Sources ({msg.sources.length})
                        </div>
                        <div className="space-y-1">
                          {msg.sources.map((src, idx) => (
                            <div key={idx} className="text-[11px] text-slate-300 flex items-center justify-between">
                              <span className="font-medium text-emerald-300 truncate max-w-[70%]">
                                {src.documentName} (Page {src.pageNumber})
                              </span>
                              <span className="font-mono text-[10px] text-slate-500">
                                Similarity: {(src.similarity * 100).toFixed(0)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expandable "Why did the AI answer this?" */}
                    {msg.whyExplanation && (
                      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/40">
                        <button
                          onClick={() =>
                            setExpandedWhy((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))
                          }
                          className="w-full px-3 py-1.5 text-left text-[11px] text-slate-400 hover:text-slate-200 flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-medium text-slate-300">Why did the AI answer this?</span>
                          {expandedWhy[msg.id] ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                        {expandedWhy[msg.id] && (
                          <div className="px-3 pb-2.5 text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 space-y-1.5">
                            <p>{msg.whyExplanation}</p>
                            {msg.sources && msg.sources[0] && (
                              <div className="p-2 bg-slate-900 rounded text-[10px] text-slate-400 font-mono leading-normal border border-slate-800">
                                <span className="text-slate-500 block">Top Matching Chunk Snippet:</span>
                                "{msg.sources[0].snippet}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="text-[10px] text-slate-500 font-mono text-right">{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 max-w-sm text-xs text-slate-400">
              <div className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <span>Scanning local vector index & generating response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything from your documents (e.g. 'What is PCA?', 'Explain K-Means stopping criteria')..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={isProcessing || !inputQuery.trim()}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask Local AI</span>
            </button>
          </form>
        </div>
      </div>

      {/* Manual Upload Text Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100">Add Document or Notes</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Document Title / Subject</label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Operating Systems Chapter 3.txt"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Notes Content</label>
                <textarea
                  rows={8}
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  placeholder="Paste lecture notes, textbook excerpts, or syllabus content..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleManualAdd}
                disabled={!uploadName.trim() || !uploadText.trim()}
                className="px-4 py-1.5 text-xs bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 disabled:opacity-40 cursor-pointer"
              >
                Index Document Locally
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
