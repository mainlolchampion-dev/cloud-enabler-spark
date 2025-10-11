import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Επιτυχής σύνδεση!",
          description: "Καλώς ήρθατε πίσω!",
        });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Επιτυχής εγγραφή!",
          description: "Ο λογαριασμός σας δημιουργήθηκε!",
        });
        navigate("/");
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">WediLink</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? "Σύνδεση" : "Εγγραφή"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? "Συνδεθείτε στον λογαριασμό σας"
              : "Δημιουργήστε νέο λογαριασμό"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Κωδικός</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Παρακαλώ περιμένετε..."
              : isLogin
              ? "Σύνδεση"
              : "Εγγραφή"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin
              ? "Δεν έχετε λογαριασμό; Εγγραφείτε"
              : "Έχετε ήδη λογαριασμό; Συνδεθείτε"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:underline">
            ← Επιστροφή στην αρχική
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;