import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, CreditCard, BarChart3, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { SubscriptionsManagement } from "@/components/admin/SubscriptionsManagement";
import { SystemAnalytics } from "@/components/admin/SystemAnalytics";
import { AdminSubscriptionManager } from "@/components/admin/AdminSubscriptionManager";

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalInvitations: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalInvitations: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Get total users count
      const { count: usersCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      // Get active subscriptions
      const { count: subsCount } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get total invitations
      const { count: invitationsCount } = await supabase
        .from('invitations')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: usersCount || 0,
        activeSubscriptions: subsCount || 0,
        totalInvitations: invitationsCount || 0,
        totalRevenue: 0, // This would need to be calculated from Stripe data
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Σφάλμα φόρτωσης στατιστικών');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Φόρτωση...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="font-serif text-4xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-lg">Διαχείριση συστήματος και χρηστών</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Σύνολο Χρηστών
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ενεργές Συνδρομές
              </CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Προσκλήσεις
              </CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInvitations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Συνολικά Έσοδα
              </CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.totalRevenue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Χρήστες</TabsTrigger>
            <TabsTrigger value="subscriptions">Συνδρομές</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="my-subscription">Η Συνδρομή μου</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="subscriptions" className="mt-6">
            <SubscriptionsManagement />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <SystemAnalytics />
          </TabsContent>

          <TabsContent value="my-subscription" className="mt-6">
            <AdminSubscriptionManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
