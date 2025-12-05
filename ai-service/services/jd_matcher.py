import os
import json
try:
    from langchain.globals import set_verbose  # type: ignore
    set_verbose(False)
except Exception:
    pass
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import HumanMessage
from types import SimpleNamespace
import os
import json
from openai import OpenAI  # type: ignore
  # type: ignore

# Initialize Gemini model
def get_llm():
    provider = (os.getenv("LLM_PROVIDER", "gemini")).lower()
    if provider == "openai":
        if OpenAI is None:
            raise ValueError("openai package not installed. Install with: pip install openai")
        api_key = os.getenv("OPENAI_API_KEY")
        model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")

        class OpenAILLMAdapter:
            def __init__(self, api_key: str, model: str):
                self.client = OpenAI(api_key=api_key)
                self.model = model

            def invoke(self, prompt: str):
                resp = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.3,
                )
                content = resp.choices[0].message.content if resp.choices else ""
                return SimpleNamespace(content=content)

        return OpenAILLMAdapter(api_key, model)
    else:
        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY or GEMINI_API_KEY not found in environment variables")
        return ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=api_key,
            temperature=0.5,
            convert_system_message_to_human=True
        )

# Load prompt template
def load_prompt_template(filename):
    prompt_path = os.path.join("prompts", filename)
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()

# Parse JSON response from LLM
def parse_json_response(response_text):
    """Extract and parse JSON from LLM response, handling markdown code blocks"""
    text = response_text.strip()
    
    # Remove markdown code blocks if present
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    
    if text.endswith("```"):
        text = text[:-3]
    
    text = text.strip()
    
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON response: {e}\nResponse: {text}")

async def compare_resume_jd(resume_text: str, jd_text: str, target_role: str):
    """Compare resume with job description and provide detailed analysis"""
    try:
        llm = get_llm()
        prompt_template_str = load_prompt_template("jd_prompt.txt")
        
        prompt = PromptTemplate(
            input_variables=["resume_text", "jd_text", "target_role"],
            template=prompt_template_str
        )
        
        formatted_prompt = prompt.format(
            resume_text=resume_text,
            jd_text=jd_text,
            target_role=target_role
        )
        
        response = llm.invoke(formatted_prompt)
        
        # Extract content from response
        response_text = response.content if hasattr(response, 'content') else str(response)
        
        result = parse_json_response(response_text)
        
        return {
            "atsScore": result.get("atsScore", 0),
            "matchScore": result.get("matchScore", 0),
            "strengths": result.get("strengths", []),
            "weaknesses": result.get("weaknesses", []),
            "missingSkills": result.get("missingSkills", []),
            "projectSuggestions": result.get("projectSuggestions", []),
            "learningSuggestions": result.get("learningSuggestions", [])
        }
    except Exception as e:
        print(f"Error in compare_resume_jd: {e}")
        raise
