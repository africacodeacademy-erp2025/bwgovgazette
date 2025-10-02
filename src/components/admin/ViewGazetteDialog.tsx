import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ViewGazetteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gazette: {
    title: string;
    description: string;
    category: string;
    date: string;
  } | null;
}

export default function ViewGazetteDialog({ open, onOpenChange, gazette }: ViewGazetteDialogProps) {
  if (!gazette) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{gazette.title}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {gazette.category}
              </span>
              <span>{gazette.date}</span>
            </div>
            <p className="mt-4">{gazette.description}</p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}