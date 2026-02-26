"""
Agent Refiner - Improves agent outputs to meet success factor threshold
"""
import json
from .gemini_client import GeminiClient
from config import (
    get_refinement_analysis_prompt,
    get_refinement_angular_prompt
)


class AgentRefiner:
    """Refines agent outputs based on validation feedback."""
    
    def __init__(self):
        self.gemini = GeminiClient()
        self.refinement_attempts = {}
    
    def refine_analysis_blueprint(self, blueprint: dict, feedback: list, attempt: int) -> dict:
        """
        Refine analysis blueprint based on validation feedback.
        
        Args:
            blueprint: Original blueprint
            feedback: List of issues and recommendations
            attempt: Current attempt number
            
        Returns:
            Refined blueprint
        """
        print(f"🔧 Agent Refiner: Refining Analysis Blueprint (Attempt {attempt})...")
        
        refine_prompt = get_refinement_analysis_prompt(blueprint, feedback)
        
        refined = self.gemini.generate_json_response(
            "Act as an ExtJS Expert. Improve and enrich the blueprint.",
            refine_prompt
        )
        
        return refined
    
    def refine_angular_code(self, angular_code: dict, feedback: list, attempt: int) -> dict:
        """
        Refine Angular code based on validation feedback.
        
        Args:
            angular_code: Original Angular code
            feedback: List of issues and recommendations
            attempt: Current attempt number
            
        Returns:
            Refined Angular code
        """
        print(f"🔧 Agent Refiner: Refining Angular Code (Attempt {attempt})...")
        
        refine_prompt = f"""
        The previous Angular code had these issues:
        Issues: {json.dumps(feedback.get('issues', []))}
        Recommendations: {json.dumps(feedback.get('recommendations', []))}
        
        IMPROVE this Angular code to address all issues:
        {json.dumps(angular_code)}
        
        Focus on:
        - Add strict typing where missing
        - Add comprehensive error handling
        - Follow Angular 21 best practices
        - Improve service design and dependency injection
        
        Return improved get_refinement_angular_prompt(angular_code, feedback)"""