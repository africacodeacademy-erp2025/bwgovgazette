import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Calendar, User, FileText, Eye } from 'lucide-react';
import { GazetteService, type Gazette } from '@/services/GazetteService';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner-1';

interface GazetteViewProps {
  gazetteId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GazetteView({ gazetteId, open, onOpenChange }: GazetteViewProps) {
  const [gazette, setGazette] = useState<Gazette | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && gazetteId) {
      loadGazette();
    }
  }, [open, gazetteId]);

  const loadGazette = async () => {
    if (!gazetteId) return;

    setLoading(true);
    try {
      const gazetteData = await GazetteService.getGazette(gazetteId);
      setGazette(gazetteData);
    } catch (error) {
      console.error('Failed to load gazette:', error);
      toast({
        title: "Error",
        description: "Failed to load gazette details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!gazette?.file_url) return;

    try {
      const fileUrl = await GazetteService.getFileUrl(gazette.file_url);
      
      // Create download link
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = gazette.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: "The gazette file is being downloaded.",
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the gazette file.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <div className="flex items-center justify-center p-8">
            <Spinner size={32} />
            <span className="ml-3">Loading gazette...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!gazette) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Gazette not found.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl font-bold line-clamp-2">
            {gazette.file_name}
          </DialogTitle>
          
          {/* Gazette metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(gazette.created_at).toLocaleDateString()}</span>
            </div>
            
            <Badge className={`text-xs ${getStatusColor(gazette.processing_status)}`}>
              {gazette.processing_status}
            </Badge>

            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{gazette.file_name}</span>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full max-h-[60vh] pr-4">
            <div className="space-y-4">
              {gazette.extracted_text ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {gazette.extracted_text}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                  <Eye className="h-8 w-8 mr-2" />
                  <span>No extracted content available</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-xs text-muted-foreground">
            Created: {new Date(gazette.created_at).toLocaleString()}
          </div>
          
          <div className="flex items-center gap-2">
            {gazette.file_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download File
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}