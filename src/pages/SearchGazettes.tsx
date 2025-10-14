"use client";

import * as React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { searchGazettes as searchGazettesService } from '@/services/govGazetteApi';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner-1";
import SubscriptionPricing from '@/components/SubscriptionPricing';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Menu, X, Search, Filter, Eye } from "lucide-react";

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

interface Citation {
  chunk_id: string;
  gazette_id: string;
  snippet: string;
  similarity: number;
}

interface SearchResult {
  query: string;
  summary: string;
  citations: Citation[];
}

export default function SearchGazettes() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.info("Please enter a search term.");
      return;
    }
    setIsSearching(true);
    setHasSearched(true);
    setSearchResult(null);

    try {
      const response = await searchGazettesService(searchQuery);
      if (response && response.summary && Array.isArray(response.citations)) {
        setSearchResult(response);
        if (response.citations.length === 0) {
          toast.info("No gazette found matching your search");
        }
      } else {
        toast.error("Search failed: Invalid data format from server.");
        console.error("Search API returned an unexpected format:", response);
      }
    } catch (error) {
      toast.error("Search failed.");
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const displayName = user?.email || 'User';
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [currentPlan, setCurrentPlan] = React.useState<"free" | "subscriber" | null>(null);
  const [showPricingModal, setShowPricingModal] = React.useState(false);
  React.useEffect(() => {
    const storedPlan = localStorage.getItem('plan_choice') as 'free' | 'subscriber' | null;
    if (storedPlan) setCurrentPlan(storedPlan);
  }, []);
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
              ) : searchResult && searchResult.citations.length > 0 ? (
                <div>
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Search Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{searchResult.summary}</p>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResult.citations.map((citation) => (
                      <Card key={citation.chunk_id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <p className="text-sm text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: citation.snippet }}></p>
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/gazette/${citation.gazette_id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Gazette
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No gazette found matching your search</p>
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
