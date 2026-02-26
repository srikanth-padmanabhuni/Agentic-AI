# Recursive File Processing - Implementation Guide

## Overview

The ExtJS to Angular migration tool now supports **recursive batch processing** of all ExtJS files in a directory and its subdirectories. This allows you to migrate an entire ExtJS project in one operation.

## Single vs. Batch Processing

### Single File Mode
```python
from ExtJsToAngularOrchestrator import ExtJsToAngularOrchestrator

migrator = ExtJsToAngularOrchestrator(
    extjs_source="path/to/UserGrid.js",  # Single file
    angular_project_root="path/to/angular-app"
)
migrator.run()
```

**Output:** Processes one file through all phases (analysis, conversion, storage)

### Batch (Recursive) Mode
```python
from ExtJsToAngularOrchestrator import ExtJsToAngularOrchestrator

migrator = ExtJsToAngularOrchestrator(
    extjs_source="path/to/extjs/components",  # Directory
    angular_project_root="path/to/angular-app"
)
migrator.run()
```

**Output:** Processes ALL `.js` files found recursively throughout the directory tree

## How Auto-Detection Works

The tool automatically detects whether the input is a file or directory:

```python
# Check if source is a directory
if os.path.isdir(extjs_source):
    # Batch mode: Find all .js files recursively
    files = project_manager.find_extjs_files(extjs_source)
else:
    # Single file mode: Process that file
    files = [extjs_source]
```

## Recursive File Discovery

The `ProjectManager.find_extjs_files()` method:

1. **Walks the directory tree** - Uses `os.walk()` to traverse all levels
2. **Finds all .js files** - Identifies ExtJS components
3. **Filters ignored folders** - Skips common non-source directories:
   - `.git`
   - `node_modules`
   - `.angular`
   - `dist`
   - `build`
4. **Returns sorted list** - Provides files in consistent order

Example:
```
source_dir/
├── users/
│   ├── UserGrid.js        ✓ Found
│   ├── UserForm.js        ✓ Found
│   └── tests/
│       └── user.spec.js   ✓ Found
├── products/
│   ├── ProductList.js     ✓ Found
│   └── ProductDetail.js   ✓ Found
├── node_modules/          ✗ Ignored
│   └── library.js
└── .git/                  ✗ Ignored
    └── config
```

## Batch Processing Workflow

```
Directory Input (extjs_source)
    ↓
detect is_batch = True
    ↓
find_extjs_files() → List of all .js files
    ↓
For each file:
    │
    ├─ Phase 1: Analysis
    │   └─ Extract blueprint
    │
    ├─ Phase 2: Conversion  
    │   └─ Generate Angular code
    │
    ├─ Phase 3: Storage
    │   └─ Deploy files
    │
    └─ Track result (success/failed/error)
    ↓
Aggregated Batch Report
```

## Results Tracking

For batch processing, results are stored in `batch_results`:

```python
migrator = ExtJsToAngularOrchestrator(...)
migrator.run()

results = migrator.get_results()
# Returns: {
#   "file1.js": {"status": "success", "blueprint": {...}, ...},
#   "file2.js": {"status": "failed", "reason": "analysis_failed"},
#   "file3.js": {"status": "error", "error": "API error"}
# }
```

## Batch Summary Report

The tool prints a comprehensive batch summary:

```
========================================================================
📊 BATCH MIGRATION EXECUTION SUMMARY
========================================================================

Total Files Processed: 15
✅ Successfully Converted: 13
❌ Failed to Convert: 2
Success Rate: 86.7%

File Results:
--------------------------------------------------
  ✅ UserGrid.js
  ✅ UserForm.js
  ✅ ProductList.js
  ❌ LegacyComponent.js (Reason: analysis_failed)
  ✅ ReportDashboard.js
  ... (more files)
```

## Error Handling in Batch Mode

- **File-level errors don't stop processing** - Other files continue
- **Tracked per-file** - Each file's status recorded separately
- **Graceful degradation** - Best effort for all files
- **Continuation logic** - Process all files, report issues at end

## Examples

### Example 1: Migrate a Feature Folder
```python
from ExtJsToAngularOrchestrator import ExtJsToAngularOrchestrator

# Migrate all components in the users feature
migrator = ExtJsToAngularOrchestrator(
    extjs_source="C:/projects/extjs-app/app/view/users",
    angular_project_root="C:/projects/angular-app"
)
migrator.run()
```

