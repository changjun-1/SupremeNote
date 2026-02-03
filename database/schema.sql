-- ================================================
-- SupremeNote Database Schema for Supabase
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector extension for future RAG implementation
CREATE EXTENSION IF NOT EXISTS vector;

-- ================================================
-- 1. Users Table (Managed by Supabase Auth)
-- ================================================
-- Supabase Auth automatically manages the auth.users table
-- We'll create a public.profiles table for additional user data

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ================================================
-- 2. Notes Table (Core Knowledge Data)
-- ================================================

CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Source Information
  title TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('youtube', 'pdf', 'ppt', 'docx', 'text')),
  source_url TEXT,  -- YouTube URL or file path
  
  -- Supreme Instruction (사용자 맞춤 명령)
  instruction TEXT,  -- User's custom instruction for AI processing
  
  -- Generated Content
  content_md TEXT,  -- AI-generated Markdown summary
  mermaid_code TEXT,  -- Mermaid.js diagram code
  
  -- Metadata
  thumbnail_url TEXT,  -- YouTube thumbnail or document preview
  duration INTEGER,  -- Video duration in seconds (for YouTube)
  file_size INTEGER,  -- File size in bytes (for documents)
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Search optimization
  search_vector tsvector
);

-- Create index for full-text search
CREATE INDEX notes_search_idx ON public.notes USING GIN (search_vector);

-- Create index for user queries
CREATE INDEX notes_user_id_idx ON public.notes(user_id);

-- Create index for created_at (for sorting)
CREATE INDEX notes_created_at_idx ON public.notes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Notes RLS Policies
CREATE POLICY "Users can view their own notes"
  ON public.notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
  ON public.notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON public.notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON public.notes FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- 3. Embeddings Table (For Future RAG)
-- ================================================

CREATE TABLE IF NOT EXISTS public.embeddings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE NOT NULL,
  
  -- Chunk Information
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  
  -- Vector Embedding
  embedding vector(1536),  -- OpenAI ada-002 dimension or Gemini embedding
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for vector similarity search
CREATE INDEX embeddings_vector_idx ON public.embeddings 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Create index for note queries
CREATE INDEX embeddings_note_id_idx ON public.embeddings(note_id);

-- Enable Row Level Security
ALTER TABLE public.embeddings ENABLE ROW LEVEL SECURITY;

-- Embeddings RLS Policies (inherit from notes)
CREATE POLICY "Users can view embeddings of their own notes"
  ON public.embeddings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.notes
      WHERE notes.id = embeddings.note_id
      AND notes.user_id = auth.uid()
    )
  );

-- ================================================
-- 4. Functions & Triggers
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for notes table
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_notes_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.content_md, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.instruction, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update search vector
CREATE TRIGGER update_notes_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, content_md, instruction
  ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION update_notes_search_vector();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- 5. Sample Data (Optional - for testing)
-- ================================================

-- Uncomment to insert sample data
/*
INSERT INTO public.notes (user_id, title, source_type, source_url, instruction, content_md, mermaid_code)
VALUES (
  auth.uid(),
  'Sample Note',
  'youtube',
  'https://www.youtube.com/watch?v=example',
  '이 영상의 핵심 개념을 5가지로 요약해주세요',
  '# Sample Summary\n\n- Point 1\n- Point 2',
  'graph TD\n  A[Start] --> B[End]'
);
*/

-- ================================================
-- End of Schema
-- ================================================
