"""
Conversion Agent - Converts blueprint to Angular 21 code with proper module structure
Ensures modular architecture, best practices, and strict typing
"""
import json
from core.gemini_client import GeminiClient
from core.angular_module_organizer import AngularModuleOrganizer
from config import get_conversion_angular_prompt, CONVERSION_REFINE_ARCHITECTURE, ANGULAR_VERSION, UI_FRAMEWORK


class ConversionAgent:
    """Converts ExtJS blueprint to Angular 21 with best practices and module structure."""
    
    def __init__(self, angular_root: str = None):
        self.gemini = GeminiClient()
        self.module_organizer = AngularModuleOrganizer(angular_root) if angular_root else None
    
    def convert_to_angular(self, blueprint: dict) -> dict:
        """
        Convert blueprint to Angular 21 code structure.
        
        Args:
            blueprint: Validated blueprint from analysis phase
            
        Returns:
            Angular code dictionary with ts, html, service, and interface
        """
        print(f"🏗️ Conversion Agent: Converting to Angular code...")
        
        converter_instr = get_conversion_angular_prompt(ANGULAR_VERSION, UI_FRAMEWORK)
        
        return self.gemini.generate_json_response(converter_instr, json.dumps(blueprint))
    
    def refine_architecture(self, angular_code: dict) -> dict:
        """
        Review and refine Angular code for production standards.
        
        Args:
            angular_code: Generated Angular code structure
            
        Returns:
            Refined Angular code with best practices applied
        """
        print("🏗️ Conversion Agent: Applying production standards...")
        
        return self.gemini.generate_json_response(CONVERSION_REFINE_ARCHITECTURE, json.dumps(angular_code))
    
    def convert(self, blueprint: dict) -> dict:
        """
        Complete conversion workflow: convert and refine.
        
        Args:
            blueprint: Validated blueprint from analysis phase
            
        Returns:
            Final production-ready Angular code
        """
        angular_code = self.convert_to_angular(blueprint)
        return self.refine_architecture(angular_code)
    
    def organize_module_structure(self, angular_code: dict, component_name: str = None) -> dict:
        """
        Organize generated Angular code into proper module structure.
        
        Args:
            angular_code: Generated Angular code
            component_name: Name of the component
            
        Returns:
            Organized code with module placement information
        """
        if not self.module_organizer:
            return angular_code
        
        print("📦 Conversion Agent: Organizing module structure...")
        
        component_name = component_name or angular_code.get('feature_name', 'MigratedFeature')
        
        # Get module organization
        organization = self.module_organizer.organize_component_file(
            component_name,
            angular_code.get('component_ts', ''),
            module_category=self._detect_module_category(component_name)
        )
        
        # Enhance code with module information
        angular_code['module_organization'] = organization
        angular_code['module_category'] = organization['module_category']
        angular_code['target_module_path'] = organization['target_path']
        
        # Add module dependencies
        module_deps = self.module_organizer.get_module_dependencies(organization['module_category'])
        angular_code['module_dependencies'] = module_deps
        
        # Check for circular imports
        circular_warnings = self.module_organizer.detect_circular_imports(
            organization['module_category'],
            module_deps
        )
        if circular_warnings:
            angular_code['circular_import_warnings'] = circular_warnings
        
        return angular_code
    
    def enforce_best_practices(self, angular_code: dict) -> dict:
        """
        Enforce Angular best practices in the generated code.
        
        Args:
            angular_code: Generated Angular code
            
        Returns:
            Code with best practices enforced
        """
        print("✅ Conversion Agent: Enforcing best practices...")
        
        issues = []
        enhancements = []
        
        # Check for strict typing
        component_ts = angular_code.get('component_ts', '')
        if ': any' in component_ts:
            issues.append("Avoid using 'any' type - use strict typing")
            enhancements.append("Replace 'any' with specific types")
        
        # Check for error handling
        if 'catch' not in component_ts and 'try' not in component_ts:
            issues.append("Missing error handling in async operations")
            enhancements.append("Add try-catch blocks for error handling")
        
        # Check for unsubscribe patterns
        if 'subscribe' in component_ts and 'unsubscribe' not in component_ts:
            issues.append("Potential memory leak - subscriptions not unsubscribed")
            enhancements.append("Add proper subscription cleanup (OnDestroy)")
        
        # Check for proper dependency injection
        if '@Injectable' not in angular_code.get('service', ''):
            if 'Service' in angular_code.get('feature_name', ''):
                issues.append("Service missing @Injectable decorator")
                enhancements.append("Add @Injectable({ providedIn: 'root' })")
        
        # Check for change detection strategy
        if 'ChangeDetectionStrategy' not in component_ts and '@Component' in component_ts:
            issues.append("Consider using OnPush change detection strategy")
            enhancements.append("Add ChangeDetectionStrategy.OnPush to component")
        
        angular_code['best_practices'] = {
            'issues': issues,
            'enhancements': enhancements,
            'compliance_score': self._calculate_best_practices_score(len(issues))
        }
        
        return angular_code
    
    def _detect_module_category(self, component_name: str) -> str:
        """Detect which module category a component belongs to."""
        if self.module_organizer:
            return self.module_organizer.categorize_component(component_name)
        return 'common'
    
    def _calculate_best_practices_score(self, issue_count: int) -> float:
        """Calculate best practices compliance score (0-100)."""
        base_score = 100.0
        base_score -= (issue_count * 15)
        return max(0, base_score)
