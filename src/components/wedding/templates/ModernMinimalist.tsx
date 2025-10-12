import { BaseInvitation } from "@/lib/invitationStorage";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import { LivePhotoWall } from "@/components/wedding/LivePhotoWall";
import { MapDisplay } from "@/components/wedding/MapDisplay";
import { AnimatedSection } from "@/components/wedding/animations/AnimatedSection";
import weddingHeroSample from "@/assets/wedding-hero-sample.jpg";

interface TemplateProps {
  invitation: BaseInvitation;
  events: any[];
  giftItems: any[];
  onOpenDirections: (position: [number, number]) => void;
}

export function ModernMinimalist({ invitation, events, giftItems, onOpenDirections }: TemplateProps) {
  const data = invitation.data;
  const formattedDate = data.weddingDate 
    ? format(new Date(data.weddingDate), "EEEE, d MMMM yyyy", { locale: el })
    : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">
      {/* Hero Section - Full Bleed Minimalist */}
      <AnimatedSection animation="fadeInUp">
        <section className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="relative h-[70vh] min-h-[600px]">
            <img
              src={data.mainImage || weddingHeroSample}
              alt="Wedding Invitation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            
            {/* Minimalist Title Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white space-y-6 max-w-4xl px-8">
                <div className="space-y-2">
                  <h1 className="text-7xl md:text-8xl font-light tracking-widest uppercase">
                    {data.groomName?.split(' ')[0]} & {data.brideName?.split(' ')[0]}
                  </h1>
                  <div className="w-24 h-px bg-white/50 mx-auto" />
                </div>
                {formattedDate && (
                  <p className="text-xl md:text-2xl font-light tracking-wide">{formattedDate}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Invitation Text - Centered Minimalist Block */}
      {data.invitationText && (
        <AnimatedSection animation="fadeInScale" delay={100}>
          <section className="max-w-3xl mx-auto text-center">
            <div 
              className="text-lg md:text-xl font-light leading-relaxed text-foreground/80 space-y-4"
              dangerouslySetInnerHTML={{ __html: data.invitationText }}
            />
          </section>
        </AnimatedSection>
      )}

      {/* Couple Section - Side by Side Minimal Grid */}
      <AnimatedSection animation="fadeInUp" delay={200}>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Groom */}
          <div className="space-y-6 hover-lift">
            {data.groomPhoto && (
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={data.groomPhoto}
                  alt="Groom"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            )}
            <div className="space-y-3">
              <h2 className="text-4xl font-light tracking-wide">{data.groomName}</h2>
              {data.groomFamily && data.groomFamily.length > 0 && (
                <div className="text-sm text-muted-foreground space-y-1 font-light">
                  {data.groomFamily.map((member, idx) => (
                    <p key={idx}>{member}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bride */}
          <div className="space-y-6 hover-lift">
            {data.bridePhoto && (
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={data.bridePhoto}
                  alt="Bride"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            )}
            <div className="space-y-3">
              <h2 className="text-4xl font-light tracking-wide">{data.brideName}</h2>
              {data.brideFamily && data.brideFamily.length > 0 && (
                <div className="text-sm text-muted-foreground space-y-1 font-light">
                  {data.brideFamily.map((member, idx) => (
                    <p key={idx}>{member}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Countdown Timer - Minimal Box */}
      {data.weddingDate && (
        <AnimatedSection animation="fadeInScale" delay={300}>
          <section className="max-w-3xl mx-auto">
            <div className="border border-foreground/10 p-12">
              <CountdownTimer targetDate={data.weddingDate} targetTime={data.weddingTime} />
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Events Timeline - Clean List */}
      {events.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={400}>
          <section className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl font-light tracking-wide text-center mb-16">Πρόγραμμα</h2>
            <div className="space-y-1">
              {events.map((event, index) => (
                <div 
                  key={event.id} 
                  className="group border-b border-foreground/10 py-8 hover:bg-foreground/5 transition-colors px-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-light mb-2">{event.event_name}</h3>
                      {event.event_description && (
                        <p className="text-muted-foreground font-light">{event.event_description}</p>
                      )}
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 text-sm font-light md:items-center">
                      {event.event_time && (
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {event.event_time}
                        </span>
                      )}
                      {event.location_name && (
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {event.location_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Locations - Split Screen */}
      {(data.churchLocation || data.receptionLocation) && (
        <AnimatedSection animation="fadeInUp" delay={500}>
          <section className="space-y-16">
            <h2 className="text-4xl font-light tracking-wide text-center">Τοποθεσίες</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
              {data.churchLocation && (
                <div className="group relative overflow-hidden aspect-[4/3] hover-lift">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
                  {data.churchPosition && (
                    <div className="absolute inset-0">
                      <MapDisplay position={data.churchPosition} locationName={data.churchLocation} />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
                    <h3 className="text-3xl font-light mb-2 flex items-center gap-3">
                      <MapPin className="w-6 h-6" />
                      Μυστήριο
                    </h3>
                    <p className="text-white/80 mb-4 font-light">{data.churchLocation}</p>
                    {data.churchPosition && (
                      <Button
                        onClick={() => onOpenDirections(data.churchPosition!)}
                        variant="outline"
                        className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-black"
                      >
                        Οδηγίες <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {data.receptionLocation && (
                <div className="group relative overflow-hidden aspect-[4/3] hover-lift">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
                  {data.receptionPosition && (
                    <div className="absolute inset-0">
                      <MapDisplay position={data.receptionPosition} locationName={data.receptionLocation} />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
                    <h3 className="text-3xl font-light mb-2 flex items-center gap-3">
                      <MapPin className="w-6 h-6" />
                      Δεξίωση
                    </h3>
                    <p className="text-white/80 mb-4 font-light">{data.receptionLocation}</p>
                    {data.receptionPosition && (
                      <Button
                        onClick={() => onOpenDirections(data.receptionPosition!)}
                        variant="outline"
                        className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-black"
                      >
                        Οδηγίες <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* RSVP Section - Minimal Form */}
      <AnimatedSection animation="fadeInUp" delay={600}>
        <section className="max-w-2xl mx-auto">
          <div className="border border-foreground/10 p-12">
            <h2 className="text-4xl font-light tracking-wide text-center mb-12">Επιβεβαίωση</h2>
            <RSVPForm invitationId={invitation.id} invitationType="wedding" invitationTitle={data.title} />
          </div>
        </section>
      </AnimatedSection>

      {/* Gallery - Grid Layout */}
      {data.gallery && data.gallery.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={700}>
          <section className="space-y-16">
            <h2 className="text-4xl font-light tracking-wide text-center">Φωτογραφίες</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {data.gallery.map((image) => (
                <div key={image.id} className="aspect-square overflow-hidden hover-zoom">
                  <img 
                    src={image.url} 
                    alt="Gallery" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                  />
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Live Photo Wall */}
      <AnimatedSection animation="fadeInUp" delay={800}>
        <section>
          <LivePhotoWall invitationId={invitation.id} isPublic />
        </section>
      </AnimatedSection>
    </div>
  );
}
