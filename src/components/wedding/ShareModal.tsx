import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Share2, MessageCircle, Facebook, Instagram } from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationUrl: string;
  title: string;
}

export function ShareModal({ open, onOpenChange, invitationUrl, title }: ShareModalProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationUrl);
    toast.success("Ο σύνδεσμος αντιγράφηκε!");
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n${invitationUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareFacebook = () => {
    const url = encodeURIComponent(invitationUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareMessenger = () => {
    const url = encodeURIComponent(invitationUrl);
    window.open(`https://www.facebook.com/dialog/send?link=${url}&app_id=YOUR_APP_ID&redirect_uri=${invitationUrl}`, '_blank');
  };

  const shareGeneric = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: invitationUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Κοινοποίηση Πρόσκλησης</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* QR Code */}
          <div className="flex justify-center p-4 bg-white rounded-lg">
            <QRCodeSVG value={invitationUrl} size={200} />
          </div>

          {/* URL Display */}
          <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
            <input
              type="text"
              value={invitationUrl}
              readOnly
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <Button size="sm" variant="ghost" onClick={copyToClipboard}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {/* Copy Link Button */}
          <Button onClick={copyToClipboard} className="w-full" size="lg">
            <Copy className="w-4 h-4 mr-2" />
            Αντιγραφή Συνδέσμου
          </Button>

          {/* Share Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Κοινοποίηση σε:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={shareWhatsApp}>
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button variant="outline" onClick={shareFacebook}>
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button variant="outline" onClick={shareMessenger}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Messenger
              </Button>
              <Button variant="outline" onClick={shareGeneric}>
                <Share2 className="w-4 h-4 mr-2" />
                Περισσότερα
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
