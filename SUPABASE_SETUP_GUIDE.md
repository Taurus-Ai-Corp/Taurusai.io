# Supabase Setup Guide for Taurus AI Corp

## Overview
This guide will help you set up Supabase for your Taurus AI Corp website to enable:
- **Real-time AI Chat Widget** with Groq + Ollama
- **Semantic Search** across 19 knowledge base documents
- **Real-time Notifications**
- **Admin Chat Dashboard**

---

## Step 1: Access Your Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Sign in to your account
3. Select your project: **zcyxbqwegqzqfsrxpjeq**

---

## Step 2: Create Required Tables

### 2.1 Enable Vector Extension

Go to **SQL Editor** and run:

```sql
-- Enable the pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2.2 Create Documents Table

```sql
-- Table for storing knowledge base documents with embeddings
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  embedding vector(1536) NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  product_slug text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster vector similarity search
CREATE INDEX IF NOT EXISTS documents_embedding_idx 
  ON documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Create index for product filtering
CREATE INDEX IF NOT EXISTS documents_product_slug_idx 
  ON documents(product_slug);
```

### 2.3 Create Chat Tables

```sql
-- Chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('support', 'sales', 'general')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'escalated')),
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chat participants table
CREATE TABLE IF NOT EXISTS chat_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  user_name text NOT NULL,
  joined_at timestamptz DEFAULT now()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id text NOT NULL,
  sender_name text NOT NULL,
  content text NOT NULL,
  message_type text DEFAULT 'user' CHECK (message_type IN ('user', 'ai', 'human', 'system')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS chat_messages_room_id_idx ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS chat_participants_room_id_idx ON chat_participants(room_id);
```

### 2.4 Create Notifications Table

```sql
-- Notifications table for real-time alerts
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  type text NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'message')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read);
```

---

## Step 3: Create the match_documents Function

This function enables semantic search across your knowledge base.

```sql
-- Create the match_documents function for vector similarity search
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_product text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  product_slug text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    documents.metadata,
    documents.product_slug,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 
    (filter_product IS NULL OR documents.product_slug = filter_product)
    AND 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION match_documents TO authenticated;
GRANT EXECUTE ON FUNCTION match_documents TO anon;
```

---

## Step 4: Set Up Row Level Security (RLS)

### 4.1 Enable RLS on All Tables

```sql
-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
```

### 4.2 Create RLS Policies

```sql
-- Documents: Allow public read access
CREATE POLICY "Allow public read access to documents"
  ON documents FOR SELECT
  USING (true);

-- Documents: Allow service role to insert/update
CREATE POLICY "Allow service role to manage documents"
  ON documents FOR ALL
  USING (auth.role() = 'service_role');

-- Chat rooms: Allow anyone to create and read
CREATE POLICY "Allow anyone to create chat rooms"
  ON chat_rooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anyone to read chat rooms"
  ON chat_rooms FOR SELECT
  USING (true);

-- Chat participants: Allow anyone to join
CREATE POLICY "Allow anyone to join chat"
  ON chat_participants FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anyone to read participants"
  ON chat_participants FOR SELECT
  USING (true);

-- Chat messages: Allow anyone to send and read messages
CREATE POLICY "Allow anyone to send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anyone to read messages"
  ON chat_messages FOR SELECT
  USING (true);

-- Notifications: Users can only read their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Service role can create notifications for any user
CREATE POLICY "Service role can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
```

---

## Step 5: Verify the Setup

### 5.1 Check Tables

Run this query to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('documents', 'chat_rooms', 'chat_participants', 'chat_messages', 'notifications')
ORDER BY table_name;
```

Expected output:
```
chat_messages
chat_participants
chat_rooms
documents
notifications
```

### 5.2 Check Function

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'match_documents';
```

Expected output:
```
match_documents
```

### 5.3 Check Vector Extension

```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

Should return one row with the vector extension.

---

## Step 6: Verify Knowledge Base Documents

Check if the 19 documents were successfully seeded:

```sql
SELECT 
  COUNT(*) as total_documents,
  COUNT(DISTINCT metadata->>'type') as document_types,
  COUNT(DISTINCT product_slug) as products
FROM documents;
```

Expected output:
```
total_documents: 19
document_types: 4 (product, faq, company, usecase)
products: 5 (bizflow-ai, q-grid, neovibe, assetgrid, null)
```

### View All Documents

```sql
SELECT 
  id,
  LEFT(content, 100) as content_preview,
  metadata->>'type' as type,
  metadata->>'slug' as slug,
  product_slug,
  created_at
FROM documents
ORDER BY created_at DESC;
```

---

## Step 7: Test Semantic Search

Test the `match_documents` function with a sample query:

```sql
-- First, get a sample embedding from an existing document
WITH sample_embedding AS (
  SELECT embedding FROM documents LIMIT 1
)
SELECT 
  LEFT(content, 150) as content_preview,
  metadata->>'slug' as slug,
  product_slug,
  similarity
FROM match_documents(
  (SELECT embedding FROM sample_embedding),
  0.5,  -- match_threshold
  5     -- match_count
);
```

This should return 5 similar documents.

---

## Step 8: Enable Realtime

1. Go to **Database** → **Replication** in Supabase Dashboard
2. Enable realtime for these tables:
   - `chat_messages`
   - `chat_rooms`
   - `notifications`

---

## Step 9: Get Service Role Key

1. Go to **Settings** → **API** in Supabase Dashboard
2. Copy the **service_role** key (secret key)
3. Add it to your Manus project environment variables:
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your actual service role key)

---

## Step 10: Restart Your Dev Server

After completing all the above steps, restart your Manus dev server to apply the changes.

---

## Troubleshooting

### Issue: "relation 'documents' does not exist"
**Solution:** Run Step 2.2 to create the documents table.

### Issue: "function match_documents does not exist"
**Solution:** Run Step 3 to create the function.

### Issue: "extension 'vector' does not exist"
**Solution:** Run Step 2.1 to enable the pgvector extension.

### Issue: "permission denied for table documents"
**Solution:** Run Step 4 to set up RLS policies.

### Issue: "No documents found"
**Solution:** Re-run the knowledge base seeding script:
```bash
cd /home/ubuntu/taurus_ai_corp
node --import tsx scripts/seed-knowledge-base.ts
```

---

## Next Steps After Setup

1. **Test the AI Chat Widget**
   - Open your website
   - Click the cyan chat button in the bottom-right corner
   - Ask: "What is BizFlow AI?"
   - Ask: "How much does Q-Grid cost?"
   - Test escalation: "I need to speak with a human"

2. **Access Admin Dashboard**
   - Go to: `/admin/chats`
   - View all active chat sessions
   - Take over AI chats when escalated

3. **Monitor Usage**
   - Check Supabase Dashboard → **Database** → **Table Editor**
   - View `chat_messages` table for conversation history
   - View `documents` table for knowledge base content

---

## Support

If you encounter any issues:
- Check Supabase logs in the Dashboard
- Review browser console for errors
- Check server logs in Manus
- Verify all environment variables are set correctly

---

**Setup Date:** December 24, 2025  
**Project:** Taurus AI Corp  
**Supabase Project:** zcyxbqwegqzqfsrxpjeq  
**Status:** Ready for Setup ✅
