"""
Project Manager - Handles Angular project initialization and management
"""
import os
import subprocess


class ProjectManager:
    """Manages Angular project creation and validation."""
    
    def __init__(self, root_dir: str):
        """
        Initialize project manager.
        
        Args:
            root_dir: Root directory of the Angular project
        """
        self.root_dir = os.path.abspath(root_dir)
    
    def ensure_project_exists(self) -> None:
        """
        Create a new Angular project if the root directory doesn't exist.
        Uses Angular CLI with standalone components and routing.
        """
        if os.path.exists(self.root_dir):
            print(f"✅ Project root found: {self.root_dir}")
            return
        
        print(f"📂 Project root '{self.root_dir}' not found. Creating new Angular project...")
        
        parent_dir = os.path.dirname(self.root_dir)
        project_name = os.path.basename(self.root_dir)
        
        os.makedirs(parent_dir, exist_ok=True)
        
        try:
            print(f"  Running: ng new {project_name} --standalone --routing")
            subprocess.run(
                ["ng", "new", project_name, "--standalone", "--routing", "--style=css", "--skip-git"],
                cwd=parent_dir,
                check=True,
                shell=True  # Required for Windows
            )
            print(f"✅ New Angular project '{project_name}' initialized successfully.")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to create Angular project: {e}")
            raise
    
    def find_extjs_files(self, source_dir: str) -> list:
        """
        Recursively find all ExtJS component files (.js) in a directory.
        
        Args:
            source_dir: Root directory to search
            
        Returns:
            List of absolute file paths to ExtJS files
        """
        source_dir = os.path.abspath(source_dir)
        
        if not os.path.isdir(source_dir):
            raise NotADirectoryError(f"Source directory not found: {source_dir}")
        
        extjs_files = []
        
        for root, dirs, files in os.walk(source_dir):
            # Skip common non-source folders
            dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '.angular', 'dist', 'build']]
            
            for file in files:
                # Look for .js files (ExtJS files)
                if file.endswith('.js'):
                    file_path = os.path.join(root, file)
                    extjs_files.append(file_path)
        
        return sorted(extjs_files)
    
    def load_file(self, file_path: str) -> str:
        """
        Load and return file contents.
        
        Args:
            file_path: Path to the file to load
            
        Returns:
            File contents as string
            
        Raises:
            FileNotFoundError: If file doesn't exist
        """
        file_path = os.path.abspath(file_path)
        
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found at: {file_path}")
        
        with open(file_path, 'r') as f:
            return f.read()
