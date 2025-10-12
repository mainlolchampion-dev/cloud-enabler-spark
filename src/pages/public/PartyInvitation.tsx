import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInvitation } from "@/lib/invitationStorage";
import { getEvents } from "@/lib/eventsStorage";
import { getGiftItems } from "@/lib/giftRegistryStorage";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Share2, PartyPopper } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import MusicPlayer from "@/components/wedding/MusicPlayer";
import ConfettiAnimation from "@/components/party/ConfettiAnimation";
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
        console.log('🎉 Party Invitation - Fetching invitation with ID:', id);
        const data = await getInvitation(id);
        console.log('🎉 Party Invitation - Received data:', data);
        if (data && data.type === 'party') {
          console.log('🎉 Party Invitation - Data fields:', {
            title: data.data.title,
            mainImage: data.data.mainImage ? 'Exists' : 'Missing',
            invitationText: data.data.invitationText ? 'Exists' : 'Missing',
            hosts: Array.isArray(data.data.hosts) ? `${data.data.hosts.length} items` : 'Missing',
            gallery: Array.isArray(data.data.gallery) ? `${data.data.gallery.length} items` : 'Missing',
            venuePosition: data.data.venuePosition ? 'Exists' : 'Missing',
            contactInfo: data.data.contactInfo ? 'Exists' : 'Missing',
          });
          setInvitation(data);
          document.title = data.title;
          
          // Fetch events and gifts
          const eventsData = await getEvents(id);
          setEvents(eventsData);
          
          const giftsData = await getGiftItems(id);
          setGiftItems(giftsData);
        } else {
          console.log('🎉 Party Invitation - Invalid data or wrong type');
        }
      }
    };
    
    fetchInvitation();
  }, [id]);

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 p-6">
        <div className="text-center space-y-6 max-w-md">
          <PartyPopper className="w-20 h-20 mx-auto text-pink-400 animate-bounce" />
          <h1 className="font-serif text-4xl text-white">Η πρόσκληση δεν βρέθηκε</h1>
          <p className="text-pink-200 text-lg">
            Αυτή η πρόσκληση δεν υπάρχει ή έχει διαγραφεί. Παρακαλούμε ελέγξτε το link που σας έχει σταλεί.
          </p>
          <Button 
            onClick={() => window.location.href = '/'} 
            size="lg"
            className="mt-6 bg-pink-600 hover:bg-pink-700"
          >
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
    <>
      <ConfettiAnimation colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2']} />
      <MusicPlayer 
        youtubeVideoId="zeip_QOwnAw"
        primaryColor="#BB8FCE"
        secondaryColor="#85C1E2"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 relative" style={{ zIndex: 10 }}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105 animate-[scale-in_15s_ease-in-out_infinite_alternate]"
          style={{ backgroundImage: `url(${data.mainImage || partyHeroSample})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/60 to-pink-900/70 backdrop-blur-[1px]" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 animate-fade-in">
          <PartyPopper className="w-24 h-24 mx-auto mb-8 animate-bounce drop-shadow-2xl" />
          <h1 className="font-serif text-6xl md:text-9xl mb-8 drop-shadow-2xl bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 bg-clip-text text-transparent">
            {data.title}
          </h1>
          {data.occasion && (
            <p className="text-2xl md:text-4xl font-light text-white/90 drop-shadow-xl">{data.occasion}</p>
          )}
        </div>
      </section>

      {/* Countdown Timer */}
      {data.partyDate && (
        <section className="py-16">
          <CountdownTimer targetDate={data.partyDate} targetTime={data.partyTime} />
        </section>
      )}

      {/* Invitation Text */}
      {data.invitationText && (
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-gradient-to-br from-purple-900/80 via-pink-900/80 to-orange-900/80 rounded-3xl p-8 md:p-12 shadow-2xl border border-pink-500/30 backdrop-blur-sm">
            <div 
              className="prose prose-lg prose-invert mx-auto text-center"
              dangerouslySetInnerHTML={{ __html: data.invitationText }}
            />
          </div>
        </section>
      )}

      {/* Hosts */}
      {data.hosts && data.hosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="font-serif text-6xl text-center mb-16 text-white drop-shadow-lg">Οργανωτές</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {data.hosts.map((host: any, idx: number) => (
              <div key={idx} className="text-center space-y-4 group">
                {host.col2 && (
                  <div className="relative w-40 h-40 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
                    <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-pink-500 shadow-2xl shadow-pink-500/50 ring-4 ring-pink-500/20 group-hover:scale-110 transition-transform duration-300">
                      <img src={host.col2} alt={host.col1} className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
                <p className="font-semibold text-lg text-white drop-shadow-md">{host.col1}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Date & Time */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-pink-600 to-purple-600 rounded-3xl shadow-2xl p-12 text-center space-y-6 text-white border-4 border-pink-400">
          <Calendar className="w-16 h-16 mx-auto" />
          <h2 className="font-serif text-5xl">Πότε;</h2>
          <p className="text-3xl capitalize font-light">{formattedDate}</p>
          <p className="text-5xl font-bold">{data.partyTime}</p>
          <Button 
            onClick={addToCalendar} 
            size="lg" 
            className="mt-4 bg-white text-purple-900 hover:bg-pink-100"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Προσθήκη στο Ημερολόγιο
          </Button>
        </div>
      </section>

      {/* Location */}
      {data.venuePosition && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="font-serif text-5xl text-center mb-8 text-white">Που;</h2>
          <p className="text-2xl text-center mb-6 text-pink-200">{data.venueLocation}</p>
          
          <div className="h-96 rounded-xl overflow-hidden shadow-2xl border-4 border-pink-500">
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
            <Button 
              onClick={() => openDirections(data.venuePosition)} 
              size="lg"
              className="bg-pink-600 hover:bg-pink-700"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Οδηγίες Πλοήγησης
            </Button>
          </div>
        </section>
      )}

      {/* Contact Info */}
      {data.contactInfo && (
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="font-serif text-5xl text-center mb-8 text-white">Επικοινωνία</h2>
          <div 
            className="prose prose-lg prose-invert mx-auto"
            dangerouslySetInnerHTML={{ __html: data.contactInfo }}
          />
        </section>
      )}

      {/* Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="font-serif text-5xl text-center mb-12 text-white">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.gallery.map((img: any) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-2xl shadow-2xl border-4 border-pink-500/50 hover:border-pink-400 transition-colors">
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
      {events && events.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="font-serif text-5xl text-center mb-12 text-white">Πρόγραμμα</h2>
          <div className="space-y-6">
            {events.map((event, idx) => (
              <div key={event.id} className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 rounded-xl shadow-lg p-6 border-l-4 border-pink-500 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-pink-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-white">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-white">{event.eventName}</h3>
                    {event.eventDescription && (
                      <p className="text-pink-200 mb-3">{event.eventDescription}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-pink-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-pink-400" />
                        <span>{format(new Date(event.eventDate), "d MMMM yyyy", { locale: el })}</span>
                      </div>
                      {event.eventTime && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{event.eventTime}</span>
                        </div>
                      )}
                      {event.locationName && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-pink-400" />
                          <span>{event.locationName}</span>
                        </div>
                      )}
                    </div>
                    {event.locationLat && event.locationLng && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 bg-pink-600 hover:bg-pink-700 text-white border-pink-500"
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
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="font-serif text-5xl text-center mb-12 text-white">Λίστα Δώρων</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {giftItems.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-xl shadow-lg overflow-hidden border-2 border-pink-500/50 backdrop-blur-sm">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.itemName} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">{item.itemName}</h3>
                  {item.itemDescription && (
                    <p className="text-pink-200 text-sm mb-3">{item.itemDescription}</p>
                  )}
                  {item.price && (
                    <p className="text-lg font-bold text-pink-400 mb-3">{item.price}€</p>
                  )}
                  {item.storeUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white border-pink-500"
                      onClick={() => window.open(item.storeUrl, '_blank')}
                    >
                      Δες στο {item.storeName || 'Κατάστημα'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <PartyPopper className="w-16 h-16 mx-auto text-pink-400 mb-4 animate-bounce" />
          <h2 className="font-serif text-6xl mb-4 text-white">Επιβεβαίωση Παρουσίας</h2>
          <p className="text-xl text-pink-200">
            Πες μας αν έρχεσαι να πάρτυ μαζί μας!
          </p>
        </div>
        <RSVPForm invitationId={id!} invitationType="party" invitationTitle={data.title} />
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-8 mt-16 border-t border-pink-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <PartyPopper className="w-8 h-8 mx-auto text-pink-400 mb-2" />
          <p className="text-pink-200">{data.title}</p>
        </div>
      </footer>

      {/* Sticky Bottom Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-pink-600 to-purple-600 border-t-4 border-pink-400 shadow-2xl p-4 md:hidden z-50">
        <div className="flex gap-2">
          {data.venuePosition && (
            <Button 
              variant="secondary" 
              className="flex-1" 
              size="sm"
              onClick={() => openDirections(data.venuePosition)}
            >
              <MapPin className="w-4 h-4 mr-1" />
              Χάρτης
            </Button>
          )}
          <Button variant="secondary" className="flex-1" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            Κοινοποίηση
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}
