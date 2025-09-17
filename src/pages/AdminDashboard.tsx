import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Users, BarChart3, Settings, Search, Plus, Eye, Edit, Trash2, Download, Filter, Calendar, Bell, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import CreateGazetteDialog from '@/components/admin/CreateGazetteDialog';
import UploadDocumentDialog from '@/components/admin/UploadDocumentDialog';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import GazetteView from '@/components/GazetteView';
import Sidebar from '@/components/ui/sidebar-with-submenu';
import { GazetteService, type Gazette } from '@/services/GazetteService';

// Mock data for the dashboard
const stats = [{
  title: 'Total Gazettes',
  value: '1,234',
  change: '+12%',
  icon: FileText
}, {
  title: 'Active Users',
  value: '8,432',
  change: '+5%',
  icon: Users
}, {
  title: 'Downloads Today',
  value: '342',
  change: '+23%',
  icon: Download
}, {
  title: 'Pending Approvals',
  value: '15',
  change: '-8%',
  icon: Bell
}];
const recentGazettes = [{
  id: '1',
  title: 'Public Infrastructure Development Notice',
  category: 'Infrastructure',
  status: 'Published',
  date: '2024-01-15',
  downloads: 156
}, {
  id: '2',
  title: 'Legal Notice - Property Tax Assessment',
  category: 'Legal',
  status: 'Draft',
  date: '2024-01-14',
  downloads: 0
}, {
  id: '3',
  title: 'Environmental Conservation Policy Update',
  category: 'Environment',
  status: 'Under Review',
  date: '2024-01-13',
  downloads: 89
}, {
  id: '4',
  title: 'Health Department Vaccination Notice',
  category: 'Health',
  status: 'Published',
  date: '2024-01-12',
  downloads: 234
}];
export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [gazettes, setGazettes] = useState<Gazette[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [gazetteToDelete, setGazetteToDelete] = useState<Gazette | null>(null);
  const [gazetteToView, setGazetteToView] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadGazettes();
  }, []);

  const loadGazettes = async () => {
    try {
      setLoading(true);
      const gazetteData = await GazetteService.getGazettes({ limit: 10 });
      setGazettes(gazetteData);
    } catch (error) {
      console.error('Failed to load gazettes:', error);
      toast({
        title: "Error",
        description: "Failed to load gazettes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGazetteCreated = (newGazette: Gazette) => {
    setGazettes([newGazette, ...gazettes]);
  };

  const handleDocumentUploaded = (newDocument: Gazette) => {
    setGazettes([newDocument, ...gazettes]);
  };

  const handleViewClick = (gazetteId: string) => {
    setGazetteToView(gazetteId);
    setShowViewDialog(true);
  };

  const handleDeleteClick = (gazette: Gazette) => {
    setGazetteToDelete(gazette);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (gazetteToDelete) {
      try {
        await GazetteService.deleteGazette(gazetteToDelete.id);
        setGazettes(gazettes.filter(g => g.id !== gazetteToDelete.id));
        toast({
          title: "Gazette Deleted",
          description: `"${gazetteToDelete.file_name}" has been deleted successfully.`,
        });
      } catch (error) {
        console.error('Failed to delete gazette:', error);
        toast({
          title: "Delete Failed",
          description: "Failed to delete the gazette.",
          variant: "destructive"
        });
      }
      setGazetteToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium';
      case 'pending':
        return 'px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium';
      case 'processing':
        return 'px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium';
      default:
        return 'px-3 py-1 rounded-full bg-muted text-sm font-medium text-muted-foreground';
    }
  };
  return <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-80 px-8 py-8">
        {/* Welcome Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your gazettes.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.1
      }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-black">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }} className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Button className="flex items-center gap-2" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4" />
              Create New Gazette
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowUploadDialog(true)}>
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Recent Gazettes */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.3
      }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Gazettes</CardTitle>
                  <CardDescription>Manage and monitor your latest publications</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search gazettes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 w-64" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading gazettes...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {gazettes.map(gazette => (
                    <div key={gazette.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-sm">{gazette.file_name}</h3>
                          <Badge className={getStatusColor(gazette.processing_status)}>
                            {gazette.processing_status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(gazette.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="h-3 w-3" />
                            <span>{gazette.file_name}</span>
                          </div>
                          {gazette.extracted_text && (
                            <span className="text-xs">({gazette.extracted_text.length} chars)</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleViewClick(gazette.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(gazette)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 text-center">
                <Button variant="outline">View All Gazettes</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Dialogs */}
      <CreateGazetteDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onGazetteCreated={handleGazetteCreated}
      />
      <UploadDocumentDialog 
        open={showUploadDialog} 
        onOpenChange={setShowUploadDialog}
        onDocumentUploaded={handleDocumentUploaded}
      />
      <GazetteView
        gazetteId={gazetteToView}
        open={showViewDialog}
        onOpenChange={(open) => {
          setShowViewDialog(open);
          if (!open) setGazetteToView(null);
        }}
      />
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Gazette"
        itemName={gazetteToDelete?.file_name}
        description="This will permanently delete the gazette and all associated data. This action cannot be undone."
      />
    </div>;
}