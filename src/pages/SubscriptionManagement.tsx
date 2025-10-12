import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Crown, Calendar, Users, FileText, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useSubscription } from "@/hooks/useSubscription";
import { format } from "date-fns";
import { el } from "date-fns/locale";

interface Subscription {
  plan_type: string;
  status: string;
  expires_at: string | null;
  stripe_customer_id: string | null;
}

export default function SubscriptionManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { limits } = useSubscription();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [stats, setStats] = useState({
    invitationsUsed: 0,
    guestsUsed: 0,
    rsvpsReceived: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user?.id)
        .eq("status", "active")
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Subscription fetch error:", error);
      }
      
      setSubscription(data);

      // Fetch usage stats
      if (user?.id) {
        // Get all user's invitations first
        const { data: userInvitations } = await supabase
          .from("invitations")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "published");

        const invitationIds = userInvitations?.map(inv => inv.id) || [];

        const [invitations, guests, rsvps] = await Promise.all([
          supabase
            .from("invitations")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "published"),
          invitationIds.length > 0
            ? supabase
                .from("guests")
                .select("id", { count: "exact", head: true })
                .in("invitation_id", invitationIds)
            : { count: 0 },
          invitationIds.length > 0
            ? supabase
                .from("rsvps")
                .select("id", { count: "exact", head: true })
                .in("invitation_id", invitationIds)
            : { count: 0 },
        ]);

        setStats({
          invitationsUsed: invitations.count || 0,
          guestsUsed: guests.count || 0,
          rsvpsReceived: rsvps.count || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η φόρτωση της συνδρομής σας",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-portal-session", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating portal session:", error);
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η πρόσβαση στη διαχείριση συνδρομής",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "premium":
        return "default";
      case "pro":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "trialing":
        return "secondary";
      case "canceled":
      case "past_due":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Φόρτωση...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Διαχείριση Συνδρομής</h1>
          <p className="text-muted-foreground">
            Διαχειριστείτε το πλάνο και τις πληρωμές σας
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            {subscription ? (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Crown className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold capitalize">
                        Πλάνο {subscription.plan_type}
                      </h2>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={getPlanBadgeVariant(subscription.plan_type)}>
                          {subscription.plan_type}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(subscription.status)}>
                          {subscription.status === "active" && "Ενεργό"}
                          {subscription.status === "trialing" && "Δοκιμαστική Περίοδος"}
                          {subscription.status === "canceled" && "Ακυρωμένο"}
                          {subscription.status === "past_due" && "Εκκρεμής Πληρωμή"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {subscription.expires_at && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Ανανέωση στις{" "}
                      {format(new Date(subscription.expires_at), "d MMMM yyyy", { locale: el })}
                    </span>
                  </div>
                )}

                <div className="grid gap-3">
                  {subscription.plan_type === "basic" && (
                    <Button onClick={() => navigate("/pricing")} className="w-full">
                      <Crown className="h-4 w-4 mr-2" />
                      Αναβάθμιση Πλάνου
                    </Button>
                  )}

                  {subscription.plan_type !== "basic" && subscription.stripe_customer_id && (
                    <Button
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                      className="w-full"
                      variant="outline"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {portalLoading ? "Φόρτωση..." : "Διαχείριση Πληρωμών"}
                    </Button>
                  )}

                  <Button variant="outline" onClick={() => navigate("/dashboard")} className="w-full">
                    Επιστροφή στο Dashboard
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <Crown className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        Δεν έχετε ενεργό πλάνο
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Επιλέξτε ένα πλάνο για να ξεκινήσετε
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Button onClick={() => navigate("/pricing")} className="w-full">
                    <Crown className="h-4 w-4 mr-2" />
                    Προβολή Πλάνων
                  </Button>

                  <Button variant="outline" onClick={() => navigate("/dashboard")} className="w-full">
                    Επιστροφή στο Dashboard
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* Usage Statistics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Χρήση Πόρων
            </h3>
            <div className="space-y-6">
              {/* Invitations */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Προσκλήσεις</span>
                  <span className="font-medium">
                    {stats.invitationsUsed} / {limits.maxInvitations === Infinity ? "∞" : limits.maxInvitations}
                  </span>
                </div>
                <Progress 
                  value={limits.maxInvitations === Infinity ? 0 : (stats.invitationsUsed / limits.maxInvitations) * 100} 
                  className="h-2"
                />
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Καλεσμένοι</span>
                  <span className="font-medium">
                    {stats.guestsUsed} / {limits.maxGuests === Infinity ? "∞" : limits.maxGuests}
                  </span>
                </div>
                <Progress 
                  value={limits.maxGuests === Infinity ? 0 : (stats.guestsUsed / limits.maxGuests) * 100} 
                  className="h-2"
                />
              </div>

              {/* RSVPs - Info only */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Απαντήσεις RSVP
                  </span>
                  <span className="font-medium">{stats.rsvpsReceived}</span>
                </div>
              </div>
            </div>
          </Card>

          {subscription && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Το Πλάνο σας περιλαμβάνει:</h3>
              <ul className="space-y-2 text-sm">
                {subscription.plan_type === "basic" && (
                  <>
                    <li>✓ 5 επαγγελματικά θέματα</li>
                    <li>✓ Φόρμα RSVP</li>
                    <li>✓ Email επιβεβαίωσεις</li>
                    <li>✓ Γκαλερί φωτογραφιών</li>
                  </>
                )}
                {subscription.plan_type === "plus" && (
                  <>
                    <li>✓ Όλα από Basic +</li>
                    <li>✓ 10+ premium θέματα</li>
                    <li>✓ Απεριόριστοι καλεσμένοι</li>
                    <li>✓ SMS ειδοποιήσεις</li>
                    <li>✓ Προτεραιότητα υποστήριξης</li>
                  </>
                )}
                {subscription.plan_type === "premium" && (
                  <>
                    <li>✓ Απεριόριστα προσκλητήρια</li>
                    <li>✓ Όλα τα premium templates</li>
                    <li>✓ Απεριόριστοι καλεσμένοι</li>
                    <li>✓ SMS & Email ειδοποιήσεις</li>
                    <li>✓ White-label branding</li>
                    <li>✓ Custom domain</li>
                    <li>✓ 24/7 υποστήριξη</li>
                  </>
                )}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
