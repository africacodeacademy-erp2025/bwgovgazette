-- Add content column to gazettes table for storing extracted text
ALTER TABLE public.gazettes ADD COLUMN content TEXT;

-- Add category column for gazette categorization
ALTER TABLE public.gazettes ADD COLUMN category TEXT;

-- Add description column for gazette descriptions
ALTER TABLE public.gazettes ADD COLUMN description TEXT;

-- Add status column for gazette workflow (draft, published, etc.)
ALTER TABLE public.gazettes ADD COLUMN status TEXT DEFAULT 'draft';

-- Add file_name column to store original filename
ALTER TABLE public.gazettes ADD COLUMN file_name TEXT;

-- Add file_size column to store file size
ALTER TABLE public.gazettes ADD COLUMN file_size BIGINT;

-- Create storage bucket for gazette files
INSERT INTO storage.buckets (id, name, public) VALUES ('gazettes', 'gazettes', true);

-- Create policies for gazette file storage
CREATE POLICY "Anyone can view gazette files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gazettes');

CREATE POLICY "Only admins can upload gazette files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gazettes' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Only admins can update gazette files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gazettes' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Only admins can delete gazette files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gazettes' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));