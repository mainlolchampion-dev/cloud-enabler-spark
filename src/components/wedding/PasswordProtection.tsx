import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PasswordProtectionProps {
  correctPassword: string;
  onSuccess: () => void;
  title?: string;
}

export const PasswordProtection = ({ 
  correctPassword, 
  onSuccess,
  title = "Προστατευμένη Πρόσκληση"
}: PasswordProtectionProps) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (password === correctPassword) {
        onSuccess();
        toast({
          title: "Επιτυχία!",
          description: "Καλώς ήρθατε!",
        });
      } else {
        toast({
          title: "Λάθος Κωδικός",
          description: "Παρακαλώ δοκιμάστε ξανά.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">{title}</CardTitle>
          <CardDescription>
            Εισάγετε τον κωδικό πρόσβασης για να δείτε την πρόσκληση
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Κωδικός πρόσβασης"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center text-lg tracking-wider"
              disabled={loading}
            />
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !password}
            >
              {loading ? "Έλεγχος..." : "Είσοδος"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
