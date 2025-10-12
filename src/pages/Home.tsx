import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Heart, CheckCircle, Image, Calendar, Share2, Users, Sparkles, Globe, Mail, Menu, FileText, HelpCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { FAQSection } from "@/components/FAQSection";
import { useState } from "react";
import weddingHero from "@/assets/wedding-hero-sample.jpg";
import baptismHero from "@/assets/baptism-hero-sample.jpg";
import partyHero from "@/assets/party-hero-sample.jpg";

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Heart className="h-7 w-7 text-primary animate-pulse" fill="currentColor" />
              <span className="font-serif text-2xl font-semibold text-foreground tracking-tight">
                WediLink
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Χαρακτηριστικά
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Τιμές
              </a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Κριτικές
              </a>
              
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium">
                      Υποστήριξη
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/user-guide"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <div className="text-sm font-medium leading-none">Οδηγός Χρήσης</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Μάθετε πώς να χρησιμοποιείτε το WediLink
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/faq"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 text-primary" />
                                <div className="text-sm font-medium leading-none">FAQ</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Συχνές ερωτήσεις και απαντήσεις
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/contact"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <div className="text-sm font-medium leading-none">Επικοινωνία</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Στείλτε μας μήνυμα
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="font-medium">
                  Σύνδεση
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all">
                  Ξεκινήστε Δωρεάν
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-6 mt-8">
                  <div className="flex flex-col gap-4">
                    <a
                      href="#features"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      Χαρακτηριστικά
                    </a>
                    <a
                      href="#pricing"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      Τιμές
                    </a>
                    <a
                      href="#testimonials"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      Κριτικές
                    </a>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-muted-foreground mb-3">Υποστήριξη</p>
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/user-guide"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-base hover:text-primary transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        Οδηγός Χρήσης
                      </Link>
                      <Link
                        to="/faq"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-base hover:text-primary transition-colors"
                      >
                        <HelpCircle className="h-4 w-4" />
                        FAQ
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-base hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        Επικοινωνία
                      </Link>
                    </div>
                  </div>

                  <div className="border-t pt-4 flex flex-col gap-3">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Σύνδεση
                      </Button>
                    </Link>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                        Ξεκινήστε Δωρεάν
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section - Premium */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMTAwLCAxNTAsIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-40 -z-10" />
        
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Χρησιμοποιείται από 5,000+ ζευγάρια</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              Ηλεκτρονικά προσκλητήρια<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
                τόσο μοναδικά όσο η αγάπη σας
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Δημιουργήστε εκπληκτικά προσκλητήρια, διαχειριστείτε RSVPs, 
              και κρατήστε τους καλεσμένους ενημερωμένους—όλα σε ένα μέρος.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link to="/login">
                <Button size="lg" className="text-base px-10 py-7 bg-gradient-to-r from-primary to-secondary hover:shadow-2xl transition-all duration-300 hover:scale-105 font-medium">
                  Ξεκινήστε Δωρεάν →
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base px-10 py-7 border-2 hover:bg-muted/50 transition-all">
                Δείτε Demo
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="pt-12 flex flex-wrap justify-center items-center gap-8 text-muted-foreground/60 text-sm">
              <span>Προτιμήθηκε από:</span>
              <span className="font-semibold">Vogue</span>
              <span className="font-semibold">Harper's Bazaar</span>
              <span className="font-semibold">Martha Stewart</span>
            </div>
          </div>

          {/* Stats - Elegant */}
          <div className="grid grid-cols-3 gap-8 mt-24 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="font-serif text-5xl md:text-6xl font-bold text-primary mb-2">5K+</div>
              <div className="text-muted-foreground text-sm">Ευτυχισμένα Ζευγάρια</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-5xl md:text-6xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground text-sm">Προσκλήσεις</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-5xl md:text-6xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground text-sm">Ικανοποίηση</div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Gallery Section */}
      <section id="templates" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Premium Templates</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Επιλέξτε το ιδανικό σχέδιο</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Επαγγελματικά templates για κάθε είδος εκδήλωσης
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Wedding Template */}
            <Card className="group overflow-hidden bg-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-3">
              <div className="aspect-[3/4] relative overflow-hidden">
                <img 
                  src={weddingHero} 
                  alt="Πρόσκληση Γάμου" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 to-pink-500/20" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-serif text-3xl font-bold mb-2">Γάμος</h3>
                  <p className="text-sm text-white/90">Κομψά σχέδια για την πιο σημαντική μέρα</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Countdown Timer
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Photo Gallery
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Interactive Maps
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    RSVP Form
                  </li>
                </ul>
                <Link to="/login" className="block">
                  <Button className="w-full" size="lg">
                    Δημιουργία Πρόσκλησης
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Baptism Template */}
            <Card className="group overflow-hidden bg-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-3">
              <div className="aspect-[3/4] relative overflow-hidden">
                <img 
                  src={baptismHero} 
                  alt="Πρόσκληση Βάπτισης" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-sky-500/20" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-serif text-3xl font-bold mb-2">Βάπτιση</h3>
                  <p className="text-sm text-white/90">Τρυφερά σχέδια για τη χριστιανική βάπτιση</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Godparents Section
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Church Details
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Gift Registry
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Event Timeline
                  </li>
                </ul>
                <Link to="/login" className="block">
                  <Button className="w-full" size="lg">
                    Δημιουργία Πρόσκλησης
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Party Template */}
            <Card className="group overflow-hidden bg-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-3">
              <div className="aspect-[3/4] relative overflow-hidden">
                <img 
                  src={partyHero} 
                  alt="Πρόσκληση Party" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-violet-500/20" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-serif text-3xl font-bold mb-2">Πάρτυ</h3>
                  <p className="text-sm text-white/90">Ζωηρά σχέδια για κάθε γιορτή</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Custom Theme
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Venue Details
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Dress Code
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Music Playlist
                  </li>
                </ul>
                <Link to="/login" className="block">
                  <Button className="w-full" size="lg">
                    Δημιουργία Πρόσκλησης
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section - Professional */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Όλα όσα χρειάζεστε για τον τέλειο γάμο</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ένα ολοκληρωμένο σύστημα για τη δημιουργία και διαχείριση των προσκλητηρίων σας
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Heart, title: "Όμορφα Σχέδια", desc: "Επαγγελματικά templates που προσαρμόζονται στο στυλ σας", gradient: "from-pink-500 to-rose-500" },
              { icon: CheckCircle, title: "RSVP Manager", desc: "Παρακολουθήστε απαντήσεις σε πραγματικό χρόνο με αυτοματοποιημένα emails", gradient: "from-emerald-500 to-green-500" },
              { icon: Image, title: "Photo Gallery", desc: "Ανεβάστε και μοιραστείτε απεριόριστες φωτογραφίες με τους καλεσμένους", gradient: "from-purple-500 to-violet-500" },
              { icon: Calendar, title: "Smart Calendar", desc: "Αυτόματη προσθήκη events στο ημερολόγιο των καλεσμένων (.ics)", gradient: "from-blue-500 to-cyan-500" },
              { icon: Users, title: "Guest Management", desc: "Διαχειριστείτε λίστες καλεσμένων, dietary needs και seating plans", gradient: "from-amber-500 to-orange-500" },
              { icon: Globe, title: "Multi-Language", desc: "Δημιουργήστε προσκλήσεις στα Ελληνικά και Αγγλικά", gradient: "from-teal-500 to-cyan-500" },
              { icon: Share2, title: "Easy Sharing", desc: "Μοιραστείτε μέσω WhatsApp, email, SMS ή QR code", gradient: "from-indigo-500 to-purple-500" },
              { icon: Mail, title: "Email Notifications", desc: "Αυτόματα emails επιβεβαίωσης και υπενθυμίσεις", gradient: "from-rose-500 to-pink-500" },
              { icon: Sparkles, title: "Gift Registry", desc: "Ενσωματωμένη λίστα γάμου με IBAN και QR codes για δώρα", gradient: "from-yellow-500 to-amber-500" },
            ].map((feature, i) => (
              <Card key={i} className="group p-8 bg-card hover:bg-card/80 border hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Heart className="h-4 w-4" fill="currentColor" />
              <span className="text-sm font-medium">Ικανοποιημένα Ζευγάρια</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Τι λένε τα ζευγάρια μας</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Χιλιάδες ζευγάρια εμπιστεύτηκαν το WediLink για τον γάμο τους
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "Το WediLink μας έκανε τη ζωή πολύ πιο εύκολη! Δημιουργήσαμε υπέροχα προσκλητήρια σε λίγα λεπτά και οι καλεσμένοι μας το λάτρεψαν.",
                name: "Μαρία & Γιώργος",
                location: "Αθήνα",
                initial: "Μ"
              },
              {
                quote: "Η γκαλερί φωτογραφιών και η λίστα γάμου ήταν ό,τι καλύτερο! Οι καλεσμένοι μπορούσαν να δουν τις φωτογραφίες μας και να στείλουν δώρα εύκολα.",
                name: "Ελένη & Νίκος",
                location: "Θεσσαλονίκη",
                initial: "Ε"
              },
              {
                quote: "Εξαιρετική εξυπηρέτηση! Μας βοήθησαν να δημιουργήσουμε ακριβώς το προσκλητήριο που φανταστήκαμε. Το σύστημα είναι πολύ εύχρηστο!",
                name: "Κωνσταντίνα & Αλέξης",
                location: "Πάτρα",
                initial: "Κ"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="p-8 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-6xl text-primary/20 mb-4 leading-none font-serif">"</div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="font-bold text-white text-lg">{testimonial.initial}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Επιλέξτε το πλάνο σας</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Εφάπαξ πληρωμή, χωρίς συνδρομές ή κρυφές χρεώσεις
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <Card className="relative p-8 bg-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold mb-2">Basic</h3>
                  <p className="text-sm text-muted-foreground">Ιδανικό για απλές εκδηλώσεις</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-5xl font-bold text-card-foreground">€39</span>
                  <span className="text-muted-foreground">εφάπαξ</span>
                </div>
                <Link to="/login">
                  <Button className="w-full" size="lg">Ξεκινήστε</Button>
                </Link>
                <ul className="space-y-3 pt-6">
                  {[
                    "5 επαγγελματικά θέματα",
                    "Φόρμα RSVP",
                    "Email επιβεβαιώσεις",
                    "Γκαλερί φωτογραφιών",
                    "Add-to-Calendar (.ics)",
                    "Εξαγωγή CSV/Excel",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Plus Plan - Popular */}
            <Card className="relative p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-3 scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-full">
                Δημοφιλές
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold mb-2">Plus</h3>
                  <p className="text-sm text-muted-foreground">Για ζευγάρια που θέλουν περισσότερα</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-5xl font-bold text-primary">€69</span>
                  <span className="text-muted-foreground">εφάπαξ</span>
                </div>
                <Link to="/login">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary" size="lg">Ξεκινήστε</Button>
                </Link>
                <ul className="space-y-3 pt-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-card-foreground">Όλα από Basic +</span>
                  </li>
                  {[
                    "10+ premium θέματα",
                    "Προστασία με κωδικό",
                    "Gift Registry με QR codes",
                    "Live Photo Wall",
                    "Guest list management",
                    "Dietary tracking",
                    "Zapier/Make webhooks",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Premium Plan */}
            <Card className="relative p-8 bg-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold mb-2">Premium</h3>
                  <p className="text-sm text-muted-foreground">Πλήρης έλεγχος & δυνατότητες</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-5xl font-bold text-card-foreground">€119</span>
                  <span className="text-muted-foreground">εφάπαξ</span>
                </div>
                <Link to="/login">
                  <Button className="w-full" size="lg" variant="outline">Ξεκινήστε</Button>
                </Link>
                <ul className="space-y-3 pt-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-card-foreground">Όλα από Plus +</span>
                  </li>
                  {[
                    "Custom subdomain",
                    "Email υπενθυμίσεις",
                    "Seating chart planner",
                    "Custom fonts upload",
                    "A/B testing",
                    "SMS/WhatsApp reminders",
                    "Advanced analytics",
                    "Priority support 24/7",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          {/* Money-back guarantee */}
          <div className="text-center mt-16">
            <p className="text-sm text-muted-foreground">
              💝 30-ημέρες εγγύηση επιστροφής χρημάτων • 🔒 Ασφαλείς πληρωμές • ⚡ Instant setup
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <FAQSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              Ξεκινήστε το γαμήλιο ταξίδι σας σήμερα
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Δημιουργήστε το τέλειο προσκλητήριο σε λιγότερο από 10 λεπτά
            </p>
            <Link to="/login">
              <Button size="lg" className="text-base px-12 py-7 bg-gradient-to-r from-primary to-secondary hover:shadow-2xl transition-all duration-300 hover:scale-105 font-medium">
                Δημιουργήστε Δωρεάν Τώρα →
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Χωρίς πιστωτική κάρτα • Δωρεάν για πάντα
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-primary" fill="currentColor" />
                <span className="font-serif text-xl font-semibold">WediLink</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Τα καλύτερα ηλεκτρονικά προσκλητήρια για γάμους, βαπτίσεις και parties.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Προϊόν</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Χαρακτηριστικά</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Τιμές</a></li>
                <li><a href="#templates" className="hover:text-foreground transition-colors">Templates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Υποστήριξη</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/user-guide" className="hover:text-foreground transition-colors">Οδηγός Χρήσης</Link></li>
                <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Επικοινωνία</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/terms-of-service" className="hover:text-foreground transition-colors">Όροι Χρήσης</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/gdpr" className="hover:text-foreground transition-colors">GDPR</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 WediLink. All rights reserved. Made with ❤️ for couples everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
