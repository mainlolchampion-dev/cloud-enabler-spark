import { BaseInvitation } from "@/lib/invitationStorage";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { MapPin, Calendar, Clock, Heart } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { AddToCalendar } from "@/components/wedding/AddToCalendar";
import { MapDisplay } from "@/components/wedding/MapDisplay";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { GalleryManager } from "@/components/wedding/GalleryManager";
import { SeatingDisplay } from "@/components/wedding/SeatingDisplay";
import { LivePhotoWall } from "@/components/wedding/LivePhotoWall";
import { AnimatedSection } from "@/components/wedding/animations/AnimatedSection";
import { GeometricDivider } from "@/components/wedding/decorative/GeometricDivider";
import { FloralBorder } from "@/components/wedding/decorative/FloralBorder";

interface TemplateProps {
  invitation: BaseInvitation;
  events: any[];
  giftItems: any[];
  onOpenDirections: (position: [number, number]) => void;
}

export function BurgundyGold({ invitation, events, giftItems, onOpenDirections }: TemplateProps) {
  const data = invitation.data;
  const weddingDate = new Date(data.date);

  return (
    <div className="min-h-screen bg-background font-serif">
      {/* Hero Section */}
      <AnimatedSection animation="fadeInUp" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: data.heroImageUrl ? `url(${data.heroImageUrl})` : 'none',
            backgroundColor: 'hsl(var(--primary))'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background/95" />
        </div>
        
        <FloralBorder position="top" color="hsl(var(--accent))" className="z-10" />
        <FloralBorder position="bottom" color="hsl(var(--accent))" className="z-10" />
        
        <div className="relative z-10 text-center px-4 space-y-8">
          {/* Decorative Lines */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-20 bg-accent" />
            <Heart className="text-accent animate-pulse" size={24} />
            <div className="h-px w-20 bg-accent" />
          </div>
          
          <h1 className="font-elegant text-6xl md:text-8xl text-accent drop-shadow-2xl tracking-wider">
            {data.groomName?.split(' ')[0]} & {data.brideName?.split(' ')[0]}
          </h1>
          
          <div className="text-2xl md:text-3xl text-primary-foreground font-light tracking-widest">
            {format(weddingDate, 'dd MMMM yyyy', { locale: el })}
          </div>
          
          {/* Decorative Lines */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-20 bg-accent" />
            <Heart className="text-accent animate-pulse" size={24} />
            <div className="h-px w-20 bg-accent" />
          </div>
        </div>
      </AnimatedSection>

      <GeometricDivider style="elegant" color="hsl(var(--accent))" />

      {/* Invitation Text */}
      {data.invitationText && (
        <AnimatedSection animation="fadeInUp" delay={100}>
          <section className="py-20 px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="prose prose-lg mx-auto text-foreground">
                <div className="italic text-xl leading-relaxed border-l-4 border-accent pl-6">
                  {data.invitationText}
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      <GeometricDivider style="modern" color="hsl(var(--accent))" />

      {/* Couple Section */}
      {(data.groomName || data.brideName) && (
        <AnimatedSection animation="fadeInUp" delay={200}>
          <section className="py-20 px-4 bg-gradient-to-b from-background to-muted">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Groom */}
                {data.groomName && (
                  <div className="text-center space-y-6">
                    {data.groomPhotoUrl && (
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-accent rounded-full blur-2xl opacity-30 animate-pulse" />
                        <img
                          src={data.groomPhotoUrl}
                          alt={data.groomName}
                          className="relative w-48 h-48 rounded-full object-cover mx-auto border-4 border-accent shadow-elegant"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-3xl font-elegant text-primary mb-2">{data.groomName}</h3>
                      {data.groomFamilyName && (
                        <p className="text-muted-foreground italic">{data.groomFamilyName}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Bride */}
                {data.brideName && (
                  <div className="text-center space-y-6">
                    {data.bridePhotoUrl && (
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-accent rounded-full blur-2xl opacity-30 animate-pulse" />
                        <img
                          src={data.bridePhotoUrl}
                          alt={data.brideName}
                          className="relative w-48 h-48 rounded-full object-cover mx-auto border-4 border-accent shadow-elegant"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-3xl font-elegant text-primary mb-2">{data.brideName}</h3>
                      {data.brideFamilyName && (
                        <p className="text-muted-foreground italic">{data.brideFamilyName}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Countdown */}
      <AnimatedSection animation="fadeInScale" delay={300}>
        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-elegant">Μέτρημα Αντίστροφης</h2>
            <CountdownTimer targetDate={weddingDate.toISOString()} />
            <AddToCalendar
              title={invitation.title}
              startDate={weddingDate}
              endDate={new Date(weddingDate.getTime() + 4 * 60 * 60 * 1000)}
              location={data.ceremonyLocation || ''}
              description={data.invitationText || ''}
            />
          </div>
        </section>
      </AnimatedSection>

      {/* Events Timeline */}
      {events.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={400}>
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-elegant text-center mb-12 text-primary">Πρόγραμμα Εκδηλώσεων</h2>
              <div className="space-y-6">
                {events.map((event, index) => (
                  <div 
                    key={index}
                    className="bg-muted rounded-xl p-6 border-l-4 border-accent hover:shadow-card transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <Clock className="text-accent mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-primary mb-2">{event.title}</h3>
                        <p className="text-muted-foreground mb-2">{event.time}</p>
                        {event.location && (
                          <p className="text-sm flex items-center gap-1 text-muted-foreground">
                            <MapPin size={14} /> {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      <GeometricDivider style="classic" color="hsl(var(--accent))" />

      {/* Ceremony Location */}
      {(data.ceremonyLocation || data.ceremonyCoordinates) && (
        <AnimatedSection animation="fadeInUp" delay={500}>
          <section className="py-20 px-4 bg-muted">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-elegant text-center mb-12 text-primary">Τελετή</h2>
              <div className="bg-background rounded-2xl overflow-hidden shadow-elegant border border-border">
                {data.ceremonyCoordinates && (
                  <MapDisplay
                    position={data.ceremonyCoordinates}
                    locationName={data.ceremonyLocation || ''}
                  />
                )}
                <div className="p-6 text-center">
                  <p className="text-xl text-foreground font-medium">{data.ceremonyLocation}</p>
                  {data.ceremonyTime && (
                    <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
                      <Clock size={18} />
                      {data.ceremonyTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* RSVP */}
      <AnimatedSection animation="fadeInUp" delay={600}>
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-elegant text-center mb-12 text-primary">Επιβεβαίωση Παρουσίας</h2>
            <div className="bg-muted rounded-2xl p-8 shadow-card border border-border">
              <RSVPForm invitationId={invitation.id} invitationType="wedding" invitationTitle={invitation.title} />
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Gallery */}
      {data.photos && data.photos.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={700}>
          <section className="py-20 px-4 bg-muted">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-elegant text-center mb-12 text-primary">Η Ιστορία μας</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.photos.map((photo: string, index: number) => (
                  <img key={index} src={photo} alt={`Photo ${index + 1}`} className="w-full h-64 object-cover rounded-lg shadow-image" />
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Live Photo Wall */}
      <AnimatedSection animation="fadeInUp" delay={800}>
        <section className="py-20 px-4">
          <LivePhotoWall invitationId={invitation.id} />
        </section>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-4 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-16 bg-accent" />
          <Heart className="text-accent animate-pulse" size={20} />
          <div className="h-px w-16 bg-accent" />
        </div>
        <p className="text-lg font-elegant">
          Με αγάπη, {data.groomName?.split(' ')[0]} & {data.brideName?.split(' ')[0]}
        </p>
      </footer>
    </div>
  );
}
