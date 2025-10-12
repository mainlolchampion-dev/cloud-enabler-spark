import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Webhook, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebhookIntegrationProps {
  invitationId: string;
  currentWebhookUrl?: string;
  onSave: (webhookUrl: string) => Promise<void>;
}

export const WebhookIntegration = ({ 
  invitationId, 
  currentWebhookUrl = "",
  onSave 
}: WebhookIntegrationProps) => {
  const [webhookUrl, setWebhookUrl] = useState(currentWebhookUrl);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleTest = async () => {
    if (!webhookUrl) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ εισάγετε ένα URL webhook",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          event: "test",
          invitation_id: invitationId,
          timestamp: new Date().toISOString(),
          message: "Test webhook from Wedding Invitation Platform"
        }),
      });

      toast({
        title: "Webhook Test",
        description: "Το αίτημα στάλθηκε. Ελέγξτε το Zapier/Make για επιβεβαίωση.",
      });
    } catch (error) {
      console.error("Webhook test error:", error);
      toast({
        title: "Αποστολή Ολοκληρώθηκε",
        description: "Το webhook καλέστηκε. Ελέγξτε το Zapier/Make.",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(webhookUrl);
      toast({
        title: "Αποθηκεύτηκε!",
        description: "Το webhook URL ενημερώθηκε επιτυχώς.",
      });
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία αποθήκευσης του webhook.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="w-5 h-5" />
          Zapier/Make Webhooks
        </CardTitle>
        <CardDescription>
          Συνδέστε την πρόσκλησή σας με Zapier ή Make για αυτοματοποίηση
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <Input
            id="webhook-url"
            type="url"
            placeholder="https://hooks.zapier.com/hooks/catch/..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Το webhook θα κληθεί όταν υπάρχει νέο RSVP ή ενημέρωση καλεσμένου
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleTest}
            disabled={testing || !webhookUrl}
            className="flex-1"
          >
            {testing ? "Δοκιμή..." : "Δοκιμή Webhook"}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving || !webhookUrl}
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-2" />
            {saving ? "Αποθήκευση..." : "Αποθήκευση"}
          </Button>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium">Πώς να το ρυθμίσετε:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Δημιουργήστε ένα Zap ή Scenario</li>
                <li>Επιλέξτε "Webhooks" ως trigger</li>
                <li>Αντιγράψτε το webhook URL</li>
                <li>Επικολλήστε το εδώ και αποθηκεύστε</li>
              </ol>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
