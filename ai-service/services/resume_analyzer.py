import os
import json
import logging
from langchain.globals import set_verbose
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

set_verbose(False)

logger = logging.getLogger(__name__)

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

    logger.info("Using Groq LLM (llama-3.1-8b-instant)")

    return ChatGroq(
        model="llama-3.1-8b-instant",
        groq_api_key=api_key,
        temperature=0.3
    )


# --------------------------------------------------
# Load prompt template
# --------------------------------------------------
def load_prompt_template(filename):
    prompt_path = os.path.join("prompts", filename)
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()


# --------------------------------------------------
# Parse JSON response from LLM
# --------------------------------------------------
def parse_json_response(response_text):
    """
    Extract and parse JSON from LLM response,
    handling markdown code blocks safely
    """
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
        raise ValueError(
            f"Failed to parse JSON response: {e}\nResponse:\n{text}"
        )


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

        response = llm.invoke(formatted_prompt)

        response_text = response.content

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
