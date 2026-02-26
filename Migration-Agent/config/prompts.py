"""
Prompts for Gemini AI model - Centralized prompt management
All LLM prompts are defined here for easy testing, versioning, and modification
"""

# ============================================================================
# ANALYSIS PHASE PROMPTS
# ============================================================================

ANALYSIS_EXTRACT_BLUEPRINT = """Act as an ExtJS Expert. Extract Model, Store, and Grid Columns. 
Return JSON: {model, store, columns, feature_name}.

INSTRUCTIONS:
1. Identify components that should be separate/shared (e.g., Password fields, generic grids).
2. Flag common utilities (interfaces, enums, DTOs, DAOs) for migration to Shared Module.
3. Identify logical separation between component view, styles, and logic."""

ANALYSIS_VALIDATE_BLUEPRINT = """Review this Blueprint. Ensure custom renderers are captured as logic strings. 
Return validated JSON.

Check for:
1. Reusable component opportunities (move to shared module recommendations).
2. Clear separation of data models and view configurations."""

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
    "component_html": "...",
    "component_scss": "...",
    "common_scss": "..."
}}

ARCHITECTURAL RULES:
1. SEPARATE COMPONENTS: If a part of the component is reusable (e.g., Password field, custom input), mark it for the Shared Module.
2. SEPARATE FILES: Always use separate HTML templates and SCSS files. NEVER use inline `template` or `styles`/`<style>` tags.
3. STYLE SEPARATION: 
   - Move component-specific styles to `component_scss`.
   - Move global/reusable styles to `common_scss`.
4. STANDALONE: Use Signals and standalone components throughout."""

CONVERSION_REFINE_ARCHITECTURE = """Review Angular code for production standards 
(strict typing, error handling, dependency injection). 
Return refined JSON.

STRICT ENFORCEMENT:
1. Ensure NO inline templates or styles exist.
2. Validate that reusable components (like Password) are properly abstracted into Shared Module patterns.
3. Ensure SCSS separation between component-specific and global styles."""

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
3. Component Separation - Are HTML, SCSS, and logic separated? NO INLINE STYLES/TEMPLATES.
4. Modularization - Are reusable components (e.g. Password) moved to shared?
5. Style Distribution - Are styles properly split into component-specific vs common SCSS?

Return JSON: {
    "proper_typing": <score>,
    "error_handling": <score>,
    "component_separation": <score>,
    "modularization": <score>,
    "style_distribution": <score>,
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

STRICT REQUIREMENTS:
- Eliminate ALL inline templates (`template:`) and styles (`styles: []`).
- Move all logic into the separate HTML/SCSS files provided in the JSON.
- Identify common components like Password fields and move them to a 'shared' module pattern.
- Ensure strict typing and production-ready error handling.
- Separate component-specific SCSS from global/common SCSS.

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
# ============================================================================
# MODULARITY & BEST PRACTICES PROMPTS
# ============================================================================

MODULARITY_VALIDATION_PROMPT = """Analyze this Angular component/service for modularity and best practices:

1. Module Organization - Is it properly placed in a feature module or shared module?
2. Circular Dependencies - Are there any circular import dependencies?
3. Separation of Concerns - Are responsibilities properly separated?
4. Reusability - Is the code reusable across modules?
5. Import Practices - Are imports organized and non-circular?

Provide scores (0-100) for each and suggest improvements.

Return JSON: {
    "module_organization": <score>,
    "circular_dependencies": <score>,
    "separation_of_concerns": <score>,
    "reusability": <score>,
    "import_practices": <score>,
    "issues": ["issue1", "issue2"],
    "recommendations": ["rec1", "rec2"],
    "module_placement": "feature_module_name|shared|core",
    "shared_utilities": ["list", "of", "shared", "items"]
}"""

BEST_PRACTICES_VALIDATION_PROMPT = """Analyze this Angular code against industry best practices:

1. TypeScript Strictness - No 'any' types, proper interfaces?
2. Error Handling - Comprehensive try-catch and error scenarios?
3. OnDestroy Pattern - Subscriptions properly cleaned up?
4. ChangeDetectionStrategy - OnPush where appropriate?
5. Reactive Programming - Using RxJS properly with async pipe?
6. Lazy Loading - Components/services lazy loaded where possible?
7. Performance - No memory leaks, proper optimization?
8. Naming Conventions - camelCase, kebab-case, proper suffixes?
9. Documentation - JSDoc/TSDoc comments present?
10. Testing - Testable architecture, no hard dependencies?

Return JSON: {
    "typescript_strictness": <score>,
    "error_handling": <score>,
    "ondestroy_pattern": <score>,
    "change_detection": <score>,
    "reactive_programming": <score>,
    "lazy_loading": <score>,
    "performance": <score>,
    "naming_conventions": <score>,
    "documentation": <score>,
    "testing_readiness": <score>,
    "overall_score": <average>,
    "critical_issues": ["issue1", "issue2"],
    "recommendations": ["rec1", "rec2", "rec3"],
    "improvements_made": []
}"""

MODULE_ORGANIZATION_PROMPT = """Based on the following component/service, determine the optimal Angular module structure:

Component Name: {component_name}
Component Type: {component_type}
Business Domain: {business_domain}
Shared Utilities: {shared_utilities}

Provide recommendations in JSON format:

Return JSON: {
    "module_name": "module-name",
    "module_path": "src/app/modules/module-name",
    "file_location": "components|services|models|pages",
    "is_shared": true|false,
    "shared_category": "interfaces|enums|dtos|daos|services|utils|pipes|directives|guards|interceptors",
    "module_dependencies": ["CommonModule", "SharedModule", "..."],
    "circular_dependency_risks": ["risk1", "risk2"],
    "modularity_score": <score>,
    "recommendations": ["rec1", "rec2"]
}"""

def get_modularity_validation_prompt(code: str) -> str:
    """Get modularity validation prompt with code context."""
    import json
    return MODULARITY_VALIDATION_PROMPT + f"\n\nCode to analyze:\n{code}"

def get_best_practices_validation_prompt(code: str) -> str:
    """Get best practices validation prompt with code context."""
    import json
    return BEST_PRACTICES_VALIDATION_PROMPT + f"\n\nCode to analyze:\n{code}"

def get_module_organization_prompt(component_name: str, component_type: str, 
                                   business_domain: str, shared_utilities: list) -> str:
    """Get module organization prompt with context."""
    import json
    return MODULE_ORGANIZATION_PROMPT.format(
        component_name=component_name,
        component_type=component_type,
        business_domain=business_domain,
        shared_utilities=json.dumps(shared_utilities)
    )