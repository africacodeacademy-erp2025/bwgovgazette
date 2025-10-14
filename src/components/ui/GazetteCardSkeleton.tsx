import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function GazetteCardSkeleton() {
  return (
    <Card className="bg-background border border-border rounded-lg p-6">
      <CardHeader className="flex items-start justify-between mb-3 p-0">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-5 w-20" />
      </CardHeader>
      <CardContent className="p-0 space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}