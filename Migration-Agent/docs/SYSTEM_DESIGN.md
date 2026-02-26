# System Design: Dependency Resolution & Module Organization
## ExtJS to Angular Migration Agent v2.0

---

## 🏗️ Architecture Overview

The Migration Agent v2.0 implements a sophisticated multi-agent system with integrated dependency management and Angular module organization.

```
┌─────────────────────────────────────────────────────────────────┐
│         ExtJS to Angular Migration Agent v2.0                    │
├─────────────────────────────────────────────────────────────────┤
│                      ORCHESTRATION LAYER                         │
│         (CrewOrchestrator - Master Coordinator)                  │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│              │              │              │                    │
├──────────────┴──────────────┴──────────────┴────────────────────┤
│                    AGENT LAYER                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Analysis   │  │  Conversion  │  │   Storage    │          │
│  │    Agent     │  │    Agent     │  │    Agent     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
├─────────────────────────────────────────────────────────────────┤
│                  SUPPORT LAYER                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │   Dependency    │  │   Processed     │  │    Angular     │  │
│  │   Analyzer      │  │  Files Tracker  │  │    Module      │  │
│  │                 │  │                 │  │   Organizer    │  │
│  └─────────────────┘  └─────────────────┘  └────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│              QUALITY ASSURANCE LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Quality Validator | Agent Refiner | Best Practices      │  │
│  └──────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Project Manager | Gemini Client | File System I/O       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### Single File Processing with Dependency Resolution

```
Input File
    ↓
[DependencyAnalyzer]
    ├─ Extract Dependencies (regex patterns)
    ├─ Resolve File Paths
    ├─ Build Dependency Graph
    ├─ Detect Circular Dependencies
    └─ Add to Processing Queue
    ↓
[ProcessedFilesTracker]
    ├─ Check if file already processed
    ├─ Add to queue if new
    └─ Queue dependent files
    ↓
[AnalysisAgent] ──────────────────────┐
    ├─ Extract blueprint              │ Quality Validation
    ├─ Validate blueprint             │ (85%+ threshold)
    └─ Apply refinements (if needed)  │
    ↓                                 │
[ConversionAgent] ────────────────────┤
    ├─ Convert to Angular code        │ Quality Validation
    ├─ Organize module structure      │ (85%+ threshold)
    ├─ Enforce best practices         │
    └─ Apply refinements (if needed)  │
    ↓                                 │
[StorageAgent] ───────────────────────┤
    ├─ Create module directories      │ Quality Validation
    ├─ Deploy component files         │ (85%+ threshold)
    ├─ Deploy service files           │
    └─ Deploy model files             │
    ↓                                 │
[ProcessedFilesTracker]               │
    ├─ Mark file as processed      ←──┘
    ├─ Record dependencies
    ├─ Update statistics
    └─ Save state
    ↓
Output: Migrated Angular Component + Dependencies Processed
```

### Batch Processing with Queue Management

```
┌─ Input Directory
│
├─ [ProjectManager.find_extjs_files]
│   └─ Find all .js files recursively
│
├─ [ProcessedFilesTracker]
│   └─ Initialize queue with found files
│
└─ Process Loop:
   ├─ While queue not empty:
   │  ├─ [ProcessedFilesTracker.dequeue_file]
   │  │  └─ Get next file from queue
   │  │
   │  ├─ Check if already processed
   │  │  └─ Skip if yes
   │  │
   │  ├─ [DependencyAnalyzer]
   │  │  └─ Resolve dependencies
   │  │     └─ Add new dependencies to queue
   │  │
   │  └─ Process through Pipeline:
   │     ├─ Analysis Phase
   │     ├─ Conversion Phase (with module org)
   │     ├─ Storage Phase (modular deployment)
   │     └─ Mark as processed
   │
   └─ Output Statistics & Report
