import { BaseInvitation } from "@/lib/invitationStorage";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Crown, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import { AddToCalendar } from "@/components/wedding/AddToCalendar";
import { LivePhotoWall } from "@/components/wedding/LivePhotoWall";
import { MapDisplay } from "@/components/wedding/MapDisplay";
import { SeatingDisplay } from "@/components/wedding/SeatingDisplay";
import { AnimatedSection } from "@/components/wedding/animations/AnimatedSection";
import { OrnamentalCorner } from "@/components/wedding/decorative/OrnamentalCorner";
import weddingHeroSample from "@/assets/wedding-hero-sample.jpg";

interface TemplateProps {
  invitation: BaseInvitation;
  events: any[];
  giftItems: any[];
  onOpenDirections: (position: [number, number]) => void;
}

export function LuxeGold({ invitation, events, giftItems, onOpenDirections }: TemplateProps) {
  const data = invitation.data;
  const formattedDate = data.weddingDate 
    ? format(new Date(data.weddingDate), "EEEE, d MMMM yyyy", { locale: el })
    : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      {/* Luxury Border Frame */}
      <div className="fixed inset-0 pointer-events-none border-4 border-primary/20 z-50" />
      
      {/* Hero Section - Opulent Black & Gold */}
      <AnimatedSection animation="fadeInUp">
        <section className="relative">
          <OrnamentalCorner corner="top-left" pattern="geometric" color="hsl(var(--accent))" size={120} />
          <OrnamentalCorner corner="top-right" pattern="geometric" color="hsl(var(--accent))" size={120} />
          <OrnamentalCorner corner="bottom-left" pattern="geometric" color="hsl(var(--accent))" size={120} />
          <OrnamentalCorner corner="bottom-right" pattern="geometric" color="hsl(var(--accent))" size={120} />
          
          <div className="relative rounded-none overflow-hidden shadow-[var(--shadow-elegant)] border-4 border-accent/30">
            <div className="aspect-[16/9] relative">
              <img
                src={data.mainImage || weddingHeroSample}
                alt="Wedding Invitation"
                className="w-full h-full object-cover"
              />
              
              {/* Luxury Gradient Overlay */}
              <div className="absolute inset-0" style={{ background: 'var(--gradient-overlay)' }} />
              
              {/* Gold Sparkles */}
              <div className="absolute inset-0 pointer-events-none">
                <Sparkles className="absolute top-8 left-8 w-8 h-8 text-accent animate-pulse-slow" />
                <Sparkles className="absolute top-16 right-16 w-6 h-6 text-accent/80 animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
                <Sparkles className="absolute bottom-16 left-1/4 w-7 h-7 text-accent/70 animate-pulse-slow" style={{ animationDelay: '1s' }} />
                <Sparkles className="absolute bottom-24 right-1/3 w-9 h-9 text-accent animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
                <div className="space-y-6">
                  <Crown className="w-16 h-16 text-accent mx-auto mb-6" />
                  <h1 className="text-6xl md:text-7xl font-accent tracking-wider uppercase mb-4">
                    {data.title}
                  </h1>
                  <div className="w-48 h-0.5 bg-accent mx-auto" />
                  {formattedDate && (
                    <p className="text-2xl font-heading tracking-widest text-accent">{formattedDate}</p>
                  )}
                  <div className="w-48 h-0.5 bg-accent mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Invitation Text - Luxury Box */}
      {data.invitationText && (
        <AnimatedSection animation="fadeInScale" delay={100}>
          <section className="max-w-4xl mx-auto">
            <div className="relative bg-primary/95 backdrop-blur-sm p-16 shadow-[var(--shadow-elegant)] border-2 border-accent">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
              
              <OrnamentalCorner corner="top-left" pattern="geometric" color="hsl(var(--accent))" size={80} />
              <OrnamentalCorner corner="bottom-right" pattern="geometric" color="hsl(var(--accent))" size={80} />
              
              <div 
                className="relative text-xl font-heading text-primary-foreground leading-relaxed text-center"
                dangerouslySetInnerHTML={{ __html: data.invitationText }}
              />
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Gold Divider */}
      <div className="flex items-center justify-center gap-4 my-16">
        <div className="w-32 h-px bg-accent" />
        <Crown className="w-8 h-8 text-accent" />
        <div className="w-32 h-px bg-accent" />
      </div>

      {/* Couple Section - Luxurious Cards */}
      <AnimatedSection animation="fadeInUp" delay={200}>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Groom */}
          <div className="group hover-lift">
            <div className="relative bg-primary/95 p-8 border-2 border-accent/40 shadow-[var(--shadow-elegant)]">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
              
              {data.groomPhoto && (
                <div className="relative aspect-[3/4] overflow-hidden mb-6 border-2 border-accent/30">
                  <img
                    src={data.groomPhoto}
                    alt="Groom"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              
              <div className="relative text-center text-primary-foreground">
                <div className="w-16 h-px bg-accent mx-auto mb-4" />
                <h2 className="text-4xl font-accent mb-4 text-accent">{data.groomName}</h2>
                <div className="w-16 h-px bg-accent mx-auto mb-4" />
                {data.groomFamily && data.groomFamily.length > 0 && (
                  <div className="text-sm font-heading space-y-2 text-primary-foreground/80">
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
            <div className="relative bg-primary/95 p-8 border-2 border-accent/40 shadow-[var(--shadow-elegant)]">
              <div className="absolute inset-0 bg-gradient-to-bl from-accent/10 to-transparent" />
              
              {data.bridePhoto && (
                <div className="relative aspect-[3/4] overflow-hidden mb-6 border-2 border-accent/30">
                  <img
                    src={data.bridePhoto}
                    alt="Bride"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              
              <div className="relative text-center text-primary-foreground">
                <div className="w-16 h-px bg-accent mx-auto mb-4" />
                <h2 className="text-4xl font-accent mb-4 text-accent">{data.brideName}</h2>
                <div className="w-16 h-px bg-accent mx-auto mb-4" />
                {data.brideFamily && data.brideFamily.length > 0 && (
                  <div className="text-sm font-heading space-y-2 text-primary-foreground/80">
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

      {/* Gold Divider */}
      <div className="flex items-center justify-center gap-4 my-16">
        <div className="w-32 h-px bg-accent" />
        <Crown className="w-8 h-8 text-accent" />
        <div className="w-32 h-px bg-accent" />
      </div>

      {/* Koumbaroi Section - Opulent */}
      {data.koumbaroi && data.koumbaroi.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={250}>
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-5xl font-accent text-accent tracking-wider">Κουμπάροι</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {data.koumbaroi.map((koumbaros) => (
                <div key={koumbaros.id} className="group hover-lift">
                  <div className="relative bg-primary/95 p-6 border-2 border-accent/40 shadow-[var(--shadow-elegant)]">
                    {koumbaros.col2 && (
                      <div className="relative aspect-square overflow-hidden mb-4 border-2 border-accent/30">
                        <img
                          src={koumbaros.col2}
                          alt={koumbaros.col1}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <div className="relative text-center">
                      <div className="w-12 h-px bg-accent mx-auto mb-3" />
                      <h3 className="text-xl font-heading text-accent">{koumbaros.col1}</h3>
                      <div className="w-12 h-px bg-accent mx-auto mt-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Countdown Timer - Luxury */}
      {data.weddingDate && (
        <AnimatedSection animation="fadeInScale" delay={300}>
          <section className="max-w-3xl mx-auto space-y-6">
            <div className="bg-primary/95 p-12 shadow-[var(--shadow-elegant)] border-2 border-accent/40">
              <CountdownTimer targetDate={data.weddingDate} targetTime={data.weddingTime} />
            </div>
            <div className="flex justify-center">
              <AddToCalendar
                title={data.title}
                description={data.invitationText?.replace(/<[^>]*>/g, '') || ''}
                location={data.churchLocation || ''}
                startDate={new Date(`${data.weddingDate}T${data.weddingTime || '00:00'}`)}
                endDate={new Date(new Date(`${data.weddingDate}T${data.weddingTime || '00:00'}`).getTime() + 4 * 60 * 60 * 1000)}
              />
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Events Timeline - Opulent */}
      {events.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={400}>
          <section className="max-w-5xl mx-auto space-y-12">
            <div className="text-center">
              <Crown className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-5xl font-accent text-accent tracking-wider">Πρόγραμμα Εκδήλωσης</h2>
            </div>
            <div className="space-y-6">
              {events.map((event) => (
                <div key={event.id} className="hover-lift">
                  <div className="bg-background p-8 border-2 border-accent/20 shadow-[var(--shadow-card)]">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-14 h-14 border-2 border-accent bg-accent/10 flex items-center justify-center">
                        <Clock className="w-7 h-7 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-heading text-accent mb-3">{event.event_name}</h3>
                        {event.event_description && (
                          <p className="text-muted-foreground mb-4 font-body text-lg">{event.event_description}</p>
                        )}
                        <div className="flex flex-wrap gap-6 text-base font-heading">
                          {event.event_time && (
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-5 h-5" />
                              {event.event_time}
                            </span>
                          )}
                          {event.location_name && (
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-5 h-5" />
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

      {/* Locations - Luxury Style */}
      {(data.churchLocation || data.receptionLocation) && (
        <AnimatedSection animation="fadeInUp" delay={500}>
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-5xl font-accent text-accent tracking-wider">Τοποθεσίες</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.churchLocation && (
                <div className="hover-lift">
                  <div className="bg-background overflow-hidden border-2 border-accent/20 shadow-[var(--shadow-card)]">
                    <div className="p-8 space-y-4">
                      <h3 className="text-3xl font-heading text-accent flex items-center gap-3">
                        <MapPin className="w-6 h-6" />
                        Μυστήριο
                      </h3>
                      <p className="text-muted-foreground font-body text-lg">{data.churchLocation}</p>
                      {data.churchPosition && (
                        <>
                          <div className="border-2 border-accent/10 overflow-hidden">
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
                  <div className="bg-background overflow-hidden border-2 border-accent/20 shadow-[var(--shadow-card)]">
                    <div className="p-8 space-y-4">
                      <h3 className="text-3xl font-heading text-accent flex items-center gap-3">
                        <MapPin className="w-6 h-6" />
                        Δεξίωση
                      </h3>
                      <p className="text-muted-foreground font-body text-lg">{data.receptionLocation}</p>
                      {data.receptionPosition && (
                        <>
                          <div className="border-2 border-accent/10 overflow-hidden">
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

      {/* Bank Accounts - Luxury */}
      {data.bankAccounts && data.bankAccounts.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={550}>
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-5xl font-accent text-accent tracking-wider">Αριθμοί Κατάθεσης</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {data.bankAccounts.map((account) => (
                <div key={account.id} className="bg-primary/95 p-8 border-2 border-accent/30 shadow-[var(--shadow-card)] hover-lift">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <span className="font-heading text-xl text-accent">{account.col1}</span>
                    <span className="font-mono text-primary-foreground/80 text-lg">{account.col2}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* RSVP Section - Opulent */}
      <AnimatedSection animation="fadeInUp" delay={600}>
        <section className="max-w-3xl mx-auto">
          <div className="relative bg-primary/95 p-16 shadow-[var(--shadow-elegant)] border-2 border-accent/40">
            <OrnamentalCorner corner="top-left" pattern="geometric" color="hsl(var(--accent))" size={70} />
            <OrnamentalCorner corner="bottom-right" pattern="geometric" color="hsl(var(--accent))" size={70} />
            
            <div className="text-center mb-10">
              <Crown className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-5xl font-accent text-accent tracking-wider">Επιβεβαίωση Παρουσίας</h2>
            </div>
            <RSVPForm invitationId={invitation.id} invitationType="wedding" invitationTitle={data.title} />
          </div>
        </section>
      </AnimatedSection>

      {/* Contact Info - Luxury */}
      {data.contactInfo && (
        <AnimatedSection animation="fadeInUp" delay={650}>
          <section className="max-w-3xl mx-auto">
            <div className="bg-primary/95 p-12 shadow-[var(--shadow-elegant)] border-2 border-accent/40">
              <div className="text-center mb-8">
                <h2 className="text-5xl font-accent text-accent tracking-wider">Στοιχεία Επικοινωνίας</h2>
              </div>
              <div 
                className="text-center text-primary-foreground/90 font-heading prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: data.contactInfo }}
              />
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Gift Registry - Opulent */}
      {giftItems && giftItems.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={700}>
          <section className="space-y-12">
            <div className="text-center">
              <Crown className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-5xl font-accent text-accent tracking-wider">Λίστα Δώρων</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {giftItems.map((item) => (
                <div key={item.id} className="group hover-lift">
                  <div className="relative bg-primary/95 border-2 border-accent/40 shadow-[var(--shadow-elegant)] overflow-hidden h-full flex flex-col">
                    {item.image_url && (
                      <div className="aspect-square overflow-hidden relative">
                        <img 
                          src={item.image_url} 
                          alt={item.item_name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                      <h3 className="relative text-2xl font-heading text-accent mb-2">{item.item_name}</h3>
                      {item.item_description && (
                        <p className="relative text-primary-foreground/80 font-body text-sm mb-4">{item.item_description}</p>
                      )}
                      <div className="relative mt-auto space-y-3">
                        {item.price && (
                          <p className="text-2xl font-accent text-accent">{item.price}€</p>
                        )}
                        {item.store_url && (
                          <a 
                            href={item.store_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full text-center bg-accent text-primary py-3 px-4 font-heading hover:bg-accent/90 transition-colors"
                          >
                            {item.store_name || 'Κατάστημα'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Seating Arrangement - Luxury */}
      <AnimatedSection animation="fadeInUp" delay={750}>
        <SeatingDisplay invitationId={invitation.id} />
      </AnimatedSection>

      {/* Gallery - Luxury Grid */}
      {data.gallery && data.gallery.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={700}>
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-5xl font-accent text-accent tracking-wider">Φωτογραφίες</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {data.gallery.map((image) => (
                <div key={image.id} className="hover-zoom border-2 border-accent/20 overflow-hidden">
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
