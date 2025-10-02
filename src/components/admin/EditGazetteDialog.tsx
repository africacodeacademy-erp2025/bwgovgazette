import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface GazetteCard {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
}

interface EditGazetteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gazette: GazetteCard | null;
  onGazetteUpdated: (gazette: GazetteCard) => void;
}

import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditGazetteDialog({ open, onOpenChange, gazette, onGazetteUpdated }: EditGazetteDialogProps) {
  const [formData, setFormData] = useState({ title: '', description: '', category: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (gazette) {
      setFormData({
        title: gazette.title,
        description: gazette.description,
        category: gazette.category,
      });
    }
  }, [gazette]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gazette) return;

    setIsSubmitting(true);
    const updatedGazette = { ...gazette, ...formData };
    onGazetteUpdated(updatedGazette);
    toast({
      title: 'Gazette Updated',
      description: 'The gazette has been updated successfully.',
    });
    onOpenChange(false);
    setIsSubmitting(false);
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
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter gazette title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the gazette"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
                <SelectItem value="Environment">Environment</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
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