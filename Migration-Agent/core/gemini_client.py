"""
Gemini AI client module for standardized API interactions
"""
import json
from google import genai
from google.genai import types
from config import GEMINI_API_KEY, GEMINI_MODEL, GEMINI_TEMPERATURE


class GeminiClient:
    """Wrapper for Gemini API calls with consistent JSON responses."""
    
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
    
    def generate_json_response(self, system_instruction: str, user_content: str) -> dict:
        """
        Generate JSON response from Gemini model.
        
        Args:
            system_instruction: System prompt for the model
            user_content: User input/content
            
        Returns:
            Parsed JSON response as dictionary
        """
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
