from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv

from services.resume_analyzer import analyze_resume_text
from services.jd_matcher import compare_resume_jd
from services.roadmap_generator import generate_learning_roadmap
from services.chat_mentor import chat_with_mentor
from services.interview_prep_planner import generate_interview_prep_plan
from services.classroom_assistants import (
    chat_with_technical_assistant,
    chat_with_coding_assistant,
    chat_with_aptitude_assistant
)

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Placement Mentor - AI Service")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class ResumeAnalysisRequest(BaseModel):
    resume_text: str

class ResumeAnalysisResponse(BaseModel):
    skills: List[str]
    softSkills: List[str]
    projects: List[str]
    summary: str

class CompareRequest(BaseModel):
    resume_text: str
    jd_text: str
    target_role: str

class CompareResponse(BaseModel):
    atsScore: int
    matchScore: int
    strengths: List[str]
    weaknesses: List[str]
    missingSkills: List[str]
    projectSuggestions: List[str]
    learningSuggestions: List[str]

class RoadmapRequest(BaseModel):
    target_role: str
    timeframe_months: int
    current_skills: List[str]

class WeekData(BaseModel):
    weekNumber: int
    focus: str
    topics: List[str]
    tasks: List[str]

class RoadmapResponse(BaseModel):
    weeks: List[WeekData]

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    response: str
    role: str

class InterviewRound(BaseModel):
    roundName: str
    roundType: str
    description: str = ""

class InterviewPrepRequest(BaseModel):
    company: str
    position: str
    interview_date: str
    rounds: List[InterviewRound]
    user_skills: List[str] = []
    additional_notes: str = ""

class InterviewPrepResponse(BaseModel):
    preparationPlan: dict

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "AI Service is running"}

# Endpoint 1: Analyze Resume
@app.post("/ai/analyze-resume", response_model=ResumeAnalysisResponse)
async def analyze_resume(request: ResumeAnalysisRequest):
    try:
        result = await analyze_resume_text(request.resume_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing resume: {str(e)}")

# Endpoint 2: Compare Resume with JD
@app.post("/ai/compare-resume-jd", response_model=CompareResponse)
async def compare_resume_with_jd(request: CompareRequest):
    try:
        result = await compare_resume_jd(
            request.resume_text,
            request.jd_text,
            request.target_role
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error comparing resume and JD: {str(e)}")

# Endpoint 3: Generate Roadmap
@app.post("/ai/generate-roadmap", response_model=RoadmapResponse)
async def generate_roadmap(request: RoadmapRequest):
    try:
        result = await generate_learning_roadmap(
            request.target_role,
            request.timeframe_months,
            request.current_skills
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating roadmap: {str(e)}")

# Endpoint 4: Chat with Mentor
@app.post("/ai/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        conversation = [{"role": msg.role, "content": msg.content} for msg in request.conversation_history]
        result = chat_with_mentor(request.message, conversation)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in chat: {str(e)}")

# Endpoint 5: Generate Interview Preparation Plan
@app.post("/ai/interview-prep-plan", response_model=InterviewPrepResponse)
async def generate_prep_plan(request: InterviewPrepRequest):
    try:
        rounds_data = [
            {
                "roundName": round.roundName,
                "roundType": round.roundType,
                "description": round.description
            }
            for round in request.rounds
        ]
        
        result = await generate_interview_prep_plan(
            request.company,
            request.position,
            request.interview_date,
            rounds_data,
            request.user_skills,
            request.additional_notes
        )
        return {"preparationPlan": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating prep plan: {str(e)}")

# Endpoint 6: Technical Assistant Chat
@app.post("/ai/classroom/technical", response_model=ChatResponse)
async def technical_assistant_chat(request: ChatRequest):
    try:
        conversation = [{"role": msg.role, "content": msg.content} for msg in request.conversation_history]
        result = chat_with_technical_assistant(request.message, conversation)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in technical assistant: {str(e)}")

# Endpoint 7: Coding Assistant Chat
@app.post("/ai/classroom/coding", response_model=ChatResponse)
async def coding_assistant_chat(request: ChatRequest):
    try:
        conversation = [{"role": msg.role, "content": msg.content} for msg in request.conversation_history]
        result = chat_with_coding_assistant(request.message, conversation)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in coding assistant: {str(e)}")

# Endpoint 8: Aptitude Assistant Chat
@app.post("/ai/classroom/aptitude", response_model=ChatResponse)
async def aptitude_assistant_chat(request: ChatRequest):
    try:
        conversation = [{"role": msg.role, "content": msg.content} for msg in request.conversation_history]
        result = chat_with_aptitude_assistant(request.message, conversation)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in aptitude assistant: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