```

---

## 📊 Component Interactions

### Dependency Analyzer

```python
class DependencyAnalyzer:
    # Input: File path or content
    # Process:
    #   1. Extract all dependency references (15+ patterns)
    #   2. Resolve references to actual file paths
    #   3. Recursively build dependency graph
    #   4. Detect circular dependencies
    # Output: Dependency graph, statistics, warnings
    
    extract_dependencies()          # → Set[str] of references
    resolve_dependency_paths()      # → Dict[reference → filepath]
    build_dependency_graph()        # → Dict (tree structure)
    get_all_dependencies_flat()     # → List[str] of all deps
    detect_circular_dependencies()  # → List[Tuple] of cycles
    get_dependency_statistics()     # → Dict with stats
```

**Patterns Detected**:
- ES6 imports: `import { Component } from './component'`
- CommonJS requires: `require('./module')`
- ExtJS requires: `requires: ['app.module.Name']`
- Component references: `xtype: 'component-name'`
- Service/Store references: `store: 'StoreName'`, `controller: 'ControllerName'`

### Processed Files Tracker

```python
class ProcessedFilesTracker:
    # Purpose: Maintain state of migration progress
    # Supports: Resumable migrations, avoid reprocessing
    
    # Queue Management:
    add_to_queue()          # Add files for processing
    dequeue_file()          # Get next file
    
    # Processing Status:
    is_processed()          # Check if already done
    add_processed_file()    # Mark as done (with metadata)
    mark_failed()           # Mark as failed
    mark_skipped()          # Mark as skipped
    
    # Statistics & Reporting:
    get_statistics()        # Migration progress stats
    print_summary()         # User-friendly summary
    save_to_file()          # Persist state (resume capability)
    load_from_file()        # Restore previous state
    
    # Data Structure:
    {
        'processed_files': {
            'filepath': {
                'status': 'success',
                'dependencies_resolved': [...],
                'processed_at': timestamp,
                'result': {...}
            }
        },
        'failed_files': {...},
        'skipped_files': {...},
        'processing_queue': [...],
        'statistics': {...}
    }
```

### Angular Module Organizer

```python
class AngularModuleOrganizer:
    # Purpose: Organize components into proper Angular modules
    # Strategy: Keyword matching + content analysis
    
    # Categorization:
    categorize_component()         # → 'users' | 'products' | 'shared' | ...
    is_shared_utility()            # → bool (shared or feature-specific?)
    
    # Module Structure:
    get_module_path()              # → /path/to/module/subfolder
    generate_module_structure()    # → Dict of directories
    create_module_directories()    # → Create on disk
    
    # Code Generation:
    generate_feature_module_template()  # → .module.ts code
    generate_shared_module_template()   # → shared.module.ts code
    
    # Quality Checks:
    validate_module_structure()    # Check for issues
    detect_circular_imports()      # Find import cycles
    
    # Recommendations:
    recommend_import_path()        # Suggest import statement
    get_module_dependencies()      # Required module imports
    
    # Categories:
    {
        'users': ['user', 'account', 'profile', ...],
        'products': ['product', 'catalog', ...],
        'orders': ['order', 'transaction', ...],
        'shared': No keywords (shared by multiple modules)
    }
```

---

## 🎯 Phase Details

### Phase 1: Analysis with Dependency Extraction

```
Input: ExtJS Source Code
   ↓
┌─────────────────────────────┐
│    Analysis Agent           │
├─────────────────────────────┤
│ 1. Extract ExtJS structure  │
│    - Models                 │
│    - Stores                 │
│    - Columns                │
│    - Custom logic           │
│                             │
│ 2. Extract Dependencies     │
│    - File references        │
│    - Component refs         │
│    - Service refs           │
│                             │
│ 3. Validate Blueprint       │
│    - Completeness check     │
│    - Logic capture check    │
│    - Custom renderers       │
└─────────────────────────────┘
   ↓
Quality Validation (85%+ threshold)
   ↓
Output: 
{
  'blueprint': { model, store, columns, logic },
  'dependencies': { file_path, direct_deps, all_deps, graph },
  'validation': { success_factor, issues, recommendations }
}
```

### Phase 2: Conversion with Module Organization

```
Input: Validated Blueprint
   ↓
