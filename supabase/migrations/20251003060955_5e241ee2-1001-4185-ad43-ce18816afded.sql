-- Enable SELECT access to gazettes table for all authenticated and anonymous users
CREATE POLICY "Anyone can view gazettes"
ON public.gazettes
FOR SELECT
USING (true);

-- Allow authenticated users to insert gazettes (for admin functionality)
CREATE POLICY "Authenticated users can insert gazettes"
ON public.gazettes
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update gazettes
CREATE POLICY "Authenticated users can update gazettes"
ON public.gazettes
FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete gazettes
CREATE POLICY "Authenticated users can delete gazettes"
ON public.gazettes
FOR DELETE
TO authenticated
USING (true);