"""
Crew AI configuration and dependencies
"""
# Crew AI Framework Setup
CREW_AI_VERSION = "0.1.0"

# Agent Roles and Goals
MASTER_AGENT_ROLE = "Migration Pipeline Master"
MASTER_AGENT_GOAL = """Orchestrate the ExtJS to Angular migration pipeline with quality assurance.
Ensure each phase achieves a success factor of 85% or higher before proceeding to the next level.
Monitor agent performance, collect feedback, and trigger refinements as needed."""

ANALYSIS_AGENT_ROLE = "ExtJS Analysis Specialist"
ANALYSIS_AGENT_GOAL = """Analyze ExtJS components and create detailed, validated blueprints.
Ensure the blueprint captures all models, stores, columns, and custom logic.
Achieve a success factor of 85% by validating completeness and accuracy."""

CONVERSION_AGENT_ROLE = "Angular Code Architect"
CONVERSION_AGENT_GOAL = """Convert validated blueprints into production-ready Angular 21 code.
Apply best practices, strict typing, and proper error handling.
Achieve a success factor of 85% by ensuring code quality and standards compliance."""

STORAGE_AGENT_ROLE = "Deployment Specialist"
STORAGE_AGENT_GOAL = """Deploy generated Angular code to the project structure.
Ensure all files are properly organized following Angular conventions.
Achieve a success factor of 85% by validating directory structure and file integrity."""

# Success Factor Thresholds
SUCCESS_FACTOR_THRESHOLD = 85
RETRY_LIMIT = 3

# Validation Criteria Weights
ANALYSIS_VALIDATION_WEIGHTS = {
    "model_extraction": 0.25,
    "store_extraction": 0.25,
    "columns_extraction": 0.25,
    "logic_capture": 0.25
}

CONVERSION_VALIDATION_WEIGHTS = {
    "proper_typing": 0.2,
    "error_handling": 0.2,
    "component_structure": 0.2,
    "service_design": 0.2,
    "angular_standards": 0.2
}

STORAGE_VALIDATION_WEIGHTS = {
    "directory_structure": 0.33,
    "file_integrity": 0.33,
    "naming_conventions": 0.34
}
