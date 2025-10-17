import { BaseInvitation } from "@/lib/invitationStorage";
import { format, parseISO } from "date-fns";
import { el } from "date-fns/locale";
import { CountdownTimer } from "@/components/CountdownTimer";
import { AddToCalendar } from "@/components/wedding/AddToCalendar";
import { MapDisplay } from "@/components/wedding/MapDisplay";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { LivePhotoWall } from "@/components/wedding/LivePhotoWall";
import { Heart } from "lucide-react";
import { LiebeNavigation } from "./liebe/LiebeNavigation";
import { PolaroidPhoto } from "./liebe/PolaroidPhoto";
import { WatercolorBackground } from "@/components/wedding/decorative/WatercolorBackground";
import { FloralBorder } from "@/components/wedding/decorative/FloralBorder";

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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 font-serif">
      {/* Navigation */}
      <LiebeNavigation />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20 px-4">
        <WatercolorBackground variant="mixed" opacity={0.2} />
        
        {/* Scattered Polaroid Photos */}
        <div className="absolute inset-0 z-0">
          {data.heroImage && (
            <>
              <div className="absolute top-32 left-[10%] w-48 opacity-100">
                <PolaroidPhoto src={data.heroImage} alt="Photo 1" rotation={-8} />
              </div>
              <div className="absolute top-48 right-[15%] w-44 opacity-100">
                <PolaroidPhoto src={data.heroImage} alt="Photo 2" rotation={12} />
              </div>
              <div className="absolute bottom-32 left-[15%] w-40 opacity-100">
                <PolaroidPhoto src={data.heroImage} alt="Photo 3" rotation={-5} />
              </div>
              <div className="absolute bottom-48 right-[12%] w-44 opacity-100">
                <PolaroidPhoto src={data.heroImage} alt="Photo 4" rotation={8} />
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="relative z-20 text-center space-y-12 max-w-4xl mx-auto">
          {/* Main Photo */}
          {data.heroImage && (
            <div className="relative inline-block">
              <div className="bg-white p-6 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src={data.heroImage}
                  alt="Couple"
                  className="w-96 h-[480px] object-cover opacity-100"
                />
              </div>
            </div>
          )}

          {/* Names with romantic fonts */}
          <div className="space-y-6">
            <h1 className="text-7xl md:text-8xl font-romantic text-gray-800">
              {data.groomName}
            </h1>
            <div className="flex items-center justify-center gap-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-pink-400 to-pink-400"></div>
              <Heart className="w-8 h-8 text-pink-400" fill="currentColor" />
              <div className="h-px w-24 bg-gradient-to-l from-transparent via-pink-400 to-pink-400"></div>
            </div>
            <h1 className="text-7xl md:text-8xl font-romantic text-gray-800">
              {data.brideName}
            </h1>
            <p className="text-2xl font-signature text-gray-600 mt-8">
              are getting married
            </p>
          </div>
        </div>

        <FloralBorder position="bottom" color="#ec4899" />
      </section>

      {/* Save the Date Section */}
      <section className="relative py-24 px-4 bg-white/80 backdrop-blur-sm">
        <WatercolorBackground variant="pink" opacity={0.15} />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center space-y-12">
            <div className="space-y-6">
              <p className="text-3xl font-signature text-pink-500">Save the Date</p>
              <h2 className="text-6xl font-romantic text-gray-800">
                {format(weddingDate, "d MMMM, yyyy", { locale: el })}
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 mx-auto rounded-full"></div>
            </div>

            {data.invitationText && (
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-serif italic">
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
      <section id="couple" className="relative py-24 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <WatercolorBackground variant="purple" opacity={0.15} />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <p className="text-3xl font-signature text-purple-500">Meet</p>
            <h2 className="text-6xl font-romantic text-gray-800">The Happy Couple</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Bride */}
            <div className="text-center space-y-8 group">
              {data.bridePhoto && (
                <div className="relative inline-block z-10">
                  <div className="bg-white p-6 shadow-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
                    <img
                      src={data.bridePhoto}
                      alt={data.brideName}
                      className="w-72 h-96 object-cover opacity-100"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <h4 className="text-5xl font-romantic text-gray-800">{data.brideName}</h4>
                <p className="text-xl font-signature text-pink-500">The Bride</p>
              </div>
              {data.brideDescription && (
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed font-serif">
                  {data.brideDescription}
                </p>
              )}
            </div>

            {/* Groom */}
            <div className="text-center space-y-8 group">
              {data.groomPhoto && (
                <div className="relative inline-block z-10">
                  <div className="bg-white p-6 shadow-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                    <img
                      src={data.groomPhoto}
                      alt={data.groomName}
                      className="w-72 h-96 object-cover opacity-100"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <h4 className="text-5xl font-romantic text-gray-800">{data.groomName}</h4>
                <p className="text-xl font-signature text-purple-500">The Groom</p>
              </div>
              {data.groomDescription && (
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed font-serif">
                  {data.groomDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        <FloralBorder position="bottom" color="#a855f7" />
      </section>

      {/* Our Story Section */}
      {data.storyText && (
        <section id="story" className="relative py-24 px-4 bg-white/90 backdrop-blur-sm">
          <WatercolorBackground variant="mixed" opacity={0.2} />
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-20 space-y-6">
              <p className="text-3xl font-signature text-pink-500">Read</p>
              <h2 className="text-6xl font-romantic text-gray-800">Our Love Story</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 mx-auto rounded-full"></div>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-white/80 rounded-3xl shadow-xl p-12 border-4 border-pink-100">
                <p className="text-xl text-gray-700 leading-relaxed font-serif text-center italic">
                  {data.storyText}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* The Event Section */}
      <section id="event" className="relative py-24 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
        <WatercolorBackground variant="mixed" opacity={0.3} />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <p className="text-3xl font-signature text-purple-500">Join Us</p>
            <h2 className="text-6xl font-romantic text-gray-800">Wedding Details</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {data.ceremonyImage && (
              <div className="transform -rotate-3 hover:rotate-0 transition-transform duration-500 relative z-10">
                <div className="bg-white p-6 shadow-2xl">
                  <img
                    src={data.ceremonyImage}
                    alt="Ceremony"
                    className="w-full h-[480px] object-cover opacity-100"
                  />
                </div>
              </div>
            )}

            <div className="bg-white/90 rounded-3xl shadow-xl p-12 space-y-8 border-4 border-purple-100">
              <h3 className="text-4xl font-romantic text-gray-800 text-center">Celebration</h3>
              
              <div className="space-y-6 text-gray-700">
                <div className="flex items-start gap-4">
                  <Heart className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" fill="currentColor" />
                  <div>
                    <p className="font-serif font-semibold text-lg mb-1">Date</p>
                    <p className="text-lg">
                      {format(weddingDate, "EEEE, d MMMM yyyy", { locale: el })}
                    </p>
                  </div>
                </div>
                
                {data.ceremonyTime && (
                  <div className="flex items-start gap-4">
                    <Heart className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" fill="currentColor" />
                    <div>
                      <p className="font-serif font-semibold text-lg mb-1">Time</p>
                      <p className="text-lg">{data.ceremonyTime}</p>
                    </div>
                  </div>
                )}
                
                {ceremonyLocation && (
                  <div className="flex items-start gap-4">
                    <Heart className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" fill="currentColor" />
                    <div>
                      <p className="font-serif font-semibold text-lg mb-1">Location</p>
                      <p className="text-lg">{ceremonyLocation}</p>
                    </div>
                  </div>
                )}
              </div>

              {data.ceremonyDetails && (
                <div className="pt-6 border-t-2 border-pink-200">
                  <p className="text-gray-600 leading-relaxed font-serif italic">
                    {data.ceremonyDetails}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          {coordinates && (
            <div className="max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-3xl shadow-xl overflow-hidden border-4 border-pink-100">
                <MapDisplay
                  position={coordinates}
                  locationName={ceremonyLocation}
                />
              </div>
            </div>
          )}
        </div>

        <FloralBorder position="bottom" color="#ec4899" />
      </section>

      {/* Quote Section */}
      {data.quoteText && (
        <section className="relative py-24 px-4 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100">
          <WatercolorBackground variant="mixed" opacity={0.3} />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <blockquote className="space-y-8">
              <div className="text-8xl font-romantic text-pink-300">"</div>
              <p className="text-4xl md:text-5xl font-signature text-gray-700 leading-relaxed px-8">
                {data.quoteText}
              </p>
              <div className="text-8xl font-romantic text-pink-300 rotate-180">"</div>
            </blockquote>
          </div>
        </section>
      )}

      {/* Live Photo Wall */}
      <section id="gallery" className="relative py-24 px-4 bg-white/90 backdrop-blur-sm">
        <WatercolorBackground variant="pink" opacity={0.2} />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <p className="text-3xl font-signature text-pink-500">Explore</p>
            <h2 className="text-6xl font-romantic text-gray-800">Our Memories</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>
          <LivePhotoWall invitationId={invitation.id} isPublic />
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="relative py-24 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <WatercolorBackground variant="purple" opacity={0.3} />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <p className="text-3xl font-signature text-purple-500">Please</p>
            <h2 className="text-6xl font-romantic text-gray-800">Join Our Celebration</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 mx-auto rounded-full"></div>
            <p className="text-xl text-gray-600 font-serif">Kindly confirm your attendance</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {data.rsvpImage && (
              <div className="transform rotate-3 hover:rotate-0 transition-transform duration-500 relative z-10">
                <div className="bg-white p-6 shadow-2xl">
                  <img
                    src={data.rsvpImage}
                    alt="RSVP"
                    className="w-full h-[480px] object-cover opacity-100"
                  />
                </div>
              </div>
            )}

            <div className="bg-white/90 rounded-3xl shadow-xl p-12 border-4 border-purple-100">
              <RSVPForm 
                invitationId={invitation.id} 
                invitationType={invitation.type as 'wedding' | 'baptism' | 'party'}
                invitationTitle={invitation.title}
              />
            </div>
          </div>
        </div>

        <FloralBorder position="top" color="#a855f7" />
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 bg-gradient-to-r from-pink-900 via-purple-900 to-pink-900 text-white overflow-hidden">
        <WatercolorBackground variant="mixed" opacity={0.1} />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-4">
            <Heart className="w-8 h-8" fill="currentColor" />
            <p className="text-5xl font-romantic">
              {data.groomName} & {data.brideName}
            </p>
            <Heart className="w-8 h-8" fill="currentColor" />
          </div>
          <p className="text-2xl font-signature text-pink-200">
            {format(weddingDate, "d MMMM yyyy", { locale: el })}
          </p>
          <p className="text-sm text-pink-300/80 font-serif">
            Forever starts here
          </p>
        </div>
      </footer>
    </div>
  );
}
