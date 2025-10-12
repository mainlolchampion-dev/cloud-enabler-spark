import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, FileText, Users, Check, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInvitationsIndex } from "@/lib/invitationStorage";
import { supabase } from "@/integrations/supabase/client";
import MobileNav from "@/components/layout/MobileNav";

export default function Dashboard() {
  const navigate = useNavigate();
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
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Get all invitations
      const invitations = await getInvitationsIndex();
      
      // Count by type
      const weddings = invitations.filter(inv => inv.type === 'wedding').length;
      const baptisms = invitations.filter(inv => inv.type === 'baptism').length;
      const parties = invitations.filter(inv => inv.type === 'party').length;
      
      // Get total RSVPs count
      const { data: { user } } = await supabase.auth.getUser();
      let totalRSVPs = 0;
      let totalGuests = 0;
      let confirmedGuests = 0;
      
      if (user) {
        const { count: rsvpCount } = await supabase
          .from('rsvps')
          .select('*', { count: 'exact', head: true })
          .in('invitation_id', invitations.map(inv => inv.id));
        
        totalRSVPs = rsvpCount || 0;
        
        // Get guests count
        const { count: guestsCount } = await supabase
          .from('guests')
          .select('*', { count: 'exact', head: true })
          .in('invitation_id', invitations.map(inv => inv.id));
        
        totalGuests = guestsCount || 0;
        
        // Get confirmed RSVPs
        const { count: confirmedCount } = await supabase
          .from('rsvps')
          .select('*', { count: 'exact', head: true })
          .eq('will_attend', 'yes')
          .in('invitation_id', invitations.map(inv => inv.id));
        
        confirmedGuests = confirmedCount || 0;
      }
      
      setStats({
        total: invitations.length,
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Πίνακας Ελέγχου</h1>
          <MobileNav />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Συνολικές Προσκλήσεις</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.total}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.total === 0 ? "Δημιουργήστε την πρώτη σας πρόσκληση" : "Ενεργές προσκλήσεις"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Γάμοι</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.weddings}
              </div>
              <p className="text-xs text-muted-foreground">Προσκλήσεις γάμου</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Βαπτίσεις</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.baptisms}
              </div>
              <p className="text-xs text-muted-foreground">Προσκλήσεις βάπτισης</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Πάρτι</CardTitle>
              <PartyPopper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.parties}
              </div>
              <p className="text-xs text-muted-foreground">Προσκλήσεις πάρτι</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Συνολικοί Καλεσμένοι</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">
                {loading ? "..." : stats.totalGuests}
              </div>
              <p className="text-muted-foreground">
                Σύνολο καλεσμένων στη λίστα
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Απαντήσεις RSVP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">
                {loading ? "..." : stats.totalRSVPs}
              </div>
              <p className="text-muted-foreground">
                Συνολικές απαντήσεις
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Επιβεβαιώσεις</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-green-600">
                {loading ? "..." : stats.confirmedGuests}
              </div>
              <p className="text-muted-foreground">
                Θα παραστούν στην εκδήλωση
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Γρήγορες Ενέργειες</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => navigate('/wedding/add')}>
                <Heart className="w-4 h-4 mr-2" />
                Νέα Πρόσκληση Γάμου
              </Button>
              <Button className="w-full" variant="outline" onClick={() => navigate('/baptism/add')}>
                <Users className="w-4 h-4 mr-2" />
                Νέα Πρόσκληση Βάπτισης
              </Button>
              <Button className="w-full" variant="outline" onClick={() => navigate('/party/add')}>
                <PartyPopper className="w-4 h-4 mr-2" />
                Νέα Πρόσκληση Πάρτι
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Καλώς ήρθατε!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Καλώς ήρθατε στην πλατφόρμα δημιουργίας προσκλήσεων. Ξεκινήστε δημιουργώντας την πρώτη
              σας πρόσκληση γάμου, βάπτισης ή πάρτι από το μενού στα αριστερά.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Button onClick={() => navigate('/wedding/all')} variant="outline" className="justify-start">
                <Heart className="w-4 h-4 mr-2" />
                Δείτε όλους τους Γάμους
              </Button>
              <Button onClick={() => navigate('/baptism/all')} variant="outline" className="justify-start">
                <Users className="w-4 h-4 mr-2" />
                Δείτε όλες τις Βαπτίσεις
              </Button>
              <Button onClick={() => navigate('/party/all')} variant="outline" className="justify-start">
                <PartyPopper className="w-4 h-4 mr-2" />
                Δείτε όλα τα Πάρτι
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
