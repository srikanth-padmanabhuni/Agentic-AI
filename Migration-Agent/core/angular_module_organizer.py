"""
Angular Module Organizer - Organizes migrated components into proper Angular module structure
Creates feature modules, shared module, and core module following Angular best practices
"""
import os
import re
from typing import Dict, List, Set


class AngularModuleOrganizer:
    """
    Organizes Angular components into proper module structure with:
    - Feature modules for business domains (users, ext-connections, etc.)
    - Shared module for common utilities, interfaces, enums, DTOs, services
    - Core module for singleton services
    """
    
    # Module categories based on component types
    MODULE_CATEGORIES = {
        'users': ['user', 'account', 'profile', 'login', 'auth'],
        'ext-connections': ['connection', 'external', 'integration', 'adapter', 'connector'],
        'user-maps': ['map', 'mapping', 'geographic', 'location', 'route'],
        'products': ['product', 'catalog', 'inventory', 'sku'],
        'orders': ['order', 'transaction', 'purchase', 'checkout'],
        'reports': ['report', 'dashboard', 'analytics', 'metrics'],
        'settings': ['configuration', 'setup', 'preferences', 'config'],
        'common': ['shared', 'utility', 'helper', 'widget'],  # Fallback category
    }
    
    SHARED_UTILITIES = {
        'interfaces': ['*.interface.ts', '*.model.ts'],
        'enums': ['*.enum.ts'],
        'constants': ['*.constants.ts', '*.const.ts'],
        'dtos': ['*.dto.ts'],
        'daos': ['*.dao.ts'],
        'services': ['*.service.ts'],  # Shared services only
        'utils': ['*.utils.ts', '*.utility.ts', '*.helper.ts'],
        'pipes': ['*.pipe.ts'],
        'directives': ['*.directive.ts'],
        'guards': ['*.guard.ts'],
        'interceptors': ['*.interceptor.ts'],
    }
    
    def __init__(self, angular_root: str):
        """
        Initialize module organizer.
        
        Args:
            angular_root: Root directory of the Angular project
        """
        self.angular_root = os.path.abspath(angular_root)
        self.src_app = os.path.join(self.angular_root, 'src', 'app')
    
    def categorize_component(self, component_name: str, file_context: str = '') -> str:
        """
        Determine which module a component belongs to.
        
        Args:
            component_name: Name of the component
            file_context: File content or additional context for classification
            
        Returns:
            Module category name
        """
        component_lower = component_name.lower()
        context_lower = file_context.lower()
        
        # First check component name against categories
        for module, keywords in self.MODULE_CATEGORIES.items():
            if module != 'common':  # Skip common for now
                for keyword in keywords:
                    if keyword in component_lower:
                        return module
        
        # If no match, check file context
        for module, keywords in self.MODULE_CATEGORIES.items():
            if module != 'common':
                for keyword in keywords:
                    if keyword in context_lower:
                        return module
        
        # Default to common
        return 'common'
    
    def is_shared_utility(self, file_name: str) -> bool:
        """
        Determine if a file is a shared utility (not feature-specific).
        
        Args:
            file_name: Name of the file
            
        Returns:
            True if file should go to shared module
        """
        file_lower = file_name.lower()
        
        for category, patterns in self.SHARED_UTILITIES.items():
            for pattern in patterns:
                # Simple wildcard matching
                if pattern.startswith('*') and file_lower.endswith(pattern[1:]):
                    return True
                elif '*' not in pattern and file_lower.endswith(pattern):
                    return True
        
        return False
    
    def get_module_path(self, module_name: str, file_type: str = 'components') -> str:
        """
        Get the file path for a module file.
        
        Args:
            module_name: Name of the module ('users', 'products', etc.)
            file_type: Type of files (components, services, models)
            
        Returns:
            Absolute path to module directory
        """
        if module_name == 'shared':
            module_path = os.path.join(self.src_app, 'shared', file_type)
        elif module_name == 'core':
            module_path = os.path.join(self.src_app, 'core', file_type)
        else:
            # Feature modules
            module_path = os.path.join(self.src_app, 'modules', module_name, file_type)
        
        return module_path
    
    def generate_module_structure(self, module_name: str) -> Dict[str, str]:
        """
        Generate directory structure for a feature module.
        
        Args:
            module_name: Name of the module
            
        Returns:
            Dictionary with directory paths
        """
        if module_name == 'shared':
            return {
                'interfaces': self.get_module_path('shared', 'interfaces'),
                'enums': self.get_module_path('shared', 'enums'),
                'constants': self.get_module_path('shared', 'constants'),
                'dtos': self.get_module_path('shared', 'dtos'),
                'daos': self.get_module_path('shared', 'daos'),
                'services': self.get_module_path('shared', 'services'),
                'utils': self.get_module_path('shared', 'utils'),
                'pipes': self.get_module_path('shared', 'pipes'),
                'directives': self.get_module_path('shared', 'directives'),
                'guards': self.get_module_path('shared', 'guards'),
                'interceptors': self.get_module_path('shared', 'interceptors'),
            }
        
        elif module_name == 'core':
            return {
                'services': self.get_module_path('core', 'services'),
                'guards': self.get_module_path('core', 'guards'),
                'interceptors': self.get_module_path('core', 'interceptors'),
            }
        
        else:
            # Feature module
            base_path = os.path.join(self.src_app, 'modules', module_name)
            return {
                'components': os.path.join(base_path, 'components'),
                'services': os.path.join(base_path, 'services'),
                'models': os.path.join(base_path, 'models'),
                'interfaces': os.path.join(base_path, 'models', 'interfaces'),
                'enums': os.path.join(base_path, 'models', 'enums'),
                'pages': os.path.join(base_path, 'pages'),
            }
    
    def create_module_directories(self, module_name: str) -> Dict[str, str]:
        """
        Create all necessary directories for a module.
        
        Args:
            module_name: Name of the module
            
        Returns:
            Dictionary with created directory paths
        """
        structure = self.generate_module_structure(module_name)
        created_paths = {}
        
        for category, path in structure.items():
            os.makedirs(path, exist_ok=True)
            created_paths[category] = path
        
        return created_paths
    
    def generate_feature_module_template(self, module_name: str) -> str:
        """
        Generate TypeScript template for feature module.
        
        Args:
            module_name: Name of the feature module
            
        Returns:
            TypeScript module class code
        """
        module_class_name = self._to_pascal_case(module_name)
        
        return f"""/**
 * {module_class_name} Feature Module
 * Organized feature module following Angular best practices
 */
import {{ NgModule }} from '@angular/core';
import {{ CommonModule }} from '@angular/common';
import {{ SharedModule }} from '@shared/shared.module';

// Components
import {{ {module_class_name}Component }} from './components/{module_name}.component';

// Services
// import {{ {module_class_name}Service }} from './services/{module_name}.service';

// Routing
import {{ {module_class_name}RoutingModule }} from './{module_name}-routing.module';

@NgModule({{
  declarations: [
    {module_class_name}Component,
    // Add other components here
  ],
  imports: [
    CommonModule,
    SharedModule,
    {module_class_name}RoutingModule,
  ],
  providers: [
    // Add services here
    // {module_class_name}Service,
  ],
  exports: [
    {module_class_name}Component,
  ],
}})
export class {module_class_name}Module {{ }}
"""
    
    def generate_shared_module_template(self) -> str:
        """
        Generate TypeScript template for shared module.
        
        Returns:
            TypeScript shared module code
        """
        return """/**
 * Shared Module
 * Contains common utilities, components, and services used across the application
 * Includes: interfaces, enums, DTOs, DAOs, pipes, directives, guards, interceptors
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Shared components
// import { SharedComponent } from './components/shared.component';

// Shared pipes
// import { CustomPipe } from './pipes/custom.pipe';

// Shared directives
// import { CustomDirective } from './directives/custom.directive';

@NgModule({
  declarations: [
    // SharedComponent,
    // CustomPipe,
    // CustomDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    // SharedComponent,
    // CustomPipe,
    // CustomDirective,
  ],
})
export class SharedModule { }
"""
    
    def recommend_import_path(self, component_name: str, is_shared: bool = False) -> str:
        """
        Recommend import path for a component.
        
        Args:
            component_name: Name of the component
            is_shared: Whether it's a shared utility
            
        Returns:
            Recommended import path
        """
        component_snake = self._to_kebab_case(component_name)
        
        if is_shared:
            # Shared utilities should use @shared alias
            return f"@shared/{{category}}/{component_snake}/{{component_snake}}"
        else:
            # Feature components use relative paths
            return f"./{component_snake}/{component_snake}.component"
    
    def get_module_dependencies(self, module_name: str) -> List[str]:
        """
        Get list of dependencies a feature module should declare.
        
        Args:
            module_name: Name of the feature module
            
        Returns:
            List of recommended module imports
        """
        base_deps = ['CommonModule', 'SharedModule']
        
        # Add context-specific dependencies
        if module_name in ['users', 'auth']:
            base_deps.extend(['ReactiveFormsModule', 'HttpClientModule'])
        elif module_name == 'reports':
            base_deps.extend(['ChartsModule', 'NgxDatatableModule'])
        elif module_name == 'user-maps':
            base_deps.extend(['MapModule', 'GeoLocationModule'])
        
        return base_deps
    
    def detect_circular_imports(self, module_name: str, imports: List[str]) -> List[str]:
        """
        Detect potential circular import dependencies.
        
        Args:
            module_name: Name of the module
            imports: List of modules/services it imports
            
        Returns:
            List of circular dependency warnings
        """
        warnings = []
        
        # Check for common circular patterns
        if 'SharedModule' in imports and module_name == 'shared':
            warnings.append(f"Module '{module_name}' should not import SharedModule (circular)")
        
        # Check for cross-feature imports that might be circular
        for imp in imports:
            if 'modules/' in imp and module_name != 'shared' and module_name != 'core':
                # Feature modules should avoid importing other feature modules
                if module_name not in imp:
                    warnings.append(
                        f"Feature module '{module_name}' imports another feature. "
                        f"Consider moving shared code to SharedModule."
                    )
        
        return warnings
    
    def validate_module_structure(self, module_name: str) -> Dict[str, List[str]]:
        """
        Validate that a module has proper structure.
        
        Args:
            module_name: Name of the module to validate
            
        Returns:
            Dictionary with issues and recommendations
        """
        structure = self.generate_module_structure(module_name)
        issues = []
        recommendations = []
        
        # Check if directories exist
        created = self.create_module_directories(module_name)
        
        # Check if module file exists
        if module_name != 'shared' and module_name != 'core':
            module_file = os.path.join(
                self.src_app, 'modules', module_name,
                f"{self._to_kebab_case(module_name)}.module.ts"
            )
            if not os.path.exists(module_file):
                issues.append(f"Module file not found: {module_file}")
                recommendations.append(f"Create {self._to_kebab_case(module_name)}.module.ts")
        
        return {
            'issues': issues,
            'recommendations': recommendations,
            'structure_valid': len(issues) == 0
        }
    
    def organize_component_file(self, component_name: str, file_content: str, 
                               module_category: str = None) -> Dict[str, str]:
        """
        Determine where a component file should be placed.
        
        Args:
            component_name: Name of the component
            file_content: Content of the component file
            module_category: Optional pre-determined category
            
        Returns:
            Dictionary with placement recommendations
        """
        # Determine category if not provided
        if not module_category:
            module_category = self.categorize_component(component_name, file_content)
        
        # Check if it's a shared utility
        if self.is_shared_utility(component_name):
            module_category = 'shared'
        
        # Determine specific file type within module
        file_type = self._determine_file_type(component_name, file_content)
        
        # Get target path
        target_path = self.get_module_path(module_category, file_type)
        
        return {
            'component_name': component_name,
            'module_category': module_category,
            'file_type': file_type,
            'target_path': target_path,
            'recommended_filename': f"{self._to_kebab_case(component_name)}.{file_type}.ts"
        }
    
    def _determine_file_type(self, component_name: str, content: str) -> str:
        """Determine file type based on name and content."""
        name_lower = component_name.lower()
        content_lower = content.lower()
        
        if 'interface' in name_lower or 'export interface' in content_lower:
            return 'interfaces'
        elif 'enum' in name_lower or 'enum ' in content_lower:
            return 'enums'
        elif 'dto' in name_lower or 'data transfer object' in content_lower:
            return 'dtos'
        elif 'dao' in name_lower or 'data access' in content_lower:
            return 'daos'
        elif 'service' in name_lower or '@Injectable' in content:
            return 'services'
        elif 'pipe' in name_lower or '@Pipe' in content:
            return 'pipes'
        elif 'directive' in name_lower or '@Directive' in content:
            return 'directives'
        elif 'guard' in name_lower or 'CanActivate' in content:
            return 'guards'
        elif 'interceptor' in name_lower or 'HttpInterceptor' in content:
            return 'interceptors'
        elif 'component' in name_lower or '@Component' in content:
            return 'components'
        else:
            return 'utils'
    
    def _to_pascal_case(self, text: str) -> str:
        """Convert text to PascalCase."""
        return ''.join(word.capitalize() for word in re.split(r'[-_]', text))
    
    def _to_kebab_case(self, text: str) -> str:
        """Convert text to kebab-case."""
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1-\2', text)
        return re.sub('([a-z0-9])([A-Z])', r'\1-\2', s1).lower()
