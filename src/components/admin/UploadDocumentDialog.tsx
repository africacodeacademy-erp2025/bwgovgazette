import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentUploaded: (document: any) => void;
}

export default function UploadDocumentDialog({ open, onOpenChange, onDocumentUploaded }: UploadDocumentDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    category: '',
    description: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-populate title from filename
      if (!uploadData.title) {
        setUploadData({ ...uploadData, title: file.name.replace(/\.[^/.]+$/, "") });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      if (!uploadData.title) {
        setUploadData({ ...uploadData, title: file.name.replace(/\.[^/.]+$/, "") });
      }
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

    setIsUploading(true);

    // Simulate file upload
    setTimeout(() => {
      const newDocument = {
        id: Date.now().toString(),
        title: uploadData.title,
        category: uploadData.category,
        status: 'Draft',
        date: new Date().toISOString().split('T')[0],
        downloads: 0,
        fileName: selectedFile.name,
        fileSize: (selectedFile.size / 1024).toFixed(2) + ' KB',
        description: uploadData.description
      };

      onDocumentUploaded(newDocument);
      toast({
        title: "Document Uploaded",
        description: `${selectedFile.name} has been uploaded successfully.`,
      });
      
      // Reset form
      setSelectedFile(null);
      setUploadData({ title: '', category: '', description: '' });
      setIsUploading(false);
      onOpenChange(false);
    }, 1500);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a new document to create a gazette from existing content.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff"
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
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
                      PDF, DOC, DOCX, TXT, or image files (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="upload-title">Title</Label>
              <Input
                id="upload-title"
                value={uploadData.title}
                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                placeholder="Document title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upload-category">Category</Label>
              <Select value={uploadData.category} onValueChange={(value) => setUploadData({ ...uploadData, category: value })}>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="upload-description">Description</Label>
            <Input
              id="upload-description"
              value={uploadData.description}
              onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
              placeholder="Brief description of the document"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || !selectedFile}>
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}