import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

interface PublishPanelProps {
  onSaveDraft: () => void;
  onPreview: () => void;
  onPublish: () => void;
}

export function PublishPanel({ onSaveDraft, onPreview, onPublish }: PublishPanelProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Δημοσίευση</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={onSaveDraft} className="w-full">
            Αποθήκευση Προσχεδίου
          </Button>
          <Button variant="outline" onClick={onPreview} className="w-full">
            Προεπισκόπηση
          </Button>
          <Button onClick={onPublish} className="w-full">
            Δημοσίευση
          </Button>
        </div>

        <div className="space-y-3 pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Κατάσταση:</span>
            <span className="font-medium">Προσχέδιο</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ορατότητα:</span>
            <span className="font-medium">Δημόσιο</span>
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t">
          <a
            href="#"
            className="flex items-start gap-2 text-sm text-primary hover:underline"
          >
            <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Οδηγός Δημιουργίας Προσκλητηρίου</span>
          </a>
          <a
            href="#"
            className="flex items-start gap-2 text-sm text-primary hover:underline"
          >
            <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Πώς να δημιουργήσετε το προσκλητήριο του γάμου σας σε &lt; 5 λεπτά</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
