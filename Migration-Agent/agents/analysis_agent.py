"""
Analysis Agent - Extracts and validates ExtJS component structure with dependency analysis
Identifies dependencies and validates blueprint completeness following best practices
"""
import json
from core.gemini_client import GeminiClient
from core.dependency_analyzer import DependencyAnalyzer
from config import ANALYSIS_EXTRACT_BLUEPRINT, ANALYSIS_VALIDATE_BLUEPRINT


class AnalysisAgent:
    """Analyzes ExtJS code and creates a validated blueprint with dependency tracking."""
    
    def __init__(self, base_dir: str = None):
        self.gemini = GeminiClient()
        self.dependency_analyzer = DependencyAnalyzer(base_dir) if base_dir else None
    
    def extract_blueprint(self, extjs_content: str) -> dict:
        """
        Extract Model, Store, and Grid Columns from ExtJS code.
        
        Args:
            extjs_content: Raw ExtJS source code
            
        Returns:
            Blueprint dictionary with extracted structure
        """
        print("🔍 Analysis Agent: Extracting ExtJS structure...")
        
        return self.gemini.generate_json_response(ANALYSIS_EXTRACT_BLUEPRINT, extjs_content)
    
    def validate_blueprint(self, blueprint: dict) -> dict:
        """
        Validate and enrich blueprint with captured logic.
        
        Args:
            blueprint: Initial blueprint from extraction
            
        Returns:
            Validated and enriched blueprint
        """
        print("✅ Analysis Agent: Validating blueprint...")
        
        return self.gemini.generate_json_response(ANALYSIS_VALIDATE_BLUEPRINT, json.dumps(blueprint))
    
    def analyze(self, extjs_content: str) -> dict:
        """
        Complete analysis workflow: extract and validate.
        
        Args:
            extjs_content: Raw ExtJS source code
            
        Returns:
            Final validated blueprint
        """
        blueprint = self.extract_blueprint(extjs_content)
        return self.validate_blueprint(blueprint)
    
    def extract_dependencies(self, file_path: str, extjs_content: str = None) -> dict:
        """
        Extract dependencies from an ExtJS file.
        
        Args:
            file_path: Path to the ExtJS file
            extjs_content: Optional file content (if content already loaded)
            
        Returns:
            Dictionary with dependency information
        """
        if not self.dependency_analyzer:
            return {'dependencies': [], 'dependency_count': 0}
        
        print(f"🔍 Analysis Agent: Analyzing dependencies for {file_path}...")
        
        # Build dependency graph
        graph = self.dependency_analyzer.build_dependency_graph(file_path)
        all_deps = self.dependency_analyzer.get_all_dependencies_flat(file_path)
        circular_deps = self.dependency_analyzer.detect_circular_dependencies(file_path)
        stats = self.dependency_analyzer.get_dependency_statistics(file_path)
        
        return {
            'file_path': file_path,
            'direct_dependencies': graph.get('direct_dependencies', []),
            'all_dependencies': all_deps,
            'dependency_graph': graph,
            'dependency_count': len(all_deps),
            'has_circular_dependencies': len(circular_deps) > 0,
            'circular_dependencies': circular_deps,
            'depth': stats.get('max_depth', 0),
            'statistics': stats
        }
    
    def validate_dependencies(self, dependency_info: dict) -> dict:
        """
        Validate dependencies for best practices and issues.
        
        Args:
            dependency_info: Dependency information from extract_dependencies
            
        Returns:
            Validation result with issues and recommendations
        """
        print("✅ Analysis Agent: Validating dependencies...")
        
        issues = []
        recommendations = []
        
        # Check for circular dependencies
        if dependency_info.get('has_circular_dependencies'):
            issues.append("Circular dependencies detected - may cause module loading issues")
            recommendations.append("Refactor to break circular dependencies")
        
        # Check dependency depth
        if dependency_info.get('depth', 0) > 5:
            issues.append(f"High dependency depth ({dependency_info['depth']}) may indicate tight coupling")
            recommendations.append("Consider refactoring to reduce dependency coupling")
        
        # Check dependency count
        if dependency_info.get('dependency_count', 0) > 20:
            issues.append(f"High number of dependencies ({dependency_info['dependency_count']}) indicates complexity")
            recommendations.append("Group related dependencies into shared module")
        
        return {
            'dependency_file': dependency_info.get('file_path'),
            'validation_passed': len(issues) == 0,
            'issues': issues,
            'recommendations': recommendations,
            'validation_score': self._calculate_validation_score(len(issues), dependency_info.get('dependency_count', 0))
        }
    
    def _calculate_validation_score(self, issue_count: int, dep_count: int) -> float:
        """Calculate dependency validation score (0-100)."""
        base_score = 100.0
        
        # Deduct for issues
        base_score -= (issue_count * 10)
        
        # Deduct based on complexity
        if dep_count > 50:
            base_score -= 20
        elif dep_count > 20:
            base_score -= 10
        elif dep_count > 10:
            base_score -= 5
        
        return max(0, base_score)
