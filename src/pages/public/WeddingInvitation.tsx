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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary-light to-background">
      {/* Hero Section - Romantic & Elegant */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.mainImage || weddingHeroSample})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/40 via-secondary/30 to-primary-dark/40" />
        </div>
        
        {/* Decorative floral corners */}
        <div className="absolute top-0 left-0 w-64 h-64 opacity-30">
          <svg viewBox="0 0 200 200" className="w-full h-full text-primary-foreground">
            <path d="M0,0 Q50,50 0,100 Q50,50 100,0 Z" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-30 scale-x-[-1]">
          <svg viewBox="0 0 200 200" className="w-full h-full text-primary-foreground">
            <path d="M0,0 Q50,50 0,100 Q50,50 100,0 Z" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
          <div className="space-y-10 animate-fade-in">
            {/* Ornamental divider top */}
            <div className="flex items-center justify-center gap-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary-foreground to-transparent opacity-60" />
              <Heart className="w-6 h-6 fill-primary-foreground/80 text-primary-foreground animate-pulse" />
              <div className="h-px w-24 bg-gradient-to-l from-transparent via-primary-foreground to-transparent opacity-60" />
            </div>
            
            <p className="text-sm tracking-[0.5em] uppercase font-light opacity-90">Σας προσκαλούμε στον γάμο</p>
            
            <h1 className="font-script text-7xl md:text-9xl lg:text-[10rem] font-light leading-tight italic">
              {data.groomName}
              <span className="block text-5xl md:text-7xl my-8 not-italic font-serif">&</span>
              {data.brideName}
            </h1>
            
            {data.weddingDate && (
              <div className="space-y-4">
                <p className="text-2xl md:text-3xl font-light tracking-[0.2em] capitalize">
                  {formattedDate}
                </p>
              </div>
            )}
            
            {/* Ornamental divider bottom */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary-foreground to-transparent opacity-60" />
              <Heart className="w-6 h-6 fill-primary-foreground/80 text-primary-foreground animate-pulse" />
              <div className="h-px w-24 bg-gradient-to-l from-transparent via-primary-foreground to-transparent opacity-60" />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-14 border-2 border-primary-foreground/40 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-4 bg-primary-foreground/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* Countdown Timer */}
      {data.weddingDate && (
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZmxvcmFsIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIyIiBmaWxsPSIjZjNlOGU4IiBvcGFjaXR5PSIwLjMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZmxvcmFsKSIvPjwvc3ZnPg==')] opacity-40" />
          <div className="relative">
            <CountdownTimer targetDate={data.weddingDate} targetTime={data.weddingTime} />
          </div>
        </section>
      )}

      {/* Invitation Text */}
      {data.invitationText && (
        <section className="relative max-w-4xl mx-auto px-6 py-36">
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
          <div className="relative">
            {/* Decorative top border */}
            <div className="flex items-center justify-center gap-8 mb-16">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="w-3 h-3 rounded-full bg-primary/40" />
              <div className="h-px w-32 bg-gradient-to-l from-transparent via-primary to-transparent" />
            </div>
            
            <div 
              className="prose prose-xl max-w-none text-center [&>p]:text-foreground/80 [&>p]:leading-loose [&>p]:text-xl [&>p]:mb-10 [&>p]:font-light [&>h1]:font-script [&>h1]:italic [&>h2]:font-script [&>h2]:italic [&>h3]:font-serif [&>p]:tracking-wide"
              dangerouslySetInnerHTML={{ __html: data.invitationText }}
            />
            
            {/* Decorative bottom border */}
            <div className="flex items-center justify-center gap-8 mt-16">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="w-3 h-3 rounded-full bg-primary/40" />
              <div className="h-px w-32 bg-gradient-to-l from-transparent via-primary to-transparent" />
            </div>
          </div>
        </section>
      )}

      {/* Couple Section - Romantic */}
      {(data.groomPhoto || data.bridePhoto) && (
        <section className="relative py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary-light/30 via-primary-light/20 to-secondary-light/30" />
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9InBldGFscyIgeD0iMCIgeT0iMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9IiNmMWM0YzQiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGV0YWxzKSIvPjwvc3ZnPg==')]" />
          
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-28">
              {data.groomPhoto && (
                <div className="space-y-10 text-center group">
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 rounded-full blur-3xl scale-90 group-hover:scale-110 transition-all duration-700" />
                    
                    {/* Frame with double border */}
                    <div className="relative w-96 h-96 mx-auto">
                      <div className="absolute inset-0 border-2 border-primary/30 rounded-full -rotate-6" />
                      <div className="absolute inset-0 border-2 border-accent/30 rounded-full rotate-6" />
                      <div className="relative overflow-hidden rounded-full border-4 border-card shadow-romantic">
                        <img 
                          src={data.groomPhoto} 
                          alt={data.groomName} 
                          className="w-full h-full object-cover sepia-[10%] group-hover:sepia-0 group-hover:scale-110 transition-all duration-700"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="font-script text-6xl text-primary italic">{data.groomName}</h2>
                    <div className="flex items-center justify-center gap-4">
                      <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
                      <Heart className="w-4 h-4 fill-primary/40 text-primary" />
                      <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
                    </div>
                  </div>
                </div>
              )}
              {data.bridePhoto && (
                <div className="space-y-10 text-center group">
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-primary/20 to-accent/30 rounded-full blur-3xl scale-90 group-hover:scale-110 transition-all duration-700" />
                    
                    {/* Frame with double border */}
                    <div className="relative w-96 h-96 mx-auto">
                      <div className="absolute inset-0 border-2 border-secondary/30 rounded-full -rotate-6" />
                      <div className="absolute inset-0 border-2 border-accent/30 rounded-full rotate-6" />
                      <div className="relative overflow-hidden rounded-full border-4 border-card shadow-romantic">
                        <img 
                          src={data.bridePhoto} 
                          alt={data.brideName} 
                          className="w-full h-full object-cover sepia-[10%] group-hover:sepia-0 group-hover:scale-110 transition-all duration-700"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="font-script text-6xl text-primary italic">{data.brideName}</h2>
                    <div className="flex items-center justify-center gap-4">
                      <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
                      <Heart className="w-4 h-4 fill-primary/40 text-primary" />
                      <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Koumbaroi Section - Romantic */}
      {data.koumbaroi && data.koumbaroi.length > 0 && data.koumbaroi.some((k: any) => k.col1) && (
        <section className="relative py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-light/40 via-secondary-light/30 to-accent/10" />
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZmxvcmFsLXBhdHRlcm4iIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyIiBmaWxsPSIjZjFjNGM0IiBvcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIxLjUiIGZpbGw9IiNmM2U4ZTgiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNmbG9yYWwtcGF0dGVybikiLz48L3N2Zz4=')]" />
          
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 space-y-8">
              {/* Ornate divider top */}
              <div className="inline-flex items-center gap-6 mb-8">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <Heart className="w-8 h-8 text-primary fill-primary/20 animate-pulse" />
                <div className="h-px w-24 bg-gradient-to-l from-transparent via-primary to-transparent" />
              </div>
              
              <h2 className="font-script text-7xl text-primary tracking-tight italic">Κουμπάροι</h2>
              
              <p className="text-foreground/70 text-xl font-light max-w-3xl mx-auto tracking-wide leading-relaxed">
                Οι αγαπημένοι μας άνθρωποι που θα μας συνοδεύσουν<br />
                σε αυτή την ξεχωριστή στιγμή της ζωής μας
              </p>
              
              {/* Ornate divider bottom */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="w-2 h-2 rounded-full bg-primary/30" />
                <div className="w-3 h-3 rounded-full bg-primary/40" />
                <div className="w-2 h-2 rounded-full bg-primary/30" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-20">
              {data.koumbaroi.filter((k: any) => k.col1).map((koumbaros: any) => (
                <div key={koumbaros.id} className="group">
                  <div className="relative mb-10">
                    {koumbaros.col2 && (
                      <div className="relative">
                        {/* Multi-layered glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-accent/15 to-secondary/25 rounded-full blur-3xl group-hover:blur-[60px] transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-tl from-secondary/20 to-primary/20 rounded-full blur-2xl group-hover:scale-110 transition-all duration-700" />
                        
                        {/* Decorative circles */}
                        <div className="absolute -inset-4 border border-primary/20 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
                        <div className="absolute -inset-2 border border-accent/15 rounded-full" />
                        
                        <div className="relative w-72 h-72 mx-auto overflow-hidden rounded-full border-[6px] border-card shadow-romantic group-hover:shadow-[0_25px_70px_-18px_hsl(15_65%_65%/0.35)] transition-all duration-700">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 mix-blend-overlay" />
                          <img 
                            src={koumbaros.col2} 
                            alt={koumbaros.col1} 
                            className="w-full h-full object-cover saturate-[0.85] group-hover:saturate-100 group-hover:scale-110 transition-all duration-700"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center space-y-4">
                    <h3 className="font-script text-4xl text-primary italic tracking-tight">{koumbaros.col1}</h3>
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-px w-10 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                      <Heart className="w-3 h-3 fill-primary/30 text-primary" />
                      <div className="h-px w-10 bg-gradient-to-l from-transparent via-primary/40 to-transparent" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Families Section - Romantic & Elegant */}
      {((data.groomFamily && data.groomFamily.length > 0) || (data.brideFamily && data.brideFamily.length > 0)) && (
        <section className="relative py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
          
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="text-center mb-24 space-y-8">
              <div className="inline-flex items-center gap-6 mb-8">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-secondary to-transparent" />
                <Heart className="w-8 h-8 text-secondary fill-secondary/20 animate-pulse" />
                <div className="h-px w-24 bg-gradient-to-l from-transparent via-secondary to-transparent" />
              </div>
              
              <h2 className="font-script text-7xl text-secondary tracking-tight italic">Οικογένειες</h2>
              
              <p className="text-foreground/70 text-xl font-light tracking-wide">
                Με την ευλογία και αγάπη των οικογενειών μας
              </p>
              
              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="w-2 h-2 rounded-full bg-secondary/30" />
                <div className="w-3 h-3 rounded-full bg-secondary/40" />
                <div className="w-2 h-2 rounded-full bg-secondary/30" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-20">
              {data.groomFamily && data.groomFamily.length > 0 && (
                <div className="space-y-10">
                  <div className="relative group">
                    {/* Glow backdrop */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/15 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700" />
                    
                    {/* Decorative corners */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 border-l-2 border-t-2 border-primary/30 rounded-tl-3xl" />
                    <div className="absolute -top-4 -right-4 w-12 h-12 border-r-2 border-t-2 border-primary/30 rounded-tr-3xl" />
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 border-l-2 border-b-2 border-primary/30 rounded-bl-3xl" />
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 border-r-2 border-b-2 border-primary/30 rounded-br-3xl" />
                    
                    <div className="relative bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-3xl shadow-romantic p-14 group-hover:shadow-[0_30px_80px_-20px_hsl(15_65%_65%/0.25)] transition-all duration-700">
                      <h3 className="font-script text-5xl text-center text-primary mb-10 tracking-tight italic">
                        Οικογένεια Γαμπρού
                      </h3>
                      
                      <div className="flex items-center justify-center gap-4 mb-10">
                        <div className="h-px w-20 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <Heart className="w-4 h-4 fill-primary/30 text-primary" />
                        <div className="h-px w-20 bg-gradient-to-l from-transparent via-primary/40 to-transparent" />
                      </div>
                      
                      <ul className="space-y-6">
                        {data.groomFamily.map((member: string, idx: number) => (
                          <li key={idx} className="text-2xl text-foreground/80 text-center font-light tracking-wide hover:text-primary transition-colors duration-300">
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {data.brideFamily && data.brideFamily.length > 0 && (
                <div className="space-y-10">
                  <div className="relative group">
                    {/* Glow backdrop */}
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/15 via-primary/10 to-accent/15 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700" />
                    
                    {/* Decorative corners */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 border-l-2 border-t-2 border-secondary/30 rounded-tl-3xl" />
                    <div className="absolute -top-4 -right-4 w-12 h-12 border-r-2 border-t-2 border-secondary/30 rounded-tr-3xl" />
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 border-l-2 border-b-2 border-secondary/30 rounded-bl-3xl" />
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 border-r-2 border-b-2 border-secondary/30 rounded-br-3xl" />
                    
                    <div className="relative bg-card/95 backdrop-blur-sm border-2 border-secondary/20 rounded-3xl shadow-romantic p-14 group-hover:shadow-[0_30px_80px_-20px_hsl(340_45%_75%/0.25)] transition-all duration-700">
                      <h3 className="font-script text-5xl text-center text-secondary mb-10 tracking-tight italic">
                        Οικογένεια Νύφης
                      </h3>
                      
                      <div className="flex items-center justify-center gap-4 mb-10">
                        <div className="h-px w-20 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                        <Heart className="w-4 h-4 fill-secondary/30 text-secondary" />
                        <div className="h-px w-20 bg-gradient-to-l from-transparent via-secondary/40 to-transparent" />
                      </div>
                      
                      <ul className="space-y-6">
                        {data.brideFamily.map((member: string, idx: number) => (
                          <li key={idx} className="text-2xl text-foreground/80 text-center font-light tracking-wide hover:text-secondary transition-colors duration-300">
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Bank Accounts Section - Romantic & Luxurious */}
      {data.bankAccounts && data.bankAccounts.length > 0 && data.bankAccounts.some((b: any) => b.col1 || b.col2) && (
        <section className="relative py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary-light/20 to-secondary-light/20" />
          
          <div className="relative max-w-5xl mx-auto px-6">
            <div className="text-center mb-24 space-y-8">
              <div className="inline-flex items-center gap-6 mb-8">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
                <Gift className="w-8 h-8 text-accent animate-pulse" />
                <div className="h-px w-24 bg-gradient-to-l from-transparent via-accent to-transparent" />
              </div>
              
              <h2 className="font-script text-7xl text-accent tracking-tight italic">Αριθμοί Κατάθεσης</h2>
              
              <p className="text-foreground/70 text-xl font-light max-w-3xl mx-auto tracking-wide leading-relaxed">
                Αν επιθυμείτε να μας τιμήσετε με κάποιο δώρο,<br />
                θα χαρούμε να το υποδεχθούμε με την πιο ευγνώμονη καρδιά
              </p>
              
              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="w-2 h-2 rounded-full bg-accent/30" />
                <div className="w-3 h-3 rounded-full bg-accent/40" />
                <div className="w-2 h-2 rounded-full bg-accent/30" />
              </div>
            </div>
            
            <div className="space-y-10">
              {data.bankAccounts.filter((b: any) => b.col1 || b.col2).map((account: any, idx: number) => (
                <div key={account.id} className="group relative">
                  {/* Multi-layer glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/15 via-primary/10 to-accent/15 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700" />
                  
                  {/* Decorative frame */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/30 via-primary/20 to-accent/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative bg-card/95 backdrop-blur-xl border-2 border-accent/30 rounded-3xl shadow-romantic p-12 group-hover:shadow-[0_30px_80px_-20px_hsl(25_75%_55%/0.3)] group-hover:border-accent/50 transition-all duration-700">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
                      <div className="flex items-center gap-8">
                        {/* Number badge */}
                        <div className="relative flex-shrink-0 w-20 h-20">
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/30 rounded-2xl blur-md" />
                          <div className="relative w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl border-2 border-accent/30 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                            <span className="font-script text-3xl text-accent italic">{idx + 1}</span>
                          </div>
                        </div>
                        
                        {account.col1 && (
                          <div className="space-y-3">
                            <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-medium">Τράπεζα</p>
                            <p className="text-4xl font-script text-accent italic tracking-tight">{account.col1}</p>
                          </div>
                        )}
                      </div>
                      
                      {account.col2 && (
                        <div className="relative space-y-3 md:text-right">
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl blur-sm" />
                          <div className="relative bg-muted/60 backdrop-blur-sm border border-accent/20 rounded-2xl p-8">
                            <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-medium mb-3">IBAN</p>
                            <p className="text-xl font-mono text-foreground/90 tracking-wider">{account.col2}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Information Section - Romantic */}
      {data.contactInfo && (
        <section className="relative py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary-light/40 to-background" />
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImhlYXJ0cyIgeD0iMCIgeT0iMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIxLjUiIGZpbGw9IiNmMWM0YzQiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjaGVhcnRzKSIvPjwvc3ZnPg==')]" />
          
          <div className="relative max-w-4xl mx-auto px-6">
            <div className="text-center mb-24 space-y-8">
              <div className="inline-flex items-center gap-6 mb-8">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-secondary to-transparent" />
                <Heart className="w-8 h-8 text-secondary fill-secondary/20 animate-pulse" />
                <div className="h-px w-24 bg-gradient-to-l from-transparent via-secondary to-transparent" />
              </div>
              
              <h2 className="font-script text-7xl text-secondary tracking-tight italic">Στοιχεία Επικοινωνίας</h2>
              
              <p className="text-foreground/70 text-xl font-light tracking-wide">
                Για οποιαδήποτε πληροφορία, είμαστε στη διάθεσή σας
              </p>
              
              <div className="flex items-center justify-center gap-4 pt-4">
                <div className="w-2 h-2 rounded-full bg-secondary/30" />
                <div className="w-3 h-3 rounded-full bg-secondary/40" />
                <div className="w-2 h-2 rounded-full bg-secondary/30" />
              </div>
            </div>
            
            <div className="relative group">
              {/* Glowing backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/15 via-primary/10 to-accent/15 rounded-[2rem] blur-3xl group-hover:blur-[60px] transition-all duration-700" />
              
              {/* Decorative ornate corners */}
              <div className="absolute -top-6 -left-6 w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full text-secondary/30">
                  <path d="M0,50 Q25,25 50,0 M0,50 Q25,75 50,100" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="absolute -top-6 -right-6 w-16 h-16 scale-x-[-1]">
                <svg viewBox="0 0 100 100" className="w-full h-full text-secondary/30">
                  <path d="M0,50 Q25,25 50,0 M0,50 Q25,75 50,100" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 scale-y-[-1]">
                <svg viewBox="0 0 100 100" className="w-full h-full text-secondary/30">
                  <path d="M0,50 Q25,25 50,0 M0,50 Q25,75 50,100" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 scale-[-1]">
                <svg viewBox="0 0 100 100" className="w-full h-full text-secondary/30">
                  <path d="M0,50 Q25,25 50,0 M0,50 Q25,75 50,100" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              
              <div className="relative bg-card/95 backdrop-blur-xl border-2 border-secondary/20 rounded-[2rem] shadow-romantic p-20 group-hover:shadow-[0_35px_90px_-25px_hsl(340_45%_75%/0.35)] transition-all duration-700">
                <div 
                  className="prose prose-xl max-w-none text-center [&>p]:text-foreground/80 [&>p]:leading-loose [&>p]:text-2xl [&>p]:mb-8 [&>h1]:font-script [&>h1]:italic [&>h2]:font-script [&>h2]:italic [&>h3]:font-serif [&>p]:font-light [&>p]:tracking-wide"
                  dangerouslySetInnerHTML={{ __html: data.contactInfo }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Church Location - Elegant Map Section */}
      {data.churchPosition && (
        <section className="max-w-7xl mx-auto px-6 py-32 bg-muted/20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-5xl text-foreground">Εκκλησία</h2>
            <p className="text-2xl text-muted-foreground font-light">{data.churchLocation}</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-center gap-3">
              <Button 
                variant={activeTab === 'map' ? 'default' : 'outline'}
                onClick={() => setActiveTab('map')}
                className="h-12 px-8"
              >
                Χάρτης
              </Button>
              <Button 
                variant={activeTab === 'satellite' ? 'default' : 'outline'}
                onClick={() => setActiveTab('satellite')}
                className="h-12 px-8"
              >
                Δορυφόρος
              </Button>
            </div>
            
            <div className="h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-border/50">
              <MapDisplay 
                position={data.churchPosition}
                locationName={data.churchLocation}
                mapType={activeTab}
              />
            </div>
            
            <div className="text-center">
              <Button onClick={() => openDirections(data.churchPosition)} size="lg" variant="outline" className="h-14 px-10">
                <MapPin className="w-5 h-5 mr-2" />
                Οδηγίες Πλοήγησης
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Reception */}
      {data.receptionLocation && data.receptionPosition && (
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-5xl text-foreground">Δεξίωση</h2>
            <p className="text-2xl text-muted-foreground font-light">{data.receptionLocation}</p>
          </div>
          
          <div className="h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-border/50">
            <MapDisplay 
              position={data.receptionPosition}
              locationName={data.receptionLocation}
            />
          </div>
          
          <div className="text-center mt-8">
            <Button onClick={() => openDirections(data.receptionPosition)} size="lg" variant="outline" className="h-14 px-10">
              <MapPin className="w-5 h-5 mr-2" />
              Οδηγίες Πλοήγησης
            </Button>
          </div>
        </section>
      )}

      {/* Events Timeline - Premium Design */}
      {events && events.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-32 bg-muted/20">
          <h2 className="font-serif text-5xl text-center mb-20 text-foreground">Πρόγραμμα Εκδήλωσης</h2>
          <div className="space-y-6">
            {events.map((event, idx) => (
              <div key={event.id} className="bg-card border border-border/50 rounded-xl shadow-lg p-10 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-8">
                  <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0 font-serif text-2xl">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-3xl font-serif text-foreground">{event.eventName}</h3>
                    {event.eventDescription && (
                      <p className="text-muted-foreground text-lg leading-relaxed">{event.eventDescription}</p>
                    )}
                    <div className="flex flex-wrap gap-6 text-base">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span>{format(new Date(event.eventDate), "d MMMM yyyy", { locale: el })}</span>
                      </div>
                      {event.eventTime && (
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Clock className="w-5 h-5 text-primary" />
                          <span>{event.eventTime}</span>
                        </div>
                      )}
                      {event.locationName && (
                        <div className="flex items-center gap-2 text-foreground/70">
                          <MapPin className="w-5 h-5 text-primary" />
                          <span>{event.locationName}</span>
                        </div>
                      )}
                    </div>
                    {event.locationLat && event.locationLng && (
                      <Button 
                        variant="outline" 
                        size="default"
                        className="mt-4"
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${event.locationLat},${event.locationLng}`, '_blank')}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
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

      {/* Gift Registry - Elegant Cards */}
      {giftItems && giftItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-20 space-y-4">
            <Gift className="w-12 h-12 mx-auto text-primary" />
            <h2 className="font-serif text-5xl text-foreground">Λίστα Δώρων</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {giftItems.map((item) => (
              <div key={item.id} className="bg-card border border-border/50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
                {item.imageUrl && (
                  <div className="relative h-56 overflow-hidden bg-muted">
                    <img 
                      src={item.imageUrl} 
                      alt={item.itemName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-serif text-foreground">{item.itemName}</h3>
                  {item.itemDescription && (
                    <p className="text-muted-foreground leading-relaxed">{item.itemDescription}</p>
                  )}
                  {item.price && (
                    <p className="text-2xl font-semibold text-primary">{item.price}€</p>
                  )}
                  {item.storeUrl && (
                    <Button 
                      variant="outline" 
                      className="w-full h-12"
                      onClick={() => window.open(item.storeUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {item.storeName || 'Προβολή'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery - Premium Grid */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-32 bg-muted/20">
          <h2 className="font-serif text-5xl text-center mb-20 text-foreground">Φωτογραφίες</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.gallery.map((img: any) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-xl shadow-lg group">
                <img 
                  src={img.url} 
                  alt="" 
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Live Photo Wall */}
      <LivePhotoWall invitationId={invitation.id} />

      {/* RSVP Section - Premium */}
      <section className="max-w-5xl mx-auto px-6 py-32">
        <div className="text-center mb-16 space-y-6">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-6xl text-foreground">Επιβεβαίωση Παρουσίας</h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            Θα χαρούμε πολύ να γιορτάσετε μαζί μας
          </p>
        </div>
        <RSVPForm invitationId={invitation.id} invitationType="wedding" invitationTitle={data.title} />
      </section>

      {/* Footer - Elegant */}
      <footer className="bg-card border-t border-border/50 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <Heart className="w-10 h-10 mx-auto text-primary/50" />
          <p className="font-serif text-4xl text-foreground/80">
            {data.groomName} & {data.brideName}
          </p>
        </div>
      </footer>
    </div>
  );
}