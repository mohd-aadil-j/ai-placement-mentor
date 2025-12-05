# AI Service Deployment Guide

## Current Status

The AI service is deployed on Render using Docker. Both Gemini and OpenAI LLM providers are supported.

## Environment Variables Required on Render Dashboard

1. **For Gemini (Default - Recommended)**
   - `GEMINI_API_KEY`: Your Google Gemini API key
     - Get from: https://makersuite.google.com/app/apikey
   - `LLM_PROVIDER`: Set to `gemini` (this is the default)

2. **For OpenAI (Optional Alternative)**
   - `OPENAI_API_KEY`: Your OpenAI API key
     - Get from: https://platform.openai.com/api-keys
   - `OPENAI_MODEL`: Model name (default: `gpt-4o-mini`)
   - `LLM_PROVIDER`: Set to `openai`

## How to Set Environment Variables on Render

1. Go to https://dashboard.render.com/
2. Select your AI service (`ai-placement-mentor-3` or similar)
3. Click on "Environment" tab
4. Add the required environment variables:
   - For **Gemini only**: Add `GEMINI_API_KEY` and optionally set `LLM_PROVIDER=gemini`
   - For **OpenAI**: Add `OPENAI_API_KEY` and set `LLM_PROVIDER=openai`
5. Click "Save" - Render will automatically redeploy the service

## Testing Locally

Run the test script to verify both LLM integrations:

```bash
python ai-service/test_llm.py
```

This will test:
- Gemini initialization and invocation
- OpenAI initialization and invocation

## API Endpoints Available

All endpoints require proper LLM configuration:

- `POST /ai/analyze-resume` - Analyze resume and extract skills/projects
- `POST /ai/compare-resume-jd` - Compare resume with job description
- `POST /ai/chat` - Chat with the AI mentor
- `POST /ai/generate-roadmap` - Generate learning roadmap
- `POST /ai/interview-prep` - Interview preparation guide
- `POST /ai/classroom-questions` - Generate classroom questions
- `POST /ai/classroom-solutions` - Generate solutions
- `POST /ai/classroom-feedback` - Provide classroom feedback
- `GET /health` - Health check endpoint
- `HEAD /health` - Health check for Render's monitoring
- `GET /` - Root endpoint

## Troubleshooting

### 500 Errors on API Calls

1. Check Render logs for the AI service
2. Verify environment variables are set correctly
3. Check API key validity
4. Run `test_llm.py` locally to test LLM connections

### OpenAI Not Working

- Verify `OPENAI_API_KEY` is set and valid
- Check that API key has sufficient credits/quota
- Ensure `LLM_PROVIDER=openai` is set if you want to use OpenAI

### Gemini Not Working

- Verify `GEMINI_API_KEY` is set and valid
- Ensure it's a valid Google Generative AI API key
- Check that the key has appropriate permissions

## Current AI Service Improvements

Recent updates include:
1. Added `convert_system_message_to_human=True` to Gemini initialization for better compatibility
2. Enhanced error handling and logging in app.py
3. Created test_llm.py for easy verification of LLM connections
4. Updated .env.example with comprehensive documentation

## Files Modified

- `ai-service/services/resume_analyzer.py` - Added HumanMessage import and Gemini parameter
- `ai-service/services/roadmap_generator.py` - Added HumanMessage import and Gemini parameter
- `ai-service/services/chat_mentor.py` - Added HumanMessage import and Gemini parameter
- `ai-service/services/interview_prep_planner.py` - Added HumanMessage import and Gemini parameter
- `ai-service/services/classroom_assistants.py` - Added HumanMessage import and Gemini parameter
- `ai-service/services/jd_matcher.py` - Added HumanMessage import and Gemini parameter
- `ai-service/app.py` - Added logging
- `ai-service/.env.example` - Updated documentation
- `ai-service/test_llm.py` - Created new test script
