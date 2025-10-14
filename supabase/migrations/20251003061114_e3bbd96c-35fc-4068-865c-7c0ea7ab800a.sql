-- Enable RLS on all public tables that don't have it yet
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxonomies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxonomy_nodes ENABLE ROW LEVEL SECURITY;

-- Create policies for read access (these tables don't contain PII)
CREATE POLICY "Anyone can view countries"
ON public.countries FOR SELECT USING (true);

CREATE POLICY "Anyone can view document chunks"
ON public.document_chunks FOR SELECT USING (true);

CREATE POLICY "Anyone can view document classifications"
ON public.document_classifications FOR SELECT USING (true);

CREATE POLICY "Anyone can view document tags"
ON public.document_tags FOR SELECT USING (true);

CREATE POLICY "Anyone can view document texts"
ON public.document_texts FOR SELECT USING (true);

CREATE POLICY "Anyone can view documents"
ON public.documents FOR SELECT USING (true);

CREATE POLICY "Anyone can view taxonomies"
ON public.taxonomies FOR SELECT USING (true);

CREATE POLICY "Anyone can view taxonomy nodes"
ON public.taxonomy_nodes FOR SELECT USING (true);

-- Allow authenticated users to manage these tables
CREATE POLICY "Authenticated users can insert documents"
ON public.documents FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents"
ON public.documents FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete documents"
ON public.documents FOR DELETE TO authenticated USING (true);