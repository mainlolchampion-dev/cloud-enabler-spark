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

interface PartyInvitation {
  id: string;
  title: string;
  partyDate: string;
  createdAt: string;
}

export default function AllParties() {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<PartyInvitation[]>([]);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = () => {
    const saved = localStorage.getItem("party_invitations");
    if (saved) {
      setInvitations(JSON.parse(saved));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την πρόσκληση;")) {
      const updated = invitations.filter((inv) => inv.id !== id);
      localStorage.setItem("party_invitations", JSON.stringify(updated));
      setInvitations(updated);
      toast.success("Η πρόσκληση διαγράφηκε επιτυχώς");
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/party/edit/${id}`);
  };

  const handleView = (id: string) => {
    toast.info("Προβολή πρόσκλησης: " + id);
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
            <CardTitle className="text-2xl">Party</CardTitle>
            <Button onClick={() => navigate("/party/add")}>
              Προσθήκη Πρόσκλησης
            </Button>
          </CardHeader>
          <CardContent>
            {invitations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Δεν υπάρχουν προσκλήσεις. Δημιουργήστε την πρώτη σας πρόσκληση!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Τίτλος</TableHead>
                    <TableHead>Ημερομηνία Party</TableHead>
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
                              onClick={() => handleView(invitation.id)}
                            >
                              Προβολή
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(invitation.partyDate)}</TableCell>
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
