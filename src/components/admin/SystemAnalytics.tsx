import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981'];

export function SystemAnalytics() {
  const [loading, setLoading] = useState(true);
  const [planDistribution, setPlanDistribution] = useState<any[]>([]);
  const [invitationsByType, setInvitationsByType] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Get plan distribution
      const { data: subscriptions } = await supabase
        .from('user_subscriptions')
        .select('plan_type');

      const planCounts = {
        basic: 0,
        plus: 0,
        premium: 0,
      };

      subscriptions?.forEach(sub => {
        planCounts[sub.plan_type as keyof typeof planCounts]++;
      });

      setPlanDistribution([
        { name: 'Basic', value: planCounts.basic },
        { name: 'Plus', value: planCounts.plus },
        { name: 'Premium', value: planCounts.premium },
      ]);

      // Get invitations by type
      const { data: invitations } = await supabase
        .from('invitations')
        .select('type');

      const typeCounts = {
        wedding: 0,
        baptism: 0,
        party: 0,
      };

      invitations?.forEach(inv => {
        typeCounts[inv.type as keyof typeof typeCounts]++;
      });

      setInvitationsByType([
        { name: 'Γάμοι', count: typeCounts.wedding },
        { name: 'Βαπτίσεις', count: typeCounts.baptism },
        { name: 'Πάρτι', count: typeCounts.party },
      ]);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Σφάλμα φόρτωσης analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Κατανομή Πλάνων</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={planDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Προσκλήσεις ανά Τύπο</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={invitationsByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
