import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import { type Gazette } from '@/pages/admin/ManageGazettesDb';

interface ViewGazetteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gazette: Gazette | null;
}

export default function ViewGazetteDialog({ open, onOpenChange, gazette }: ViewGazetteDialogProps) {
  if (!gazette) {
    return null;
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Definitive fix: Access the 'content' property directly from the 'document_texts' object.
  const content = gazette?.document_texts?.content || 'No content available.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-6">
        <DialogHeader className="pr-6">
          <DialogTitle className="text-2xl font-bold mb-2">{gazette.file_name || 'Untitled Gazette'}</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{gazette.created_at ? new Date(gazette.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
            <Badge className={getStatusColor(gazette.processing_status)}>
              {gazette.processing_status || 'pending'}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full w-full rounded-md border p-4 bg-muted/20">
            <pre className="text-sm whitespace-pre-wrap font-sans text-foreground">
              {content}
            </pre>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}