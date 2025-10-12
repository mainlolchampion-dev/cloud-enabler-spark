import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, MessageSquare, Clock, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RSVPResponse } from "@/lib/rsvpStorage";
import { useSubscription } from "@/hooks/useSubscription";

interface ReminderSchedulerProps {
  invitationId: string;
  rsvps: RSVPResponse[];
  eventDate?: string;
}

export function ReminderScheduler({ invitationId, rsvps, eventDate }: ReminderSchedulerProps) {
  const { hasFeature } = useSubscription();
  const [reminderType, setReminderType] = useState<"email" | "sms">("email");
  const [reminderTiming, setReminderTiming] = useState<"7" | "3" | "1">("7");
  const [sending, setSending] = useState(false);

  const attendingRsvps = rsvps.filter(r => r.willAttend === 'yes');
  const canSendSMS = hasFeature("smsReminders");

  const handleSendReminders = async () => {
    setSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Πρέπει να συνδεθείτε");
        return;
      }

      const functionName = reminderType === "email" 
        ? "send-email-reminder" 
        : "send-rsvp-sms";

      let successCount = 0;
      let failCount = 0;

      for (const rsvp of attendingRsvps) {
        try {
          const { error } = await supabase.functions.invoke(functionName, {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            body: {
              to: reminderType === "email" ? rsvp.email : rsvp.phone,
              name: rsvp.name,
              invitationId: invitationId,
              daysUntilEvent: parseInt(reminderTiming),
            },
          });

          if (error) {
            console.error(`Failed to send to ${rsvp.name}:`, error);
            failCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.error(`Error sending to ${rsvp.name}:`, err);
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(
          `${successCount} υπενθυμίσεις στάλθηκαν επιτυχώς!` +
          (failCount > 0 ? ` (${failCount} αποτυχίες)` : "")
        );
      } else {
        toast.error("Δεν στάλθηκε καμία υπενθύμιση");
      }
    } catch (error) {
      console.error("Error sending reminders:", error);
      toast.error("Σφάλμα κατά την αποστολή υπενθυμίσεων");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Υπενθυμίσεις Εκδήλωσης
            </CardTitle>
            <CardDescription>
              Στείλτε υπενθυμίσεις σε όσους έχουν επιβεβαιώσει παρουσία
            </CardDescription>
          </div>
          <Badge variant="outline">
            {attendingRsvps.length} καλεσμένοι
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {attendingRsvps.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Δεν υπάρχουν καλεσμένοι που έχουν επιβεβαιώσει παρουσία</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Τύπος Υπενθύμισης</label>
                <Select
                  value={reminderType}
                  onValueChange={(value: "email" | "sms") => setReminderType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </div>
                    </SelectItem>
                    <SelectItem value="sms" disabled={!canSendSMS}>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        SMS {!canSendSMS && "(Premium)"}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Χρονική Στιγμή</label>
                <Select
                  value={reminderTiming}
                  onValueChange={(value: "7" | "3" | "1") => setReminderTiming(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 ημέρες πριν</SelectItem>
                    <SelectItem value="3">3 ημέρες πριν</SelectItem>
                    <SelectItem value="1">1 ημέρα πριν</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">Προεπισκόπηση:</p>
              <p className="text-sm text-muted-foreground">
                Θα σταλούν {attendingRsvps.length} {reminderType === "email" ? "emails" : "SMS"} στους 
                καλεσμένους που έχουν επιβεβαιώσει παρουσία, {reminderTiming} ημέρες πριν την εκδήλωση.
              </p>
            </div>

            <Button 
              onClick={handleSendReminders} 
              disabled={sending || attendingRsvps.length === 0}
              className="w-full"
              size="lg"
            >
              <Send className="w-4 h-4 mr-2" />
              {sending ? "Αποστολή..." : `Αποστολή ${attendingRsvps.length} Υπενθυμίσεων`}
            </Button>

            {reminderType === "sms" && !canSendSMS && (
              <p className="text-xs text-center text-muted-foreground">
                Οι SMS υπενθυμίσεις απαιτούν Premium πλάνο
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}