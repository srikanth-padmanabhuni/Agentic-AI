# File Structure & Organization Overview

## Organized Directory Layout

```
Migration-Agent/
├── ExtJsToAngularOrchestrator.py      [MAIN ENTRY POINT]
├── requirements.txt                   [DEPENDENCIES]
│
├── agents/                            [AGENTS - Independent sub-systems]
│   ├── __init__.py                    [Package init with exports]
│   ├── analysis_agent.py              [ExtJS analysis & blueprint creation]
│   ├── conversion_agent.py            [Blueprint to Angular conversion]
│   └── storage_agent.py               [File deployment to disk]
│
├── core/                              [CORE - Master orchestration & QA]
│   ├── __init__.py                    [Package init with exports]
│   ├── crew_orchestrator.py           [Master agent - quality gates, retries]
│   ├── quality_validator.py           [Output validation & scoring (0-100)]
│   ├── agent_refiner.py               [Feedback-driven output improvement]
│   └── gemini_client.py               [Gemini API wrapper]
│
├── config/                            [CONFIG - Centralized settings]
│   ├── __init__.py                    [Package init with exports]
│   ├── config.py                      [API keys, versions, framework settings]
│   ├── crew_config.py                 [Crew config, ages, thresholds, weights]
│   └── prompts.py                     [All AI prompts & templates]
│
├── infrastructure/                    [INFRASTRUCTURE - System operations]
│   ├── __init__.py                    [Package init with exports]
│   └── project_manager.py             [Angular project creation & file I/O]
│
└── docs/                              [DOCUMENTATION - All guides]
    ├── README.md                      [Full architecture & overview]
    ├── CREW_AI_GUIDE.md              [Detailed technical guide]
    ├── QUICKSTART.md                 [5-minute quick start]
    ├── IMPLEMENTATION_SUMMARY.md     [What was implemented]
    └── FILE_STRUCTURE.md             [This file]
```

## New Organized Structure Benefits

### ✨ Clean Organization
- Related files grouped in logical folders
- Easy to locate functionality
- Clear responsibility hierarchy

### ✨ Modular Design
- agents/ - Independent processors
- core/ - Master coordination
- config/ - Centralized settings
- infrastructure/ - System operations

### ✨ Package Structure
- Each folder is a Python package
- __init__.py enables clean imports
- Dependency graph is clear

### ✨ Scalability
- Easy to add new agents
- Simple to extend validators
- Straightforward to add new phases

## Module-to-Folder Mapping

| Old Location | New Location | Purpose |
|--------------|--------------|---------|
| analysis_agent.py | agents/analysis_agent.py | ExtJS analysis |
| conversion_agent.py | agents/conversion_agent.py | Angular generation |
| storage_agent.py | agents/storage_agent.py | File deployment |
| crew_orchestrator.py | core/crew_orchestrator.py | Master orchestration |
| quality_validator.py | core/quality_validator.py | Quality validation |
| agent_refiner.py | core/agent_refiner.py | Output refinement |
| gemini_client.py | core/gemini_client.py | AI API wrapper |
| config.py | config/config.py | Basic configuration |
| crew_config.py | config/crew_config.py | Crew AI configuration |
| prompts.py | config/prompts.py | AI prompts |
| project_manager.py | infrastructure/project_manager.py | Project management |
| (ROOT) | ExtJsToAngularOrchestrator.py | Entry point (stays at root) |

## Import Organization

### Before (Flat Structure)
```python
import analysis_agent
import conversion_agent
import quality_validator
from crew_orchestrator import CrewOrchestrator
```

### After (Organized Structure)
```python
from agents import AnalysisAgent, ConversionAgent
from core import CrewOrchestrator, QualityValidator
from config import SUCCESS_FACTOR_THRESHOLD
from infrastructure import ProjectManager
```

## Import Within Packages

### agents/__init__.py
```python
from .analysis_agent import AnalysisAgent
from .conversion_agent import ConversionAgent
from .storage_agent import StorageAgent

__all__ = ['AnalysisAgent', 'ConversionAgent', 'StorageAgent']
```

### core/__init__.py
```python
from .crew_orchestrator import CrewOrchestrator
from .quality_validator import QualityValidator
from .agent_refiner import AgentRefiner
from .gemini_client import GeminiClient

__all__ = ['CrewOrchestrator', 'QualityValidator', 'AgentRefiner', 'GeminiClient']
```

### config/__init__.py
```python
from .config import *
from .crew_config import *
from .prompts import *

__all__ = [
    'GEMINI_API_KEY', 'GEMINI_MODEL', 'SUCCESS_FACTOR_THRESHOLD',
    'ANGULAR_VERSION', 'UI_FRAMEWORK', 'RETRY_LIMIT',
    'ANALYSIS_EXTRACT_BLUEPRINT', 'CONVERSION_TO_ANGULAR',
    # ... all exported symbols
]
```

### infrastructure/__init__.py
```python
from .project_manager import ProjectManager

__all__ = ['ProjectManager']
```