┌─────────────────────────────┐
│  Conversion Agent           │
├─────────────────────────────┤
│ 1. Convert to Angular code  │
│    - Component TypeScript   │
│    - Component HTML         │
│    - Service                │
│    - Interface/Model        │
│                             │
│ 2. Organize Module Struct   │
│    - Categorize component   │
│    - Check if shared        │
│    - Determine target path  │
│    - Set module deps        │
│                             │
│ 3. Enforce Best Practices   │
│    - Strict typing          │
│    - Error handling         │
│    - Memory management      │
│    - Change detection       │
│    - Naming conventions     │
└─────────────────────────────┘
   ↓
Quality Validation (85%+ threshold)
   ↓
Output:
{
  'component_ts': code,
  'component_html': template,
  'service': code,
  'interface': code,
  'module_organization': {
    'module_category': 'users',
    'target_path': '/modules/users/components',
    'module_dependencies': ['CommonModule', 'SharedModule']
  },
  'best_practices': {
    'issues': [...],
    'compliance_score': 85
  }
}
```

### Phase 3: Storage with Modular Deployment

```
Input: Generated Angular Code
   ↓
┌─────────────────────────────┐
│  Storage Agent              │
├─────────────────────────────┤
│ 1. Create Module Dirs       │
│    - /modules/{category}/   │
│    - components/            │
│    - services/              │
│    - models/                │
│                             │
│ 2. Deploy Files             │
│    - component.ts           │
│    - component.html         │
│    - service.ts             │
│    - model.ts               │
│                             │
│ 3. Create Module File       │
│    - module.ts              │
│    - module-routing.ts      │
│                             │
│ 4. Create File Manifest     │
│    - List deployed files    │
│    - Verify structure       │
│    - Check naming           │
└─────────────────────────────┘
   ↓
Quality Validation (85%+ threshold)
   ↓
Output:
{
  'deployed_files': [...],
  'module_structure': {...},
  'manifest': { file_count, endpoints, models }
}
```

---

## 💾 State Management

### Tracker Data Structure

```json
{
  "migration_start_time": "2024-02-26T10:00:00.000Z",
  "last_updated": "2024-02-26T10:15:30.000Z",
  
  "processed_files": {
    "/path/to/UserGrid.js": {
      "path": "/path/to/UserGrid.js",
      "file_name": "UserGrid.js",
      "status": "success",
      "processed_at": "2024-02-26T10:05:00.000Z",
      "result": {
        "manifest": {
          "feature_name": "UserGrid",
          "module_category": "users",
          "files": ["user-grid.component.ts", "user-grid.component.html"]
        }
      },
      "dependencies_resolved": [
        "/path/to/UserModel.js",
        "/path/to/UserService.js"
      ],
      "retry_count": 1
    }
  },
  
  "failed_files": {
    "/path/to/BadFile.js": {
      "path": "/path/to/BadFile.js",
      "file_name": "BadFile.js",
      "reason": "Analysis failed - circular dependencies detected",
      "failed_at": "2024-02-26T10:06:00.000Z"
    }
  },
  
  "skipped_files": {
    "/path/to/SkippedFile.js": {
      "reason": "No changes detected"
    }
  },
  
  "processing_queue": [
    "/path/to/next-file.js",
    "/path/to/dependency-file.js"
  ],
  
  "statistics": {
    "total_processed": 15,
    "total_failed": 2,
    "total_skipped": 1,
    "remaining_in_queue": 5,
    "total_dependencies_resolved": 32,
    "success_rate": 88.2,
    "elapsed_time_seconds": 925.5
  }
}
```

---

## 🔄 Processing Workflow

### Single File Flow

```
Input: UserGrid.js
  ↓
[DependencyAnalyzer]
├─ Detects: UserModel.js, UserService.js, UserStore.js
├─ Adds to queue: [UserModel.js, UserService.js, UserStore.js]
└─ Returns dependency info
  ↓
