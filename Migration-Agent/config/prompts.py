"""
Prompts for Gemini AI model - Centralized prompt management
All LLM prompts are defined here for easy testing, versioning, and modification
"""

# ============================================================================
# ANALYSIS PHASE PROMPTS
# ============================================================================

ANALYSIS_EXTRACT_BLUEPRINT = """Act as an ExtJS Expert. Extract Model, Store, and Grid Columns. 
Return JSON: {model, store, columns, feature_name}."""

ANALYSIS_VALIDATE_BLUEPRINT = """Review this Blueprint. Ensure custom renderers are captured as logic strings. 
Return validated JSON."""

# ============================================================================
# CONVERSION PHASE PROMPTS
# ============================================================================

CONVERSION_TO_ANGULAR = """Convert Blueprint to Angular {angular_version}. 
Use {ui_framework} for data grids.
MANDATORY JSON structure:
{{
    "feature_name": "TheComponentName",
    "interface": "...",
    "service": "...",
    "component_ts": "...",
    "component_html": "..."
}}
Use Signals and standalone components."""

CONVERSION_REFINE_ARCHITECTURE = """Review Angular code for production standards 
(strict typing, error handling, dependency injection). 
Return refined JSON."""

# ============================================================================
# VALIDATION PHASE PROMPTS
# ============================================================================

VALIDATION_ANALYSIS_PROMPT = """Analyze this ExtJS blueprint and provide quality scores (0-100) for each criterion:
1. Model Extraction - Are the data models completely and correctly extracted?
2. Store Extraction - Are the stores properly identified with their configurations?
3. Columns Extraction - Are all grid columns with renderers captured?
4. Logic Capture - Are custom logic and renderers documented as strings?

Return JSON: {
    "model_extraction": <score>,
    "store_extraction": <score>,
    "columns_extraction": <score>,
    "logic_capture": <score>,
    "issues": ["issue1", "issue2"],
    "recommendations": ["rec1", "rec2"]
}"""

VALIDATION_CONVERSION_PROMPT = """Analyze this Angular code and provide quality scores (0-100) for each criterion:
1. Proper Typing - Is strict typing properly applied throughout? Any 'any' types?
2. Error Handling - Are try-catch blocks and error handling implemented?
3. Component Structure - Does the component follow Angular best practices?
4. Service Design - Is dependency injection and service design correct?
5. Angular Standards - Does code follow Angular 21 conventions?

Return JSON: {
    "proper_typing": <score>,
    "error_handling": <score>,
    "component_structure": <score>,
    "service_design": <score>,
    "angular_standards": <score>,
    "issues": ["issue1", "issue2"],
    "recommendations": ["rec1", "rec2"]
}"""

VALIDATION_STORAGE_PROMPT = """Analyze this file deployment manifest and provide quality scores (0-100):
1. Directory Structure - Are directories organized per Angular conventions?
2. File Integrity - Do all files exist and have proper content?
3. Naming Conventions - Follow Angular naming patterns (kebab-case, .component.ts, etc)?

Return JSON: {
    "directory_structure": <score>,
    "file_integrity": <score>,
    "naming_conventions": <score>,
    "issues": ["issue1", "issue2"],
    "recommendations": ["rec1", "rec2"]
}"""

# ============================================================================
# REFINEMENT PHASE PROMPTS
# ============================================================================

REFINEMENT_ANALYSIS_BLUEPRINT_PROMPT = """The previous blueprint had these issues and recommendations:
Issues: {issues}
Recommendations: {recommendations}

IMPROVE this blueprint to address all issues and apply recommendations:
{blueprint}

Return an IMPROVED JSON blueprint with:
- More complete model extraction
- Better store configuration details
- All grid columns with renderers
- Custom logic documented as strings

Focus on quality and completeness."""

REFINEMENT_ANGULAR_CODE_PROMPT = """The previous Angular code had these issues:
Issues: {issues}
Recommendations: {recommendations}

IMPROVE this Angular code to address all issues:
{angular_code}

Focus on:
- Add strict typing where missing
- Add comprehensive error handling
- Follow Angular 21 best practices
- Improve service design and dependency injection

Return improved JSON with complete, production-ready code."""

# ============================================================================
# PROMPT TEMPLATES & UTILITIES
# ============================================================================

def get_conversion_angular_prompt(angular_version: str, ui_framework: str) -> str:
    """
    Get the conversion prompt with dynamic parameters.
    
    Args:
        angular_version: Angular version (e.g., "21")
        ui_framework: UI framework (e.g., "AG-Grid")
        
    Returns:
        Formatted prompt string
    """
    return CONVERSION_TO_ANGULAR.format(
        angular_version=angular_version,
        ui_framework=ui_framework
    )

def get_refinement_analysis_prompt(blueprint: dict, feedback: dict) -> str:
    """
    Get the refinement prompt for analysis phase with dynamic values.
    
    Args:
        blueprint: Original blueprint dictionary
        feedback: Validation feedback with issues and recommendations
        
    Returns:
        Formatted prompt string
    """
    import json
    return REFINEMENT_ANALYSIS_BLUEPRINT_PROMPT.format(
        issues=json.dumps(feedback.get('issues', [])),
        recommendations=json.dumps(feedback.get('recommendations', [])),
        blueprint=json.dumps(blueprint)
    )

def get_refinement_angular_prompt(angular_code: dict, feedback: dict) -> str:
    """
    Get the refinement prompt for conversion phase with dynamic values.
    
    Args:
        angular_code: Original Angular code dictionary
        feedback: Validation feedback with issues and recommendations
        
    Returns:
        Formatted prompt string
    """
    import json
    return REFINEMENT_ANGULAR_CODE_PROMPT.format(
        issues=json.dumps(feedback.get('issues', [])),
        recommendations=json.dumps(feedback.get('recommendations', [])),
        angular_code=json.dumps(angular_code)
    )
