import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Languages,
  BookOpen,
  ArrowRight,
  FileText,
  Clock,
  Zap,
} from 'lucide-react';
import { ChatMessage, FollowUpAction, ActiveTab } from '../types';
import { localTutor } from '../services/localEngine';

interface ChatTutorViewProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ChatTutorView: React.FC<ChatTutorViewProps> = ({
  initialPrompt,
  onClearInitialPrompt,
  setActiveTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-tutor',
      role: 'assistant',
      content: `Hello! I am your OfflineMind Exam Tutor.\n\nI'm ready to explain concepts, solve university questions, break down 5-mark or 10-mark answers, and quiz you across your subjects. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString(),
      followUpButtons: [
        { label: 'Teach me K-Means', prompt: 'Teach me K-Means step by step' },
        { label: '5-Mark on PCA', prompt: 'Give me a 5-mark answer for PCA' },
        { label: 'Explain QuickSort in Marathi', prompt: 'Explain QuickSort algorithm in Marathi' },
        { label: 'Quiz Me on Algorithms', prompt: 'Quiz me on DAA Algorithms' },
      ],
      currentTopic: 'General Studies',
      currentSubject: 'Data Science',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [strictEvidenceMode, setStrictEvidenceMode] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'English' | 'Hindi' | 'Marathi'>('English');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputQuery).trim();
    if (!textToSend || isTyping) return;

    setInputQuery('');

    // Append user message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await localTutor.askTutor(textToSend, strictEvidenceMode, activeLanguage);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'An error occurred while evaluating your question locally. Please retry.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFollowUpClick = (action: FollowUpAction) => {
    if (action.actionType === 'quiz') {
      setActiveTab('quiz');
      return;
    }
    handleSendMessage(action.prompt);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: `fresh-${Date.now()}`,
        role: 'assistant',
        content: `New study session started! What topic would you like to master next?`,
        timestamp: new Date().toLocaleTimeString(),
        followUpButtons: [
          { label: 'Teach me K-Means', prompt: 'Teach me K-Means step by step' },
          { label: '5-Mark Answer on PCA', prompt: 'Give me a 5-mark answer for PCA' },
          { label: 'Time Complexity of QuickSort', prompt: 'Explain QuickSort time complexity' },
        ],
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[740px] rounded-2xl border border-[#E5EBE7] bg-[#FFFFFF] overflow-hidden shadow-lg">
      {/* Chat Top Context Bar */}
      <div className="px-5 py-3 border-b border-[#E5EBE7] bg-[#F8FAF7] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#E8F7F0] border border-[#18A673]/30 flex items-center justify-center text-[#18A673] shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#17231F]">Exam Tutor Session</span>
              <span className="text-[10px] font-mono text-[#18A673] font-bold px-2 py-0.5 rounded-md bg-[#E8F7F0] border border-[#18A673]/30">
                Context: {localTutor.getCurrentTopic()}
              </span>
            </div>
            <span className="text-[11px] text-[#68756F]">
              Subject: {localTutor.getCurrentSubject()}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Strict Evidence Toggle */}
          <button
            onClick={() => setStrictEvidenceMode(!strictEvidenceMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer shadow-xs ${
              strictEvidenceMode
                ? 'bg-[#E8F7F0] border-[#18A673] text-[#18A673]'
                : 'bg-[#FFFFFF] border-[#E5EBE7] text-[#68756F] hover:text-[#17231F] hover:bg-[#F0F8F4]'
            }`}
            title="When ON, strictly answers from local uploaded notes only"
          >
            {strictEvidenceMode ? <ShieldCheck className="w-3.5 h-3.5 text-[#18A673]" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            <span className="text-[11px]">Strict Notes: {strictEvidenceMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Language selector */}
          <div className="flex items-center gap-1 bg-[#FFFFFF] border border-[#E5EBE7] rounded-xl p-0.5 text-xs shadow-xs">
            {(['English', 'Hindi', 'Marathi'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setActiveLanguage(l)}
                className={`px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition-colors ${
                  activeLanguage === l ? 'bg-[#E8F7F0] text-[#18A673] font-bold shadow-xs' : 'text-[#68756F] hover:text-[#17231F]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* New Chat */}
          <button
            onClick={handleNewChat}
            className="p-2 text-[#68756F] hover:text-[#17231F] rounded-xl hover:bg-[#F0F8F4] border border-[#E5EBE7] bg-[#FFFFFF] cursor-pointer transition-colors shadow-xs"
            title="Start new conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FFFFFF]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-4 sm:p-5 text-xs leading-relaxed space-y-3 ${
                msg.role === 'user'
                  ? 'bg-[#E8F7F0] border border-[#18A673]/30 text-[#17231F] font-medium rounded-br-xs shadow-xs'
                  : 'bg-[#F8FAF7] border border-[#E5EBE7] text-[#17231F] rounded-bl-xs shadow-xs'
              }`}
            >
              {/* Knowledge Mode Badges */}
              {msg.role === 'assistant' && msg.id !== 'welcome-tutor' && (
                <div className="flex items-center gap-2 flex-wrap pb-1">
                  {(!msg.knowledgeSource || msg.knowledgeSource === 'general') && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F7F0] text-[#18A673] border border-[#18A673]/30">
                      <span>🤖 Local AI Knowledge</span>
                      <span className="text-[10px] text-[#18A673]/80 font-mono">· No PDF required</span>
                    </span>
                  )}
                  {msg.knowledgeSource === 'notes' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF0EF] text-[#FF6B5F] border border-[#FF6B5F]/30">
                      <span>📄 Based on My Notes</span>
                    </span>
                  )}
                  {msg.knowledgeSource === 'hybrid' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF0EF] text-[#FF6B5F] border border-[#FF6B5F]/30">
                      <span>🤖 Local AI Knowledge + 📄 Local Notes</span>
                    </span>
                  )}
                </div>
              )}

              {/* Message text */}
              <div className="whitespace-pre-line text-[13px] leading-relaxed font-sans text-[#17231F]">
                {msg.content}
              </div>

              {/* Source Indicator */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-[#E5EBE7] text-[11px] text-[#68756F] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#FF6B5F] font-bold truncate max-w-[80%]">
                    <span>📄 Based on:</span>
                    <span className="truncate">{msg.sources[0].documentName}</span>
                    <span className="text-[#68756F] font-mono font-normal">
                      (Page {msg.sources[0].pageNumber})
                    </span>
                  </div>
                  <span className="text-[10px] text-[#68756F] font-mono">
                    {(msg.sources[0].similarity * 100).toFixed(0)}% match
                  </span>
                </div>
              )}

              {/* Telemetry & Copy button */}
              {msg.role === 'assistant' && msg.id !== 'welcome-tutor' && (
                <div className="flex items-center justify-between text-[11px] text-[#68756F] pt-1 border-t border-[#E5EBE7]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#18A673] font-bold">Local AI</span>
                    <span className="text-[#E5EBE7]">·</span>
                    <span className="font-mono text-[#68756F]">
                      {msg.latencyMs ? (msg.latencyMs / 1000).toFixed(1) : '0.1'} sec
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="hover:text-[#17231F] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-[#18A673]" />
                        <span className="text-[#18A673] font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Smart Follow-Up Action Buttons */}
            {msg.role === 'assistant' && msg.followUpButtons && msg.followUpButtons.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2 pl-2">
                {msg.followUpButtons.map((btn, bIdx) => (
                  <button
                    key={bIdx}
                    onClick={() => handleFollowUpClick(btn)}
                    className="px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#E8F7F0] text-[#17231F] hover:text-[#18A673] border border-[#E5EBE7] hover:border-[#18A673]/40 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <span>{btn.label}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-[#68756F]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E5EBE7] max-w-sm text-xs text-[#68756F] shadow-xs">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#18A673] border-t-transparent animate-spin" />
            <span className="font-medium text-[#17231F]">Formulating answer locally...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with Quick Action Chips */}
      <div className="p-4 border-t border-[#E5EBE7] bg-[#F8FAF7] space-y-2.5">
        {/* Quick Follow-Up Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          <span className="text-[#68756F] font-mono text-[10px] uppercase shrink-0 mr-1 font-bold">Quick Asks:</span>
          {[
            { label: 'Explain simply', prompt: 'Explain it simply like a teacher' },
            { label: 'Give example', prompt: 'Give me a practical real-world example' },
            { label: 'Formula', prompt: 'What is the mathematical formula?' },
            { label: 'Diagram', prompt: 'Give me an ASCII architecture diagram' },
            { label: '2-Mark', prompt: 'Give me a 2-mark university answer' },
            { label: '5-Mark', prompt: 'Give me a 5-mark university answer' },
            { label: '10-Mark', prompt: 'Give me a 10-mark university answer' },
            { label: 'Test me', prompt: 'Test me on this topic' },
            { label: 'In Marathi', prompt: 'Explain this in Marathi' },
            { label: 'In Hindi', prompt: 'Explain this in Hindi' },
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isTyping}
              onClick={() => handleSendMessage(chip.prompt)}
              className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#E8F7F0] text-[#17231F] hover:text-[#18A673] border border-[#E5EBE7] hover:border-[#18A673]/40 whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-xs font-semibold"
            >
              {chip.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a question or follow-up (e.g. 'Explain it simply', 'Give me a 5-mark answer', 'Give me an example')..."
            className="flex-1 bg-[#FFFFFF] border border-[#E5EBE7] rounded-xl px-4 py-3 text-xs text-[#17231F] placeholder-[#68756F]/60 focus:outline-none focus:border-[#18A673] transition-colors shadow-inner"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !inputQuery.trim()}
            className="px-5 py-3 bg-[#18A673] hover:bg-[#18A673]/90 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Example Scenarios */}
        <div className="flex items-center gap-1.5 text-[10px] text-[#68756F] overflow-x-auto pt-0.5">
          <span className="shrink-0 font-medium">Try Mode:</span>
          <button
            type="button"
            onClick={() => handleSendMessage('What is machine learning?')}
            className="hover:text-[#18A673] underline cursor-pointer shrink-0 font-semibold"
          >
            "What is machine learning?" (General AI)
          </button>
          <span className="text-[#E5EBE7]">·</span>
          <button
            type="button"
            onClick={() => handleSendMessage('According to my DAA notes, explain binary search')}
            className="hover:text-[#FF6B5F] underline cursor-pointer shrink-0 font-semibold"
          >
            "According to my notes, explain binary search" (Notes)
          </button>
          <span className="text-[#E5EBE7]">·</span>
          <button
            type="button"
            onClick={() => handleSendMessage('Explain K-Means and compare it with the method in my notes')}
            className="hover:text-[#FF6B5F] underline cursor-pointer shrink-0 font-semibold"
          >
            "Compare K-Means with my notes" (Hybrid)
          </button>
        </div>
      </div>
    </div>
  );
};
