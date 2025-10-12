import { useLocale } from '@/hooks/useLocale';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MessageCircle } from 'lucide-react';

export function FAQSection() {
  const { locale } = useLocale();
  const isGreek = locale === 'el';

  const faqsEl = [
    {
      question: 'Πόσο κοστίζει η δημιουργία μιας ψηφιακής πρόσκλησης;',
      answer: 'Το WediLink είναι δωρεάν για βασικές λειτουργίες! Για premium χαρακτηριστικά όπως προστασία με κωδικό, απεριόριστες φωτογραφίες και custom domain, προσφέρουμε πακέτα από €39.',
    },
    {
      question: 'Πως γίνεται η δημιουργία του προσκλητηρίου;',
      answer: 'Η διαδικασία είναι πολύ απλή: 1) Εγγραφείτε δωρεάν 2) Επιλέξτε template (Γάμος/Βάπτιση/Πάρτι) 3) Προσθέστε φωτογραφίες και κείμενα 4) Προσαρμόστε χρώματα και fonts 5) Δημοσιεύστε και μοιραστείτε! Ολόκληρη η διαδικασία διαρκεί μόνο 10 λεπτά.',
    },
    {
      question: 'Μπορείτε να αναλάβετε εσείς την δημιουργία της πρόσκλησης μου;',
      answer: 'Ναι, παρέχουμε υπηρεσία πλήρους δημιουργίας προσκλητηρίου με επαγγελματικό σχεδιασμό. Απλά στείλτε μας τις φωτογραφίες και τις πληροφορίες σας και εμείς φτιάχνουμε το τέλειο προσκλητήριο για εσάς. Επικοινωνήστε στο design@wedilink.com για προσφορά.',
    },
    {
      question: 'Πως μπορώ να αποστείλω την πρόσκληση μου στους καλεσμένους;',
      answer: 'Έχετε πολλές επιλογές! Μοιραστείτε το μοναδικό link μέσω WhatsApp (1 κλικ), email (bulk αποστολή), SMS, ή social media. Επίσης μπορείτε να δημιουργήσετε QR code για να το εκτυπώσετε σε φυσικά προσκλητήρια.',
    },
    {
      question: 'Πως ενημερώνομαι για την παρουσία των καλεσμένων μου;',
      answer: 'Το σύστημα RSVP σας ενημερώνει αυτόματα! Λαμβάνετε instant email και push notifications όταν κάποιος επιβεβαιώσει. Δείτε real-time στατιστικά, ποιος έχει απαντήσει, διατροφικές προτιμήσεις και αριθμό ατόμων. Εξάγετε τη λίστα σε Excel για seating arrangements.',
    },
    {
      question: 'Την πρόσκληση μου μπορούν να την δουν όλοι;',
      answer: 'Εξαρτάται από εσάς! Το Basic πακέτο είναι δημόσιο (όποιος έχει το link). Στο Plus πακέτο μπορείτε να προσθέσετε password protection. Στο Premium έχετε και guest list verification - μόνο οι καλεσμένοι που προσθέσατε μπορούν να δουν την πρόσκληση.',
    },
    {
      question: 'Για πόσο καιρό θα μείνει δημοσιευμένη η πρόσκληση μου;',
      answer: 'Η πρόσκλησή σας παραμένει online για πάντα! Δεν υπάρχει χρονικός περιορισμός. Μπορείτε να κρατήσετε ζωντανές τις αναμνήσεις και να μοιράζεστε φωτογραφίες ακόμα και χρόνια μετά την εκδήλωση. Αν θέλετε να την κατεβάσετε, μπορείτε οποιαδήποτε στιγμή.',
    },
    {
      question: 'Με ποιον τρόπο μπορώ να πληρώσω;',
      answer: 'Δεχόμαστε όλες τις μεθόδους πληρωμής: Visa, Mastercard, American Express, PayPal, Google Pay, Apple Pay και τραπεζική κατάθεση. Όλες οι πληρωμές είναι 100% ασφαλείς με SSL encryption και PCI compliance.',
    },
    {
      question: 'Πότε πρέπει να πληρώσω;',
      answer: 'Μπορείτε να δημιουργήσετε και να δείτε preview ΔΩΡΕΑΝ! Πληρώνετε μόνο όταν είστε έτοιμοι να δημοσιεύσετε. Προσφέρουμε και 30-ημέρες εγγύηση επιστροφής χρημάτων - αν δεν είστε ικανοποιημένοι, παίρνετε τα χρήματά σας πίσω χωρίς ερωτήσεις.',
    },
    {
      question: 'Τι είναι το ψηφιακό album;',
      answer: 'Το ψηφιακό album είναι μια premium λειτουργία όπου μπορείτε να δημιουργήσετε photo gallery. Ανεβάστε φωτογραφίες πριν, κατά τη διάρκεια και μετά την εκδήλωση. Οι καλεσμένοι μπορούν επίσης να ανεβάσουν τις δικές τους φωτογραφίες! Όλες οι φωτογραφίες αποθηκεύονται σε υψηλή ανάλυση και μπορείτε να τις κατεβάσετε όλες με 1 κλικ.',
    },
    {
      question: 'Το προσκλητήριο έχει πολλά πεδία που δεν μου χρειάζονται. Μπορούν να απενεργοποιηθούν;',
      answer: 'Απόλυτα! Έχετε πλήρη έλεγχο - show/hide κάθε section ξεχωριστά. Δεν θέλετε countdown timer; Απενεργοποιήστε το. Δεν χρειάζεστε RSVP; Κλείστε το. Το προσκλητήριο είναι 100% customizable και θα δείχνει μόνο αυτό που θέλετε εσείς.',
    },
    {
      question: 'Μπορώ να επεξεργαστώ την πρόσκληση μετά τη δημοσίευση;',
      answer: 'Ναι! Μπορείτε να κάνετε αλλαγές ανά πάσα στιγμή - ακόμα και μετά τη δημοσίευση. Αλλάξτε φωτογραφίες, κείμενα, ώρες, τοποθεσίες. Όλες οι αλλαγές ενημερώνονται αυτόματα και live. Οι καλεσμένοι θα δουν πάντα την τελευταία έκδοση.',
    },
    {
      question: 'Υποστηρίζεται η ελληνική γλώσσα;',
      answer: 'Φυσικά! Το WediLink υποστηρίζει πλήρως τα Ελληνικά και τα Αγγλικά. Μπορείτε να δημιουργήσετε bilingual προσκλητήρια με language switcher για διεθνείς καλεσμένους. Όλες οι φόρμες, buttons και notifications είναι στα Ελληνικά.',
    },
    {
      question: 'Τι γίνεται αν έχω τεχνικό πρόβλημα;',
      answer: 'Η ομάδα support μας είναι διαθέσιμη 24/7! Επικοινωνήστε μέσω email (support@wedilink.com), live chat στην πλατφόρμα, ή τηλέφωνο. Μέσος χρόνος απόκρισης: κάτω από 2 ώρες. Για Premium πακέτο παρέχουμε dedicated account manager.',
    },
    {
      question: 'Μπορώ να χρησιμοποιήσω το δικό μου domain name;',
      answer: 'Ναι, στο Premium πακέτο μπορείτε να συνδέσετε custom domain (π.χ. maria-giorgos.wedding). Σας βοηθάμε με το setup και παρέχουμε SSL certificate δωρεάν. Το προσκλητήριό σας θα είναι στο δικό σας branded URL.',
    },
  ];

  const faqsEn = [
    {
      question: 'How much does creating a digital invitation cost?',
      answer: 'We offer three packages: Basic (€39), Plus (€69), and Premium (€119). Each package includes different features to meet your needs.',
    },
    {
      question: 'How is the invitation created?',
      answer: 'Simply sign up, choose a theme, fill in your information, upload photos, and your invitation is ready!',
    },
    {
      question: 'Can you create the invitation for me?',
      answer: 'Yes, we provide a full invitation creation service. Contact us for more information.',
    },
    {
      question: 'How can I send my invitation to guests?',
      answer: 'You can send it via email, WhatsApp, SMS, or share it on social media with a unique link.',
    },
    {
      question: 'How am I notified about guest attendance?',
      answer: 'Our system has an integrated RSVP feature where guests can confirm their attendance and you receive immediate notifications.',
    },
    {
      question: 'Can everyone see my invitation?',
      answer: 'No, you can password-protect your invitation (available in the Plus package).',
    },
    {
      question: 'How long will my invitation stay published?',
      answer: 'Your invitation remains active for 12 months from the publication date. You can renew it afterward if desired.',
    },
    {
      question: 'How can I pay?',
      answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), as well as PayPal and bank transfer payments.',
    },
    {
      question: 'When do I need to pay?',
      answer: 'Payment is made when creating the invitation, before publishing it. We also offer a free trial so you can see the result first.',
    },
    {
      question: 'What is the digital album?',
      answer: 'The digital album is a photo gallery where you can upload photos from your wedding and share them with your guests. Guests can also upload their own photos.',
    },
    {
      question: 'The invitation has many fields I don\'t need. Can they be disabled?',
      answer: 'Yes, you can fully customize your invitation and disable any fields you don\'t need. You have complete control over what is displayed.',
    },
  ];

  const faqs = isGreek ? faqsEl : faqsEn;

  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Συχνές Ερωτήσεις</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Συχνές Ερωτήσεις</h2>
          <p className="text-lg text-muted-foreground">
            Βρείτε απαντήσεις στις πιο συχνές ερωτήσεις μας
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white rounded-lg px-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <AccordionTrigger className="hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
