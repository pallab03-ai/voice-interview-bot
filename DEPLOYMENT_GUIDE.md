# Vercel Deployment Guide - Step by Step 🚀

## Prerequisites Checklist

- [x] Application tested locally and working
- [ ] GitHub account (free)
- [ ] Vercel account (free)
- [ ] Git installed on your computer
- [ ] Code ready to deploy

---

## Step 1: Prepare Your Code for Deployment

### A. Check Your Files

Make sure you have these important files:

```
voice-interview-bot/
├── package.json          ✅ (contains dependencies)
├── vercel.json          ✅ (Vercel configuration)
├── public/              ✅ (static files)
├── src/                 ✅ (React components)
└── api/                 ✅ (serverless functions)
    └── chat.js          ✅ (API endpoint)
```

### B. Verify package.json has build script

Open `package.json` and verify:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",  ← Must have this!
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

---

## Step 2: Initialize Git Repository (If Not Already Done)

### Check if Git is initialized:

```powershell
cd c:\Users\PALLAB\my_self_bot\voice-interview-bot
git status
```

### If you see "not a git repository", initialize Git:

```powershell
git init
```

### Add all files:

```powershell
git add .
```

### Commit your code:

```powershell
git commit -m "Initial commit - Voice Interview Bot ready for deployment"
```

---

## Step 3: Create GitHub Repository

### Option A: Using GitHub Website (Recommended)

1. **Go to GitHub:**

   - Open https://github.com
   - Log in to your account

2. **Create New Repository:**

   - Click the **"+"** icon (top right)
   - Select **"New repository"**

3. **Repository Settings:**

   - **Repository name:** `voice-interview-bot`
   - **Description:** "AI Voice Interview Bot for 100x.inc application"
   - **Visibility:** Public (or Private, your choice)
   - **DO NOT** check "Initialize with README" (you already have code)
   - Click **"Create repository"**

4. **Copy Repository URL:**
   - You'll see a URL like: `https://github.com/YOUR_USERNAME/voice-interview-bot.git`
   - Copy this URL

### Option B: Using GitHub CLI (Alternative)

```powershell
gh repo create voice-interview-bot --public --source=. --remote=origin
```

---

## Step 4: Push Code to GitHub

### Add GitHub as remote:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/voice-interview-bot.git
```

_Replace YOUR_USERNAME with your actual GitHub username_

### Push your code:

```powershell
git branch -M main
git push -u origin main
```

### If prompted for credentials:

- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)
  - Get token: https://github.com/settings/tokens
  - Generate new token (classic)
  - Check "repo" scope
  - Copy the token and use it as password

---

## Step 5: Deploy to Vercel

### A. Sign Up/Login to Vercel

1. **Go to Vercel:**

   - Open https://vercel.com
   - Click **"Sign Up"** (or "Log In" if you have account)

2. **Sign Up with GitHub:**
   - Click **"Continue with GitHub"**
   - Authorize Vercel to access your GitHub
   - This links your accounts

### B. Import Your Project

1. **After login, you'll see Vercel Dashboard**

   - Click **"Add New..."** button (top right)
   - Select **"Project"**

2. **Import Git Repository:**

   - You should see your GitHub repositories
   - Find **"voice-interview-bot"**
   - Click **"Import"**

3. **Configure Project:**

   **Project Name:**

   ```
   voice-interview-bot
   ```

   **Framework Preset:**

   ```
   Create React App
   ```

   _(Should auto-detect)_

   **Root Directory:**

   ```
   ./
   ```

   _(Leave as default)_

   **Build Command:**

   ```
   npm run build
   ```

   _(Should be pre-filled)_

   **Output Directory:**

   ```
   build
   ```

   _(Should be pre-filled)_

   **Install Command:**

   ```
   npm install
   ```

   _(Should be pre-filled)_

### C. Add Environment Variable

**IMPORTANT:** Add your NVIDIA API key

1. **Click "Environment Variables" section**

2. **Add Variable:**

   - **Name:** `NVIDIA_API_KEY`
   - **Value:** `YOUR_NVIDIA_API_KEY_HERE` (Get from https://build.nvidia.com/)
   - **Environment:** Select ALL (Production, Preview, Development)

3. **Click "Add"**

### D. Deploy!

1. **Click "Deploy" button**
2. **Wait for deployment** (2-5 minutes)
3. **Watch build logs** (you can see progress)

---

## Step 6: Verify Deployment

### A. Check Build Status

**During Build, you'll see:**

```
✓ Installing dependencies...
✓ Building application...
✓ Collecting files...
✓ Uploading...
✓ Deployment ready!
```

**If successful:**

- ✅ You'll see: "Congratulations! Your project has been deployed"
- ✅ You'll get a URL like: `https://voice-interview-bot-abc123.vercel.app`

