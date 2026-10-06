"""
OfflineMind - Local Document Parsing & Extraction
Processes files locally with zero external network or cloud OCR.
"""
import os
import io
import re
from typing import List, Dict, Any

def extract_text_from_file(filename: str, content_bytes: bytes) -> Dict[str, Any]:
    """Extracts text locally without cloud converters."""
    ext = filename.lower().split('.')[-1]
    pages = []

    if ext in ['txt', 'md']:
        text = content_bytes.decode('utf-8', errors='ignore')
        pages = [{"page": 1, "text": text}]

    elif ext == 'csv':
        try:
            import pandas as pd
            df = pd.read_csv(io.BytesIO(content_bytes))
            summary_text = f"CSV Dataset Summary: {len(df)} rows, {len(df.columns)} columns.\nColumns: {', '.join(df.columns.astype(str))}\n\n"
            summary_text += df.head(50).to_string()
            pages = [{"page": 1, "text": summary_text}]
        except Exception:
            text = content_bytes.decode('utf-8', errors='ignore')
            pages = [{"page": 1, "text": text}]

    elif ext == 'pdf':
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(content_bytes))
            for i, page in enumerate(reader.pages):
                extracted = page.extract_text() or ""
                if extracted.strip():
                    pages.append({"page": i + 1, "text": extracted})
        except Exception as e:
            # Fallback basic text scrape if pypdf encounters an issue
            raw_text = content_bytes.decode('latin-1', errors='ignore')
            clean = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\xff]', ' ', raw_text)
            pages = [{"page": 1, "text": clean[:10000]}]

    elif ext == 'docx':
        try:
            import docx
            doc = docx.Document(io.BytesIO(content_bytes))
            full_text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
            pages = [{"page": 1, "text": full_text}]
        except Exception:
            text = content_bytes.decode('utf-8', errors='ignore')
            pages = [{"page": 1, "text": text}]

    else:
        text = content_bytes.decode('utf-8', errors='ignore')
        pages = [{"page": 1, "text": text}]

    if not pages:
        pages = [{"page": 1, "text": "Document contained no extractable text."}]

    return {
        "filename": filename,
        "page_count": len(pages),
        "pages": pages
    }

def chunk_document_pages(filename: str, doc_id: str, pages: List[Dict[str, Any]], chunk_size: int = 500, overlap: int = 80) -> List[Dict[str, Any]]:
    """Splits document pages into semantic chunks with overlapping boundaries."""
    chunks = []
    chunk_idx = 0

    for p in pages:
        page_num = p["page"]
        text = p["text"]
        
        # Split by paragraphs or sentences
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        if not paragraphs:
            paragraphs = [text]

        current_chunk = ""
        for para in paragraphs:
            if len(current_chunk) + len(para) > chunk_size and len(current_chunk) > 100:
                chunks.append({
                    "id": f"{doc_id}-chunk-{chunk_idx}",
                    "document_id": doc_id,
                    "document_name": filename,
                    "chunk_index": chunk_idx,
                    "page_number": page_num,
                    "content": current_chunk.strip()
                })
                chunk_idx += 1
                # retain overlap
                current_chunk = current_chunk[-overlap:] + " " + para
            else:
                current_chunk += "\n" + para if current_chunk else para

        if current_chunk.strip():
            chunks.append({
                "id": f"{doc_id}-chunk-{chunk_idx}",
                "document_id": doc_id,
                "document_name": filename,
                "chunk_index": chunk_idx,
                "page_number": page_num,
                "content": current_chunk.strip()
            })
            chunk_idx += 1

    return chunks
