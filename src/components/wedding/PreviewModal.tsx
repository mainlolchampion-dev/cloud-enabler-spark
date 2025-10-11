import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationType: "wedding" | "baptism" | "party";
  data: any;
  onPublish: () => void;
}

export function PreviewModal({ open, onOpenChange, invitationType, data, onPublish }: PreviewModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (open && data) {
      // Create a temporary preview by encoding data in URL
      const encodedData = encodeURIComponent(JSON.stringify({ type: invitationType, data }));
      setPreviewUrl(`/preview?data=${encodedData}`);
    }
  }, [open, data, invitationType]);

  const handleOpenPreview = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank', 'width=1200,height=800');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Προεπισκόπηση Πρόσκλησης</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 border-2 border-dashed">
            <div className="text-center space-y-4">
              <div className="text-5xl">👁️</div>
              <h3 className="text-xl font-semibold">
                {invitationType === "wedding" && "Πρόσκληση Γάμου"}
                {invitationType === "baptism" && "Πρόσκληση Βάπτισης"}
                {invitationType === "party" && "Πρόσκληση Party"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Η πρόσκληση είναι έτοιμη για προεπισκόπηση. Κάντε κλικ παρακάτω για να την δείτε σε νέο παράθυρο.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="bg-card rounded-lg p-4 border">
              <h4 className="font-medium mb-2">Περιεχόμενο:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Τίτλος:</span>
                  <span className="font-medium text-foreground">{data?.title || "-"}</span>
                </div>
                {invitationType === "wedding" && (
                  <>
                    <div className="flex justify-between">
                      <span>Γαμπρός:</span>
                      <span className="font-medium text-foreground">{data?.groomName || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Νύφη:</span>
                      <span className="font-medium text-foreground">{data?.brideName || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ημερομηνία:</span>
                      <span className="font-medium text-foreground">{data?.weddingDate || "-"}</span>
                    </div>
                  </>
                )}
                {invitationType === "baptism" && (
                  <>
                    <div className="flex justify-between">
                      <span>Παιδί:</span>
                      <span className="font-medium text-foreground">{data?.childName || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ημερομηνία:</span>
                      <span className="font-medium text-foreground">{data?.baptismDate || "-"}</span>
                    </div>
                  </>
                )}
                {invitationType === "party" && (
                  <>
                    <div className="flex justify-between">
                      <span>Ημερομηνία:</span>
                      <span className="font-medium text-foreground">{data?.partyDate || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Τοποθεσία:</span>
                      <span className="font-medium text-foreground">{data?.venueLocation || "-"}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span>Φωτογραφίες Gallery:</span>
                  <span className="font-medium text-foreground">{data?.gallery?.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-center">
                💡 <strong>Συμβουλή:</strong> Ελέγξτε όλα τα πεδία προσεκτικά πριν τη δημοσίευση. 
                Μετά τη δημοσίευση, η πρόσκληση θα είναι διαθέσιμη σε όλους!
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Ακύρωση
            </Button>
            <Button variant="secondary" onClick={handleOpenPreview}>
              Άνοιγμα σε Νέο Παράθυρο
            </Button>
            <Button onClick={onPublish} className="bg-gradient-to-r from-pink-500 to-purple-600">
              Δημοσίευση Τώρα
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}