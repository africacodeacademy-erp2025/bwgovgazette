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
  Heart,
  MapPin, 
  DollarSign, 
  Clock
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

export default function BrowseTenders() {
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

  const mockTenders = [
    {
      id: 1,
      title: "Road Construction Project - Phase 2",
      description: "Construction and maintenance of 50km highway connecting major cities",
      deadline: "2024-12-15",
      budget: "BWP 2.5M - 5M",
      location: "Northern Province",
      category: "Infrastructure",
      status: "Open",
      daysLeft: 5,
    },
    {
      id: 2,
      title: "IT Services and Equipment Procurement",
      description: "Supply and installation of computer equipment and software licenses",
      deadline: "2024-12-20",
      budget: "BWP 500K - 1M",
      location: "Capital City",
      category: "Technology",
      status: "Open",
      daysLeft: 10,
    },
    {
      id: 3,
      title: "Healthcare Facility Construction",
      description: "Design and construction of modern healthcare facility with 100 beds",
      deadline: "2024-12-25",
      budget: "BWP 10M+",
      location: "Southern Province",
      category: "Healthcare",
      status: "Open",
      daysLeft: 15,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-500";
      case "Closing Soon":
        return "bg-yellow-500";
      case "Closed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

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
                <h1 className="text-2xl font-bold text-foreground">Browse Tenders</h1>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Browse Tenders</h2>
              <p className="text-muted-foreground">Discover available tender opportunities and procurement notices</p>
            </div>

            {/* Filter Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filter Tenders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 flex-wrap">
                  <Button variant="outline" size="sm">All Categories</Button>
                  <Button variant="outline" size="sm">Infrastructure</Button>
                  <Button variant="outline" size="sm">Technology</Button>
                  <Button variant="outline" size="sm">Healthcare</Button>
                  <Button variant="outline" size="sm">Education</Button>
                </div>
              </CardContent>
            </Card>

            {/* Tenders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTenders.map((tender) => (
                <Card key={tender.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Gavel className="h-5 w-5 text-primary" />
                          <CardTitle className="text-xl">{tender.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base">{tender.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{tender.category}</Badge>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(tender.status)}`} title={tender.status} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Deadline: {tender.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Budget: {tender.budget}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{tender.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600 font-medium">
                          {tender.daysLeft} days left
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}