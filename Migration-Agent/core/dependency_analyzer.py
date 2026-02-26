"""
Dependency Analyzer - Extracts and resolves JavaScript file dependencies
Analyzes imports, requires, and file references to build complete dependency graph
"""
import os
import re
from typing import Set, Dict, List, Tuple
from pathlib import Path


class DependencyAnalyzer:
    """Analyzes JavaScript files to extract and resolve dependencies."""
    
    # Regular expressions for various import patterns
    IMPORT_PATTERNS = {
        'es6_import': r"import\s+(?:{[^}]+}|[^'\"]+(?: as \w+)?)\s+from\s+['\"]([^'\"]+)['\"]",
        'require_path': r"require\(['\"]([^'\"]+)['\"]\)",
        'extjs_requires': r"requires\s*:\s*\[\s*([^\]]+)\s*\]",
        'xtype_reference': r"xtype\s*:\s*['\"]([^'\"]+)['\"]",
        'controller_reference': r"controller\s*:\s*['\"]([^'\"]+)['\"]",
        'viewmodel_reference': r"viewModel\s*:\s*['\"]([^'\"]+)['\"]",
        'store_reference': r"store\s*:\s*['\"]([^'\"]+)['\"]",
        'model_reference': r"model\s*:\s*['\"]([^'\"]+)['\"]",
        'bind_store': r"store\s*:\s*['\"]\{([^'\"}]+)\}['\"]",
    }
    
    # Patterns for files/classes that should not be analyzed recursively (ExtJS framework, etc.)
    IGNORE_PATTERNS = [
        r'[\\/]ext[\\/]',          # Any path containing /ext/ folder
        r'[\\/]extjs[\\/]',        # Any path containing /extjs/ folder
        r'[\\/]node_modules[\\/]', # Node modules
        r'^Ext\.',                 # ExtJS framework classes starting with Ext.
        r'\.min\.js$',             # Minified files
    ]
    
    def __init__(self, base_dir: str):
        """
        Initialize dependency analyzer.
        
        Args:
            base_dir: Base directory to resolve relative imports
        """
        self.base_dir = os.path.abspath(base_dir)
        self.dependency_cache: Dict[str, Set[str]] = {}
    
    def _is_external_resource(self, path: str) -> bool:
        """
        Check if a file path or dependency reference is an external/framework resource.
        
        Args:
            path: Path or reference string to check
            
        Returns:
            True if it's an external resource and should not be analyzed recursively
        """
        for pattern in self.IGNORE_PATTERNS:
            if re.search(pattern, path, re.IGNORECASE):
                return True
        return False
    
    def extract_dependencies(self, file_content: str, file_path: str = None) -> Set[str]:
        """
        Extract all dependencies from JavaScript file content.
        
        Args:
            file_content: Raw JavaScript file content
            file_path: File path for relative import resolution
            
        Returns:
            Set of dependency file paths (relative or absolute)
        """
        dependencies = set()
        
        # Extract ES6 imports
        es6_imports = re.findall(self.IMPORT_PATTERNS['es6_import'], file_content, re.MULTILINE)
        dependencies.update(es6_imports)
        
        # Extract CommonJS requires
        requires = re.findall(self.IMPORT_PATTERNS['require_path'], file_content, re.MULTILINE)
        dependencies.update(requires)
        
        # Extract ExtJS requires
        requires_match = re.search(self.IMPORT_PATTERNS['extjs_requires'], file_content, re.DOTALL)
        if requires_match:
            requires_str = requires_match.group(1)
            extjs_deps = re.findall(r"['\"]([^'\"]+)['\"]", requires_str)
            dependencies.update(extjs_deps)
        
        # Extract xtype references (component references)
        xtypes = re.findall(self.IMPORT_PATTERNS['xtype_reference'], file_content)
        dependencies.update(xtypes)
        
        # Extract controller references
        controllers = re.findall(self.IMPORT_PATTERNS['controller_reference'], file_content)
        dependencies.update(controllers)
        
        # Extract viewModel references
        viewmodels = re.findall(self.IMPORT_PATTERNS['viewmodel_reference'], file_content)
        dependencies.update(viewmodels)
        
        # Extract store references
        stores = re.findall(self.IMPORT_PATTERNS['store_reference'], file_content)
        dependencies.update(stores)
        
        # Extract model references
        models = re.findall(self.IMPORT_PATTERNS['model_reference'], file_content)
        dependencies.update(models)
        # Extract bind store references
        bind_stores = re.findall(self.IMPORT_PATTERNS['bind_store'], file_content)
        for bs in bind_stores:
            # Handle {users.store} -> we extract 'users' if it's potentially a class reference
            # but usually we want to see if it follows dot notation for path resolution
            if '.' in bs:
                dependencies.add(bs)
        
        
        return dependencies
    
    def resolve_dependency_paths(self, dependencies: Set[str], file_path: str = None) -> Dict[str, str]:
        """
        Resolve dependency references to actual file paths.
        
        Args:
            dependencies: Set of dependency references
            file_path: Path of the file requiring these dependencies (for relative resolution)
            
        Returns:
            Dictionary mapping dependencies to resolved file paths
        """
        resolved = {}
        
        # Get directory of current file for relative imports
        current_dir = os.path.dirname(file_path) if file_path else self.base_dir
        
        for dep in dependencies:
            resolved_path = None
            
            # Handle ExtJS dot notation (e.g., ConnectWeb.view.connect.users.UserGridController)
            # Skip if it's an absolute path, starts with relative dots, or explicitly filtered out
            if '.' in dep and '/' not in dep and '\\' not in dep and not dep.startswith('.'):
                # Try to map namespace dot notation to file path (ConnectWeb.view -> ConnectWeb/view.js)
                path_from_dots = dep.replace('.', os.sep) + '.js'
                
                # Search paths: from base_dir and its parent directories (to find namespace roots)
                search_roots = [self.base_dir]
                curr = self.base_dir
                for _ in range(3): # Try up to 3 levels up to find common root for ConnectWeb/ConnectUtil etc.
                    curr = os.path.dirname(curr)
                    if curr and curr not in search_roots:
                        search_roots.append(curr)
                
                for root in search_roots:
                    candidate = os.path.join(root, path_from_dots)
                    if os.path.exists(candidate):
                        resolved_path = os.path.abspath(candidate)
                        break
            
            # Try relative path first (if not dot notation)
            if not resolved_path and not dep.startswith('../') and not os.path.isabs(dep) and not dep.startswith('.'):
                # Try adding .js extension
                relative_path = os.path.join(current_dir, f"{dep}.js")
                if os.path.exists(relative_path):
                    resolved_path = os.path.abspath(relative_path)
                else:
                    # Try without extension
                    relative_path = os.path.join(current_dir, dep)
                    if os.path.exists(relative_path):
                        resolved_path = os.path.abspath(relative_path)
            
            # Try absolute path
            if not resolved_path and os.path.isabs(dep):
                if os.path.exists(dep):
                    resolved_path = os.path.abspath(dep)
            
            # Try from base directory
            if not resolved_path:
                base_path = os.path.join(self.base_dir, f"{dep}.js")
                if os.path.exists(base_path):
                    resolved_path = os.path.abspath(base_path)
                else:
                    base_path = os.path.join(self.base_dir, dep)
                    if os.path.exists(base_path):
                        resolved_path = os.path.abspath(base_path)
            
            if resolved_path:
                resolved[dep] = resolved_path
        
        return resolved
    
    def build_dependency_graph(self, file_path: str, max_depth: int = 5, current_depth: int = 0) -> Dict[str, any]:
        """
        Recursively build complete dependency graph for a file.
        
        Args:
            file_path: Path to the JavaScript file
            max_depth: Maximum recursion depth to prevent infinite loops
            current_depth: Current recursion depth
            
        Returns:
            Dictionary representing dependency graph
        """
        file_path = os.path.abspath(file_path)
        
        # Check if this is an external/framework file that shouldn't be analyzed
        if self._is_external_resource(file_path):
            return {
                'path': file_path, 
                'external': True, 
                'analyzed': False,
                'dependencies': []
            }
            
        if not os.path.exists(file_path):
            return {'path': file_path, 'exists': False, 'dependencies': []}
        
        # Check cache
        if file_path in self.dependency_cache:
            return {'path': file_path, 'cached': True, 'dependencies': list(self.dependency_cache[file_path])}
        
        # Prevent infinite recursion
        if current_depth >= max_depth:
            return {'path': file_path, 'max_depth_reached': True, 'dependencies': []}
        
        # Read file content
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception as e:
            return {'path': file_path, 'error': str(e), 'dependencies': []}
        
        # Extract dependencies
        dep_refs = self.extract_dependencies(content, file_path)
        resolved_deps = self.resolve_dependency_paths(dep_refs, file_path)
        
        # Cache the direct dependencies
        self.dependency_cache[file_path] = set(resolved_deps.values())
        
        # Build graph
        graph = {
            'path': file_path,
            'file_name': os.path.basename(file_path),
            'depth': current_depth,
            'direct_dependencies': list(resolved_deps.keys()),
            'resolved_paths': resolved_deps,
            'sub_dependencies': []
        }
        
        # Recursively process dependencies
        for dep_path in resolved_deps.values():
            if dep_path != file_path:  # Avoid self-reference
                sub_graph = self.build_dependency_graph(dep_path, max_depth, current_depth + 1)
                graph['sub_dependencies'].append(sub_graph)
        
        return graph
    
    def get_all_dependencies_flat(self, file_path: str, max_depth: int = 5) -> List[str]:
        """
        Get a flat list of all dependencies for a file (no duplicates).
        
        Args:
            file_path: Path to the JavaScript file
            max_depth: Maximum recursion depth
            
        Returns:
            List of absolute paths to all dependent files
        """
        graph = self.build_dependency_graph(file_path, max_depth)
        all_deps = set()
        
        def flatten_graph(node, visited=None):
            if visited is None:
                visited = set()
            
            path = node.get('path')
            if path in visited:
                return
            
            visited.add(path)
            
            for resolved_path in node.get('resolved_paths', {}).values():
                # Only add to flat list if not external and not already visited
                if resolved_path not in visited and not self._is_external_resource(resolved_path):
                    all_deps.add(resolved_path)
            
            for sub_dep in node.get('sub_dependencies', []):
                # Don't flatten sub-dependencies of external nodes
                if not sub_dep.get('external', False):
                    flatten_graph(sub_dep, visited)
        
        if graph and 'resolved_paths' in graph:
            for resolved_path in graph['resolved_paths'].values():
                if not self._is_external_resource(resolved_path):
                    all_deps.add(resolved_path)
        
        for sub_dep in graph.get('sub_dependencies', []):
            if not sub_dep.get('external', False):
                flatten_graph(sub_dep)
        
        return sorted(list(all_deps))
    
    def detect_circular_dependencies(self, file_path: str) -> List[Tuple[str, str]]:
        """
        Detect circular dependencies in the dependency graph.
        
        Args:
            file_path: Path to start analysis from
            
        Returns:
            List of tuples representing circular dependencies
        """
        file_path = os.path.abspath(file_path)
        circular_deps = []
        visited = set()
        rec_stack = set()
        
        def dfs(current_path, path_stack):
            visited.add(current_path)
            rec_stack.add(current_path)
            path_stack.append(current_path)
            
            if current_path in self.dependency_cache:
                for dep_path in self.dependency_cache[current_path]:
                    if dep_path not in visited:
                        dfs(dep_path, path_stack)
                    elif dep_path in rec_stack:
                        # Found circular dependency
                        circular_deps.append((current_path, dep_path))
            
            path_stack.pop()
            rec_stack.remove(current_path)
        
        # Build cache first
        self.build_dependency_graph(file_path)
        
        # Run DFS
        dfs(file_path, [])
        
        return circular_deps
    
    def get_dependency_statistics(self, file_path: str) -> Dict[str, any]:
        """
        Get statistics about dependencies.
        
        Args:
            file_path: Path to analyze
            
        Returns:
            Dictionary with dependency statistics
        """
        graph = self.build_dependency_graph(file_path)
        all_deps = self.get_all_dependencies_flat(file_path)
        circular = self.detect_circular_dependencies(file_path)
        
        return {
            'file': file_path,
            'direct_dependency_count': len(graph.get('direct_dependencies', [])),
            'total_dependency_count': len(all_deps),
            'max_depth': self._calculate_depth(graph),
            'circular_dependencies': circular,
            'has_circular_deps': len(circular) > 0,
            'all_dependencies': all_deps
        }
    
    def _calculate_depth(self, graph: Dict) -> int:
        """Calculate maximum depth in dependency graph."""
        max_d = 0
        
        def traverse(node):
            nonlocal max_d
            current_depth = node.get('depth', 0)
            max_d = max(max_d, current_depth)
            
            for sub in node.get('sub_dependencies', []):
                traverse(sub)
        
        traverse(graph)
        return max_d
    
    def clear_cache(self):
        """Clear the dependency cache."""
        self.dependency_cache.clear()
