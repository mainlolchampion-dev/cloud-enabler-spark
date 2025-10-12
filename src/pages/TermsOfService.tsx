import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <Heart className="h-7 w-7 text-primary" fill="currentColor" />
            <span className="font-serif text-2xl font-semibold text-foreground tracking-tight">WediLink</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Επιστροφή
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            Όροι Χρήσης
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Τελευταία ενημέρωση: Ιανουάριος 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <Card className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-3xl font-bold mb-6">1. Αποδοχή Όρων</h2>
              <p className="text-muted-foreground mb-8">
                Καλώς ήρθατε στο WediLink. Χρησιμοποιώντας την υπηρεσία μας, συμφωνείτε με τους παρακάτω όρους και προϋποθέσεις. 
                Παρακαλούμε διαβάστε τους προσεκτικά πριν χρησιμοποιήσετε την πλατφόρμα μας.
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">2. Περιγραφή Υπηρεσίας</h2>
              <p className="text-muted-foreground mb-4">
                Το WediLink παρέχει μια διαδικτυακή πλατφόρμα για τη δημιουργία και διαχείριση ηλεκτρονικών προσκλητηρίων για:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
                <li>Γάμους και γαμήλιες εκδηλώσεις</li>
                <li>Βαπτίσεις και χριστιανικές τελετές</li>
                <li>Πάρτι και άλλες κοινωνικές εκδηλώσεις</li>
              </ul>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">3. Λογαριασμός Χρήστη</h2>
              <p className="text-muted-foreground mb-4">
                Για να χρησιμοποιήσετε το WediLink, πρέπει να:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
                <li>Δημιουργήσετε λογαριασμό με έγκυρο email</li>
                <li>Παρέχετε ακριβείς και πλήρεις πληροφορίες</li>
                <li>Διατηρείτε την ασφάλεια του κωδικού πρόσβασής σας</li>
                <li>Ενημερώνετε αμέσως για οποιαδήποτε μη εξουσιοδοτημένη χρήση</li>
              </ul>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">4. Πνευματικά Δικαιώματα</h2>
              <p className="text-muted-foreground mb-4">
                Διατηρείτε όλα τα δικαιώματα στο περιεχόμενο που ανεβάζετε (φωτογραφίες, κείμενα, κ.λπ.). Παρέχετε στο WediLink 
                περιορισμένη άδεια για τη φιλοξενία και εμφάνιση του περιεχομένου σας αποκλειστικά για την παροχή των υπηρεσιών μας.
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">5. Απαγορευμένες Χρήσεις</h2>
              <p className="text-muted-foreground mb-4">
                Δεν επιτρέπεται η χρήση της πλατφόρμας για:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
                <li>Παράνομες δραστηριότητες ή περιεχόμενο</li>
                <li>Spam ή ανεπιθύμητα μηνύματα</li>
                <li>Προσβλητικό ή παρενοχλητικό περιεχόμενο</li>
                <li>Παραβίαση πνευματικών δικαιωμάτων τρίτων</li>
                <li>Κακόβουλο λογισμικό ή επιβλαβή δεδομένα</li>
              </ul>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">6. Πληρωμές & Συνδρομές</h2>
              <p className="text-muted-foreground mb-8">
                Το WediLink προσφέρει δωρεάν και premium πακέτα. Οι χρεώσεις για premium λειτουργίες ισχύουν όπως περιγράφονται 
                στη σελίδα τιμολόγησης. Οι πληρωμές είναι ασφαλείς και επεξεργάζονται μέσω αξιόπιστων παρόχων πληρωμών.
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">7. Ακύρωση & Επιστροφές</h2>
              <p className="text-muted-foreground mb-8">
                Μπορείτε να ακυρώσετε τη συνδρομή σας ανά πάσα στιγμή. Προσφέρουμε 30-ημέρες εγγύηση επιστροφής χρημάτων 
                για νέες συνδρομές χωρίς ερωτήσεις.
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">8. Τερματισμός Υπηρεσιών</h2>
              <p className="text-muted-foreground mb-8">
                Διατηρούμε το δικαίωμα να τερματίσουμε ή να αναστείλουμε τον λογαριασμό σας σε περίπτωση παραβίασης 
                των όρων χρήσης, χωρίς προηγούμενη ειδοποίηση.
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">9. Αποποίηση Ευθυνών</h2>
              <p className="text-muted-foreground mb-8">
                Η υπηρεσία παρέχεται "ως έχει" χωρίς εγγυήσεις οποιουδήποτε είδους. Δεν ευθυνόμαστε για οποιεσδήποτε 
                άμεσες, έμμεσες ή συνεπακόλουθες ζημίες που προκύπτουν από τη χρήση της πλατφόρμας.
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">10. Τροποποιήσεις Όρων</h2>
              <p className="text-muted-foreground mb-8">
                Διατηρούμε το δικαίωμα να τροποποιήσουμε αυτούς τους όρους ανά πάσα στιγμή. Οι σημαντικές αλλαγές 
                θα κοινοποιούνται μέσω email ή ειδοποίησης στην πλατφόρμα.
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">11. Εφαρμοστέο Δίκαιο</h2>
              <p className="text-muted-foreground mb-8">
                Αυτοί οι όροι διέπονται από τους νόμους της Ελλάδας και της Ευρωπαϊκής Ένωσης. Τυχόν διαφορές 
                υπόκεινται στην αποκλειστική δικαιοδοσία των ελληνικών δικαστηρίων.
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">12. Επικοινωνία</h2>
              <p className="text-muted-foreground mb-4">
                Για ερωτήσεις σχετικά με τους όρους χρήσης, επικοινωνήστε μαζί μας:
              </p>
              <ul className="list-none text-muted-foreground mb-8 space-y-2">
                <li>📧 Email: legal@wedilink.com</li>
                <li>📍 Διεύθυνση: Αθήνα, Ελλάδα</li>
                <li>📞 Τηλέφωνο: +30 210 123 4567</li>
              </ul>
            </div>
          </Card>

          {/* Navigation Links */}
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link to="/privacy-policy">
              <Button variant="outline">Privacy Policy</Button>
            </Link>
            <Link to="/gdpr">
              <Button variant="outline">GDPR</Button>
            </Link>
            <Link to="/faq">
              <Button variant="outline">FAQ</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
