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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20">
        <div className="animate-pulse text-xl">Φόρτωση...</div>
      </div>
    );
  }

  // Not found
  if (!invitation) {
    return <NotFound />;
  }

  // Render appropriate invitation type
  if (invitation.type === 'wedding') {
    return <WeddingInvitation />;
  }
  
  if (invitation.type === 'baptism') {
    return <BaptismInvitation />;
  }
  
  if (invitation.type === 'party') {
    return <PartyInvitation />;
  }

  return <NotFound />;
}
