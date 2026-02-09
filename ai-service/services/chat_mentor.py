"""
Chat Mentor Service - Placement preparation guidance
Using Groq LLM
"""

import os
from langchain_core.prompts import PromptTemplate
from langchain.globals import set_verbose
from langchain_groq import ChatGroq

set_verbose(False)


def get_llm():
    """
    Get Groq LLM instance
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not found in environment variables")

    return ChatGroq(
        model="llama-3.1-8b-instant",
        groq_api_key=api_key,
        temperature=0.7
    )


def chat_with_mentor(message: str, conversation_history: list = None) -> dict:
    """
    Chat with AI placement mentor

    Args:
        message: User's message
        conversation_history: Previous conversation messages (optional)

    Returns:
        dict with mentor's response and role
    """
    llm = get_llm()

    # Build conversation context (last 3 exchanges)
    context = ""
    if conversation_history:
        for msg in conversation_history[-6:]:
            role = msg.get("role", "user").upper()
            content = msg.get("content", "")
            context += f"{role}: {content}\n"

    prompt_template = PromptTemplate(
        input_variables=["context", "message"],
        template="""
You are an expert AI Placement Mentor with deep knowledge in career guidance, interview preparation, resume building, technical skills, and job search strategies.

Your expertise includes:
- Resume and CV optimization
- Technical interview preparation (DSA, backend, system design)
- Behavioral interview techniques (STAR method)
- Company-specific interview preparation
- Skill development roadmaps
- Career guidance and confidence building

Guidelines:
- Be encouraging and honest
- Provide clear, actionable advice
- Use structured explanations
- Tailor guidance to the user's level
- Avoid unnecessary verbosity

Conversation so far:
{context}

USER: {message}

MENTOR:
"""
    )

    formatted_prompt = prompt_template.format(
        context=context if context else "This is the start of the conversation.",
        message=message
    )

    response = llm.invoke(formatted_prompt)

    return {
        "response": response.content,
        "role": "mentor"
    }
