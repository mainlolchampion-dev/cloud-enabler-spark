import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInvitation } from "@/lib/invitationStorage";
import { getEvents } from "@/lib/eventsStorage";
import { getGiftItems } from "@/lib/giftRegistryStorage";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Heart, Clock, ExternalLink, Gift } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import weddingHeroSample from "@/assets/wedding-hero-sample.jpg";
import "leaflet/dist/leaflet.css";

export default function WeddingInvitation() {
  const { id } = useParams();
  const [invitation, setInvitation] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [giftItems, setGiftItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'map' | 'satellite'>('map');

  useEffect(() => {
    const fetchInvitation = async () => {
      if (id) {
        const data = await getInvitation(id);
        if (data && data.type === 'wedding') {
          setInvitation(data);
          
          const [eventsData, giftsData] = await Promise.all([
            getEvents(id),
            getGiftItems(id)
          ]);
          setEvents(eventsData);
          setGiftItems(giftsData.filter(item => !item.purchased));
          
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
          <Heart className="w-16 h-16 mx-auto text-muted-foreground" />
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
      {/* Hero Section - Clean & Elegant */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.mainImage || weddingHeroSample})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-sm tracking-[0.3em] uppercase mb-6 font-sans">Πρόσκληση Γάμου</p>
          <h1 className="font-script text-7xl md:text-8xl mb-8 font-light">
            {data.groomName} & {data.brideName}
          </h1>
          {data.weddingDate && (
            <p className="text-xl md:text-2xl font-light tracking-wide capitalize">
              {formattedDate}
            </p>
          )}
        </div>
      </section>

      {/* Countdown Timer */}
      {data.weddingDate && (
        <section className="py-20 bg-card">
          <CountdownTimer targetDate={data.weddingDate} targetTime={data.weddingTime} />
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

      {/* Couple Names - Big & Beautiful */}
      <section className="py-32 text-center bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {data.groomPhoto && (
              <div className="space-y-4">
                <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden shadow-xl">
                  <img src={data.groomPhoto} alt={data.groomName} className="w-full h-full object-cover" />
                </div>
                <h2 className="font-script text-5xl">{data.groomName}</h2>
              </div>
            )}
            {data.bridePhoto && (
              <div className="space-y-4">
                <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden shadow-xl">
                  <img src={data.bridePhoto} alt={data.brideName} className="w-full h-full object-cover" />
                </div>
                <h2 className="font-script text-5xl">{data.brideName}</h2>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Wedding Details */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="bg-card rounded-lg shadow-lg p-12 text-center space-y-8">
          <Heart className="w-12 h-12 mx-auto text-primary" />
          <h2 className="font-serif text-4xl">Λεπτομέρειες Γάμου</h2>
          <p className="text-2xl capitalize text-muted-foreground">{formattedDate}</p>
          <div className="flex items-center justify-center gap-2 text-xl">
            <Clock className="w-5 h-5" />
            <span>{data.weddingTime}</span>
          </div>
          <Button onClick={addToCalendar} size="lg" className="mt-4">
            <Calendar className="w-4 h-4 mr-2" />
            Προσθήκη στο Ημερολόγιο
          </Button>
        </div>
      </section>

      {/* Church Location */}
      {data.churchPosition && (
        <section className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="font-serif text-4xl text-center mb-12">Εκκλησία</h2>
          <p className="text-xl text-center mb-8 text-muted-foreground">{data.churchLocation}</p>
          
          <div className="space-y-4">
            <div className="flex justify-center gap-2 mb-4">
              <Button 
                variant={activeTab === 'map' ? 'default' : 'outline'}
                onClick={() => setActiveTab('map')}
              >
                Χάρτης
              </Button>
              <Button 
                variant={activeTab === 'satellite' ? 'default' : 'outline'}
                onClick={() => setActiveTab('satellite')}
              >
                Δορυφόρος
              </Button>
            </div>
            
            <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
              <MapContainer
                center={data.churchPosition}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url={activeTab === 'map' 
                    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  }
                />
                <Marker position={data.churchPosition}>
                  <Popup>{data.churchLocation}</Popup>
                </Marker>
              </MapContainer>
            </div>
            
            <div className="text-center">
              <Button onClick={() => openDirections(data.churchPosition)} size="lg">
                <MapPin className="w-4 h-4 mr-2" />
                Οδηγίες Πλοήγησης
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Reception */}
      {data.receptionLocation && data.receptionPosition && (
        <section className="max-w-6xl mx-auto px-6 py-24 bg-muted/30">
          <h2 className="font-serif text-4xl text-center mb-12">Δεξίωση</h2>
          <p className="text-xl text-center mb-8 text-muted-foreground">{data.receptionLocation}</p>
          
          <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
            <MapContainer
              center={data.receptionPosition}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={data.receptionPosition}>
                <Popup>{data.receptionLocation}</Popup>
              </Marker>
            </MapContainer>
          </div>
          
          <div className="text-center mt-6">
            <Button onClick={() => openDirections(data.receptionPosition)} size="lg">
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
              <div key={event.id} className="bg-card rounded-lg shadow-md p-8 border-l-4 border-primary">
                <div className="flex items-start gap-6">
                  <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-serif text-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif mb-3">{event.eventName}</h3>
                    {event.eventDescription && (
                      <p className="text-muted-foreground mb-4">{event.eventDescription}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{format(new Date(event.eventDate), "d MMMM yyyy", { locale: el })}</span>
                      </div>
                      {event.eventTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{event.eventTime}</span>
                        </div>
                      )}
                      {event.locationName && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
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
                    <p className="text-lg font-semibold text-primary">{item.price}€</p>
                  )}
                  {item.storeUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
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
          <Heart className="w-12 h-12 mx-auto text-primary mb-4" />
          <h2 className="font-serif text-5xl mb-4">Επιβεβαίωση Παρουσίας</h2>
          <p className="text-lg text-muted-foreground">
            Θα χαρούμε πολύ να γιορτάσετε μαζί μας
          </p>
        </div>
        <RSVPForm invitationId={id!} invitationType="wedding" invitationTitle={data.title} />
      </section>

      {/* Footer */}
      <footer className="bg-card py-12 border-t">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Heart className="w-8 h-8 mx-auto text-primary mb-2" />
          <p className="text-muted-foreground font-script text-2xl">
            {data.groomName} & {data.brideName}
          </p>
        </div>
      </footer>
    </div>
  );
}
