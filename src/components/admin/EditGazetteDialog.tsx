import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Simplified interface for editing
interface Gazette {
  id: string;
  file_name: string;
}

interface EditGazetteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gazette: Gazette | null;
  onGazetteUpdated: () => void;
}

export default function EditGazetteDialog({ open, onOpenChange, gazette, onGazetteUpdated }: EditGazetteDialogProps) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (gazette) {
      setTitle(gazette.file_name);
    }
  }, [gazette]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gazette) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('documents')
        .update({ file_name: title })
        .eq('id', gazette.id);

      if (error) throw error;

      onGazetteUpdated();
      toast({
        title: 'Gazette Updated',
        description: 'The gazette has been updated successfully.',
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating gazette:', error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Gazette</DialogTitle>
          <DialogDescription>
            Update the details of the gazette.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter gazette title"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}