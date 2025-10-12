import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

interface UserActionsDialogProps {
  userId: string;
  userEmail: string;
  currentPlan: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "plan" | "password" | "delete" | null;
  onSuccess: () => void;
}

export function UserActionsDialog({
  userId,
  userEmail,
  currentPlan,
  open,
  onOpenChange,
  action,
  onSuccess,
}: UserActionsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [newPlan, setNewPlan] = useState<"basic" | "plus" | "premium">(currentPlan as "basic" | "plus" | "premium");
  const [newPassword, setNewPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");

  const handleChangePlan = async () => {
    try {
      setLoading(true);
      
      // Check if subscription exists
      const { data: existingSub } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingSub) {
        // Update existing subscription
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            plan_type: newPlan,
            status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        // Create new subscription
        const { error } = await supabase
          .from("user_subscriptions")
          .insert([{
            user_id: userId,
            plan_type: newPlan,
            status: "active" as const,
          }]);

        if (error) throw error;
      }

      toast.success(`Το πλάνο ενημερώθηκε σε ${newPlan}`);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error changing plan:", error);
      toast.error("Σφάλμα κατά την αλλαγή πλάνου");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες");
      return;
    }

    try {
      setLoading(true);
      
      // This requires admin privileges - we need to call an edge function
      const { error } = await supabase.functions.invoke("admin-change-password", {
        body: { userId, newPassword },
      });

      if (error) throw error;

      toast.success("Ο κωδικός άλλαξε επιτυχώς");
      onSuccess();
      onOpenChange(false);
      setNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Σφάλμα κατά την αλλαγή κωδικού. Βεβαιωθείτε ότι η edge function έχει δημιουργηθεί.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (confirmDelete !== userEmail) {
      toast.error("Το email δεν ταιριάζει");
      return;
    }

    try {
      setLoading(true);
      
      // This requires admin privileges - we need to call an edge function
      const { error } = await supabase.functions.invoke("admin-delete-user", {
        body: { userId },
      });

      if (error) throw error;

      toast.success("Ο χρήστης διαγράφηκε επιτυχώς");
      onSuccess();
      onOpenChange(false);
      setConfirmDelete("");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Σφάλμα κατά τη διαγραφή χρήστη. Βεβαιωθείτε ότι η edge function έχει δημιουργηθεί.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (action) {
      case "plan":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Αλλαγή Πλάνου</DialogTitle>
              <DialogDescription>
                Αλλαγή πλάνου για τον χρήστη: {userEmail}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="plan">Νέο Πλάνο</Label>
                <Select 
                  value={newPlan} 
                  onValueChange={(value) => setNewPlan(value as "basic" | "plus" | "premium")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε πλάνο" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="plus">Plus</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Τρέχον πλάνο: <span className="font-medium capitalize">{currentPlan}</span>
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Ακύρωση
              </Button>
              <Button onClick={handleChangePlan} disabled={loading || newPlan === currentPlan}>
                {loading ? "Αλλαγή..." : "Αλλαγή Πλάνου"}
              </Button>
            </DialogFooter>
          </>
        );

      case "password":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Αλλαγή Κωδικού</DialogTitle>
              <DialogDescription>
                Αλλαγή κωδικού για τον χρήστη: {userEmail}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="password">Νέος Κωδικός</Label>
                <Input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Εισάγετε νέο κωδικό (τουλάχιστον 6 χαρακτήρες)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Ακύρωση
              </Button>
              <Button onClick={handleChangePassword} disabled={loading || newPassword.length < 6}>
                {loading ? "Αλλαγή..." : "Αλλαγή Κωδικού"}
              </Button>
            </DialogFooter>
          </>
        );

      case "delete":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Διαγραφή Χρήστη
              </DialogTitle>
              <DialogDescription>
                Αυτή η ενέργεια είναι <strong>μόνιμη</strong> και δεν μπορεί να αναιρεθεί.
                Θα διαγραφούν όλα τα δεδομένα του χρήστη.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="confirm">
                  Για επιβεβαίωση, πληκτρολογήστε το email του χρήστη:
                </Label>
                <Input
                  id="confirm"
                  type="text"
                  value={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.value)}
                  placeholder={userEmail}
                />
              </div>
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm text-destructive">
                  ⚠️ Προειδοποίηση: Αυτή η ενέργεια θα διαγράψει μόνιμα τον χρήστη και όλα τα δεδομένα του.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Ακύρωση
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser} 
                disabled={loading || confirmDelete !== userEmail}
              >
                {loading ? "Διαγραφή..." : "Διαγραφή Χρήστη"}
              </Button>
            </DialogFooter>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
