import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Share2, Copy, Facebook, Twitter, Mail, Heart } from 'lucide-react';
import { PremiumTemplateConfig } from '@/config/premiumTemplates';
import { getInvitation, submitRSVP } from '@/utils/invitationApi';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function PublicInvitationView() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [template, setTemplate] = useState<PremiumTemplateConfig | null>(null);
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [rsvpData, setRsvpData] = useState({
    name: '',
    email: '',
    phone: '',
    attending: true,
    message: ''
  });

  useEffect(() => {
    if (!id) return;
    
    const loadInvitation = async () => {
      try {
        const response = await getInvitation(id);
        setInvitation(response.invitation);
        setTemplate(response.invitation.templateData);
      } catch (error) {
        console.error('Failed to load invitation:', error);
        toast.error('Failed to load invitation');
      } finally {
        setLoading(false);
      }
    };

    loadInvitation();
  }, [id]);

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    try {
      await submitRSVP(id, rsvpData);
      toast.success('✅ RSVP submitted successfully!');
      setRsvpModalOpen(false);
      setRsvpData({
        name: '',
        email: '',
        phone: '',
        attending: true,
        message: ''
      });
    } catch (error) {
      toast.error('Failed to submit RSVP');
    }
  };

  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('📋 Link copied to clipboard!');
  };

  const handleShare = (platform: string) => {
    const text = `You're invited! Check out this invitation: ${shareUrl}`;
    
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      email: `mailto:?subject=You're Invited!&body=${encodeURIComponent(text)}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (!template || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <Card className="p-12 text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-semibold mb-2">Invitation Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This invitation may have been removed or the link is incorrect.
          </p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header with Actions */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Heart className="h-4 w-4 text-primary" fill="currentColor" />
            <span className="font-medium">WediLink</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShareModalOpen(true)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              size="sm"
              onClick={() => setRsvpModalOpen(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              RSVP
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section 
          className="relative h-screen flex flex-col items-center justify-center text-white p-8"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${template.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Category Badge */}
          <div 
            className="absolute top-24 right-6 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border"
            style={{
              backgroundColor: `${template.accentColor}33`,
              borderColor: template.accentColor
            }}
          >
            {template.category}
          </div>

          {/* Main Content */}
          <div className="text-center space-y-6 max-w-2xl animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-serif font-bold drop-shadow-2xl">
              {template.title}
            </h1>
            
            {template.subtitle && (
              <p className="text-2xl font-light tracking-wide drop-shadow-lg">
                {template.subtitle}
              </p>
            )}

            <p className="text-4xl md:text-5xl font-serif italic drop-shadow-2xl mt-12">
              {template.names}
            </p>

            {/* Date & Venue */}
            {(template.date || template.venue) && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16 text-lg">
                {template.date && (
                  <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                    <Calendar className="h-6 w-6" />
                    <span className="font-medium">
                      {format(new Date(template.date), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                )}
                {template.venue && (
                  <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
                    <MapPin className="h-6 w-6" />
                    <span className="font-medium">{template.venue}</span>
                  </div>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => setRsvpModalOpen(true)}
                style={{ backgroundColor: template.accentColor }}
              >
                <Calendar className="h-5 w-5 mr-2" />
                RSVP Now
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30"
                onClick={() => setShareModalOpen(true)}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/50 rounded-full" />
            </div>
          </div>

          {/* Accent decoration */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-2"
            style={{ backgroundColor: template.accentColor }}
          />
        </section>

        {/* Description Section */}
        {template.description && (
          <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-3xl text-center">
              <h2 className="text-3xl font-serif font-bold mb-8">Our Story</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {template.description}
              </p>
            </div>
          </section>
        )}

        {/* Details Section */}
        <section 
          className="py-24 text-white"
          style={{
            background: `linear-gradient(135deg, ${template.accentColor} 0%, ${template.secondaryColor} 100%)`
          }}
        >
          <div className="container mx-auto px-6 max-w-3xl text-center space-y-8">
            <h2 className="text-4xl font-serif font-bold">Event Details</h2>
            <p className="text-xl text-white/90">
              Join us for a {template.mood.toLowerCase()} celebration
            </p>
            
            {template.date && (
              <div className="pt-8">
                <div className="inline-block px-8 py-4 bg-white/20 backdrop-blur-md rounded-2xl">
                  <p className="text-sm uppercase tracking-wider mb-2 text-white/80">Save the Date</p>
                  <p className="text-3xl font-bold">
                    {format(new Date(template.date), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}

            {template.venue && (
              <div className="pt-4">
                <div className="inline-block px-8 py-4 bg-white/20 backdrop-blur-md rounded-2xl">
                  <p className="text-sm uppercase tracking-wider mb-2 text-white/80">Location</p>
                  <p className="text-2xl font-semibold">{template.venue}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6 text-center max-w-2xl">
            <h2 className="text-4xl font-serif font-bold mb-6">
              Will You Join Us?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We'd love to celebrate with you! Please let us know if you can make it.
            </p>
            <Button
              size="lg"
              className="text-lg px-12 py-6"
              onClick={() => setRsvpModalOpen(true)}
              style={{ backgroundColor: template.accentColor }}
            >
              <Calendar className="h-5 w-5 mr-2" />
              RSVP Now
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-background border-t">
          <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
            <p>
              Created with <Heart className="h-4 w-4 inline-block text-primary" fill="currentColor" /> using{' '}
              <a href="/" className="font-medium text-foreground hover:text-primary transition-colors">
                WediLink
              </a>
            </p>
          </div>
        </footer>
      </main>

      {/* RSVP Modal */}
      <Dialog open={rsvpModalOpen} onOpenChange={setRsvpModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>RSVP for {template.names}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleRSVPSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                required
                value={rsvpData.name}
                onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={rsvpData.email}
                onChange={(e) => setRsvpData({ ...rsvpData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={rsvpData.phone}
                onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })}
                placeholder="+30 123 456 7890"
              />
            </div>

            <div className="space-y-2">
              <Label>Will you attend?</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={rsvpData.attending ? 'default' : 'outline'}
                  onClick={() => setRsvpData({ ...rsvpData, attending: true })}
                  className="flex-1"
                >
                  ✅ Yes, I'll be there
                </Button>
                <Button
                  type="button"
                  variant={!rsvpData.attending ? 'default' : 'outline'}
                  onClick={() => setRsvpData({ ...rsvpData, attending: false })}
                  className="flex-1"
                >
                  ❌ Can't make it
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                value={rsvpData.message}
                onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })}
                placeholder="Your wishes or dietary requirements..."
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" style={{ backgroundColor: template.accentColor }}>
              Submit RSVP
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Invitation</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Copy Link */}
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Social Sharing */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleShare('facebook')}
                className="gap-2"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare('twitter')}
                className="gap-2"
              >
                <Twitter className="h-5 w-5 text-sky-500" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare('whatsapp')}
                className="gap-2"
              >
                <span className="text-xl">💬</span>
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare('email')}
                className="gap-2"
              >
                <Mail className="h-5 w-5" />
                Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
