# utils.py

import os
import tempfile
import uuid
import requests
import openai
import faiss
import numpy as np
import shutil
from PyPDF2 import PdfReader
from typing import List
from fastapi import UploadFile

# Set your OpenAI API key (from environment)
openai.api_key = os.getenv("OPENAI_API_KEY", "sk-proj-yourkey")

EMBEDDING_MODEL = "text-embedding-ada-002"
GPT_MODEL = "gpt-4"

# --- PDF Extraction ---
def extract_text_from_pdf_url(pdf_url: str) -> List[str]:
    response = requests.get(pdf_url)
    if response.status_code != 200:
        raise Exception("Failed to download document")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(response.content)
        tmp_path = tmp.name

    reader = PdfReader(tmp_path)
    chunks = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            chunks.append(f"Page {i+1}:\n{text.strip()}")
    return chunks

# --- Embedding + FAISS ---
def get_vectorstore(doc_id: str, chunks: List[str]):
    embeddings = openai.Embedding.create(input=chunks, model=EMBEDDING_MODEL)["data"]
    vecs = np.array([d["embedding"] for d in embeddings]).astype("float32")
    index = faiss.IndexFlatL2(len(vecs[0]))
    index.add(vecs)
    return {"index": index, "chunks": chunks}

# --- Retrieve Relevant Chunks ---
def retrieve_relevant_chunks(question: str, store):
    embedding = openai.Embedding.create(input=[question], model=EMBEDDING_MODEL)["data"][0]["embedding"]
    D, I = store["index"].search(np.array([embedding]).astype("float32"), k=3)
    return [store["chunks"][i] for i in I[0]]

# --- Generate Final Answer ---
def generate_detailed_answer(question: str, context_chunks: List[str]):
    prompt = f"""
You are an AI assistant for reading insurance policy documents.
Given the following context from a document and a question, extract the answer and specify:
- The most relevant clause (quote exact text)
- Section (guess based on content if needed)
- Page number if found in the context
- A brief rationale for why this was chosen

Context:
{chr(10).join(context_chunks)}

Question: {question}

Respond in JSON format like:
{{
  "answer": "...",
  "clause": "...",
  "section": "...",
  "page": 5,
  "rationale": "..."
}}
"""
    res = openai.ChatCompletion.create(
        model=GPT_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )
    try:
        parsed = res["choices"][0]["message"]["content"]
        return eval(parsed)
    except Exception:
        return {
            "answer": "Sorry, I couldn’t extract an answer.",
            "clause": "",
            "section": "",
            "page": -1,
            "rationale": "Failed to parse the model output."
        }

# --- Main Entry Function ---
async def process_pdf_and_respond(file: UploadFile, questions: List[str]):
    # Save uploaded PDF to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp_path = tmp.name
        with open(tmp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    # Extract text from PDF
    reader = PdfReader(tmp_path)
    chunks = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            chunks.append(f"Page {i+1}:\n{text.strip()}")

    # Build vector index
    doc_id = str(uuid.uuid4())
    store = get_vectorstore(doc_id, chunks)

    # Answer questions
    results = []
    for q in questions:
        context = retrieve_relevant_chunks(q, store)
        answer = generate_detailed_answer(q, context)
        results.append(answer)

    return {"answers": results}
