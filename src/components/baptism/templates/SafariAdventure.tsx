import { BaseInvitation } from "@/lib/invitationStorage";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { MapPin, Clock } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { AddToCalendar } from "@/components/wedding/AddToCalendar";
import { MapDisplay } from "@/components/wedding/MapDisplay";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { LivePhotoWall } from "@/components/wedding/LivePhotoWall";
import { AnimatedSection } from "@/components/wedding/animations/AnimatedSection";
import { SafariAnimals } from "@/components/wedding/decorative/SafariAnimals";

interface TemplateProps {
  invitation: BaseInvitation;
  events: any[];
  giftItems: any[];
  onOpenDirections: (position: [number, number]) => void;
}

export function SafariAdventure({ invitation, events }: TemplateProps) {
  const data = invitation.data;
  const baptismDate = new Date(data.date);

  return (
    <div className="min-h-screen bg-background">
      <AnimatedSection animation="fadeInUp" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: data.heroImageUrl ? `url(${data.heroImageUrl})` : 'none', backgroundColor: 'hsl(var(--primary))' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        </div>
        
        <div className="absolute top-10 left-10 animate-bounce" style={{ animationDuration: '3s' }}>
          <SafariAnimals animal="giraffe" color="hsl(var(--accent))" size={100} />
        </div>
        
        <div className="relative z-10 text-center px-4 space-y-8 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold text-primary">{invitation.title}</h1>
          {data.childName && <h2 className="text-4xl font-bold text-foreground">{data.childName}</h2>}
          <div className="text-2xl md:text-3xl text-foreground font-semibold">{format(baptismDate, 'dd MMMM yyyy', { locale: el })}</div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fadeInScale" delay={200}>
        <section className="py-16 px-4">
          <CountdownTimer targetDate={baptismDate.toISOString()} />
          <AddToCalendar 
            title={invitation.title} 
            startDate={baptismDate} 
            endDate={new Date(baptismDate.getTime() + 3 * 60 * 60 * 1000)} 
            location={data.ceremonyLocation || ''} 
            description={data.invitationText || ''} 
          />
        </section>
      </AnimatedSection>

      {data.ceremonyCoordinates && (
        <AnimatedSection animation="fadeInUp" delay={300}>
          <section className="py-20 px-4">
            <MapDisplay position={data.ceremonyCoordinates} locationName={data.ceremonyLocation || ''} />
          </section>
        </AnimatedSection>
      )}

      <AnimatedSection animation="fadeInUp" delay={500}>
        <RSVPForm invitationId={invitation.id} invitationType="baptism" invitationTitle={invitation.title} />
      </AnimatedSection>

      <LivePhotoWall invitationId={invitation.id} />
    </div>
  );
}
