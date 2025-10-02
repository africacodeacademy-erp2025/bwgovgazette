"use client";

import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner-1";
import SubscriptionPricing from '@/components/SubscriptionPricing';

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
  BellRing,
  Mail,
  Smartphone,
  Check
} from "lucide-react";

function cn(...inputs: any[]) { return inputs.filter(Boolean).join(" "); }
const sidebarVariants = { open: { width: "15rem" }, closed: { width: "3.05rem" } };
const variants = { open: { x: 0, opacity: 1 }, closed: { x: -20, opacity: 0, transition: { duration: 0.2 } } };
const transitionProps = { type: "tween" as const, ease: [0.4, 0, 0.2, 1] as const, duration: 0.2 };

// --- SIDEBAR COMPONENT ---
function DashboardSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  userName,
  currentPlan,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (o: boolean) => void;
  userName: string;
  currentPlan: string | null;
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

export default function Notifications() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => currentPath === path;
  const displayName = (user?.user_metadata as any)?.full_name || (user?.email ? user.email.split('@')[0] : 'User');
  const displayEmail = user?.email || '';

  // State for sidebar and modal
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

  const notifications = [
    {
      id: 1,
      title: "New Tender Published",
      message: "A new tender for road construction has been published matching your interests.",
      time: "2 hours ago",
      read: false,
      type: "tender",
    },
    {
      id: 2,
      title: "Tender Deadline Reminder",
      message: "The deadline for IT Services tender is in 3 days.",
      time: "1 day ago",
      read: false,
      type: "reminder",
    },
    {
      id: 3,
      title: "Gazette Update",
      message: "New regulatory updates have been published in today's gazette.",
      time: "2 days ago",
      read: true,
      type: "gazette",
    },
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
      />
      <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border md:hidden">
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <div className={cn("flex-1 transition-all", isCollapsed ? "md:ml-[3.05rem]" : "md:ml-60")}>
        <div className="flex flex-col h-full">
          <header className="bg-white border-b p-4">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-4">
                {currentPlan !== 'subscriber' && (
                  <Button variant="default" size="sm" onClick={() => setShowPricingModal(true)}>
                    Upgrade
                  </Button>
                )}
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500">{displayEmail}</p>
                </div>
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
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Notifications</h2>
              <p className="text-muted-foreground">Manage your alerts and notification preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Notification List */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Notifications</CardTitle>
                      <Button variant="outline" size="sm">Mark All Read</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border ${
                          notification.read ? "bg-muted/30" : "bg-card"
                        } hover:shadow-sm transition-shadow`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${
                              notification.read ? "bg-muted" : "bg-primary/10"
                            }`}>
                              <Bell className={`h-4 w-4 ${
                                notification.read ? "text-muted-foreground" : "text-primary"
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-medium ${
                                notification.read ? "text-muted-foreground" : "text-foreground"
                              }`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <span className="text-xs text-muted-foreground">{notification.time}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button variant="ghost" size="sm">
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Notification Settings */}
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

                <Card>
                  <CardHeader>
                    <CardTitle>Alert Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Categories</label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">New Tenders</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Gazette Updates</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Regulatory Changes</span>
                          <Switch />
                        </div>
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
    </div>
  );
}