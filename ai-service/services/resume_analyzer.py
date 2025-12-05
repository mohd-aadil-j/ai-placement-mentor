import os
import json
import logging
try:
    from langchain.globals import set_verbose  # type: ignore
    set_verbose(False)
except Exception:
    pass
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import HumanMessage
from types import SimpleNamespace

try:
    from openai import OpenAI  # type: ignore
    import openai  # type: ignore
except Exception:
    OpenAI = None  # type: ignore
    openai = None  # type: ignore

logger = logging.getLogger(__name__)

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

        try:
            version = getattr(openai, "__version__", "unknown") if openai else "unknown"
            logger.info(f"Using OpenAI provider with sdk version={version}, model={model}")
        except Exception:
            pass

        class OpenAILLMAdapter:
            def __init__(self, api_key: str, model: str):
                self.client = OpenAI(api_key=api_key)
                self.model = model

            def invoke(self, prompt: str):
                try:
                    resp = self.client.chat.completions.create(
                        model=self.model,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.3,
                    )
                    content = resp.choices[0].message.content if resp.choices else ""
                    return SimpleNamespace(content=content)
                except Exception as err:
                    logger.error(f"OpenAI invoke failed: {err}")
                    raise

        return OpenAILLMAdapter(api_key, model)
    else:
        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY or GEMINI_API_KEY not found in environment variables")
        try:
            return ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=api_key,
                temperature=0.3,
                convert_system_message_to_human=True
            )
        except Exception as e:
            logger.error(f"Error initializing ChatGoogleGenerativeAI: {e}")
            raise

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

async def analyze_resume_text(resume_text: str):
    """Analyze resume and extract skills, projects, and summary"""
    try:
        llm = get_llm()
        prompt_template_str = load_prompt_template("resume_prompt.txt")
        
        prompt = PromptTemplate(
            input_variables=["resume_text"],
            template=prompt_template_str
        )
        
        formatted_prompt = prompt.format(resume_text=resume_text)
        response = llm.invoke(formatted_prompt)
        
        # Extract content from response
        response_text = response.content if hasattr(response, 'content') else str(response)
        
        result = parse_json_response(response_text)
        
        return {
            "skills": result.get("skills", []),
            "softSkills": result.get("softSkills", []),
            "projects": result.get("projects", []),
            "summary": result.get("summary", "")
        }
    except Exception as e:
        logger.error(f"Error in analyze_resume_text: {e}")
        raise
