"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { useStripe } from '@/hooks/useStripe';
import { toast } from 'sonner';

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner-1";

// App-specific Components and Services
import SubscriptionPricing from '@/components/SubscriptionPricing';
import { getDocuments } from '@/services/govGazetteApi';
import { GazetteService } from '@/services/GazetteService';
import { type Gazette } from '@/pages/admin/ManageGazettesDb';

// Icons
import { LayoutDashboard, Search, Gavel, Heart, Bell, Settings, Menu, X, LogOut, User, ChevronLeft, ChevronRight, Check } from "lucide-react";

// --- UTILITY AND ANIMATION VARIANTS ---
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
const sidebarVariants = {
  open: {
    width: "15rem"
  },
  closed: {
    width: "3.05rem"
  }
};
const variants = {
  open: {
    x: 0,
    opacity: 1
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};
const transitionProps = {
  type: "tween" as const,
  ease: [0.4, 0, 0.2, 1] as const,
  duration: 0.2
};

// --- SIDEBAR COMPONENT ---
function DashboardSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  userName,
  currentPlan,
  onUpgradeClick
}: {
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (o: boolean) => void;
  userName: string;
  currentPlan: string | null;
  onUpgradeClick: () => void;
}) {
  const navigate = useNavigate();
  const navigationItems = [{
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  }, {
    name: "Search Gazettes",
    href: "/search",
    icon: Search
  }, {
    name: "Browse Tenders",
    href: "/tenders",
    icon: Gavel
  }, {
    name: "Saved Items",
    href: "/saved",
    icon: Heart
  }, {
    name: "Notifications",
    href: "/notifications",
    icon: Bell
  }, {
    name: "Settings",
    href: "/settings",
    icon: Settings
  }];
  return <>
      {isMobileOpen && <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileOpen(false)} />}
      <motion.div className={cn("fixed left-0 z-40 h-full shrink-0 border-r bg-white", isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0")} initial={false} animate={isCollapsed ? "closed" : "open"} variants={sidebarVariants} transition={transitionProps}>
        <div className="relative z-40 flex h-full shrink-0 flex-col bg-white">
          <div className="flex grow flex-col items-center">
            <div className="flex h-[54px] w-full shrink-0 items-center justify-between border-b p-2">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Gazette Portal Logo" className="w-8 h-8 rounded-lg object-contain" />
                  <motion.div variants={variants}>
                    {!isCollapsed && <p className="text-sm font-medium text-gray-900">Gazette Portal</p>}
                  </motion.div>
                </div>
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:flex p-1.5 rounded-md hover:bg-gray-100">
                  {isCollapsed ? <ChevronRight className="h-4 w-4 text-gray-500" /> : <ChevronLeft className="h-4 w-4 text-gray-500" />}
                </button>
            </div>
            <div className="flex h-full w-full flex-col">
              <div className="p-2">
                <motion.div variants={variants} className={cn("rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all", isCollapsed && "p-2")}>
                  {!isCollapsed ? <>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("h-2 w-2 rounded-full", currentPlan === 'subscriber' ? 'bg-green-500' : 'bg-yellow-500')}></div>
                        <span className="text-xs font-medium text-gray-700">{currentPlan === 'subscriber' ? 'Subscriber Plan' : 'Free Plan'}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{currentPlan === 'subscriber' ? 'Full access enabled.' : 'Basic access to search.'}</p>
                      {currentPlan !== 'subscriber' && <Button size="sm" className="w-full h-6 text-xs bg-gray-900 hover:bg-gray-800" onClick={onUpgradeClick}>Upgrade</Button>}
                    </> : <div className="flex justify-center"><div className={cn("h-2 w-2 rounded-full", currentPlan === 'subscriber' ? 'bg-green-500' : 'bg-yellow-500')}></div></div>}
                </motion.div>
              </div>
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className="flex w-full flex-col gap-1">
                    {navigationItems.map(item => {
                    const Icon = item.icon;
                    return <NavLink key={item.name} to={item.href} onClick={() => setIsMobileOpen(false)} className={({
                      isActive
                    }) => cn("flex h-9 w-full flex-row items-center rounded-md px-2 py-1.5 transition", isActive ? "bg-gray-900 text-white hover:bg-gray-800" : "hover:bg-gray-100")}>
                          <Icon className="h-4 w-4" />
                          <motion.div variants={variants}>
                            {!isCollapsed && <p className="ml-2 text-sm font-medium">{item.name}</p>}
                          </motion.div>
                        </NavLink>;
                  })}
                  </div>
                </ScrollArea>
              </div>
              <div className="p-2 border-t">
                <motion.div variants={variants} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/settings')}>
                  <Avatar className="h-8 w-8"><AvatarFallback className="bg-gray-200 text-xs">{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                  {!isCollapsed && <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{userName}</p><p className="text-xs text-gray-500 truncate">{currentPlan ? `${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan` : 'No Plan'}</p></div>}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>;
}

// --- MAIN DASHBOARD CONTAINER ---
export default function Dashboard() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { createCheckoutSession } = useStripe();
  const [searchParams] = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<"free" | "subscriber" | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [gazettes, setGazettes] = useState<Gazette[]>([]);
  const [loadingGazettes, setLoadingGazettes] = useState(false);
  const [favoritedGazettes, setFavoritedGazettes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      setShowSuccessDialog(true);
      toast.success('Subscription activated successfully');
      localStorage.setItem('plan_choice', 'subscriber');
      setCurrentPlan('subscriber');
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    const storedPlan = localStorage.getItem('plan_choice') as 'free' | 'subscriber' | null;
    if (storedPlan) setCurrentPlan(storedPlan);

    const loadRecentGazettes = async () => {
      setLoadingGazettes(true);
      try {
        const response = await getDocuments();
        const documents = response?.data?.documents;
        if (Array.isArray(documents)) {
          setGazettes(documents);
          if (user) {
            const favorites = await Promise.all(
              documents.map(g => GazetteService.isGazetteInFavorites(user.id, g.id))
            );
            const favoritedMap = documents.reduce((acc, g, i) => {
              acc[g.id] = favorites[i];
              return acc;
            }, {} as Record<string, boolean>);
            setFavoritedGazettes(favoritedMap);
          }
        } else {
          console.error("Could not find a document array in the API response:", response);
        }
      } catch (err) {
        console.error('Failed to load gazettes:', err);
      } finally {
        setLoadingGazettes(false);
      }
    };

    loadRecentGazettes();
  }, [user]);

  const handleFavoriteClick = async (gazetteId: string) => {
    if (!user) {
      toast.error("You must be logged in to save gazettes.");
      return;
    }

    const isFavorited = favoritedGazettes[gazetteId];
    try {
      if (isFavorited) {
        await GazetteService.removeGazetteFromFavorites(user.id, gazetteId);
        toast.success("Gazette removed from favorites.");
      } else {
        await GazetteService.saveGazetteToFavorites(user.id, gazetteId);
        toast.success("Gazette saved to favorites.");
      }
      setFavoritedGazettes(prev => ({ ...prev, [gazetteId]: !isFavorited }));
    } catch (error) {
      toast.error("Failed to update favorites.");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} userName={displayName} currentPlan={currentPlan} onUpgradeClick={() => setShowPricingModal(true)} />

      <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border md:hidden">
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className={cn("flex-1 transition-all", isCollapsed ? "md:ml-[3.05rem]" : "md:ml-60")}>
        <div className="flex flex-col h-full">
          <header className="bg-white border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-white">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h1>
                <p className="text-gray-600">Stay updated with the latest gazette publications.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Publications</h3>
                  {loadingGazettes ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index} className="bg-white border-gray-200">
                          <CardHeader>
                            <div className="h-5 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
                          </CardHeader>
                          <CardContent>
                            <div className="h-4 bg-gray-200 rounded-md w-full mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse"></div>
                          </CardContent>
                          <CardFooter>
                            <div className="h-9 bg-gray-200 rounded-md w-full animate-pulse"></div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : gazettes.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recent publications found.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gazettes.slice(0, 6).map(gazette => {
                        const excerpt = (gazette.document_texts?.content)
                          ? `${gazette.document_texts.content.substring(0, 120)}...`
                          : 'No preview available.';
                        return (
                          <Card key={gazette.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow flex flex-col">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-base font-medium text-gray-900 line-clamp-2">{gazette.file_name || 'Untitled Gazette'}</CardTitle>
                                <Badge className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  gazette.processing_status === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {gazette.processing_status || 'completed'}
                                </Badge>
                              </div>
                              <CardDescription className="text-sm text-gray-500 pt-1">
                                {new Date(gazette.created_at).toLocaleDateString()}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                              <p className="text-sm text-gray-600 line-clamp-3">{excerpt}</p>
                            </CardContent>
                            <CardFooter className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/gazette/${gazette.id}`)}
                                className="flex-grow"
                              >
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleFavoriteClick(gazette.id)}
                                className="px-2"
                              >
                                <Heart className={`h-5 w-5 ${favoritedGazettes[gazette.id] ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                              </Button>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}