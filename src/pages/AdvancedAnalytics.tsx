import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradePrompt } from "@/components/subscription/UpgradePrompt";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Mail, 
  Eye,
  ArrowLeft,
  Download 
} from "lucide-react";
import { toast } from "sonner";
import { getInvitation, BaseInvitation } from "@/lib/invitationStorage";
import { getRSVPsForInvitation, RSVPResponse } from "@/lib/rsvpStorage";
import { format, parseISO, differenceInDays } from "date-fns";
import { el } from "date-fns/locale";

const COLORS = {
  attending: "#10b981",
  notAttending: "#ef4444",
  maybe: "#f59e0b",
  primary: "#8b5cf6",
  secondary: "#3b82f6",
};

export default function AdvancedAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasFeature } = useSubscription();
  const [invitation, setInvitation] = useState<BaseInvitation | null>(null);
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [invitationData, rsvpData] = await Promise.all([
        getInvitation(id),
        getRSVPsForInvitation(id),
      ]);

      setInvitation(invitationData);
      setRsvps(rsvpData);
    } catch (error) {
      console.error("Error loading analytics data:", error);
      toast.error("Σφάλμα κατά τη φόρτωση των δεδομένων");
    } finally {
      setLoading(false);
    }
  };

  // Check if user has premium feature
  if (!hasFeature("advancedAnalytics")) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Επιστροφή
          </Button>
          <UpgradePrompt
            feature="Advanced Analytics"
            requiredPlan="premium"
            description="Αποκτήστε λεπτομερή στατιστικά και insights για τις προσκλήσεις σας με το Premium πλάνο."
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Φόρτωση αναλυτικών...</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Η πρόσκληση δεν βρέθηκε</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Analytics Calculations
  const totalRsvps = rsvps.length;
  const attending = rsvps.filter(r => r.willAttend === "yes").length;
  const notAttending = rsvps.filter(r => r.willAttend === "no").length;
  const maybe = rsvps.filter(r => r.willAttend === "maybe").length;
  const responseRate = totalRsvps > 0 ? ((attending + notAttending) / totalRsvps * 100).toFixed(1) : 0;

  // Pie Chart Data
  const pieData = [
    { name: "Έρχονται", value: attending, color: COLORS.attending },
    { name: "Δεν έρχονται", value: notAttending, color: COLORS.notAttending },
    { name: "Ίσως", value: maybe, color: COLORS.maybe },
  ].filter(d => d.value > 0);

  // Timeline Data - RSVPs over time
  const timelineData = rsvps
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .reduce((acc, rsvp) => {
      const date = format(parseISO(rsvp.createdAt), "dd/MM", { locale: el });
      const existing = acc.find(d => d.date === date);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }
      return acc;
    }, [] as { date: string; count: number }[]);

  // Cumulative timeline
  let cumulative = 0;
  const cumulativeTimeline = timelineData.map(d => {
    cumulative += d.count;
    return { date: d.date, cumulative };
  });

  // Guest count breakdown
  const guestBreakdown = rsvps
    .filter(r => r.willAttend === "yes")
    .reduce((acc, r) => {
      const count = r.numberOfGuests || 1;
      const key = count === 1 ? "1 άτομο" : `${count} άτομα`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const guestData = Object.entries(guestBreakdown).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/rsvp/${id}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Πίσω
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{invitation.title}</h1>
              <p className="text-muted-foreground">Advanced Analytics</p>
            </div>
          </div>
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            Premium Feature
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Συνολικές Απαντήσεις
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalRsvps}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Ποσοστό Απάντησης
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{responseRate}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                Επιβεβαιωμένοι
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{attending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Μέσος Χρόνος Απάντησης
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rsvps.length > 0
                  ? `${Math.round(
                      rsvps.reduce((sum, r) => {
                        const days = differenceInDays(
                          new Date(),
                          parseISO(r.createdAt)
                        );
                        return sum + days;
                      }, 0) / rsvps.length
                    )} μέρες`
                  : "-"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Επισκόπηση</TabsTrigger>
            <TabsTrigger value="timeline">Χρονολόγιο</TabsTrigger>
            <TabsTrigger value="guests">Ανάλυση Καλεσμένων</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Attendance Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Κατανομή Απαντήσεων</CardTitle>
                  <CardDescription>Ποσοστά επιβεβαίωσης παρουσίας</CardDescription>
                </CardHeader>
                <CardContent>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Δεν υπάρχουν δεδομένα
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Guest Count Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Κατανομή Αριθμού Ατόμων</CardTitle>
                  <CardDescription>Πόσα άτομα φέρνει κάθε καλεσμένος</CardDescription>
                </CardHeader>
                <CardContent>
                  {guestData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={guestData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={COLORS.primary} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Δεν υπάρχουν δεδομένα
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Χρονολόγιο Απαντήσεων</CardTitle>
                <CardDescription>Συσσωρευτικές απαντήσεις ανά ημέρα</CardDescription>
              </CardHeader>
              <CardContent>
                {cumulativeTimeline.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={cumulativeTimeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="cumulative"
                        stroke={COLORS.secondary}
                        strokeWidth={2}
                        name="Συνολικές Απαντήσεις"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    Δεν υπάρχουν δεδομένα
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Λεπτομερής Ανάλυση Καλεσμένων</CardTitle>
                <CardDescription>Πρόσθετα στατιστικά για τους καλεσμένους</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      Συνολικά Άτομα
                    </div>
                    <div className="text-2xl font-bold">
                      {rsvps
                        .filter(r => r.willAttend === "yes")
                        .reduce((sum, r) => sum + (r.numberOfGuests || 1), 0)}
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      Με Διατροφικούς Περιορισμούς
                    </div>
                    <div className="text-2xl font-bold">
                      {rsvps.filter(r => r.dietaryRestrictions).length}
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      Με Μήνυμα
                    </div>
                    <div className="text-2xl font-bold">
                      {rsvps.filter(r => r.message).length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}