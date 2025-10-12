import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, MessageSquare, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradePrompt } from "@/components/subscription/UpgradePrompt";

interface NotificationPreferences {
  email_reminders: boolean;
  sms_reminders: boolean;
  email_rsvp_confirmations: boolean;
  email_updates: boolean;
  reminder_days_before: number;
}

export default function NotificationPreferences() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { hasFeature } = useSubscription();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_reminders: true,
    sms_reminders: false,
    email_rsvp_confirmations: true,
    email_updates: true,
    reminder_days_before: 7,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          email_reminders: data.email_reminders,
          sms_reminders: data.sms_reminders,
          email_rsvp_confirmations: data.email_rsvp_confirmations,
          email_updates: data.email_updates,
          reminder_days_before: data.reminder_days_before,
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Σφάλμα φόρτωσης προτιμήσεων');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
        });

      if (error) throw error;

      toast.success('Οι προτιμήσεις αποθηκεύτηκαν επιτυχώς');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Σφάλμα αποθήκευσης προτιμήσεων');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Φόρτωση...</div>
      </div>
    );
  }

  const hasSMSFeature = hasFeature('smsReminders');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-primary" />
            <h1 className="font-serif text-4xl font-bold text-foreground">
              Προτιμήσεις Ειδοποιήσεων
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Διαχειριστείτε πώς και πότε θέλετε να λαμβάνετε ειδοποιήσεις
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <CardTitle>Email Ειδοποιήσεις</CardTitle>
              </div>
              <CardDescription>
                Ρυθμίστε τις email ειδοποιήσεις για τα events σας
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-reminders">Υπενθυμίσεις Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Λάβετε email υπενθυμίσεις πριν την εκδήλωση
                  </p>
                </div>
                <Switch
                  id="email-reminders"
                  checked={preferences.email_reminders}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, email_reminders: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="rsvp-confirmations">Επιβεβαιώσεις RSVP</Label>
                  <p className="text-sm text-muted-foreground">
                    Λάβετε email όταν κάποιος απαντήσει στην πρόσκληση
                  </p>
                </div>
                <Switch
                  id="rsvp-confirmations"
                  checked={preferences.email_rsvp_confirmations}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, email_rsvp_confirmations: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-updates">Ενημερώσεις Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Λάβετε newsletter και ενημερώσεις για νέες δυνατότητες
                  </p>
                </div>
                <Switch
                  id="email-updates"
                  checked={preferences.email_updates}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, email_updates: checked })
                  }
                />
              </div>

              {preferences.email_reminders && (
                <div className="space-y-2">
                  <Label htmlFor="reminder-days">Ημέρες πριν την υπενθύμιση</Label>
                  <Select
                    value={preferences.reminder_days_before.toString()}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, reminder_days_before: parseInt(value) })
                    }
                  >
                    <SelectTrigger id="reminder-days">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 ημέρα πριν</SelectItem>
                      <SelectItem value="3">3 ημέρες πριν</SelectItem>
                      <SelectItem value="7">7 ημέρες πριν</SelectItem>
                      <SelectItem value="14">14 ημέρες πριν</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SMS Notifications */}
          {hasSMSFeature ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <CardTitle>SMS Ειδοποιήσεις</CardTitle>
                </div>
                <CardDescription>
                  Λάβετε SMS υπενθυμίσεις για τα events σας
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-reminders">Υπενθυμίσεις SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Λάβετε SMS υπενθυμίσεις πριν την εκδήλωση
                    </p>
                  </div>
                  <Switch
                    id="sms-reminders"
                    checked={preferences.sms_reminders}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, sms_reminders: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <UpgradePrompt
              feature="SMS Ειδοποιήσεις"
              requiredPlan="premium"
              description="Αναβαθμίστε σε Premium για να λαμβάνετε SMS υπενθυμίσεις για τα events σας."
            />
          )}

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="w-full"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Αποθήκευση...' : 'Αποθήκευση Προτιμήσεων'}
          </Button>
        </div>
      </div>
    </div>
  );
}
