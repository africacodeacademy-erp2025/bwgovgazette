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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner-1";

// App-specific Components and Services
import SubscriptionPricing from '@/components/SubscriptionPricing';
import { GazetteService, type Gazette } from "@/services/GazetteService";

// Icons
import {
  LayoutDashboard,
  Search,
  Gavel,
  Heart,
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

// --- UTILITY AND ANIMATION VARIANTS ---
function cn(...inputs: any[]) { return inputs.filter(Boolean).join(" "); }
const sidebarVariants = { open: { width: "15rem" }, closed: { width: "3.05rem" } };
const variants = { open: { x: 0, opacity: 1 }, closed: { x: -20, opacity: 0, transition: { duration: 0.2 } } };
const transitionProps = { type: "tween" as const, ease: [0.4, 0, 0.2, 1] as const, duration: 0.2 };

// --- SIDEBAR COMPONENT (REFACTORED FOR ROUTING) ---
function DashboardSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  userName,
  currentPlan,
  onUpgradeClick,
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
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Search Gazettes", href: "/search", icon: Search },
    { name: "Browse Tenders", href: "/tenders", icon: Gavel },
    { name: "Saved Items", href: "/saved", icon: Heart },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {isMobileOpen && <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileOpen(false)} />}
      <motion.div
        className={cn("fixed left-0 z-40 h-full shrink-0 border-r bg-white", isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0")}
        initial={false}
        animate={isCollapsed ? "closed" : "open"}
        variants={sidebarVariants}
        transition={transitionProps}
      >
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
                  {!isCollapsed ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("h-2 w-2 rounded-full", currentPlan === 'subscriber' ? 'bg-green-500' : 'bg-yellow-500')}></div>
                        <span className="text-xs font-medium text-gray-700">{currentPlan === 'subscriber' ? 'Subscriber Plan' : 'Free Plan'}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{currentPlan === 'subscriber' ? 'Full access enabled.' : 'Basic access to search.'}</p>
                      {currentPlan !== 'subscriber' && <Button size="sm" className="w-full h-6 text-xs bg-gray-900 hover:bg-gray-800" onClick={onUpgradeClick}>Upgrade</Button>}
                    </>
                  ) : (
                    <div className="flex justify-center"><div className={cn("h-2 w-2 rounded-full", currentPlan === 'subscriber' ? 'bg-green-500' : 'bg-yellow-500')}></div></div>
                  )}
                </motion.div>
              </div>
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className="flex w-full flex-col gap-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              "flex h-9 w-full flex-row items-center rounded-md px-2 py-1.5 transition",
                              isActive
                                ? "bg-gray-900 text-white hover:bg-gray-800"
                                : "hover:bg-gray-100"
                            )
                          }
                        >
                          <Icon className="h-4 w-4" />
                          <motion.div variants={variants}>
                            {!isCollapsed && <p className="ml-2 text-sm font-medium">{item.name}</p>}
                          </motion.div>
                        </NavLink>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
              <div className="p-2 border-t">
                <motion.div variants={variants} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/settings')}>
                  <Avatar className="h-8 w-8"><AvatarFallback className="bg-gray-200 text-xs">{userName.split(' ').map(n=>n[0]).join('')}</AvatarFallback></Avatar>
                  {!isCollapsed && <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{userName}</p><p className="text-xs text-gray-500 truncate">{currentPlan ? `${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan` : 'No Plan'}</p></div>}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// --- MAIN DASHBOARD CONTAINER ---
