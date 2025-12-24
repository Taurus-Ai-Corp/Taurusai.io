# AI Chat Widget Testing Guide

## Overview
Your Taurus AI Corp website now features an AI-powered chat widget with:
- **Groq API** for fast chat responses (llama-3.3-70b-versatile)
- **Ollama** for local embeddings (unlimited, no rate limits)
- **19 knowledge base documents** covering products, FAQs, and use cases
- **Human escalation** for complex queries

---

## Step-by-Step Testing Instructions

### 1. Access the Website
Open your browser and navigate to:
```
https://3000-ippl5yirm9j9hxxzm1k2s-e501da14.us2.manus.computer
```

### 2. Locate the Chat Widget
- Look for a **floating chat button** in the bottom-right corner of the page
- The button should display a message icon
- It appears on all pages (home, products, contact, etc.)

### 3. Open the Chat Window
- Click the floating chat button
- A chat window will slide up from the bottom
- You should see:
  - Chat header with "Taurus AI Assistant"
  - Message input field at the bottom
  - Welcome message from the AI

---

## Test Scenarios

### Test 1: Product Information Query
**Goal:** Verify AI retrieves accurate product information from knowledge base

**Steps:**
1. Type: `What is BizFlow AI?`
2. Press Enter or click Send
3. Wait for AI response (should take 2-5 seconds)

**Expected Result:**
- AI should describe BizFlow AI as an enterprise business workflow automation platform
- Should mention key features like intelligent document processing, workflow orchestration
- Response should be contextual and accurate

### Test 2: Pricing Query
**Goal:** Test semantic search for pricing information

**Steps:**
1. Type: `How much does Q-Grid cost?`
2. Send the message

**Expected Result:**
- AI should provide pricing information or mention custom enterprise pricing
- Should reference Q-Grid specifically
- May mention features like post-quantum cryptography, 99.9% uptime SLA

### Test 3: FAQ Query
**Goal:** Verify FAQ content retrieval

**Steps:**
1. Type: `How long does implementation take?`
2. Send the message

**Expected Result:**
- AI should provide implementation timeframes
- Should mention different products (BizFlow AI: 4-8 weeks, Q-Grid: 6-10 weeks, etc.)
- Should differentiate between standard and enterprise implementations

### Test 4: Multi-turn Conversation
**Goal:** Test conversation context retention

**Steps:**
1. Type: `Tell me about NeoVibe`
2. Wait for response
3. Then type: `What are its main features?`
4. Wait for response

**Expected Result:**
- First response should describe NeoVibe as a creative AI platform
- Second response should list features (multi-modal AI, brand consistency, templates)
- AI should understand "its" refers to NeoVibe from previous message

### Test 5: Security/Compliance Query
**Goal:** Test technical knowledge retrieval

**Steps:**
1. Type: `Is Q-Grid compliant with NIST post-quantum cryptography standards?`
2. Send the message

**Expected Result:**
- AI should confirm NIST PQC compliance
- May mention SWIFT 2027 deadline, RSA-2048 expiration
- Should reference quantum-safe encryption algorithms

### Test 6: Human Escalation - Direct Request
**Goal:** Test escalation trigger for human support requests

**Steps:**
1. Type: `I need to speak with a human representative`
2. Send the message

**Expected Result:**
- AI should recognize the escalation request
- Should display a message offering to connect you with human support
- May show an "Escalate to Human" button or similar UI element
- The `shouldEscalate` flag should be set to `true` internally

### Test 7: Human Escalation - Complex Query
**Goal:** Test automatic escalation for queries AI can't handle

**Steps:**
1. Type: `I want to negotiate a custom enterprise contract for 50,000 users with specific SLA requirements`
2. Send the message

**Expected Result:**
- AI may attempt to provide general information
- Should suggest speaking with sales team or human representative
- May offer escalation option

### Test 8: Out-of-Scope Query
**Goal:** Test AI's handling of unrelated questions

**Steps:**
1. Type: `What's the weather like today?`
2. Send the message

**Expected Result:**
- AI should politely indicate it specializes in Taurus AI products
- Should offer to answer questions about BizFlow AI, Q-Grid, NeoVibe, or AssetGrid
- Should not make up information

### Test 9: Contact Information Query
**Goal:** Test company information retrieval

