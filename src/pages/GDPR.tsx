import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Download, Trash2, Eye, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";

const GDPR = () => {
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
            GDPR Compliance
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Γενικός Κανονισμός Προστασίας Δεδομένων (GDPR)
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Your Rights */}
          <Card className="p-8 md:p-12 mb-12">
            <h2 className="font-serif text-4xl font-bold mb-8 text-center">Τα Δικαιώματά σας υπό τον GDPR</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <Card className="p-6 border-2 hover:border-primary/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Δικαίωμα Πρόσβασης</h3>
                    <p className="text-muted-foreground">
                      Μπορείτε να ζητήσετε πρόσβαση σε όλα τα προσωπικά δεδομένα που διατηρούμε για εσάς. 
                      Θα σας παρέχουμε ένα πλήρες αντίγραφο εντός 30 ημερών.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 hover:border-primary/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Edit className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Δικαίωμα Διόρθωσης</h3>
                    <p className="text-muted-foreground">
                      Έχετε το δικαίωμα να διορθώσετε ανακριβή ή ελλιπή προσωπικά δεδομένα που σας αφορούν.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 hover:border-primary/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Trash2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Δικαίωμα Διαγραφής</h3>
                    <p className="text-muted-foreground">
                      Γνωστό και ως "δικαίωμα στη λήθη". Μπορείτε να ζητήσετε τη διαγραφή των προσωπικών σας δεδομένων 
                      υπό συγκεκριμένες συνθήκες.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 hover:border-primary/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Δικαίωμα Φορητότητας</h3>
                    <p className="text-muted-foreground">
                      Λάβετε τα δεδομένα σας σε δομημένη, κοινώς χρησιμοποιούμενη και αναγνώσιμη από μηχανή μορφή (JSON).
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </Card>

          {/* How to Exercise Rights */}
          <Card className="p-8 md:p-12 mb-12">
            <h2 className="font-serif text-4xl font-bold mb-8">Πώς να Ασκήσετε τα Δικαιώματά σας</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-6 py-2">
                <h3 className="font-semibold text-xl mb-2">1. Μέσω Dashboard</h3>
                <p className="text-muted-foreground">
                  Συνδεθείτε στον λογαριασμό σας και επισκεφθείτε τις Ρυθμίσεις → Προστασία Δεδομένων για να 
                  διαχειριστείτε τα δικαιώματά σας άμεσα.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6 py-2">
                <h3 className="font-semibold text-xl mb-2">2. Μέσω Email</h3>
                <p className="text-muted-foreground mb-3">
                  Στείλτε email στο <strong>privacy@wedilink.com</strong> με τα παρακάτω:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Όνομα και email λογαριασμού</li>
                  <li>Το δικαίωμα που θέλετε να ασκήσετε</li>
                  <li>Απόδειξη ταυτότητας (για ασφάλεια)</li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-6 py-2">
                <h3 className="font-semibold text-xl mb-2">3. Μέσω Αίτησης GDPR</h3>
                <p className="text-muted-foreground mb-4">
                  Συμπληρώστε την επίσημη φόρμα αίτησης GDPR και στείλτε την στο <strong>dpo@wedilink.com</strong>
                </p>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  Λήψη Φόρμας GDPR
                </Button>
              </div>
            </div>

            <div className="mt-8 p-6 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">
                ⏱️ <strong>Χρόνος Απόκρισης:</strong> Θα απαντήσουμε στο αίτημά σας εντός <strong>30 ημερών</strong>. 
                Σε περίπλοκες περιπτώσεις, μπορούμε να επεκτείνουμε αυτήν την περίοδο κατά 2 μήνες, ενημερώνοντάς σας για την καθυστέρηση.
              </p>
            </div>
          </Card>

          {/* Data We Collect */}
          <Card className="p-8 md:p-12 mb-12">
            <h2 className="font-serif text-4xl font-bold mb-8">Δεδομένα που Συλλέγουμε</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Προσωπικά Στοιχεία</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Όνομα, Επώνυμο</li>
                  <li>• Email</li>
                  <li>• Τηλέφωνο (προαιρετικό)</li>
                  <li>• Κωδικός πρόσβασης</li>
                </ul>
              </div>

              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Δεδομένα Εκδήλωσης</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Φωτογραφίες</li>
                  <li>• Κείμενα</li>
                  <li>• Τοποθεσίες</li>
                  <li>• Λίστες καλεσμένων</li>
                </ul>
              </div>

              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Τεχνικά Δεδομένα</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• IP Address</li>
                  <li>• Browser Type</li>
                  <li>• Cookies</li>
                  <li>• Usage Analytics</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Compliance Measures */}
          <Card className="p-8 md:p-12 mb-12">
            <h2 className="font-serif text-4xl font-bold mb-8">Μέτρα Συμμόρφωσης</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="p-2 rounded bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Κρυπτογράφηση</h3>
                  <p className="text-sm text-muted-foreground">
                    Όλα τα δεδομένα κρυπτογραφούνται σε μετάδοση (TLS/SSL) και εν αναμονή (AES-256).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="p-2 rounded bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Data Minimization</h3>
                  <p className="text-sm text-muted-foreground">
                    Συλλέγουμε μόνο τα απαραίτητα δεδομένα για την παροχή των υπηρεσιών μας.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="p-2 rounded bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Privacy by Design</h3>
                  <p className="text-sm text-muted-foreground">
                    Η προστασία δεδομένων ενσωματώνεται από το σχεδιασμό σε όλα τα συστήματά μας.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="p-2 rounded bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Regular Audits</h3>
                  <p className="text-sm text-muted-foreground">
                    Διενεργούμε τακτικούς ελέγχους ασφαλείας και συμμόρφωσης.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="p-2 rounded bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Data Protection Officer</h3>
                  <p className="text-sm text-muted-foreground">
                    Διαθέτουμε αποκλειστικό DPO για την επίβλεψη της συμμόρφωσης GDPR.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact DPO */}
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold mb-4">Επικοινωνήστε με τον DPO</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Για οποιαδήποτε ερώτηση σχετικά με την προστασία των δεδομένων σας, επικοινωνήστε με τον 
                Data Protection Officer μας:
              </p>
              
              <div className="space-y-3 mb-8">
                <p className="text-lg"><strong>Email:</strong> dpo@wedilink.com</p>
                <p className="text-lg"><strong>Τηλέφωνο:</strong> +30 210 123 4567</p>
                <p className="text-lg"><strong>Διεύθυνση:</strong> Αθήνα, Ελλάδα</p>
              </div>

              <div className="p-6 bg-muted/50 rounded-lg max-w-2xl mx-auto">
                <p className="text-sm text-muted-foreground">
                  <strong>Καταγγελίες:</strong> Έχετε επίσης το δικαίωμα να υποβάλετε καταγγελία στην 
                  <strong> Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (ΑΠΔΠΧ)</strong> αν πιστεύετε ότι 
                  δεν συμμορφωνόμαστε με τον GDPR.
                </p>
              </div>
            </div>
          </Card>

          {/* Navigation Links */}
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link to="/privacy-policy">
              <Button variant="outline">Privacy Policy</Button>
            </Link>
            <Link to="/terms-of-service">
              <Button variant="outline">Όροι Χρήσης</Button>
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

export default GDPR;
