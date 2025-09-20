import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  Heart,
  BellRing, 
  Mail, 
  Smartphone, 
  Check, 
  X
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';

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
                    <span className="text-sm font-medium">{displayName}</span>
                    <span className="text-xs text-muted-foreground">{displayEmail}</span>
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
                <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}