"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Edit, Trash2, Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import ViewGazetteDialog from '@/components/admin/ViewGazetteDialog';
import EditGazetteDialog from '@/components/admin/EditGazetteDialog';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import CreateGazetteDialog from '@/components/admin/CreateGazetteDialog';

export default function ManageGazettes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showViewDialog, setShowViewDialog] = useState<boolean>(false);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [gazetteToDelete, setGazetteToDelete] = useState<GazetteCard | null>(null);
  const [gazetteToEdit, setGazetteToEdit] = useState<GazetteCard | null>(null);
  const [gazetteToView, setGazetteToView] = useState<GazetteCard | null>(null);

  interface GazetteCard {
    id: string;
    title: string;
    date: string;
    description: string;
    category: string;
  }

  const [featuredGazettes, setFeaturedGazettes] = useState([
    {
      id: '1',
      title: 'Construction of Gaborone-Francistown Highway Bridge',
      date: '2024-01-15',
      description: "Major infrastructure tender for highway bridge construction connecting Botswana's two largest cities.",
      category: 'Infrastructure'
    },
    {
      id: '2',
      title: 'Supply of Medical Equipment to Princess Marina Hospital',
      date: '2024-01-12',
      description: 'Procurement tender for advanced medical equipment and devices to enhance healthcare delivery in Botswana.',
      category: 'Healthcare'
    },
    {
      id: '3',
      title: 'Modernization of Public Transportation Fleet',
      date: '2024-01-10',
      description: "Botswana Government tender for procurement of modern, eco-friendly buses for public transport system.",
      category: 'Transport'
    },
    {
      id: '4',
      title: 'Solar Power Plant Development - Kalahari Region',
      date: '2024-01-08',
      description: "Renewable energy project tender for solar power plant construction in Botswana's Kalahari region.",
      category: 'Energy'
    },
    {
      id: '5',
      title: 'Digital Education Infrastructure Upgrade',
      date: '2024-01-05',
      description: 'Technology procurement tender for digital learning infrastructure across Botswana schools.',
      category: 'Education'
    },
    {
      id: '6',
      title: 'Water Treatment Facility - Maun District',
      date: '2024-01-03',
      description: 'Water infrastructure development tender for new treatment facility serving Maun and surrounding areas.',
      category: 'Water & Sanitation'
    }
  ]);

  const handleGazetteCreated = (newGazette: GazetteCard) => {
    setFeaturedGazettes(prev => [newGazette, ...prev]);
  };

  const handleGazetteUpdated = (updatedGazette: GazetteCard) => {
    setFeaturedGazettes(prev => prev.map(g => (g.id === updatedGazette.id ? updatedGazette : g)));
  };

  const handleDelete = () => {
    if (!gazetteToDelete) return;
    setFeaturedGazettes(prev => prev.filter(x => x.id !== gazetteToDelete.id));
    setShowDeleteDialog(false);
    setGazetteToDelete(null);
  };

  const filteredGazettes = featuredGazettes.filter(gazette =>
    gazette.title.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGazettes.map((gazette, index) => (
              <motion.div
                key={gazette.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {gazette.category}
                  </span>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {gazette.date}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-3 line-clamp-2">{gazette.title}</h3>
                <p className="text-muted-foreground font-normal mb-4 line-clamp-3">{gazette.description}</p>
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
                    className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => { setGazetteToDelete(gazette); setShowDeleteDialog(true); }}
                    className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
      <ViewGazetteDialog open={showViewDialog} onOpenChange={setShowViewDialog} gazette={gazetteToView} />
      <EditGazetteDialog open={showEditDialog} onOpenChange={setShowEditDialog} gazette={gazetteToEdit} onGazetteUpdated={handleGazetteUpdated} />
      <DeleteConfirmDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDelete} title="Gazette" itemName={gazetteToDelete?.title} description="This will permanently delete the gazette." />
      <CreateGazetteDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onGazetteCreated={handleGazetteCreated} />
    </div>
  );
}