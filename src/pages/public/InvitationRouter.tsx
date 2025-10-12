import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInvitation, BaseInvitation } from "@/lib/invitationStorage";
import WeddingInvitation from "./WeddingInvitation";
import BaptismInvitation from "./BaptismInvitation";
import PartyInvitation from "./PartyInvitation";
import NotFound from "../NotFound";

export default function InvitationRouter() {
  const { id } = useParams<{ id: string }>();
  const [invitation, setInvitation] = useState<BaseInvitation | null | undefined>(undefined);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (id) {
        const data = await getInvitation(id);
        setInvitation(data);
      }
    };
    
    fetchInvitation();
  }, [id]);

  // Loading state
  if (invitation === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 via-pink-50 to-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium text-muted-foreground">Φόρτωση πρόσκλησης...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 via-pink-50 to-white p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-8xl">💌</div>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">Η πρόσκληση δεν βρέθηκε</h1>
          <p className="text-muted-foreground text-lg">
            Αυτή η πρόσκληση δεν υπάρχει ή έχει διαγραφεί. Παρακαλούμε ελέγξτε το link που σας έχει σταλεί.
          </p>
        </div>
      </div>
    );
  }

  // Render appropriate invitation type
  if (invitation.type === 'wedding') {
    return <WeddingInvitation invitation={invitation} />;
  }
  
  if (invitation.type === 'baptism') {
    return <BaptismInvitation invitation={invitation} />;
  }
  
  if (invitation.type === 'party') {
    return <PartyInvitation invitation={invitation} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 via-pink-50 to-white p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl">⚠️</div>
        <h1 className="font-serif text-4xl md:text-5xl text-foreground">Μη έγκυρος τύπος</h1>
        <p className="text-muted-foreground text-lg">
          Αυτός ο τύπος πρόσκλησης δεν υποστηρίζεται.
        </p>
      </div>
    </div>
  );
}
