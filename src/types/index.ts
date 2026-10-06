export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  pageNumber: number;
  content: string;
  quality?: 'good' | 'fallback';
  charCount?: number;
  wordCount?: number;
  headings?: string[];
}

export interface StoredDocument {
  id: string;
  name: string;
  fileType: string;
  fileSize: number;
  pageCount: number;
  chunkCount: number;
  addedAt: string;
  chunks: DocumentChunk[];
  readablePages?: number;
  ocrPages?: number;
  failedPages?: number;
  totalCharacters?: number;
  totalWords?: number;
  avgChunkSize?: number;
  extractionDurationMs?: number;
  statusMessage?: string;
}

export interface SourceCitation {
  documentName: string;
  pageNumber: number;
  similarity: number;
  snippet: string;
}

export interface ProblemSolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  mathOrCode?: string;
  noteCitation?: string;
}

export interface ProblemSolutionResult {
  id: string;
  problemStatement: string;
  identifiedTopic: string;
  understanding: string;
  relevantConcepts: string[];
  retrievedChunks: {
    documentName: string;
    pageNumber: number;
    snippet: string;
    similarity: number;
  }[];
  steps: ProblemSolutionStep[];
  finalAnswer: string;
  studentFriendlySummary: string;
  sourceReferences: {
    topic: string;
    documentName: string;
    pageNumber?: number;
  }[];
  timestamp: string;
  latencyMs: number;
}

export interface FollowUpAction {
  label: string;
  prompt: string;
  actionType?: 'explain' | 'example' | 'exam' | 'quiz' | 'shorter' | 'diagram' | 'translate';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceCitation[];
  retrievedPages?: number[];
  evidenceCount?: number;
  confidence?: 'High' | 'Medium' | 'Low' | 'None';
  strictModeTriggered?: boolean;
  whyExplanation?: string;
  latencyMs?: number;
  tokensPerSec?: number;
  tokenCount?: number;
  sourceEngine?: string;
  timestamp: string;
  followUpButtons?: FollowUpAction[];
  currentTopic?: string;
  currentSubject?: string;
  knowledgeSource?: 'general' | 'notes' | 'hybrid';
}

export interface StudyProfile {
  studentName: string;
  course: string;
  semester: string;
  selectedSubjects: string[];
  targetExamDate: string;
  preferredLanguage: 'English' | 'Hindi' | 'Marathi';
  preferredAnswerStyle: 'Point-Wise & Crisp' | 'In-Depth Academic' | 'Conceptual with Real-Life Analogies';
  difficultyLevel: 'Standard University Exam' | 'Competitive / Advanced' | 'Foundation / Beginner';
}

export interface SubjectTopic {
  id: string;
  name: string;
  mastered: boolean;
  isWeak?: boolean;
  revisionCount: number;
}

export interface SubjectData {
  id: string;
  name: string;
  icon: string;
  progressPercent: number;
  topics: SubjectTopic[];
  notesCount: number;
  quizHighScore: number;
  vivaAttempted: number;
  lastStudied?: string;
}

export interface QuizQuestionItem {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface VivaQuestionItem {
  id: string;
  topic: string;
  question: string;
  expectedKeywords: string[];
  modelAnswer: string;
}

export interface FlashcardItem {
  id: string;
  topic: string;
  front: string;
  back: string;
  mastered?: boolean;
}

export interface HardwareStats {
  os: string;
  platform: string;
  architecture: string;
  cpuName: string;
  cpuCoresPhysical: number;
  cpuCoresLogical: number;
  cpuSpeedMhz: number;
  totalRamGb: number;
  availableRamGb: number;
  usedRamGb: number;
  ramUsagePercent: number;
  nodeHeapUsedMb: number;
  nodeHeapTotalMb: number;
  nodeRssMb: number;
  gpuDetected: boolean;
  gpuInfo: string;
  recommendation: {
    tier: string;
    model: string;
    reason: string;
    quantization: string;
    contextLimit: number;
  };
  networkConnected: boolean;
}

export interface RuntimeStatus {
  detected: boolean;
  runtime: string;
  endpoint: string;
  activeModel: string;
  availableModels: string[];
}

export interface BenchmarkResult {
  id: string;
  category: string;
  prompt: string;
  latencyMs: number;
  tokensPerSec: number;
  accuracyPct: number;
  answerPreview?: string;
}

export interface BenchmarkSuiteResponse {
  status: string;
  benchmarkMode: string;
  totalTimeSec: number;
  totalQuestionsTested: number;
  overallOfflineScore: number;
  measuredMetrics: {
    avgLatencyMs: number;
    avgTokensPerSec: number;
    memoryUsageDeltaMb: number;
  };
  scoreBreakdown: {
    speed: number;
    memoryEfficiency: number;
    documentUnderstanding: number;
    reasoning: number;
    localLanguageMarathiHindi: number;
  };
  questionResults: BenchmarkResult[];
}

export interface ModelComparison {
  tier: string;
  example: string;
  paramSize: string;
  quantization: string;
  diskSize: string;
  measuredRam: string;
  tokensPerSec: number;
  firstTokenLatencyMs: number;
  contextHandling: string;
  qualityScore: number;
  multiHopRagScore: number;
  suitability: string;
}

export interface StudyPack {
  documentName: string;
  generatedAt: string;
  summary: string[];
  keyConcepts: { concept: string; description: string }[];
  definitions: { term: string; description: string }[];
  formulas: { name: string; formula: string; note: string }[];
  importantQuestions: { question: string; answer: string; marks: number }[];
  flashcards: { front: string; back: string }[];
  mcqs: { question: string; options: string[]; correctAnswer: number; explanation: string }[];
  vivaQuestions: { question: string; answer: string }[];
  checklist: { task: string; completed: boolean }[];
}

export type ActiveTab =
  | 'home'
  | 'chat'
  | 'subjects'
  | 'notes'
  | 'revision'
  | 'quiz'
  | 'viva'
  | 'progress'
  | 'settings';

export type ActiveWorkspace =
  | ActiveTab
  | 'dashboard'
  | 'ask_documents'
  | 'smart_revision'
  | 'local_language'
  | 'document_knowledge'
  | 'semantic_search'
  | 'performance_lab'
  | 'privacy_center'
  | 'code_bundle';
