import { useEffect, useState } from "react";
import { BaseInvitation } from "@/lib/invitationStorage";
import { getEvents } from "@/lib/eventsStorage";
import { getGiftItems } from "@/lib/giftRegistryStorage";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Sparkles, Clock, ExternalLink, Gift } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import baptismHeroSample from "@/assets/baptism-hero-sample.jpg";
import "leaflet/dist/leaflet.css";

interface BaptismInvitationProps {
  invitation: BaseInvitation;
}

export default function BaptismInvitation({ invitation }: BaptismInvitationProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'satellite'>('map');
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
  const formattedDate = data.baptismDate 
    ? format(new Date(data.baptismDate), "EEEE, d MMMM yyyy", { locale: el })
    : "";

  const addToCalendar = () => {
    const event = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${data.baptismDate.replace(/-/g, '')}T${data.baptismTime.replace(/:/g, '')}00`,
      `SUMMARY:Βάπτιση ${data.childName}`,
      `LOCATION:${data.churchLocation}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
    
    const blob = new Blob([event], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'baptism.ics';
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
          style={{ backgroundImage: `url(${data.mainImage || baptismHeroSample})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <div className="space-y-8 animate-fade-in">
            <Sparkles className="w-16 h-16 mx-auto opacity-90" />
            <p className="text-sm tracking-[0.4em] uppercase font-light">Πρόσκληση Βάπτισης</p>
            <h1 className="font-serif text-7xl md:text-9xl font-light leading-tight">
              Η Βάπτιση
            </h1>
            {data.childName && (
              <p className="text-4xl md:text-5xl font-serif opacity-95">{data.childName}</p>
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
      {data.baptismDate && (
        <section className="py-24 bg-gradient-to-b from-card to-background">
          <CountdownTimer targetDate={data.baptismDate} targetTime={data.baptismTime} />
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

      {/* Child Details - Refined */}
      {data.childName && (
        <section className="py-32 bg-muted/20">
          <div className="max-w-5xl mx-auto px-6 text-center space-y-10">
            {data.childPhoto && (
              <div className="relative w-80 h-80 mx-auto overflow-hidden rounded-full shadow-2xl group">
                <img 
                  src={data.childPhoto} 
                  alt={data.childName} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
            )}
            <h2 className="font-serif text-6xl text-foreground">{data.childName}</h2>
          </div>
        </section>
      )}

      {/* Godparents - Elegant Grid */}
      {data.godparents && data.godparents.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-32">
          <h2 className="font-serif text-5xl text-center mb-20 text-foreground">Ανάδοχοι</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {data.godparents.map((godparent: any, idx: number) => (
              <div key={idx} className="text-center space-y-6 group">
                {godparent.col2 && (
                  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden shadow-xl">
                    <img 
                      src={godparent.col2} 
                      alt={godparent.col1} 
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                )}
                <p className="font-medium text-lg text-foreground">{godparent.col1}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Date & Time - Premium Card */}
      <section className="max-w-5xl mx-auto px-6 py-32 bg-muted/20">
        <div className="bg-card border border-border/50 rounded-2xl shadow-xl p-16 text-center space-y-10">
          <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="font-serif text-5xl text-foreground">Ημερομηνία & Ώρα</h2>
          <div className="h-px bg-border/50 w-32 mx-auto" />
          <p className="text-3xl capitalize text-muted-foreground font-light">{formattedDate}</p>
          <div className="flex items-center justify-center gap-3 text-2xl text-foreground/80">
            <Clock className="w-6 h-6" />
            <span className="font-light">{data.baptismTime}</span>
          </div>
          <Button onClick={addToCalendar} size="lg" className="mt-8 h-14 px-10 text-base">
            <Calendar className="w-5 h-5 mr-2" />
            Προσθήκη στο Ημερολόγιο
          </Button>
        </div>
      </section>

      {/* Church Location - Elegant Map Section */}
      {data.churchPosition && (
        <section className="max-w-7xl mx-auto px-6 py-32">
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
        <section className="max-w-7xl mx-auto px-6 py-32 bg-muted/20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-5xl text-foreground">Δεξίωση</h2>
            <p className="text-2xl text-muted-foreground font-light">{data.receptionLocation}</p>
          </div>
          
          <div className="h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-border/50">
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
        <section className="max-w-5xl mx-auto px-6 py-32">
          <h2 className="font-serif text-5xl text-center mb-20 text-foreground">Πρόγραμμα Εκδήλωσης</h2>
          <div className="space-y-6">
            {events.map((event, idx) => (
              <div key={event.id} className="bg-card border border-border/50 rounded-xl shadow-lg p-10 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-8">
                  <div className="bg-secondary/10 text-secondary rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0 font-serif text-2xl">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-3xl font-serif text-foreground">{event.eventName}</h3>
                    {event.eventDescription && (
                      <p className="text-muted-foreground text-lg leading-relaxed">{event.eventDescription}</p>
                    )}
                    <div className="flex flex-wrap gap-6 text-base">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Calendar className="w-5 h-5 text-secondary" />
                        <span>{format(new Date(event.eventDate), "d MMMM yyyy", { locale: el })}</span>
                      </div>
                      {event.eventTime && (
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Clock className="w-5 h-5 text-secondary" />
                          <span>{event.eventTime}</span>
                        </div>
                      )}
                      {event.locationName && (
                        <div className="flex items-center gap-2 text-foreground/70">
                          <MapPin className="w-5 h-5 text-secondary" />
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
            <Gift className="w-12 h-12 mx-auto text-secondary" />
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
                    <p className="text-2xl font-semibold text-secondary">{item.price}€</p>
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
          <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="font-serif text-6xl text-foreground">Επιβεβαίωση Παρουσίας</h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            Θα χαρούμε πολύ να γιορτάσετε μαζί μας αυτή την ξεχωριστή στιγμή
          </p>
        </div>
        <RSVPForm invitationId={invitation.id} invitationType="baptism" invitationTitle={data.title} />
      </section>

      {/* Footer - Elegant */}
      <footer className="bg-card border-t border-border/50 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <Sparkles className="w-10 h-10 mx-auto text-secondary/50" />
          <p className="font-serif text-4xl text-foreground/80">{data.childName}</p>
        </div>
      </footer>
    </div>
  );
}