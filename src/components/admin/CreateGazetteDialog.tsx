import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, X, FileUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateGazetteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGazetteCreated: (gazette: any) => void;
}

export default function CreateGazetteDialog({ open, onOpenChange, onGazetteCreated }: CreateGazetteDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    content: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      extractTextFromFile(file);
      // Auto-populate title from filename
      if (!formData.title) {
        setFormData({ ...formData, title: file.name.replace(/\.[^/.]+$/, "") });
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      extractTextFromFile(file);
      if (!formData.title) {
        setFormData({ ...formData, title: file.name.replace(/\.[^/.]+$/, "") });
      }
    }
  };

  const extractTextFromFile = async (file: File) => {
    setIsExtracting(true);
    try {
      const text = await file.text();
      setExtractedText(text);
      setFormData({ ...formData, content: text });
      toast({
        title: "Text Extracted",
        description: "Document content has been extracted successfully.",
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Could not extract text from the document.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setExtractedText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newGazette = {
        id: Date.now().toString(),
        title: formData.title,
        category: formData.category,
        status: 'Draft',
        date: new Date().toISOString().split('T')[0],
        downloads: 0,
        description: formData.description,
        content: formData.content,
        hasUploadedDocument: !!selectedFile,
        fileName: selectedFile?.name
      };

      onGazetteCreated(newGazette);
      toast({
        title: "Gazette Created",
        description: "Your new gazette has been created successfully.",
      });
      
      // Reset form
      setFormData({ title: '', description: '', category: '', content: '' });
      setSelectedFile(null);
      setExtractedText('');
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Gazette</DialogTitle>
          <DialogDescription>
            Create a new gazette by typing content manually or uploading a document.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              Upload Document
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the gazette"
                rows={2}
              />
            </div>

            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the main content of the gazette manually"
                  rows={8}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt"
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
                    {isExtracting && (
                      <p className="text-xs text-primary">Extracting text...</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX or TXT files (max 10MB)
                    </p>
                  </div>
                )}
              </div>

              {extractedText && (
                <div className="space-y-2">
                  <Label htmlFor="extracted-content">Extracted Content</Label>
                  <Textarea
                    id="extracted-content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Extracted content will appear here"
                    rows={8}
                    className="bg-muted/30"
                  />
                  <p className="text-xs text-muted-foreground">
                    You can edit the extracted content above before creating the gazette.
                  </p>
                </div>
              )}
            </TabsContent>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isExtracting}>
                {isSubmitting ? 'Creating...' : 'Create Gazette'}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}