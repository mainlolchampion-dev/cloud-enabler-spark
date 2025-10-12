import { BaseInvitation } from "@/lib/invitationStorage";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Heart } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import { LivePhotoWall } from "@/components/wedding/LivePhotoWall";
import { MapDisplay } from "@/components/wedding/MapDisplay";
import { AnimatedSection } from "@/components/wedding/animations/AnimatedSection";
import { GeometricDivider } from "@/components/wedding/decorative/GeometricDivider";
import { OrnamentalCorner } from "@/components/wedding/decorative/OrnamentalCorner";
import weddingHeroSample from "@/assets/wedding-hero-sample.jpg";

interface TemplateProps {
  invitation: BaseInvitation;
  events: any[];
  giftItems: any[];
  onOpenDirections: (position: [number, number]) => void;
}

export function ClassicFormal({ invitation, events, giftItems, onOpenDirections }: TemplateProps) {
  const data = invitation.data;
  const formattedDate = data.weddingDate 
    ? format(new Date(data.weddingDate), "EEEE, d MMMM yyyy", { locale: el })
    : "";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      {/* Hero with Elegant Border */}
      <AnimatedSection animation="fadeInScale">
        <section className="relative">
          <div className="relative border-4 border-primary/30 rounded-lg overflow-hidden shadow-2xl">
            <OrnamentalCorner corner="top-left" pattern="geometric" color="#d4af37" size={100} />
            <OrnamentalCorner corner="top-right" pattern="geometric" color="#d4af37" size={100} />
            <OrnamentalCorner corner="bottom-left" pattern="geometric" color="#d4af37" size={100} />
            <OrnamentalCorner corner="bottom-right" pattern="geometric" color="#d4af37" size={100} />
            
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={data.mainImage || weddingHeroSample}
                alt="Wedding"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-12 text-center text-white">
              <div className="max-w-2xl mx-auto">
                <GeometricDivider style="classic" color="#d4af37" className="mb-6" />
                <h1 className="text-5xl font-elegant mb-4 drop-shadow-lg tracking-wide">{data.title}</h1>
                {formattedDate && (
                  <p className="text-2xl font-serif drop-shadow-md tracking-wider">{formattedDate}</p>
                )}
                <GeometricDivider style="classic" color="#d4af37" className="mt-6" />
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Invitation Text in Formal Card */}
      {data.invitationText && (
        <AnimatedSection animation="fadeInUp" delay={100}>
          <section className="max-w-3xl mx-auto">
            <div className="relative bg-background border-2 border-primary/20 rounded-lg p-12 shadow-xl">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-accent" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-accent" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-accent" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-accent" />
              
              <div 
                className="text-center text-lg font-classic leading-loose text-foreground"
                dangerouslySetInnerHTML={{ __html: data.invitationText }}
              />
            </div>
          </section>
        </AnimatedSection>
      )}

      <GeometricDivider style="classic" color="#d4af37" className="my-20" />

      {/* Couple Section - Formal Portraits */}
      <AnimatedSection animation="fadeInUp" delay={200}>
        <section className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Groom */}
            <div className="text-center hover-lift">
              {data.groomPhoto && (
                <div className="relative inline-block mb-6">
                  <div className="absolute -inset-3 border-2 border-accent rounded-lg" />
                  <img
                    src={data.groomPhoto}
                    alt="Groom"
                    className="relative w-64 h-80 object-cover mx-auto shadow-2xl rounded-lg"
                  />
                </div>
              )}
              <h2 className="text-3xl font-elegant text-primary mb-3 tracking-wide">{data.groomName}</h2>
              {data.groomFamily && data.groomFamily.length > 0 && (
                <div className="text-sm text-muted-foreground space-y-1 font-classic">
                  {data.groomFamily.map((member, idx) => (
                    <p key={idx}>{member}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Bride */}
            <div className="text-center hover-lift">
              {data.bridePhoto && (
                <div className="relative inline-block mb-6">
                  <div className="absolute -inset-3 border-2 border-accent rounded-lg" />
                  <img
                    src={data.bridePhoto}
                    alt="Bride"
                    className="relative w-64 h-80 object-cover mx-auto shadow-2xl rounded-lg"
                  />
                </div>
              )}
              <h2 className="text-3xl font-elegant text-primary mb-3 tracking-wide">{data.brideName}</h2>
              {data.brideFamily && data.brideFamily.length > 0 && (
                <div className="text-sm text-muted-foreground space-y-1 font-classic">
                  {data.brideFamily.map((member, idx) => (
                    <p key={idx}>{member}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Koumbaroi Section */}
      {data.koumbaroi && data.koumbaroi.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={250}>
          <section>
            <h2 className="text-4xl font-elegant text-primary text-center mb-12 tracking-wide">Κουμπάροι</h2>
            <GeometricDivider style="classic" color="#d4af37" className="mb-12" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {data.koumbaroi.map((koumbaros) => (
                <div key={koumbaros.id} className="text-center hover-lift">
                  {koumbaros.col2 && (
                    <div className="relative inline-block mb-6">
                      <div className="absolute -inset-3 border-2 border-accent rounded-lg" />
                      <img
                        src={koumbaros.col2}
                        alt={koumbaros.col1}
                        className="relative w-48 h-56 object-cover mx-auto shadow-2xl rounded-lg"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-elegant text-primary tracking-wide">{koumbaros.col1}</h3>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Countdown */}
      {data.weddingDate && (
        <AnimatedSection animation="fadeInScale" delay={300}>
          <section className="max-w-2xl mx-auto">
            <div className="border-2 border-primary/20 rounded-lg p-8 shadow-lg bg-background">
              <CountdownTimer targetDate={data.weddingDate} targetTime={data.weddingTime} />
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Events Timeline */}
      {events.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={400}>
          <section>
            <h2 className="text-4xl font-elegant text-primary text-center mb-12 tracking-wide">Πρόγραμμα</h2>
            <GeometricDivider style="classic" color="#d4af37" className="mb-12" />
            
            <div className="space-y-6 max-w-3xl mx-auto">
              {events.map((event, index) => (
                <div key={event.id} className="hover-lift">
                  <div className="border-2 border-primary/20 rounded-lg p-6 shadow-lg bg-background">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-14 h-14 border-2 border-accent rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-elegant mb-2">{event.event_name}</h3>
                        {event.event_description && (
                          <p className="text-muted-foreground mb-3 font-classic">{event.event_description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm font-classic">
                          {event.event_time && <span>{event.event_time}</span>}
                          {event.location_name && <span>{event.location_name}</span>}
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
            <h2 className="text-4xl font-elegant text-primary text-center mb-12 tracking-wide">Τοποθεσίες</h2>
            <GeometricDivider style="classic" color="#d4af37" className="mb-12" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.churchLocation && (
                <div className="hover-lift">
                  <div className="border-2 border-primary/20 rounded-lg overflow-hidden shadow-lg bg-background">
                    <div className="p-6">
                      <h3 className="text-2xl font-elegant mb-4 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-primary" />
                        Μυστήριο
                      </h3>
                      <p className="text-muted-foreground mb-4 font-classic">{data.churchLocation}</p>
                      {data.churchPosition && (
                        <>
                          <MapDisplay position={data.churchPosition} locationName={data.churchLocation} />
                          <Button onClick={() => onOpenDirections(data.churchPosition!)} className="w-full mt-4">
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
                  <div className="border-2 border-primary/20 rounded-lg overflow-hidden shadow-lg bg-background">
                    <div className="p-6">
                      <h3 className="text-2xl font-elegant mb-4 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-primary" />
                        Δεξίωση
                      </h3>
                      <p className="text-muted-foreground mb-4 font-classic">{data.receptionLocation}</p>
                      {data.receptionPosition && (
                        <>
                          <MapDisplay position={data.receptionPosition} locationName={data.receptionLocation} />
                          <Button onClick={() => onOpenDirections(data.receptionPosition!)} className="w-full mt-4">
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

      {/* Bank Accounts */}
      {data.bankAccounts && data.bankAccounts.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={550}>
          <section>
            <h2 className="text-4xl font-elegant text-primary text-center mb-12 tracking-wide">Αριθμοί Κατάθεσης</h2>
            <GeometricDivider style="classic" color="#d4af37" className="mb-12" />
            
            <div className="max-w-2xl mx-auto space-y-4">
              {data.bankAccounts.map((account) => (
                <div key={account.id} className="border-2 border-primary/20 rounded-lg p-6 shadow-lg bg-background hover-lift">
                  <div className="flex items-center justify-between gap-4 flex-wrap font-classic">
                    <span className="font-semibold text-lg text-primary">{account.col1}</span>
                    <span className="font-mono text-muted-foreground">{account.col2}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* RSVP */}
      <AnimatedSection animation="fadeInUp" delay={600}>
        <section className="max-w-2xl mx-auto">
          <div className="border-2 border-primary/20 rounded-lg p-10 shadow-xl bg-background">
            <h2 className="text-4xl font-elegant text-primary text-center mb-8 tracking-wide">RSVP</h2>
            <GeometricDivider style="classic" color="#d4af37" className="mb-8" />
            <RSVPForm invitationId={invitation.id} invitationType="wedding" invitationTitle={data.title} />
          </div>
        </section>
      </AnimatedSection>

      {/* Contact Info */}
      {data.contactInfo && (
        <AnimatedSection animation="fadeInUp" delay={650}>
          <section className="max-w-2xl mx-auto">
            <div className="border-2 border-primary/20 rounded-lg p-8 shadow-xl bg-background">
              <h2 className="text-4xl font-elegant text-primary text-center mb-8 tracking-wide">Στοιχεία Επικοινωνίας</h2>
              <GeometricDivider style="classic" color="#d4af37" className="mb-8" />
              <div 
                className="text-center text-muted-foreground font-classic prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: data.contactInfo }}
              />
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={700}>
          <section>
            <h2 className="text-4xl font-elegant text-primary text-center mb-12 tracking-wide">Φωτογραφίες</h2>
            <GeometricDivider style="classic" color="#d4af37" className="mb-12" />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {data.gallery.map((image) => (
                <div key={image.id} className="hover-zoom">
                  <div className="relative border-2 border-primary/20 rounded-lg overflow-hidden shadow-lg">
                    <img src={image.url} alt="Gallery" className="w-full aspect-square object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Final Message */}
      <AnimatedSection animation="fadeInScale" delay={800}>
        <section className="text-center py-16">
          <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
          <p className="text-3xl font-elegant text-primary tracking-wide">Με τιμή σας περιμένουμε</p>
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
