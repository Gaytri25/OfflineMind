# OfflineMind – Local AI Knowledge & Study Assistant

> **“Private AI that works even when the internet doesn't.”**

OfflineMind is a complete, private, offline-first AI knowledge assistant designed to demonstrate that useful, document-grounded AI can run on modest local hardware without cloud APIs, subscription fees, or internet access.

#Solution - "https://offlinemind-local-ai-exam-tutor.ai.studio/"
---

## 🟢 Core Highlights

- **100% Zero-Cloud Execution**: No OpenAI, no Gemini, no Claude, no remote inference.
- **Offline Proof Mode**: Verify that queries, document RAG, and reasoning work with Ethernet unplugged and Wi-Fi disabled.
- **Strict Evidence Hallucination Protection**: When an answer is not in local documents, refuses to hallucinate and reports 0 evidence found.
- **Smart Revision Mode**: 8 study modes including Quick Revision, 5-Mark Answer, 10-Mark Answer, MCQs, Viva Mode, Flashcards, and "Explain Like a Teacher".
- **Local Languages**: Full support for English, Hindi (हिंदी), and Marathi (मराठी) with automated simplification.
- **Document to Knowledge**: One-click "Generate Study Pack" (Summary, formulas, definitions, questions, checklists).
- **Performance Lab**: Real measured latency, tokens/sec, RAM consumption, and "When Does Small Become Too Small?" usefulness threshold experiments.
- **Hardware-Aware Model Recommender**: Assesses local CPU and RAM to recommend 1B, 3B, or 7B quantized models.

---

## Architecture

```
User Document (.pdf, .docx, .txt, .md, .csv)
                    │
                    ▼
     Local Text Extraction (PyPDF / python-docx)
                    │
                    ▼
     Sliding Window Chunking (500 chars, 80 overlap)
                    │
                    ▼
   Local Vector Inverted Index & Cosine Embeddings (In-Memory)
                    │
                    ▼
          Semantic Query Matcher
                    │
                    ▼
    Local Small LLM (Ollama / llama.cpp / In-Process GGUF)
                    │
                    ▼
Source-Attributed Answer + Latency & Token Telemetry + "Why Did AI Answer This?"
```

---

## Installation & Setup

### Prerequisites
1. **Node.js** (v18+)
2. **Python** (v3.10+ recommended)
3. *(Optional)* **Ollama** or **llama.cpp** if you wish to run external GGUF models.

### Quick Start (Windows)
1. Double click `setup.bat` (installs virtual environment, dependencies).
2. Double click `run.bat` (starts application on `http://localhost:3000`).

### Manual Setup (Linux / macOS / Windows)

```bash
# 1. Clone or extract the repository
cd offline-mind

# 2. Python Backend Setup (Optional if using embedded engine)
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 3. Start Python backend (Optional)
uvicorn backend.main:app --host 127.0.0.1 --port 8000 &

# 4. Frontend & Fullstack App Setup
npm install
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| **Port 3000 already in use** | Another dev server is running | Kill the previous process or edit port in `server.ts` / `package.json` |
| **Model not found / Ollama not running** | Ollama daemon not started | OfflineMind automatically falls back to its built-in in-process 1.2B engine. To use Ollama, run `ollama serve` and `ollama run llama3.2:1b`. |
| **PDF Extraction error** | Scanned image PDF without text layer | Upload searchable text PDFs, Word DOCX, Markdown, or TXT files. |
| **High RAM usage** | Running 7B or 8B model on an 8GB machine | Switch to 1B or 3B quantized model in the Model Recommender. |
| **Simulated Internet Off** | Kill Switch enabled | This is an intentional feature! Toggle "Simulate Internet Off" in the top bar to resume network calls. |

---

## License & Privacy Statement

OfflineMind sends **0 bytes** outside your computer. All documents, vector embeddings, and conversation logs remain strictly on localhost.
