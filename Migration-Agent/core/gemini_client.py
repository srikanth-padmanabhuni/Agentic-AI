"""
Gemini AI client module for standardized API interactions
"""
import json
import re
from google import genai
from google.genai import types
from config import GEMINI_API_KEY, GEMINI_MODEL, GEMINI_TEMPERATURE
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type


class GeminiRateLimitError(Exception):
    """Raised when Gemini API rate limit is exceeded."""
    pass


class GeminiClient:
    """Wrapper for Gemini API calls with consistent JSON responses."""
    
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
    
    @staticmethod
    def _clean_json_response(text: str) -> str:
        """Strip markdown fences and trailing commas from Gemini response."""
        # Remove ```json ... ``` wrapper if present
        text = re.sub(r'^```(?:json)?\s*\n?', '', text.strip())
        text = re.sub(r'\n?```\s*$', '', text.strip())
        # Remove trailing commas before } or ]
        text = re.sub(r',\s*([}\]])', r'\1', text)
        return text.strip()

    # Retry strategy: 
    # Wait starts at 10s (to clear the 1-minute window), 
    # doubles each time, stops after 5 attempts.
    # Only retries on rate-limit errors, NOT on JSON parse errors.
    @retry(
        retry=retry_if_exception_type(GeminiRateLimitError), 
        wait=wait_exponential(multiplier=2, min=10, max=60),
        stop=stop_after_attempt(5),
        before_sleep=lambda retry_state: print(f"⏳ Quota hit. Retrying in {retry_state.next_action.sleep}s...")
    )
    def generate_json_response(self, system_instruction: str, user_content: str) -> dict:
        """
        Generate JSON response from Gemini model.
        
        Args:
            system_instruction: System prompt for the model
            user_content: User input/content
            
        Returns:
            Parsed JSON response as dictionary
        """
        try:
            response = self.client.models.generate_content(
                model=GEMINI_MODEL,
                contents=user_content,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=GEMINI_TEMPERATURE,
                    response_mime_type="application/json"
                )
            )
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                print("⚠️ Rate limit exceeded.")
                raise GeminiRateLimitError(f"Gemini API rate limit exceeded: {e}")
            print(f"❌ Gemini API Error: {e}")
            raise

        # Parse JSON, with cleanup fallback
        raw_text = response.text
        try:
            return json.loads(raw_text)
        except json.JSONDecodeError:
            cleaned = self._clean_json_response(raw_text)
            try:
                return json.loads(cleaned)
            except json.JSONDecodeError as e:
                print(f"❌ Failed to parse Gemini JSON response: {e}")
                print(f"   Raw response (first 500 chars): {raw_text[:500]}")
                raise
