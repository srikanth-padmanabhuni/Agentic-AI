"""
Crew AI Orchestrator - Master Agent coordinating all agents with quality assurance
Uses a quality-gated pipeline where each phase must achieve 85%+ success factor
Includes dependency tracking and processed files management
"""
import json
import os
from typing import Tuple, List, Dict
from agents import AnalysisAgent, ConversionAgent, StorageAgent
from infrastructure import ProjectManager
from .quality_validator import QualityValidator
from .agent_refiner import AgentRefiner
from .dependency_analyzer import DependencyAnalyzer
from .processed_files_tracker import ProcessedFilesTracker
from .angular_module_organizer import AngularModuleOrganizer
from config import RETRY_LIMIT, SUCCESS_FACTOR_THRESHOLD


class CrewOrchestrator:
    """
    Master agent that orchestrates the migration pipeline using a quality-gated approach.
    Each phase must achieve a success factor of 85%+ before proceeding to the next level.
    Supports both single file and batch (recursive) processing.
    """
    
    def __init__(self, extjs_source: str, angular_project_root: str):
        """
        Initialize the Crew Orchestrator with all sub-agents and tools.
        
        Args:
            extjs_source: Path to ExtJS component file OR directory (for recursive processing)
            angular_project_root: Root directory of Angular project
        """
        print("\n" + "="*70)
        print("🚀 Crew AI Multi-Agent Orchestrator Initialization")
        print("="*70)
        
        # Initialize Infrastructure
        self.project_manager = ProjectManager(angular_project_root)
        self.extjs_source = os.path.abspath(extjs_source)
        self.angular_root = angular_project_root
        
        # Initialize Dependency and Module Management
        self.dependency_analyzer = DependencyAnalyzer(os.path.dirname(extjs_source) 
                                                      if os.path.isfile(extjs_source) 
                                                      else extjs_source)
        self.module_organizer = AngularModuleOrganizer(angular_project_root)
        
        # Initialize Processed Files Tracker
        tracker_file = os.path.join(angular_project_root, '.migration', 'processed_files.json')
        os.makedirs(os.path.dirname(tracker_file), exist_ok=True)
        self.files_tracker = ProcessedFilesTracker(tracker_file)
        
        # Determine if processing single file or directory
        self.is_batch = os.path.isdir(self.extjs_source)
        
        if self.is_batch:
            print(f"📂 Batch mode: Processing all files in {self.extjs_source}")
            all_files = self.project_manager.find_extjs_files(self.extjs_source)
            if not all_files:
                print("⚠️  No .js files found in the directory")
            else:
                print(f"📋 Found {len(all_files)} ExtJS files to process")
            
            # Add to queue
            self.extjs_files = all_files
            self.files_tracker.add_to_queue(all_files)
        else:
            print(f"📄 Single file mode: Processing {self.extjs_source}")
            self.extjs_files = [self.extjs_source]
        
        # Initialize Agents (Tools for Master Agent)
        self.analysis_agent = AnalysisAgent(os.path.dirname(self.extjs_source) 
                                            if os.path.isfile(self.extjs_source) 
                                            else self.extjs_source)
        self.conversion_agent = ConversionAgent(angular_project_root)
        self.storage_agent = StorageAgent(angular_project_root)
        
        # Initialize Quality Assurance Tools
        self.quality_validator = QualityValidator()
        self.agent_refiner = AgentRefiner()
        
        # Tracking
        self.phase_results = {}
        self.execution_log = []
        self.batch_results = {}  # For batch processing results
        
        print("✅ All agents initialized and ready")
        print(f"📋 Success Factor Threshold: {SUCCESS_FACTOR_THRESHOLD}%")
        print(f"🔄 Retry Limit: {RETRY_LIMIT} attempts per phase\n")
    
    # ========================================================================
    # DEPENDENCY RESOLUTION & FILE TRACKING
    # ========================================================================
    
    def resolve_and_queue_dependencies(self, file_path: str) -> List[str]:
        """
        Resolve all dependencies for a file and add to processing queue.
        
        Args:
            file_path: Path to the file
            
        Returns:
            List of resolved dependency file paths
        """
        if not os.path.exists(file_path):
            return []
        
        # Get all dependencies
        all_deps = self.dependency_analyzer.get_all_dependencies_flat(file_path)
        
        # Filter out already processed files
        new_deps = [dep for dep in all_deps if not self.files_tracker.is_processed(dep)]
        
        if new_deps:
            print(f"🔗 Found {len(new_deps)} new dependencies to process")
            self.files_tracker.add_to_queue(new_deps)
        
        return new_deps
    
    def mark_file_processed(self, file_path: str, status: str = 'success', 
                           result: Dict = None, dependencies: List[str] = None) -> None:
        """
        Mark a file as processed and track it.
        
        Args:
            file_path: Path to the file
            status: Processing status
            result: Result data from processing
            dependencies: List of dependencies resolved
        """
        self.files_tracker.add_processed_file(file_path, status, result, dependencies)
    
    # ========================================================================
    # PHASE 1: ANALYSIS WITH QUALITY GATES
    # ========================================================================
    
    def execute_analysis_phase(self) -> Tuple[dict, bool]:
        """
        Execute analysis phase with quality gating.
        Retries up to RETRY_LIMIT times until success factor >= 85%.
        
        Returns:
            Tuple of (blueprint, phase_passed)
        """
        print("\n" + "="*70)
        print("📋 PHASE 1: ANALYSIS PHASE")
        print("="*70 + "\n")
        
        for attempt in range(1, RETRY_LIMIT + 1):
            print(f"🔄 Attempt {attempt}/{RETRY_LIMIT}")
            print("-" * 50)
            
            try:
                # Execute analysis
                blueprint = self.analysis_agent.analyze(self.extjs_content)
                
                # Extract and analyze dependencies
                if hasattr(self, '_current_file_path'):
                    dep_info = self.analysis_agent.extract_dependencies(self._current_file_path, self.extjs_content)
                    dep_validation = self.analysis_agent.validate_dependencies(dep_info)
                    blueprint['dependencies'] = dep_info
                    blueprint['dependency_validation'] = dep_validation
                
                # Validate output
                passed, validation = self.quality_validator.validate_analysis(blueprint)
                
                # Log execution
                self.execution_log.append({
                    'phase': 'analysis',
                    'attempt': attempt,
                    'status': 'passed' if passed else 'needs_refinement',
                    'success_factor': validation['success_factor']
                })
                
                if passed:
                    print(f"✅ Analysis Phase PASSED on attempt {attempt}")
                    self.phase_results['analysis'] = {
                        'blueprint': blueprint,
                        'validation': validation,
                        'attempt': attempt
                    }
                    return blueprint, True
                
                # If not passed but not last attempt, refine
                if attempt < RETRY_LIMIT:
                    print(f"\n🔧 Refining Analysis (Success Factor: {validation['success_factor']}%)")
                    feedback = {
                        'issues': validation.get('issues', []),
                        'recommendations': validation.get('recommendations', [])
                    }
                    blueprint = self.agent_refiner.refine_analysis_blueprint(
                        blueprint, feedback, attempt + 1
                    )
                    print("Refinement applied. Retrying...\n")
                
            except Exception as e:
                print(f"❌ Error in analysis attempt {attempt}: {str(e)}")
                if attempt == RETRY_LIMIT:
                    raise
        
        print(f"\n⚠️  Analysis Phase did not meet {SUCCESS_FACTOR_THRESHOLD}% threshold after {RETRY_LIMIT} attempts")
        return blueprint, False
    
    # ========================================================================
    # PHASE 2: CONVERSION WITH QUALITY GATES
    # ========================================================================
    
    def execute_conversion_phase(self, blueprint: dict) -> Tuple[dict, bool]:
        """
        Execute conversion phase with quality gating.
        Retries up to RETRY_LIMIT times until success factor >= 85%.
        
        Args:
            blueprint: Validated blueprint from analysis phase
            
        Returns:
            Tuple of (angular_code, phase_passed)
        """
        print("\n" + "="*70)
        print("📋 PHASE 2: CONVERSION PHASE")
        print("="*70 + "\n")
        
        angular_code = None
        
        for attempt in range(1, RETRY_LIMIT + 1):
            print(f"🔄 Attempt {attempt}/{RETRY_LIMIT}")
            print("-" * 50)
            
            try:
                # Execute conversion
                angular_code = self.conversion_agent.convert(blueprint)
                
                # Organize module structure
                angular_code = self.conversion_agent.organize_module_structure(
                    angular_code, 
                    blueprint.get('feature_name', 'MigratedFeature')
                )
                
                # Enforce best practices
                angular_code = self.conversion_agent.enforce_best_practices(angular_code)
                
                # Validate output
                passed, validation = self.quality_validator.validate_conversion(angular_code)
                
                # Log execution
                self.execution_log.append({
                    'phase': 'conversion',
                    'attempt': attempt,
                    'status': 'passed' if passed else 'needs_refinement',
                    'success_factor': validation['success_factor']
                })
                
                if passed:
                    print(f"✅ Conversion Phase PASSED on attempt {attempt}")
                    self.phase_results['conversion'] = {
                        'angular_code': angular_code,
                        'validation': validation,
                        'attempt': attempt
                    }
                    return angular_code, True
                
                # If not passed but not last attempt, refine
                if attempt < RETRY_LIMIT:
                    print(f"\n🔧 Refining Angular Code (Success Factor: {validation['success_factor']}%)")
                    feedback = {
                        'issues': validation.get('issues', []),
                        'recommendations': validation.get('recommendations', [])
                    }
                    angular_code = self.agent_refiner.refine_angular_code(
                        angular_code, feedback, attempt + 1
                    )
                    print("Refinement applied. Retrying...\n")
                
            except Exception as e:
                print(f"❌ Error in conversion attempt {attempt}: {str(e)}")
                if attempt == RETRY_LIMIT:
                    raise
        
        print(f"\n⚠️  Conversion Phase did not meet {SUCCESS_FACTOR_THRESHOLD}% threshold after {RETRY_LIMIT} attempts")
        return angular_code, False
    
    # ========================================================================
    # PHASE 3: STORAGE WITH QUALITY GATES
    # ========================================================================
    
    def execute_storage_phase(self, angular_code: dict) -> Tuple[bool, dict]:
        """
        Execute storage phase with quality validation.
        
        Args:
            angular_code: Generated Angular code
            
        Returns:
            Tuple of (phase_passed, file_manifest)
        """
        print("\n" + "="*70)
        print("📋 PHASE 3: STORAGE PHASE")
        print("="*70 + "\n")
        
        try:
            # Ensure project exists
            self.project_manager.ensure_project_exists()
            
            # Deploy files
            self.storage_agent.deploy(angular_code)
            
            # Create file manifest for validation
            feature_name = angular_code.get('feature_name', 'MigratedFeature')
            file_manifest = {
                'feature_name': feature_name,
                'components': list(angular_code.keys()),
                'file_count': 4,
                'structure': 'features/service/models'
            }
            
            # Validate storage
            passed, validation = self.quality_validator.validate_storage(file_manifest)
            
            # Log execution
            self.execution_log.append({
                'phase': 'storage',
                'attempt': 1,
                'status': 'passed' if passed else 'failed',
                'success_factor': validation['success_factor']
            })
            
            if passed:
                print(f"✅ Storage Phase PASSED")
                self.phase_results['storage'] = {
                    'file_manifest': file_manifest,
                    'validation': validation
                }
            else:
                print(f"⚠️  Storage Phase validation shows issues but files deployed")
            
            return passed, file_manifest
            
        except Exception as e:
            print(f"❌ Error in storage phase: {str(e)}")
            raise
    
    # ========================================================================
    # MAIN ORCHESTRATION & EXECUTION
    # ========================================================================
    
    def run(self) -> None:
        """Execute complete migration pipeline with quality gates."""
        
        if self.is_batch:
            self.run_batch()
        else:
            self.run_single_file()
    
    def run_single_file(self) -> None:
        """Execute migration for a single file with dependency resolution."""
        
        try:
            # Load single file content
            self.extjs_content = self.project_manager.load_file(self.extjs_source)
            self._current_file_path = self.extjs_source
            
            # Check if already processed
            if self.files_tracker.is_processed(self.extjs_source):
                print(f"⏭️  File already processed: {os.path.basename(self.extjs_source)}")
                return
            
            # Resolve dependencies
            dependencies = self.resolve_and_queue_dependencies(self.extjs_source)
            
            # Phase 1: Analysis
            blueprint, analysis_passed = self.execute_analysis_phase()
            
            if not analysis_passed:
                print(f"\n⚠️  Analysis did not meet threshold but proceeding with best effort...")
            
            # Phase 2: Conversion (only if analysis passed)
            if analysis_passed:
                angular_code, conversion_passed = self.execute_conversion_phase(blueprint)
                
                if not conversion_passed:
                    print(f"\n⚠️  Conversion did not meet threshold but proceeding with best effort...")
            else:
                print("\n❌ Skipping conversion due to analysis failure")
                self.files_tracker.mark_failed(self.extjs_source, "Analysis failed threshold")
                return
            
            # Phase 3: Storage (only if conversion passed)
            if conversion_passed:
                storage_passed, manifest = self.execute_storage_phase(angular_code)
                
                # Mark as processed
                self.mark_file_processed(
                    self.extjs_source,
                    status='success',
                    result={'manifest': manifest},
                    dependencies=dependencies
                )
            else:
                print("\n❌ Skipping storage due to conversion failure")
                self.files_tracker.mark_failed(self.extjs_source, "Conversion failed threshold")
                return
            
            # Summary Report
            self._print_summary_report()
            
            # Save progress
            self.files_tracker.save_to_file()
            self.files_tracker.print_summary()
            
        except Exception as e:
            print(f"\n❌ Pipeline failed with error: {str(e)}")
            self.files_tracker.mark_failed(self.extjs_source, str(e))
            self._print_summary_report()
            raise
    
    def run_batch(self) -> None:
        """Execute migration for all files in a directory with dependency resolution and tracking."""
        
        print("\n" + "="*70)
        print("🔄 BATCH PROCESSING - RECURSIVE FILE CONVERSION WITH DEPENDENCIES")
        print("="*70 + "\n")
        
        if not self.extjs_files:
            print("❌ No ExtJS files found to process")
            return
        
        total_files = len(self.extjs_files)
        processed_count = 0
        
        # Add initial files to queue
        self.files_tracker.add_to_queue(self.extjs_files)
        
        # Process files from queue (including dependencies)
        while True:
            file_path = self.files_tracker.dequeue_file()
            if not file_path:
                break
            
            # Skip already processed files
            if self.files_tracker.is_processed(file_path):
                print(f"⏭️  Already processed: {os.path.basename(file_path)}")
                continue
            
            processed_count += 1
            print(f"\n📄 Processing file {processed_count}/{total_files}: {os.path.basename(file_path)}")
            print("-" * 70)
            
            try:
                # Load file content
                self.extjs_content = self.project_manager.load_file(file_path)
                self._current_file_path = file_path
                
                # Resolve dependencies
                new_deps = self.resolve_and_queue_dependencies(file_path)
                total_files += len(new_deps)  # Update count for newly discovered dependencies
                
                # Process through phases
                blueprint, analysis_passed = self.execute_analysis_phase()
                
                if not analysis_passed:
                    print(f"⚠️  Analysis did not meet threshold but continuing...")
                
                if analysis_passed:
                    angular_code, conversion_passed = self.execute_conversion_phase(blueprint)
                    
                    if not conversion_passed:
                        print(f"⚠️  Conversion did not meet threshold but continuing...")
                    else:
                        # Storage phase
                        storage_passed, manifest = self.execute_storage_phase(angular_code)
                        
                        # Mark as processed
                        self.mark_file_processed(
                            file_path,
                            status='success',
                            result={'manifest': manifest},
                            dependencies=new_deps
                        )
                        print(f"✅ File processed successfully")
                        self.batch_results[file_path] = {
                            'status': 'success',
                            'blueprint': blueprint,
                            'angular_code': angular_code,
                            'manifest': manifest,
                            'dependencies': new_deps
                        }
                else:
                    print(f"⚠️  File skipped due to analysis failure")
                    self.files_tracker.mark_failed(file_path, 'analysis_failed')
                    self.batch_results[file_path] = {'status': 'failed', 'reason': 'analysis_failed'}
                
            except Exception as e:
                print(f"❌ Error processing file: {str(e)}")
                self.files_tracker.mark_failed(file_path, str(e))
                self.batch_results[file_path] = {'status': 'error', 'error': str(e)}
        
        # Batch Summary
        self._print_batch_summary_report(processed_count, 
                                        self.files_tracker.get_processed_count(),
                                        self.files_tracker.get_failed_count())
        
        # Save tracker
        self.files_tracker.save_to_file()
        self.files_tracker.print_summary()
    
    def _print_summary_report(self) -> None:
        """Print comprehensive migration summary."""
        
        print("\n" + "="*70)
        print("📊 MIGRATION EXECUTION SUMMARY")
        print("="*70 + "\n")
        
        validation_report = self.quality_validator.get_validation_report()
        
        print(f"Total Validations: {validation_report['total_validations']}")
        print(f"Phases Passed (85%+): {validation_report['passed_phases']}")
        print(f"Phases Requiring Refinement: {validation_report['failed_phases']}")
        print(f"Average Success Factor: {validation_report['average_success_factor']}%\n")
        
        print("Phase Details:")
        print("-" * 50)
        for phase_result in self.phase_results.values():
            if 'validation' in phase_result:
                val = phase_result['validation']
                sf = val.get('success_factor', 0)
                status = "✅ PASSED" if val.get('passed_threshold') else "⚠️  NEEDS REVIEW"
                print(f"  {status} - Success Factor: {sf}%")
        
        print("\n" + "="*70)
        print("📦 Next Steps:")
        print("  1. Review validation report above")
        print("  2. Run: npm install ag-grid-angular")
        print("  3. Import the migrated component in your app")
        print("="*70 + "\n")
    
    
    def _print_batch_summary_report(self, total: int, successful: int, failed: int) -> None:
        """Print comprehensive batch migration summary."""
        
        print("\n" + "="*70)
        print("📊 BATCH MIGRATION EXECUTION SUMMARY")
        print("="*70 + "\n")
        
        # Use tracker statistics
        stats = self.files_tracker.get_statistics()
        successful = stats['total_processed']
        failed = stats['total_failed']
        skipped = stats['total_skipped']
        
        print(f"Total Files Processed: {total}")
        print(f"✅ Successfully Converted: {successful}")
        print(f"❌ Failed to Convert: {failed}")
        print(f"⏭️  Skipped: {skipped}")
        print(f"🔗 Dependencies Resolved: {stats['total_dependencies_resolved']}")
        
        if total > 0:
            print(f"Success Rate: {stats['success_rate']:.1f}%\n")
        
        print("File Results:")
        print("-" * 50)
        for file_path, result in self.batch_results.items():
            file_name = os.path.basename(file_path)
            status = result.get('status', 'unknown')
            
            if status == 'success':
                print(f"  ✅ {file_name}")
            elif status == 'failed':
                reason = result.get('reason', 'unknown')
                print(f"  ❌ {file_name} (Reason: {reason})")
            else:
                error = result.get('error', 'unknown')
                print(f"  ⚠️  {file_name} (Error: {error})")
        
        print("\n" + "="*70)
        print("📦 Next Steps:")
        print("  1. Review batch conversion results above")
        print("  2. Run: npm install ag-grid-angular")
        print("  3. Import migrated components in your app")
        print("="*70 + "\n")
    
    def get_execution_report(self) -> dict:
        """Get complete execution report."""
        return {
            'execution_log': self.execution_log,
            'validation_report': self.quality_validator.get_validation_report(),
            'phase_results': self.phase_results
        }
