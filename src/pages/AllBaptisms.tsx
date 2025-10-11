import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInvitationsIndex, deleteInvitation, BaseInvitation } from "@/lib/invitationStorage";

export default function AllBaptisms() {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<BaseInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const allInvitations = await getInvitationsIndex();
      const baptisms = allInvitations.filter(inv => inv.type === 'baptism');
      setInvitations(baptisms);
    } catch (error) {
      console.error('Error loading invitations:', error);
      toast.error("Σφάλμα κατά τη φόρτωση των προσκλήσεων");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την πρόσκληση;")) {
      try {
        await deleteInvitation(id);
        setInvitations(invitations.filter((inv) => inv.id !== id));
        toast.success("Η πρόσκληση διαγράφηκε επιτυχώς");
      } catch (error) {
        console.error('Error deleting invitation:', error);
        toast.error("Σφάλμα κατά τη διαγραφή της πρόσκλησης");
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/baptism/edit/${id}`);
  };

  const handleView = (id: string) => {
    window.open(`/prosklisi/${id}`, '_blank');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return dateStr.replace(/-/g, "");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-2xl">Βάπτιση</CardTitle>
            <Button onClick={() => navigate("/baptism/add")}>
              Προσθήκη Πρόσκλησης
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Φόρτωση...
              </div>
            ) : invitations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Δεν υπάρχουν προσκλήσεις. Δημιουργήστε την πρώτη σας πρόσκληση!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Τίτλος</TableHead>
                    <TableHead>Ημερομηνία Βάπτισης</TableHead>
                    <TableHead>Κατάσταση</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-primary">
                            {invitation.title}
                          </div>
                          <div className="text-sm space-x-2">
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={() => handleEdit(invitation.id)}
                            >
                              Επεξεργασία
                            </Button>
                            <span className="text-muted-foreground">|</span>
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs text-destructive"
                              onClick={() => handleDelete(invitation.id)}
                            >
                              Διαγραφή
                            </Button>
                            <span className="text-muted-foreground">|</span>
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={() => navigate(`/rsvp/${invitation.id}`)}
                            >
                              RSVP ({invitation.data?._rsvpCount || 0})
                            </Button>
                            <span className="text-muted-foreground">|</span>
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={() => navigate(`/guests/${invitation.id}`)}
                            >
                              Καλεσμένοι
                            </Button>
                            <span className="text-muted-foreground">|</span>
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={() => handleView(invitation.id)}
                            >
                              Προβολή
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{invitation.data?.baptismDate ? formatDate(invitation.data.baptismDate) : '-'}</TableCell>
                      <TableCell>
                        <span className={invitation.status === 'published' ? 'text-green-600' : 'text-yellow-600'}>
                          {invitation.status === 'published' ? 'Δημοσιευμένη' : 'Προσχέδιο'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
