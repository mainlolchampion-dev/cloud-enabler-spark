import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { 
  getRSVPsForInvitation, 
  getRSVPStats, 
  deleteRSVP, 
  exportRSVPsToCSV,
  RSVPResponse,
  RSVPStats 
} from "@/lib/rsvpStorage";
import { getInvitation, BaseInvitation } from "@/lib/invitationStorage";
import { Download, Trash2, Users, CheckCircle, XCircle, HelpCircle, Mail, Phone } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function RSVPManagement() {
  const { id } = useParams();
  const [invitation, setInvitation] = useState<BaseInvitation | null>(null);
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [stats, setStats] = useState<RSVPStats>({
    total: 0,
    attending: 0,
    notAttending: 0,
    maybe: 0,
    totalGuests: 0,
  });
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
      const [invitationData, rsvpData, statsData] = await Promise.all([
        getInvitation(id),
        getRSVPsForInvitation(id),
        getRSVPStats(id),
      ]);

      setInvitation(invitationData);
      setRsvps(rsvpData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading RSVP data:', error);
      toast.error("Σφάλμα κατά τη φόρτωση των δεδομένων");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (rsvpId: string) => {
    try {
      await deleteRSVP(rsvpId);
      toast.success("Η απάντηση διαγράφηκε επιτυχώς");
      loadData();
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      toast.error("Σφάλμα κατά τη διαγραφή");
    }
  };

  const handleExport = () => {
    const csv = exportRSVPsToCSV(rsvps);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rsvps-${invitation?.title}-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Το αρχείο CSV έχει κατέβει");
  };

  const getAttendanceIcon = (willAttend: string) => {
    switch (willAttend) {
      case 'yes':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'no':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'maybe':
        return <HelpCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getAttendanceBadge = (willAttend: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", text: string }> = {
      yes: { variant: "default", text: "Έρχεται" },
      no: { variant: "destructive", text: "Δεν έρχεται" },
      maybe: { variant: "secondary", text: "Ίσως" },
    };
    const config = variants[willAttend] || variants.maybe;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Φόρτωση...</p>
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
            <CardDescription>
              Η πρόσκληση δεν υπάρχει ή δεν έχετε πρόσβαση σε αυτήν
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{invitation.title}</h1>
            <p className="text-muted-foreground">Διαχείριση Απαντήσεων RSVP</p>
          </div>
          <Button onClick={handleExport} disabled={rsvps.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Εξαγωγή CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Σύνολο Απαντήσεων
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Έρχονται
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.attending}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalGuests} άτομα συνολικά
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                Δεν έρχονται
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.notAttending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-yellow-600" />
                Ίσως
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.maybe}</div>
            </CardContent>
          </Card>
        </div>

        {/* RSVPs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Λίστα Απαντήσεων</CardTitle>
            <CardDescription>
              {rsvps.length === 0 
                ? "Δεν υπάρχουν απαντήσεις ακόμα" 
                : `${rsvps.length} απαντήσεις συνολικά`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rsvps.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Δεν υπάρχουν απαντήσεις ακόμα.</p>
                <p className="text-sm">Μόλις οι καλεσμένοι απαντήσουν, θα εμφανιστούν εδώ.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Όνομα</TableHead>
                      <TableHead>Επικοινωνία</TableHead>
                      <TableHead>Απάντηση</TableHead>
                      <TableHead>Άτομα</TableHead>
                      <TableHead>Διατροφικά</TableHead>
                      <TableHead>Μήνυμα</TableHead>
                      <TableHead>Ημερομηνία</TableHead>
                      <TableHead className="text-right">Ενέργειες</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rsvps.map((rsvp) => (
                      <TableRow key={rsvp.id}>
                        <TableCell className="font-medium">{rsvp.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <a href={`mailto:${rsvp.email}`} className="hover:underline">
                                {rsvp.email}
                              </a>
                            </div>
                            {rsvp.phone && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                <a href={`tel:${rsvp.phone}`} className="hover:underline">
                                  {rsvp.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getAttendanceIcon(rsvp.willAttend)}
                            {getAttendanceBadge(rsvp.willAttend)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {rsvp.willAttend === 'yes' && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{rsvp.numberOfGuests}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <span className="text-sm text-muted-foreground line-clamp-2">
                            {rsvp.dietaryRestrictions || '-'}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <span className="text-sm text-muted-foreground line-clamp-2">
                            {rsvp.message || '-'}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(rsvp.createdAt).toLocaleDateString('el-GR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Διαγραφή απάντησης</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Είστε σίγουροι ότι θέλετε να διαγράψετε την απάντηση του/της {rsvp.name};
                                  Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(rsvp.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Διαγραφή
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
