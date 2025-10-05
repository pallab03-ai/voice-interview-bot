# Troubleshooting: "Latest Project" Returning Apology

## Problem
When asking "What is your latest project?", the bot returns an apology instead of the Voice Interview Bot details.

## Root Cause
This usually happens when:
1. The local API server (`server-local.js`) is not running
2. React app is running in production mode instead of development mode
3. Environment variables are not set correctly

## Solution

### For Local Development:

1. **Start the local API server first:**
   ```bash
   node server-local.js
   ```
   You should see: "Local API server running on http://localhost:3001"

2. **In a NEW terminal, start React:**
   ```bash
   npm start
   ```
   This will open http://localhost:3000

3. **Test the API directly:**
   ```bash
   node test-api.js
   ```
   This will test both local and Vercel APIs and show you the responses.

### For Vercel (Production):

The Vercel deployment has been updated. Wait 1-2 minutes for the deployment to complete, then test at:
https://voice-interview-bot.vercel.app/

### Verification Checklist:

- [ ] `.env.local` file exists with `NVIDIA_API_KEY=your-key`
- [ ] `server-local.js` is running on port 3001
- [ ] `npm start` shows "development" mode
- [ ] No errors in browser console
- [ ] Vercel environment variables are set (Settings → Environment Variables)

### Quick Test:

```bash
# Test local API
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What is your latest project?","language":"English"}'

# Test Vercel API
curl -X POST https://voice-interview-bot.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What is your latest project?","language":"English"}'
```

### Expected Response:

Both should return details about the Voice Interview Bot:
- Frontend: React
- Voice: Web Speech API
- LLM: NVIDIA NIM API (GPT-OSS 120B)
- Deployment: Vercel
- Timeline: Under 48 hours
- Languages: English, Hindi, Bengali

If you get an apology or error, check:
1. API key is valid
2. Server logs for errors
3. Network tab in browser DevTools
