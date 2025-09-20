import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { 
  Calendar, 
  Search, 
  Gavel, 
  Bell, 
  LayoutDashboard, 
  User, 
  Settings, 
  ChevronsUpDown,
  FileText,
  Heart
} from "lucide-react";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useMemo, useState } from "react";
import { useStripe } from '@/hooks/useStripe';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Star } from "lucide-react";
import { toast } from 'sonner';

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Search Gazettes",
    url: "/search",
    icon: Search,
  },
  {
    title: "Browse Tenders",
    url: "/tenders",
    icon: Gavel,
  },
  {
    title: "Saved Items",
    url: "/saved",
    icon: Heart,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const currentPath = location.pathname;
  const { createCheckoutSession } = useStripe();
  const [searchParams] = useSearchParams();

  const [showSubscribeConfirm, setShowSubscribeConfirm] = useState<boolean>(false);
  const [pendingPlan, setPendingPlan] = useState<{ planType: string; gazetteId?: string } | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  const shouldOpenSubscribe = useMemo(() => {
    // Receive flag from navigation state (set after login)
    const stateAny = location.state as any;
    return Boolean(stateAny?.showSubscribeConfirm);
  }, [location.state]);

  useEffect(() => {
    // Detect redirect from Stripe success and show success popup
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      setShowSuccessDialog(true);
      toast.success('Subscription activated successfully');
    }
  }, [searchParams]);

  useEffect(() => {
    // Load pending purchase from sessionStorage if present
    const stored = sessionStorage.getItem('pendingPurchase');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { planType: string; gazetteId?: string };
        setPendingPlan(parsed);
        if (shouldOpenSubscribe) {
          setShowSubscribeConfirm(true);
        }
      } catch {}
    }
  }, [shouldOpenSubscribe]);

  const handleContinueSubscribe = async () => {
    if (pendingPlan) {
      // Clear before redirect to Stripe to avoid re-opening on return
      sessionStorage.removeItem('pendingPurchase');
      setShowSubscribeConfirm(false);
      await createCheckoutSession(pendingPlan.planType, pendingPlan.gazetteId);
    } else {
      setShowSubscribeConfirm(false);
    }
  };

  const startFreePlan = () => {
    // Free plan: simply keep user on dashboard; optionally navigate to /subscription for details
    // Could set a flag in local storage to hide prompts
    sessionStorage.removeItem('pendingPurchase');
    localStorage.setItem('plan_choice', 'free');
    toast.success('Continuing on Free plan');
  };

  const handleSubscribeClick = (planType: 'subscriber') => {
    // Prepare and open confirmation dialog, then on continue we call checkout
    const purchase = { planType } as { planType: string };
    sessionStorage.setItem('pendingPurchase', JSON.stringify(purchase));
    setPendingPlan(purchase);
    setShowSubscribeConfirm(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    // Clean the session_id from URL so it does not re-open
    navigate('/dashboard', { replace: true });
  };

  const handleCancelSubscribe = () => {
    // User declined; keep browsing dashboard
    setShowSubscribeConfirm(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>User Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title}
                        isActive={isActive(item.url)}
                      >
                        <NavLink to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarGroup>
              <SidebarMenuButton className="w-full justify-between gap-3 h-12">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 rounded-md" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">John Doe</span>
                    <span className="text-xs text-muted-foreground">john@example.com</span>
                  </div>
                </div>
                <ChevronsUpDown className="h-5 w-5 rounded-md" />
              </SidebarMenuButton>
            </SidebarGroup>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          {/* Header */}
          <header className="border-b border-border bg-card">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold text-foreground">User Dashboard</h1>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            <Dialog open={showSubscribeConfirm} onOpenChange={setShowSubscribeConfirm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Continue to subscribe</DialogTitle>
                  <DialogDescription>
                    {pendingPlan?.planType === 'subscriber' ? 'You are about to start a monthly subscription.' : 'Proceed to payment to complete your purchase.'}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCancelSubscribe}>Not now</Button>
                  <Button onClick={handleContinueSubscribe}>Continue</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
              <DialogContent className="sm:max-w-md">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <DialogHeader>
                  <DialogTitle>Subscription Successful</DialogTitle>
                  <DialogDescription>
                    Your premium subscription is now active. Enjoy unlimited alerts and features.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={handleCloseSuccess} className="w-full">Go to Dashboard</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h2>
              <p className="text-muted-foreground">Stay updated with the latest gazette publications and tender opportunities.</p>
            </div>

            {/* Pricing / Plans */}
            <div className="mb-10">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Choose your plan</h3>
                  <p className="text-sm text-muted-foreground">Continue on Free or subscribe for full access</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/subscription')}>See all plans</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Free</CardTitle>
                        <CardDescription>Stay on the free trial and explore basics</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-2xl">
                      <span className="font-bold">$0</span>
                      <span className="text-sm text-muted-foreground">/ month</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Basic gazette search</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Limited notifications</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Save a few items</li>
                    </ul>
                    <div className="pt-2">
                      <Button variant="outline" onClick={startFreePlan}>Continue Free</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">Subscriber <Star className="h-4 w-4 text-primary" /></CardTitle>
                        <CardDescription>Unlock full access and priority alerts</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-2xl">
                      <span className="font-bold">$29</span>
                      <span className="text-sm text-muted-foreground">/ month</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited alerts</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Advanced filters</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Priority support</li>
                    </ul>
                    <div className="pt-2">
                      <Button onClick={() => handleSubscribeClick('subscriber')}>Subscribe</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Search Gazettes</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Find specific publications</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Browse Tenders</CardTitle>
                  <Gavel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">View available opportunities</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Manage your alerts</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calendar</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Important dates</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Publications</CardTitle>
                  <CardDescription>Latest gazette publications you might be interested in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <h4 className="font-medium">Government Tender Notice</h4>
                      <p className="text-sm text-muted-foreground">Published 2 hours ago</p>
                    </div>
                    <Badge variant="secondary">New</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <h4 className="font-medium">Regulatory Update</h4>
                      <p className="text-sm text-muted-foreground">Published 1 day ago</p>
                    </div>
                    <Badge variant="outline">Update</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <h4 className="font-medium">Public Notice</h4>
                      <p className="text-sm text-muted-foreground">Published 3 days ago</p>
                    </div>
                    <Badge variant="outline">Notice</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Saved Items</CardTitle>
                  <CardDescription>Documents and tenders you've bookmarked</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <h4 className="font-medium">Construction Tender - Road Works</h4>
                      <p className="text-sm text-muted-foreground">Deadline: Dec 15, 2024</p>
                    </div>
                    <Badge>Saved</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <h4 className="font-medium">IT Services Procurement</h4>
                      <p className="text-sm text-muted-foreground">Deadline: Dec 20, 2024</p>
                    </div>
                    <Badge>Saved</Badge>
                  </div>
                  <div className="text-center py-4">
                    <Button variant="outline" size="sm">View All Saved Items</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}