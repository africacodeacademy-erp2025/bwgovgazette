"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Edit, Trash2, Plus, Calendar, Loader2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import ViewGazetteDialog from '@/components/admin/ViewGazetteDialog';
import EditGazetteDialog from '@/components/admin/EditGazetteDialog';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import CreateGazetteDialog from '@/components/admin/CreateGazetteDialog';
import GazetteCardSkeleton from '@/components/ui/GazetteCardSkeleton';
import { supabase } from '@/integrations/supabase/client';
import { getDocuments } from '@/services/govGazetteApi';
import { toast } from 'sonner';

// This interface is now correct based on direct API inspection
export interface Gazette {
  id: string;
  file_name: string;
  file_url: string;
  created_at: string;
  processing_status?: string;
  document_texts?: {
    content: string;
  };
}

export default function ManageGazettesDb() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showViewDialog, setShowViewDialog] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [gazetteToDelete, setGazetteToDelete] = useState<any | null>(null);
  const [gazetteToEdit, setGazetteToEdit] = useState<any | null>(null);
  const [gazetteToView, setGazetteToView] = useState<any | null>(null);
  const [gazettes, setGazettes] = useState<Gazette[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGazettes();
  }, []);

  const loadGazettes = async () => {
    setLoading(true);
    try {
      const response = await getDocuments();
      // Directly access the correct path based on direct API inspection
      const documents = response?.data?.documents;

      if (Array.isArray(documents)) {
        setGazettes(documents as Gazette[]);
      } else {
        console.error("API response did not contain a 'data.documents' array:", response);
        setGazettes([]);
      }
    } catch (error: any) {
      console.error('Error loading gazettes:', error);
      setGazettes([]);
      toast.error(error.message || 'Failed to load gazettes');
    } finally {
      setLoading(false);
    }
  };

  const handleGazetteCreated = (newGazette: Gazette) => {
    setGazettes(prevGazettes => [newGazette, ...prevGazettes]);
  };

  const handleGazetteUpdated = () => {
    loadGazettes();
  };

  const handleDelete = async () => {
    if (!gazetteToDelete) return;

    try {
      const { error } = await supabase.functions.invoke('delete-gazette', {
        body: { id: gazetteToDelete.id },
      });

      if (error) throw error;

      toast.success('Gazette deleted successfully');
      loadGazettes(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting gazette:', error);
      toast.error(error.message || 'Failed to delete gazette');
    } finally {
      setShowDeleteDialog(false);
      setGazetteToDelete(null);
    }
  };

  const filteredGazettes = gazettes.filter(gazette =>
    gazette && typeof gazette.file_name === 'string' && gazette.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search gazettes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 w-full" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <GazetteCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredGazettes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <FileText className="h-16 w-16 text-muted-foreground/50" />
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No gazettes found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'Try adjusting your search query' : 'Get started by creating your first gazette'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Gazette
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGazettes.map((gazette, index) => (
                <motion.div
                  key={gazette?.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      gazette?.processing_status === 'completed'
                        ? 'bg-green-100 text-green-700' 
                        : gazette?.processing_status === 'processing'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {gazette?.processing_status || 'pending'}
                    </span>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {gazette?.created_at ? new Date(gazette.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-3 line-clamp-2">{gazette?.file_name || 'Untitled Gazette'}</h3>
                  <p className="text-muted-foreground font-normal mb-4 line-clamp-3 text-sm">
                    {(gazette?.document_texts && gazette.document_texts.content)
                      ? `${gazette.document_texts.content.substring(0, 150)}...`
                      : 'No content available'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => { setGazetteToView(gazette); setShowViewDialog(true); }}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      onClick={() => { setGazetteToEdit(gazette); setShowEditDialog(true); }}
                      variant="outline"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => { setGazetteToDelete(gazette); setShowDeleteDialog(true); }}
                      variant="outline"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <ViewGazetteDialog open={showViewDialog} onOpenChange={setShowViewDialog} gazette={gazetteToView} />
      <EditGazetteDialog open={showEditDialog} onOpenChange={setShowEditDialog} gazette={gazetteToEdit} onGazetteUpdated={handleGazetteUpdated} />
      <DeleteConfirmDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} title="Gazette" itemName={gazetteToDelete?.file_name} description="This will permanently delete the gazette." />
      <CreateGazetteDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onGazetteCreated={handleGazetteCreated} />
    </div>
  );
}