import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInvitation } from "@/lib/invitationStorage";
import { getEvents } from "@/lib/eventsStorage";
import { getGiftItems } from "@/lib/giftRegistryStorage";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Share2, Heart, Phone, Clock, ExternalLink, Gift } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import MusicPlayer from "@/components/wedding/MusicPlayer";
import FlowerAnimation from "@/components/wedding/FlowerAnimation";
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
        console.log('Fetching invitation with ID:', id);
        const data = await getInvitation(id);
        console.log('Fetched invitation data:', data);
        if (data && data.type === 'wedding') {
          console.log('Wedding data:', data.data);
          setInvitation(data);
          
          // Load events and gifts
          const [eventsData, giftsData] = await Promise.all([
            getEvents(id),
            getGiftItems(id)
          ]);
          setEvents(eventsData);
          setGiftItems(giftsData.filter(item => !item.purchased));
          
          // Set OpenGraph meta tags
          document.title = data.title;
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', `Πρόσκληση Γάμου: ${data.data.groomName} & ${data.data.brideName}`);
          }
        } else {
          console.log('No wedding data found or wrong type');
        }
      }
    };
    
    fetchInvitation();
  }, [id]);

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 via-pink-50 to-white p-6">
        <div className="text-center space-y-6 max-w-md">
          <Heart className="w-20 h-20 mx-auto text-primary animate-pulse" />
          <h1 className="font-serif text-4xl text-foreground">Η πρόσκληση δεν βρέθηκε</h1>
          <p className="text-muted-foreground text-lg">
            Αυτή η πρόσκληση δεν υπάρχει ή έχει διαγραφεί. Παρακαλούμε ελέγξτε το link που σας έχει σταλεί.
          </p>
          <Button 
            onClick={() => window.location.href = '/'} 
            size="lg"
            className="mt-6"
          >
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
    // Generate .ics file
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
    <>
      <FlowerAnimation />
      <MusicPlayer 
        youtubeVideoId="zeip_QOwnAw"
        primaryColor="#FF80AB"
        secondaryColor="#FF5A8C"
      />
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white relative" style={{ zIndex: 10 }}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105 animate-[scale-in_20s_ease-in-out_infinite_alternate]"
          style={{ backgroundImage: `url(${data.mainImage || weddingHeroSample})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-primary/30 to-secondary/40 backdrop-blur-[1px]" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 space-y-6 animate-fade-in">
          <Heart className="w-16 h-16 mx-auto fill-current animate-pulse drop-shadow-2xl" />
          <h1 className="font-serif text-6xl md:text-9xl mb-4 drop-shadow-2xl leading-tight">
            {data.groomName}
            <span className="block text-5xl md:text-7xl my-6 opacity-90">&</span>
            {data.brideName}
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto animate-pulse"></div>
          <p className="text-2xl md:text-4xl tracking-[0.4em] uppercase font-light drop-shadow-lg">
            Παντρευόμαστε
          </p>
          {formattedDate && (
            <p className="text-xl md:text-3xl font-light capitalize mt-6 drop-shadow-lg">
              {formattedDate}
            </p>
          )}
        </div>
      </section>

      {/* Countdown Timer */}
      {data.weddingDate && (
        <section className="bg-gradient-to-b from-background via-muted/20 to-background py-16">
          <CountdownTimer targetDate={data.weddingDate} targetTime={data.weddingTime} />
        </section>
      )}

      {/* Invitation Text */}
      {data.invitationText && (
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl p-8 md:p-12 shadow-2xl border border-primary/10">
            <div 
              className="prose prose-lg prose-primary mx-auto text-center"
              dangerouslySetInnerHTML={{ __html: data.invitationText }}
            />
          </div>
        </section>
      )}

      {/* Couple Details */}
      <section className="max-w-6xl mx-auto px-4 py-20 bg-gradient-to-b from-muted/30 to-background">
        <h2 className="font-serif text-5xl text-center mb-16 text-primary">Το Ζευγάρι</h2>
        <div className="grid md:grid-cols-2 gap-16">
          {/* Groom */}
          <div className="text-center space-y-6 group">
            <div className="relative w-56 h-56 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              {data.groomPhoto && (
                <div className="relative w-56 h-56 mx-auto rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl ring-4 ring-primary/10 group-hover:scale-105 transition-transform duration-500">
                  <img src={data.groomPhoto} alt={data.groomName} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <h3 className="font-serif text-4xl text-primary">{data.groomName}</h3>
            <p className="text-muted-foreground text-lg font-medium">Ο Γαμπρός</p>
          </div>
          
          {/* Bride */}
          <div className="text-center space-y-6 group">
            <div className="relative w-56 h-56 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-accent rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              {data.bridePhoto && (
                <div className="relative w-56 h-56 mx-auto rounded-full overflow-hidden border-4 border-secondary/30 shadow-2xl ring-4 ring-secondary/10 group-hover:scale-105 transition-transform duration-500">
                  <img src={data.bridePhoto} alt={data.brideName} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <h3 className="font-serif text-4xl text-secondary">{data.brideName}</h3>
            <p className="text-muted-foreground text-lg font-medium">Η Νύφη</p>
          </div>
        </div>
      </section>

      {/* Koumbaroi */}
      {data.koumbaroi && data.koumbaroi.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <h2 className="font-serif text-5xl text-center mb-16 text-primary">Κουμπάροι</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {data.koumbaroi.map((koumparos: any, idx: number) => (
              <div key={idx} className="text-center space-y-4 group">
                {koumparos.col2 && (
                  <div className="relative w-36 h-36 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden border-3 border-primary/30 shadow-lg ring-2 ring-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <img src={koumparos.col2} alt={koumparos.col1} className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
                <p className="font-semibold text-lg">{koumparos.col1}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Date & Time */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl shadow-2xl p-12 md:p-16 text-center space-y-8 border border-primary/20 backdrop-blur-sm">
          <Calendar className="w-16 h-16 mx-auto text-primary animate-pulse" />
          <h2 className="font-serif text-5xl text-primary">Ημερομηνία & Ώρα</h2>
          <div className="space-y-4">
            <p className="text-3xl capitalize font-light text-muted-foreground">{formattedDate}</p>
            <p className="text-5xl font-bold text-primary font-serif">{data.weddingTime}</p>
          </div>
          <Button onClick={addToCalendar} size="lg" className="mt-8 text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5 mr-2" />
            Προσθήκη στο Ημερολόγιο
          </Button>
        </div>
      </section>

      {/* Church Location */}
      {data.churchPosition && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="font-serif text-4xl text-center mb-8">Τελετή (Εκκλησία)</h2>
          <p className="text-xl text-center mb-6">{data.churchLocation}</p>
          
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
            
            <div className="h-96 rounded-xl overflow-hidden shadow-lg">
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
        <section className="max-w-6xl mx-auto px-4 py-16 bg-rose-50/50">
          <h2 className="font-serif text-4xl text-center mb-8">Δεξίωση</h2>
          <p className="text-xl text-center mb-6">{data.receptionLocation}</p>
          
          <div className="h-96 rounded-xl overflow-hidden shadow-lg">
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

      {/* Bank Accounts */}
      {data.bankAccounts && data.bankAccounts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="font-serif text-4xl text-center mb-12">Αριθμοί Κατάθεσης</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-primary/5">
                <tr>
                  <th className="px-6 py-4 text-left">Τράπεζα</th>
                  <th className="px-6 py-4 text-left">IBAN</th>
                </tr>
              </thead>
              <tbody>
                {data.bankAccounts.map((account: any, idx: number) => (
                  <tr key={idx} className="border-t">
                    <td className="px-6 py-4">{account.col1}</td>
                    <td className="px-6 py-4 font-mono">{account.col2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Contact Info */}
      {data.contactInfo && (
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="font-serif text-4xl text-center mb-8">Στοιχεία Επικοινωνίας</h2>
          <div 
            className="prose prose-lg mx-auto"
            dangerouslySetInnerHTML={{ __html: data.contactInfo }}
          />
        </section>
      )}

      {/* Families */}
      {(data.groomFamily?.length > 0 || data.brideFamily?.length > 0) && (
        <section className="max-w-6xl mx-auto px-4 py-16 bg-rose-50/50">
          <h2 className="font-serif text-4xl text-center mb-12">Οικογένειες</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {data.groomFamily?.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl mb-4 text-center">Οικογένεια Γαμπρού</h3>
                <ul className="space-y-2">
                  {data.groomFamily.map((name: string, idx: number) => (
                    <li key={idx} className="text-center">{name}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.brideFamily?.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl mb-4 text-center">Οικογένεια Νύφης</h3>
                <ul className="space-y-2">
                  {data.brideFamily.map((name: string, idx: number) => (
                    <li key={idx} className="text-center">{name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="font-serif text-4xl text-center mb-12">Gallery Φωτογραφιών</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.gallery.map((img: any) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                <img 
                  src={img.url} 
                  alt="" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Events Timeline */}
      {events.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <h2 className="font-serif text-4xl text-center mb-12 text-primary">Πρόγραμμα Εκδηλώσεων</h2>
          <div className="space-y-6">
            {events.map((event, index) => (
              <Card key={event.id} className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{event.eventName}</h3>
                    {event.eventDescription && (
                      <p className="text-muted-foreground mb-3">{event.eventDescription}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(event.eventDate), "EEEE, d MMMM yyyy", { locale: el })}</span>
                      </div>
                      {event.eventTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.eventTime}</span>
                        </div>
                      )}
                      {event.locationName && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.locationName}</span>
                        </div>
                      )}
                    </div>
                    {event.locationLat && event.locationLng && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => window.open(`https://www.google.com/maps?q=${event.locationLat},${event.locationLng}`, '_blank')}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Οδηγίες
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Gift Registry */}
      {giftItems.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Gift className="w-16 h-16 mx-auto text-primary mb-4" />
            <h2 className="font-serif text-4xl mb-4 text-primary">Λίστα Δώρων</h2>
            <p className="text-lg text-muted-foreground">
              Αν επιθυμείτε να μας προσφέρετε κάποιο δώρο, εδώ θα βρείτε μερικές ιδέες
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {giftItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                {item.imageUrl && (
                  <div className="w-full h-48 bg-muted overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">{item.itemName}</h3>
                  {item.itemDescription && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.itemDescription}
                    </p>
                  )}
                  {item.price && (
                    <p className="text-2xl font-bold text-primary mb-3">
                      €{item.price.toFixed(2)}
                    </p>
                  )}
                  {item.storeName && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{item.storeName}</span>
                      {item.storeUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(item.storeUrl, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Δείτε
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-b from-rose-50 to-pink-100">
        <div className="text-center mb-12">
          <h2 className="font-serif text-5xl mb-4">Επιβεβαίωση Παρουσίας</h2>
          <p className="text-lg text-muted-foreground">
            Θα χαρούμε πολύ να μας τιμήσετε με την παρουσία σας
          </p>
        </div>
        <RSVPForm invitationId={id!} invitationType="wedding" invitationTitle={data.title} />
      </section>

      {/* Footer */}
      <footer className="bg-primary/5 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <Heart className="w-8 h-8 mx-auto text-primary fill-current" />
          <p className="text-muted-foreground">
            {data.groomName} & {data.brideName}
          </p>
        </div>
      </footer>

      {/* Sticky Bottom Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t shadow-2xl p-3 md:hidden z-50">
        <div className="flex gap-2">
          {data.contactInfo && (
            <Button variant="outline" className="flex-1" size="sm">
              <Phone className="w-4 h-4 mr-1" />
              Κλήση
            </Button>
          )}
          {data.churchPosition && (
            <Button 
              variant="default" 
              className="flex-1" 
              size="sm"
              onClick={() => openDirections(data.churchPosition)}
            >
              <MapPin className="w-4 h-4 mr-1" />
              Χάρτης
            </Button>
          )}
          <Button variant="outline" className="flex-1" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            Μοιραστείτε
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}
