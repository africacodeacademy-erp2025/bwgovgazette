-- Create saved_gazettes table for user bookmarks
CREATE TABLE IF NOT EXISTS public.saved_gazettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  gazette_id UUID NOT NULL REFERENCES public.gazettes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, gazette_id)
);

-- Enable RLS
ALTER TABLE public.saved_gazettes ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved items
CREATE POLICY "Users can view their own saved gazettes"
ON public.saved_gazettes
FOR SELECT
USING (auth.uid() = user_id);

-- Users can save gazettes
CREATE POLICY "Users can save gazettes"
ON public.saved_gazettes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can unsave gazettes
CREATE POLICY "Users can unsave gazettes"
ON public.saved_gazettes
FOR DELETE
USING (auth.uid() = user_id);