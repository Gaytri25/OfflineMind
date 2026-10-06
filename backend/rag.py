"""
OfflineMind - Local RAG & Semantic Retrieval Engine
Performs vector embeddings and similarity search 100% on localhost using scikit-learn & numpy.
No cloud vector database (Pinecone/Weaviate/Milvus) required.
"""
import re
import math
from typing import List, Dict, Any, Tuple
from collections import Counter

class LocalVectorStore:
    def __init__(self):
        self.chunks: List[Dict[str, Any]] = []
        self.vocabulary: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}
        self.chunk_vectors: List[Dict[str, float]] = []

    def tokenize(self, text: str) -> List[str]:
        cleaned = re.sub(r'[^\w\s]', ' ', text.lower())
        tokens = [t for t in cleaned.split() if len(t) > 2]
        return tokens

    def add_chunks(self, new_chunks: List[Dict[str, Any]]):
        self.chunks.extend(new_chunks)
        self._rebuild_index()

    def clear(self):
        self.chunks = []
        self.vocabulary = {}
        self.idf = {}
        self.chunk_vectors = []

    def remove_document(self, doc_id: str):
        self.chunks = [c for c in self.chunks if c["document_id"] != doc_id]
        self._rebuild_index()

    def _rebuild_index(self):
        if not self.chunks:
            self.vocabulary = {}
            self.idf = {}
            self.chunk_vectors = []
            return

        N = len(self.chunks)
        doc_freq = Counter()
        tokenized_chunks = []

        for chunk in self.chunks:
            tokens = self.tokenize(chunk["content"])
            tokenized_chunks.append(tokens)
            unique_tokens = set(tokens)
            for t in unique_tokens:
                doc_freq[t] += 1

        self.vocabulary = {t: idx for idx, (t, _) in enumerate(doc_freq.items())}
        self.idf = {t: math.log((N + 1) / (freq + 1)) + 1.0 for t, freq in doc_freq.items()}

        self.chunk_vectors = []
        for tokens in tokenized_chunks:
            tf = Counter(tokens)
            vector = {}
            norm_sq = 0.0
            for t, count in tf.items():
                tfidf = (1.0 + math.log(count)) * self.idf.get(t, 1.0)
                vector[t] = tfidf
                norm_sq += tfidf * tfidf
            norm = math.sqrt(norm_sq) or 1.0
            # normalize
            normalized_vec = {t: val / norm for t, val in vector.items()}
            self.chunk_vectors.append(normalized_vec)

    def search(self, query: str, top_k: int = 4, threshold: float = 0.12) -> List[Dict[str, Any]]:
        """Returns top matching chunks with similarity score."""
        if not self.chunks or not self.chunk_vectors:
            return []

        q_tokens = self.tokenize(query)
        if not q_tokens:
            return []

        q_tf = Counter(q_tokens)
        q_vec = {}
        norm_sq = 0.0
        for t, count in q_tf.items():
            tfidf = (1.0 + math.log(count)) * self.idf.get(t, 1.0)
            q_vec[t] = tfidf
            norm_sq += tfidf * tfidf
        q_norm = math.sqrt(norm_sq) or 1.0
        q_norm_vec = {t: val / q_norm for t, val in q_vec.items()}

        results = []
        for i, doc_vec in enumerate(self.chunk_vectors):
            dot_product = 0.0
            for t, q_val in q_norm_vec.items():
                if t in doc_vec:
                    dot_product += q_val * doc_vec[t]

            # Also boost if exact phrase or primary subject appears
            content_lower = self.chunks[i]["content"].lower()
            if query.lower() in content_lower:
                dot_product += 0.25

            if dot_product >= threshold:
                results.append({
                    "chunk": self.chunks[i],
                    "similarity": round(min(float(dot_product), 0.99), 3),
                    "document_name": self.chunks[i]["document_name"],
                    "page_number": self.chunks[i]["page_number"],
                    "content": self.chunks[i]["content"]
                })

        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:top_k]

# Global singleton in-memory vector store
local_vector_db = LocalVectorStore()
