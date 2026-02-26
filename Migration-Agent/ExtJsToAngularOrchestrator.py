"""
ExtJS to Angular Migration Orchestrator - Entry Point
Main entry point for the migration tool with quality-gated pipeline
Supports both single file and recursive (batch) conversion
"""
import os
from core import CrewOrchestrator


class ExtJsToAngularOrchestrator:
    """
    Main orchestrator that delegates to Crew AI orchestrator.
    Supports single file or recursive directory processing.
    """
    
    def __init__(self, extjs_source: str, angular_project_root: str):
        """
        Initialize the orchestrator.
        
        Args:
            extjs_source: Path to ExtJS component file OR directory (recursive)
            angular_project_root: Root directory of the Angular project
        """
        self.crew_orchestrator = CrewOrchestrator(extjs_source, angular_project_root)
    
    def run(self) -> None:
        """Execute complete migration workflow with quality gates."""
        self.crew_orchestrator.run()
    
    def get_results(self) -> dict:
        """Get batch results (for batch processing)."""
        if self.crew_orchestrator.is_batch:
            return self.crew_orchestrator.batch_results
        else:
            return self.crew_orchestrator.phase_results


def main():
    """Entry point for the migration tool."""
    # Single file example:  
    # migrator = ExtJsToAngularOrchestrator(
    #     extjs_source="C:/dev/gitlab-repo/mfcui/WebContent/app/view/connect/users/UserGrid.js",
    #     angular_project_root="C:/dev/gitlab-repo/migrated-angular-app"
    # )
    
    # Batch/Recursive directory example:
    migrator = ExtJsToAngularOrchestrator(
        extjs_source="C:/dev/gitlab-repo/mfcui/WebContent/app/view/connect/users",  # Directory - will process all .js files
        angular_project_root="C:/dev/gitlab-repo/migrated-angular-app-with folders"
    )
    migrator.run()


if __name__ == "__main__":
    main()