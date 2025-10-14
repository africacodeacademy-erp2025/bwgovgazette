-- Create tenders table
CREATE TABLE public.tenders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  deadline date NOT NULL,
  budget_min numeric,
  budget_max numeric,
  budget_display text,
  location text,
  category text,
  status text DEFAULT 'Open',
  days_left integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view tenders
CREATE POLICY "Anyone can view tenders"
  ON public.tenders
  FOR SELECT
  USING (true);

-- Only authenticated users can insert tenders
CREATE POLICY "Authenticated users can insert tenders"
  ON public.tenders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update tenders
CREATE POLICY "Authenticated users can update tenders"
  ON public.tenders
  FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete tenders
CREATE POLICY "Authenticated users can delete tenders"
  ON public.tenders
  FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_tenders_updated_at
  BEFORE UPDATE ON public.tenders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create saved_tenders table for users to save tenders
CREATE TABLE public.saved_tenders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tender_id uuid NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, tender_id)
);

-- Enable RLS
ALTER TABLE public.saved_tenders ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved tenders
CREATE POLICY "Users can view their own saved tenders"
  ON public.saved_tenders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can save tenders
CREATE POLICY "Users can save tenders"
  ON public.saved_tenders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can unsave tenders
CREATE POLICY "Users can unsave tenders"
  ON public.saved_tenders
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO public.tenders (title, description, deadline, budget_display, location, category, status, days_left) VALUES
('Road Construction Project - Phase 2', 'Construction and maintenance of 50km highway connecting major cities', '2024-12-15', 'BWP 2.5M - 5M', 'Northern Province', 'Infrastructure', 'Open', 5),
('IT Infrastructure Upgrade', 'Modernization of government IT systems and network infrastructure', '2024-12-20', 'BWP 850K - 1.2M', 'Gaborone', 'Technology', 'Open', 10),
('Hospital Equipment Procurement', 'Supply and installation of medical equipment for regional hospitals', '2024-12-18', 'BWP 3M - 4M', 'Southern Province', 'Healthcare', 'Open', 8),
('School Building Construction', 'Construction of 5 new primary schools in rural areas', '2024-12-25', 'BWP 5M - 8M', 'Central District', 'Education', 'Open', 15);