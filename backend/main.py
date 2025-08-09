# backend/main.py

from fastapi import FastAPI, UploadFile, File, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from utils import process_pdf_and_respond
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/hackrx/run")
async def query_document(
    questions: List[str] = Form(...),
    file: UploadFile = File(...),
    authorization: str = Header(None)
):
    # Verify bearer token if needed
    required_token = os.getenv("OPENAI_API_KEY")
    if not authorization or not authorization.startswith("Bearer ") or authorization.split(" ")[1] != required_token:
        return {"error": "Invalid or missing token"}

    # Process and return answers
    return await process_pdf_and_respond(file, questions)
