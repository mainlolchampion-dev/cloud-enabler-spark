import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getInvitationsIndex, deleteInvitation, BaseInvitation } from "@/lib/invitationStorage";
import { Heart, Calendar, Eye, Trash2, Edit, Users, Gift, MapPin, List, Plus, Lock } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function AllWeddings() {
  const navigate = useNavigate();
  const { hasFeature } = useSubscription();
  const [invitations, setInvitations] = useState<BaseInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const allInvitations = await getInvitationsIndex();
      const weddings = allInvitations.filter(inv => inv.type === 'wedding');
      setInvitations(weddings);
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
    navigate(`/wedding/edit/${id}`);
  };

  const handleView = (id: string) => {
    window.open(`/prosklisi/${id}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Γάμοι</h1>
              <p className="text-muted-foreground text-lg">Διαχειριστείτε τις προσκλήσεις γάμου σας</p>
            </div>
            <Button 
              onClick={() => navigate("/wedding/add")}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Νέα Πρόσκληση
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Φόρτωση...</p>
          </div>
        ) : invitations.length === 0 ? (
          <Card className="p-20 text-center">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground/40 mb-6" />
            <h2 className="font-serif text-2xl font-semibold mb-3">Δεν υπάρχουν προσκλήσεις ακόμα</h2>
            <p className="text-muted-foreground mb-6">Δημιουργήστε την πρώτη σας πρόσκληση γάμου</p>
            <Button 
              onClick={() => navigate("/wedding/add")}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Δημιουργία Πρόσκλησης
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((invitation) => (
              <Card key={invitation.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {/* Card Header with gradient */}
                <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart className="w-16 h-16 text-primary/30 group-hover:scale-110 transition-transform" fill="currentColor" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant={invitation.status === 'published' ? 'default' : 'secondary'}>
                      {invitation.status === 'published' ? 'Δημοσιευμένη' : 'Προσχέδιο'}
                    </Badge>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-2">{invitation.title}</h3>
                    {invitation.data?.weddingDate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {format(new Date(invitation.data.weddingDate), "d MMMM yyyy", { locale: el })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{invitation.data?._rsvpCount || 0}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(invitation.id)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Επεξεργασία
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(invitation.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(invitation.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick Links */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs justify-start"
                      onClick={() => navigate(`/rsvp/${invitation.id}`)}
                    >
                      <List className="w-3 h-3 mr-1" />
                      RSVP
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs justify-start"
                      onClick={() => navigate(`/guests/${invitation.id}`)}
                    >
                      <Users className="w-3 h-3 mr-1" />
                      Καλεσμένοι
                    </Button>
                    
                    {hasFeature('seatingChart') ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs justify-start"
                        onClick={() => navigate(`/seating/${invitation.id}`)}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        Τραπέζια
                      </Button>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs justify-start opacity-50 cursor-not-allowed"
                              disabled
                            >
                              <Lock className="w-3 h-3 mr-1" />
                              Τραπέζια
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Διαθέσιμο μόνο σε Premium</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    
                    {hasFeature('giftRegistry') ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs justify-start"
                        onClick={() => navigate(`/gifts/${invitation.id}`)}
                      >
                        <Gift className="w-3 h-3 mr-1" />
                        Δώρα
                      </Button>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs justify-start opacity-50 cursor-not-allowed"
                              disabled
                            >
                              <Lock className="w-3 h-3 mr-1" />
                              Δώρα
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Διαθέσιμο σε Plus & Premium</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
