"""
Classroom Assistants Service - Specialized training assistants
Using Groq LLM
"""

import os
from langchain.globals import set_verbose
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

set_verbose(False)


# --------------------------------------------------
# Initialize Groq LLM
# --------------------------------------------------
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


# --------------------------------------------------
# Technical Interview Assistant
# --------------------------------------------------
def chat_with_technical_assistant(message: str, conversation_history: list = None) -> dict:
    llm = get_llm()

    context = ""
    if conversation_history:
        for msg in conversation_history[-6:]:
            role = msg.get("role", "user").upper()
            content = msg.get("content", "")
            context += f"{role}: {content}\n"

    prompt_template = PromptTemplate(
        input_variables=["context", "message"],
        template="""
You are an expert Technical Interview Trainer with 15+ years of experience preparing candidates for top tech companies.

Your expertise covers:
- Data Structures & Algorithms
- System Design (HLD, LLD)
- Object-Oriented Programming
- Operating Systems, Networks, DBMS
- Problem-solving strategies
- Time & space complexity analysis
- Interview communication skills

Teaching Style:
- Start from fundamentals
- Explain step-by-step
- Encourage thinking out loud
- Discuss trade-offs
- Provide interview-grade insights

{context}

USER: {message}

TECHNICAL TRAINER:
"""
    )

    formatted_prompt = prompt_template.format(
        context=context if context else "This is the start of the training session.",
        message=message
    )

    response = llm.invoke(formatted_prompt)

    return {
        "response": response.content,
        "role": "technical_assistant"
    }


# --------------------------------------------------
# Coding Practice Assistant
# --------------------------------------------------
def chat_with_coding_assistant(message: str, conversation_history: list = None) -> dict:
    llm = get_llm()

    context = ""
    if conversation_history:
        for msg in conversation_history[-6:]:
            role = msg.get("role", "user").upper()
            content = msg.get("content", "")
            context += f"{role}: {content}\n"

    prompt_template = PromptTemplate(
        input_variables=["context", "message"],
        template="""
You are an expert Coding Interview Trainer specializing in helping candidates clear coding rounds.

Your expertise includes:
- Live coding strategies
- Debugging & optimization
- Clean, efficient coding
- Edge case handling
- Time & space complexity
- Common coding patterns

When code is shared:
- Identify bugs
- Suggest optimizations
- Explain complexity
- Provide test cases

Guidelines:
- Encourage explaining approach first
- Teach patterns, not memorization
- Emphasize production-quality code

{context}

USER: {message}

CODING TRAINER:
"""
    )

    formatted_prompt = prompt_template.format(
        context=context if context else "This is the start of the coding practice session.",
        message=message
    )

    response = llm.invoke(formatted_prompt)

    return {
        "response": response.content,
        "role": "coding_assistant"
    }


# --------------------------------------------------
# Aptitude & Reasoning Assistant
# --------------------------------------------------
def chat_with_aptitude_assistant(message: str, conversation_history: list = None) -> dict:
    llm = get_llm()

    context = ""
    if conversation_history:
        for msg in conversation_history[-6:]:
            role = msg.get("role", "user").upper()
            content = msg.get("content", "")
            context += f"{role}: {content}\n"

    prompt_template = PromptTemplate(
        input_variables=["context", "message"],
        template="""
You are an expert Aptitude & Reasoning Trainer for placement preparation.

Your expertise covers:
- Quantitative Aptitude
- Logical Reasoning
- Verbal Ability
- Data Interpretation
- Time management strategies
- Company-specific aptitude patterns

Teaching Method:
- Explain with examples
- Teach shortcuts
- Provide step-by-step solutions
- Focus on accuracy and speed
- Share exam strategies

{context}

USER: {message}

APTITUDE TRAINER:
"""
    )

    formatted_prompt = prompt_template.format(
        context=context if context else "This is the start of the aptitude training session.",
        message=message
    )

    response = llm.invoke(formatted_prompt)

    return {
        "response": response.content,
        "role": "aptitude_assistant"
    }
