"use client";

import { useEffect, useState } from 'react';
import { useParams, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner-1";
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
import { Calendar, Download, FileText, Gavel, Heart, LayoutDashboard, Search, Settings, User, Bell, ChevronsUpDown, Eye } from 'lucide-react';
import { type Gazette } from '@/services/GazetteService';
import { useAuth } from '@/hooks/useAuth';

const mockGazettes: Gazette[] = [
  {
    id: '1',
    file_name: "Government Tender Notice - Infrastructure Development",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    extracted_text: "This is the full extracted text for the infrastructure development tender. It includes details about road construction, maintenance requirements, submission deadlines, and contact information for inquiries.",
    processing_status: "Tender",
    created_at: "2024-12-10T10:00:00Z",
  },
  {
    id: '2',
    file_name: "Public Notice - Environmental Assessment",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    extracted_text: "This document outlines the environmental impact assessment for the proposed mining operations in the northern region. It covers potential effects on local wildlife, water sources, and air quality. Public feedback is requested by January 15, 2025.",
    processing_status: "Notice",
    created_at: "2024-12-09T14:30:00Z",
  },
  {
    id: '3',
    file_name: "Regulatory Update - Building Codes",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    extracted_text: "This gazette contains the latest updates to the national building codes. Key changes include new fire safety regulations, updated structural integrity standards for commercial properties, and new requirements for energy efficiency.",
    processing_status: "Regulation",
    created_at: "2024-12-08T09:00:00Z",
  },
];

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Search Gazettes", url: "/search", icon: Search },
  { title: "Browse Tenders", url: "/tenders", icon: Gavel },
  { title: "Saved Items", url: "/saved", icon: Heart },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

export default function GazetteViewPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const currentPath = location.pathname;

  const [gazette, setGazette] = useState<Gazette | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const isActive = (path: string) => currentPath === path;
  const displayName = (user?.user_metadata as any)?.full_name || (user?.email ? user.email.split('@')[0] : 'User');
  const displayEmail = user?.email || '';

  useEffect(() => {
    setLoading(true);
    if (id) {
      const foundGazette = mockGazettes.find(g => g.id === id);
      setTimeout(() => { // Simulate network delay
        if (foundGazette) {
          setGazette(foundGazette);
          setPdfUrl(foundGazette.file_url);
        } else {
          setGazette(null);
          setPdfUrl(null);
        }
        setLoading(false);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleDownload = () => {
    if (!gazette?.file_url) return;
    const link = document.createElement('a');
    link.href = gazette.file_url;
    link.download = gazette.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.url)}>
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
          <header className="border-b border-border bg-card">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold text-foreground">Gazette</h1>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            {loading && (
              <div className="flex items-center justify-center p-12">
                <Spinner size={32} />
                <span className="ml-3 text-muted-foreground">Loading gazette...</span>
              </div>
            )}
            {!loading && !gazette && (
              <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">Gazette not found.</div>
            )}
            {!loading && gazette && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Row 1, Col 1: Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Overview</CardTitle>
                    <CardDescription>Document overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="font-medium">{gazette.file_name}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{new Date(gazette.created_at).toLocaleString()}</div>
                    <div className="flex items-center gap-2"><Badge variant="secondary">{gazette.processing_status}</Badge></div>
                  </CardContent>
                </Card>

                {/* Row 1, Col 2: Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Download or navigate</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {gazette.file_url && (
                      <Button size="sm" onClick={handleDownload} className="gap-2"><Download className="h-4 w-4" />Download</Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => navigate(-1)}>Back</Button>
                  </CardContent>
                </Card>

                {/* Row 2, Col 1: PDF Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5 text-primary" />PDF Preview</CardTitle>
                    <CardDescription>Inline preview when available</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pdfUrl ? (
                      <div className="border rounded-md overflow-hidden">
                        <iframe
                          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                          title="PDF Preview"
                          className="w-full h-[300px] bg-white"
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No PDF available for preview.</div>
                    )}
                  </CardContent>
                </Card>

                {/* Row 2, Col 2: Extracted Text */}
                <Card>
                  <CardHeader>
                    <CardTitle>Extracted Text</CardTitle>
                    <CardDescription>OCR/parsed content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] pr-3">
                      {gazette.extracted_text ? (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{gazette.extracted_text}</div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No extracted content available.</div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

