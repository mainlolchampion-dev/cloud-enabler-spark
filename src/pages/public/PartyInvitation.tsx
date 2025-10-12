import { useEffect, useState } from "react";
import { BaseInvitation } from "@/lib/invitationStorage";
import { getEvents } from "@/lib/eventsStorage";
import { getGiftItems } from "@/lib/giftRegistryStorage";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, PartyPopper, Clock, ExternalLink, Gift } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import partyHeroSample from "@/assets/party-hero-sample.jpg";
import "leaflet/dist/leaflet.css";

interface PartyInvitationProps {
  invitation: BaseInvitation;
}

export default function PartyInvitation({ invitation }: PartyInvitationProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [giftItems, setGiftItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const eventsData = await getEvents(invitation.id);
      setEvents(eventsData);
      
      const giftsData = await getGiftItems(invitation.id);
      setGiftItems(giftsData);
      
      document.title = invitation.title;
    };
    
    fetchData();
  }, [invitation.id, invitation.title]);

  const data = invitation.data;
  const formattedDate = data.partyDate 
    ? format(new Date(data.partyDate), "EEEE, d MMMM yyyy", { locale: el })
    : "";

  const addToCalendar = () => {
    const event = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${data.partyDate.replace(/-/g, '')}T${data.partyTime.replace(/:/g, '')}00`,
      `SUMMARY:${data.title}`,
      `LOCATION:${data.venueLocation}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
    
    const blob = new Blob([event], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'party.ics';
    link.click();
  };

  const openDirections = (position: [number, number]) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Premium & Energetic */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.mainImage || partyHeroSample})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <div className="space-y-10 animate-fade-in">
            <PartyPopper className="w-20 h-20 mx-auto opacity-95" />
            <h1 className="font-serif text-7xl md:text-9xl lg:text-[10rem] font-light leading-tight">
              {data.title}
            </h1>
            {data.occasion && (
              <p className="text-3xl md:text-4xl font-light opacity-90">{data.occasion}</p>
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
      {data.partyDate && (
        <section className="py-24 bg-gradient-to-b from-card to-background">
          <CountdownTimer targetDate={data.partyDate} targetTime={data.partyTime} />
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

      {/* Hosts - Refined Grid */}
      {data.hosts && data.hosts.length > 0 && (
        <section className="py-32 bg-muted/20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-serif text-6xl text-center mb-20 text-foreground">Οργανωτές</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {data.hosts.map((host: any, idx: number) => (
                <div key={idx} className="text-center space-y-6 group">
                  {host.col2 && (
                    <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden shadow-xl">
                      <img 
                        src={host.col2} 
                        alt={host.col1} 
                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  )}
                  <p className="font-semibold text-xl text-foreground">{host.col1}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Date & Time - Premium Card */}
      <section className="max-w-5xl mx-auto px-6 py-32">
        <div className="bg-card border border-border/50 rounded-2xl shadow-xl p-16 text-center space-y-10">
          <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-serif text-5xl text-foreground">Πότε;</h2>
          <div className="h-px bg-border/50 w-32 mx-auto" />
          <p className="text-3xl capitalize text-muted-foreground font-light">{formattedDate}</p>
          <div className="flex items-center justify-center gap-3 text-2xl text-foreground/80">
            <Clock className="w-6 h-6" />
            <span className="font-light">{data.partyTime}</span>
          </div>
          <Button onClick={addToCalendar} size="lg" className="mt-8 h-14 px-10 text-base">
            <Calendar className="w-5 h-5 mr-2" />
            Προσθήκη στο Ημερολόγιο
          </Button>
        </div>
      </section>

      {/* Location - Elegant Map Section */}
      {data.venuePosition && (
        <section className="max-w-7xl mx-auto px-6 py-32 bg-muted/20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-5xl text-foreground">Που;</h2>
            <p className="text-2xl text-muted-foreground font-light">{data.venueLocation}</p>
          </div>
          
          <div className="h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-border/50">
            <MapContainer
              key="venue-map"
              center={data.venuePosition}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={data.venuePosition}>
                <Popup>{data.venueLocation}</Popup>
              </Marker>
            </MapContainer>
          </div>
          
          <div className="text-center mt-8">
            <Button onClick={() => openDirections(data.venuePosition)} size="lg" variant="outline" className="h-14 px-10">
              <MapPin className="w-5 h-5 mr-2" />
              Οδηγίες Πλοήγησης
            </Button>
          </div>
        </section>
      )}

      {/* Events Timeline - Premium Design */}
      {events && events.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-32">
          <h2 className="font-serif text-5xl text-center mb-20 text-foreground">Πρόγραμμα</h2>
          <div className="space-y-6">
            {events.map((event, idx) => (
              <div key={event.id} className="bg-card border border-border/50 rounded-xl shadow-lg p-10 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-8">
                  <div className="bg-accent/10 text-accent rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0 font-serif text-2xl">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-3xl font-serif text-foreground">{event.eventName}</h3>
                    {event.eventDescription && (
                      <p className="text-muted-foreground text-lg leading-relaxed">{event.eventDescription}</p>
                    )}
                    <div className="flex flex-wrap gap-6 text-base">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Calendar className="w-5 h-5 text-accent" />
                        <span>{format(new Date(event.eventDate), "d MMMM yyyy", { locale: el })}</span>
                      </div>
                      {event.eventTime && (
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Clock className="w-5 h-5 text-accent" />
                          <span>{event.eventTime}</span>
                        </div>
                      )}
                      {event.locationName && (
                        <div className="flex items-center gap-2 text-foreground/70">
                          <MapPin className="w-5 h-5 text-accent" />
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
        <section className="max-w-7xl mx-auto px-6 py-32 bg-muted/20">
          <div className="text-center mb-20 space-y-4">
            <Gift className="w-12 h-12 mx-auto text-accent" />
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
                    <p className="text-2xl font-semibold text-accent">{item.price}€</p>
                  )}
                  {item.storeUrl && (
                    <Button 
                      variant="outline" 
                      className="w-full h-12"
                      onClick={() => window.open(item.storeUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Δες στο {item.storeName || 'Κατάστημα'}
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
        <section className="max-w-7xl mx-auto px-6 py-32">
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
      <section className="max-w-5xl mx-auto px-6 py-32 bg-muted/20">
        <div className="text-center mb-16 space-y-6">
          <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
            <PartyPopper className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-serif text-6xl text-foreground">Επιβεβαίωση Παρουσίας</h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            Πες μας αν έρχεσαι!
          </p>
        </div>
        <RSVPForm invitationId={invitation.id} invitationType="party" invitationTitle={data.title} />
      </section>

      {/* Footer - Elegant */}
      <footer className="bg-card border-t border-border/50 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <PartyPopper className="w-10 h-10 mx-auto text-accent/50" />
          <p className="font-serif text-4xl text-foreground/80">{data.title}</p>
        </div>
      </footer>
    </div>
  );
}