import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, FileText, Users } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Πίνακας Ελέγχου</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Συνολικές Προσκλήσεις</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Δημιουργήστε την πρώτη σας πρόσκληση</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Προσκλήσεις Γάμου</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Ενεργές προσκλήσεις</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Προσκλήσεις Βάπτισης</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Ενεργές προσκλήσεις</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Καλώς ήρθατε!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Καλώς ήρθατε στην πλατφόρμα δημιουργίας προσκλήσεων. Ξεκινήστε δημιουργώντας την πρώτη
              σας πρόσκληση γάμου ή βάπτισης από το μενού στα αριστερά.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
