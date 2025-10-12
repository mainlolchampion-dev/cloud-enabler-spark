import { useEffect, useState } from "react";
import { BaseInvitation } from "@/lib/invitationStorage";
import { getEvents } from "@/lib/eventsStorage";
import { getGiftItems } from "@/lib/giftRegistryStorage";
import { MapDisplay } from "@/components/wedding/MapDisplay";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, PartyPopper, Clock, ExternalLink, Gift } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import { AddToCalendar } from "@/components/wedding/AddToCalendar";
import { LivePhotoWall } from "@/components/wedding/LivePhotoWall";
import { PasswordProtection } from "@/components/wedding/PasswordProtection";
import { SeatingDisplay } from "@/components/wedding/SeatingDisplay";
import partyHeroSample from "@/assets/party-hero-sample.jpg";

interface PartyInvitationProps {
  invitation: BaseInvitation;
}

export default function PartyInvitation({ invitation }: PartyInvitationProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [giftItems, setGiftItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'map' | 'satellite'>('map');

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

  const openDirections = (position: [number, number]) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`, '_blank');
  };

  const invitationContent = (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <img
          src={data.mainImage || partyHeroSample}
          alt="Party Invitation"
          className="w-full rounded-lg shadow-lg object-cover aspect-[16/9]"
        />
        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-5xl font-bold font-serif text-center">
            {data.title}
          </h1>
        </div>
      </section>

      {/* Invitation Text */}
      <section className="text-center">
        <div
          className="text-gray-700 text-lg"
          dangerouslySetInnerHTML={{ __html: data.invitationText }}
        />
      </section>

      {/* Date and Time */}
      {data.partyDate && data.partyTime && (
        <section className="bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold font-serif text-center mb-4">
            <PartyPopper className="inline-block mr-2" size={30} />
            Πληροφορίες
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-center">
              <Calendar className="mr-2 text-primary" size={20} />
              <span className="font-semibold">Ημερομηνία:</span> {formattedDate}
            </div>
            <div className="flex items-center justify-center">
              <Clock className="mr-2 text-primary" size={20} />
              <span className="font-semibold">Ώρα:</span> {data.partyTime}
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <AddToCalendar
              title={data.title}
              description={data.invitationText}
              location={data.partyLocation}
              startDate={new Date(`${data.partyDate}T${data.partyTime}`)}
              endDate={new Date(`${data.partyDate}T${data.partyTime}`)}
            />
          </div>
        </section>
      )}

      {/* Countdown Timer */}
      {data.partyDate && (
        <section>
          <h2 className="text-2xl font-bold font-serif text-center mb-4">
            Αντίστροφη Μέτρηση
          </h2>
          <CountdownTimer targetDate={data.partyDate} />
        </section>
      )}

      {/* Location */}
      {data.partyLocation && data.partyPosition && (
        <section>
          <h2 className="text-2xl font-bold font-serif text-center mb-4">
            <MapPin className="inline-block mr-2" size={30} />
            Τοποθεσία
          </h2>
          <p className="text-center">{data.partyLocation}</p>
          <MapDisplay
            position={data.partyPosition}
            locationName={data.partyLocation}
            mapType={activeTab === 'map' ? 'map' : 'satellite'}
          />
          <div className="flex justify-center mt-4">
            <Button onClick={() => openDirections(data.partyPosition!)} variant="outline">
              <ExternalLink className="mr-2" size={20} />
              Οδηγίες
            </Button>
          </div>
        </section>
      )}

      {/* Events */}
      {events.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold font-serif text-center mb-4">
            Εκδηλώσεις
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <li key={event.id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
                {event.date && (
                  <p className="text-gray-500">
                    <Calendar className="inline-block mr-1" size={16} />
                    {format(new Date(event.date), "EEEE, d MMMM yyyy", { locale: el })}
                  </p>
                )}
                {event.time && (
                  <p className="text-gray-500">
                    <Clock className="inline-block mr-1" size={16} />
                    {event.time}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Gift Registry */}
      {giftItems.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold font-serif text-center mb-4">
            <Gift className="inline-block mr-2" size={30} />
            Λίστα Δώρων
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {giftItems.map((item) => (
              <li key={item.id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center"
                >
                  <ExternalLink className="inline-block mr-1" size={16} />
                  Αγορά
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Seating Display */}
      <SeatingDisplay invitationId={invitation.id} />

      {/* RSVP Form */}
      <section>
        <h2 className="text-2xl font-bold font-serif text-center mb-4">
          Επιβεβαίωση Παρουσίας
        </h2>
        <RSVPForm invitationId={invitation.id} invitationType="party" invitationTitle={invitation.title} />
      </section>

      {/* Contact Info */}
      {data.contactInfo && (
        <section>
          <h2 className="text-2xl font-bold font-serif text-center mb-4">
            Επικοινωνία
          </h2>
          <div
            className="text-gray-700 text-center"
            dangerouslySetInnerHTML={{ __html: data.contactInfo }}
          />
        </section>
      )}

      {/* Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold font-serif text-center mb-4">
            Φωτογραφίες
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.gallery.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt="Gallery"
                className="rounded-lg shadow-md"
              />
            ))}
          </div>
        </section>
      )}

      {/* Live Photo Wall */}
      <section className="py-32 bg-muted/20">
        <LivePhotoWall invitationId={invitation.id} isPublic />
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
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
