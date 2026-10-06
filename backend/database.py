"""
OfflineMind - SQLite Local Database
Zero-cloud local persistent storage for documents, embeddings index, and chats.
"""
import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

DB_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "database")
DB_PATH = os.path.join(DB_DIR, "offlinemind.db")

def init_db():
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Documents table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        page_count INTEGER DEFAULT 1,
        chunk_count INTEGER DEFAULT 0,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        metadata_json TEXT
    );
    """)

    # Chunks table for local RAG
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS document_chunks (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        document_name TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        page_number INTEGER DEFAULT 1,
        content TEXT NOT NULL,
        keywords_json TEXT,
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
    );
    """)

    # Chat history table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        sources_json TEXT,
        latency_ms REAL,
        tokens_per_sec REAL,
        confidence TEXT,
        why_explanation TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Benchmark results history
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS benchmark_history (
        id TEXT PRIMARY KEY,
        model_name TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        score INTEGER NOT NULL,
        avg_tokens_per_sec REAL,
        avg_latency_ms REAL,
        memory_used_mb REAL,
        breakdown_json TEXT
    );
    """)

    conn.commit()
    conn.close()

def get_connection():
    os.makedirs(DB_DIR, exist_ok=True)
    return sqlite3.connect(DB_PATH)
