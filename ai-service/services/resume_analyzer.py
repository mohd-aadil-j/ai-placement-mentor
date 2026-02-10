import os
import json
import logging
import time
from langchain.globals import set_verbose
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

set_verbose(False)

logger = logging.getLogger(__name__)

# --------------------------------------------------
# Initialize Groq LLM
# --------------------------------------------------
def get_llm():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not found in environment variables")

    logger.info("Using Groq LLM (llama-3.1-8b-instant)")

    return ChatGroq(
        model="llama-3.1-8b-instant",
        groq_api_key=api_key,
        temperature=0.3,
        timeout=30
    )


# --------------------------------------------------
# Retry-safe LLM invocation (handles 429)
# --------------------------------------------------
def invoke_with_retry(llm, prompt, retries=3):
    for attempt in range(retries):
        try:
            return llm.invoke(prompt)
        except Exception as e:
            error_msg = str(e)

            # Handle rate limit
            if "429" in error_msg or "rate limit" in error_msg.lower():
                wait_time = 2 ** attempt
                logger.warning(
                    f"Groq rate limit hit. Retrying in {wait_time}s (attempt {attempt + 1}/{retries})"
                )
                time.sleep(wait_time)
                continue

            # Other errors → fail fast
            logger.error(f"Groq invoke failed: {e}")
            raise

    raise RuntimeError("Groq API failed after multiple retries")


# --------------------------------------------------
# Load prompt template
# --------------------------------------------------
def load_prompt_template(filename):
    prompt_path = os.path.join("prompts", filename)
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()


# --------------------------------------------------
# Parse JSON response
# --------------------------------------------------
def parse_json_response(response_text):
    text = response_text.strip()

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
        logger.error("Invalid JSON returned from LLM")
        raise ValueError(f"JSON parse failed: {e}\n{text}")


# --------------------------------------------------
# Analyze Resume Text
# --------------------------------------------------
async def analyze_resume_text(resume_text: str):
    """
    Analyze resume and extract skills, projects, and summary
    """
    try:
        llm = get_llm()
        prompt_template_str = load_prompt_template("resume_prompt.txt")

        prompt = PromptTemplate(
            input_variables=["resume_text"],
            template=prompt_template_str
        )

        formatted_prompt = prompt.format(resume_text=resume_text)

        # 🔥 SAFE invocation (429 handled here)
        response = invoke_with_retry(llm, formatted_prompt)

        result = parse_json_response(response.content)

        return {
            "skills": result.get("skills", []),
            "softSkills": result.get("softSkills", []),
            "projects": result.get("projects", []),
            "summary": result.get("summary", "")
        }

    except Exception as e:
        logger.error(f"Error in analyze_resume_text: {e}")
        raise
