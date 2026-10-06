# Local Models Directory for OfflineMind

Place your offline open-weight model files (`.gguf`) here or run Ollama locally on your system.

## Supported Model Formats & Recommendations

| Category | Recommended Model | RAM Required | Best Use Case |
|---|---|---|---|
| **Lightweight (1B)** | `Llama-3.2-1B-Instruct-Q4_K_M.gguf` or `Qwen2.5-1.5B-Instruct-Q4_K_M.gguf` | ~1.5 - 2.5 GB RAM | Older laptops, modest dual-core CPUs, fast question answering |
| **Balanced (3B)** | `Qwen2.5-3B-Instruct-Q4_K_M.gguf` or `Phi-3.5-mini-instruct-Q4_K_M.gguf` | ~3.5 - 5.0 GB RAM | Standard 8GB RAM laptops, high-quality RAG, structured study notes |
| **Quality (7B - 8B)** | `Llama-3.1-8B-Instruct-Q4_K_M.gguf` or `Mistral-7B-Instruct-v0.3.Q4_K_M.gguf` | ~6.5 - 9.0 GB RAM | 16GB+ systems, complex logic, in-depth multi-source synthesis |

## How to use with Ollama
If you already use Ollama, simply pull any small model:
```bash
ollama run llama3.2:1b
# or
ollama run qwen2.5:3b
```
OfflineMind automatically auto-detects Ollama running at `http://127.0.0.1:11434`.

## Embedded Mode
If no external daemon or model file is provided, OfflineMind defaults to its built-in **OfflineMind Micro-GGUF Engine (1.2B Quantized)**, which runs zero-cloud in-memory inference with full RAG, study pack generation, and Marathi/Hindi/English language processing.
