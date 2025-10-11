import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInvitation } from "@/lib/invitationStorage";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Share2, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import "leaflet/dist/leaflet.css";

export default function BaptismInvitation() {
  const { id } = useParams();
  const [invitation, setInvitation] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'satellite'>('map');

  useEffect(() => {
    const fetchInvitation = async () => {
      if (id) {
        const data = await getInvitation(id);
        if (data && data.type === 'baptism') {
          setInvitation(data);
          document.title = data.title;
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-pink-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {data.mainImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${data.mainImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 to-pink-500/30" />
          </div>
        )}
        
        <div className="relative z-10 text-center text-white px-4">
          <Sparkles className="w-16 h-16 mx-auto mb-6 animate-pulse" />
          <h1 className="font-serif text-5xl md:text-7xl mb-4 animate-fade-in">
            Η Βάπτιση {data.childName ? `του ${data.childName}` : 'μας'}
          </h1>
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

      {/* Child Details */}
      {data.childName && (
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            {data.childPhoto && (
              <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-8 border-blue-200 shadow-2xl">
                <img src={data.childPhoto} alt={data.childName} className="w-full h-full object-cover" />
              </div>
            )}
            <h2 className="font-serif text-5xl">{data.childName}</h2>
          </div>
        </section>
      )}

      {/* Godparents */}
      {data.godparents && data.godparents.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16 bg-blue-50/50 rounded-3xl">
          <h2 className="font-serif text-4xl text-center mb-12">Ανάδοχοι</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {data.godparents.map((godparent: any, idx: number) => (
              <div key={idx} className="text-center space-y-3">
                {godparent.col2 && (
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-300">
                    <img src={godparent.col2} alt={godparent.col1} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="font-medium">{godparent.col1}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Date & Time */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center space-y-6">
          <Sparkles className="w-12 h-12 mx-auto text-blue-500" />
          <h2 className="font-serif text-4xl">Ημερομηνία & Ώρα</h2>
          <p className="text-2xl capitalize">{formattedDate}</p>
          <p className="text-3xl font-semibold">{data.baptismTime}</p>
          <Button onClick={addToCalendar} size="lg" className="mt-4">
            <Calendar className="w-4 h-4 mr-2" />
            Προσθήκη στο Ημερολόγιο
          </Button>
        </div>
      </section>

      {/* Church Location */}
      {data.churchPosition && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="font-serif text-4xl text-center mb-8">Εκκλησία</h2>
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
        <section className="max-w-6xl mx-auto px-4 py-16 bg-pink-50/50 rounded-3xl">
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
              <thead className="bg-blue-100">
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

      {/* Family */}
      {data.parentsFamily && data.parentsFamily.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-16 bg-yellow-50/50 rounded-3xl">
          <h2 className="font-serif text-4xl text-center mb-12">Οικογένεια</h2>
          <ul className="space-y-3 text-center">
            {data.parentsFamily.map((name: string, idx: number) => (
              <li key={idx} className="text-lg">{name}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="font-serif text-4xl text-center mb-12">Gallery Φωτογραφιών</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.gallery.map((img: any) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
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
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
        <div className="text-center mb-12">
          <Sparkles className="w-12 h-12 mx-auto text-blue-500 mb-4" />
          <h2 className="font-serif text-5xl mb-4">Επιβεβαίωση Παρουσίας</h2>
          <p className="text-lg text-muted-foreground">
            Θα χαρούμε πολύ να γιορτάσετε μαζί μας αυτή την ξεχωριστή στιγμή
          </p>
        </div>
        <RSVPForm invitationId={id!} invitationType="baptism" />
      </section>

      {/* Footer */}
      <footer className="bg-blue-100 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="w-8 h-8 mx-auto text-blue-500 mb-2" />
          <p className="text-muted-foreground">{data.childName}</p>
        </div>
      </footer>

      {/* Sticky Bottom Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 md:hidden z-50">
        <div className="flex gap-2">
          {data.churchPosition && (
            <Button 
              variant="outline" 
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
            Κοινοποίηση
          </Button>
        </div>
      </div>
    </div>
  );
}
