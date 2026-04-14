#!/usr/bin/env python3
"""Quick test to verify LLM network test fix."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import asyncio
from unittest.mock import AsyncMock
from app.services.llm_service import LLMService

async def test_error_message():
    """Test that error message format is correct."""
    llm = LLMService()
    llm._call_llm = AsyncMock(side_effect=Exception("Ollama failed"))
    llm._call_google_llm = AsyncMock(side_effect=Exception("Google failed"))

    result = await llm.generate_sql("question", {"tables": []})

    print("Testing error message format...")
    print(f"Result: {result}")
    
    assert result["sql"] == "", f"Expected empty sql, got: {result['sql']}"
    assert "error" in result, "Error key not in result"
    assert "LLM service unavailable" in result["error"], f"Expected 'LLM service unavailable' in error, got: {result['error']}"
    assert "Ollama failed" in result["error"], f"Expected 'Ollama failed' in error, got: {result['error']}"
    assert "Google failed" in result["error"], f"Expected 'Google failed' in error, got: {result['error']}"
    
    print("✅ All assertions passed!")
    print(f"Error message: {result['error']}")
    return True

if __name__ == "__main__":
    try:
        success = asyncio.run(test_error_message())
        if success:
            print("\n🎉 Test passed!")
            sys.exit(0)
        else:
            print("\n❌ Test failed!")
            sys.exit(1)
    except Exception as e:
        print(f"\n❌ Test failed with exception: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
