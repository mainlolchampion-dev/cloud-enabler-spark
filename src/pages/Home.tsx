import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, CheckCircle, Image, Calendar, Share2, Lock, BarChart3, MessageCircle, Users, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Ηλεκτρονικά Προσκλητήρια Γάμου</span>
          </div>
          <div className="flex gap-4">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/login">
              <Button>Σύνδεση/Εγγραφή</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6">
              <span className="text-primary">Φτιάξτε το</span>
              <br />
              <span className="text-foreground">Ηλεκτρονικό Προσκλητήριο</span>
              <br />
              <span className="text-muted-foreground">σας εύκολα μέσα από την</span>
              <br />
              <span className="text-primary">πλατφόρμα μας!</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Στείλτε κομψά ηλεκτρονικά προσκλητήρια γάμου απευθείας στους φίλους και τους συγγενείς σας με το WediLink. Συμπληρώστε εύκολα και γρήγορα την φόρμα της πρόσκλησης, ανεβάστε τις φωτογραφίες σας και σε λίγα λεπτά το προσκλητήριό σας είναι έτοιμο για αποστολή.
            </p>
            <div className="flex gap-4">
              <Link to="/login">
                <Button size="lg" className="text-lg px-8">
                  Φτιάξτε το Δικό Σας
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Δείτε Demo
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">RSVP Διαχείριση</h3>
                  <p className="text-muted-foreground">
                    Οι καλεσμένοι σας θα πληγηθούν εύκολα στο προσκλητήριό σας
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-secondary/5 border-secondary/20">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-secondary/10">
                  <Image className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Γκαλερί Φωτογραφιών</h3>
                  <p className="text-muted-foreground">
                    Ανεβάστε τις φωτογραφίες σας και μοιραστείτε με τους καλεσμένους
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-accent/5 border-accent/20">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-accent/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Λίστα Γάμου</h3>
                  <p className="text-muted-foreground">
                    Η παρουσία μέσα από την φόρμα RSVP
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">5K+</div>
            <div className="text-muted-foreground">Ζευγάρια</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">50K+</div>
            <div className="text-muted-foreground">Προσκλήσεις</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">Ικανοποίηση</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Όλα όσα χρειάζεστε</h2>
            <p className="text-lg text-muted-foreground">
              Ένα ολοκληρωμένο σύστημα για τη δημιουργία και διαχείριση των προσκλητηρίων γάμου σας
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="p-4 rounded-lg bg-primary/10 w-fit mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Όμορφα Templates</h3>
              <p className="text-muted-foreground">
                Επιλέξτε από μια ποικιλία όμορφων θεμάτων που ταιριάζουν στο στυλ του γάμου σας
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="p-4 rounded-lg bg-green-500/10 w-fit mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">RSVP Διαχείριση</h3>
              <p className="text-muted-foreground">
                Παρακολουθήστε ποιος έρχεται σε πραγματικό χρόνο με αυτόματες ειδοποιήσεις
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="p-4 rounded-lg bg-purple-500/10 w-fit mb-4">
                <Image className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Γκαλερί Φωτογραφιών</h3>
              <p className="text-muted-foreground">
                Ανεβάστε και μοιραστείτε τις ωραιότερες στιγμές σας με τους καλεσμένους
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="p-4 rounded-lg bg-blue-500/10 w-fit mb-4">
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Add to Calendar</h3>
              <p className="text-muted-foreground">
                Οι καλεσμένοι μπορούν να προσθέσουν την εκδήλωση απευθείας στο ημερολόγιό τους
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="p-4 rounded-lg bg-orange-500/10 w-fit mb-4">
                <Share2 className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Εύκολη Κοινοποίηση</h3>
              <p className="text-muted-foreground">
                Μοιραστείτε μέσω WhatsApp, email, SMS ή social media με ένα κλικ
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="p-4 rounded-lg bg-gray-500/10 w-fit mb-4">
                <Lock className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Προστασία με Κωδικό</h3>
              <p className="text-muted-foreground">
                Κρατήστε την πρόσκληση ιδιωτική με προστασία κωδικού (Plus)
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="p-4 rounded-lg bg-cyan-500/10 w-fit mb-4">
                <BarChart3 className="h-8 w-8 text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Analytics & Stats</h3>
              <p className="text-muted-foreground">
                Δείτε λεπτομερή στατιστικά για τις απαντήσεις και τους καλεσμένους
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="p-4 rounded-lg bg-yellow-500/10 w-fit mb-4">
                <MessageCircle className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Λίστα Γάμου</h3>
              <p className="text-muted-foreground">
                Ενσωματωμένη Λίστα γάμου με QR code για εύκολες πληρωμές
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="p-4 rounded-lg bg-pink-500/10 w-fit mb-4">
                <Users className="h-8 w-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Απεριόριστοι Καλεσμένοι</h3>
              <p className="text-muted-foreground">
                Προσκαλέστε όσους καλεσμένους θέλετε χωρίς περιορισμούς
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="p-4 rounded-lg bg-purple-600/10 w-fit mb-4">
                <Palette className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Προσαρμογή Θεμάτων</h3>
              <p className="text-muted-foreground">
                Προσαρμόστε χρώματα, γραμματοσειρές και στυλ στις προτιμήσεις σας
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">Ικανοποιημένα Ζευγάρια</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Τι λένε τα ζευγάρια μας</h2>
            <p className="text-lg text-muted-foreground">
              Δείτε τι λένε ζευγάρια που χρησιμοποίησαν το WediLink για τον γάμο τους
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-6">
                "Το WediLink μας κάνει τη ζωή πολύ πιο εύκολη! Δημιουργήσαμε υπέροχα προσκλητήρια σε λίγα λεπτά και τα κάναμε RSVP καταπληκτικά εύκολα!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-bold text-primary">Μ</span>
                </div>
                <div>
                  <div className="font-bold">Μαρία & Γιώργος</div>
                  <div className="text-sm text-muted-foreground">Αθήνα</div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-6">
                "Η εύκολη διαχείριση των καλεσμένων ήταν το κλειδί! Η καλαλήγραψη μας μπορούσε να δουν ποιος θα έρθει και να αποφύγουμε κάθε έκπληξη. Συστήνουμε ανεπιφύλακτα!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-bold text-primary">Ε</span>
                </div>
                <div>
                  <div className="font-bold">Ελένη & Νίκος</div>
                  <div className="text-sm text-muted-foreground">Θεσσαλονίκη</div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-6">
                "Ο δραματικό! Δημιουργήσα και επον απεφτά! Μου βοήθησε να δημιουργήσω καλούς πανέμορφους, τα ηχανικά μου φίλοι ήταν πολύ ικανούς και τα έστειλα παράλληλα!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-bold text-primary">Κ</span>
                </div>
                <div>
                  <div className="font-bold">Κωνσταντίνα & Αλέξης</div>
                  <div className="text-sm text-muted-foreground">Πάτρα</div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-6">
                "Το analytics που παρέχει ήταν απο το καλύτερο με WediLink για τα προσκλήτηρια μας. Οι καλλιγραφήσες μας μπορούσαν να δουν όλες τις πληροφορίες και να αποστέλλουν παράλληλα!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-bold text-primary">Σ</span>
                </div>
                <div>
                  <div className="font-bold">Σοφία & Δημήτρης</div>
                  <div className="text-sm text-muted-foreground">Ηράκλειο</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Συχνές Ερωτήσεις</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Συχνές Ερωτήσεις</h2>
            <p className="text-lg text-muted-foreground">
              Βρείτε απαντήσεις στις πιο συχνές ερωτήσεις μας
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-background rounded-lg px-6">
              <AccordionTrigger>
                Πόσο κοστίζει η δημιουργία μιας ψηφιακής πρόσκλησης;
              </AccordionTrigger>
              <AccordionContent>
                Προσφέρουμε τρία πακέτα: Basic (€39), Plus (€69) και Premium (€119). Κάθε πακέτο περιλαμβάνει διαφορετικά χαρακτηριστικά για να καλύψει τις ανάγκες σας.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-background rounded-lg px-6">
              <AccordionTrigger>
                Πως γίνεται η δημιουργία του προσκλητηρίου;
              </AccordionTrigger>
              <AccordionContent>
                Απλά εγγραφείτε, επιλέξτε ένα θέμα, συμπληρώστε τις πληροφορίες σας, ανεβάστε φωτογραφίες και το προσκλητήριό σας είναι έτοιμο!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-background rounded-lg px-6">
              <AccordionTrigger>
                Μπορείτε να αναλύσετε ταις την δημιουργία της πρόσκλησης μου;
              </AccordionTrigger>
              <AccordionContent>
                Ναι, μπορείτε να επεξεργαστείτε το προσκλητήριό σας ανά πάσα στιγμή πριν το στείλετε στους καλεσμένους σας.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-background rounded-lg px-6">
              <AccordionTrigger>
                Πως μπορώ να αποστείλω την πρόσκληση μου στους καλεσμένους;
              </AccordionTrigger>
              <AccordionContent>
                Μπορείτε να την αποστείλετε μέσω email, WhatsApp, SMS ή να την μοιραστείτε μέσω social media με ένα μοναδικό link.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-background rounded-lg px-6">
              <AccordionTrigger>
                Πως αντιμετωπίζω την την παρουσία των καλεσμένων μου;
              </AccordionTrigger>
              <AccordionContent>
                Το σύστημά μας διαθέτει ενσωματωμένη λειτουργία RSVP όπου οι καλεσμένοι μπορούν να επιβεβαιώσουν την παρουσία τους.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-background rounded-lg px-6">
              <AccordionTrigger>
                Την πρόσκληση μου μπορούν να την δουν όλοι;
              </AccordionTrigger>
              <AccordionContent>
                Όχι, μπορείτε να προστατεύσετε την πρόσκλησή σας με κωδικό (διαθέσιμο στο Plus πακέτο).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 mb-6">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">Ξεκινήστε Δωρεάν</span>
            </div>
            <h2 className="text-5xl font-bold mb-6">
              Έτοιμοι να δημιουργήσετε το τέλειο προσκλητήριο;
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Ξεκινήστε δωρεάν σήμερα και δημιουργήστε όμορφα προσκλητήρια σε λίγα λεπτά!
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Ξεκινήστε Τώρα →
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white/30">
                Δείτε Demo
              </Button>
            </div>
            <p className="mt-6 text-sm opacity-75">
              🔒 Ασφαλής πληρωμή • Ψηφιός άδεια • Καμία δέσμευση οποτηδήποτε σταματήστε
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>© 2025 Ηλεκτρονικά Προσκλητήρια Γάμου. Όλα τα δικαιώματα κατοχυρωμένα.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;