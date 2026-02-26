"""
Quality Validator - Calculates success factors for each agent phase
"""
import json
from .gemini_client import GeminiClient
from config import (
    ANALYSIS_VALIDATION_WEIGHTS,
    CONVERSION_VALIDATION_WEIGHTS,
    STORAGE_VALIDATION_WEIGHTS,
    SUCCESS_FACTOR_THRESHOLD,
    VALIDATION_ANALYSIS_PROMPT,
    VALIDATION_CONVERSION_PROMPT,
    VALIDATION_STORAGE_PROMPT
)


class QualityValidator:
    """Validates output quality and calculates success factors for each phase."""
    
    def __init__(self):
        self.gemini = GeminiClient()
        self.validation_history = []
    
    def _validate_analysis_phase(self, blueprint: dict) -> tuple[dict, float]:
        """
        Validate analysis phase blueprint output.
        
        Args:
            blueprint: Blueprint dictionary from analysis phase
            
        Returns:
            Tuple of (validation_details, success_factor)
        """
        print("🔍 Quality Validator: Validating Analysis Phase...")
        
        validation_result = self.gemini.generate_json_response(
            "Act as an ExtJS Expert. Validate the blueprint quality.",
            VALIDATION_ANALYSIS_PROMPT + "\n" + json.dumps(blueprint)
        )
        
        # Calculate weighted success factor
        success_factor = sum(
            validation_result.get(criterion, 0) * weight
            for criterion, weight in ANALYSIS_VALIDATION_WEIGHTS.items()
        )
        
        return validation_result, success_factor
    
    def _validate_conversion_phase(self, angular_code: dict) -> tuple[dict, float]:
        """
        Validate conversion phase Angular code quality.
        
        Args:
            angular_code: Angular code dictionary from conversion phase
            
        Returns:
            Tuple of (validation_details, success_factor)
        """
        print("🔍 Quality Validator: Validating Conversion Phase...")
        
        validation_result = self.gemini.generate_json_response(
            "Act as an Angular Architect. Validate the code quality.",
            VALIDATION_CONVERSION_PROMPT + "\n" + json.dumps(angular_code)
        )
        
        # Calculate weighted success factor
        success_factor = sum(
            validation_result.get(criterion, 0) * weight
            for criterion, weight in CONVERSION_VALIDATION_WEIGHTS.items()
        )
        
        return validation_result, success_factor
    
    def _validate_storage_phase(self, file_manifest: dict) -> tuple[dict, float]:
        """
        Validate storage phase file deployment.
        
        Args:
            file_manifest: Manifest of deployed files
            
        Returns:
            Tuple of (validation_details, success_factor)
        """
        print("🔍 Quality Validator: Validating Storage Phase...")
        
        validation_result = self.gemini.generate_json_response(
            "Act as an Angular File Structure Expert. Validate the file deployment.",
            VALIDATION_STORAGE_PROMPT + "\n" + json.dumps(file_manifest)
        )
        
        # Calculate weighted success factor
        success_factor = sum(
            validation_result.get(criterion, 0) * weight
            for criterion, weight in STORAGE_VALIDATION_WEIGHTS.items()
        )
        
        return validation_result, success_factor
    
    def validate_analysis(self, blueprint: dict) -> tuple[bool, dict]:
        """
        Validate analysis output.
        
        Args:
            blueprint: Blueprint from analysis phase
            
        Returns:
            Tuple of (passed_threshold, validation_details)
        """
        validation_details, success_factor = self._validate_analysis_phase(blueprint)
        passed = success_factor >= SUCCESS_FACTOR_THRESHOLD
        
        validation_details['success_factor'] = round(success_factor, 2)
        validation_details['passed_threshold'] = passed
        
        self.validation_history.append({
            'phase': 'analysis',
            'success_factor': success_factor,
            'passed': passed,
            'details': validation_details
        })
        
        print(f"  Success Factor: {success_factor:.2f}% {'✅ PASSED' if passed else '❌ NEEDS REVIEW'}\n")
        return passed, validation_details
    
    def validate_conversion(self, angular_code: dict) -> tuple[bool, dict]:
        """
        Validate conversion output.
        
        Args:
            angular_code: Angular code from conversion phase
            
        Returns:
            Tuple of (passed_threshold, validation_details)
        """
        validation_details, success_factor = self._validate_conversion_phase(angular_code)
        passed = success_factor >= SUCCESS_FACTOR_THRESHOLD
        
        validation_details['success_factor'] = round(success_factor, 2)
        validation_details['passed_threshold'] = passed
        
        self.validation_history.append({
            'phase': 'conversion',
            'success_factor': success_factor,
            'passed': passed,
            'details': validation_details
        })
        
        print(f"  Success Factor: {success_factor:.2f}% {'✅ PASSED' if passed else '❌ NEEDS REVIEW'}\n")
        return passed, validation_details
    
    def validate_storage(self, file_manifest: dict) -> tuple[bool, dict]:
        """
        Validate storage output.
        
        Args:
            file_manifest: File deployment manifest
            
        Returns:
            Tuple of (passed_threshold, validation_details)
        """
        validation_details, success_factor = self._validate_storage_phase(file_manifest)
        passed = success_factor >= SUCCESS_FACTOR_THRESHOLD
        
        validation_details['success_factor'] = round(success_factor, 2)
        validation_details['passed_threshold'] = passed
        
        self.validation_history.append({
            'phase': 'storage',
            'success_factor': success_factor,
            'passed': passed,
            'details': validation_details
        })
        
        print(f"  Success Factor: {success_factor:.2f}% {'✅ PASSED' if passed else '❌ NEEDS REVIEW'}\n")
        return passed, validation_details
    
    def get_validation_report(self) -> dict:
        """Get full validation history and report."""
        return {
            'total_validations': len(self.validation_history),
            'passed_phases': sum(1 for v in self.validation_history if v['passed']),
            'failed_phases': sum(1 for v in self.validation_history if not v['passed']),
            'average_success_factor': round(
                sum(v['success_factor'] for v in self.validation_history) / len(self.validation_history),
                2
            ) if self.validation_history else 0,
            'history': self.validation_history
        }
    
    def get_validation_report(self) -> dict:
        """Get full validation history and report."""
        return {
            'total_validations': len(self.validation_history),
            'passed_phases': sum(1 for v in self.validation_history if v['passed']),
            'failed_phases': sum(1 for v in self.validation_history if not v['passed']),
            'average_success_factor': round(
                sum(v['success_factor'] for v in self.validation_history) / len(self.validation_history),
                2
            ) if self.validation_history else 0,
            'history': self.validation_history
        }
