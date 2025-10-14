import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Download, Calendar, FileText } from 'lucide-react';
import { getDocuments } from '@/services/govGazetteApi';
import { type Gazette } from '@/pages/admin/ManageGazettesDb';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner-1';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Menu, X } from 'lucide-react';
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
export default function GazetteViewPage() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [gazette, setGazette] = useState<Gazette | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<"free" | "subscriber" | null>(null);
  useEffect(() => {
    const storedPlan = localStorage.getItem('plan_choice') as 'free' | 'subscriber' | null;
    if (storedPlan) setCurrentPlan(storedPlan);
  }, []);
  useEffect(() => {
    if (id) {
      loadGazette();
    }
  }, [id]);
  const loadGazette = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await getDocuments();
      const documents = response?.data?.documents;
      if (Array.isArray(documents)) {
        const gazetteData = documents.find(g => g.id.toString() === id);
        setGazette(gazetteData || null);
        if (!gazetteData) {
          toast({
            title: "Error",
            description: "Could not find the specified gazette.",
            variant: "destructive"
          });
        }
      } else {
        setGazette(null);
        toast({
          title: "Error",
          description: "Failed to load gazettes due to invalid data format.",
          variant: "destructive"
        });
      }
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
  const handleDownload = () => {
    if (!gazette?.file_url) {
      toast({
        title: "Download Failed",
        description: "No file URL available.",
        variant: "destructive"
      });
      return;
    }
    window.open(gazette.file_url, '_blank');
  };
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
  const content = gazette?.document_texts?.content || 'No content available.';
  // Split content into paragraphs based on one or more newlines for better formatting
  const paragraphs = content.split(/[\r\n]+/).filter(p => p.trim() !== '');
  return <div className="flex h-screen w-screen bg-gray-50">
      <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} userName="User" currentPlan={currentPlan} onUpgradeClick={() => navigate('/dashboard')} />
      
      <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border md:hidden">
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className={cn("flex-1 transition-all", isCollapsed ? "md:ml-[3.05rem]" : "md:ml-60")}>
        <div className="flex flex-col h-full">
          <header className="bg-white border-b p-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Gazette Details</h2>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-white">
            <div className="max-w-5xl mx-auto space-y-6">
              {loading ? <div className="flex items-center justify-center p-12">
                  <Spinner size={48} />
                  <span className="ml-4 text-lg">Loading gazette...</span>
                </div> : !gazette ? <Card>
                  <CardContent className="flex items-center justify-center p-12">
                    <p className="text-muted-foreground text-lg">Gazette not found.</p>
                  </CardContent>
                </Card> : <>
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">{gazette.file_name}</CardTitle>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(gazette.created_at).toLocaleDateString()}</span>
                            </div>
                            <Badge className={getStatusColor(gazette.processing_status)}>
                              {gazette.processing_status || 'pending'}
                            </Badge>
                          </div>
                        </div>
                        <Button onClick={handleDownload} className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card className="flex-1 flex flex-col min-h-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Gazette Content
                      </CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6 flex-1 min-h-0">
                      <ScrollArea className="h-[600px] w-full rounded-md border p-4 bg-muted/20">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </>}
            </div>
          </main>
        </div>
      </div>
    </div>;
}