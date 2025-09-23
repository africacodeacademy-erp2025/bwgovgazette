-- Add content column to gazettes table for storing extracted text
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS content TEXT;

-- Add category column for gazette categorization
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS category TEXT;

-- Add description column for gazette descriptions
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS description TEXT;

-- Add status column for gazette workflow (draft, published, etc.)
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';

-- Add file_name column to store original filename
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS file_name TEXT;

-- Add file_size column to store file size
ALTER TABLE public.gazettes ADD COLUMN IF NOT EXISTS file_size BIGINT;