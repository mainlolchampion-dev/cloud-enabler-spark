import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, FileText, Users, Check, PartyPopper, UserPlus, Crown, ArrowUpRight, Shield, X, BarChart3, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInvitationsIndex } from "@/lib/invitationStorage";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { useToast } from "@/hooks/use-toast";
import MobileNav from "@/components/layout/MobileNav";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { SubscriptionsManagement } from "@/components/admin/SubscriptionsManagement";
import { SystemAnalytics } from "@/components/admin/SystemAnalytics";
import { AdminSubscriptionManager } from "@/components/admin/AdminSubscriptionManager";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscription, loading: subLoading, canCreateInvitation, limits } = useSubscription();
  const { isAdmin } = useAdminStatus();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalInvitations: 0,
    totalRevenue: 0,
  });
  const [stats, setStats] = useState({
    total: 0,
    weddings: 0,
    baptisms: 0,
    parties: 0,
    totalRSVPs: 0,
    totalGuests: 0,
    confirmedGuests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for successful payment
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      const plan = params.get("plan");
      toast({
        title: "Επιτυχής Πληρωμή!",
        description: `Η αγορά του ${plan} plan ολοκληρώθηκε επιτυχώς! Η συνδρομή σας ενημερώθηκε.`,
      });
      // Clear the URL parameters
      window.history.replaceState({}, "", "/dashboard");
    }
    
    loadStats();
    if (isAdmin) {
      loadAdminStats();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStats({
          total: 0,
          weddings: 0,
          baptisms: 0,
          parties: 0,
          totalRSVPs: 0,
          totalGuests: 0,
          confirmedGuests: 0,
        });
        return;
      }

      const { data: invitations, error } = await supabase
        .from('invitations')
        .select('id, type')
        .eq('user_id', user.id);

      if (error) throw error;

      const invitationsList = invitations || [];
      
      const weddings = invitationsList.filter(inv => inv.type === 'wedding').length;
      const baptisms = invitationsList.filter(inv => inv.type === 'baptism').length;
      const parties = invitationsList.filter(inv => inv.type === 'party').length;
      
      let totalRSVPs = 0;
      let totalGuests = 0;
      let confirmedGuests = 0;
      
      if (invitationsList.length > 0) {
        const { count: rsvpCount } = await supabase
          .from('rsvps')
          .select('*', { count: 'exact', head: true })
          .in('invitation_id', invitationsList.map(inv => inv.id));
        
        totalRSVPs = rsvpCount || 0;
        
        const { count: guestsCount } = await supabase
          .from('guests')
          .select('*', { count: 'exact', head: true })
          .in('invitation_id', invitationsList.map(inv => inv.id));
        
        totalGuests = guestsCount || 0;
        
        const { count: confirmedCount } = await supabase
          .from('rsvps')
          .select('*', { count: 'exact', head: true })
          .eq('will_attend', 'yes')
          .in('invitation_id', invitationsList.map(inv => inv.id));
        
        confirmedGuests = confirmedCount || 0;
      }
      
      setStats({
        total: invitationsList.length,
        weddings,
        baptisms,
        parties,
        totalRSVPs,
        totalGuests,
        confirmedGuests,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminStats = async () => {
    try {
      const { count: usersCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      const { count: subsCount } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: invitationsCount } = await supabase
        .from('invitations')
        .select('*', { count: 'exact', head: true });

      setAdminStats({
        totalUsers: usersCount || 0,
        activeSubscriptions: subsCount || 0,
        totalInvitations: invitationsCount || 0,
        totalRevenue: 0,
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
    }
  };

  const handleCreateInvitation = async (type: string) => {
    // Don't check subscription while still loading
    if (subLoading) {
      console.log("Subscription still loading, please wait...");
      return;
    }

    if (!subscription) {
      console.log("No subscription found, redirecting to pricing");
      toast({
        title: "Χρειάζεστε Πλάνο",
        description: "Για να δημιουργήσετε προσκλήσεις χρειάζεστε να αγοράσετε ένα πλάνο.",
        variant: "destructive",
      });
      navigate("/pricing");
      return;
    }

    console.log("Checking if user can create invitation...", { subscription });
    const can = await canCreateInvitation();
    console.log("Can create invitation:", can);
    
    if (!can) {
      toast({
        title: "Όριο προσκλήσεων",
        description: `Έχετε φτάσει το όριο των ${limits.maxInvitations} προσκλήσεων. Αναβαθμίστε το πλάνο σας για περισσότερες.`,
        variant: "destructive",
      });
      navigate("/pricing");
      return;
    }
    navigate(`/${type}/add`);
  };

  if (showAdminPanel && isAdmin) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-red-600" />
                <h1 className="font-serif text-4xl font-bold text-foreground">Admin Dashboard</h1>
              </div>
              <p className="text-muted-foreground text-lg">Διαχείριση συστήματος και χρηστών</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAdminPanel(false)}
            >
              <X className="w-4 h-4 mr-2" />
              Κλείσιμο
            </Button>
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
                <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
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
                <div className="text-2xl font-bold">{adminStats.activeSubscriptions}</div>
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
                <div className="text-2xl font-bold">{adminStats.totalInvitations}</div>
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
                <div className="text-2xl font-bold">€{adminStats.totalRevenue}</div>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif mb-2">Πίνακας Ελέγχου</h1>
            <p className="text-muted-foreground">Καλώς ήρθατε στην πλατφόρμα διαχείρισης προσκλήσεων</p>
          </div>
          <MobileNav />
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Admin Panel Card - Only visible for admins */}
          {isAdmin && (
            <Card 
              className="hover:shadow-lg transition-shadow bg-gradient-to-br from-red-500/10 to-red-500/5 cursor-pointer border-red-200 dark:border-red-800"
              onClick={() => setShowAdminPanel(true)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Admin Panel
                </CardTitle>
                <Shield className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-serif font-bold text-red-600 mb-2">
                  Διαχείριση
                </div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs text-red-600"
                >
                  Ανοιγμα <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Subscription Card */}
          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Το Πλάνο σας
              </CardTitle>
              <Crown className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              {subLoading ? (
                <div className="text-2xl font-serif font-bold">...</div>
              ) : subscription ? (
                <>
                  <div className="text-2xl font-serif font-bold capitalize mb-2">
                    {subscription.plan_type}
                  </div>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-xs text-primary"
                    onClick={() => navigate("/subscription")}
                  >
                    Διαχείριση <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-lg font-semibold mb-2 text-muted-foreground">
                    Χωρίς Πλάνο
                  </div>
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate("/pricing")}
                  >
                    Αγορά Πλάνου
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Συνολικές Προσκλήσεις
              </CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold">
                {loading ? "..." : stats.total}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total === 0 ? "Δημιουργήστε την πρώτη σας" : "Ενεργές προσκλήσεις"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Γάμοι
              </CardTitle>
              <Heart className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold text-primary">
                {loading ? "..." : stats.weddings}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Προσκλήσεις γάμου</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Βαπτίσεις
              </CardTitle>
              <Users className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold text-secondary">
                {loading ? "..." : stats.baptisms}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Προσκλήσεις βάπτισης</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Πάρτι
              </CardTitle>
              <PartyPopper className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold text-accent">
                {loading ? "..." : stats.parties}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Προσκλήσεις πάρτι</p>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="w-5 h-5 text-primary" />
                Καλεσμένοι
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-serif font-bold mb-2">
                {loading ? "..." : stats.totalGuests}
              </div>
              <p className="text-sm text-muted-foreground">
                Σύνολο καλεσμένων στη λίστα
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-primary" />
                Απαντήσεις RSVP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-serif font-bold mb-2">
                {loading ? "..." : stats.totalRSVPs}
              </div>
              <p className="text-sm text-muted-foreground">
                Συνολικές απαντήσεις
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Check className="w-5 h-5 text-green-600" />
                Επιβεβαιώσεις
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-serif font-bold mb-2 text-green-600">
                {loading ? "..." : stats.confirmedGuests}
              </div>
              <p className="text-sm text-muted-foreground">
                Θα παραστούν στην εκδήλωση
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Γρήγορες Ενέργειες</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-auto py-6 flex flex-col gap-2" 
              onClick={() => handleCreateInvitation('wedding')}
            >
              <Heart className="w-6 h-6" />
              <span className="font-serif text-lg">Νέα Πρόσκληση Γάμου</span>
            </Button>
            <Button 
              className="h-auto py-6 flex flex-col gap-2" 
              variant="outline" 
              onClick={() => handleCreateInvitation('baptism')}
            >
              <Users className="w-6 h-6" />
              <span className="font-serif text-lg">Νέα Πρόσκληση Βάπτισης</span>
            </Button>
            <Button 
              className="h-auto py-6 flex flex-col gap-2" 
              variant="outline" 
              onClick={() => handleCreateInvitation('party')}
            >
              <PartyPopper className="w-6 h-6" />
              <span className="font-serif text-lg">Νέα Πρόσκληση Πάρτι</span>
            </Button>
          </CardContent>
        </Card>

        {/* View All Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Οι Προσκλήσεις σας</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => navigate('/wedding/all')} 
              variant="outline" 
              className="h-auto py-4 justify-start"
            >
              <Heart className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-semibold">Γάμοι</div>
                <div className="text-xs text-muted-foreground">
                  {stats.weddings} {stats.weddings === 1 ? 'πρόσκληση' : 'προσκλήσεις'}
                </div>
              </div>
            </Button>
            <Button 
              onClick={() => navigate('/baptism/all')} 
              variant="outline" 
              className="h-auto py-4 justify-start"
            >
              <Users className="w-5 h-5 mr-3 text-secondary" />
              <div className="text-left">
                <div className="font-semibold">Βαπτίσεις</div>
                <div className="text-xs text-muted-foreground">
                  {stats.baptisms} {stats.baptisms === 1 ? 'πρόσκληση' : 'προσκλήσεις'}
                </div>
              </div>
            </Button>
            <Button 
              onClick={() => navigate('/party/all')} 
              variant="outline" 
              className="h-auto py-4 justify-start"
            >
              <PartyPopper className="w-5 h-5 mr-3 text-accent" />
              <div className="text-left">
                <div className="font-semibold">Πάρτι</div>
                <div className="text-xs text-muted-foreground">
                  {stats.parties} {stats.parties === 1 ? 'πρόσκληση' : 'προσκλήσεις'}
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
