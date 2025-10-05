# Quick Debug Guide - Voice Issues

## Step 1: Open Console

Press **F12** → Click **Console** tab

## Step 2: Look for These Messages

### ✅ GOOD - Everything Working

```
Available voices: [65 items]
Total voices available: 65
Target language: hi-IN
Language code: hi
Voices for hi: ["Microsoft Hemant - Hindi (India)"]
✓ Using voice for hi-IN: Microsoft Hemant - Hindi (India)
```

### ⚠️ WARNING - Using Fallback Voice

```
Voices for hi: ["Microsoft Zira - Hindi (India)"]  ← female voice used
No male voice found, using default voice for language
✓ Using voice for hi-IN: Microsoft Zira - Hindi (India)
```

**Meaning:** Working, but using female voice (no male voice available)

### ❌ ERROR - No Voice for Language

```
Voices for hi: []
✗ No voice found for language: hi-IN
Available language codes: ["en-US", "en-GB", "es-ES", ...]
```

**Meaning:** Hindi language pack NOT installed

### ❌ CRITICAL - No Voices Loaded

```
Total voices available: 0
No voices loaded! This is a critical error.
```

**Meaning:** Browser issue or voices haven't loaded yet

## Step 3: Quick Fixes

| Error Message                        | Fix                                                          |
| ------------------------------------ | ------------------------------------------------------------ |
| `Total voices available: 0`          | Refresh page, wait 2 seconds, try again                      |
| `No voice found for language: hi-IN` | Install Hindi language pack in Windows Settings              |
| `No voice found for language: bn-IN` | Install Bengali language pack in Windows Settings            |
| Voice found but speaks English       | Check if voice name contains "Hindi" or "Bengali" in console |

## Step 4: Install Language Pack

**Windows 10/11:**

1. Settings (Win + I)
2. Time & Language → Language & Region
3. Add a language → Search "Hindi" or "Bengali"
4. ✅ Check "Text-to-speech"
5. Install
6. **Restart browser** (important!)

## Step 5: Verify Installation

In console, look for:

```
Available voices: [
  ...
  { name: "Microsoft Hemant - Hindi (India)", lang: "hi-IN" },
  { name: "Microsoft Prabhat - Bengali (India)", lang: "bn-IN" },
  ...
]
```

## Test Questions

**Hindi:** "तुम कौन हो?" (Who are you?)
**Bengali:** "তুমি কে?" (Who are you?)

Watch console logs while asking these questions.
