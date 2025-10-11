import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, FileText, Users, Check, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInvitationsIndex } from "@/lib/invitationStorage";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    weddings: 0,
    baptisms: 0,
    parties: 0,
    totalRSVPs: 0,
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
      
      if (user) {
        const { count } = await supabase
          .from('rsvps')
          .select('*', { count: 'exact', head: true })
          .in('invitation_id', invitations.map(inv => inv.id));
        
        totalRSVPs = count || 0;
      }
      
      setStats({
        total: invitations.length,
        weddings,
        baptisms,
        parties,
        totalRSVPs,
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
        <h1 className="text-3xl font-bold mb-6">Πίνακας Ελέγχου</h1>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Απαντήσεις RSVP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">
                {loading ? "..." : stats.totalRSVPs}
              </div>
              <p className="text-muted-foreground">
                Συνολικές απαντήσεις από καλεσμένους
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
            <p className="text-muted-foreground">
              Καλώς ήρθατε στην πλατφόρμα δημιουργίας προσκλήσεων. Ξεκινήστε δημιουργώντας την πρώτη
              σας πρόσκληση γάμου ή βάπτισης από το μενού στα αριστερά.
            </p>
          </CardContent>
        </Card>

        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Επιλέξτε το πλάνο σας</h2>
            <p className="text-muted-foreground">Εφάπαξ πληρωμή, χωρίς κρυφές χρεώσεις</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Basic</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€39</span>
                  <span className="text-muted-foreground ml-2">εφάπαξ</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Ιδανικό για απλές εκδηλώσεις</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">Ξεκινήστε</Button>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">5 επαγγελματικά θέματα</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Διγλωσση σελίδα (EL/EN)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Φόρμα RSVP</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Εξαγωγή CSV/Excel</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Email επιβεβαιώσεις</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Add-to-Calendar (.ics)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Anti-spam προστασία</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">GDPR εργαλεία</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plus Plan */}
            <Card className="relative border-primary shadow-lg">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Δημοφιλές</Badge>
              <CardHeader>
                <CardTitle className="text-2xl">Plus</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€69</span>
                  <span className="text-muted-foreground ml-2">εφάπαξ</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Για ζευγάρια που θέλουν περισσότερα</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">Ξεκινήστε</Button>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Όλα από Basic</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Προστασία με κωδικό</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Γκαλερί φωτογραφιών</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Gift Registry με IBAN & QR</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Live Photo Wall</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Zapier/Make webhooks</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€119</span>
                  <span className="text-muted-foreground ml-2">εφάπαξ</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Πλήρης έλεγχος & δυνατότητες</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">Ξεκινήστε</Button>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Όλα από Plus</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Custom subdomain</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Email υπενθυμίσεις</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Seating planner</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Custom fonts upload</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">A/B testing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">SMS/WhatsApp reminders*</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Metrics & Analytics</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
