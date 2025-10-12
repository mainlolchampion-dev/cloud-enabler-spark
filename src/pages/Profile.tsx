import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { User as UserIcon, Mail, Lock, LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Οι κωδικοί δεν ταιριάζουν");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες");
      return;
    }

    setUpdating(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;

      toast.success("Ο κωδικός άλλαξε επιτυχώς");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Αποσυνδεθήκατε επιτυχώς");
    navigate("/");
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
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Προφίλ</h1>
          <p className="text-muted-foreground text-lg">Διαχειριστείτε τον λογαριασμό σας</p>
        </div>

        {/* Account Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserIcon className="w-5 h-5 text-primary" />
              Πληροφορίες Λογαριασμού
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-muted h-12 text-base"
              />
              <p className="text-sm text-muted-foreground">
                Το email σας δεν μπορεί να αλλάξει
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-base">Ημερομηνία Δημιουργίας</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString('el-GR')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lock className="w-5 h-5 text-primary" />
              Αλλαγή Κωδικού
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-base">
                  Νέος Κωδικός
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Νέος κωδικός"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-base">
                  Επιβεβαίωση Κωδικού
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Επιβεβαίωση κωδικού"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </div>

              <Button 
                type="submit" 
                disabled={updating}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary h-12"
              >
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {updating ? "Αλλαγή..." : "Αλλαγή Κωδικού"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Logout Card */}
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">Αποσύνδεση</h3>
                <p className="text-sm text-muted-foreground">
                  Αποσυνδεθείτε από τον λογαριασμό σας
                </p>
              </div>
              <Button 
                onClick={handleLogout} 
                variant="destructive"
                size="lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Αποσύνδεση
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
