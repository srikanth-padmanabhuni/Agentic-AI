"""
Storage Agent - Deploys generated Angular files to project
"""
import os
import re


class StorageAgent:
    """Handles file creation and deployment to Angular project structure."""
    
    def __init__(self, root_dir: str):
        """
        Initialize storage agent.
        
        Args:
            root_dir: Root directory of the Angular project
        """
        self.root_dir = os.path.abspath(root_dir)
    
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
    
    def _create_directory_structure(self, feature_slug: str) -> dict:
        """
        Create and return directory structure paths.
        
        Args:
            feature_slug: Kebab-case feature name
            
        Returns:
            Dictionary with path keys and their absolute paths
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
        
        return paths
    
    def _save_files(self, paths: dict, feature_slug: str, ng_code: dict) -> None:
        """
        Save all generated files to disk.
        
        Args:
            paths: Dictionary of directory paths
            feature_slug: Kebab-case feature name
            ng_code: Dictionary containing generated code
        """
        files = {
            os.path.join(paths["comp"], f"{feature_slug}.component.ts"): ng_code['component_ts'],
            os.path.join(paths["comp"], f"{feature_slug}.component.html"): ng_code['component_html'],
            os.path.join(paths["serv"], f"{feature_slug}.service.ts"): ng_code['service'],
            os.path.join(paths["model"], f"{feature_slug}.model.ts"): ng_code['interface']
        }
        
        for file_path, content in files.items():
            with open(file_path, 'w') as f:
                f.write(content)
            print(f"  ✓ Created: {file_path}")
    
    def deploy(self, ng_code: dict) -> None:
        """
        Deploy generated Angular code to project structure.
        
        Args:
            ng_code: Dictionary with generated Angular code
        """
        print("🚀 Storage Agent: Deploying files...")
        
        # Use .get() to avoid KeyError with fallback default
        feature_name = ng_code.get('feature_name', 'MigratedFeature')
        feature_slug = self._sanitize_feature_name(feature_name)
        
        # Create directories and save files
        paths = self._create_directory_structure(feature_slug)
        self._save_files(paths, feature_slug, ng_code)
        
        print(f"\n✨ Deployment Complete! Feature saved as: {feature_slug}")
