import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInvitation } from "@/lib/invitationStorage";
import { getEvents } from "@/lib/eventsStorage";
import { getGiftItems } from "@/lib/giftRegistryStorage";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, PartyPopper, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import partyHeroSample from "@/assets/party-hero-sample.jpg";
import "leaflet/dist/leaflet.css";

export default function PartyInvitation() {
  const { id } = useParams();
  const [invitation, setInvitation] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [giftItems, setGiftItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (id) {
        const data = await getInvitation(id);
        if (data && data.type === 'party') {
          setInvitation(data);
          
          const eventsData = await getEvents(id);
          setEvents(eventsData);
          
          const giftsData = await getGiftItems(id);
          setGiftItems(giftsData);
          
          document.title = data.title;
        }
      }
    };
    
    fetchInvitation();
  }, [id]);

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-6 max-w-md">
          <PartyPopper className="w-16 h-16 mx-auto text-muted-foreground" />
          <h1 className="font-serif text-4xl text-foreground">Η πρόσκληση δεν βρέθηκε</h1>
          <p className="text-muted-foreground">
            Αυτή η πρόσκληση δεν υπάρχει ή έχει διαγραφεί.
          </p>
          <Button onClick={() => window.location.href = '/'} size="lg">
            Επιστροφή στην Αρχική
          </Button>
        </div>
      </div>
    );
  }

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
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.mainImage || partyHeroSample})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <PartyPopper className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="font-script text-7xl md:text-9xl mb-8 font-light">
            {data.title}
          </h1>
          {data.occasion && (
            <p className="text-2xl md:text-3xl font-light">{data.occasion}</p>
          )}
        </div>
      </section>

      {/* Countdown Timer */}
      {data.partyDate && (
        <section className="py-20 bg-card">
          <CountdownTimer targetDate={data.partyDate} targetTime={data.partyTime} />
        </section>
      )}

      {/* Invitation Text */}
      {data.invitationText && (
        <section className="max-w-3xl mx-auto px-6 py-24">
          <div 
            className="prose prose-lg max-w-none text-center [&>p]:text-foreground/80 [&>p]:leading-relaxed [&>p]:mb-6 [&>h1]:font-serif [&>h2]:font-serif [&>h3]:font-serif"
            dangerouslySetInnerHTML={{ __html: data.invitationText }}
          />
        </section>
      )}

      {/* Hosts */}
      {data.hosts && data.hosts.length > 0 && (
        <section className="py-32 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-serif text-5xl text-center mb-16">Οργανωτές</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {data.hosts.map((host: any, idx: number) => (
                <div key={idx} className="text-center space-y-4">
                  {host.col2 && (
                    <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden shadow-lg">
                      <img src={host.col2} alt={host.col1} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="font-semibold text-lg">{host.col1}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Date & Time */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="bg-card rounded-lg shadow-lg p-12 text-center space-y-8">
          <Calendar className="w-12 h-12 mx-auto text-primary" />
          <h2 className="font-serif text-4xl">Πότε;</h2>
          <p className="text-2xl capitalize text-muted-foreground">{formattedDate}</p>
          <div className="flex items-center justify-center gap-2 text-xl">
            <Clock className="w-5 h-5" />
            <span>{data.partyTime}</span>
          </div>
          <Button onClick={addToCalendar} size="lg" className="mt-4">
            <Calendar className="w-4 h-4 mr-2" />
            Προσθήκη στο Ημερολόγιο
          </Button>
        </div>
      </section>

      {/* Location */}
      {data.venuePosition && (
        <section className="max-w-6xl mx-auto px-6 py-24 bg-muted/30">
          <h2 className="font-serif text-4xl text-center mb-12">Που;</h2>
          <p className="text-xl text-center mb-8 text-muted-foreground">{data.venueLocation}</p>
          
          <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
            <MapContainer
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
          
          <div className="text-center mt-6">
            <Button onClick={() => openDirections(data.venuePosition)} size="lg">
              <MapPin className="w-4 h-4 mr-2" />
              Οδηγίες Πλοήγησης
            </Button>
          </div>
        </section>
      )}

      {/* Events Timeline */}
      {events && events.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-24">
          <h2 className="font-serif text-4xl text-center mb-16">Πρόγραμμα</h2>
          <div className="space-y-8">
            {events.map((event, idx) => (
              <div key={event.id} className="bg-card rounded-lg shadow-md p-8 border-l-4 border-accent">
                <div className="flex items-start gap-6">
                  <div className="bg-accent text-accent-foreground rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-serif text-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif mb-3">{event.eventName}</h3>
                    {event.eventDescription && (
                      <p className="text-muted-foreground mb-4">{event.eventDescription}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span>{format(new Date(event.eventDate), "d MMMM yyyy", { locale: el })}</span>
                      </div>
                      {event.eventTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-accent" />
                          <span>{event.eventTime}</span>
                        </div>
                      )}
                      {event.locationName && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span>{event.locationName}</span>
                        </div>
                      )}
                    </div>
                    {event.locationLat && event.locationLng && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${event.locationLat},${event.locationLng}`, '_blank')}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
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

      {/* Gift Registry */}
      {giftItems && giftItems.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-24 bg-muted/30">
          <h2 className="font-serif text-4xl text-center mb-16">Λίστα Δώρων</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {giftItems.map((item) => (
              <div key={item.id} className="bg-card rounded-lg shadow-md overflow-hidden">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.itemName} className="w-full h-48 object-cover" />
                )}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-serif">{item.itemName}</h3>
                  {item.itemDescription && (
                    <p className="text-sm text-muted-foreground">{item.itemDescription}</p>
                  )}
                  {item.price && (
                    <p className="text-lg font-semibold text-accent">{item.price}€</p>
                  )}
                  {item.storeUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
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

      {/* Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="font-serif text-4xl text-center mb-16">Φωτογραφίες</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.gallery.map((img: any) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-lg shadow-md">
                <img 
                  src={img.url} 
                  alt="" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 bg-muted/30">
        <div className="text-center mb-12">
          <PartyPopper className="w-12 h-12 mx-auto text-primary mb-4" />
          <h2 className="font-serif text-5xl mb-4">Επιβεβαίωση Παρουσίας</h2>
          <p className="text-lg text-muted-foreground">
            Πες μας αν έρχεσαι!
          </p>
        </div>
        <RSVPForm invitationId={id!} invitationType="party" invitationTitle={data.title} />
      </section>

      {/* Footer */}
      <footer className="bg-card py-12 border-t">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <PartyPopper className="w-8 h-8 mx-auto text-primary mb-2" />
          <p className="text-muted-foreground font-script text-2xl">{data.title}</p>
        </div>
      </footer>
    </div>
  );
}