### B. Open Your Deployed App

1. **Click the deployment URL** or **"Visit" button**
2. **Your bot should load!**

### C. Test Production App

**Quick Tests:**

1. ✅ Page loads
2. ✅ Select English
3. ✅ Type "Who are you?" and press Enter
4. ✅ Response appears
5. ✅ Voice speaks (if microphone permission given)
6. ✅ Try Hindi: "नमस्ते"
7. ✅ Check conversation memory

---

## Step 7: Get Your Production URL

### Your app will be live at:

```
https://voice-interview-bot-[random-id].vercel.app
```

### Custom Domain (Optional):

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps

---

## Troubleshooting Common Issues

### Issue 1: Build Fails

**Error:** "Build failed with exit code 1"

**Solution:**

```powershell
# Test build locally first
npm run build

# If it works locally, check Vercel logs
# Make sure all dependencies are in package.json
```

### Issue 2: API Not Working

**Error:** "Failed to get response" or 500 errors

**Solutions:**

- ✅ Check Environment Variables are set
- ✅ Verify `NVIDIA_API_KEY` is correct
- ✅ Check `api/chat.js` file exists
- ✅ Verify `vercel.json` configuration

### Issue 3: 404 on Refresh

**Error:** Page not found when refreshing

**Solution:**
Already handled by `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Issue 4: Voice Not Working

**Error:** Voice doesn't speak in production

**Solution:**

- Browser needs HTTPS (Vercel provides this)
- User must grant microphone permission
- Voice API works in modern browsers only

---

## Step 8: Update Deployment (Future Changes)

### When you make changes:

1. **Save your changes locally**

2. **Commit to Git:**

```powershell
git add .
git commit -m "Description of changes"
git push
```

3. **Auto-Deploy:**

   - Vercel automatically detects the push
   - Builds and deploys new version
   - Usually takes 1-2 minutes

4. **Check deployment:**
   - Go to Vercel Dashboard
   - See deployment status
   - Click to view logs if needed

---

## Quick Command Reference

### Initial Setup:

```powershell
# Navigate to project
cd c:\Users\PALLAB\my_self_bot\voice-interview-bot

# Initialize Git (if not done)
git init

# Add files
git add .

# Commit
git commit -m "Initial commit"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/voice-interview-bot.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Future Updates:

```powershell
# After making changes
git add .
git commit -m "Updated features"
git push
```

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Production URL works
- [ ] English voice works
- [ ] Hindi voice works
- [ ] API responses working
- [ ] Memory feature working
- [ ] Chat scrolls properly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Share URL with 100x.inc
- [ ] Add URL to resume/application

---

## Final Production URL Format

Your bot will be accessible at:

```
https://voice-interview-bot-[unique-id].vercel.app
```

**Example:**

```
https://voice-interview-bot-xyz789.vercel.app
```

---

## Summary - Deployment Steps

1. ✅ **Prepare Code** - All files ready
2. ✅ **Initialize Git** - `git init` and commit
3. ✅ **Create GitHub Repo** - On github.com
4. ✅ **Push to GitHub** - `git push`
5. ✅ **Login to Vercel** - Using GitHub
6. ✅ **Import Project** - From GitHub
7. ✅ **Add Environment Variable** - NVIDIA_API_KEY
8. ✅ **Deploy** - Click Deploy button
9. ✅ **Test Production** - Verify everything works
10. ✅ **Share URL** - Send to 100x.inc

---

## Need Help?

**Vercel Documentation:**
https://vercel.com/docs

**Vercel Support:**
https://vercel.com/support

**Common Commands:**

```powershell
# Check Git status
git status

# View Git log
git log --oneline

# View remote
git remote -v

# Pull latest
git pull origin main
```

---

## Ready to Deploy! 🚀

**Next Step:** Follow Step 2 to initialize Git, then proceed with GitHub and Vercel deployment!

Good luck with your deployment! 🎉
