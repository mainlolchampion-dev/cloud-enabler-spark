import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { el } from "date-fns/locale";

interface Subscription {
  id: string;
  user_email: string;
  plan_type: string;
  status: string;
  created_at: string;
  expires_at: string | null;
  stripe_customer_id: string | null;
}

export function SubscriptionsManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);

      const { data: subs, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          user_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!subs || subs.length === 0) {
        setSubscriptions([]);
        return;
      }

      // For now, show subscriptions without emails (admin access needed for emails)
      const subscriptionsData: Subscription[] = subs.map((sub: any) => ({
        id: sub.id,
        user_email: sub.user_id.substring(0, 8) + '...', // Show partial user ID
        plan_type: sub.plan_type,
        status: sub.status,
        created_at: sub.created_at,
        expires_at: sub.expires_at,
        stripe_customer_id: sub.stripe_customer_id,
      }));

      setSubscriptions(subscriptionsData);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      toast.error('Σφάλμα φόρτωσης συνδρομών');
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'plus':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'past_due':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Διαχείριση Συνδρομών</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Πλάνο</TableHead>
                <TableHead>Κατάσταση</TableHead>
                <TableHead>Ημερομηνία Έναρξης</TableHead>
                <TableHead>Λήξη</TableHead>
                <TableHead>Stripe ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.user_email}</TableCell>
                  <TableCell>
                    <Badge className={getPlanColor(sub.plan_type)}>
                      {sub.plan_type === 'basic' ? 'Basic' : 
                       sub.plan_type === 'plus' ? 'Plus' : 'Premium'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(sub.status)}>
                      {sub.status === 'active' ? 'Ενεργή' : 
                       sub.status === 'canceled' ? 'Ακυρώθηκε' : sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(sub.created_at), "d MMM yyyy", { locale: el })}
                  </TableCell>
                  <TableCell>
                    {sub.expires_at 
                      ? format(new Date(sub.expires_at), "d MMM yyyy", { locale: el })
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {sub.stripe_customer_id || 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
