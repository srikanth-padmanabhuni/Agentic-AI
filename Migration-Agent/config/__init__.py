"""
Configuration module - Centralized settings, prompts, and configuration
"""
from .config import *
from .crew_config import *
from .prompts import *

__all__ = [
    # config.py
    'GEMINI_API_KEY', 'GEMINI_MODEL', 'GEMINI_TEMPERATURE',
    'ANGULAR_VERSION', 'UI_FRAMEWORK', 'COMPONENT_STYLE',
    # crew_config.py
    'CREW_AI_VERSION', 'MASTER_AGENT_ROLE', 'MASTER_AGENT_GOAL',
    'ANALYSIS_AGENT_ROLE', 'ANALYSIS_AGENT_GOAL',
    'CONVERSION_AGENT_ROLE', 'CONVERSION_AGENT_GOAL',
    'STORAGE_AGENT_ROLE', 'STORAGE_AGENT_GOAL',
    'SUCCESS_FACTOR_THRESHOLD', 'RETRY_LIMIT',
    'ANALYSIS_VALIDATION_WEIGHTS', 'CONVERSION_VALIDATION_WEIGHTS', 'STORAGE_VALIDATION_WEIGHTS',
    # prompts.py - Analysis & Conversion
    'ANALYSIS_EXTRACT_BLUEPRINT', 'ANALYSIS_VALIDATE_BLUEPRINT',
    'CONVERSION_TO_ANGULAR', 'CONVERSION_REFINE_ARCHITECTURE',
    # prompts.py - Validation
    'VALIDATION_ANALYSIS_PROMPT', 'VALIDATION_CONVERSION_PROMPT', 'VALIDATION_STORAGE_PROMPT',
    # prompts.py - Refinement
    'REFINEMENT_ANALYSIS_BLUEPRINT_PROMPT', 'REFINEMENT_ANGULAR_CODE_PROMPT',
    # prompts.py - Template functions
    'get_conversion_angular_prompt', 'get_refinement_analysis_prompt', 'get_refinement_angular_prompt',
]
