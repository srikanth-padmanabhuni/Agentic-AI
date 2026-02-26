"""
Crew AI Orchestrator - Master Agent coordinating all agents with quality assurance
Uses a quality-gated pipeline where each phase must achieve 85%+ success factor
"""
import json
import os
from typing import Tuple, List, Dict
from agents import AnalysisAgent, ConversionAgent, StorageAgent
from infrastructure import ProjectManager
from .quality_validator import QualityValidator
from .agent_refiner import AgentRefiner
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
        
        # Determine if processing single file or directory
        self.is_batch = os.path.isdir(self.extjs_source)
        
        if self.is_batch:
            print(f"📂 Batch mode: Processing all files in {self.extjs_source}")
            self.extjs_files = self.project_manager.find_extjs_files(self.extjs_source)
            if not self.extjs_files:
                print("⚠️  No .js files found in the directory")
            else:
                print(f"📋 Found {len(self.extjs_files)} ExtJS files to process")
        else:
            print(f"📄 Single file mode: Processing {self.extjs_source}")
            self.extjs_files = [self.extjs_source]
        
        # Initialize Agents (Tools for Master Agent)
        self.analysis_agent = AnalysisAgent()
        self.conversion_agent = ConversionAgent()
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
        """Execute migration for a single file."""
        
        try:
            # Load single file content
            self.extjs_content = self.project_manager.load_file(self.extjs_source)
            
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
                return
            
            # Phase 3: Storage (only if conversion passed)
            if conversion_passed:
                storage_passed, manifest = self.execute_storage_phase(angular_code)
            else:
                print("\n❌ Skipping storage due to conversion failure")
                return
            
            # Summary Report
            self._print_summary_report()
            
        except Exception as e:
            print(f"\n❌ Pipeline failed with error: {str(e)}")
            self._print_summary_report()
            raise
    
    def run_batch(self) -> None:
        """Execute migration for all files in a directory (recursive)."""
        
        print("\n" + "="*70)
        print("🔄 BATCH PROCESSING - RECURSIVE FILE CONVERSION")
        print("="*70 + "\n")
        
        if not self.extjs_files:
            print("❌ No ExtJS files found to process")
            return
        
        total_files = len(self.extjs_files)
        successful = 0
        failed = 0
        
        for idx, file_path in enumerate(self.extjs_files, 1):
            print(f"\n📄 Processing file {idx}/{total_files}: {os.path.basename(file_path)}")
            print("-" * 70)
            
            try:
                # Load file content
                self.extjs_content = self.project_manager.load_file(file_path)
                
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
                        print(f"✅ File processed successfully")
                        successful += 1
                        
                        # Store results
                        self.batch_results[file_path] = {
                            'status': 'success',
                            'blueprint': blueprint,
                            'angular_code': angular_code,
                            'manifest': manifest
                        }
                else:
                    print(f"⚠️  File skipped due to analysis failure")
                    failed += 1
                    self.batch_results[file_path] = {'status': 'failed', 'reason': 'analysis_failed'}
                
            except Exception as e:
                print(f"❌ Error processing file: {str(e)}")
                failed += 1
                self.batch_results[file_path] = {'status': 'error', 'error': str(e)}
        
        # Batch Summary
        self._print_batch_summary_report(total_files, successful, failed)
    
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
        
        print(f"Total Files Processed: {total}")
        print(f"✅ Successfully Converted: {successful}")
        print(f"❌ Failed to Convert: {failed}")
        print(f"Success Rate: {(successful/total*100):.1f}%\n")
        
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
