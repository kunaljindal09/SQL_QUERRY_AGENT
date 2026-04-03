# Google AI Studio (Gemini) Setup Guide

## Get Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## Configure Backend

1. Navigate to `backend/` folder
2. Create a `.env` file (or edit existing one):

```bash
# Use Google AI Studio
LLM_PROVIDER=google
GOOGLE_API_KEY=your-actual-api-key-here
GOOGLE_MODEL=gemini-1.5-flash
```

3. Restart your backend server:

```bash
cd backend
python -m uvicorn app.main:app --reload
```

## Available LLM Providers

| Provider | Config Value | Pros | Cons |
|----------|-------------|------|------|
| **Google AI Studio** | `google` | Free tier, fast, accurate | Requires API key |
| **Ollama (Local)** | `llama` | Free, private, offline | Needs local setup |
| **OpenAI** | `openai` | Reliable, accurate | Paid API |

## Why Use Google AI?

If you're experiencing network errors with complex queries like "sum of all the salary", Google AI Studio is more reliable because:

1. ✅ Better handling of complex aggregation queries
2. ✅ More robust API with better timeout handling
3. ✅ Free tier available (60 requests/minute)
4. ✅ No need to host your own LLM

## Troubleshooting Network Errors

### Error: "Failed to get response"

**Cause:** Ollama server timeout or unreachable

**Solutions:**
1. Switch to Google AI (recommended)
2. Check if Ollama server is running: `curl https://aimodels.jadeglobal.com:8082/ollama/api/tags`
3. Increase timeout in `llm_service.py`
4. Use a simpler/faster model

### Error: "No schema loaded"

**Cause:** Database is empty or connection failed

**Solutions:**
1. Check database has tables: `SHOW TABLES;`
2. Verify connection string
3. Check backend logs for connection errors
