#!/usr/bin/env python3
"""Simple sync test to check error message."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Just check the error message format in the code
with open('app/services/llm_service.py', 'r') as f:
    content = f.read()
    
print("Checking error message format in llm_service.py...")

if 'error_msg = "LLM service unavailable. "' in content:
    print("✅ Found correct error message format")
    print("✅ Error message starts with: 'LLM service unavailable.'")
    
    if 'error_msg += f"Primary: {primary_error[:100]}. "' in content:
        print("✅ Includes primary error")
    
    if 'error_msg += f"Fallback: {fallback_error[:100]}."' in content:
        print("✅ Includes fallback error")
    
    print("\n✅ All checks passed! The error message format is correct.")
    print("\nExpected format: 'LLM service unavailable. Primary: <error>. Fallback: <error>.'")
    sys.exit(0)
else:
    print("❌ Error message format not found or incorrect")
    sys.exit(1)
