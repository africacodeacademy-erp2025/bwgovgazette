"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SubscriptionPricing from '@/components/SubscriptionPricing';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Menu, X, Gavel, Heart, Calendar, MapPin, DollarSign, Clock } from "lucide-react";
import { getTenders } from "@/services/govGazetteApi";
import { Spinner } from "@/components/ui/spinner-1";

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

interface Tender {
  id: string;
  title: string;
  category: string;
  description: string;
  deadline: string;
  budget_display: string;
  location: string;
  days_left: number;
}

export default function BrowseTenders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tenders, setTenders] = React.useState<Tender[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [savedTenders, setSavedTenders] = React.useState<Set<string>>(new Set());

  const displayName = user?.email || 'User';
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [currentPlan, setCurrentPlan] = React.useState<"free" | "subscriber" | null>(null);
  const [showPricingModal, setShowPricingModal] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All Categories');

  React.useEffect(() => {
    const storedPlan = localStorage.getItem('plan_choice') as 'free' | 'subscriber' | null;
    if (storedPlan) setCurrentPlan(storedPlan);

    const fetchTenders = async () => {
        setLoading(true);
        try {
            const response = await getTenders();
            const tendersData = response?.data?.tenders || [];
            if (Array.isArray(tendersData)) {
                setTenders(tendersData);
            } else {
                setTenders([]);
                console.error("API response for tenders is not a valid array:", response);
            }
        } catch (error) {
            toast.error("Failed to fetch tenders.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchTenders();
  }, []);

  const handleSaveTender = (tenderId: string) => {
    setSavedTenders(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(tenderId)) {
        newSaved.delete(tenderId);
        toast.info("Tender removed from saved items.");
      } else {
        newSaved.add(tenderId);
        toast.success("Tender saved successfully!");
      }
      return newSaved;
    });
  };

  const filteredTenders = selectedCategory === 'All Categories'
    ? tenders
    : tenders.filter(t => t.category === selectedCategory);

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} userName={displayName} currentPlan={currentPlan} onUpgradeClick={() => setShowPricingModal(true)} />
      
      <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border md:hidden">
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className={cn("flex-1 transition-all", isCollapsed ? "md:ml-[3.05rem]" : "md:ml-60")}>
        <div className="flex flex-col h-full">
          <header className="bg-white border-b p-4">
            {/* Header content can be added here if needed */}
          </header>

          <main className="flex-1 overflow-auto p-6 bg-white">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Browse Tenders</h2>
                <p className="text-muted-foreground">Discover available tender opportunities and procurement notices</p>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Filter Tenders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 flex-wrap">
                    {['All Categories', 'Infrastructure', 'Technology', 'Healthcare', 'Education'].map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Spinner size={40} />
                    <p className="mt-4 text-muted-foreground">Loading tenders...</p>
                  </div>
                </div>
              ) : filteredTenders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                  <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800">No Tenders Found</h3>
                  <p className="text-muted-foreground mt-2">
                    There are no tenders matching your criteria. Please check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTenders.map(tender => (
                    <Card key={tender.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{tender.title}</CardTitle>
                            <CardDescription className="text-base pt-1">{tender.description}</CardDescription>
                          </div>
                          <Badge variant="secondary">{tender.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Deadline: {new Date(tender.deadline).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>Budget: {tender.budget_display || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{tender.location || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="font-medium text-orange-600">{tender.days_left || 0} days left</span>
                          </div>
                        </div>

                        <div className="flex justify-end items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleSaveTender(tender.id)}>
                            <Heart className={`h-4 w-4 mr-2 ${savedTenders.has(tender.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            {savedTenders.has(tender.id) ? 'Saved' : 'Save'}
                          </Button>
                          <Button size="sm" onClick={() => navigate(`/tender/${tender.id}`)}>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
        <DialogContent className="max-w-5xl py-6">
          <DialogHeader>
            <DialogTitle>Choose Your Plan</DialogTitle>
          </DialogHeader>
          <SubscriptionPricing onSelectFree={() => {}} onSelectPaid={() => {}} />
        </DialogContent>
      </Dialog>
    </div>
  );
}