# ExtJS to Angular Migration Tool - Refactored Architecture

## Overview
This tool migrates ExtJS components to Angular 21 with AG-Grid, using AI-powered code analysis and generation via Google's Gemini API.

**New Feature:** Crew AI-based quality-gated pipeline where each phase must achieve 85%+ success factor before proceeding to the next level.

## Project Structure

```
Migration-Agent/
├── ExtJsToAngularOrchestrator.py    # Main entry point (delegates to Crew)
├── requirements.txt                 # Python dependencies
│
├── agents/                          # Independent agents
│   ├── __init__.py
│   ├── analysis_agent.py
│   ├── conversion_agent.py
│   └── storage_agent.py
│
├── core/                            # Core orchestration & quality
│   ├── __init__.py
│   ├── crew_orchestrator.py         # Master agent
│   ├── quality_validator.py         # Validation engine
│   ├── agent_refiner.py             # Refinement engine
│   └── gemini_client.py             # Gemini API wrapper
│
├── config/                          # Configuration & prompts
│   ├── __init__.py
│   ├── config.py                    # Basic config
│   ├── crew_config.py               # Crew AI config
│   └── prompts.py                   # AI prompts
│
├── infrastructure/                  # System operations
│   ├── __init__.py
│   └── project_manager.py           # Project management
│
└── docs/                            # Documentation
    ├── README.md
    ├── CREW_AI_GUIDE.md
    ├── QUICKSTART.md
    ├── IMPLEMENTATION_SUMMARY.md
    └── FILE_STRUCTURE.md
```

## Architecture - Modular & Organized

### agents/ - Independent Migration Agents
- **analysis_agent.py** - Analyzes ExtJS and creates blueprints
- **conversion_agent.py** - Converts blueprints to Angular code
- **storage_agent.py** - Deploys files to Angular project

### core/ - Master Orchestration & Quality
- **crew_orchestrator.py** - Master agent coordinating all phases
- **quality_validator.py** - Validates output and scores quality (0-100)
- **agent_refiner.py** - Improves outputs based on validation feedback
- **gemini_client.py** - Gemini API wrapper for all agents

### config/ - Centralized Settings
- **config.py** - API keys, versions, framework settings
- **crew_config.py** - Crew AI configuration, roles, weights, thresholds
- **prompts.py** - All AI prompts used by agents

### infrastructure/ - System Management
- **project_manager.py** - Angular project creation and file I/O

## Quality-Gated Pipeline Workflow ⭐

```
Phase Execution
    ↓
Run Agent (Analysis/Conversion/Storage)
    ↓
Validate Output (Score 0-100)
    ↓
Success Factor >= 85%?
  ├─ YES → ✅ PASSED - Proceed to next phase
  └─ NO  → Refine & Retry (up to 3 attempts)
           If still fails → Log warning, best effort
```

## Key Implementation Features

### ✅ Quality Assurance
- Each phase validated with weighted criteria
- Success factor calculation (0-100%)
- Automatic progression gating at 85%

### ✅ Automatic Improvement
- Up to 3 attempts per phase
- Feedback-driven refinement
- Intelligent retry logic

### ✅ Inter-Agent Communication
- Validation feedback loops
- Refinement suggestions
- Collaborative problem solving

### ✅ Recursive File Processing
- Batch convert all ExtJS files in a directory
- Automatic recursive directory traversal
- Intelligent folder filtering (.git, node_modules, etc.)
- Aggregated results reporting
- Error handling per file with batch continuation

### ✅ Clean Organization
- Separations by responsibility
- Clear import structure
- Maintainable codebase

## Usage

### Basic Usage
```python
from ExtJsToAngularOrchestrator import ExtJsToAngularOrchestrator

# Single file migration
migrator = ExtJsToAngularOrchestrator(
    extjs_source="path/to/UserGrid.js",
    angular_project_root="path/to/angular-app"
)
migrator.run()
```

### Batch (Recursive) Conversion
```python
from ExtJsToAngularOrchestrator import ExtJsToAngularOrchestrator

# Batch conversion - processes all .js files recursively
migrator = ExtJsToAngularOrchestrator(
    extjs_source="path/to/extjs/components",  # Directory
    angular_project_root="path/to/angular-app"
)
migrator.run()
```

The tool automatically detects whether the source is a file or directory and processes accordingly.

## Import Examples

### From the organized structure:
```python
# Import agents
from agents import AnalysisAgent, ConversionAgent, StorageAgent

# Import core orchestration
from core import CrewOrchestrator, QualityValidator, AgentRefiner

# Import config
from config import SUCCESS_FACTOR_THRESHOLD, ANGULAR_VERSION

# Import infrastructure
from infrastructure import ProjectManager
```

## Configuration & Customization

### Adjust Quality Threshold
In `config/crew_config.py`:
```python
SUCCESS_FACTOR_THRESHOLD = 90  # Default: 85
RETRY_LIMIT = 5                # Default: 3
```

### Modify Validation Weights
In `config/crew_config.py`:
```python
ANALYSIS_VALIDATION_WEIGHTS = {
    "model_extraction": 0.4,      # Increased from 0.25
    "store_extraction": 0.2,
    "columns_extraction": 0.2,
    "logic_capture": 0.2
}
```

## Benefits of Organization

✨ **Modular** - Each module has clear responsibility
✨ **Maintainable** - Changes localized to relevant folders
✨ **Scalable** - Easy to add new agents or validators
✨ **Testable** - Independent components for unit testing
✨ **Clean** - Main entry point stays simple
✨ **Organized** - Logical folder hierarchy

## File Location Guide

| Need | Location |
|------|----------|
| Change API key | `config/config.py` |
| Adjust thresholds | `config/crew_config.py` |
| Modify AI prompts | `config/prompts.py` |
| Change agent logic | `agents/` |
| Fix orchestrator flow | `core/crew_orchestrator.py` |
| Update validation | `core/quality_validator.py` |
| Angular project setup | `infrastructure/project_manager.py` |

## Next Steps

1. Read `QUICKSTART.md` for 5-minute setup
2. Review `CREW_AI_GUIDE.md` for detailed documentation
3. Check `FILE_STRUCTURE.md` for architecture details
4. Run your first migration!

## Architecture Principles

1. **Separation of Concerns** - Each module/folder has one responsibility
2. **Package Structure** - __init__.py enables clean imports
3. **Dependency Management** - Core imports agents, agents import config
4. **Configuration** - All settings in config/ folder
5. **Documentation** - All docs in docs/ folder

