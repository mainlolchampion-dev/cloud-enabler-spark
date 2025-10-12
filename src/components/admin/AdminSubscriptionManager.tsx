import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

type PlanType = 'basic' | 'plus' | 'premium';
type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'expired' | 'trialing';

interface Subscription {
  id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  expires_at: string | null;
}

export function AdminSubscriptionManager() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('basic');

  useEffect(() => {
    loadSubscription();
  }, [user]);

  const loadSubscription = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading subscription:', error);
        return;
      }

      if (data) {
        setSubscription(data);
        setSelectedPlan(data.plan_type);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async () => {
    if (!user) return;

    try {
      setUpdating(true);

      if (subscription) {
        // Update existing subscription
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            plan_type: selectedPlan,
            status: 'active',
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id);

        if (error) throw error;
      } else {
        // Create new subscription
        const { error } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_type: selectedPlan,
            status: 'active',
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          });

        if (error) throw error;
      }

      toast.success('Η συνδρομή ενημερώθηκε επιτυχώς!');
      await loadSubscription();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Σφάλμα κατά την ενημέρωση της συνδρομής');
    } finally {
      setUpdating(false);
    }
  };

  const removeSubscription = async () => {
    if (!user || !subscription) return;

    try {
      setUpdating(true);

      const { error } = await supabase
        .from('user_subscriptions')
        .delete()
        .eq('id', subscription.id);

      if (error) throw error;

      toast.success('Η συνδρομή διαγράφηκε επιτυχώς!');
      setSubscription(null);
      setSelectedPlan('basic');
    } catch (error) {
      console.error('Error removing subscription:', error);
      toast.error('Σφάλμα κατά τη διαγραφή της συνδρομής');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Διαχείριση Συνδρομής Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Διαχείριση Συνδρομής Admin</CardTitle>
        <p className="text-sm text-muted-foreground">
          Αλλάξτε το πλάνο σας χωρίς Stripe (μόνο για admin)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Subscription Status */}
        {subscription && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Τρέχον Πλάνο:</span>
              <Badge variant="default">
                {subscription.plan_type === 'basic' ? 'Basic' :
                 subscription.plan_type === 'plus' ? 'Plus' : 'Premium'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Κατάσταση:</span>
              <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                {subscription.status === 'active' ? 'Ενεργή' : subscription.status}
              </Badge>
            </div>
            {subscription.expires_at && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Λήξη:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(subscription.expires_at).toLocaleDateString('el-GR')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Plan Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Επιλογή Πλάνου</label>
          <Select value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as PlanType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic - €9/μήνα</SelectItem>
              <SelectItem value="plus">Plus - €19/μήνα</SelectItem>
              <SelectItem value="premium">Premium - €39/μήνα</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={updateSubscription} 
            disabled={updating}
            className="flex-1"
          >
            {updating ? 'Ενημέρωση...' : subscription ? 'Ενημέρωση Πλάνου' : 'Δημιουργία Συνδρομής'}
          </Button>
          
          {subscription && (
            <Button 
              onClick={removeSubscription} 
              disabled={updating}
              variant="destructive"
            >
              Διαγραφή
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          * Αυτή η λειτουργία είναι διαθέσιμη μόνο για admin accounts και δεν επηρεάζει το Stripe
        </p>
      </CardContent>
    </Card>
  );
}
