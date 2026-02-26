"""
Conversion Agent - Converts blueprint to Angular 21 code
"""
import json
from core.gemini_client import GeminiClient
from config import get_conversion_angular_prompt, CONVERSION_REFINE_ARCHITECTURE, ANGULAR_VERSION, UI_FRAMEWORK


class ConversionAgent:
    """Converts ExtJS blueprint to Angular 21 with AG-Grid."""
    
    def __init__(self):
        self.gemini = GeminiClient()
    
    def convert_to_angular(self, blueprint: dict) -> dict:
        """
        Convert blueprint to Angular 21 code structure.
        
        Args:
            blueprint: Validated blueprint from analysis phase
            
        Returns:
            Angular code dictionary with ts, html, service, and interface
        """
        print(f"🏗️ Conversion Agent: Converting to Angular code...")
        
        converter_instr = get_conversion_angular_prompt(ANGULAR_VERSION, UI_FRAMEWORK)
        
        return self.gemini.generate_json_response(converter_instr, json.dumps(blueprint))
    
    def refine_architecture(self, angular_code: dict) -> dict:
        """
        Review and refine Angular code for production standards.
        
        Args:
            angular_code: Generated Angular code structure
            
        Returns:
            Refined Angular code with best practices applied
        """
        print("🏗️ Conversion Agent: Applying production standards...")
        
        return self.gemini.generate_json_response(CONVERSION_REFINE_ARCHITECTURE, json.dumps(angular_code))
    
    def convert(self, blueprint: dict) -> dict:
        """
        Complete conversion workflow: convert and refine.
        
        Args:
            blueprint: Validated blueprint from analysis phase
            
        Returns:
            Final production-ready Angular code
        """
        angular_code = self.convert_to_angular(blueprint)
        return self.refine_architecture(angular_code)
