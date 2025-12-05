"""
Chat Mentor Service - Placement preparation guidance
"""
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import HumanMessage
from langchain.globals import set_verbose
import os

set_verbose(False)

def get_llm():
    """Get the configured LLM based on environment variable"""
    provider = os.getenv('LLM_PROVIDER', 'gemini').lower()
    
    if provider == 'openai':
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        model = os.getenv('OPENAI_MODEL', 'gpt-4')
        
        class OpenAIAdapter:
            def __init__(self, client, model):
                self.client = client
                self.model = model
            
            def invoke(self, prompt):
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7
                )
                from types import SimpleNamespace
                return SimpleNamespace(content=response.choices[0].message.content)
        
        return OpenAIAdapter(client, model)
    else:
        from langchain_google_genai import ChatGoogleGenerativeAI
        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY or GEMINI_API_KEY not found in environment variables")
        return ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=api_key,
            temperature=0.7,
            convert_system_message_to_human=True
        )

def chat_with_mentor(message: str, conversation_history: list = None) -> dict:
    """
    Chat with AI placement mentor
    
    Args:
        message: User's message
        conversation_history: Previous conversation messages (optional)
    
    Returns:
        dict with mentor's response and updated conversation
    """
    llm = get_llm()
    
    # Build conversation context
    context = ""
    if conversation_history:
        for msg in conversation_history[-6:]:  # Last 3 exchanges
            role = msg.get('role', 'user')
            content = msg.get('content', '')
            context += f"{role.upper()}: {content}\n"
    
    prompt_template = PromptTemplate(
        input_variables=["context", "message"],
        template="""You are an expert AI Placement Mentor with deep knowledge in career guidance, interview preparation, resume building, technical skills, and job search strategies. Your role is to help candidates prepare for placements and job interviews.

Your expertise includes:
- Resume and CV optimization
- Technical interview preparation (coding, system design, DSA)
- Behavioral interview techniques (STAR method)
- Company-specific interview tips
- Salary negotiation strategies
- Career path guidance
- Skill development roadmaps
- Job search strategies
- Mock interview feedback
- Confidence building and mindset coaching

Guidelines:
- Be encouraging, supportive, and motivational
- Provide actionable, practical advice
- Ask clarifying questions when needed
- Share specific examples and frameworks
- Be honest about areas needing improvement
- Tailor advice to the user's experience level
- Use a friendly, mentor-like tone

{context}

USER: {message}

MENTOR:"""
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
