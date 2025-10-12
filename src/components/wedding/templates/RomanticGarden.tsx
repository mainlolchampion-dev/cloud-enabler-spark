import { BaseInvitation } from "@/lib/invitationStorage";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Clock } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import { LivePhotoWall } from "@/components/wedding/LivePhotoWall";
import { MapDisplay } from "@/components/wedding/MapDisplay";
import { AnimatedSection } from "@/components/wedding/animations/AnimatedSection";
import { FloralBorder } from "@/components/wedding/decorative/FloralBorder";
import { GeometricDivider } from "@/components/wedding/decorative/GeometricDivider";
import { OrnamentalCorner } from "@/components/wedding/decorative/OrnamentalCorner";
import weddingHeroSample from "@/assets/wedding-hero-sample.jpg";

interface TemplateProps {
  invitation: BaseInvitation;
  events: any[];
  giftItems: any[];
  onOpenDirections: (position: [number, number]) => void;
}

export function RomanticGarden({ invitation, events, giftItems, onOpenDirections }: TemplateProps) {
  const data = invitation.data;
  const formattedDate = data.weddingDate 
    ? format(new Date(data.weddingDate), "EEEE, d MMMM yyyy", { locale: el })
    : "";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero Section with Floral Frame */}
      <AnimatedSection animation="fadeInUp">
        <section className="relative">
          <OrnamentalCorner corner="top-left" pattern="floral" color="#f4a7b9" size={120} />
          <OrnamentalCorner corner="top-right" pattern="floral" color="#f4a7b9" size={120} />
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <FloralBorder position="top" color="#f4a7b9" />
            <img
              src={data.mainImage || weddingHeroSample}
              alt="Wedding Invitation"
              className="w-full object-cover aspect-[21/9]"
            />
            <FloralBorder position="bottom" color="#f4a7b9" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center text-white">
              <h1 className="text-5xl font-script mb-2 drop-shadow-lg">{data.title}</h1>
              {formattedDate && (
                <p className="text-xl font-serif drop-shadow-md">{formattedDate}</p>
              )}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Invitation Text in Decorative Frame */}
      {data.invitationText && (
        <AnimatedSection animation="fadeInScale" delay={100}>
          <section className="relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-primary/20">
                <OrnamentalCorner corner="top-left" pattern="floral" color="#f4a7b9" size={80} />
                <OrnamentalCorner corner="bottom-right" pattern="floral" color="#f4a7b9" size={80} />
                
                <div 
                  className="text-lg font-serif text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: data.invitationText }}
                />
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      <GeometricDivider style="elegant" color="#f4a7b9" className="my-16" />

      {/* Couple Section - Side by Side with Floral Divider */}
      <AnimatedSection animation="fadeInUp" delay={200}>
        <section className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center max-w-4xl mx-auto">
          {/* Groom */}
          <div className="text-center hover-lift">
            {data.groomPhoto && (
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl" />
                <img
                  src={data.groomPhoto}
                  alt="Groom"
                  className="relative rounded-full w-56 h-56 object-cover mx-auto mb-6 shadow-2xl border-4 border-background"
                />
              </div>
            )}
            <h2 className="text-3xl font-script text-primary mb-2">{data.groomName}</h2>
            {data.groomFamily && data.groomFamily.length > 0 && (
              <div className="text-sm text-muted-foreground mt-3 space-y-1">
                {data.groomFamily.map((member, idx) => (
                  <p key={idx}>{member}</p>
                ))}
              </div>
            )}
          </div>

          {/* Floral Divider */}
          <div className="hidden md:block">
            <svg width="80" height="200" viewBox="0 0 80 200" fill="none" className="opacity-40">
              <path d="M40,0 Q35,50 40,100 T40,200" stroke="#f4a7b9" strokeWidth="2" />
              {[30, 70, 110, 150].map((y) => (
                <g key={y}>
                  <circle cx="40" cy={y} r="8" fill="#f4a7b9" opacity="0.6" />
                  <circle cx="32" cy={y} r="6" fill="#f4a7b9" opacity="0.4" />
                  <circle cx="48" cy={y} r="6" fill="#f4a7b9" opacity="0.4" />
                </g>
              ))}
            </svg>
          </div>

          {/* Bride */}
          <div className="text-center hover-lift">
            {data.bridePhoto && (
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl" />
                <img
                  src={data.bridePhoto}
                  alt="Bride"
                  className="relative rounded-full w-56 h-56 object-cover mx-auto mb-6 shadow-2xl border-4 border-background"
                />
              </div>
            )}
            <h2 className="text-3xl font-script text-primary mb-2">{data.brideName}</h2>
            {data.brideFamily && data.brideFamily.length > 0 && (
              <div className="text-sm text-muted-foreground mt-3 space-y-1">
                {data.brideFamily.map((member, idx) => (
                  <p key={idx}>{member}</p>
                ))}
              </div>
            )}
          </div>
        </section>
      </AnimatedSection>

      <GeometricDivider style="elegant" color="#f4a7b9" className="my-16" />

      {/* Countdown Timer */}
      {data.weddingDate && (
        <AnimatedSection animation="fadeInScale" delay={300}>
          <section className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 shadow-lg border border-primary/10">
              <CountdownTimer targetDate={data.weddingDate} targetTime={data.weddingTime} />
            </div>
          </section>
        </AnimatedSection>
      )}

      <GeometricDivider style="elegant" color="#f4a7b9" className="my-16" />

      {/* Events Timeline */}
      {events.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={400}>
          <section>
            <h2 className="text-3xl font-script text-primary text-center mb-12">Πρόγραμμα Εκδήλωσης</h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              {events.map((event, index) => (
                <div key={event.id} className="hover-lift">
                  <div className="bg-background rounded-xl p-6 shadow-lg border border-primary/10">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{event.event_name}</h3>
                        {event.event_description && (
                          <p className="text-muted-foreground mb-3">{event.event_description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm">
                          {event.event_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {event.event_time}
                            </span>
                          )}
                          {event.location_name && (
                            <span className="flex items-center gap-1">
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
          <section>
            <h2 className="text-3xl font-script text-primary text-center mb-12">Τοποθεσίες</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.churchLocation && (
                <div className="hover-lift">
                  <div className="bg-background rounded-xl overflow-hidden shadow-lg border border-primary/10">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Μυστήριο
                      </h3>
                      <p className="text-muted-foreground mb-4">{data.churchLocation}</p>
                      {data.churchPosition && (
                        <>
                          <MapDisplay position={data.churchPosition} locationName={data.churchLocation} />
                          <Button
                            onClick={() => onOpenDirections(data.churchPosition!)}
                            className="w-full mt-4"
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
                  <div className="bg-background rounded-xl overflow-hidden shadow-lg border border-primary/10">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Δεξίωση
                      </h3>
                      <p className="text-muted-foreground mb-4">{data.receptionLocation}</p>
                      {data.receptionPosition && (
                        <>
                          <MapDisplay position={data.receptionPosition} locationName={data.receptionLocation} />
                          <Button
                            onClick={() => onOpenDirections(data.receptionPosition!)}
                            className="w-full mt-4"
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
          <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 shadow-xl border border-primary/10">
            <OrnamentalCorner corner="top-left" pattern="floral" color="#f4a7b9" size={60} />
            <OrnamentalCorner corner="bottom-right" pattern="floral" color="#f4a7b9" size={60} />
            
            <h2 className="text-3xl font-script text-primary text-center mb-8">Επιβεβαίωση Παρουσίας</h2>
            <RSVPForm invitationId={invitation.id} invitationType="wedding" invitationTitle={data.title} />
          </div>
        </section>
      </AnimatedSection>

      {/* Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={700}>
          <section>
            <h2 className="text-3xl font-script text-primary text-center mb-12">Φωτογραφίες</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.gallery.map((image) => (
                <div key={image.id} className="hover-zoom rounded-lg overflow-hidden shadow-md">
                  <img src={image.url} alt="Gallery" className="w-full h-full object-cover aspect-square" />
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Heart Section */}
      <AnimatedSection animation="fadeInScale" delay={800}>
        <section className="text-center py-12">
          <Heart className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse-slow" />
          <p className="text-2xl font-script text-primary">Με αγάπη και χαρά, σας περιμένουμε!</p>
        </section>
      </AnimatedSection>

      {/* Live Photo Wall */}
      <AnimatedSection animation="fadeInUp" delay={900}>
        <section>
          <LivePhotoWall invitationId={invitation.id} isPublic />
        </section>
      </AnimatedSection>
    </div>
  );
}
