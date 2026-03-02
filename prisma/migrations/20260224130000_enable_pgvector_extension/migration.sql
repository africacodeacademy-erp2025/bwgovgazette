-- Enable pgvector extension safely.
--
-- Requirements:
-- 1. Create extension only if not exists
-- 2. Do not error if already installed
-- 3. Compatible with Supabase PostgreSQL

CREATE EXTENSION IF NOT EXISTS vector;
