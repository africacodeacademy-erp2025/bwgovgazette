"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar, FileText, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { GazetteService, type Gazette } from '@/services/GazetteService';
import CreateGazetteDialog from '@/components/admin/CreateGazetteDialog';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

export default function ManageGazettes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [gazettes, setGazettes] = useState<Gazette[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [gazetteToDelete, setGazetteToDelete] = useState<Gazette | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await GazetteService.getGazettes({ limit: 20 });
        setGazettes(list);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium';
      case 'pending':
        return 'px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium';
      case 'processing':
        return 'px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium';
      default:
        return 'px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground';
    }
  };

  const handleGazetteCreated = (g: Gazette) => {
    setGazettes(prev => [g, ...prev]);
  };

  const handleDelete = async () => {
    if (!gazetteToDelete) return;
    // Call service then update state
    await GazetteService.deleteGazette(gazetteToDelete.id);
    setGazettes(prev => prev.filter(x => x.id !== gazetteToDelete.id));
    setShowDeleteDialog(false);
    setGazetteToDelete(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Manage Gazettes</h2>
          <p className="text-sm text-muted-foreground">Create, search, and manage publications</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4" /> New Gazette
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search gazettes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">Loading...</div>
          ) : (
            <div className="space-y-3">
              {gazettes.map(g => (
                <div key={g.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{g.file_name}</span>
                      <span className={getStatusColor(g.processing_status)}>{g.processing_status}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(g.created_at).toLocaleDateString()}</span>
                      <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3" />{g.file_name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setGazetteToDelete(g); setShowDeleteDialog(true); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateGazetteDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onGazetteCreated={handleGazetteCreated} />
      <DeleteConfirmDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} title="Gazette" itemName={gazetteToDelete?.file_name} description="This will permanently delete the gazette." />
    </div>
  );
}

