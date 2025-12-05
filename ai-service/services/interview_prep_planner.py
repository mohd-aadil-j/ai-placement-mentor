"""
Interview Preparation Planner Service - Generate time-bound preparation plans
"""
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import HumanMessage
from langchain.globals import set_verbose
from datetime import datetime, timedelta
import os
import json

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
            temperature=0.5,
            convert_system_message_to_human=True
        )

async def generate_interview_prep_plan(
    company: str,
    position: str,
    interview_date: str,
    rounds: list,
    user_skills: list = None,
    additional_notes: str = None
) -> dict:
    """
    Generate a time-bound interview preparation plan
    
    Args:
        company: Company name
        position: Job position/role
        interview_date: Interview date (ISO format)
        rounds: List of interview rounds with type and description
        user_skills: Current skills of the user (optional)
        additional_notes: Any additional context (optional)
    
    Returns:
        dict with day-by-day preparation plan
    """
    llm = get_llm()
    
    # Calculate days until interview
    interview_dt = datetime.fromisoformat(interview_date.replace('Z', '+00:00'))
    today = datetime.now()
    days_until_interview = max((interview_dt.date() - today.date()).days, 0)
    
    # Format rounds information
    rounds_info = "\n".join([
        f"- {round['roundName']} ({round['roundType']}): {round.get('description', 'No description')}"
        for round in rounds
    ])
    
    skills_context = f"User's current skills: {', '.join(user_skills)}" if user_skills else "User skills not provided"
    notes_context = f"Additional context: {additional_notes}" if additional_notes else ""
    
    prompt_template = PromptTemplate(
        input_variables=["company", "position", "interview_date", "days_until", "rounds_info", "skills_context", "notes_context"],
        template="""You are an expert interview preparation coach. Generate a comprehensive, day-by-day preparation plan for an upcoming interview.

Interview Details:
- Company: {company}
- Position: {position}
- Interview Date: {interview_date}
- Days Until Interview: {days_until}

Interview Rounds:
{rounds_info}

{skills_context}
{notes_context}

Create a detailed day-by-day preparation plan that:
1. Is realistic and achievable within the available time
2. Covers all interview rounds mentioned
3. Includes specific topics, resources, and practice exercises
4. Prioritizes based on round types and difficulty
5. Includes mock interview practice
6. Has buffer time for revision
7. Includes mental preparation and confidence building
8. Provides company-specific research tasks

For each day, provide:
- Day number and date
- Focus area (which round to prepare for)
- Specific topics to cover
- Practice tasks (with examples)
- Resources to study
- Time allocation (hours)
- Goals for the day

Return the response in this exact JSON format:
{{
  "totalDays": <number>,
  "interviewDate": "{interview_date}",
  "overallStrategy": "<brief strategy overview>",
  "dailyPlan": [
    {{
      "day": 1,
      "date": "<date>",
      "focusRound": "<round name>",
      "focusArea": "<main focus>",
      "topics": ["topic1", "topic2"],
      "tasks": [
        {{
          "task": "<task description>",
          "timeAllocation": "<time in hours>",
          "priority": "high|medium|low"
        }}
      ],
      "resources": ["resource1", "resource2"],
      "goals": ["goal1", "goal2"],
      "tips": "<daily tip>"
    }}
  ],
  "finalDayChecklist": ["item1", "item2"],
  "confidenceTips": ["tip1", "tip2"],
  "companyResearch": {{
    "keyAreas": ["area1", "area2"],
    "questionsToAsk": ["question1", "question2"]
  }}
}}

Ensure the JSON is valid and properly formatted."""
    )
    
    formatted_prompt = prompt_template.format(
        company=company,
        position=position,
        interview_date=interview_date,
        days_until=days_until_interview,
        rounds_info=rounds_info,
        skills_context=skills_context,
        notes_context=notes_context
    )
    
    response = llm.invoke(formatted_prompt)
    
    # Parse the JSON response
    try:
        # Extract JSON from response (handle markdown code blocks)
        content = response.content.strip()
        if content.startswith('```'):
            # Remove markdown code block markers
            lines = content.split('\n')
            content = '\n'.join(lines[1:-1]) if len(lines) > 2 else content
        
        prep_plan = json.loads(content)
        return prep_plan
    except json.JSONDecodeError:
        # Fallback if JSON parsing fails
        return {
            "totalDays": days_until_interview,
            "interviewDate": interview_date,
            "overallStrategy": "Focus on key interview rounds with structured daily practice",
            "dailyPlan": [
                {
                    "day": i + 1,
                    "date": (today + timedelta(days=i)).strftime("%Y-%m-%d"),
                    "focusRound": rounds[i % len(rounds)]['roundName'] if rounds else "General Prep",
                    "focusArea": f"Day {i + 1} preparation",
                    "topics": ["Review fundamentals", "Practice problems"],
                    "tasks": [
                        {
                            "task": "Study and practice",
                            "timeAllocation": "4 hours",
                            "priority": "high"
                        }
                    ],
                    "resources": ["Online tutorials", "Practice platforms"],
                    "goals": ["Complete daily targets"],
                    "tips": "Stay consistent and focused"
                }
                for i in range(min(days_until_interview, 14))
            ],
            "finalDayChecklist": ["Review notes", "Get good sleep", "Prepare questions"],
            "confidenceTips": ["Practice mock interviews", "Stay positive"],
            "companyResearch": {
                "keyAreas": ["Company culture", "Recent news"],
                "questionsToAsk": ["About the role", "About team"]
            }
        }
