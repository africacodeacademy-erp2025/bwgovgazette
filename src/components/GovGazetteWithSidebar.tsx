import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/animated-sidebar";
import { 
  LayoutDashboard, 
  Search, 
  Calendar, 
  Bell, 
  Bookmark, 
  Settings, 
  User,
  FileText,
  Eye,
  Building
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function GovGazetteWithSidebar() {
  const { signOut, user } = useAuth();
  const location = useLocation();
  
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="text-sidebar-foreground h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Search Gazettes",
      href: "/search-gazettes",
      icon: <Search className="text-sidebar-foreground h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Browse Tenders",
      href: "/browse-tenders",
      icon: <Building className="text-sidebar-foreground h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Calendar",
      href: "/calendar",
      icon: <Calendar className="text-sidebar-foreground h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: <Bell className="text-sidebar-foreground h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Saved Items",
      href: "/saved-items",
      icon: <Bookmark className="text-sidebar-foreground h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="text-sidebar-foreground h-5 w-5 flex-shrink-0" />
    }
  ];

  const [open, setOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn("flex flex-col md:flex-row bg-background w-full flex-1 overflow-hidden", "h-screen")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-sidebar-background">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={link}
                  className={isActive(link.href) ? "bg-sidebar-accent" : ""}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <SidebarLink 
              link={{
                label: user?.email || "User",
                href: "/settings",
                icon: (
                  <div className="h-7 w-7 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )
              }} 
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={signOut}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              Sign Out
            </Button>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col p-6 overflow-auto bg-background">
          <DashboardContent />
        </div>
      </div>
    </div>
  );
}

const DashboardContent = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome to GovGazette</h1>
        <p className="text-muted-foreground">
          Your comprehensive portal for Botswana Government Gazette publications and tender opportunities.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search Gazettes</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Find specific publications and documents
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Browse Tenders</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Explore business opportunities
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Stay updated with alerts
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calendar</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              View publication schedule
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Publications</CardTitle>
            <CardDescription>Latest government gazette issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Government Gazette No. 156
                </p>
                <p className="text-sm text-muted-foreground">
                  Published 2 days ago
                </p>
              </div>
              <Badge variant="secondary">New</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-green-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Tender Notice No. 45
                </p>
                <p className="text-sm text-muted-foreground">
                  Published 5 days ago
                </p>
              </div>
              <Badge variant="outline">Tender</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Eye className="h-8 w-8 text-purple-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Legal Notice No. 234
                </p>
                <p className="text-sm text-muted-foreground">
                  Published 1 week ago
                </p>
              </div>
              <Badge variant="outline">Legal</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Saved Items</CardTitle>
            <CardDescription>Documents you've bookmarked</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Bookmark className="h-8 w-8 text-yellow-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Mining License Applications
                </p>
                <p className="text-sm text-muted-foreground">
                  Saved 3 days ago
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bookmark className="h-8 w-8 text-red-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Public Tender: Road Construction
                </p>
                <p className="text-sm text-muted-foreground">
                  Saved 1 week ago
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bookmark className="h-8 w-8 text-blue-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Land Allocation Notice
                </p>
                <p className="text-sm text-muted-foreground">
                  Saved 2 weeks ago
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const Logo = () => {
  return (
    <Link to="/dashboard" className="font-normal flex space-x-2 items-center text-sm text-sidebar-foreground py-1 relative z-20">
      <div className="h-5 w-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="font-medium text-sidebar-foreground whitespace-pre"
      >
        GovGazette
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link to="/dashboard" className="font-normal flex space-x-2 items-center text-sm text-sidebar-foreground py-1 relative z-20">
      <div className="h-5 w-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};