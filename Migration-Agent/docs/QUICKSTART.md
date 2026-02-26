# Quick Start - 5 Minutes to Migration

## Installation (1 min)

```bash
cd Migration-Agent
pip install -r requirements.txt
```

## Basic Usage (4 min)

### Option 1: Single File Migration

Edit `ExtJsToAngularOrchestrator.py`:
```python
migrator = ExtJsToAngularOrchestrator(
    extjs_source="C:/path/to/YourComponent.js",  # Single file
    angular_project_root="C:/path/to/angular-app"
)
```

### Option 2: Batch (Recursive) Migration

For processing all ExtJS files in a directory and its subdirectories:

```python
migrator = ExtJsToAngularOrchestrator(
    extjs_source="C:/path/to/extjs/components/folder",  # Directory - processes all .js files
    angular_project_root="C:/path/to/angular-app"
)
```

The tool will:
- 🔍 Recursively find all `.js` files in the directory and subdirectories
- ⏭️ Process each file through the migration pipeline
- 📊 Automatically skip node_modules, .git, and other common non-source folders
- 📈 Aggregate results for all conversions

### Step 2: Run Migration
```bash
python ExtJsToAngularOrchestrator.py
```

### Step 3: Monitor Progress
Watch console for real-time progress:
```
🚀 Crew AI Multi-Agent Orchestrator Initialization
✅ All agents initialized and ready
📋 PHASE 1: ANALYSIS PHASE
🔄 Attempt 1/3
[... validations ...]
Success Factor: 88.75% ✅ PASSED
```

## Understanding the Output

### Success Factors
Each phase scored 0-100% with minimum 85% to pass:

```
Analysis Phase: 88.75% ✅ PASSED
Conversion Phase: 87.50% ✅ PASSED
Storage Phase: 96.00% ✅ PASSED
```

### If Phase Fails (<85%)
System automatically retries up to 3 times:
```
Attempt 1: 78% ❌ needs improvement
  ↓ Feedback: "Model properties incomplete"
Attempt 2: 84% ❌ still needs work
  ↓ Feedback: "Add store configurations"
Attempt 3: 87% ✅ PASSED
```

## File Organization

```
Migration-Agent/
├── ExtJsToAngularOrchestrator.py (START HERE)
├── agents/                    (Agents)
├── core/                      (Orchestration)
├── config/                    (Settings)
├── infrastructure/            (System)
└── docs/                      (Documentation)
```

## Common Tasks

### Increase Quality Threshold
`config/crew_config.py`:
```python
SUCCESS_FACTOR_THRESHOLD = 95  # Default: 85
```

### Run More Retry Attempts
`config/crew_config.py`:
```python
RETRY_LIMIT = 5  # Default: 3
```

### Get Execution Report
```python
from core import CrewOrchestrator

orchestrator = CrewOrchestrator(extjs_path, angular_path)
orchestrator.run()

report = orchestrator.get_execution_report()
for entry in report['execution_log']:
    print(f"{entry['phase']}: {entry['success_factor']}%")
```

### Debug Low Success Factor
```python
report = orchestrator.get_execution_report()

for phase in report['validation_report']['history']:
    print(f"\nPhase: {phase['phase']}")
    print(f"Success Factor: {phase['success_factor']}%")
    print(f"Issues: {phase['details'].get('issues')}")
    print(f"Recommendations: {phase['details'].get('recommendations')}")
```

## Folder Structure Explanation

### agents/ - Independent Agents
- `analysis_agent.py` - Analyzes ExtJS
- `conversion_agent.py` - Generates Angular code
- `storage_agent.py` - Deploys to disk

### core/ - Master Orchestration
- `crew_orchestrator.py` - Coordinates all agents
- `quality_validator.py` - Scores each phase
- `agent_refiner.py` - Improves outputs
- `gemini_client.py` - Gemini API wrapper

### config/ - Settings
- `config.py` - API keys, versions
- `crew_config.py` - Thresholds, weights
- `prompts.py` - AI instructions

### infrastructure/ - System
- `project_manager.py` - Angular project setup

### docs/ - Documentation
- `README.md` - Full documentation
- `CREW_AI_GUIDE.md` - Technical guide
- `QUICKSTART.md` - This file
- Plus implementation details

## Import Examples

```python
# From agents
from agents import AnalysisAgent, ConversionAgent, StorageAgent

# From core
from core import CrewOrchestrator, QualityValidator

# From config
from config import SUCCESS_FACTOR_THRESHOLD, ANGULAR_VERSION

# From infrastructure
from infrastructure import ProjectManager
```

## Next Steps

1. ✅ **Read this** - You're here!
2. **Run first migration** - `python ExtJsToAngularOrchestrator.py`
3. **Check results** - Review success factors in output
4. **Explore config** - Customize in `config/crew_config.py`
5. **Read full guide** - See `docs/CREW_AI_GUIDE.md`

## Troubleshooting

### "File not found" Error
- Verify ExtJS file path is correct
- Use absolute path or relative from workspace root

### API Rate Limiting
- Check Gemini API quota on Google Cloud Console
- Consider adding delays between calls

### Low Success Factors
- Review validation feedback in console
- Check prompts in `config/prompts.py`
- Adjust weights in `config/crew_config.py`

## Performance

| Phase | Time | Success |
|-------|------|---------|
| Analysis | 15-30s | 80-90% |
| Conversion | 20-40s | 75-85% |
| Storage | 5-10s | 95%+ |
| **Total** | **45-80s** | **75%+** |

## Key Concepts

### Success Factor
- Score from 0-100% evaluating each phase
- Threshold: 85% minimum
- Calculated from weighted criteria

### Quality Gates
- Each phase validated before next
- Prevents low-quality output propagation
- Automatic retry with feedback

### Inter-Agent Communication
- Validation feedback loops
- Refinement suggestions
- Collaborative improvement

Happy migrating! 🚀

For more details, see:
- `docs/README.md` - Full architecture
- `docs/CREW_AI_GUIDE.md` - Technical guide
- `docs/FILE_STRUCTURE.md` - File organization
