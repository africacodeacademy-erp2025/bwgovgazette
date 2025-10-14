import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users as UsersIcon, Download, Bell, Loader2, TrendingUp, TrendingDown, Eye, Edit, Trash2, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { type Gazette } from './ManageGazettesDb'; // Re-use the interface
import { toast } from 'sonner';

interface DashboardStats {
  totalGazettes: number;
  activeUsers: number;
  totalDownloads: number;
  pendingApprovals: number;
}

export default function AdminDashboardDb() {
  const [stats, setStats] = useState<DashboardStats>({
    totalGazettes: 0,
    activeUsers: 0,
    totalDownloads: 0,
    pendingApprovals: 0
  });
  const [recentGazettes, setRecentGazettes] = useState<Gazette[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch stats and recent gazettes in parallel
      const [
        gazettesCountResponse,
        usersCountResponse,
        pendingCountResponse,
        recentGazettesResponse
      ] = await Promise.all([
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('processing_status', 'pending'),
        supabase.from('documents').select('*, document_texts(content)').order('created_at', { ascending: false }).limit(2)
      ]);

      const { count: totalGazettes, error: gazettesError } = gazettesCountResponse;
      const { count: activeUsers, error: usersError } = usersCountResponse;
      const { count: pendingApprovals, error: pendingError } = pendingCountResponse;
      const { data: recentGazettes, error: recentGazettesError } = recentGazettesResponse;

      if (gazettesError) throw gazettesError;
      if (usersError) throw usersError;
      if (pendingError) throw pendingError;
      if (recentGazettesError) throw recentGazettesError;

      setStats({
        totalGazettes: totalGazettes || 0,
        activeUsers: activeUsers || 0,
        totalDownloads: 0, // Placeholder, as download tracking isn't implemented
        pendingApprovals: pendingApprovals || 0
      });

      setRecentGazettes(recentGazettes || []);

    } catch (error: any) {
      console.error('Error loading dashboard stats:', error);
      toast.error(error.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Gazettes',
      value: stats.totalGazettes.toLocaleString(),
      change: '+12%',
      trend: 'up' as const,
      icon: FileText,
      color: 'text-black',
      bgColor: 'bg-gray-200'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      change: '+5%',
      trend: 'up' as const,
      icon: UsersIcon,
      color: 'text-black',
      bgColor: 'bg-gray-200'
    },
    {
      title: 'Downloads Today',
      value: stats.totalDownloads.toLocaleString(),
      change: '+23%',
      trend: 'up' as const,
      icon: Download,
      color: 'text-black',
      bgColor: 'bg-gray-200'
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals.toLocaleString(),
      change: '-8%',
      trend: 'down' as const,
      icon: Bell,
      color: 'text-black',
      bgColor: 'bg-gray-200'
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center mt-1">
                    <TrendIcon className={`h-4 w-4 mr-1 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`} />
                    <p className={`text-xs ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </p>
                    <span className="text-xs text-muted-foreground ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your platform efficiently</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Navigate to different sections using the sidebar to manage gazettes, users, and more.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform updates</CardDescription>
          </CardHeader>
          <CardContent>
            {recentGazettes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentGazettes.map((gazette) => (
                  <div key={gazette.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        gazette.processing_status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {gazette.processing_status}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(gazette.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm truncate">{gazette.file_name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {(gazette.document_texts && gazette.document_texts.length > 0 && gazette.document_texts[0].content)
                        ? gazette.document_texts[0].content
                        : 'No content preview.'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent gazettes to display.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
