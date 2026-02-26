"""
Processed Files Tracker - Maintains state of processed files during migration
Prevents reprocessing and maintains migration history and statistics
"""
import json
import os
from typing import Dict, List, Set
from datetime import datetime


class ProcessedFilesTracker:
    """
    Tracks processed files during migration to avoid reprocessing.
    Maintains statistics and supports persistence to disk.
    """
    
    def __init__(self, tracker_file: str = None):
        """
        Initialize the tracker.
        
        Args:
            tracker_file: Optional path to save tracker state (JSON file)
        """
        self.tracker_file = tracker_file
        self.processed_files: Dict[str, Dict] = {}
        self.processing_queue: List[str] = []
        self.failed_files: Dict[str, str] = {}
        self.skipped_files: Dict[str, str] = {}
        self.migration_start_time = datetime.now()
        
        # Load from disk if exists
        if self.tracker_file and os.path.exists(self.tracker_file):
            self.load_from_file()
    
    def add_processed_file(self, file_path: str, status: str = 'success', 
                          result_data: Dict = None, dependencies_resolved: List[str] = None) -> None:
        """
        Mark a file as processed.
        
        Args:
            file_path: Absolute path to the processed file
            status: Status of processing ('success', 'partial', 'review_needed')
            result_data: Optional data about the processing result
            dependencies_resolved: List of dependencies that were resolved
        """
        file_path = os.path.abspath(file_path)
        
        self.processed_files[file_path] = {
            'path': file_path,
            'file_name': os.path.basename(file_path),
            'status': status,
            'processed_at': datetime.now().isoformat(),
            'result': result_data or {},
            'dependencies_resolved': dependencies_resolved or [],
            'retry_count': self.processed_files.get(file_path, {}).get('retry_count', 0) + 1
        }
    
    def add_to_queue(self, file_paths: List[str]) -> None:
        """
        Add files to processing queue.
        
        Args:
            file_paths: List of absolute file paths to add to queue
        """
        for file_path in file_paths:
            file_path = os.path.abspath(file_path)
            if file_path not in self.processing_queue and file_path not in self.processed_files:
                self.processing_queue.append(file_path)
    
    def dequeue_file(self) -> str:
        """
        Get next file from queue.
        
        Returns:
            Next file path from queue, or None if empty
        """
        if self.processing_queue:
            return self.processing_queue.pop(0)
        return None
    
    def is_processed(self, file_path: str) -> bool:
        """
        Check if a file has been processed.
        
        Args:
            file_path: Path to check
            
        Returns:
            True if file is in processed list
        """
        file_path = os.path.abspath(file_path)
        return file_path in self.processed_files
    
    def mark_failed(self, file_path: str, reason: str) -> None:
        """
        Mark a file as failed processing.
        
        Args:
            file_path: Path to the failed file
            reason: Reason for failure
        """
        file_path = os.path.abspath(file_path)
        self.failed_files[file_path] = {
            'path': file_path,
            'file_name': os.path.basename(file_path),
            'reason': reason,
            'failed_at': datetime.now().isoformat()
        }
        # Remove from processed if was there
        self.processed_files.pop(file_path, None)
    
    def mark_skipped(self, file_path: str, reason: str) -> None:
        """
        Mark a file as skipped.
        
        Args:
            file_path: Path to the skipped file
            reason: Reason for skipping
        """
        file_path = os.path.abspath(file_path)
        self.skipped_files[file_path] = {
            'path': file_path,
            'file_name': os.path.basename(file_path),
            'reason': reason,
            'skipped_at': datetime.now().isoformat()
        }
    
    def get_processed_count(self) -> int:
        """Get count of successfully processed files."""
        return sum(1 for f in self.processed_files.values() if f['status'] == 'success')
    
    def get_failed_count(self) -> int:
        """Get count of failed files."""
        return len(self.failed_files)
    
    def get_skipped_count(self) -> int:
        """Get count of skipped files."""
        return len(self.skipped_files)
    
    def get_queue_size(self) -> int:
        """Get remaining files in queue."""
        return len(self.processing_queue)
    
    def get_processed_files_list(self) -> List[str]:
        """Get list of all processed file paths."""
        return list(self.processed_files.keys())
    
    def get_all_resolved_dependencies(self) -> Set[str]:
        """
        Get set of all resolved dependencies across all processed files.
        
        Returns:
            Set of unique file paths that were dependencies
        """
        all_deps = set()
        for file_info in self.processed_files.values():
            all_deps.update(file_info.get('dependencies_resolved', []))
        return all_deps
    
    def get_statistics(self) -> Dict:
        """
        Get migration statistics.
        
        Returns:
            Dictionary with statistics
        """
        elapsed = datetime.now() - self.migration_start_time
        
        return {
            'migration_start_time': self.migration_start_time.isoformat(),
            'elapsed_time_seconds': elapsed.total_seconds(),
            'total_processed': self.get_processed_count(),
            'total_failed': self.get_failed_count(),
            'total_skipped': self.get_skipped_count(),
            'remaining_in_queue': self.get_queue_size(),
            'total_dependencies_resolved': len(self.get_all_resolved_dependencies()),
            'success_rate': self._calculate_success_rate(),
            'processed_files': list(self.processed_files.keys()),
            'failed_files': list(self.failed_files.values()),
            'skipped_files': list(self.skipped_files.values())
        }
    
    def _calculate_success_rate(self) -> float:
        """Calculate success rate percentage."""
        total = self.get_processed_count() + self.get_failed_count()
        if total == 0:
            return 0.0
        return (self.get_processed_count() / total) * 100.0
    
    def print_summary(self) -> None:
        """Print migration summary."""
        stats = self.get_statistics()
        
        print("\n" + "="*70)
        print("📊 PROCESSED FILES SUMMARY")
        print("="*70)
        print(f"✅ Successfully Processed: {stats['total_processed']}")
        print(f"❌ Failed: {stats['total_failed']}")
        print(f"⏭️  Skipped: {stats['total_skipped']}")
        print(f"⏳ Remaining in Queue: {stats['remaining_in_queue']}")
        print(f"🔗 Total Dependencies Resolved: {stats['total_dependencies_resolved']}")
        print(f"📈 Success Rate: {stats['success_rate']:.1f}%")
        print(f"⏱️  Elapsed Time: {stats['elapsed_time_seconds']:.1f}s")
        print("="*70 + "\n")
        
        if self.failed_files:
            print("Failed Files:")
            for file_info in self.failed_files.values():
                print(f"  ❌ {file_info['file_name']}: {file_info['reason']}")
            print()
        
        if self.skipped_files:
            print("Skipped Files:")
            for file_info in self.skipped_files.values():
                print(f"  ⏭️  {file_info['file_name']}: {file_info['reason']}")
            print()
    
    def save_to_file(self, file_path: str = None) -> None:
        """
        Save tracker state to JSON file.
        
        Args:
            file_path: Path to save tracker (uses initialized path if not provided)
        """
        output_path = file_path or self.tracker_file
        
        if not output_path:
            raise ValueError("No tracker file path specified")
        
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        tracker_data = {
            'migration_start_time': self.migration_start_time.isoformat(),
            'last_updated': datetime.now().isoformat(),
            'processed_files': self.processed_files,
            'failed_files': self.failed_files,
            'skipped_files': self.skipped_files,
            'processing_queue': self.processing_queue,
            'statistics': self.get_statistics()
        }
        
        with open(output_path, 'w') as f:
            json.dump(tracker_data, f, indent=2, default=str)
        
        print(f"✅ Tracker saved to: {output_path}")
    
    def load_from_file(self, file_path: str = None) -> None:
        """
        Load tracker state from JSON file.
        
        Args:
            file_path: Path to load tracker from (uses initialized path if not provided)
        """
        input_path = file_path or self.tracker_file
        
        if not input_path or not os.path.exists(input_path):
            raise FileNotFoundError(f"Tracker file not found: {input_path}")
        
        with open(input_path, 'r') as f:
            tracker_data = json.load(f)
        
        self.processed_files = tracker_data.get('processed_files', {})
        self.failed_files = tracker_data.get('failed_files', {})
        self.skipped_files = tracker_data.get('skipped_files', {})
        self.processing_queue = tracker_data.get('processing_queue', [])
        
        print(f"✅ Tracker loaded from: {input_path}")
    
    def clear(self) -> None:
        """Clear all tracking data."""
        self.processed_files.clear()
        self.failed_files.clear()
        self.skipped_files.clear()
        self.processing_queue.clear()
        self.migration_start_time = datetime.now()
