"""
Analysis Agent - Extracts and validates ExtJS component structure
"""
import json
from core.gemini_client import GeminiClient
from config import ANALYSIS_EXTRACT_BLUEPRINT, ANALYSIS_VALIDATE_BLUEPRINT


class AnalysisAgent:
    """Analyzes ExtJS code and creates a validated blueprint."""
    
    def __init__(self):
        self.gemini = GeminiClient()
    
    def extract_blueprint(self, extjs_content: str) -> dict:
        """
        Extract Model, Store, and Grid Columns from ExtJS code.
        
        Args:
            extjs_content: Raw ExtJS source code
            
        Returns:
            Blueprint dictionary with extracted structure
        """
        print("🔍 Analysis Agent: Extracting ExtJS structure...")
        
        return self.gemini.generate_json_response(ANALYSIS_EXTRACT_BLUEPRINT, extjs_content)
    
    def validate_blueprint(self, blueprint: dict) -> dict:
        """
        Validate and enrich blueprint with captured logic.
        
        Args:
            blueprint: Initial blueprint from extraction
            
        Returns:
            Validated and enriched blueprint
        """
        print("✅ Analysis Agent: Validating blueprint...")
        
        return self.gemini.generate_json_response(ANALYSIS_VALIDATE_BLUEPRINT, json.dumps(blueprint))
    
    def analyze(self, extjs_content: str) -> dict:
        """
        Complete analysis workflow: extract and validate.
        
        Args:
            extjs_content: Raw ExtJS source code
            
        Returns:
            Final validated blueprint
        """
        blueprint = self.extract_blueprint(extjs_content)
        return self.validate_blueprint(blueprint)
