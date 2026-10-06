"""
OfflineMind - FastAPI Local Server
Zero-cloud local inference and document engine.
"""
import uuid
import time
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from .hardware import get_system_hardware
from .database import init_db, get_connection
from .documents import extract_text_from_file, chunk_document_pages
from .rag import local_vector_db
from .chat import detect_local_runtime, run_local_inference
from .benchmark import run_benchmark_suite, run_usefulness_experiment

app = FastAPI(title="OfflineMind Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

class QueryRequest(BaseModel):
    query: str
    strict_evidence_mode: bool = True
    subject: Optional[str] = None
    study_mode: Optional[str] = "Standard"
    target_language: Optional[str] = "English" # English, Marathi, Hindi
    simplify: bool = False

@app.get("/api/health")
def health():
    return {
        "status": "ONLINE_LOCAL",
        "internet_required": False,
        "cloud_apis": "NONE",
        "timestamp": time.time()
    }

@app.get("/api/hardware")
def hardware():
    return get_system_hardware()

@app.get("/api/runtime")
def runtime_status():
    return detect_local_runtime()

@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        content_bytes = await file.read()
        extracted = extract_text_from_file(file.filename, content_bytes)
        doc_id = str(uuid.uuid4())[:8]

        chunks = chunk_document_pages(file.filename, doc_id, extracted["pages"])
        local_vector_db.add_chunks(chunks)

        # Record in local SQLite
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO documents (id, name, file_type, file_size, page_count, chunk_count) VALUES (?, ?, ?, ?, ?, ?)",
            (doc_id, file.filename, file.filename.split('.')[-1], len(content_bytes), extracted["page_count"], len(chunks))
        )
        conn.commit()
        conn.close()

        return {
            "id": doc_id,
            "filename": file.filename,
            "page_count": extracted["page_count"],
            "chunks_indexed": len(chunks),
            "message": "Document indexed locally into in-memory vector store."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents/list")
def list_documents():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, file_type, file_size, page_count, chunk_count, added_at FROM documents ORDER BY added_at DESC")
    rows = cursor.fetchall()
    conn.close()
    
    docs = []
    for r in rows:
        docs.append({
            "id": r[0],
            "name": r[1],
            "file_type": r[2],
            "file_size": r[3],
            "page_count": r[4],
            "chunk_count": r[5],
            "added_at": r[6]
        })
    return docs

@app.delete("/api/documents/{doc_id}")
def delete_document(doc_id: str):
    local_vector_db.remove_document(doc_id)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
    cursor.execute("DELETE FROM document_chunks WHERE document_id = ?", (doc_id,))
    conn.commit()
    conn.close()
    return {"status": "DELETED", "id": doc_id}

@app.get("/api/search")
def semantic_search(q: str, limit: int = 5):
    results = local_vector_db.search(q, top_k=limit)
    return results

@app.post("/api/chat/ask")
def ask_question(req: QueryRequest):
    t0 = time.perf_counter()
    retrieved = local_vector_db.search(req.query, top_k=3, threshold=0.15)
    
    # Strict Evidence Protection Check
    if req.strict_evidence_mode and not retrieved:
        return {
            "answer": "I don't have enough information in your local knowledge base to answer this confidently.",
            "sources": [],
            "evidence_count": 0,
            "confidence": "None",
            "strict_mode_triggered": True,
            "why_explanation": "Strict Evidence Mode is active. No relevant passages met the local vector similarity threshold (0.15) in your uploaded documents.",
            "latency_ms": round((time.perf_counter() - t0) * 1000, 1),
            "tokens_per_sec": 0.0,
            "is_offline": True
        }

    # Format context from retrieved chunks
    context_text = "\n\n---\n\n".join([f"Source: {r['document_name']} (Page {r['page_number']}):\n{r['content']}" for r in retrieved])
    runtime = detect_local_runtime()
    
    # Handle language instruction
    lang_prompt = ""
    if req.target_language == "Marathi":
        lang_prompt = " Answer strictly in simple, accurate Marathi (मराठी)."
    elif req.target_language == "Hindi":
        lang_prompt = " Answer strictly in simple, accurate Hindi (हिंदी)."

    system_prompt = f"You are OfflineMind, a local private AI assistant. Use the retrieved local documents to answer.{lang_prompt}"
    
    res = run_local_inference(req.query, system_prompt=f"{system_prompt}\nContext:\n{context_text}", runtime_info=runtime)

    sources = [
        {
            "document_name": r["document_name"],
            "page_number": r["page_number"],
            "similarity": r["similarity"],
            "snippet": r["content"][:200] + "..."
        }
        for r in retrieved
    ]

    confidence = "High" if len(retrieved) >= 2 and retrieved[0]["similarity"] > 0.4 else ("Medium" if retrieved else "Low")
    
    why_explanation = (
        f"Retrieved {len(retrieved)} relevant section(s) from local documents "
        f"('{', '.join(set(r['document_name'] for r in retrieved)) if retrieved else 'General Knowledge'}') "
        f"with top similarity {retrieved[0]['similarity'] if retrieved else 0.0} and synthesized the answer 100% on local hardware."
    )

    return {
        "answer": res["text"],
        "sources": sources,
        "evidence_count": len(retrieved),
        "confidence": confidence,
        "strict_mode_triggered": False,
        "why_explanation": why_explanation,
        "latency_ms": res["latency_ms"],
        "tokens_per_sec": res["tokens_per_sec"],
        "token_count": res["token_count"],
        "source_engine": res["source_engine"],
        "is_offline": True
    }

@app.post("/api/benchmark/run")
def run_benchmark(sample_only: bool = True):
    return run_benchmark_suite(sample_only=sample_only)

@app.get("/api/benchmark/experiment")
def get_experiment():
    return run_usefulness_experiment()