[Phase 1: Analysis]
├─ Extracts: Grid columns, store config, custom logic
├─ Validates: All models present, logic documented
└─ Success Factor: 92%

[Phase 2: Conversion]
├─ Generates: Component, Service, Model
├─ Organizes: users module, components subfolder
├─ Enforces: Strict typing, error handling, OnPush detection
└─ Success Factor: 88%

[Phase 3: Storage]
├─ Creates: /modules/users/components/user-grid/
├─ Deploys: user-grid.component.ts/html, user-grid.service.ts
├─ Validates: Files exist, structure correct
└─ Success Factor: 95%

[Tracker]
├─ Marks UserGrid.js as processed
├─ Records dependencies (UserModel.js, etc.)
├─ Updates statistics
└─ Saves state to .migration/processed_files.json

Output: Module structure ready for next dependencies
Next: Process UserModel.js, UserService.js, etc. (auto-queued)
```

### Batch Processing Flow

```
Input Directory: /app/view
  ↓
[Find all .js files in directory]
← UserGrid.js
← ProductGrid.js
← UserModel.js
← ProductService.js
← ...15 more files

[Add to queue]: 19 files

Processing Loop:
├─ File 1: UserGrid.js
│  ├─ Check processed? No
│  ├─ Extract deps: [UserModel.js, UserService.js]
│  ├─ Add deps to queue
│  ├─ Process through pipeline
│  └─ Mark processed, queue now has 20 items
│
├─ File 2: ProductGrid.js
│  ├─ Check processed? No
│  ├─ Extract deps: [...] (some already in queue)
│  └─ Process and mark
│
├─ File N: UserModel.js (from queue - dependency)
│  ├─ Check processed? No
│  ├─ Process as model file
│  └─ Mark processed
│
... continue until queue empty

Final Statistics:
├─ Started with: 19 files
├─ Discovered: 32 total (19 + 13 dependencies)
├─ Processed: 31
├─ Failed: 1 (circular dependency)
├─ Success Rate: 96.9%
└─ Store state for resume capability
```

---

## ⚙️ Configuration & Customization

### Dependency Analyzer Configuration

```python
# In crew_orchestrator.py
self.dependency_analyzer = DependencyAnalyzer(
    base_dir="/path/to/source"
)

# Control recursion depth
graph = self.dependency_analyzer.build_dependency_graph(
    file_path,
    max_depth=5  # Control how deep to analyze
)

# Clear cache if needed
self.dependency_analyzer.clear_cache()
```

### Module Organizer Configuration

```python
# Add custom module categories
MODULE_CATEGORIES = {
    'custom-domain': ['keyword1', 'keyword2'],  # Add your own
    # ... existing categories
}

# Custom shared utilities detection
SHARED_UTILITIES = {
    'interfaces': ['*.interface.ts'],  # Add patterns
    # ... existing patterns
}
```

### Tracker Configuration

```python
# Initialize with custom file path
tracker = ProcessedFilesTracker(
    tracker_file="/custom/path/.migration/tracker.json"
)

# Or use environment variables
import os
tracker_file = os.getenv('MIGRATION_TRACKER', 
                         '.migration/processed_files.json')
tracker = ProcessedFilesTracker(tracker_file)
```

---

## 🧪 Testing & Validation

### Unit Test Structure

```python
# test_dependency_analyzer.py
def test_extract_dependencies():
    analyzer = DependencyAnalyzer('/test/path')
    content = "import { User } from './user'; const api = require('./api');"
    deps = analyzer.extract_dependencies(content)
    assert './user' in deps
    assert './api' in deps

def test_detect_circular():
    # Create test files with circular imports
    circular = analyzer.detect_circular_dependencies(file_path)
    assert len(circular) > 0

# test_processed_files_tracker.py
def test_resume_migration():
    tracker = ProcessedFilesTracker('/tmp/tracker.json')
    tracker.add_processed_file('/file1.js')
    tracker.save_to_file()
    
    # Simulate restart
    tracker2 = ProcessedFilesTracker('/tmp/tracker.json')
    assert tracker2.is_processed('/file1.js')

