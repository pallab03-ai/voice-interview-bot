# Complete Application Testing Guide 🧪

## Testing Checklist for Voice Interview Bot

### Pre-Test Setup

- [x] Development server running on http://localhost:3000
- [ ] Browser console open (F12 → Console tab)
- [ ] Audio/microphone enabled
- [ ] System volume turned up

---

## Test 1: Initial Load ✅

**Purpose:** Verify app loads correctly

**Steps:**

1. Open http://localhost:3000
2. Check page loads without errors
3. Verify UI elements visible:
   - Language selector (English, Hindi, Bengali)
   - Microphone button
   - Text input field
   - Example questions section
   - "Try asking" section visible

**Expected Result:**

- ✅ Page loads successfully
- ✅ No console errors
- ✅ All UI elements visible
- ✅ Default language: English

---

## Test 2: Text Input - English 🇺🇸

**Purpose:** Test text-based conversation in English

**Steps:**

1. Select "English" from language dropdown
2. Type in text field: "Who are you?"
3. Press Enter or click send
4. Wait for response

**Expected Result:**

- ✅ Loading indicator appears
- ✅ Response text displays in chat
- ✅ Voice speaks the response
- ✅ Message appears in conversation history
- ✅ Example questions disappear after first message
- ✅ Chat is scrollable
- ✅ Male voice (David/Mark)

**Watch Console For:**

- No errors
- Speech synthesis completes

---

## Test 3: Voice Input - English 🎤

**Purpose:** Test microphone input

**Steps:**

1. Keep language as "English"
2. Click microphone button (turns blue)
3. Speak: "Tell me about yourself"
4. Stop speaking (mic auto-stops)

**Expected Result:**

- ✅ Microphone button turns blue/active
- ✅ Transcript appears in text input field (auto-fill)
- ✅ Question sent automatically OR manually
- ✅ Response displays and speaks
- ✅ Microphone button returns to normal

**Watch Console For:**

- Speech recognition working
- No speech errors

---

## Test 4: Hindi Voice 🇮🇳

**Purpose:** Test Hindi language support

**Steps:**

1. Select "हिंदी (Hindi)" from dropdown
2. Type: "तुम कौन हो?" (Who are you?)
3. Press Enter
4. Listen to voice response

**Expected Result:**

- ✅ Response in Hindi text
- ✅ Voice speaks in Hindi (Google हिन्दी)
- ✅ Hindi pronunciation correct
- ✅ Response makes sense in Hindi

**Watch Console For:**

- Voice selection (should show Hindi voice)
- No voice errors

---

## Test 5: Bengali Voice 🇧🇩

**Purpose:** Test Bengali language support

**Steps:**

1. Select "বাংলা (Bengali)" from dropdown
2. Type: "তুমি কে?" (Who are you?)
3. Press Enter
4. Check response

**Expected Result:**
If Bengali voice pack installed:

- ✅ Response in Bengali text
- ✅ Voice speaks in Bengali
- ✅ Bengali pronunciation correct

If NOT installed:

- ✅ Response in Bengali text
- ⚠️ Voice speaks in English (fallback)
- ⚠️ Console shows: No voice found for bn-IN

---

## Test 6: Conversation Memory 💭

**Purpose:** Test if bot remembers conversation context

**Steps:**

1. Select English
2. Ask: "What is your name?"
3. Wait for response
4. Ask: "What did I just ask you?"
5. Check if bot remembers

**Expected Result:**

- ✅ Bot remembers previous question
- ✅ Bot references earlier conversation
- ✅ All messages visible in chat history
- ✅ Conversation flows naturally

---

## Test 7: Chat History & Scrolling 📜

**Purpose:** Test scrollable chat with multiple messages

**Steps:**

1. Ask 5+ questions in a row:
   - "Who are you?"
   - "What technologies do you know?"
   - "Tell me about React"
   - "What is your experience?"
   - "Why should I hire you?"
2. Observe chat window

**Expected Result:**

- ✅ All messages visible in chat
- ✅ Chat window scrollable (250px max height)
- ✅ Auto-scrolls to latest message
- ✅ Smooth scrolling behavior
- ✅ Custom scrollbar styling
- ✅ Oldest messages at top, newest at bottom

---

## Test 8: Clear Memory Button 🗑️

**Purpose:** Test conversation reset

**Steps:**

1. Have 3+ messages in conversation
2. Note the message counter "(3 messages)"
3. Click "Clear Memory" button
4. Observe changes

**Expected Result:**

- ✅ All chat messages disappear
- ✅ Message counter resets to "(0 messages)"
- ✅ Example questions reappear
- ✅ Chat history empty
- ✅ Next question starts fresh conversation

---

## Test 9: Example Questions ❓

**Purpose:** Test quick question buttons

**Steps:**

1. Clear memory if needed
2. Verify example questions visible
3. Click one example question
4. Check if it auto-fills or sends

**Expected Result:**

- ✅ Example questions visible initially
- ✅ Clicking example fills/sends question
- ✅ Examples disappear after first interaction
- ✅ Examples reappear after clearing memory

---

## Test 10: Language Switching 🔄

**Purpose:** Test switching between languages mid-conversation

**Steps:**

