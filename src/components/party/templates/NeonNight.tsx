import { BaseInvitation } from "@/lib/invitationStorage";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { Zap } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { AddToCalendar } from "@/components/wedding/AddToCalendar";
import { MapDisplay } from "@/components/wedding/MapDisplay";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { LivePhotoWall } from "@/components/wedding/LivePhotoWall";
import { AnimatedSection } from "@/components/wedding/animations/AnimatedSection";
import { NeonElements } from "@/components/wedding/decorative/NeonElements";

interface TemplateProps {
  invitation: BaseInvitation;
  events: any[];
  giftItems: any[];
  onOpenDirections: (position: [number, number]) => void;
}

export function NeonNight({ invitation }: TemplateProps) {
  const data = invitation.data;
  const partyDate = new Date(data.date);

  return (
    <div className="min-h-screen bg-background">
      <AnimatedSection animation="fadeInUp" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-20 left-10 animate-pulse"><NeonElements element="disco-ball" color="#8B5CF6" size={100} glowIntensity="high" /></div>
        <div className="relative z-10 text-center px-4 space-y-8">
          <h1 className="text-6xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">{invitation.title}</h1>
          <div className="text-2xl md:text-4xl font-bold text-foreground">{format(partyDate, 'dd MMMM yyyy', { locale: el })}</div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fadeInScale" delay={200}>
        <section className="py-16 px-4">
          <CountdownTimer targetDate={partyDate.toISOString()} />
          <AddToCalendar 
            title={invitation.title} 
            startDate={partyDate} 
            endDate={new Date(partyDate.getTime() + 5 * 60 * 60 * 1000)} 
            location={data.ceremonyLocation || ''} 
            description={data.invitationText || ''} 
          />
        </section>
      </AnimatedSection>

      {data.ceremonyCoordinates && (
        <AnimatedSection animation="fadeInUp" delay={300}>
          <MapDisplay position={data.ceremonyCoordinates} locationName={data.ceremonyLocation || ''} />
        </AnimatedSection>
      )}

      <AnimatedSection animation="fadeInUp" delay={500}>
        <RSVPForm invitationId={invitation.id} invitationType="party" invitationTitle={invitation.title} />
      </AnimatedSection>

      <LivePhotoWall invitationId={invitation.id} />
    </div>
  );
}
