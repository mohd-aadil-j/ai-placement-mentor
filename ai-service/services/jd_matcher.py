import os
import json
import logging
from langchain.globals import set_verbose
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

set_verbose(False)

logger = logging.getLogger(__name__)


def get_llm():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not found in environment variables")

    logger.info("Using Groq LLM (llama-3.1-8b-instant)")

    return ChatGroq(
        model="llama-3.1-8b-instant",
        groq_api_key=api_key,
        temperature=0.5
    )


def load_prompt_template(filename):
    prompt_path = os.path.join("prompts", filename)
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()


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


async def compare_resume_jd(resume_text: str, jd_text: str, target_role: str):
    """
    Compare resume with job description and provide structured analysis
    """
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

        response_text = response.content

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
        logger.error(f"Error in compare_resume_jd: {e}")
        raise
