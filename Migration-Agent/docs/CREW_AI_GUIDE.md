# Crew AI Quality-Gated System - Technical Guide

## System Overview

The Crew AI system is a **quality-gated, multi-agent orchestration framework** for the ExtJS to Angular migration tool. It ensures that each phase meets a minimum quality threshold (85% success factor) before proceeding.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  ExtJsToAngularOrchestrator (Entry Point - roots/)             │
└────────────────────────────┬─────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│  CrewOrchestrator (core/ - Master Agent)                        │
│  - Quality gates for each phase                                 │
│  - Retry management (up to 3x)                                  │
│  - Phase orchestration                                          │
└────────────────────────────┬──────────────────────────────────────┘
                             ↓
        ┌────────────────────┼──────────────────┐
        ↓                    ↓                  ↓
   ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
   │Phase 1      │   │Phase 2       │   │Phase 3       │
   │Analysis     │   │Conversion    │   │Storage       │
   └──────┬──────┘   └──────┬───────┘   └──────┬───────┘
        ↓                   ↓                    ↓
   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
   │agents/       │   │agents/       │   │agents/       │
   │analysis_     │   │conversion_   │   │storage_      │
   │agent.py      │   │agent.py      │   │agent.py      │
   └──────┬──────┘   └──────┬───────┘   └──────┬───────┘
        ↓                   ↓                    ↓
   ┌──────────────────────────────────────────────┐
   │core/quality_validator.py                     │
   │- Scores each output (0-100)                  │
   │- Calculates success factors                  │
   │- Extracts issues & recommendations           │
   └──────┬───────────────────────────────────────┘
        ↓
   Success >= 85%?
   ├─ YES → Next Phase ✅
   └─ NO  → core/agent_refiner.py → Retry
```

## Quality Validation Criteria

### Analysis Phase (25% each)
- Model Extraction - Data model completeness
- Store Extraction - Store configuration
- Columns Extraction - Grid column/renderer capture
- Logic Capture - Custom logic documentation

### Conversion Phase (20% each)
- Proper Typing - Strict typing application
- Error Handling - Exception handling coverage
- Component Structure - Angular best practices
- Service Design - Dependency injection pattern
- Angular Standards - Angular 21 conventions

### Storage Phase (33-34% each)
- Directory Structure - Angular folder conventions
- File Integrity - File existence and content
- Naming Conventions - Angular naming patterns

## Data Flow

```
Input: ExtJS File + Angular Path
    ↓
Load File (infrastructure/project_manager.py)
    ↓
Analysis Phase:
  ├─ agents/analysis_agent.py extracts blueprint
  ├─ core/quality_validator.py scores output
  ├─ Passed (≥85%)? 
  │  ├─ YES → Store blueprint
  │  └─ NO → core/agent_refiner.py → Retry
  └─ Max 3 attempts
    ↓
Conversion Phase:
  ├─ agents/conversion_agent.py generates code
  ├─ core/quality_validator.py scores output
  ├─ Passed (≥85%)?
  │  ├─ YES → Store code
  │  └─ NO → core/agent_refiner.py → Retry
  └─ Max 3 attempts
    ↓
Storage Phase:
  ├─ infrastructure/project_manager.py ensures project
  ├─ agents/storage_agent.py deploys files
  ├─ core/quality_validator.py validates deployment
  └─ Reports results
    ↓
Output: Execution Report
```

## Module Responsibilities

### config/ - Configuration Centralization
**config.py**
- API keys and credentials
- Gemini model settings
- Framework versions (Angular 21, AG-Grid)

**crew_config.py**
- Master and agent roles/goals
- Success factor threshold (85%)
- Retry limit (3)
- Validation weights

**prompts.py**
- AI system instructions
- Extract prompts
- Validation prompts
- Template functions

### agents/ - Independent Processing
**analysis_agent.py**
- Extracts ExtJS structure
- Validates blueprint
- Returns structured blueprint

**conversion_agent.py**
- Converts blueprint to Angular
- Refines with best practices
- Returns production-ready code

**storage_agent.py**
- Creates directory structure
- Deploys files to disk
- Returns deployment manifest

### core/ - Master Coordination
**crew_orchestrator.py**
- Initializes all agents
- Executes phases sequentially
- Manages quality gates
- Handles retries
- Generates execution report

**quality_validator.py**
- Scores each phase (0-100)
- Calculates weighted success factor
- Identifies issues/recommendations
- Tracks validation history

**agent_refiner.py**
- Receives validation feedback
- Improves outputs
- Re-submits for validation

**gemini_client.py**
- Manages Gemini API calls
- Ensures JSON responses
- Centralized error handling

### infrastructure/ - System Operations
**project_manager.py**
- Creates Angular projects
- Loads source files
- Validates file paths

## Configuration Hierarchy

```
config/config.py (Base Config)
├─ GEMINI_API_KEY
├─ GEMINI_MODEL = "gemini-2.5-flash"
├─ ANGULAR_VERSION = "21"
└─ UI_FRAMEWORK = "AG-Grid"

