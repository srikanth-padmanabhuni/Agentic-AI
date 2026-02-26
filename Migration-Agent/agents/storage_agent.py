"""
Storage Agent - Deploys generated Angular files to project with proper module organization
Handles modular deployment following Angular best practices and conventions
"""
import os
import re


class StorageAgent:
    """Handles file creation and deployment to Angular project structure with module organization."""
    
    def __init__(self, root_dir: str):
        """
        Initialize storage agent.
        
        Args:
            root_dir: Root directory of the Angular project
        """
        self.root_dir = os.path.abspath(root_dir)
    
    def deploy(self, ng_code: dict) -> None:
        """
        Deploy generated Angular code to project structure with module organization.
        
        Args:
            ng_code: Dictionary with generated Angular code
        """
        print("🚀 Storage Agent: Deploying files with module organization...")
        
        # Use module organization if available
        module_info = ng_code.get('module_organization', {})
        module_category = module_info.get('module_category') or ng_code.get('module_category', 'common')
        target_path = module_info.get('target_path')
        
        # Use feature name
        feature_name = ng_code.get('feature_name', 'MigratedFeature')
        feature_slug = self._sanitize_feature_name(feature_name)
        
        # If target path is specified, use modular deployment
        if target_path:
            self._deploy_modular(target_path, feature_slug, ng_code)
        else:
            # Fallback to legacy deployment
            self._deploy_legacy(feature_slug, ng_code)
        
        print(f"\n✨ Deployment Complete! Feature deployed to module: {module_category}")
    
    def _deploy_modular(self, target_path: str, feature_slug: str, ng_code: dict) -> None:
        """
        Deploy files using modular structure.
        
        Args:
            target_path: Target directory path for components
            feature_slug: Kebab-case feature name
            ng_code: Generated code dictionary
        """
        os.makedirs(target_path, exist_ok=True)
        
        files = {
            os.path.join(target_path, f"{feature_slug}.component.ts"): ng_code.get('component_ts', ''),
            os.path.join(target_path, f"{feature_slug}.component.html"): ng_code.get('component_html', ''),
        }
        
        # Deploy component files
        for file_path, content in files.items():
            if content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  ✓ Created: {file_path}")
        
        # Deploy service to services folder
        service_content = ng_code.get('service')
        if service_content:
            service_path = os.path.join(os.path.dirname(target_path), 'services', f"{feature_slug}.service.ts")
            os.makedirs(os.path.dirname(service_path), exist_ok=True)
            with open(service_path, 'w', encoding='utf-8') as f:
                f.write(service_content)
            print(f"  ✓ Created: {service_path}")
        
        # Deploy interfaces/models to models folder
        interface_content = ng_code.get('interface')
        if interface_content:
            model_path = os.path.join(os.path.dirname(target_path), 'models', f"{feature_slug}.model.ts")
            os.makedirs(os.path.dirname(model_path), exist_ok=True)
            with open(model_path, 'w', encoding='utf-8') as f:
                f.write(interface_content)
            print(f"  ✓ Created: {model_path}")
    
    def _deploy_legacy(self, feature_slug: str, ng_code: dict) -> None:
        """
        Deploy files using legacy flat structure (fallback).
        
        Args:
            feature_slug: Kebab-case feature name
            ng_code: Generated code dictionary
        """
        base_app = os.path.join(self.root_dir, "src", "app")
        
        paths = {
            "comp": os.path.join(base_app, "features", feature_slug),
            "serv": os.path.join(base_app, "services"),
            "model": os.path.join(base_app, "models")
        }
        
        # Create all directories
        for path in paths.values():
            os.makedirs(path, exist_ok=True)
        
        # Save files
        files = {
            os.path.join(paths["comp"], f"{feature_slug}.component.ts"): ng_code.get('component_ts'),
            os.path.join(paths["comp"], f"{feature_slug}.component.html"): ng_code.get('component_html'),
            os.path.join(paths["serv"], f"{feature_slug}.service.ts"): ng_code.get('service'),
            os.path.join(paths["model"], f"{feature_slug}.model.ts"): ng_code.get('interface')
        }
        
        for file_path, content in files.items():
            if content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  ✓ Created: {file_path}")
    
    def create_module_files(self, module_name: str, module_organizer) -> None:
        """
        Create module structure files (module.ts, routing.module.ts).
        
        Args:
            module_name: Name of the module
            module_organizer: AngularModuleOrganizer instance
        """
        print(f"📦 Storage Agent: Creating module files for {module_name}...")
        
        # Create module structure
        paths = module_organizer.create_module_directories(module_name)
        
        # Generate and save module file
        module_template = module_organizer.generate_feature_module_template(module_name)
        module_file = os.path.join(
            self.root_dir, 'src', 'app', 'modules', module_name,
            f"{self._to_kebab_case(module_name)}.module.ts"
        )
        os.makedirs(os.path.dirname(module_file), exist_ok=True)
        
        with open(module_file, 'w', encoding='utf-8') as f:
            f.write(module_template)
        print(f"  ✓ Created: {module_file}")
    
    def _sanitize_feature_name(self, feature_name: str) -> str:
        """
        Convert camelCase to kebab-case.
        
        Args:
            feature_name: Original feature name (e.g., 'UserGrid')
            
        Returns:
            Kebab-case slug (e.g., 'user-grid')
        """
        slug = re.sub(r'(?<!^)(?=[A-Z])', '-', feature_name).lower()
        return slug.replace('-component', '')
    
    def _to_kebab_case(self, text: str) -> str:
        """Convert text to kebab-case."""
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1-\2', text)
        return re.sub('([a-z0-9])([A-Z])', r'\1-\2', s1).lower()
