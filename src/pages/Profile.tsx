import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Loader2, Mail, Lock, Phone, User as UserIcon, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setEmail(user.email || "");
        setPhone(user.phone || "");
      }
    } catch (error: any) {
      toast({
        title: "Σφάλμα",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;

      toast({
        title: "Επιτυχία",
        description: "Το email σας ενημερώθηκε. Ελέγξτε το νέο σας email για επιβεβαίωση.",
      });
    } catch (error: any) {
      toast({
        title: "Σφάλμα",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Σφάλμα",
        description: "Οι κωδικοί δεν ταιριάζουν",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Σφάλμα",
        description: "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες",
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;

      toast({
        title: "Επιτυχία",
        description: "Ο κωδικός σας ενημερώθηκε επιτυχώς",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Σφάλμα",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await supabase.auth.updateUser({ phone });
      
      if (error) throw error;

      toast({
        title: "Επιτυχία",
        description: "Το τηλέφωνό σας ενημερώθηκε",
      });
    } catch (error: any) {
      toast({
        title: "Σφάλμα",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Note: Account deletion requires admin privileges
      // This is a placeholder - you'll need to implement this via an edge function
      toast({
        title: "Πληροφορία",
        description: "Η διαγραφή λογαριασμού απαιτεί επικοινωνία με την υποστήριξη",
      });
    } catch (error: any) {
      toast({
        title: "Σφάλμα",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Μη εξουσιοδοτημένη πρόσβαση</CardTitle>
            <CardDescription>
              Πρέπει να συνδεθείτε για να δείτε αυτή τη σελίδα
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ρυθμίσεις Λογαριασμού</h1>
          <p className="text-muted-foreground">
            Διαχειριστείτε τις πληροφορίες του λογαριασμού σας
          </p>
        </div>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Πληροφορίες Λογαριασμού
            </CardTitle>
            <CardDescription>
              Βασικές πληροφορίες του λογαριασμού σας
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">ID Χρήστη:</span>
                <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Δημιουργήθηκε:</span>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString('el-GR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Αλλαγή Email
            </CardTitle>
            <CardDescription>
              Ενημερώστε το email σας
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Νέο Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <Button type="submit" disabled={updating}>
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ενημέρωση Email
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Update Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Αλλαγή Κωδικού
            </CardTitle>
            <CardDescription>
              Ενημερώστε τον κωδικό πρόσβασής σας
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Νέος Κωδικός</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Τουλάχιστον 6 χαρακτήρες"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Επιβεβαίωση Νέου Κωδικού</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Επαναλάβετε τον κωδικό"
                  required
                />
              </div>
              <Button type="submit" disabled={updating}>
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ενημέρωση Κωδικού
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Update Phone */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Τηλέφωνο
            </CardTitle>
            <CardDescription>
              Ενημερώστε τον αριθμό τηλεφώνου σας
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePhone} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Αριθμός Τηλεφώνου</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+30 XXX XXX XXXX"
                />
              </div>
              <Button type="submit" disabled={updating}>
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ενημέρωση Τηλεφώνου
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Επικίνδυνη Ζώνη
            </CardTitle>
            <CardDescription>
              Μη αναστρέψιμες ενέργειες
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  Διαγραφή Λογαριασμού
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Είστε απόλυτα σίγουροι;</AlertDialogTitle>
                  <AlertDialogDescription>
                    Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφούν μόνιμα όλα τα δεδομένα
                    του λογαριασμού σας.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive">
                    Διαγραφή
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
