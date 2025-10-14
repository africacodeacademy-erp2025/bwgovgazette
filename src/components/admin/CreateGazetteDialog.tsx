import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateGazetteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGazetteCreated: (gazette: any) => void;
}

export default function CreateGazetteDialog({ open, onOpenChange, onGazetteCreated }: CreateGazetteDialogProps) {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;
    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title || selectedFile.name.replace(/\.[^/.]+$/, ''));

      const response = await fetch('https://govgazette-api.africacodefoundry.com/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'File upload failed');
      }

      const newGazette = await response.json();

      onGazetteCreated(newGazette);

      toast({
        title: 'Gazette Created',
        description: `${title || selectedFile.name} has been created successfully.`,
      });

      // Reset form
      setSelectedFile(null);
      setTitle('');
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error creating gazette:', error);
      toast({
        title: 'Creation Failed',
        description: error.message || 'Failed to create gazette.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Gazette</DialogTitle>
          <DialogDescription>
            Upload a document to create a new gazette.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter gazette title (defaults to filename)"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Document</Label>
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff"
                className="hidden"
              />
              {selectedFile ? (
                <div className="space-y-2">
                  <FileText className="mx-auto h-12 w-12 text-primary" />
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX, TXT, or image files.
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedFile}>
              {isSubmitting ? 'Creating...' : 'Create Gazette'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}