**Steps:**
1. Type: `How can I contact Taurus AI?`
2. Send the message

**Expected Result:**
- AI should provide contact email: taurus.ai@taas-ai.com
- May mention requesting a demo or consultation through the website
- Should reference 24-hour response time during business days

### Test 10: Use Case Query
**Goal:** Test industry-specific knowledge

**Steps:**
1. Type: `How can Taurus AI help financial institutions?`
2. Send the message

**Expected Result:**
- AI should mention quantum-safe encryption for SWIFT 2027 deadline
- Should reference BizFlow AI for compliance automation
- May mention fraud detection, transaction processing use cases

---

## Admin Dashboard Testing

### Access Admin Chat Dashboard
1. Navigate to: `https://3000-ippl5yirm9j9hxxzm1k2s-e501da14.us2.manus.computer/admin/chats`
2. You should see a list of all active chat sessions
3. Each chat should show:
   - Customer name (or "Anonymous")
   - Last message preview
   - Timestamp
   - Escalation status (if escalated)

### Test Human Takeover
1. Open a chat from the admin dashboard
2. You should see the full conversation history
3. Type a response as admin
4. The response should appear in the customer's chat window in real-time
5. Customer should see "Human Support" indicator

---

## Technical Verification

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for:
   - No JavaScript errors
   - Successful tRPC connections
   - WebSocket connections for real-time chat (if applicable)

### Check Network Tab
1. Open DevTools Network tab
2. Send a chat message
3. Look for:
   - POST request to `/api/trpc/aiChat.sendMessage`
   - Response status: 200 OK
   - Response time: < 5 seconds

### Verify Ollama Embeddings
1. Check server logs for: `Ollama embedding dimensions: 768`
2. No "rate limit" errors should appear
3. Embeddings should be generated locally (fast, no API calls)

### Verify Groq Chat
1. Server logs should show: `Groq response: ...`
2. No "Too Many Requests" errors
3. Response time should be 1-3 seconds (Groq is fast)

---

## Troubleshooting

### Chat Widget Not Appearing
- Check browser console for JavaScript errors
- Verify dev server is running
- Clear browser cache and reload

### AI Not Responding
- Check if Ollama service is running: `systemctl status ollama`
- Verify Groq API key is set: Check environment variables
- Check server logs for error messages

### Slow Responses
- First response may be slower (model loading)
- Subsequent responses should be faster
- Check network connection

### Escalation Not Working
- Verify Supabase connection
- Check `chat_rooms` and `chat_participants` tables exist
- Verify admin user has proper permissions

### Knowledge Base Not Working
- Run SQL migration in Supabase: `supabase-migration.sql`
- Verify 19 documents are in `documents` table
- Check `match_documents` function exists

---

## Expected Performance Metrics

- **Chat Response Time:** 2-5 seconds
- **Embedding Generation:** < 1 second (local Ollama)
- **Semantic Search:** < 500ms
- **Real-time Message Delivery:** < 100ms
- **Escalation Detection:** Instant

---

## Success Criteria

✅ Chat widget appears on all pages  
✅ AI responds with accurate product information  
✅ Semantic search retrieves relevant context  
✅ Conversation history is maintained  
✅ Human escalation triggers correctly  
✅ Admin dashboard shows all chats  
✅ No rate limit errors  
✅ Response times are acceptable  

---

## Next Steps After Testing

1. **Run Supabase Migration:** Execute `supabase-migration.sql` to enable semantic search
2. **Add More Knowledge:** Seed additional documents (blog posts, case studies, technical specs)
3. **Customize Responses:** Adjust system prompts in `chatService.ts` for brand voice
4. **Monitor Usage:** Track chat metrics (escalation rate, common questions, response times)
5. **Improve Knowledge Base:** Add documents for frequently asked questions
6. **Set Up Notifications:** Integrate real-time alerts for escalated chats

---

## Support

If you encounter any issues during testing:
- Check server logs: `cd /home/ubuntu/taurus_ai_corp && pnpm logs`
- Restart dev server: Use Manus UI or `pnpm dev`
- Review error messages in browser console
- Contact support for assistance

---

**Testing Date:** December 24, 2025  
**Version:** e677db49  
**Status:** Ready for Testing ✅
