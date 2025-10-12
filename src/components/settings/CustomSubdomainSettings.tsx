import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, Check, X, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CustomSubdomainSettingsProps {
  invitationId: string;
  currentSubdomain?: string;
  onSubdomainUpdate?: (subdomain: string) => void;
}

export function CustomSubdomainSettings({
  invitationId,
  currentSubdomain,
  onSubdomainUpdate,
}: CustomSubdomainSettingsProps) {
  const [subdomain, setSubdomain] = useState(currentSubdomain || "");
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSubdomain(currentSubdomain || "");
  }, [currentSubdomain]);

  const validateSubdomain = (value: string): boolean => {
    // Only lowercase letters, numbers, and hyphens
    // Must start with a letter
    // Length between 3-30 characters
    const regex = /^[a-z][a-z0-9-]{2,29}$/;
    return regex.test(value);
  };

  const checkAvailability = async () => {
    if (!subdomain.trim()) {
      toast.error("Εισάγετε ένα subdomain");
      return;
    }

    if (!validateSubdomain(subdomain)) {
      toast.error("Μη έγκυρο subdomain. Χρησιμοποιήστε μόνο πεζά γράμματα, αριθμούς και παύλες (3-30 χαρακτήρες)");
      return;
    }

    setChecking(true);
    try {
      // Check if subdomain is already taken using RPC or direct query
      const response = await (supabase as any)
        .from("invitations")
        .select("id")
        .eq("custom_subdomain", subdomain)
        .neq("id", invitationId);

      const isAvailable = !response.data || response.data.length === 0;
      setAvailable(isAvailable);

      if (isAvailable) {
        toast.success("Το subdomain είναι διαθέσιμο!");
      } else {
        toast.error("Το subdomain χρησιμοποιείται ήδη");
      }
    } catch (error) {
      console.error("Error checking subdomain:", error);
      toast.error("Σφάλμα κατά τον έλεγχο διαθεσιμότητας");
      setAvailable(null);
    } finally {
      setChecking(false);
    }
  };

  const handleSave = async () => {
    if (!available) {
      toast.error("Επιλέξτε ένα διαθέσιμο subdomain");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("invitations")
        .update({ custom_subdomain: subdomain } as any)
        .eq("id", invitationId);

      if (error) throw error;

      toast.success("Το custom subdomain αποθηκεύτηκε επιτυχώς!");
      
      if (onSubdomainUpdate) {
        onSubdomainUpdate(subdomain);
      }
    } catch (error) {
      console.error("Error saving subdomain:", error);
      toast.error("Σφάλμα κατά την αποθήκευση του subdomain");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSubdomain(value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
    setAvailable(null);
  };

  const fullUrl = subdomain
    ? `https://${subdomain}.invitations.app`
    : "https://your-subdomain.invitations.app";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Custom Subdomain
            </CardTitle>
            <CardDescription>
              Δημιουργήστε ένα προσωποποιημένο URL για την πρόσκλησή σας
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            Premium
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subdomain Input */}
        <div className="space-y-2">
          <Label htmlFor="subdomain">Subdomain</Label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                id="subdomain"
                value={subdomain}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="my-wedding"
                className="pr-10"
              />
              {available !== null && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {available ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                </div>
              )}
            </div>
            <Button
              onClick={checkAvailability}
              disabled={!subdomain || checking}
              variant="outline"
            >
              {checking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Έλεγχος"
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Μόνο πεζά γράμματα, αριθμοί και παύλες (3-30 χαρακτήρες)
          </p>
        </div>

        {/* Preview URL */}
        <div className="space-y-2">
          <Label>Preview URL</Label>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <code className="flex-1 text-sm">{fullUrl}</code>
            {subdomain && available && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(fullUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Πώς λειτουργεί το Custom Subdomain
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Δημιουργήστε ένα μοναδικό URL για την πρόσκλησή σας</li>
            <li>Εύκολο να μοιραστείτε και να θυμηθείτε</li>
            <li>Επαγγελματική εμφάνιση</li>
            <li>SEO friendly</li>
          </ul>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!available || saving}
          className="w-full"
          size="lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Αποθήκευση...
            </>
          ) : (
            "Αποθήκευση Subdomain"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}