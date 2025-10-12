import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { FAQSection } from "@/components/FAQSection";

const FAQ = () => {
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
            Συχνές Ερωτήσεις
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Βρείτε απαντήσεις στις πιο συχνές ερωτήσεις σχετικά με το WediLink.
            Αν δεν βρείτε αυτό που ψάχνετε, μη διστάσετε να επικοινωνήσετε μαζί μας.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <FAQSection />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="font-serif text-3xl font-bold mb-4">Χρειάζεστε περισσότερη βοήθεια;</h2>
          <p className="text-muted-foreground mb-8">
            Η ομάδα υποστήριξής μας είναι εδώ για να σας βοηθήσει. Επικοινωνήστε μαζί μας οποιαδήποτε στιγμή.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@wedilink.com">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
                Επικοινωνία
              </Button>
            </a>
            <Link to="/user-guide">
              <Button size="lg" variant="outline">
                Οδηγός Χρήσης
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
