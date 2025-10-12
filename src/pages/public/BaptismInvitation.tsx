import { useEffect, useState } from "react";
import { BaseInvitation } from "@/lib/invitationStorage";
import { getEvents } from "@/lib/eventsStorage";
import { getGiftItems } from "@/lib/giftRegistryStorage";
import { MapDisplay } from "@/components/wedding/MapDisplay";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Sparkles, Clock, ExternalLink, Gift, PartyPopper } from "lucide-react";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import { AddToCalendar } from "@/components/wedding/AddToCalendar";
import { LivePhotoWall } from "@/components/wedding/LivePhotoWall";
import { PasswordProtection } from "@/components/wedding/PasswordProtection";
import { SeatingDisplay } from "@/components/wedding/SeatingDisplay";
import { ThemeProvider } from "@/components/wedding/ThemeProvider";
import baptismHeroSample from "@/assets/baptism-hero-sample.jpg";

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

  const openDirections = (position: [number, number]) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`, '_blank');
  };

  const invitationContent = (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <img
          src={data.heroImage || baptismHeroSample}
          alt="Baptism Celebration"
          className="w-full rounded-lg shadow-lg object-cover aspect-[16/9]"
        />
        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white font-serif text-center">
            {data.title}
          </h1>
        </div>
      </section>

      {/* Invitation Text */}
      {data.invitationText && (
        <section className="prose max-w-none text-center">
          <div dangerouslySetInnerHTML={{ __html: data.invitationText }} />
        </section>
      )}

      {/* Child's Details */}
      <section className="text-center">
        <div className="space-y-4">
          <div className="relative inline-block">
            <img
              src={data.childPhoto || '/boy-sample.png'}
              alt="Child's Photo"
              className="rounded-full w-48 h-48 object-cover shadow-md border-4 border-white"
            />
          </div>
          <h2 className="text-3xl font-semibold font-serif">{data.childName}</h2>
          <p className="text-lg text-muted-foreground">
            {data.childTitle || 'With joy, we invite you to celebrate the baptism of our child'}
          </p>
        </div>
      </section>

      {/* Event Details */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Baptism Event */}
        <div className="flex items-start gap-4">
          <Calendar className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-xl font-semibold">Βάπτιση</h3>
            <p className="text-muted-foreground">
              {formattedDate}
              {data.baptismTime && `, ${data.baptismTime}`}
            </p>
            <p className="text-muted-foreground">{data.churchLocation}</p>
            {data.churchPosition && (
              <Button variant="link" onClick={() => openDirections(data.churchPosition)}>
                <MapPin className="w-4 h-4 mr-2" />
                Οδηγίες
              </Button>
            )}
            {data.baptismDate && data.baptismTime && (
              <AddToCalendar
                title="Baptism Ceremony"
                startDate={new Date(`${data.baptismDate}T${data.baptismTime}`)}
                endDate={new Date(`${data.baptismDate}T${data.baptismTime}`)}
                location={data.churchLocation}
                description={data.title}
              />
            )}
          </div>
        </div>

        {/* Party Event */}
        {data.receptionLocation && (
          <div className="flex items-start gap-4">
            <PartyPopper className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Δεξίωση</h3>
              <p className="text-muted-foreground">{data.receptionLocation}</p>
              {data.receptionPosition && (
                <Button variant="link" onClick={() => openDirections(data.receptionPosition)}>
                  <MapPin className="w-4 h-4 mr-2" />
                  Οδηγίες
                </Button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Countdown Timer */}
      {(data.baptismDate && data.baptismTime) && (
        <section>
          <h2 className="text-2xl font-semibold font-serif text-center mb-6">Μετράμε αντίστροφα για τη μεγάλη μέρα!</h2>
          <CountdownTimer targetDate={`${data.baptismDate}T${data.baptismTime}`} />
        </section>
      )}

      {/* Map Section */}
      {(data.churchPosition || data.receptionPosition) && (
        <section>
          <h2 className="text-2xl font-semibold font-serif text-center mb-6">
            {data.churchPosition && data.receptionPosition
              ? "Τοποθεσίες"
              : "Τοποθεσία"}
          </h2>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-muted/20">
        {data.churchPosition && (
          <MapDisplay
            position={data.churchPosition}
            locationName={data.churchLocation}
            mapType="map"
          />
        )}
        {data.receptionPosition && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold font-serif text-center mb-4">
              <PartyPopper className="inline-block mr-2" size={30} />
              Τοποθεσία Δεξίωσης
            </h2>
            <p className="text-center mb-4">{data.receptionLocation}</p>
            <MapDisplay
              position={data.receptionPosition}
              locationName={data.receptionLocation}
              mapType="map"
            />
            <div className="flex justify-center mt-4">
              <Button onClick={() => openDirections(data.receptionPosition!)} variant="outline">
                <ExternalLink className="mr-2" size={20} />
                Οδηγίες
              </Button>
            </div>
          </div>
        )}
          </div>
          <div className="mt-4 flex justify-center gap-4">
            {data.churchPosition && (
              <Button variant="outline" onClick={() => openDirections(data.churchPosition)}>
                <MapPin className="w-4 h-4 mr-2" />
                Οδηγίες για την Εκκλησία
              </Button>
            )}
            {data.receptionPosition && (
              <Button variant="outline" onClick={() => openDirections(data.receptionPosition)}>
                <MapPin className="w-4 h-4 mr-2" />
                Οδηγίες για τη Δεξίωση
              </Button>
            )}
          </div>
        </section>
      )}

      {/* Events Section */}
      {events.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold font-serif text-center mb-6">Εκδηλώσεις</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-muted/5 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-muted-foreground">{event.description}</p>
                {event.link && (
                  <Button variant="link" asChild>
                    <a href={event.link} target="_blank" rel="noopener noreferrer" className="mt-2">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Περισσότερα
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gift Registry Section */}
      <section>
        <h2 className="text-2xl font-semibold font-serif text-center mb-6">Λίστα Δώρων</h2>
        {giftItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {giftItems.map((gift) => (
              <div key={gift.id} className="bg-muted/5 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold">{gift.name}</h3>
                <p className="text-muted-foreground">{gift.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">Τιμή: {gift.price}€</span>
                  <Button variant="link" asChild>
                    <a href={gift.link} target="_blank" rel="noopener noreferrer">
                      <Gift className="w-4 h-4 mr-2" />
                      Αγορά
                    </a>
                  </Button>
                </div>
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
        <h2 className="text-2xl font-semibold font-serif text-center mb-6">
          Επιβεβαίωση Παρουσίας
        </h2>
        <RSVPForm invitationId={invitation.id} invitationType="baptism" invitationTitle={invitation.title} />
      </section>

      {/* Parents Section */}
      {(data.parentsText || data.grandparentsText) && (
        <section className="text-center">
          {data.parentsText && (
            <div className="mb-8">
              <p className="text-lg">{data.parentsText}</p>
            </div>
          )}
          {data.grandparentsText && (
            <div>
              <p className="text-lg">{data.grandparentsText}</p>
            </div>
          )}
        </section>
      )}

      {/* Gallery Section */}
      {data.gallery && data.gallery.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold font-serif text-center mb-6">Φωτογραφίες</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.gallery.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt="Gallery Image"
                className="rounded-lg shadow-md object-cover aspect-square"
              />
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {data.contactInfo && (
        <section>
          <h2 className="text-2xl font-semibold font-serif text-center mb-6">Επικοινωνία</h2>
          <div className="prose max-w-none text-center">
            <div dangerouslySetInnerHTML={{ __html: data.contactInfo }} />
          </div>
        </section>
      )}

      {/* Wishes Section */}
      {data.wishesText && (
        <section>
          <h2 className="text-2xl font-semibold font-serif text-center mb-6">Ευχές</h2>
          <div className="prose max-w-none text-center">
            <div dangerouslySetInnerHTML={{ __html: data.wishesText }} />
          </div>
        </section>
      )}

      {/* Footer Section */}
      <footer className="text-center text-muted-foreground py-8">
        Με χαρά σας περιμένουμε!
      </footer>

      {/* Live Photo Wall */}
      <section className="py-32">
        <LivePhotoWall invitationId={invitation.id} isPublic />
      </section>
    </div>
  );

  return (
    <ThemeProvider themeId={invitation.theme || 'romantic'}>
      <div className="min-h-screen bg-background">
        {invitation.password ? (
          <PasswordProtection correctPassword={invitation.password}>
            {invitationContent}
          </PasswordProtection>
        ) : (
          invitationContent
        )}
      </div>
    </ThemeProvider>
  );
}