config/crew_config.py (Crew Config)
├─ SUCCESS_FACTOR_THRESHOLD = 85
├─ RETRY_LIMIT = 3
├─ ANALYSIS_VALIDATION_WEIGHTS = {weights}
├─ CONVERSION_VALIDATION_WEIGHTS = {weights}
└─ STORAGE_VALIDATION_WEIGHTS = {weights}

config/prompts.py (AI Instructions)
├─ ANALYSIS_EXTRACT_BLUEPRINT
├─ ANALYSIS_VALIDATE_BLUEPRINT
├─ CONVERSION_TO_ANGULAR
├─ CONVERSION_REFINE_ARCHITECTURE
└─ get_conversion_angular_prompt()
```

## Execution Flow

```
main()
  ↓
ExtJsToAngularOrchestrator().__init__()
  ├─ Creates CrewOrchestrator
  └─ Loads ExtJS file
  ↓
ExtJsToAngularOrchestrator().run()
  └─ CrewOrchestrator.run()
    ├─ execute_analysis_phase() × (1 to 3 attempts)
    ├─ execute_conversion_phase() × (1 to 3 attempts)
    └─ execute_storage_phase() × 1 attempt
      ↓
For each phase:
  ├─ Run agent
  ├─ Validate (score 0-100)
  ├─ Check success >= 85%
  ├─ YES → Continue to next phase
  ├─ NO → Refine & retry
  └─ Max 3 attempts
    ↓
Print summary report
```

## Inter-Agent Communication

Agents communicate through **quality feedback loops**:

```
Agent Output
    ↓
QualityValidator scores it
    ↓
Extract issues & recommendations
    ↓
AgentRefiner receives feedback
    ↓
AgentRefiner improves output
    ↓
Re-submit to validator
    ↓
Repeat until passed or max retries
```

## Extension Points

### Add New Validation Criterion

1. **In config/crew_config.py:**
```python
ANALYSIS_VALIDATION_WEIGHTS = {
    "new_criterion": 0.1,
    # ... other criteria must still sum to 1.0
}
```

2. **In core/quality_validator.py:**
```python
validation_result['new_criterion'] = score
```

### Add New Refinement Strategy

1. **In core/agent_refiner.py:**
```python
def refine_with_new_strategy(self, output, feedback):
    # Custom refinement logic
    return improved_output
```

2. **In core/crew_orchestrator.py:**
```python
improved = agent_refiner.refine_with_new_strategy(...)
```

### Add New Phase

1. **Create agent in agents/:**
```python
# agents/new_phase_agent.py
class NewPhaseAgent:
    def execute(self, input_data):
        # Phase logic
        return output
```

2. **Add to core/crew_orchestrator.py:**
```python
def execute_new_phase(self, input_data):
    # New phase execution with quality gates
```

## Troubleshooting

### Low Success Factors

**Cause:** Complex ExtJS/Angular code, weak prompts
**Solution:**
1. Review validation feedback
2. Update prompts in `config/prompts.py`
3. Adjust weights in `config/crew_config.py`
4. Increase `RETRY_LIMIT`

### API Errors

**Cause:** Gemini API issues
**Solution:**
1. Check API key in `config/config.py`
2. Verify Gemini dashboard limits
3. Check API response format

### Import Errors

**Cause:** Python path issues
**Solution:**
1. Add Migration-Agent to PYTHONPATH
2. Ensure __init__.py in all packages
3. Check relative imports

## Performance Metrics

| Phase | Time | Success Rate |
|-------|------|--------------|
| Analysis | 15-30s | 80-90% |
| Conversion | 20-40s | 75-85% |
| Storage | 5-10s | 95%+ |
| **Total** | **45-80s** | **75%+** |

## Debugging Tips

### Check Execution Log
```python
orchestrator.run()
report = orchestrator.get_execution_report()
print(report['execution_log'])
```

### Monitor Success Factors
```python
for entry in report['execution_log']:
    print(f"{entry['phase']}: {entry['success_factor']}%")
```

### Review Validation Details
```python
validation_report = report['validation_report']
for phase in validation_report['history']:
    print(f"Phase: {phase['phase']}")
    print(f"Issues: {phase['details'].get('issues', [])}")
    print(f"Recommendations: {phase['details'].get('recommendations', [])}")
```

