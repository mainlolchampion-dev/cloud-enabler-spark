import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ArrowLeft, CheckCircle, Users, Image, Calendar, Mail, Share2, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const UserGuide = () => {
  const sections = [
    {
      icon: Heart,
      title: "Ξεκινώντας",
      steps: [
        "Δημιουργήστε λογαριασμό ή συνδεθείτε",
        "Επιλέξτε τον τύπο εκδήλωσης (Γάμος, Βάπτιση, Πάρτι)",
        "Επιλέξτε το template που σας αρέσει",
        "Αρχίστε να προσαρμόζετε το προσκλητήριό σας"
      ]
    },
    {
      icon: Image,
      title: "Προσθήκη Περιεχομένου",
      steps: [
        "Ανεβάστε φωτογραφίες από το gallery σας",
        "Προσθέστε κείμενο και λεπτομέρειες εκδήλωσης",
        "Εισάγετε πληροφορίες τοποθεσίας με χάρτη",
        "Προσθέστε πληροφορίες κουμπάρων/νονών"
      ]
    },
    {
      icon: Users,
      title: "Διαχείριση Καλεσμένων",
      steps: [
        "Προσθέστε καλεσμένους στη λίστα σας",
        "Οργανώστε τους σε κατηγορίες",
        "Παρακολουθήστε RSVPs σε πραγματικό χρόνο",
        "Δείτε στατιστικά και αναφορές"
      ]
    },
    {
      icon: Calendar,
      title: "Χρονοδιάγραμμα & Events",
      steps: [
        "Ορίστε την ημερομηνία της εκδήλωσης",
        "Προσθέστε countdown timer",
        "Δημιουργήστε timeline με events",
        "Στείλτε .ics αρχείο για ημερολόγια"
      ]
    },
    {
      icon: Mail,
      title: "RSVP & Επικοινωνία",
      steps: [
        "Ενεργοποιήστε τη φόρμα RSVP",
        "Λάβετε αυτόματες ειδοποιήσεις email",
        "Στείλτε υπενθυμίσεις στους καλεσμένους",
        "Διαχειριστείτε διατροφικές προτιμήσεις"
      ]
    },
    {
      icon: Gift,
      title: "Λίστα Γάμου & Δώρα",
      steps: [
        "Προσθέστε τραπεζικούς λογαριασμούς",
        "Δημιουργήστε QR codes για δώρα",
        "Προσθέστε σύνδεσμο e-shop",
        "Παρακολουθήστε τα δώρα"
      ]
    },
    {
      icon: Share2,
      title: "Δημοσίευση & Κοινοποίηση",
      steps: [
        "Κάντε preview το προσκλητήριο",
        "Δημοσιεύστε το και λάβετε unique link",
        "Μοιραστείτε μέσω WhatsApp, email, SMS",
        "Δημιουργήστε QR code για εκτύπωση"
      ]
    },
    {
      icon: CheckCircle,
      title: "Συμβουλές Pro",
      steps: [
        "Ενημερώνετε τακτικά το περιεχόμενο",
        "Δοκιμάστε το προσκλητήριο σε διάφορες συσκευές",
        "Χρησιμοποιήστε φωτογραφίες υψηλής ποιότητας",
        "Στείλτε υπενθυμίσεις 1 εβδομάδα πριν"
      ]
    }
  ];

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
            Οδηγός Χρήσης
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ένας πλήρης οδηγός για να δημιουργήσετε το τέλειο προσκλητήριο σε λίγα λεπτά.
            Ακολουθήστε τα βήματα παρακάτω για να ξεκινήσετε.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-semibold mb-2">{section.title}</h3>
                  </div>
                </div>
                <ul className="space-y-3">
                  {section.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          {/* Quick Start Video Section */}
          <Card className="mt-16 p-12 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
            <h2 className="font-serif text-3xl font-bold mb-4">Βίντεο Εκμάθησης</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Δείτε το βήμα-προς-βήμα video tutorial μας για να ξεκινήσετε γρήγορα
            </p>
            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center max-w-4xl mx-auto">
              <div className="text-center">
                <Heart className="h-16 w-16 text-primary mx-auto mb-4" fill="currentColor" />
                <p className="text-muted-foreground">Το video tutorial θα είναι σύντομα διαθέσιμο</p>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center mt-16">
            <h2 className="font-serif text-3xl font-bold mb-4">Έτοιμοι να ξεκινήσετε;</h2>
            <p className="text-muted-foreground mb-8">
              Δημιουργήστε το πρώτο σας προσκλητήριο σε λιγότερο από 10 λεπτά
            </p>
            <Link to="/login">
              <Button size="lg" className="px-12 py-7 bg-gradient-to-r from-primary to-secondary">
                Δημιουργία Πρόσκλησης →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserGuide;
