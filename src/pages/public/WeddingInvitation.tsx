import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInvitation } from "@/lib/invitationStorage";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Share2, Heart, Phone } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import MusicPlayer from "@/components/wedding/MusicPlayer";
import FlowerAnimation from "@/components/wedding/FlowerAnimation";
import "leaflet/dist/leaflet.css";

export default function WeddingInvitation() {
  const { id } = useParams();
  const [invitation, setInvitation] = useState<any>(null);
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Η πρόσκληση δεν βρέθηκε</p>
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
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white relative z-10">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {data.mainImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${data.mainImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-rose-900/50" />
          </div>
        )}
        
        <div className="relative z-10 text-center text-white px-4 space-y-6">
          <Heart className="w-12 h-12 mx-auto fill-current animate-pulse" />
          <h1 className="font-serif text-6xl md:text-9xl mb-4 animate-fade-in drop-shadow-2xl">
            {data.groomName}
            <span className="block text-5xl md:text-7xl my-4">&</span>
            {data.brideName}
          </h1>
          <div className="w-24 h-1 bg-white/80 mx-auto"></div>
          <p className="text-xl md:text-3xl tracking-[0.3em] uppercase font-light">
            Παντρευόμαστε
          </p>
          {formattedDate && (
            <p className="text-lg md:text-2xl font-light capitalize mt-4">
              {formattedDate}
            </p>
          )}
        </div>
      </section>

      {/* Invitation Text */}
      {data.invitationText && (
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div 
            className="prose prose-lg mx-auto text-center"
            dangerouslySetInnerHTML={{ __html: data.invitationText }}
          />
        </section>
      )}

      {/* Couple Details */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Groom */}
          <div className="text-center space-y-4">
            {data.groomPhoto && (
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-primary/20">
                <img src={data.groomPhoto} alt={data.groomName} className="w-full h-full object-cover" />
              </div>
            )}
            <h3 className="font-serif text-3xl">{data.groomName}</h3>
            <p className="text-muted-foreground">Ο Γαμπρός</p>
          </div>
          
          {/* Bride */}
          <div className="text-center space-y-4">
            {data.bridePhoto && (
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-primary/20">
                <img src={data.bridePhoto} alt={data.brideName} className="w-full h-full object-cover" />
              </div>
            )}
            <h3 className="font-serif text-3xl">{data.brideName}</h3>
            <p className="text-muted-foreground">Η Νύφη</p>
          </div>
        </div>
      </section>

      {/* Koumbaroi */}
      {data.koumbaroi && data.koumbaroi.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16 bg-rose-50/50">
          <h2 className="font-serif text-4xl text-center mb-12">Κουμπάροι</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {data.koumbaroi.map((koumparos: any, idx: number) => (
              <div key={idx} className="text-center space-y-3">
                {koumparos.col2 && (
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-primary/20">
                    <img src={koumparos.col2} alt={koumparos.col1} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="font-medium">{koumparos.col1}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Date & Time */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center space-y-6">
          <Calendar className="w-12 h-12 mx-auto text-primary" />
          <h2 className="font-serif text-4xl">Ημερομηνία & Ώρα</h2>
          <p className="text-2xl capitalize">{formattedDate}</p>
          <p className="text-3xl font-semibold">{data.weddingTime}</p>
          <Button onClick={addToCalendar} size="lg" className="mt-4">
            <Calendar className="w-4 h-4 mr-2" />
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

      {/* RSVP Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-b from-rose-50 to-pink-100">
        <div className="text-center mb-12">
          <h2 className="font-serif text-5xl mb-4">Επιβεβαίωση Παρουσίας</h2>
          <p className="text-lg text-muted-foreground">
            Θα χαρούμε πολύ να μας τιμήσετε με την παρουσία σας
          </p>
        </div>
        <RSVPForm invitationId={id!} invitationType="wedding" />
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
