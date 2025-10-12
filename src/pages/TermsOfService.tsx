import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Scale, Shield, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="p-4 rounded-full bg-primary/10">
              <FileText className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Όροι Χρήσης
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            Τελευταία ενημέρωση: 12 Ιανουαρίου 2025
          </p>
          
          {/* Quick Summary */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-4 bg-background/80 backdrop-blur animate-fade-in hover:shadow-lg transition-all">
                <Scale className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Δίκαιοι Όροι</h3>
                <p className="text-xs text-muted-foreground mt-1">Σαφείς και απλοί</p>
              </Card>
              <Card className="p-4 bg-background/80 backdrop-blur animate-fade-in hover:shadow-lg transition-all">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Προστασία</h3>
                <p className="text-xs text-muted-foreground mt-1">Για εσάς και εμάς</p>
              </Card>
              <Card className="p-4 bg-background/80 backdrop-blur animate-fade-in hover:shadow-lg transition-all">
                <AlertCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Διαφάνεια</h3>
                <p className="text-xs text-muted-foreground mt-1">Χωρίς κρυφές χρεώσεις</p>
              </Card>
            </div>
          </div>
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
