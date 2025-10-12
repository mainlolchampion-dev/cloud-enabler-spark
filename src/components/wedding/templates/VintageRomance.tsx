import { BaseInvitation } from "@/lib/invitationStorage";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Heart } from "lucide-react";
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

export function VintageRomance({ invitation, events, giftItems, onOpenDirections }: TemplateProps) {
  const data = invitation.data;
  const formattedDate = data.weddingDate 
    ? format(new Date(data.weddingDate), "EEEE, d MMMM yyyy", { locale: el })
    : "";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
      {/* Vintage Frame Border */}
      <div className="fixed inset-0 pointer-events-none border-[20px] border-primary/10 z-50" />
      
      {/* Hero Section - Vintage Postcard Style */}
      <AnimatedSection animation="fadeInUp">
        <section className="relative">
          <div className="relative bg-sepia rounded-lg overflow-hidden shadow-2xl border-8 border-background">
            <OrnamentalCorner corner="top-left" pattern="vintage" color="#d4a574" size={100} />
            <OrnamentalCorner corner="top-right" pattern="vintage" color="#d4a574" size={100} />
            <OrnamentalCorner corner="bottom-left" pattern="vintage" color="#d4a574" size={100} />
            <OrnamentalCorner corner="bottom-right" pattern="vintage" color="#d4a574" size={100} />
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image Side */}
              <div className="relative aspect-[3/4] md:aspect-auto">
                <img
                  src={data.mainImage || weddingHeroSample}
                  alt="Wedding Invitation"
                  className="w-full h-full object-cover sepia"
                  style={{ filter: 'sepia(0.3) brightness(1.1) contrast(0.9)' }}
                />
              </div>
              
              {/* Text Side - Vintage Typography */}
              <div className="flex flex-col justify-center p-12 bg-background/95">
                <div className="space-y-8 text-center">
                  <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto opacity-40">
                    <path d="M40,20 L45,35 L60,35 L48,45 L53,60 L40,50 L27,60 L32,45 L20,35 L35,35 Z" fill="#d4a574" />
                  </svg>
                  
                  <h1 className="text-5xl font-serif italic text-primary mb-4">{data.title}</h1>
                  
                  {formattedDate && (
                    <div className="space-y-2">
                      <div className="w-32 h-px bg-primary/30 mx-auto" />
                      <p className="text-xl font-serif text-muted-foreground">{formattedDate}</p>
                      <div className="w-32 h-px bg-primary/30 mx-auto" />
                    </div>
                  )}
                  
                  <Heart className="w-8 h-8 text-primary/60 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Invitation Text - Vintage Paper */}
      {data.invitationText && (
        <AnimatedSection animation="fadeInScale" delay={100}>
          <section className="relative max-w-3xl mx-auto">
            <div className="relative bg-background/90 backdrop-blur-sm rounded-lg p-12 shadow-xl border-4 border-primary/20"
                 style={{ 
                   backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'paper\' width=\'100\' height=\'100\' patternUnits=\'userSpaceOnUse\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23faf8f5\'/%3E%3Cpath d=\'M0 0L100 100M100 0L0 100\' stroke=\'%23e8e4dc\' stroke-width=\'0.5\' opacity=\'0.2\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100\' height=\'100\' fill=\'url(%23paper)\'/%3E%3C/svg%3E")',
                   backgroundSize: '100px 100px'
                 }}>
              <OrnamentalCorner corner="top-left" pattern="vintage" color="#d4a574" size={60} />
              <OrnamentalCorner corner="bottom-right" pattern="vintage" color="#d4a574" size={60} />
              
              <div 
                className="text-lg font-serif text-foreground/90 leading-relaxed text-center italic"
                dangerouslySetInnerHTML={{ __html: data.invitationText }}
              />
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Decorative Vintage Divider */}
      <div className="flex items-center justify-center gap-4 my-16">
        <div className="w-24 h-px bg-primary/30" />
        <svg width="40" height="40" viewBox="0 0 40 40" className="opacity-40">
          <circle cx="20" cy="20" r="15" stroke="#d4a574" strokeWidth="2" fill="none" />
          <path d="M20,10 L22,15 L27,15 L23,19 L25,24 L20,20 L15,24 L17,19 L13,15 L18,15 Z" fill="#d4a574" />
        </svg>
        <div className="w-24 h-px bg-primary/30" />
      </div>

      {/* Couple Section - Vintage Portraits */}
      <AnimatedSection animation="fadeInUp" delay={200}>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Groom */}
          <div className="text-center space-y-6 hover-lift">
            {data.groomPhoto && (
              <div className="relative inline-block">
                <div className="absolute -inset-4 border-4 border-primary/20 rounded-full" />
                <img
                  src={data.groomPhoto}
                  alt="Groom"
                  className="relative rounded-full w-64 h-64 object-cover mx-auto shadow-xl border-8 border-background"
                  style={{ filter: 'sepia(0.2) brightness(1.1)' }}
                />
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-4 border-background">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <h2 className="text-4xl font-serif italic text-primary">{data.groomName}</h2>
              {data.groomFamily && data.groomFamily.length > 0 && (
                <div className="text-sm text-muted-foreground font-serif space-y-1">
                  {data.groomFamily.map((member, idx) => (
                    <p key={idx}>{member}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bride */}
          <div className="text-center space-y-6 hover-lift">
            {data.bridePhoto && (
              <div className="relative inline-block">
                <div className="absolute -inset-4 border-4 border-primary/20 rounded-full" />
                <img
                  src={data.bridePhoto}
                  alt="Bride"
                  className="relative rounded-full w-64 h-64 object-cover mx-auto shadow-xl border-8 border-background"
                  style={{ filter: 'sepia(0.2) brightness(1.1)' }}
                />
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-4 border-background">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <h2 className="text-4xl font-serif italic text-primary">{data.brideName}</h2>
              {data.brideFamily && data.brideFamily.length > 0 && (
                <div className="text-sm text-muted-foreground font-serif space-y-1">
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
          <section className="space-y-12">
            <h2 className="text-4xl font-serif italic text-primary text-center">Κουμπάροι</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {data.koumbaroi.map((koumbaros) => (
                <div key={koumbaros.id} className="text-center space-y-4 hover-lift">
                  {koumbaros.col2 && (
                    <div className="relative inline-block">
                      <div className="absolute -inset-3 border-3 border-primary/20 rounded-full" />
                      <img
                        src={koumbaros.col2}
                        alt={koumbaros.col1}
                        className="relative rounded-full w-48 h-48 object-cover mx-auto shadow-xl border-6 border-background"
                        style={{ filter: 'sepia(0.2) brightness(1.1)' }}
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-serif italic text-primary">{koumbaros.col1}</h3>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Countdown Timer - Vintage Clock */}
      {data.weddingDate && (
        <AnimatedSection animation="fadeInScale" delay={300}>
          <section className="max-w-2xl mx-auto space-y-6">
            <div className="bg-background/90 rounded-lg p-10 shadow-xl border-4 border-primary/20">
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

      {/* Events Timeline - Vintage List */}
      {events.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={400}>
          <section className="space-y-12">
            <h2 className="text-4xl font-serif italic text-primary text-center">Πρόγραμμα Εκδήλωσης</h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              {events.map((event, index) => (
                <div key={event.id} className="hover-lift">
                  <div className="bg-background/90 rounded-lg p-8 shadow-lg border-2 border-primary/20">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full border-4 border-primary/20 bg-primary/5 flex items-center justify-center">
                        <Clock className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-serif italic text-primary mb-2">{event.event_name}</h3>
                        {event.event_description && (
                          <p className="text-muted-foreground mb-4 font-serif">{event.event_description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm font-serif">
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

      {/* Locations - Vintage Cards */}
      {(data.churchLocation || data.receptionLocation) && (
        <AnimatedSection animation="fadeInUp" delay={500}>
          <section className="space-y-12">
            <h2 className="text-4xl font-serif italic text-primary text-center">Τοποθεσίες</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.churchLocation && (
                <div className="hover-lift">
                  <div className="bg-background/90 rounded-lg overflow-hidden shadow-xl border-4 border-primary/20">
                    <div className="p-8 space-y-4">
                      <h3 className="text-2xl font-serif italic text-primary flex items-center gap-3">
                        <MapPin className="w-6 h-6" />
                        Μυστήριο
                      </h3>
                      <p className="text-muted-foreground font-serif">{data.churchLocation}</p>
                      {data.churchPosition && (
                        <>
                          <div className="rounded overflow-hidden border-2 border-primary/10">
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
                  <div className="bg-background/90 rounded-lg overflow-hidden shadow-xl border-4 border-primary/20">
                    <div className="p-8 space-y-4">
                      <h3 className="text-2xl font-serif italic text-primary flex items-center gap-3">
                        <MapPin className="w-6 h-6" />
                        Δεξίωση
                      </h3>
                      <p className="text-muted-foreground font-serif">{data.receptionLocation}</p>
                      {data.receptionPosition && (
                        <>
                          <div className="rounded overflow-hidden border-2 border-primary/10">
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

      {/* Bank Accounts */}
      {data.bankAccounts && data.bankAccounts.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={550}>
          <section className="space-y-12">
            <h2 className="text-4xl font-serif italic text-primary text-center">Αριθμοί Κατάθεσης</h2>
            <div className="max-w-2xl mx-auto space-y-4">
              {data.bankAccounts.map((account) => (
                <div key={account.id} className="bg-background/90 rounded-lg p-8 shadow-lg border-2 border-primary/20 hover-lift">
                  <div className="flex items-center justify-between gap-4 flex-wrap font-serif">
                    <span className="font-semibold text-xl text-primary">{account.col1}</span>
                    <span className="font-mono text-muted-foreground text-lg">{account.col2}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* RSVP Section - Vintage Form */}
      <AnimatedSection animation="fadeInUp" delay={600}>
        <section className="max-w-2xl mx-auto">
          <div className="relative bg-background/90 rounded-lg p-12 shadow-xl border-4 border-primary/20">
            <OrnamentalCorner corner="top-left" pattern="vintage" color="#d4a574" size={70} />
            <OrnamentalCorner corner="bottom-right" pattern="vintage" color="#d4a574" size={70} />
            
            <h2 className="text-4xl font-serif italic text-primary text-center mb-10">Επιβεβαίωση Παρουσίας</h2>
            <RSVPForm invitationId={invitation.id} invitationType="wedding" invitationTitle={data.title} />
          </div>
        </section>
      </AnimatedSection>

      {/* Contact Info */}
      {data.contactInfo && (
        <AnimatedSection animation="fadeInUp" delay={650}>
          <section className="max-w-2xl mx-auto">
            <div className="bg-background/90 rounded-lg p-10 shadow-xl border-4 border-primary/20">
              <h2 className="text-4xl font-serif italic text-primary text-center mb-8">Στοιχεία Επικοινωνίας</h2>
              <div 
                className="text-center text-muted-foreground font-serif prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: data.contactInfo }}
              />
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Gift Registry - Vintage Cards */}
      {giftItems && giftItems.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={700}>
          <section className="space-y-12">
            <h2 className="text-4xl font-serif italic text-primary text-center">Λίστα Δώρων</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {giftItems.map((item) => (
                <div key={item.id} className="hover-lift">
                  <div className="bg-background/90 rounded-lg overflow-hidden shadow-xl border-4 border-primary/20 h-full flex flex-col">
                    {item.image_url && (
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={item.image_url} 
                          alt={item.item_name} 
                          className="w-full h-full object-cover"
                          style={{ filter: 'sepia(0.2) brightness(1.1)' }}
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl font-serif italic text-primary mb-2">{item.item_name}</h3>
                      {item.item_description && (
                        <p className="text-muted-foreground font-serif text-sm mb-4">{item.item_description}</p>
                      )}
                      <div className="mt-auto space-y-3">
                        {item.price && (
                          <p className="text-xl font-serif text-primary">{item.price}€</p>
                        )}
                        {item.store_url && (
                          <a 
                            href={item.store_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full text-center bg-primary/90 text-primary-foreground py-3 px-4 font-serif hover:bg-primary transition-colors"
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

      {/* Seating Arrangement - Vintage */}
      <AnimatedSection animation="fadeInUp" delay={750}>
        <SeatingDisplay invitationId={invitation.id} />
      </AnimatedSection>

      {/* Gallery - Vintage Photo Album */}
      {data.gallery && data.gallery.length > 0 && (
        <AnimatedSection animation="fadeInUp" delay={700}>
          <section className="space-y-12">
            <h2 className="text-4xl font-serif italic text-primary text-center">Φωτογραφίες</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {data.gallery.map((image) => (
                <div key={image.id} className="hover-zoom">
                  <div className="bg-background p-4 rounded-lg shadow-lg border-2 border-primary/20">
                    <img 
                      src={image.url} 
                      alt="Gallery" 
                      className="w-full aspect-square object-cover rounded"
                      style={{ filter: 'sepia(0.2) brightness(1.1)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Closing Message */}
      <AnimatedSection animation="fadeInScale" delay={800}>
        <section className="text-center py-12">
          <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto mb-6 opacity-40">
            <path d="M30,15 Q20,10 15,20 Q10,30 20,40 L30,50 L40,40 Q50,30 45,20 Q40,10 30,15" fill="#d4a574" />
          </svg>
          <p className="text-2xl font-serif italic text-primary">Με αγάπη και χαρά, σας περιμένουμε!</p>
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
