import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calendar as CalendarIcon, 
  Search, 
  Gavel, 
  Bell, 
  LayoutDashboard, 
  User, 
  Settings, 
  ChevronsUpDown,
  Heart,
  Clock, 
  MapPin, 
  Plus
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

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
    icon: CalendarIcon,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const upcomingEvents = [
    {
      id: 1,
      title: "Road Construction Tender Deadline",
      date: "2024-12-15",
      time: "17:00",
      type: "deadline",
      description: "Final submission for Phase 2 road construction project",
    },
    {
      id: 2,
      title: "IT Services Tender Deadline",
      date: "2024-12-20",
      time: "12:00",
      type: "deadline",
      description: "Computer equipment procurement tender closes",
    },
    {
      id: 3,
      title: "Gazette Publication",
      date: "2024-12-18",
      time: "09:00",
      type: "publication",
      description: "Weekly government gazette release",
    },
    {
      id: 4,
      title: "Healthcare Facility Tender Opening",
      date: "2024-12-22",
      time: "10:00",
      type: "opening",
      description: "New tender for healthcare facility construction",
    },
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "deadline":
        return "destructive";
      case "publication":
        return "secondary";
      case "opening":
        return "default";
      default:
        return "outline";
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "deadline":
        return "Deadline";
      case "publication":
        return "Publication";
      case "opening":
        return "Opening";
      default:
        return "Event";
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
                <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
              </div>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">Calendar</h2>
                  <p className="text-muted-foreground">Track important dates and deadlines</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Events */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="upcoming" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
                    <TabsTrigger value="all">All Events</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                        <CardDescription>Events and deadlines in the next 30 days</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {upcomingEvents.map((event) => (
                          <div
                            key={event.id}
                            className="p-4 rounded-lg border hover:shadow-sm transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{event.title}</h4>
                              <Badge variant={getEventTypeColor(event.type)}>
                                {getEventTypeLabel(event.type)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{event.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="deadlines" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tender Deadlines</CardTitle>
                        <CardDescription>Important submission deadlines</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {upcomingEvents
                          .filter((event) => event.type === "deadline")
                          .map((event) => (
                            <div
                              key={event.id}
                              className="p-4 rounded-lg border border-red-200 bg-red-50 hover:shadow-sm transition-shadow"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-red-900">{event.title}</h4>
                                <Badge variant="destructive">Deadline</Badge>
                              </div>
                              <p className="text-sm text-red-700 mb-3">
                                {event.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-red-600">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{event.time}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="all" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>All Events</CardTitle>
                        <CardDescription>Complete calendar view</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {upcomingEvents.map((event) => (
                          <div
                            key={event.id}
                            className="p-4 rounded-lg border hover:shadow-sm transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{event.title}</h4>
                              <Badge variant={getEventTypeColor(event.type)}>
                                {getEventTypeLabel(event.type)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{event.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}