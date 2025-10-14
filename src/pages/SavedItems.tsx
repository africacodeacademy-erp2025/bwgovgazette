"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SubscriptionPricing from '@/components/SubscriptionPricing';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { GazetteService } from '@/services/GazetteService';
import { Menu, X, LogOut, User, Trash2, Eye, FileText, Gavel } from "lucide-react";
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
export default function SavedItems() {
  const navigate = useNavigate();
  const {
    signOut,
    user
  } = useAuth();
  const displayName = user?.email || 'User';
  const displayEmail = user?.email || '';
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [currentPlan, setCurrentPlan] = React.useState<"free" | "subscriber" | null>(null);
  const [showPricingModal, setShowPricingModal] = React.useState(false);
  React.useEffect(() => {
    const storedPlan = localStorage.getItem('plan_choice') as 'free' | 'subscriber' | null;
    if (storedPlan) setCurrentPlan(storedPlan);
  }, []);
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  const startFreePlan = () => {
    localStorage.setItem('plan_choice', 'free');
    toast.success('Continuing with Free plan');
    setCurrentPlan('free');
    setShowPricingModal(false);
  };
  const handleSubscribeClick = () => {
    toast.info('Redirecting to checkout...');
    setShowPricingModal(false);
  };
  const [savedGazettes, setSavedGazettes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const fetchSavedGazettes = async () => {
      if (user) {
        setLoading(true);
        try {
          const gazettes = await GazetteService.getSavedGazettes(user.id);
          setSavedGazettes(gazettes);
        } catch (error) {
          console.error('Failed to fetch saved gazettes:', error);
          toast.error('Failed to load saved items.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setSavedGazettes([]);
      }
    };

    fetchSavedGazettes();
  }, [user]);

  const handleRemoveFavorite = async (gazetteId: string) => {
    if (!user) return;
    try {
      await GazetteService.removeGazetteFromFavorites(user.id, gazetteId);
      setSavedGazettes(prev => prev.filter(g => g.id !== gazetteId));
      toast.success("Gazette removed from saved items.");
    } catch (error) {
      toast.error("Failed to remove gazette.");
    }
  };

  return <div className="flex h-screen w-screen bg-gray-50">
      <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} userName={displayName} currentPlan={currentPlan} onUpgradeClick={() => setShowPricingModal(true)} />
      
      <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border md:hidden">
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className={cn("flex-1 transition-all", isCollapsed ? "md:ml-[3.05rem]" : "md:ml-60")}>
        <div className="flex flex-col h-full">
          <header className="bg-white border-b p-4">
            
          </header>

          <main className="flex-1 overflow-auto p-6 bg-white">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Saved Items</h2>
                <p className="text-muted-foreground">Your bookmarked gazettes and tender opportunities</p>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Saved</TabsTrigger>
                  <TabsTrigger value="gazettes">Gazettes</TabsTrigger>
                  <TabsTrigger value="tenders">Tenders</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center p-12">
                      <p>Loading saved items...</p>
                    </div>
                  ) : savedGazettes.length === 0 ? (
                    <div className="text-center p-12">
                      <p className="text-muted-foreground">No saved items yet. Start saving gazettes and tenders to see them here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedGazettes.map((gazette: any) => {
                        return (
                          <Card key={`gazette-${gazette.id}`} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-primary" />
                                  <div>
                                    <CardTitle className="text-lg">{gazette.file_name || 'Untitled Gazette'}</CardTitle>
                                    <CardDescription>
                                      Published: {new Date(gazette.created_at).toLocaleDateString()}
                                    </CardDescription>
                                  </div>
                                </div>
                                <Badge variant="secondary">{gazette.processing_status}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => navigate(`/gazette/${gazette.id}`)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleRemoveFavorite(gazette.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="gazettes" className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center p-12">
                      <p>Loading gazettes...</p>
                    </div>
                  ) : savedGazettes.length === 0 ? (
                    <div className="text-center p-12">
                      <p className="text-muted-foreground">No saved gazettes yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedGazettes.map((gazette: any) => {
                        return (
                          <Card key={gazette.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <CardTitle className="text-lg">{gazette.file_name || 'Untitled Gazette'}</CardTitle>
                              <CardDescription>Published: {new Date(gazette.created_at).toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button size="sm" onClick={() => navigate(`/gazette/${gazette.id}`)}>View</Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="tenders" className="space-y-4">
                  <div className="text-center p-12">
                    <p className="text-muted-foreground">No saved tenders yet.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
        <DialogContent className="max-w-5xl py-6">
          <DialogHeader>
            <DialogTitle>Choose Your Plan</DialogTitle>
          </DialogHeader>
          <SubscriptionPricing onSelectFree={startFreePlan} onSelectPaid={handleSubscribeClick} />
        </DialogContent>
      </Dialog>
    </div>;
}