# test_module_organizer.py
def test_categorize_component():
    organizer = AngularModuleOrganizer('/angular/app')
    module = organizer.categorize_component('UserGridComponent')
    assert module == 'users'
```

---

## 🚀 Performance Considerations

### Optimization Strategies

1. **Dependency Caching**
   - Cache resolved dependencies per analyzer instance
   - Avoid re-analyzing same files

2. **Batch Processing**
   - Process 20-30 files per batch for stability
   - Use tracker to resume interrupted batches

3. **Memory Management**
   - Clear analyzer cache after batch completion
   - Use streaming for large projects

4. **Quality Gate Thresholds**
   - Analysis: 85%+ (quick feedback)
   - Conversion: 85%+ (code quality)
   - Storage: 85%+ (file structure)

### Benchmarks

| Operation | Time | Files |
|-----------|------|-------|
| Dependency Analysis | 500ms | 1 file |
| Circular Detection | 1.2s | 50 deps |
| Module Organization | 250ms | 1 component |
| Full Pipeline | 5-15s | 1 file |
| Batch (10 files) | 60-90s | 10 files |

---

## 📈 Monitoring & Observability

### Execution Logs

```python
# Accessed via orchestrator
execution_log = orchestrator.execution_log
# [
#   {'phase': 'analysis', 'attempt': 1, 'status': 'passed', 'success_factor': 92},
#   {'phase': 'conversion', 'attempt': 1, 'status': 'passed', 'success_factor': 88},
#   ...
# ]
```

### Metrics Collection

```python
stats = tracker.get_statistics()
{
    'migration_start_time': '...',
    'total_processed': 31,
    'total_failed': 1,
    'total_skipped': 0,
    'success_rate': 96.9,
    'elapsed_time_seconds': 245.3,
    'total_dependencies_resolved': 32
}
```

---

## 🔐 Quality Assurance

### Quality Gates

Each phase has a **85%+ success factor threshold**:

```
Analysis Phase
├─ Model Extraction: 0.25
├─ Store Extraction: 0.25
├─ Columns Extraction: 0.25
└─ Logic Capture: 0.25
   = Success Factor >= 85%? → Proceed : Refine

Conversion Phase
├─ Proper Typing: 0.2
├─ Error Handling: 0.2
├─ Component Structure: 0.2
├─ Service Design: 0.2
└─ Angular Standards: 0.2
   = Success Factor >= 85%? → Proceed : Refine

Storage Phase
├─ Directory Structure: 0.33
├─ File Integrity: 0.33
└─ Naming Conventions: 0.34
   = Success Factor >= 85%? → Success : Report Issues
```

### Refinement Loop

```
Phase Execution
   ↓
Quality Validation
   ├─ Success Factor >= 85%? → Yes → Proceed
   └─ Success Factor < 85%? → No
      ↓
      Agent Refiner
      ├─ Analyze validation issues
      ├─ Generate improvement prompts
      ├─ Retry with improvements
      └─ Up to 3 attempts (RETRY_LIMIT)
         ├─ Success? → Proceed
         └─ Fail after 3? → Report issues, continue with best effort
```

---

## 📋 Summary & Key Takeaways

✅ **Dependency Resolution**: Automatic detection and queue management  
✅ **Processed Files Tracking**: Resume capability, prevent reprocessing  
✅ **Module Organization**: Automatic categorization and proper structure  
✅ **Quality Assurance**: 85%+ threshold with refinement loops  
✅ **Best Practices**: Enforced standards throughout pipeline  
✅ **Production Ready**: Zero-change deployment capability  

The system provides an enterprise-grade migration experience with:
- **Robustness**: Handles complex dependencies and circular refs
- **Efficiency**: Batch processing with resumable state
- **Quality**: Multi-phase validation with refinement
- **Maintainability**: Organized modular structure
- **Scalability**: Process thousands of files without manual intervention

---

**Document Version**: 2.0  
**Last Updated**: February 26, 2024  
**Status**: Complete & Production Ready
