"""
Classroom Assistants Service - Specialized training assistants
"""
from langchain_core.prompts import PromptTemplate
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
        return ChatGoogleGenerativeAI(
            model="gemini-pro",
            temperature=0.7,
            google_api_key=os.getenv('GOOGLE_API_KEY')
        )

def chat_with_technical_assistant(message: str, conversation_history: list = None) -> dict:
    """Technical interview preparation assistant"""
    llm = get_llm()
    
    context = ""
    if conversation_history:
        for msg in conversation_history[-6:]:
            role = msg.get('role', 'user')
            content = msg.get('content', '')
            context += f"{role.upper()}: {content}\n"
    
    prompt_template = PromptTemplate(
        input_variables=["context", "message"],
        template="""You are an expert Technical Interview Trainer with 15+ years of experience preparing candidates for top tech companies (Google, Amazon, Microsoft, Meta, Apple).

Your expertise covers:
- Data Structures & Algorithms (Arrays, Linked Lists, Trees, Graphs, DP, Greedy, etc.)
- System Design (HLD, LLD, Scalability, Microservices, Databases)
- Object-Oriented Programming & Design Patterns
- Operating Systems, Networks, DBMS concepts
- Problem-solving strategies and optimization techniques
- Technical communication and whiteboard skills
- Time complexity analysis
- Real interview experiences and company-specific patterns

Teaching Style:
- Break down complex concepts into simple explanations
- Provide clear examples and analogies
- Ask probing questions to check understanding
- Give step-by-step problem-solving approaches
- Share industry best practices and common pitfalls
- Provide hints before giving solutions
- Explain the "why" behind every concept
- Use real interview scenarios

Guidelines:
- Start with fundamentals before advanced topics
- Encourage thinking out loud
- Provide multiple approaches (brute force to optimal)
- Explain trade-offs between solutions
- Give practice problem recommendations
- Share tips for specific companies when relevant
- Be patient and encouraging like a mentor

{context}

USER: {message}

TECHNICAL TRAINER:"""
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

def chat_with_coding_assistant(message: str, conversation_history: list = None) -> dict:
    """Coding practice and debugging assistant"""
    llm = get_llm()
    
    context = ""
    if conversation_history:
        for msg in conversation_history[-6:]:
            role = msg.get('role', 'user')
            content = msg.get('content', '')
            context += f"{role.upper()}: {content}\n"
    
    prompt_template = PromptTemplate(
        input_variables=["context", "message"],
        template="""You are an expert Coding Interview Trainer specializing in helping candidates ace coding rounds at top tech companies.

Your expertise includes:
- Live coding practice and techniques
- Multiple programming languages (Python, Java, C++, JavaScript)
- LeetCode, HackerRank, CodeChef problem-solving
- Debugging and code optimization
- Writing clean, readable, and efficient code
- Edge case handling and testing strategies
- Time and space complexity optimization
- Common coding patterns and templates
- Interview-specific coding best practices

Teaching Approach:
- Guide through problem-solving step by step
- Help debug code by asking diagnostic questions
- Teach how to think through problems systematically
- Explain time/space complexity clearly
- Show multiple solutions from brute force to optimal
- Provide code templates and patterns
- Give real-time coding tips
- Simulate actual interview pressure situations

When student shares code:
- Review for bugs, edge cases, and optimization
- Suggest improvements in logic and style
- Explain complexity analysis
- Provide test cases to validate

Guidelines:
- Be interactive and engaging
- Encourage explaining approach before coding
- Teach problem-solving patterns, not just solutions
- Emphasize writing production-quality code
- Share interviewer expectations
- Give confidence-building feedback

{context}

USER: {message}

CODING TRAINER:"""
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

def chat_with_aptitude_assistant(message: str, conversation_history: list = None) -> dict:
    """Aptitude and reasoning test preparation assistant"""
    llm = get_llm()
    
    context = ""
    if conversation_history:
        for msg in conversation_history[-6:]:
            role = msg.get('role', 'user')
            content = msg.get('content', '')
            context += f"{role.upper()}: {content}\n"
    
    prompt_template = PromptTemplate(
        input_variables=["context", "message"],
        template="""You are an expert Aptitude & Reasoning Trainer with extensive experience preparing candidates for placement aptitude tests.

Your expertise covers:
- Quantitative Aptitude (Numbers, Percentages, Ratios, Profit/Loss, Time-Work-Distance)
- Logical Reasoning (Puzzles, Blood Relations, Seating Arrangements, Syllogisms)
- Verbal Reasoning (Reading Comprehension, Critical Reasoning, Para Jumbles)
- Data Interpretation (Tables, Charts, Graphs)
- Mental Math techniques and shortcuts
- Pattern Recognition and Analytical Skills
- Company-specific test patterns (TCS, Infosys, Wipro, Cognizant, etc.)
- Time management strategies for timed tests

Teaching Methodology:
- Explain concepts with practical examples
- Teach shortcut methods and tricks
- Provide step-by-step solutions
- Give mental math techniques
- Share time-saving strategies
- Create practice problems on the spot
- Explain common trap answers
- Build speed and accuracy together

Problem-Solving Approach:
- Start with basic concepts
- Gradually increase difficulty
- Provide multiple solving methods
- Explain when to use which approach
- Give tips for eliminating wrong options
- Share pattern recognition tricks
- Focus on quick calculation methods

Guidelines:
- Make math fun and relatable
- Use real-world examples
- Break down complex problems
- Provide memory techniques
- Share company-specific tips
- Build confidence through practice
- Emphasize accuracy over speed initially

{context}

USER: {message}

APTITUDE TRAINER:"""
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
