import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, CheckCircle, Image, Calendar, Share2, Lock, BarChart3, MessageCircle, Users, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { FAQSection } from "@/components/FAQSection";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="font-bold text-xl text-foreground">Ηλεκτρονικά Προσκλητήρια Γάμου</span>
          </div>
          <div className="flex gap-4">
            <Link to="/">
              <Button variant="ghost" className="font-medium">Home</Button>
            </Link>
            <Link to="/login">
              <Button className="shadow-md hover:shadow-lg transition-shadow">Σύνδεση/Εγγραφή</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-pink-50 via-pink-50/50 to-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 text-sm">
                <Heart className="h-4 w-4" fill="currentColor" />
                <span className="font-medium">Ηλεκτρονικά Προσκλητήρια Γάμου</span>
              </div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                <span className="text-primary">Φτιάξτε</span>{" "}
                <span className="text-accent">το</span>
                <br />
                <span className="text-foreground">Ηλεκτρονικό</span>
                <br />
                <span className="text-foreground">Προσκλητήριο</span>
                <br />
                <span className="text-secondary">σας εύκολα μέσα από την</span>
                <br />
                <span className="text-secondary">πλατφόρμα μας!</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Στείλτε κομψά ηλεκτρονικά προσκλητήρια γάμου απευθείας στους φίλους και τους συγγενείς σας με το WediLink. Συμπληρώστε εύκολα και γρήγορα την φόρμα της πρόσκλησης, ανεβάστε τις φωτογραφίες σας και σε λίγα λεπτά το προσκλητήριό σας είναι έτοιμο για αποστολή.
              </p>
              <div className="flex gap-4">
                <Link to="/login">
                  <Button size="lg" className="text-lg px-8 shadow-lg hover:shadow-xl transition-shadow">
                    Φτιάξτε το Δικό Σας
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                  Δείτε Demo
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="p-6 bg-white border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-pink-100">
                    <CheckCircle className="h-8 w-8 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">RSVP Διαχείριση</h3>
                    <p className="text-muted-foreground">
                      Οι καλεσμένοι σας θα πλοηγηθούν εύκολα στο προσκλητήριό σας
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-red-100">
                    <Image className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Γκαλερί Φωτογραφιών</h3>
                    <p className="text-muted-foreground">
                      Ανεβάστε τις φωτογραφίες σας και μοιραστείτε με τους καλεσμένους
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-yellow-100">
                    <Users className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Λίστα Γάμου</h3>
                    <p className="text-muted-foreground">
                      Η παρουσία μέσα από την φόρμα RSVP
                    </p>
                  </div>
                </div>
              </Card>
            </div>
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
      <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Όλα όσα χρειάζεστε</h2>
            <p className="text-lg text-muted-foreground">
              Ένα ολοκληρωμένο σύστημα για τη δημιουργία και διαχείριση των<br />προσκλητηρίων γάμου σας
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-gray-100">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 w-fit mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Όμορφα Templates</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Επιλέξτε από μια ποικιλία όμορφων θεμάτων που ταιριάζουν στο στυλ του γάμου σας
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-gray-100">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 w-fit mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">RSVP Διαχείριση</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Παρακολουθήστε ποιος έρχεται σε πραγματικό χρόνο με αυτόματες ειδοποιήσεις
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-gray-100">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 w-fit mb-4">
                <Image className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Γκαλερί Φωτογραφιών</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ανεβάστε και μοιραστείτε τις ωραιότερες στιγμές σας με τους καλεσμένους
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-gray-100">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 w-fit mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Add to Calendar</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Οι καλεσμένοι μπορούν να προσθέσουν την εκδήλωση απευθείας στο ημερολόγιό τους
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-gray-100">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 w-fit mb-4">
                <Share2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Εύκολη Κοινοποίηση</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Μοιραστείτε μέσω WhatsApp, email, SMS ή social media με ένα κλικ
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-gray-100">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 w-fit mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Προστασία με Κωδικό</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Κρατήστε την πρόσκληση ιδιωτική με προστασία κωδικού (Plus)
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-gray-100">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 w-fit mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Analytics & Stats</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Δείτε λεπτομερή στατιστικά για τις απαντήσεις και τους καλεσμένους
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-gray-100">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 w-fit mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Λίστα Γάμου</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ενσωματωμένη Λίστα γάμου με QR code για εύκολες πληρωμές
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-gray-100">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 w-fit mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Απεριόριστοι Καλεσμένοι</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Προσκαλέστε όσους καλεσμένους θέλετε χωρίς περιορισμούς
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-gray-100">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 w-fit mb-4">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Προσαρμογή Θεμάτων</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Προσαρμόστε χρώματα, γραμματοσειρές και στυλ στις προτιμήσεις σας
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-pink-50 via-pink-50/50 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Heart className="h-4 w-4" fill="currentColor" />
              <span className="text-sm font-medium">Ικανοποιημένα Ζευγάρια</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Τι λένε τα ζευγάρια μας</h2>
            <p className="text-lg text-muted-foreground">
              Δείτε τι λένε ζευγάρια που χρησιμοποίησαν το WediLink για τον γάμο τους
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl text-muted-foreground/20 mb-4">"</div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-lg">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-6 text-base leading-relaxed italic">
                Το WediLink μας έκανε τη ζωή πολύ πιο εύκολη! Δημιουργήσαμε υπέροχα προσκλητήρια σε λίγα λεπτά και το RSVP ήταν καταπληκτικά εύκολο!
              </p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center shadow-md">
                  <span className="font-bold text-white text-lg">Μ</span>
                </div>
                <div>
                  <div className="font-bold text-foreground">Μαρία & Γιώργος</div>
                  <div className="text-sm text-muted-foreground">Αθήνα</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl text-muted-foreground/20 mb-4">"</div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-lg">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-6 text-base leading-relaxed italic">
                Η εύκολη διαχείριση των καλεσμένων ήταν το κλειδί! Η οικογένειά μας μπορούσε να δει ποιος θα έρθει και να αποφύγουμε κάθε έκπληξη. Συστήνουμε ανεπιφύλακτα!
              </p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center shadow-md">
                  <span className="font-bold text-white text-lg">Ε</span>
                </div>
                <div>
                  <div className="font-bold text-foreground">Ελένη & Νίκος</div>
                  <div className="text-sm text-muted-foreground">Θεσσαλονίκη</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl text-muted-foreground/20 mb-4">"</div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-lg">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-6 text-base leading-relaxed italic">
                Φανταστικό! Η δημιουργία ήταν εύκολη και γρήγορη! Με βοήθησε να φτιάξω προσκλητήρια πανέμορφα, οι φίλοι μου ήταν πολύ ενθουσιασμένοι και τα έστειλα αμέσως!
              </p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center shadow-md">
                  <span className="font-bold text-white text-lg">Κ</span>
                </div>
                <div>
                  <div className="font-bold text-foreground">Κωνσταντίνα & Αλέξης</div>
                  <div className="text-sm text-muted-foreground">Πάτρα</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl text-muted-foreground/20 mb-4">"</div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-lg">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-6 text-base leading-relaxed italic">
                Τα analytics που παρέχει ήταν από τα καλύτερα στο WediLink για τα προσκλητήριά μας. Οι οικογένειές μας μπορούσαν να δουν όλες τις πληροφορίες και να ενημερώνονται άμεσα!
              </p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center shadow-md">
                  <span className="font-bold text-white text-lg">Σ</span>
                </div>
                <div>
                  <div className="font-bold text-foreground">Σοφία & Δημήτρης</div>
                  <div className="text-sm text-muted-foreground">Ηράκλειο</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-pink-500 to-accent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Heart className="h-4 w-4" fill="currentColor" />
              <span className="text-sm font-medium">Ξεκινήστε Δωρεάν</span>
            </div>
            <h2 className="text-5xl font-bold mb-6">
              Έτοιμοι να δημιουργήσετε<br />το τέλειο προσκλητήριο;
            </h2>
            <p className="text-xl mb-8 opacity-95">
              Ξεκινήστε δωρεάν σήμερα και δημιουργήστε όμορφα<br />προσκλητήρια σε λίγα λεπτά!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/login">
                <Button size="lg" variant="secondary" className="text-lg px-8 shadow-xl hover:shadow-2xl transition-shadow bg-white text-primary hover:bg-white/90">
                  Ξεκινήστε Τώρα →
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm">
                Δείτε Demo
              </Button>
            </div>
            <p className="mt-6 text-sm opacity-80">
              🔒 Ασφαλής πληρωμή • Χωρίς δέσμευση • Ακύρωση ανά πάσα στιγμή
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