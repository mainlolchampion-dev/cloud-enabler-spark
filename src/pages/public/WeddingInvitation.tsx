import { useEffect, useState } from "react";
import { BaseInvitation } from "@/lib/invitationStorage";
import { getEvents } from "@/lib/eventsStorage";
import { getGiftItems } from "@/lib/giftRegistryStorage";
import { PasswordProtection } from "@/components/wedding/PasswordProtection";
import { ThemeProvider } from "@/components/wedding/ThemeProvider";
import { MusicPlayer } from "@/components/wedding/MusicPlayer";
import { FallingParticles } from "@/components/wedding/animations/FallingParticles";
import { TemplateRouter } from "@/components/wedding/templates/TemplateRouter";
import { getThemeById } from "@/config/invitationThemes";

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
  const theme = getThemeById(invitation.theme || 'romantic');
  
  const openDirections = (position: [number, number]) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`, '_blank');
  };

  const invitationContent = (
    <>
      {/* Falling Particles Animation - Use theme-specific settings */}
      {theme?.animations?.enabled && (
        <FallingParticles
          type={theme.animations.particleType}
          density={theme.animations.particleDensity}
          color={theme.animations.particleColor}
          enabled={true}
        />
      )}
      
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
      <div 
        className="min-h-screen"
        style={{ 
          background: theme?.gradients.section || 'linear-gradient(180deg, hsl(var(--background)), hsl(var(--muted)))' 
        }}
      >
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