## Dependency Graph

```
ExtJsToAngularOrchestrator.py (ROOT)
    ↓
    imports
    ↓
core/crew_orchestrator.py
    ├─ imports agents/
    ├─ imports infrastructure/
    ├─ imports core/quality_validator.py
    ├─ imports core/agent_refiner.py
    └─ imports config/

agents/
    ├─ analysis_agent.py → imports core/gemini_client.py
    ├─ conversion_agent.py → imports core/gemini_client.py
    └─ storage_agent.py → (no AI imports)

core/
    ├─ crew_orchestrator.py (orchestrator)
    ├─ quality_validator.py → imports core/gemini_client.py
    ├─ agent_refiner.py → imports core/gemini_client.py
    └─ gemini_client.py (base AI client)

config/ (no imports from other packages)
    ├─ config.py
    ├─ crew_config.py
    └─ prompts.py

infrastructure/ (no imports from other packages)
    └─ project_manager.py
```

## File Sizes & Content

### agents/ (~400 lines total)
- analysis_agent.py (55 lines)
- conversion_agent.py (58 lines)
- storage_agent.py (80 lines)
- __init__.py (~10 lines)

### core/ (~1,000 lines total)
- crew_orchestrator.py (350+ lines)
- quality_validator.py (300+ lines)
- agent_refiner.py (150+ lines)
- gemini_client.py (35 lines)
- __init__.py (~20 lines)

### config/ (~250 lines total)
- config.py (30 lines)
- crew_config.py (60 lines)
- prompts.py (55 lines)
- __init__.py (~60 lines)

### infrastructure/ (~100 lines total)
- project_manager.py (95 lines)
- __init__.py (~10 lines)

## Directory Tree Details

### agents/
Purpose: Independent processing agents
- Each agent isolated and testable
- No cross-agent dependencies
- Focused on specific migration phase

### core/
Purpose: Master orchestration and quality
- Coordinates all agents
- Validates all outputs
- Manages retries and refinements
- Single point of control

### config/
Purpose: Centralized configuration
- No business logic
- All settings in one place
- Easy to version control
- Simple to override

### infrastructure/
Purpose: System operations
- Project lifecycle management
- File I/O operations
- External tool invocation
- Environment setup

## Path Resolution

When running from Migration-Agent root:
```python
# From ExtJsToAngularOrchestrator.py (ROOT)
from agents import AnalysisAgent
from core import CrewOrchestrator
from config import SUCCESS_FACTOR_THRESHOLD
from infrastructure import ProjectManager

# Python automatically finds:
# - agents/
# - core/
# - config/
# - infrastructure/
```

## PYTHONPATH Setup (if needed)

```bash
# Add to PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:/path/to/Migration-Agent"

# Or in Python code
import sys
sys.path.insert(0, '/path/to/Migration-Agent')
```

## Package Initialization

Each __init__.py enables clean imports:

```python
# Before
import agents.analysis_agent
agent = agents.analysis_agent.AnalysisAgent()

# After
from agents import AnalysisAgent
agent = AnalysisAgent()
```

## Configuration Lookup

```
config/__init__.py
    ├─ imports config.py ──→ GEMINI_API_KEY, etc.
    ├─ imports crew_config.py ──→ SUCCESS_FACTOR_THRESHOLD, etc.
    └─ imports prompts.py ──→ ANALYSIS_EXTRACT_BLUEPRINT, etc.

From anywhere: from config import *
```

## How to Find Things

| Need to find | Location |
|--------------|----------|
| How migration runs | core/crew_orchestrator.py |
| Validation logic | core/quality_validator.py |
| Quality scores | core/quality_validator.py |
| Improvement logic | core/agent_refiner.py |
| API calls | core/gemini_client.py |
| Analysis logic | agents/analysis_agent.py |
| Conversion logic | agents/conversion_agent.py |
| Storage logic | agents/storage_agent.py |
| API settings | config/config.py |
| Thresholds/weights | config/crew_config.py |
| AI prompts | config/prompts.py |
| Project setup | infrastructure/project_manager.py |

## Best Practices

1. **Imports** - Always use package imports, not direct file imports
2. **Organization** - Keep related code in same folder
3. **Documentation** - Keep docs/ folder current
4. **Configuration** - All settings in config/ folder
5. **Testing** - Test each package independently
6. **Maintenance** - Changes localized to relevant folder

## Migration Notes

Files moved from root to:
- 5 files → agents/
- 5 files → core/
- 3 files → config/
- 1 file → infrastructure/
- 5 docs → docs/
- 2 files stay at root (ExtJsToAngularOrchestrator.py, requirements.txt)

All functionality preserved, just organized better!

## Conclusion

The organized structure provides:
- ✅ Clear module responsibility
- ✅ Easy to navigate
- ✅ Scalable architecture
- ✅ Clean import statements
- ✅ Maintainable codebase
- ✅ Professional organization
