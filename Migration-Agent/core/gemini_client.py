"""
Gemini AI client module for standardized API interactions
"""
import json
from google import genai
from google.genai import types
from config import GEMINI_API_KEY, GEMINI_MODEL, GEMINI_TEMPERATURE
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

class GeminiClient:
    """Wrapper for Gemini API calls with consistent JSON responses."""
    
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
    
    # Retry strategy: 
    # Wait starts at 10s (to clear the 1-minute window), 
    # doubles each time, stops after 5 attempts.
    @retry(
        retry=retry_if_exception_type(Exception), 
        wait=wait_exponential(multiplier=2, min=10, max=60),
        stop=stop_after_attempt(5),
        before_sleep=lambda retry_state: print(f"Quota hit. Retrying in {retry_state.next_action.sleep}s...")
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
            return json.loads(response.text)
        except Exception as e:
            print(f"❌ Gemini API Error: {e}")
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                print("⚠️ Rate limit exceeded. Consider implementing retry logic with exponential backoff.")
                raise Exception("Gemini API rate limit exceeded. Please try again later.")
            else:
                raise Exception(f"Gemini API error: {e}")
