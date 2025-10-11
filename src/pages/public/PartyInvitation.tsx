import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInvitation } from "@/lib/invitationStorage";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Share2, PartyPopper } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import "leaflet/dist/leaflet.css";

export default function PartyInvitation() {
  const { id } = useParams();
  const [invitation, setInvitation] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const data = getInvitation(id);
      if (data && data.type === 'party') {
        setInvitation(data);
        document.title = data.title;
      }
    }
  }, [id]);

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Η πρόσκληση δεν βρέθηκε</p>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {data.mainImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${data.mainImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-purple-900/80" />
          </div>
        )}
        
        <div className="relative z-10 text-center text-white px-4">
          <PartyPopper className="w-20 h-20 mx-auto mb-6 animate-bounce" />
          <h1 className="font-serif text-6xl md:text-8xl mb-6 animate-fade-in bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 bg-clip-text text-transparent">
            {data.title}
          </h1>
        </div>
      </section>

      {/* Invitation Text */}
      {data.invitationText && (
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div 
            className="prose prose-lg prose-invert mx-auto text-center"
            dangerouslySetInnerHTML={{ __html: data.invitationText }}
          />
        </section>
      )}

      {/* Hosts */}
      {data.hosts && data.hosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="font-serif text-5xl text-center mb-12 text-white">Οργανωτές</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {data.hosts.map((host: any, idx: number) => (
              <div key={idx} className="text-center space-y-3">
                {host.col2 && (
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-pink-500 shadow-2xl shadow-pink-500/50">
                    <img src={host.col2} alt={host.col1} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="font-medium text-white">{host.col1}</p>
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

      {/* RSVP Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <PartyPopper className="w-16 h-16 mx-auto text-pink-400 mb-4 animate-bounce" />
          <h2 className="font-serif text-6xl mb-4 text-white">Επιβεβαίωση Παρουσίας</h2>
          <p className="text-xl text-pink-200">
            Πες μας αν έρχεσαι να πάρτυ μαζί μας!
          </p>
        </div>
        <RSVPForm invitationId={id!} invitationType="party" />
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
  );
}
