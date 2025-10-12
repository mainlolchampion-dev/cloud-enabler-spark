import { BaseInvitation } from "@/lib/invitationStorage";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Leaf } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import { LivePhotoWall } from "@/components/wedding/LivePhotoWall";
import { MapDisplay } from "@/components/wedding/MapDisplay";
import { AnimatedSection } from "@/components/wedding/animations/AnimatedSection";
import { FloralBorder } from "@/components/wedding/decorative/FloralBorder";
import weddingHeroSample from "@/assets/wedding-hero-sample.jpg";

interface TemplateProps {
  invitation: BaseInvitation;
  events: any[];
  giftItems: any[];
  onOpenDirections: (position: [number, number]) => void;
}

export function GardenRomance({ invitation, events, giftItems, onOpenDirections }: TemplateProps) {
  const data = invitation.data;
  const formattedDate = data.weddingDate 
    ? format(new Date(data.weddingDate), "EEEE, d MMMM yyyy", { locale: el })
    : "";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      {/* Botanical Frame */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <svg className="absolute top-0 left-0 w-64 h-64" viewBox="0 0 200 200">
          <path d="M20,100 Q50,50 100,20" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
          <circle cx="30" cy="90" r="8" fill="hsl(var(--primary))" opacity="0.6" />
          <circle cx="60" cy="70" r="10" fill="hsl(var(--accent))" opacity="0.5" />
          <circle cx="80" cy="50" r="7" fill="hsl(var(--primary))" opacity="0.6" />
        </svg>
        <svg className="absolute top-0 right-0 w-64 h-64 transform scale-x-[-1]" viewBox="0 0 200 200">
          <path d="M20,100 Q50,50 100,20" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
          <circle cx="30" cy="90" r="8" fill="hsl(var(--primary))" opacity="0.6" />
          <circle cx="60" cy="70" r="10" fill="hsl(var(--accent))" opacity="0.5" />
        </svg>
      </div>

      {/* Hero Section - Botanical Garden Style */}
      <AnimatedSection animation="fadeInUp">
        <section className="relative z-10">
          <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-elegant)]">
            <FloralBorder position="top" color="hsl(var(--primary))" />
            
            <div className="aspect-[21/9] relative">
              <img
                src={data.mainImage || weddingHeroSample}
                alt="Wedding Invitation"
                className="w-full h-full object-cover"
              />
              
              {/* Botanical Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Decorative Leaves */}
              <div className="absolute inset-0 pointer-events-none">
                <Leaf className="absolute top-4 left-4 w-12 h-12 text-white/20 rotate-12" />
                <Leaf className="absolute top-8 right-8 w-16 h-16 text-white/15 -rotate-45" />
                <Leaf className="absolute bottom-12 left-12 w-10 h-10 text-white/25 rotate-90" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-12 text-center text-white">
                <div className="inline-block space-y-4">
                  <Leaf className="w-10 h-10 mx-auto text-primary animate-pulse-slow" />
                  <h1 className="text-5xl md:text-6xl font-accent mb-3 drop-shadow-lg">
                    {data.title}
                  </h1>
                  {formattedDate && (
                    <p className="text-xl font-heading drop-shadow-md">{formattedDate}</p>
                  )}
                </div>
              </div>
            </div>
            
            <FloralBorder position="bottom" color="hsl(var(--primary))" />
          </div>
        </section>
      </AnimatedSection>

      {/* Invitation Text - Nature Frame */}
      {data.invitationText && (
        <AnimatedSection animation="fadeInScale" delay={100}>
          <section className="max-w-3xl mx-auto">
            <div className="relative bg-background/90 backdrop-blur-sm rounded-2xl p-12 shadow-[var(--shadow-card)] border-2 border-primary/20">
              {/* Decorative corner leaves */}
              <Leaf className="absolute -top-2 -left-2 w-8 h-8 text-primary/40 rotate-45" />
              <Leaf className="absolute -top-2 -right-2 w-8 h-8 text-primary/40 -rotate-45" />
              <Leaf className="absolute -bottom-2 -left-2 w-8 h-8 text-primary/40 -rotate-135" />
              <Leaf className="absolute -bottom-2 -right-2 w-8 h-8 text-primary/40 rotate-135" />
              
              <div 
                className="text-lg font-heading text-foreground leading-relaxed text-center"
                dangerouslySetInnerHTML={{ __html: data.invitationText }}
              />
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Botanical Divider */}
      <div className="flex items-center justify-center gap-4 my-16">
        <div className="w-24 h-px bg-primary/30" />
        <Leaf className="w-8 h-8 text-primary" />
        <div className="w-24 h-px bg-primary/30" />
      </div>

      {/* Couple Section - Botanical Cards */}
      <AnimatedSection animation="fadeInUp" delay={200}>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Groom */}
          <div className="group hover-lift">
            <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-[var(--shadow-card)] border border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              
              {data.groomPhoto && (
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={data.groomPhoto}
                    alt="Groom"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Leaf className="absolute bottom-4 right-4 w-12 h-12 text-white/50" />
                </div>
              )}
              
              <div className="relative p-8 text-center">
                <h2 className="text-3xl font-accent text-primary mb-2">{data.groomName}</h2>
                {data.groomFamily && data.groomFamily.length > 0 && (
                  <div className="text-sm text-muted-foreground space-y-1 font-heading">
                    {data.groomFamily.map((member, idx) => (
                      <p key={idx}>{member}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bride */}
          <div className="group hover-lift">
            <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-[var(--shadow-card)] border border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5" />
              
              {data.bridePhoto && (
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={data.bridePhoto}
                    alt="Bride"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Leaf className="absolute bottom-4 left-4 w-12 h-12 text-white/50 transform scale-x-[-1]" />
                </div>
              )}
              
              <div className="relative p-8 text-center">
                <h2 className="text-3xl font-accent text-primary mb-2">{data.brideName}</h2>
                {data.brideFamily && data.brideFamily.length > 0 && (
                  <div className="text-sm text-muted-foreground space-y-1 font-heading">
                    {data.brideFamily.map((member, idx) => (
                      <p key={idx}>{member}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Countdown Timer */}
      {data.weddingDate && (
        <AnimatedSection animation="fadeInScale" delay={300}>
          <section className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-10 shadow-[var(--shadow-card)] border border-primary/10">
              <CountdownTimer targetDate={data.weddingDate} targetTime={data.weddingTime} />
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Events Timeline */}
      {events.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={400}>
          <section className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-4xl font-accent text-primary text-center">Πρόγραμμα Εκδήλωσης</h2>
            <div className="space-y-6">
              {events.map((event) => (
                <div key={event.id} className="hover-lift">
                  <div className="bg-background rounded-2xl p-6 shadow-[var(--shadow-card)] border border-primary/10">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-heading text-primary mb-2">{event.event_name}</h3>
                        {event.event_description && (
                          <p className="text-muted-foreground mb-3 font-body">{event.event_description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm font-body">
                          {event.event_time && (
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {event.event_time}
                            </span>
                          )}
                          {event.location_name && (
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              {event.location_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Locations */}
      {(data.churchLocation || data.receptionLocation) && (
        <AnimatedSection animation="fadeInUp" delay={500}>
          <section className="space-y-12">
            <h2 className="text-4xl font-accent text-primary text-center">Τοποθεσίες</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.churchLocation && (
                <div className="hover-lift">
                  <div className="bg-background rounded-2xl overflow-hidden shadow-[var(--shadow-card)] border border-primary/10">
                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-heading text-primary flex items-center gap-3">
                        <MapPin className="w-6 h-6" />
                        Μυστήριο
                      </h3>
                      <p className="text-muted-foreground font-body">{data.churchLocation}</p>
                      {data.churchPosition && (
                        <>
                          <div className="rounded-lg overflow-hidden border border-primary/10">
                            <MapDisplay position={data.churchPosition} locationName={data.churchLocation} />
                          </div>
                          <Button
                            onClick={() => onOpenDirections(data.churchPosition!)}
                            className="w-full"
                            variant="outline"
                          >
                            Οδηγίες
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {data.receptionLocation && (
                <div className="hover-lift">
                  <div className="bg-background rounded-2xl overflow-hidden shadow-[var(--shadow-card)] border border-primary/10">
                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-heading text-primary flex items-center gap-3">
                        <MapPin className="w-6 h-6" />
                        Δεξίωση
                      </h3>
                      <p className="text-muted-foreground font-body">{data.receptionLocation}</p>
                      {data.receptionPosition && (
                        <>
                          <div className="rounded-lg overflow-hidden border border-primary/10">
                            <MapDisplay position={data.receptionPosition} locationName={data.receptionLocation} />
                          </div>
                          <Button
                            onClick={() => onOpenDirections(data.receptionPosition!)}
                            className="w-full"
                            variant="outline"
                          >
                            Οδηγίες
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* RSVP Section */}
      <AnimatedSection animation="fadeInUp" delay={600}>
        <section className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-10 shadow-[var(--shadow-elegant)] border border-primary/10">
            <h2 className="text-4xl font-accent text-primary text-center mb-8">Επιβεβαίωση Παρουσίας</h2>
            <RSVPForm invitationId={invitation.id} invitationType="wedding" invitationTitle={data.title} />
          </div>
        </section>
      </AnimatedSection>

      {/* Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={700}>
          <section className="space-y-12">
            <h2 className="text-4xl font-accent text-primary text-center">Φωτογραφίες</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.gallery.map((image) => (
                <div key={image.id} className="hover-zoom rounded-2xl overflow-hidden shadow-[var(--shadow-image)] border border-primary/10">
                  <img src={image.url} alt="Gallery" className="w-full h-full object-cover aspect-square" />
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