### Example 2: Migrate Entire Application
```python
from ExtJsToAngularOrchestrator import ExtJsToAngularOrchestrator

# Migrate all ExtJS components
migrator = ExtJsToAngularOrchestrator(
    extjs_source="C:/projects/extjs-app/app/view",
    angular_project_root="C:/projects/angular-app"
)
migrator.run()
```

### Example 3: Check Batch Results Programmatically
```python
from ExtJsToAngularOrchestrator import ExtJsToAngularOrchestrator

migrator = ExtJsToAngularOrchestrator(
    extjs_source="C:/projects/extjs-app",
    angular_project_root="C:/projects/angular-app"
)
migrator.run()

results = migrator.get_results()

# Count results
successful = sum(1 for r in results.values() if r['status'] == 'success')
failed = sum(1 for r in results.values() if r['status'] != 'success')

print(f"Successful: {successful}")
print(f"Failed: {failed}")

# Examine specific failures
for file, result in results.items():
    if result['status'] != 'success':
        print(f"Issue in {file}: {result.get('reason') or result.get('error')}")
```

## Implementation Details

### Key Components Modified

1. **ProjectManager** (`infrastructure/project_manager.py`)
   - Added `find_extjs_files(source_dir)` method
   - Recursively discovers all `.js` files
   - Filters ignored directories

2. **CrewOrchestrator** (`core/crew_orchestrator.py`)
   - Auto-detects single vs. batch mode
   - Added `run_batch()` method for multiple files
   - Tracks `batch_results` dictionary
   - Added `_print_batch_summary_report()` method

3. **ExtJsToAngularOrchestrator** (entry point)
   - Changed parameter from `extjs_file_path` to `extjs_source`
   - Works with both files and directories
   - Added `get_results()` method

### Phase Processing in Batch Mode

Each file goes through standard phases:
- **Analysis Phase** - Quality gate at 85%
- **Conversion Phase** - Quality gate at 85%
- **Storage Phase** - Deployment

If any phase fails after retries:
- File marked as failed
- Batch processing continues
- Issue logged in results

## Performance Considerations

- **Sequential processing** - Files processed one at a time (deterministic)
- **Independent validation** - Each file validated separately
- **Fresh agents** - Quality validator reset for each file
- **Scalable** - Can handle hundreds of files

## Common Use Cases

### Use Case 1: Migrate by Feature
```python
# User Management Feature
migrator = ExtJsToAngularOrchestrator(
    extjs_source="app/view/users",
    angular_project_root="angular-app"
)
migrator.run()

# Products Feature
migrator = ExtJsToAngularOrchestrator(
    extjs_source="app/view/products",
    angular_project_root="angular-app"
)
migrator.run()
```

### Use Case 2: Dry Run Before Full Migration
```python
# Test with a subset first
migrator = ExtJsToAngularOrchestrator(
    extjs_source="app/view/test-components",
    angular_project_root="angular-app"
)
migrator.run()

# If successful, migrate entire view folder
# migrator = ExtJsToAngularOrchestrator(...)
```

### Use Case 3: CI/CD Integration
```python
import sys
from ExtJsToAngularOrchestrator import ExtJsToAngularOrchestrator

migrator = ExtJsToAngularOrchestrator(
    extjs_source=sys.argv[1],  # From CI pipeline
    angular_project_root=sys.argv[2]
)
migrator.run()

results = migrator.get_results()

# Fail if any files failed
if any(r['status'] != 'success' for r in results.values()):
    sys.exit(1)
```

## Troubleshooting

### No files found?
- Ensure directory exists
- Check file extensions are `.js`
- Verify no permission issues

### Some files failing?
- Check error messages in batch report
- Review issue reasons
- Try converting those files individually for detailed diagnostics

### Performance slow?
- Consider splitting into smaller directories
- Process one feature at a time
- Check API rate limits for Gemini

## Related Documentation

- See [QUICKSTART.md](QUICKSTART.md) for quick examples
- See [README.md](README.md) for full feature overview
- See [CREW_AI_GUIDE.md](CREW_AI_GUIDE.md) for technical details
