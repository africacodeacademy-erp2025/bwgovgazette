import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Tender {
  id: string;
  title: string;
  description: string | null;
  deadline: string;
  budget_display: string | null;
  location: string | null;
  category: string | null;
  status: string;
  days_left: number | null;
  created_at: string;
}

export function useTenders() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedTenders, setSavedTenders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTenders();
    fetchSavedTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('tenders')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setTenders(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tenders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedTenders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('saved_tenders')
        .select('tender_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedTenders(new Set(data?.map(item => item.tender_id) || []));
    } catch (err) {
      console.error('Error fetching saved tenders:', err);
    }
  };

  const saveTender = async (tenderId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to save tenders');
        return;
      }

      if (savedTenders.has(tenderId)) {
        // Unsave
        const { error } = await supabase
          .from('saved_tenders')
          .delete()
          .eq('user_id', user.id)
          .eq('tender_id', tenderId);

        if (error) throw error;
        
        setSavedTenders(prev => {
          const newSet = new Set(prev);
          newSet.delete(tenderId);
          return newSet;
        });
        toast.success('Tender removed from saved items');
      } else {
        // Save
        const { error } = await supabase
          .from('saved_tenders')
          .insert({ user_id: user.id, tender_id: tenderId });

        if (error) throw error;
        
        setSavedTenders(prev => new Set(prev).add(tenderId));
        toast.success('Tender saved successfully');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save tender';
      toast.error(errorMessage);
    }
  };

  return { tenders, loading, error, savedTenders, refetch: fetchTenders, saveTender };
}
