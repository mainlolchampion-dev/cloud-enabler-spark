import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import PageHeader from "@/components/layout/PageHeader";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Το όνομα είναι υποχρεωτικό").max(100, "Το όνομα πρέπει να είναι έως 100 χαρακτήρες"),
  email: z.string().trim().email("Μη έγκυρη διεύθυνση email").max(255, "Το email πρέπει να είναι έως 255 χαρακτήρες"),
  phone: z.string().trim().max(20, "Το τηλέφωνο πρέπει να είναι έως 20 χαρακτήρες").optional(),
  subject: z.string().trim().min(1, "Το θέμα είναι υποχρεωτικό").max(200, "Το θέμα πρέπει να είναι έως 200 χαρακτήρες"),
  message: z.string().trim().min(10, "Το μήνυμα πρέπει να έχει τουλάχιστον 10 χαρακτήρες").max(2000, "Το μήνυμα πρέπει να είναι έως 2000 χαρακτήρες"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) {
          newErrors[error.path[0] as keyof ContactFormData] = error.message;
        }
      });
      setErrors(newErrors);
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ διορθώστε τα σφάλματα στη φόρμα",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: validation.data,
      });

      if (error) throw error;

      toast({
        title: "Επιτυχία!",
        description: "Το μήνυμά σας στάλθηκε επιτυχώς. Θα επικοινωνήσουμε μαζί σας σύντομα.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η αποστολή του μηνύματος. Παρακαλώ δοκιμάστε ξανά.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="p-4 rounded-full bg-primary/10">
              <MessageCircle className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Επικοινωνήστε μαζί μας
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            Είμαστε εδώ για να σας βοηθήσουμε. Στείλτε μας το μήνυμά σας και θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-8 animate-fade-in">
              <h2 className="font-serif text-3xl font-bold mb-6">Στείλτε μας μήνυμα</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Όνομα *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Το όνομά σας"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Τηλέφωνο (προαιρετικό)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+30 123 456 7890"
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subject">Θέμα *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Το θέμα του μηνύματος"
                    className={errors.subject ? "border-destructive" : ""}
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive mt-1">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message">Μήνυμα *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Πείτε μας πώς μπορούμε να σας βοηθήσουμε..."
                    rows={6}
                    className={errors.message ? "border-destructive" : ""}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive mt-1">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gap-2 bg-gradient-to-r from-primary to-secondary"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>Αποστολή...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Αποστολή Μηνύματος
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8 animate-fade-in">
              <Card className="p-8 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Email</h3>
                    <a href="mailto:wedilink@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                      wedilink@gmail.com
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Απαντάμε εντός 24 ωρών
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Τηλέφωνο</h3>
                    <a href="tel:+302101234567" className="text-muted-foreground hover:text-primary transition-colors">
                      +30 210 123 4567
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Δευτέρα - Παρασκευή: 9:00 - 18:00
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Διεύθυνση</h3>
                    <p className="text-muted-foreground">
                      Αθήνα, Ελλάδα
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Κατόπιν ραντεβού
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Ωράριο Λειτουργίας</h3>
                    <div className="space-y-1 text-muted-foreground">
                      <p>Δευτέρα - Παρασκευή: 9:00 - 18:00</p>
                      <p>Σάββατο: 10:00 - 14:00</p>
                      <p>Κυριακή: Κλειστά</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Social Links */}
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
                <h3 className="font-semibold text-lg mb-4">Ακολουθήστε μας</h3>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" className="hover:bg-primary hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon" className="hover:bg-primary hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon" className="hover:bg-primary hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                    </svg>
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* FAQ Link */}
          <Card className="mt-12 p-8 text-center bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 animate-fade-in">
            <h3 className="font-serif text-2xl font-bold mb-4">Έχετε ερωτήσεις;</h3>
            <p className="text-muted-foreground mb-6">
              Δείτε πρώτα τις συχνές ερωτήσεις - μπορεί να έχετε ήδη την απάντησή σας!
            </p>
            <Link to="/faq">
              <Button variant="outline" size="lg">
                Δείτε τις Συχνές Ερωτήσεις
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Contact;
