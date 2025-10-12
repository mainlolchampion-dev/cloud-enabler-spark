import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, CheckCircle, Users, Image, Calendar, Mail, Share2, Gift, Play, Book, Lightbulb, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";

const UserGuide = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "Όλα", icon: Book },
    { id: "getting-started", label: "Ξεκινώντας", icon: Zap },
    { id: "features", label: "Λειτουργίες", icon: Lightbulb },
    { id: "advanced", label: "Προχωρημένα", icon: Users }
  ];

  const sections = [
    {
      icon: Heart,
      title: "Ξεκινώντας",
      category: "getting-started",
      steps: [
        "Δημιουργήστε λογαριασμό με το email σας",
        "Επιλέξτε τον τύπο εκδήλωσης (Γάμος, Βάπτιση, Πάρτι)",
        "Επιλέξτε το template που σας ταιριάζει",
        "Αρχίστε να προσαρμόζετε το προσκλητήριό σας",
        "Προσθέστε τα βασικά στοιχεία (ονόματα, ημερομηνία, τοποθεσία)"
      ]
    },
    {
      icon: Image,
      title: "Προσθήκη Περιεχομένού",
      category: "features",
      steps: [
        "Ανεβάστε φωτογραφίες υψηλής ποιότητας (JPG, PNG μέχρι 10MB)",
        "Προσθέστε φωτογραφίες του ζευγαριού ή του βαπτιζόμενου",
        "Δημιουργήστε photo gallery με απεριόριστες φωτογραφίες",
        "Γράψτε προσωπικό κείμενο πρόσκλησης",
        "Εισάγετε την τοποθεσία με interactive χάρτη",
        "Προσθέστε πληροφορίες κουμπάρων/νονών με φωτογραφίες"
      ]
    },
    {
      icon: Users,
      title: "Διαχείριση Καλεσμένων",
      category: "features",
      steps: [
        "Εισάγετε καλεσμένους μεμονωμένα ή bulk import από Excel",
        "Οργανώστε τους σε κατηγορίες (οικογένεια, φίλοι, συνάδελφοι)",
        "Παρακολουθήστε RSVPs σε πραγματικό χρόνο",
        "Δείτε ποιοι έχουν απαντήσει και ποιοι όχι",
        "Καταγράψτε διατροφικές προτιμήσεις και αλλεργίες",
        "Δημιουργήστε seating plan για το δείπνο",
        "Εξάγετε λίστες καλεσμένων σε PDF/Excel"
      ]
    },
    {
      icon: Calendar,
      title: "Χρονοδιάγραμμα & Events",
      category: "features",
      steps: [
        "Ορίστε την ημερομηνία και ώρα της εκδήλωσης",
        "Προσθέστε countdown timer που ενημερώνεται αυτόματα",
        "Δημιουργήστε λεπτομερές timeline της ημέρας",
        "Προσθέστε πολλαπλά events (γάμος, δεξίωση, after party)",
        "Ορίστε διαφορετικές τοποθεσίες για κάθε event",
        "Οι καλεσμένοι μπορούν να προσθέσουν στο ημερολόγιό τους (.ics)",
        "Στείλτε αυτόματες υπενθυμίσεις πριν την εκδήλωση"
      ]
    },
    {
      icon: Mail,
      title: "RSVP & Επικοινωνία",
      category: "features",
      steps: [
        "Ενεργοποιήστε τη φόρμα RSVP στο προσκλητήριο",
        "Ζητήστε επιβεβαίωση συμμετοχής με 1 κλικ",
        "Λάβετε real-time ειδοποιήσεις για κάθε RSVP",
        "Στείλτε αυτόματα emails επιβεβαίωσης",
        "Συλλέξτε πληροφορίες (αριθμός ατόμων, διατροφικές προτιμήσεις)",
        "Στείλτε bulk emails σε όλους τους καλεσμένους",
        "Προσθέστε custom ερωτήσεις στη φόρμα RSVP",
        "Στείλτε υπενθυμίσεις 1 εβδομάδα πριν"
      ]
    },
    {
      icon: Gift,
      title: "Λίστα Γάμου & Δώρα",
      category: "features",
      steps: [
        "Προσθέστε τραπεζικούς λογαριασμούς (IBAN)",
        "Δημιουργήστε QR codes για άμεση πληρωμή",
        "Συνδέστε το e-shop της λίστας γάμου σας",
        "Προσθέστε συγκεκριμένα προϊόντα με links",
        "Οι καλεσμένοι μπορούν να σκανάρουν το QR και να στείλουν δώρο",
        "Παρακολουθήστε ποιος έστειλε δώρο (προαιρετικό)",
        "Προσθέστε ευχαριστήρια μηνύματα μετά την εκδήλωση"
      ]
    },
    {
      icon: Share2,
      title: "Δημοσίευση & Κοινοποίηση",
      category: "advanced",
      steps: [
        "Κάντε preview το προσκλητήριο σε όλες τις συσκευές",
        "Δημοσιεύστε το και λάβετε unique URL",
        "Μοιραστείτε άμεσα μέσω WhatsApp με 1 κλικ",
        "Στείλτε μέσω email σε όλη τη λίστα",
        "Αντιγράψτε το link για SMS ή messenger",
        "Δημιουργήστε QR code για εκτυπωμένα προσκλητήρια",
        "Παρακολουθήστε πόσοι επισκέπτες είδαν το προσκλητήριο",
        "Κάντε αλλαγές ακόμα και μετά τη δημοσίευση"
      ]
    },
    {
      icon: CheckCircle,
      title: "Συμβουλές Pro",
      category: "advanced",
      steps: [
        "Ξεκινήστε νωρίς - δημιουργήστε το προσκλητήριο 2-3 μήνες πριν",
        "Χρησιμοποιήστε professional φωτογραφίες (min 1920px)",
        "Κρατήστε το κείμενο σύντομο και ξεκάθαρο",
        "Δοκιμάστε σε mobile, tablet και desktop",
        "Ενημερώνετε τακτικά με νέες πληροφορίες",
        "Στείλτε το προσκλητήριο 6-8 εβδομάδες πριν",
        "Στείλτε reminder 1 εβδομάδα πριν την εκδήλωση",
        "Χρησιμοποιήστε το QR code σε εκτυπωμένα προσκλητήρια",
        "Κάντε backup τη λίστα καλεσμένων",
        "Παρακολουθήστε τα analytics για να δείτε engagement"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

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
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="gap-2 animate-fade-in"
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </Button>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {sections
              .filter(section => selectedCategory === "all" || section.category === selectedCategory)
              .map((section, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in">
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

          {/* Video & Tips Section */}
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <h2 className="font-serif text-2xl font-bold">Video Tutorials</h2>
              </div>
              <div className="aspect-video bg-muted rounded-xl flex items-center justify-center mb-6">
                <div className="text-center">
                  <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Video tutorial coming soon</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Παρακολουθήστε βήμα-προς-βήμα οδηγίες για να δημιουργήσετε το τέλειο προσκλητήριο
              </p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-secondary/5 to-accent/5 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-secondary">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h2 className="font-serif text-2xl font-bold">Quick Tips</h2>
              </div>
              <ul className="space-y-4">
                {[
                  "💡 Χρησιμοποιήστε φωτογραφίες τουλάχιστον 1920px",
                  "⏰ Στείλτε προσκλητήρια 6-8 εβδομάδες πριν",
                  "📱 Δοκιμάστε σε όλες τις συσκευές",
                  "✉️ Στείλτε reminder 1 εβδομάδα πριν",
                  "🎨 Κρατήστε το design απλό και κομψό",
                  "📊 Παρακολουθήστε τα RSVPs τακτικά"
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-1">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* FAQ Quick Links */}
          <Card className="mt-8 p-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 animate-fade-in">
            <h2 className="font-serif text-2xl font-bold mb-6 text-center">Χρειάζεστε Περισσότερη Βοήθεια;</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/faq" className="block">
                <div className="p-6 bg-background rounded-lg hover:shadow-lg transition-all hover:-translate-y-1">
                  <h3 className="font-semibold mb-2">📚 FAQ</h3>
                  <p className="text-sm text-muted-foreground">Απαντήσεις σε συχνές ερωτήσεις</p>
                </div>
              </Link>
              <a href="mailto:support@wedilink.com" className="block">
                <div className="p-6 bg-background rounded-lg hover:shadow-lg transition-all hover:-translate-y-1">
                  <h3 className="font-semibold mb-2">📧 Email Support</h3>
                  <p className="text-sm text-muted-foreground">Επικοινωνήστε με την ομάδα μας</p>
                </div>
              </a>
              <Link to="/login" className="block">
                <div className="p-6 bg-background rounded-lg hover:shadow-lg transition-all hover:-translate-y-1">
                  <h3 className="font-semibold mb-2">💬 Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Άμεση υποστήριξη online</p>
                </div>
              </Link>
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
