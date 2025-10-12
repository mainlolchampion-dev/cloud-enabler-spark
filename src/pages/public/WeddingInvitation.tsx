import { useEffect, useState } from "react";
import { BaseInvitation } from "@/lib/invitationStorage";
import { getEvents } from "@/lib/eventsStorage";
import { getGiftItems } from "@/lib/giftRegistryStorage";
import { MapDisplay } from "@/components/wedding/MapDisplay";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Heart, Clock, ExternalLink, Gift } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import weddingHeroSample from "@/assets/wedding-hero-sample.jpg";

interface WeddingInvitationProps {
  invitation: BaseInvitation;
}

export default function WeddingInvitation({ invitation }: WeddingInvitationProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [giftItems, setGiftItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'map' | 'satellite'>('map');

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
  const formattedDate = data.weddingDate 
    ? format(new Date(data.weddingDate), "EEEE, d MMMM yyyy", { locale: el })
    : "";

  const addToCalendar = () => {
    const event = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${data.weddingDate.replace(/-/g, '')}T${data.weddingTime.replace(/:/g, '')}00`,
      `SUMMARY:Γάμος ${data.groomName} & ${data.brideName}`,
      `LOCATION:${data.churchLocation}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
    
    const blob = new Blob([event], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wedding.ics';
    link.click();
  };

  const openDirections = (position: [number, number]) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Premium & Elegant */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.mainImage || weddingHeroSample})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <div className="space-y-8 animate-fade-in">
            <p className="text-sm tracking-[0.4em] uppercase font-light">Πρόσκληση Γάμου</p>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light leading-tight">
              {data.groomName}
              <span className="block text-4xl md:text-6xl my-4">&</span>
              {data.brideName}
            </h1>
            {data.weddingDate && (
              <p className="text-xl md:text-2xl font-light tracking-wider capitalize opacity-90">
                {formattedDate}
              </p>
            )}
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Countdown Timer */}
      {data.weddingDate && (
        <section className="py-24 bg-gradient-to-b from-card to-background">
          <CountdownTimer targetDate={data.weddingDate} targetTime={data.weddingTime} />
        </section>
      )}

      {/* Invitation Text */}
      {data.invitationText && (
        <section className="max-w-3xl mx-auto px-6 py-32">
          <div 
            className="prose prose-lg max-w-none text-center [&>p]:text-foreground/70 [&>p]:leading-loose [&>p]:text-lg [&>p]:mb-8 [&>h1]:font-serif [&>h2]:font-serif [&>h3]:font-serif"
            dangerouslySetInnerHTML={{ __html: data.invitationText }}
          />
        </section>
      )}

      {/* Couple Section - Refined */}
      {(data.groomPhoto || data.bridePhoto) && (
        <section className="py-32 bg-muted/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-20">
              {data.groomPhoto && (
                <div className="space-y-8 text-center group">
                  <div className="relative w-80 h-80 mx-auto overflow-hidden rounded-full shadow-2xl">
                    <img 
                      src={data.groomPhoto} 
                      alt={data.groomName} 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <h2 className="font-serif text-5xl text-foreground">{data.groomName}</h2>
                </div>
              )}
              {data.bridePhoto && (
                <div className="space-y-8 text-center group">
                  <div className="relative w-80 h-80 mx-auto overflow-hidden rounded-full shadow-2xl">
                    <img 
                      src={data.bridePhoto} 
                      alt={data.brideName} 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <h2 className="font-serif text-5xl text-foreground">{data.brideName}</h2>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Wedding Details - Premium Card */}
      <section className="max-w-5xl mx-auto px-6 py-32">
        <div className="bg-card border border-border/50 rounded-2xl shadow-xl p-16 text-center space-y-10">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-5xl text-foreground">Λεπτομέρειες Γάμου</h2>
          <div className="h-px bg-border/50 w-32 mx-auto" />
          <p className="text-3xl capitalize text-muted-foreground font-light">{formattedDate}</p>
          <div className="flex items-center justify-center gap-3 text-2xl text-foreground/80">
            <Clock className="w-6 h-6" />
            <span className="font-light">{data.weddingTime}</span>
          </div>
          <Button onClick={addToCalendar} size="lg" className="mt-8 h-14 px-10 text-base">
            <Calendar className="w-5 h-5 mr-2" />
            Προσθήκη στο Ημερολόγιο
          </Button>
        </div>
      </section>

      {/* Church Location - Elegant Map Section */}
      {data.churchPosition && (
        <section className="max-w-7xl mx-auto px-6 py-32 bg-muted/20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-5xl text-foreground">Εκκλησία</h2>
            <p className="text-2xl text-muted-foreground font-light">{data.churchLocation}</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-center gap-3">
              <Button 
                variant={activeTab === 'map' ? 'default' : 'outline'}
                onClick={() => setActiveTab('map')}
                className="h-12 px-8"
              >
                Χάρτης
              </Button>
              <Button 
                variant={activeTab === 'satellite' ? 'default' : 'outline'}
                onClick={() => setActiveTab('satellite')}
                className="h-12 px-8"
              >
                Δορυφόρος
              </Button>
            </div>
            
            <div className="h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-border/50">
              <MapDisplay 
                position={data.churchPosition}
                locationName={data.churchLocation}
                mapType={activeTab}
              />
            </div>
            
            <div className="text-center">
              <Button onClick={() => openDirections(data.churchPosition)} size="lg" variant="outline" className="h-14 px-10">
                <MapPin className="w-5 h-5 mr-2" />
                Οδηγίες Πλοήγησης
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Reception */}
      {data.receptionLocation && data.receptionPosition && (
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-5xl text-foreground">Δεξίωση</h2>
            <p className="text-2xl text-muted-foreground font-light">{data.receptionLocation}</p>
          </div>
          
          <div className="h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-border/50">
            <MapDisplay 
              position={data.receptionPosition}
              locationName={data.receptionLocation}
            />
          </div>
          
          <div className="text-center mt-8">
            <Button onClick={() => openDirections(data.receptionPosition)} size="lg" variant="outline" className="h-14 px-10">
              <MapPin className="w-5 h-5 mr-2" />
              Οδηγίες Πλοήγησης
            </Button>
          </div>
        </section>
      )}

      {/* Events Timeline - Premium Design */}
      {events && events.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-32 bg-muted/20">
          <h2 className="font-serif text-5xl text-center mb-20 text-foreground">Πρόγραμμα Εκδήλωσης</h2>
          <div className="space-y-6">
            {events.map((event, idx) => (
              <div key={event.id} className="bg-card border border-border/50 rounded-xl shadow-lg p-10 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-8">
                  <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0 font-serif text-2xl">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-3xl font-serif text-foreground">{event.eventName}</h3>
                    {event.eventDescription && (
                      <p className="text-muted-foreground text-lg leading-relaxed">{event.eventDescription}</p>
                    )}
                    <div className="flex flex-wrap gap-6 text-base">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span>{format(new Date(event.eventDate), "d MMMM yyyy", { locale: el })}</span>
                      </div>
                      {event.eventTime && (
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Clock className="w-5 h-5 text-primary" />
                          <span>{event.eventTime}</span>
                        </div>
                      )}
                      {event.locationName && (
                        <div className="flex items-center gap-2 text-foreground/70">
                          <MapPin className="w-5 h-5 text-primary" />
                          <span>{event.locationName}</span>
                        </div>
                      )}
                    </div>
                    {event.locationLat && event.locationLng && (
                      <Button 
                        variant="outline" 
                        size="default"
                        className="mt-4"
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${event.locationLat},${event.locationLng}`, '_blank')}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Οδηγίες
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gift Registry - Elegant Cards */}
      {giftItems && giftItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-20 space-y-4">
            <Gift className="w-12 h-12 mx-auto text-primary" />
            <h2 className="font-serif text-5xl text-foreground">Λίστα Δώρων</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {giftItems.map((item) => (
              <div key={item.id} className="bg-card border border-border/50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
                {item.imageUrl && (
                  <div className="relative h-56 overflow-hidden bg-muted">
                    <img 
                      src={item.imageUrl} 
                      alt={item.itemName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-serif text-foreground">{item.itemName}</h3>
                  {item.itemDescription && (
                    <p className="text-muted-foreground leading-relaxed">{item.itemDescription}</p>
                  )}
                  {item.price && (
                    <p className="text-2xl font-semibold text-primary">{item.price}€</p>
                  )}
                  {item.storeUrl && (
                    <Button 
                      variant="outline" 
                      className="w-full h-12"
                      onClick={() => window.open(item.storeUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {item.storeName || 'Προβολή'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery - Premium Grid */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-32 bg-muted/20">
          <h2 className="font-serif text-5xl text-center mb-20 text-foreground">Φωτογραφίες</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.gallery.map((img: any) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-xl shadow-lg group">
                <img 
                  src={img.url} 
                  alt="" 
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP Section - Premium */}
      <section className="max-w-5xl mx-auto px-6 py-32">
        <div className="text-center mb-16 space-y-6">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-6xl text-foreground">Επιβεβαίωση Παρουσίας</h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            Θα χαρούμε πολύ να γιορτάσετε μαζί μας
          </p>
        </div>
        <RSVPForm invitationId={invitation.id} invitationType="wedding" invitationTitle={data.title} />
      </section>

      {/* Footer - Elegant */}
      <footer className="bg-card border-t border-border/50 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <Heart className="w-10 h-10 mx-auto text-primary/50" />
          <p className="font-serif text-4xl text-foreground/80">
            {data.groomName} & {data.brideName}
          </p>
        </div>
      </footer>
    </div>
  );
}