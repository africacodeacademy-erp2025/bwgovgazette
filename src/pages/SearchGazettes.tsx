"use client";

import * as React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { useGazettes } from '@/hooks/useGazettes';
import { searchGazettes as searchGazettesService } from '@/services/govGazetteApi';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner-1";
import SubscriptionPricing from '@/components/SubscriptionPricing';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Menu, X, LogOut, User, Search, Filter, Download, Eye } from "lucide-react";
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
export default function SearchGazettes() {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const {
    signOut,
    user
  } = useAuth();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.info("Please enter a search term.");
      return;
    }
    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await searchGazettesService(searchQuery);
      // Handle wrapped API responses and ensure we have an array
      const results = Array.isArray(response) ? response : (response?.data || []);

      if (Array.isArray(results)) {
        setSearchResults(results);
        if (results.length === 0) {
          toast.info("No results found.");
        }
      } else {
        setSearchResults([]);
        toast.error("Search failed: Invalid data format from server.");
        console.error("Search API did not return an array:", response);
      }
    } catch (error) {
      toast.error("Search failed.");
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

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
                <h2 className="text-3xl font-bold text-foreground mb-2">Search Gazettes</h2>
                <p className="text-muted-foreground">Find specific gazette publications and documents</p>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Search Publications</CardTitle>
                  <CardDescription>Enter keywords to find relevant gazette publications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search gazettes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                    </div>
                    <Button onClick={handleSearch} disabled={isSearching}>
                      {isSearching ? <Spinner className="h-4 w-4 mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {isSearching ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : !hasSearched ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Enter a search term above to find gazettes.</p>
                  </CardContent>
                </Card>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.filter(g => g && g.id).map((gazette) => (
                    <Card key={gazette.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{gazette.file_name || 'Untitled Gazette'}</CardTitle>
                            <CardDescription className="mt-2">
                              Published: {gazette.created_at ? new Date(gazette.created_at).toLocaleDateString() : 'Date not available'}
                            </CardDescription>
                          </div>
                          {gazette.pricing_tier &&
                            <Badge variant={gazette.pricing_tier === 'premium' ? 'default' : 'secondary'}>
                              {gazette.pricing_tier === 'premium' ? 'Premium' : 'Free'}
                            </Badge>
                          }
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Status: {gazette.processing_status || 'pending'}
                          </span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/gazette/${gazette.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No results found for your query.</p>
                  </CardContent>
                </Card>
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
          <SubscriptionPricing onSelectFree={startFreePlan} onSelectPaid={handleSubscribeClick} />
        </DialogContent>
      </Dialog>
    </div>;
}