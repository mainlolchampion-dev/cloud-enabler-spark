import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Share2, Facebook, Twitter, Mail, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

interface ShareSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  invitationName: string;
}

export function ShareSuccessModal({ 
  open, 
  onOpenChange, 
  shareUrl, 
  invitationName 
}: ShareSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('📋 Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = `You're invited to ${invitationName}! Check out the invitation:`;
    
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`,
      email: `mailto:?subject=You're Invited to ${invitationName}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif flex items-center gap-2">
            🎉 Invitation Created Successfully!
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6 mt-4"
        >
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-center">
              Your beautiful invitation is now live and ready to share with your guests!
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-white p-4 rounded-xl shadow-lg"
            >
              <QRCodeSVG
                value={shareUrl}
                size={200}
                level="H"
                includeMargin
              />
              <p className="text-xs text-center text-muted-foreground mt-2">
                Scan to view invitation
              </p>
            </motion.div>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Shareable Link</label>
            <div className="flex gap-2">
              <Input 
                value={shareUrl} 
                readOnly 
                className="flex-1 bg-muted"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button 
                onClick={handleCopy}
                variant={copied ? "default" : "outline"}
                className="gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Share On</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleShare('facebook')}
                className="gap-2 hover:bg-blue-50 hover:border-blue-300"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare('twitter')}
                className="gap-2 hover:bg-sky-50 hover:border-sky-300"
              >
                <Twitter className="h-5 w-5 text-sky-500" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare('whatsapp')}
                className="gap-2 hover:bg-green-50 hover:border-green-300"
              >
                <span className="text-xl">💬</span>
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare('email')}
                className="gap-2 hover:bg-purple-50 hover:border-purple-300"
              >
                <Mail className="h-5 w-5 text-purple-600" />
                Email
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              className="flex-1 gap-2" 
              onClick={() => window.open(shareUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              View Invitation
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
