"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SubscriptionPricing from '@/components/SubscriptionPricing';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Menu, X, LogOut, User, Bell, Check, BellRing, Mail, Smartphone } from "lucide-react";
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
export default function Notifications() {
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
  const notifications = [{
    id: 1,
    title: "New Tender Published",
    message: "A new tender for road construction has been published matching your interests.",
    time: "2 hours ago",
    read: false,
    type: "tender"
  }];
  return <div className="flex h-screen w-screen bg-gray-50">
      <DashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} userName={displayName} currentPlan={currentPlan} onUpgradeClick={() => setShowPricingModal(true)} />
      
      <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border md:hidden">
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div className={cn("flex-1 transition-all", isCollapsed ? "md:ml-[3.05rem]" : "md:ml-60")}>
        <div className="flex flex-col h-full">
          <header className="bg-white border-b p-4">
            <div className="flex items-center justify-end">
              
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-white">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Notifications</h2>
                <p className="text-muted-foreground">Manage your alerts and notification preferences</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Recent Notifications</CardTitle>
                        <Button variant="outline" size="sm">Mark All Read</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {notifications.map(notification => <div key={notification.id} className={`p-4 rounded-lg border ${notification.read ? "bg-muted/30" : "bg-card"} hover:shadow-sm transition-shadow`}>
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full ${notification.read ? "bg-muted" : "bg-primary/10"}`}>
                                <Bell className={`h-4 w-4 ${notification.read ? "text-muted-foreground" : "text-primary"}`} />
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-medium ${notification.read ? "text-muted-foreground" : "text-foreground"}`}>
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <span className="text-xs text-muted-foreground">{notification.time}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!notification.read && <Button variant="ghost" size="sm">
                                  <Check className="h-4 w-4" />
                                </Button>}
                              <Button variant="ghost" size="sm">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>)}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>Choose how you want to be notified</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Email Notifications</p>
                              <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Push Notifications</p>
                              <p className="text-sm text-muted-foreground">Browser notifications</p>
                            </div>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <BellRing className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Deadline Reminders</p>
                              <p className="text-sm text-muted-foreground">Tender deadline alerts</p>
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
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