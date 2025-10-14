import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Gazette {
  id: string;
  file_name: string;
  file_url: string;
  created_at: string;
  pricing_tier?: 'free' | 'premium';
  processing_status?: string;
  extracted_text?: string;
}

export function useGazettes() {
  const [gazettes, setGazettes] = useState<Gazette[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGazettes();
  }, []);

  const fetchGazettes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('gazettes')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setGazettes(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch gazettes';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { gazettes, loading, error, refetch: fetchGazettes };
}
