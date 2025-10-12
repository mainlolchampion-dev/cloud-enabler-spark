import { useEffect, useState } from "react";
import { BaseInvitation } from "@/lib/invitationStorage";
import { getEvents } from "@/lib/eventsStorage";
import { getGiftItems } from "@/lib/giftRegistryStorage";
import { PasswordProtection } from "@/components/wedding/PasswordProtection";
import { ThemeProvider } from "@/components/wedding/ThemeProvider";
import { MusicPlayer } from "@/components/wedding/MusicPlayer";
import { FallingParticles } from "@/components/wedding/animations/FallingParticles";
import { AnimatedSection } from "@/components/wedding/animations/AnimatedSection";
import { TemplateRouter } from "@/components/wedding/templates/TemplateRouter";
import weddingHeroSample from "@/assets/wedding-hero-sample.jpg";

interface WeddingInvitationProps {
  invitation: BaseInvitation;
}

export default function WeddingInvitation({ invitation }: WeddingInvitationProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [giftItems, setGiftItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [eventsData, giftsData] = await Promise.all([
        getEvents(invitation.id),
        getGiftItems(invitation.id)
      ]);
      setEvents(eventsData);
      setGiftItems(giftsData.filter(item => !item.purchased));
      
      document.title = invitation.title;
    };
    
    fetchData();
  }, [invitation.id, invitation.title]);

  const data = invitation.data;
  
  const openDirections = (position: [number, number]) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`, '_blank');
  };

  const invitationContent = (
    <>
      {/* Falling Particles Animation */}
      <FallingParticles
        type="flowers"
        density="medium"
        color="#f4a7b9"
        enabled={true}
      />
      
      {/* Music Player */}
      {data.backgroundMusicUrl && (
        <MusicPlayer
          audioUrl={data.backgroundMusicUrl}
          autoPlay={false}
          theme={invitation.theme}
        />
      )}
      
      <TemplateRouter
        invitation={invitation}
        events={events}
        giftItems={giftItems}
        onOpenDirections={openDirections}
      />
    </>
  );

  return (
    <ThemeProvider themeId={invitation.theme || 'romantic'}>
      <div className="min-h-screen bg-gradient-to-b from-background via-secondary-light to-background">
        {invitation.password ? (
          <PasswordProtection correctPassword={invitation.password}>
            {invitationContent}
          </PasswordProtection>
        ) : (
          invitationContent
        )}
      </div>
    </ThemeProvider>
  );
}
