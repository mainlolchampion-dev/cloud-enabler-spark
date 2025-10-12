import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { saveRSVP } from "@/lib/rsvpStorage";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RSVPFormProps {
  invitationId: string;
  invitationType: 'wedding' | 'baptism' | 'party';
  invitationTitle?: string;
}

export function RSVPForm({ invitationId, invitationType, invitationTitle }: RSVPFormProps) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfGuests: '1',
    willAttend: 'yes' as 'yes' | 'no' | 'maybe',
    dietaryRestrictions: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ συμπληρώστε το όνομα και το email σας",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save RSVP to database
      const rsvp = await saveRSVP({
        invitationId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        numberOfGuests: parseInt(formData.numberOfGuests),
        willAttend: formData.willAttend,
        dietaryRestrictions: formData.dietaryRestrictions,
        message: formData.message,
      });

      // Send confirmation email
      try {
        await supabase.functions.invoke('send-rsvp-confirmation', {
          body: {
            rsvpId: rsvp.id,
            invitationId,
            name: formData.name,
            email: formData.email,
            willAttend: formData.willAttend,
            numberOfGuests: parseInt(formData.numberOfGuests),
            invitationTitle,
            invitationType,
          },
        });
        console.log('✅ Confirmation email sent');
      } catch (emailError) {
        console.error('⚠️ Email sending failed:', emailError);
        // Don't fail the RSVP if email fails
      }

      // Try to send SMS notification to invitation owner if they have premium plan
      try {
        const { data: invitation } = await supabase
          .from('invitations')
          .select('user_id, webhook_url')
          .eq('id', invitationId)
          .single();

        if (invitation?.user_id) {
          // Send webhook if configured (Plus/Premium feature)
          if (invitation.webhook_url) {
            try {
              await fetch(invitation.webhook_url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                mode: "no-cors",
                body: JSON.stringify({
                  event: "rsvp_created",
                  invitation_id: invitationId,
                  rsvp: {
                    name: formData.name,
                    email: formData.email,
                    will_attend: formData.willAttend,
                    number_of_guests: parseInt(formData.numberOfGuests),
                  },
                  timestamp: new Date().toISOString(),
                }),
              });
              console.log('✅ Webhook triggered');
            } catch (webhookError) {
              console.error('⚠️ Webhook failed:', webhookError);
            }
          }

          const { data: subscription } = await supabase
            .from('user_subscriptions')
            .select('plan_type')
            .eq('user_id', invitation.user_id)
            .single();

          if (subscription && (subscription.plan_type === 'plus' || subscription.plan_type === 'premium')) {
            // Get owner's phone from auth.users metadata or profiles table
            // For now, we'll skip SMS if no phone is found
            const { data: { user: ownerUser } } = await supabase.auth.admin.getUserById(invitation.user_id);
            const ownerPhone = ownerUser?.phone;

            if (ownerPhone) {
              await supabase.functions.invoke('send-rsvp-sms', {
                body: {
                  to: ownerPhone,
                  guestName: formData.name,
                  eventTitle: invitationTitle || 'την εκδήλωσή σας',
                  willAttend: formData.willAttend,
                },
              });
              console.log('✅ SMS notification sent to owner');
            }
          }
        }
      } catch (smsError) {
        console.error('⚠️ SMS sending failed:', smsError);
        // Don't fail the RSVP if SMS fails
      }

      setSubmitted(true);
      toast({
        title: "Επιτυχία!",
        description: "Η απάντησή σας καταχωρήθηκε με επιτυχία.",
      });
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε πρόβλημα κατά την αποστολή της απάντησής σας. Παρακαλώ δοκιμάστε ξανά.",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto animate-scale-in">
        <CardContent className="pt-12 pb-12 text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
          <h3 className="text-2xl font-serif">Ευχαριστούμε!</h3>
          <p className="text-muted-foreground">
            Η απάντησή σας έχει καταχωρηθεί με επιτυχία. Ανυπομονούμε να σας δούμε!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-3xl font-serif text-center">RSVP</CardTitle>
        <CardDescription className="text-center text-base">
          Παρακαλούμε επιβεβαιώστε την παρουσία σας
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Ονοματεπώνυμο *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Εισάγετε το όνομά σας"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Τηλέφωνο</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+30 69X XXX XXXX"
            />
          </div>

          {/* Will Attend */}
          <div className="space-y-3">
            <Label>Θα παραβρεθείτε; *</Label>
            <RadioGroup
              value={formData.willAttend}
              onValueChange={(value) => setFormData({ ...formData, willAttend: value as any })}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Ναι, θα έρθω</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="flex items-center gap-2 cursor-pointer flex-1">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span>Δυστυχώς δεν θα μπορέσω</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                <RadioGroupItem value="maybe" id="maybe" />
                <Label htmlFor="maybe" className="flex items-center gap-2 cursor-pointer flex-1">
                  <HelpCircle className="w-5 h-5 text-yellow-600" />
                  <span>Ίσως</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Number of Guests */}
          {formData.willAttend === 'yes' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="guests">Αριθμός Ατόμων</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.numberOfGuests}
                  onChange={(e) => setFormData({ ...formData, numberOfGuests: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  Συμπεριλαμβανομένου εσάς
                </p>
              </div>

              {/* Dietary Restrictions */}
              <div className="space-y-2">
                <Label htmlFor="dietary">Διατροφικοί Περιορισμοί / Αλλεργίες</Label>
                <Input
                  id="dietary"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                  placeholder="π.χ. Χορτοφαγία, αλλεργίες κ.λπ."
                />
              </div>
            </>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Μήνυμα (προαιρετικό)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Γράψτε ένα μήνυμα..."
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" size="lg" className="w-full">
            Αποστολή Απάντησης
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
