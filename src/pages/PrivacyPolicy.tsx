import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Shield className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            Πολιτική Απορρήτου
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
              <h2 className="font-serif text-3xl font-bold mb-6">Εισαγωγή</h2>
              <p className="text-muted-foreground mb-8">
                Στο WediLink, σεβόμαστε το απόρρητό σας και δεσμευόμαστε να προστατεύουμε τα προσωπικά σας δεδομένα. 
                Αυτή η πολιτική απορρήτου εξηγεί πώς συλλέγουμε, χρησιμοποιούμε, αποθηκεύουμε και προστατεύουμε τις 
                πληροφορίες σας σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR).
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">1. Δεδομένα που Συλλέγουμε</h2>
              <p className="text-muted-foreground mb-4">
                Συλλέγουμε τα ακόλουθα είδη δεδομένων:
              </p>
              <h3 className="font-semibold text-xl mb-3 mt-6">α) Δεδομένα Λογαριασμού</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                <li>Όνομα και επώνυμο</li>
                <li>Διεύθυνση email</li>
                <li>Κωδικός πρόσβασης (κρυπτογραφημένος)</li>
                <li>Ημερομηνία δημιουργίας λογαριασμού</li>
              </ul>

              <h3 className="font-semibold text-xl mb-3 mt-6">β) Δεδομένα Εκδήλωσης</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                <li>Φωτογραφίες και εικόνες που ανεβάζετε</li>
                <li>Κείμενα και περιγραφές εκδηλώσεων</li>
                <li>Πληροφορίες τοποθεσιών και χαρτών</li>
                <li>Λίστες καλεσμένων και RSVPs</li>
                <li>Τραπεζικές πληροφορίες για λίστα γάμου (IBAN)</li>
              </ul>

              <h3 className="font-semibold text-xl mb-3 mt-6">γ) Τεχνικά Δεδομένα</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
                <li>Διεύθυνση IP</li>
                <li>Τύπος browser και συσκευής</li>
                <li>Cookies και αναγνωριστικά συνεδρίας</li>
                <li>Δεδομένα χρήσης και αλληλεπίδρασης</li>
              </ul>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">2. Πώς Χρησιμοποιούμε τα Δεδομένα σας</h2>
              <p className="text-muted-foreground mb-4">
                Χρησιμοποιούμε τα δεδομένα σας για να:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
                <li>Παρέχουμε και διαχειριζόμαστε τις υπηρεσίες μας</li>
                <li>Δημιουργούμε και φιλοξενούμε τα προσκλητήριά σας</li>
                <li>Επεξεργαζόμαστε RSVPs και επικοινωνίες</li>
                <li>Στέλνουμε ειδοποιήσεις και ενημερώσεις</li>
                <li>Βελτιώνουμε την εμπειρία χρήστη</li>
                <li>Παρέχουμε τεχνική υποστήριξη</li>
                <li>Συμμορφωνόμαστε με νομικές υποχρεώσεις</li>
              </ul>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">3. Νομική Βάση Επεξεργασίας</h2>
              <p className="text-muted-foreground mb-4">
                Επεξεργαζόμαστε τα δεδομένα σας με βάση:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
                <li><strong>Συγκατάθεση:</strong> Όταν δίνετε ρητή συγκατάθεση</li>
                <li><strong>Σύμβαση:</strong> Για την εκτέλεση των υπηρεσιών μας</li>
                <li><strong>Νόμιμο Συμφέρον:</strong> Για τη βελτίωση των υπηρεσιών</li>
                <li><strong>Νομική Υποχρέωση:</strong> Όταν απαιτείται από το νόμο</li>
              </ul>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">4. Κοινοποίηση Δεδομένων</h2>
              <p className="text-muted-foreground mb-4">
                Δεν πουλάμε τα δεδομένα σας. Κοινοποιούμε πληροφορίες μόνο με:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
                <li><strong>Παρόχους Υπηρεσιών:</strong> Cloud hosting, email services (με NDAs)</li>
                <li><strong>Καλεσμένους:</strong> Όταν μοιράζεστε προσκλητήρια</li>
                <li><strong>Νομικές Αρχές:</strong> Όταν απαιτείται από το νόμο</li>
              </ul>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">5. Ασφάλεια Δεδομένων</h2>
              <p className="text-muted-foreground mb-4">
                Προστατεύουμε τα δεδομένα σας με:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
                <li>SSL/TLS κρυπτογράφηση για όλες τις μεταφορές δεδομένων</li>
                <li>Κρυπτογραφημένη αποθήκευση κωδικών</li>
                <li>Regular security audits και penetration testing</li>
                <li>Περιορισμένη πρόσβαση μόνο σε εξουσιοδοτημένο προσωπικό</li>
                <li>Backup και disaster recovery πολιτικές</li>
              </ul>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">6. Τα Δικαιώματά σας (GDPR)</h2>
              <p className="text-muted-foreground mb-4">
                Έχετε δικαίωμα να:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
                <li><strong>Πρόσβαση:</strong> Ζητήστε αντίγραφο των δεδομένων σας</li>
                <li><strong>Διόρθωση:</strong> Διορθώστε ανακριβή δεδομένα</li>
                <li><strong>Διαγραφή:</strong> Ζητήστε διαγραφή των δεδομένων σας</li>
                <li><strong>Περιορισμός:</strong> Περιορίστε την επεξεργασία</li>
                <li><strong>Φορητότητα:</strong> Λάβετε τα δεδομένα σε δομημένη μορφή</li>
                <li><strong>Εναντίωση:</strong> Αντιταχθείτε σε συγκεκριμένες επεξεργασίες</li>
                <li><strong>Ανάκληση Συγκατάθεσης:</strong> Ανακαλέστε τη συγκατάθεσή σας</li>
              </ul>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">7. Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Χρησιμοποιούμε cookies για:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
                <li><strong>Απαραίτητα:</strong> Λειτουργικότητα της πλατφόρμας</li>
                <li><strong>Απόδοσης:</strong> Ανάλυση χρήσης και βελτιστοποίηση</li>
                <li><strong>Λειτουργικά:</strong> Προτιμήσεις χρήστη</li>
              </ul>
              <p className="text-muted-foreground mb-8">
                Μπορείτε να διαχειριστείτε τις προτιμήσεις cookies στις ρυθμίσεις του browser σας.
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">8. Διατήρηση Δεδομένων</h2>
              <p className="text-muted-foreground mb-8">
                Διατηρούμε τα δεδομένα σας όσο διάστημα ο λογαριασμός σας είναι ενεργός ή όσο χρειάζεται για την 
                παροχή υπηρεσιών. Μετά τη διαγραφή λογαριασμού, τα δεδομένα διατηρούνται για 30 ημέρες και στη 
                συνέχεια διαγράφονται οριστικά, εκτός αν απαιτείται από το νόμο.
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">9. Δικαιώματα Ανηλίκων</h2>
              <p className="text-muted-foreground mb-8">
                Οι υπηρεσίες μας προορίζονται για άτομα 18 ετών και άνω. Δεν συλλέγουμε σκόπιμα δεδομένα από 
                ανήλικα. Αν πληροφορηθούμε ότι έχουμε δεδομένα ανηλίκου, θα τα διαγράψουμε άμεσα.
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">10. Διεθνείς Μεταφορές</h2>
              <p className="text-muted-foreground mb-8">
                Τα δεδομένα σας αποθηκεύονται σε servers εντός της Ευρωπαϊκής Ένωσης. Σε περίπτωση μεταφοράς 
                εκτός ΕΕ, διασφαλίζουμε επαρκή επίπεδα προστασίας μέσω Standard Contractual Clauses.
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">11. Αλλαγές στην Πολιτική</h2>
              <p className="text-muted-foreground mb-8">
                Ενημερώνουμε περιοδικά αυτήν την πολιτική. Σημαντικές αλλαγές θα κοινοποιούνται μέσω email 
                30 ημέρες πριν τεθούν σε ισχύ.
              </p>

              <h2 className="font-serif text-3xl font-bold mb-6 mt-12">12. Επικοινωνία</h2>
              <p className="text-muted-foreground mb-4">
                Για ερωτήσεις σχετικά με την πολιτική απορρήτου ή για άσκηση των δικαιωμάτων σας:
              </p>
              <ul className="list-none text-muted-foreground mb-8 space-y-2">
                <li>📧 Email: privacy@wedilink.com</li>
                <li>🔒 Data Protection Officer: dpo@wedilink.com</li>
                <li>📍 Διεύθυνση: Αθήνα, Ελλάδα</li>
                <li>📞 Τηλέφωνο: +30 210 123 4567</li>
              </ul>

              <p className="text-muted-foreground">
                Έχετε επίσης το δικαίωμα να υποβάλετε καταγγελία στην Αρχή Προστασίας Δεδομένων Προσωπικού 
                Χαρακτήρα (ΑΠΔΠΧ) αν πιστεύετε ότι τα δικαιώματά σας έχουν παραβιαστεί.
              </p>
            </div>
          </Card>

          {/* Navigation Links */}
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link to="/terms-of-service">
              <Button variant="outline">Όροι Χρήσης</Button>
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

export default PrivacyPolicy;
