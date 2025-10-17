import { BaseInvitation } from "@/lib/invitationStorage";
import { format, parseISO } from "date-fns";
import { el } from "date-fns/locale";
import { CountdownTimer } from "@/components/CountdownTimer";
import { AddToCalendar } from "@/components/wedding/AddToCalendar";
import { MapDisplay } from "@/components/wedding/MapDisplay";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { LivePhotoWall } from "@/components/wedding/LivePhotoWall";
import { Heart } from "lucide-react";

interface TemplateProps {
  invitation: BaseInvitation;
  events: any[];
  giftItems: any[];
  onOpenDirections: (position: [number, number]) => void;
}

export function LiebeRomantic({ invitation, events }: TemplateProps) {
  const data = invitation.data;
  const weddingDate = parseISO(data.weddingDate);
  const ceremonyLocation = data.ceremonyLocation || "";
  const coordinates = data.coordinates as [number, number] | undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50 font-serif">
      {/* Hero Section - Intro */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4 animate-fade-in">
          {/* Decorative Background Images */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-64 h-80 rounded-lg transform -rotate-6 bg-gradient-to-br from-pink-200 to-purple-200"></div>
            <div className="absolute top-32 right-20 w-64 h-80 rounded-lg transform rotate-12 bg-gradient-to-br from-purple-200 to-pink-200"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
            {/* Main Photo Frame */}
            {data.heroImage && (
              <div className="relative inline-block transform rotate-3 transition-transform hover:rotate-0 duration-500">
                <div className="bg-white p-4 shadow-2xl rounded-lg">
                  <img
                    src={data.heroImage}
                    alt="Couple"
                    className="w-80 h-96 object-cover rounded"
                  />
                </div>
              </div>
            )}

            {/* Names */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-light text-gray-800 tracking-wide">
                {data.groomName}{" "}
                <span className="italic text-pink-500 mx-4">&</span>{" "}
                {data.brideName}
              </h1>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-400"></div>
                <p className="text-2xl text-gray-600 italic">Are getting married</p>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-pink-400"></div>
              </div>
            </div>
          </div>

          {/* Decorative Ornaments */}
          <div className="absolute bottom-10 left-10 text-pink-300 opacity-30">
            <Heart className="w-16 h-16" fill="currentColor" />
          </div>
          <div className="absolute top-10 right-10 text-purple-300 opacity-30">
            <Heart className="w-12 h-12" fill="currentColor" />
          </div>
        </section>

      {/* Save the Date Section */}
      <section className="py-20 px-4 bg-white/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-xl p-12 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl font-light text-gray-800">
                  {format(weddingDate, "d MMMM, yyyy", { locale: el })}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full"></div>
              </div>

              {data.invitationText && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  {data.invitationText}
                </p>
              )}

              <div className="py-8">
                <CountdownTimer targetDate={weddingDate.toISOString()} />
              </div>

              <AddToCalendar
                title={invitation.title}
                startDate={weddingDate}
                endDate={new Date(weddingDate.getTime() + 4 * 60 * 60 * 1000)}
                location={ceremonyLocation}
                description={data.invitationText || ""}
              />
            </div>
          </div>
        </section>

      {/* About the Couple Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-5xl font-light text-gray-800">Για το Ζευγάρι</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Bride */}
              <div className="text-center space-y-6 group">
                {data.bridePhoto && (
                  <div className="relative inline-block">
                    <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-8 border-white shadow-2xl transform transition-transform group-hover:scale-105 duration-500">
                      <img
                        src={data.bridePhoto}
                        alt={data.brideName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <h4 className="text-3xl text-gray-800 italic">{data.brideName}</h4>
                  <h6 className="text-lg text-gray-600">Η Νύφη</h6>
                </div>
                {data.brideDescription && (
                  <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                    {data.brideDescription}
                  </p>
                )}
              </div>

              {/* Groom */}
              <div className="text-center space-y-6 group">
                {data.groomPhoto && (
                  <div className="relative inline-block">
                    <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-8 border-white shadow-2xl transform transition-transform group-hover:scale-105 duration-500">
                      <img
                        src={data.groomPhoto}
                        alt={data.groomName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <h4 className="text-3xl text-gray-800 italic">{data.groomName}</h4>
                  <h6 className="text-lg text-gray-600">Ο Γαμπρός</h6>
                </div>
                {data.groomDescription && (
                  <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                    {data.groomDescription}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

      {/* Our Story Section */}
      {data.storyText && (
        <section className="py-20 px-4 bg-white/80 backdrop-blur-sm animate-fade-in">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-5xl font-light text-gray-800">Η Ιστορία Μας</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full"></div>
              </div>

              <div className="prose prose-lg max-w-3xl mx-auto text-center">
                <p className="text-gray-600 leading-relaxed text-lg">{data.storyText}</p>
              </div>
            </div>
          </section>
      )}

      {/* The Event Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-5xl font-light text-gray-800">Η Εκδήλωση</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {data.ceremonyImage && (
                <div className="transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white p-4 shadow-2xl rounded-lg">
                    <img
                      src={data.ceremonyImage}
                      alt="Ceremony"
                      className="w-full h-96 object-cover rounded"
                    />
                  </div>
                </div>
              )}

              <div className="bg-white rounded-3xl shadow-xl p-10 space-y-6">
                <h3 className="text-3xl font-light text-gray-800">Γιορτάστε Μαζί Μας</h3>
                
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <p className="text-lg">
                      <strong>Ημερομηνία:</strong>{" "}
                      {format(weddingDate, "EEEE, d MMMM yyyy", { locale: el })}
                    </p>
                  </div>
                  
                  {data.ceremonyTime && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <p className="text-lg">
                        <strong>Ώρα:</strong> {data.ceremonyTime}
                      </p>
                    </div>
                  )}
                  
                  {ceremonyLocation && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <p className="text-lg">
                        <strong>Τοποθεσία:</strong> {ceremonyLocation}
                      </p>
                    </div>
                  )}
                </div>

                {data.ceremonyDetails && (
                  <p className="text-gray-600 leading-relaxed pt-4 border-t border-gray-200">
                    {data.ceremonyDetails}
                  </p>
                )}
              </div>
            </div>

            {/* Map */}
            {coordinates && (
              <div className="mt-16">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  <MapDisplay
                    position={coordinates}
                    locationName={ceremonyLocation}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

      {/* Quote Section */}
      {data.quoteText && (
        <section className="py-20 px-4 bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 animate-fade-in">
            <div className="max-w-4xl mx-auto text-center">
              <blockquote className="space-y-6">
                <div className="text-6xl text-pink-300">"</div>
                <p className="text-3xl md:text-4xl font-light text-gray-700 italic leading-relaxed">
                  {data.quoteText}
                </p>
                <div className="text-6xl text-pink-300 rotate-180">"</div>
              </blockquote>
            </div>
          </section>
      )}

      {/* Live Photo Wall */}
      <section className="py-20 px-4 bg-white/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-5xl font-light text-gray-800">Οι Φωτογραφίες Μας</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full"></div>
            </div>
            <LivePhotoWall invitationId={invitation.id} isPublic />
          </div>
        </section>

      {/* RSVP Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-5xl font-light text-gray-800">RSVP</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full"></div>
              <p className="text-lg text-gray-600">Παρακαλούμε επιβεβαιώστε την παρουσία σας</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {data.rsvpImage && (
                <div className="transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white p-4 shadow-2xl rounded-lg">
                    <img
                      src={data.rsvpImage}
                      alt="RSVP"
                      className="w-full h-96 object-cover rounded"
                    />
                  </div>
                </div>
              )}

              <div className="bg-white rounded-3xl shadow-xl p-10">
                <RSVPForm 
                  invitationId={invitation.id} 
                  invitationType={invitation.type as 'wedding' | 'baptism' | 'party'}
                  invitationTitle={invitation.title}
                />
              </div>
            </div>
          </div>
        </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gradient-to-r from-pink-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Heart className="w-6 h-6" fill="currentColor" />
            <p className="text-2xl font-light">
              {data.groomName} & {data.brideName}
            </p>
            <Heart className="w-6 h-6" fill="currentColor" />
          </div>
          <p className="text-pink-200">
            {format(weddingDate, "d MMMM yyyy", { locale: el })}
          </p>
        </div>
      </footer>
    </div>
  );
}