1. Start in English, ask 2 questions
2. Switch to Hindi, ask 1 question
3. Switch back to English, ask 1 question
4. Check conversation history

**Expected Result:**

- ✅ Language switch works smoothly
- ✅ Voice changes to match language
- ✅ Responses in correct language
- ✅ Memory maintained across language switches
- ✅ Chat history shows mixed languages

---

## Test 11: Error Handling ⚠️

**Purpose:** Test error scenarios

**Test A - Network Error:**

1. Disconnect internet (or stop API server)
2. Try asking a question
3. Check error message

**Expected Result:**

- ✅ Error message displays
- ⚠️ Shows: "Failed to get response: ..."
- ✅ App doesn't crash
- ✅ Can retry after reconnecting

**Test B - Speech Error:**

1. Mute system volume
2. Ask a question
3. Check if text still displays

**Expected Result:**

- ✅ Text response displays
- ✅ Speech fails silently
- ✅ No error shown to user
- ✅ Console may show speech error (hidden from UI)

---

## Test 12: UI Responsiveness 📱

**Purpose:** Test responsive design

**Steps:**

1. Resize browser window (small, medium, large)
2. Test on different screen sizes
3. Check mobile view (F12 → Device Toolbar)

**Expected Result:**

- ✅ Chat width: 100% (full width)
- ✅ Chat height: 250px max
- ✅ Elements don't overflow
- ✅ Buttons remain clickable
- ✅ Text readable at all sizes

---

## Test 13: Anti-Hallucination System 🛡️

**Purpose:** Verify bot stays on-topic

**Steps:**

1. Ask relevant questions about the candidate
2. Try irrelevant questions:
   - "What's the weather?"
   - "Tell me a joke"
   - "What's 2+2?"
3. Check responses

**Expected Result:**

- ✅ Relevant questions answered properly
- ✅ Irrelevant questions redirected to job/profile
- ✅ Bot stays in character (job candidate)
- ✅ No random hallucinations

---

## Test 14: Performance & Speed ⚡

**Purpose:** Test response times

**Steps:**

1. Ask 5 questions in quick succession
2. Measure approximate response time
3. Check for lag or delays

**Expected Result:**

- ✅ Responses within 2-5 seconds
- ✅ UI remains responsive
- ✅ No freezing or hanging
- ✅ Smooth voice playback
- ✅ No memory leaks (check Task Manager)

---

## Test 15: Browser Compatibility 🌐

**Purpose:** Test across browsers

**Browsers to Test:**

- [ ] Chrome (recommended)
- [ ] Edge (Windows)
- [ ] Firefox
- [ ] Safari (if on Mac)

**For Each Browser:**

1. Load app
2. Test voice input
3. Test voice output
4. Check for errors

**Expected Result:**

- ✅ Works best in Chrome/Edge
- ⚠️ Firefox may have limited voice support
- ⚠️ Safari may have restrictions

---

## Quick Test Sequence (5 minutes)

For rapid testing, do this:

1. **Load:** Open http://localhost:3000 ✅
2. **English Text:** Type "Who are you?" → Response ✅
3. **English Voice:** Click mic, speak "What do you do?" → Response ✅
4. **Hindi:** Switch to Hindi, type "नमस्ते" → Response ✅
5. **Memory:** Ask "What did I ask before?" → Remembers ✅
6. **Clear:** Click Clear Memory → Resets ✅
7. **Scroll:** Ask 5 questions → Scrollable ✅

---

## Console Checks During Testing

**Good Signs (No Issues):**

```
✓ No errors in console
✓ Only error logs for actual problems
✓ Speech synthesis working
✓ API calls successful (200 OK)
```

**Bad Signs (Need Fixing):**

```
✗ React errors
✗ API errors (500, 404)
✗ Speech synthesis failures
✗ Memory leaks or warnings
```

---

## Success Criteria

**Minimum Passing Requirements:**

- ✅ All English features work (text + voice)
- ✅ Hindi voice works (if installed)
- ✅ Memory persists across questions
- ✅ Chat history scrollable
- ✅ Clear memory button works
- ✅ No critical console errors
- ✅ UI responsive and clean
- ✅ Voice switches with language

**Bonus Points:**

- ✅ Bengali voice works (if installed)
- ✅ Fast response times (<3 sec)
- ✅ Zero console errors
- ✅ Works across all browsers
- ✅ Perfect pronunciation in all languages

---

## Bug Reporting Template

If you find issues, report using this format:

**Bug:**
[Describe the issue]

**Steps to Reproduce:**

1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected:**
[What should happen]

**Actual:**
[What actually happened]

**Console Errors:**
[Paste any console errors]

**Environment:**

- Browser: [Chrome/Edge/etc]
- Language: [English/Hindi/Bengali]
- Test: [Which test number]

---

## Final Checklist Before Production

- [ ] All 15 tests pass
- [ ] No console errors
- [ ] Voice works in all languages (with packs installed)
- [ ] Memory feature working
- [ ] UI looks professional
- [ ] Fast and responsive
- [ ] Anti-hallucination working
- [ ] Ready to deploy to Vercel

---

## Start Testing! 🚀

Open the app: **http://localhost:3000**

Start with Test 1 and work through the list. Good luck! 🎯
