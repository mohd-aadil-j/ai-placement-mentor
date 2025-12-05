#!/usr/bin/env python3
"""Test LLM integrations locally"""
import os
import sys
from openai import OpenAI
# Test Gemini
print("=" * 60)
print("Testing Gemini Integration")
print("=" * 60)
gemini_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
if not gemini_key:
    print("❌ GOOGLE_API_KEY or GEMINI_API_KEY not found")
else:
    print(f"✅ Found Gemini API key (length: {len(gemini_key)})")
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=gemini_key,
            temperature=0.3,
            convert_system_message_to_human=True
        )
        response = llm.invoke("Say hello in one word")
        print(f"✅ Gemini response: {response.content if hasattr(response, 'content') else response}")
    except Exception as e:
        print(f"❌ Gemini error: {type(e).__name__}: {e}")

# Test OpenAI
print("\n" + "=" * 60)
print("Testing OpenAI Integration")
print("=" * 60)
openai_key = os.getenv("OPENAI_API_KEY")
if not openai_key:
    print("❌ OPENAI_API_KEY not found")
else:
    print(f"✅ Found OpenAI API key (length: {len(openai_key)})")
    try:
        from openai import OpenAI
        client = OpenAI(api_key=openai_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Say hello in one word"}],
            temperature=0.3,
        )
        print(f"✅ OpenAI response: {response.choices[0].message.content}")
    except Exception as e:
        print(f"❌ OpenAI error: {type(e).__name__}: {e}")

print("\n" + "=" * 60)
print("LLM Test Complete")
print("=" * 60)
