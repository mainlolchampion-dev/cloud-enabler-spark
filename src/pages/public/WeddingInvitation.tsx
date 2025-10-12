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
import { AddToCalendar } from "@/components/wedding/AddToCalendar";
import { LivePhotoWall } from "@/components/wedding/LivePhotoWall";
import { PasswordProtection } from "@/components/wedding/PasswordProtection";
import { SeatingDisplay } from "@/components/wedding/SeatingDisplay";
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


  const openDirections = (position: [number, number]) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`, '_blank');
  };

  const invitationContent = (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <img
          src={data.mainImage || weddingHeroSample}
          alt="Wedding Invitation"
          className="w-full rounded-lg shadow-xl object-cover aspect-video"
        />
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white rounded-b-lg">
          <h1 className="text-3xl font-bold font-serif drop-shadow-md">{data.title}</h1>
        </div>
      </section>

      {/* Invitation Text */}
      {data.invitationText && (
        <section className="text-center">
          <div className="text-gray-700 text-lg font-serif" dangerouslySetInnerHTML={{ __html: data.invitationText }} />
        </section>
      )}

      {/* Couple Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Groom */}
        <div className="text-center">
          {data.groomPhoto && (
            <img
              src={data.groomPhoto}
              alt="Groom"
              className="rounded-full w-48 h-48 object-cover mx-auto mb-4 shadow-md"
            />
          )}
          <h2 className="text-2xl font-semibold">{data.groomName}</h2>
        </div>

        {/* Bride */}
        <div className="text-center">
          {data.bridePhoto && (
            <img
              src={data.bridePhoto}
              alt="Bride"
              className="rounded-full w-48 h-48 object-cover mx-auto mb-4 shadow-md"
            />
          )}
          <h2 className="text-2xl font-semibold">{data.brideName}</h2>
        </div>
      </section>

      {/* Koumbaroi Section */}
      {data.koumbaroi && data.koumbaroi.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-center mb-6">Κουμπάροι</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.koumbaroi.map((koumbaros) => (
              <div key={koumbaros.col1} className="text-center">
                {koumbaros.col2 && (
                  <img
                    src={koumbaros.col2}
                    alt={koumbaros.col1}
                    className="rounded-full w-32 h-32 object-cover mx-auto mb-2 shadow-md"
                  />
                )}
                <p className="text-lg">{koumbaros.col1}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Date and Time Section */}
      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Ημερομηνία & Ώρα</h2>
        <div className="flex items-center justify-center space-x-4">
          <Calendar className="w-6 h-6 text-gray-500" />
          <p className="text-lg">{formattedDate}</p>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Clock className="w-6 h-6 text-gray-500" />
          <p className="text-lg">{data.weddingTime}</p>
        </div>
        <CountdownTimer targetDate={data.weddingDate} targetTime={data.weddingTime} />
        <AddToCalendar
          title={data.title}
          description={data.invitationText}
          location={data.churchLocation}
          startDate={new Date(`${data.weddingDate}T${data.weddingTime}`)}
          endDate={new Date(`${data.weddingDate}T${data.weddingTime}`)}
        />
      </section>

      {/* Church Location Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Τοποθεσία Μυστηρίου</h2>
        <div className="flex items-center space-x-4 mb-2">
          <MapPin className="w-6 h-6 text-gray-500" />
          <p className="text-lg">{data.churchLocation}</p>
          {data.churchPosition && (
            <Button variant="link" onClick={() => openDirections(data.churchPosition)}>
              <ExternalLink className="w-4 h-4 mr-1" />
              Οδηγίες
            </Button>
          )}
        </div>
        {data.churchPosition && (
          <MapDisplay
            position={data.churchPosition}
            locationName={data.churchLocation}
            mapType={activeTab === 'map' ? 'map' : 'satellite'}
          />
        )}
      </section>

      {/* Reception Location Section */}
      {data.receptionLocation && data.receptionPosition && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Τοποθεσία Δεξίωσης</h2>
          <div className="flex items-center space-x-4 mb-2">
            <MapPin className="w-6 h-6 text-gray-500" />
            <p className="text-lg">{data.receptionLocation}</p>
            <Button variant="link" onClick={() => openDirections(data.receptionPosition)}>
              <ExternalLink className="w-4 h-4 mr-1" />
              Οδηγίες
            </Button>
          </div>
          <MapDisplay
            position={data.receptionPosition}
            locationName={data.receptionLocation}
            mapType={activeTab === 'map' ? 'map' : 'satellite'}
          />
        </section>
      )}

      {/* Gift Registry Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Λίστα Δώρων</h2>
        {giftItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {giftItems.map((gift) => (
              <div key={gift.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{gift.name}</h3>
                <p className="text-gray-600">{gift.description}</p>
                {gift.url && (
                  <Button variant="link" asChild>
                    <a href={gift.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <Gift className="w-4 h-4 mr-1" />
                      Αγορά
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Η λίστα δώρων θα είναι διαθέσιμη σύντομα.
          </p>
        )}
      </section>

      {/* Seating Display */}
      <SeatingDisplay invitationId={invitation.id} />

      {/* RSVP Form */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">RSVP</h2>
        <RSVPForm invitationId={invitation.id} invitationType="wedding" invitationTitle={invitation.title} />
      </section>

      {/* Bank Accounts Section */}
      {data.bankAccounts && data.bankAccounts.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Τραπεζικοί Λογαριασμοί</h2>
          <div className="space-y-4">
            {data.bankAccounts.map((account) => (
              <div key={account.col1} className="flex flex-col gap-1">
                <p className="text-lg font-medium">{account.col1}</p>
                <p className="text-gray-600">{account.col2}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Info Section */}
      {data.contactInfo && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Επικοινωνία</h2>
          <div className="text-gray-700 text-lg" dangerouslySetInnerHTML={{ __html: data.contactInfo }} />
        </section>
      )}

      {/* Groom Family Section */}
      {data.groomFamily && data.groomFamily.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Οικογένεια Γαμπρού</h2>
          <div className="flex flex-wrap gap-2">
            {data.groomFamily.map((name, index) => (
              <div key={index} className="bg-gray-100 rounded-full px-4 py-2 text-gray-700">
                {name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bride Family Section */}
      {data.brideFamily && data.brideFamily.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Οικογένεια Νύφης</h2>
          <div className="flex flex-wrap gap-2">
            {data.brideFamily.map((name, index) => (
              <div key={index} className="bg-gray-100 rounded-full px-4 py-2 text-gray-700">
                {name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {data.gallery && data.gallery.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Φωτογραφίες</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.gallery.map((image) => (
              <img key={image.id} src={image.url} alt="Gallery" className="rounded-lg shadow-md object-cover aspect-square" />
            ))}
          </div>
        </section>
      )}

      {/* Heart Section */}
      <section className="text-center">
        <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-lg">Με αγάπη και χαρά, σας περιμένουμε!</p>
      </section>

      {/* Live Photo Wall */}
      <section className="py-32">
        <LivePhotoWall invitationId={invitation.id} isPublic />
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary-light to-background">
      {invitation.password ? (
        <PasswordProtection correctPassword={invitation.password}>
          {invitationContent}
        </PasswordProtection>
      ) : (
        invitationContent
      )}
    </div>
  );
}