export default function Dashboard() {
  // --- STATE AND HOOKS ---
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

  // --- EFFECTS ---
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

    setLoadingGazettes(true);
    GazetteService.getGazettes({ limit: 3 })
      .then(setGazettes)
      .catch(console.error)
      .finally(() => setLoadingGazettes(false));
  }, []);

  // --- EVENT HANDLERS ---
  const startFreePlan = () => {
    localStorage.setItem('plan_choice', 'free');
    toast.success('Continuing with Free plan');
    setCurrentPlan('free');
  };

  const handleSubscribeClick = () => {
    if (currentPlan === 'subscriber') {
      toast.info('You are already subscribed.');
      return;
    }
    setShowPricingModal(true);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleConfirmSubscription = () => {
      createCheckoutSession('subscriber');
      setShowPricingModal(false);
  }

  // --- RENDER LOGIC ---
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';
  const savedItems = [ // Mock data as per blueprint
    { title: "Construction Tender - Road Works", deadline: "Dec 15, 2024", status: "Saved", category: "Infrastructure", value: "$2.5M" },
    { title: "IT Services Procurement", deadline: "Dec 20, 2024", status: "Saved", category: "Technology", value: "$850K" },
  ];

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <DashboardSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        userName={displayName}
        currentPlan={currentPlan}
        onUpgradeClick={handleSubscribeClick}
      />
      <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border md:hidden">
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <div className={cn("flex-1 transition-all", isCollapsed ? "md:ml-[3.05rem]" : "md:ml-60")}>
        <div className="flex flex-col h-full">
          <header className="bg-white border-b p-4">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500">{displayEmail}</p>
                </div>
                 {currentPlan !== 'subscriber' && (
                  <Button variant="outline" size="sm" onClick={handleSubscribeClick}>
                    Subscribe
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="p-2 h-9 w-9 rounded-full">
                      <Avatar className="h-8 w-8"><AvatarFallback className="bg-gray-200 text-xs">{displayName.split(' ').map(n=>n[0]).join('')}</AvatarFallback></Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/settings')}><User className="h-4 w-4 mr-2" />Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 focus:text-red-500" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
             <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-white rounded-lg p-6 border border-gray-200"><h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h1><p className="text-gray-600">Stay updated with the latest gazette publications and tender opportunities.</p></div>
                {currentPlan === null && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white border-gray-200"><CardHeader><CardTitle className="text-lg text-gray-900">Free</CardTitle><CardDescription className="text-gray-600">Basic gazette search</CardDescription></CardHeader><CardContent><div className="text-3xl font-bold text-gray-900 mb-4">$0<span className="text-lg font-normal text-gray-500">/month</span></div><ul className="space-y-2 text-sm text-gray-600 list-disc list-inside"><li>Basic gazette search</li><li>Limited notifications</li><li>Save a few items</li></ul></CardContent><CardFooter><Button variant="outline" className="w-full" onClick={startFreePlan}>Continue with Free</Button></CardFooter></Card>
                    <Card className="bg-white border-gray-200 relative"><Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 text-sm">Most Popular</Badge><CardHeader><CardTitle className="text-lg text-gray-900">Subscriber</CardTitle><CardDescription className="text-gray-600">For power users</CardDescription></CardHeader><CardContent><div className="text-3xl font-bold text-gray-900 mb-4">$29<span className="text-lg font-normal text-gray-500">/month</span></div><ul className="space-y-2 text-sm text-gray-600 list-disc list-inside"><li>Unlimited alerts</li><li>Advanced filters</li><li>Priority support</li></ul></CardContent><CardFooter><Button className="w-full bg-gray-900 text-white hover:bg-gray-800" onClick={() => handleSubscribeClick()}>Subscribe</Button></CardFooter></Card>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/search')}><CardHeader><CardTitle className="text-lg text-gray-900 flex items-center gap-2"><Search className="h-5 w-5" />Search Gazettes</CardTitle></CardHeader><CardContent><p className="text-gray-600">Find specific publications</p></CardContent></Card>
                    <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/tenders')}><CardHeader><CardTitle className="text-lg text-gray-900 flex items-center gap-2"><Gavel className="h-5 w-5" />Browse Tenders</CardTitle></CardHeader><CardContent><p className="text-gray-600">View available opportunities</p></CardContent></Card>
                    <Card className="bg-white border-gray-200"><CardHeader><CardTitle className="text-lg text-gray-900">Recent Publications</CardTitle></CardHeader><CardContent>{loadingGazettes ? <div className="flex items-center justify-center p-4"><Spinner size={24} /><p className="ml-2">Loading...</p></div> : gazettes.length === 0 ? <p className="text-gray-500">No recent publications found.</p> : <div className="space-y-3">{gazettes.map(g => (<div key={g.id} className="flex items-center justify-between p-3 border rounded-lg"><div><h3 className="font-medium text-gray-800">{g.file_name}</h3><p className="text-sm text-gray-500">{new Date(g.created_at).toLocaleDateString()}</p></div><Button size="sm" variant="outline" onClick={() => navigate(`/gazette/${g.id}`)}>View</Button></div>))}</div>}</CardContent></Card>
                </div>
                <Card className="bg-white border-gray-200"><CardHeader><CardTitle className="text-lg text-gray-900">Your Saved Items</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{savedItems.length > 0 ? savedItems.map((item, index) => (<div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"><div className="flex items-start justify-between mb-2"><h3 className="font-medium text-gray-900">{item.title}</h3><Badge variant="outline">{item.status}</Badge></div><div className="space-y-1 text-sm text-gray-600"><p>Category: {item.category}</p><p>Value: {item.value}</p><p>Deadline: {item.deadline}</p></div></div>)) : <p className="text-gray-500">No saved items found.</p>}</div></CardContent></Card>
            </div>
          </main>
        </div>
      </div>
      <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
        <DialogContent className="max-w-5xl py-6">
          <DialogHeader><DialogTitle>Choose Your Plan</DialogTitle></DialogHeader>
          <SubscriptionPricing onSelectFree={startFreePlan} onSelectPaid={handleConfirmSubscription} />
        </DialogContent>
      </Dialog>
      <Dialog open={showSuccessDialog} onOpenChange={() => setShowSuccessDialog(false)}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
            <Check className="h-8 h-8 text-green-600" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle>Subscription Successful</DialogTitle>
            <DialogDescription>Your premium subscription is now active.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button onClick={() => setShowSuccessDialog(false)} className="w-full">Go to Dashboard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}