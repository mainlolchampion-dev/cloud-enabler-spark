import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, FileText, Users, Check, PartyPopper, UserPlus, Crown, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import MobileNav from "@/components/layout/MobileNav";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscription, loading: subLoading, canCreateInvitation, limits } = useSubscription();
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
  }, []);

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
      console.error('[DASHBOARD] Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSubscription = async () => {
    try {
      toast({
        title: "Ανανέωση...",
        description: "Έλεγχος κατάστασης συνδρομής από το Stripe...",
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Σφάλμα",
          description: "Δεν βρέθηκε ενεργή σύνδεση. Παρακαλώ συνδεθείτε ξανά.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        toast({
          title: "Σφάλμα",
          description: "Δεν ήταν δυνατός ο έλεγχος της συνδρομής.",
          variant: "destructive",
        });
        return;
      }

      // Wait a bit and reload
      await new Promise(resolve => setTimeout(resolve, 1500));
      window.location.reload();
    } catch (error) {
      console.error('[DASHBOARD] Error refreshing subscription:', error);
      toast({
        title: "Σφάλμα",
        description: "Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.",
        variant: "destructive",
      });
    }
  };

  const handleCreateInvitation = async (type: string) => {
    console.log("[DASHBOARD] Create invitation clicked:", { 
      type, 
      subLoading, 
      subscription,
      hasSubscription: !!subscription,
      planType: subscription?.plan_type
    });

    // Don't proceed while still loading
    if (subLoading) {
      console.log("[DASHBOARD] Subscription still loading");
      toast({
        title: "Παρακαλώ περιμένετε",
        description: "Φόρτωση πληροφοριών συνδρομής...",
      });
      return;
    }

    // If no subscription, go to pricing
    if (!subscription) {
      console.log("[DASHBOARD] No subscription, redirecting to pricing");
      toast({
        title: "Χρειάζεστε Πλάνο",
        description: "Για να δημιουργήσετε προσκλήσεις χρειάζεστε να αγοράσετε ένα πλάνο.",
        variant: "destructive",
      });
      navigate("/pricing");
      return;
    }

    // Check if user can create more invitations
    console.log("[DASHBOARD] Checking if user can create invitation");
    const can = await canCreateInvitation();
    console.log("[DASHBOARD] Can create:", can);
    
    if (!can) {
      toast({
        title: "Όριο προσκλήσεων",
        description: `Έχετε φτάσει το όριο των ${limits.maxInvitations} προσκλήσεων. Αναβαθμίστε το πλάνο σας για περισσότερες.`,
        variant: "destructive",
      });
      navigate("/pricing");
      return;
    }
    
    // All good, navigate to create page
    console.log("[DASHBOARD] Navigating to:", `/${type}/add`);
    navigate(`/${type}/add`);
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <div className="flex gap-2">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-xs text-primary"
                      onClick={() => navigate("/subscription")}
                    >
                      Διαχείριση <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-auto py-1 px-2 text-xs"
                      onClick={handleRefreshSubscription}
                    >
                      🔄 Ανανέωση
                    </Button>
                  </div>
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
