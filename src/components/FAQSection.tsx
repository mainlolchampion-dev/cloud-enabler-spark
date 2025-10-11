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
      answer: 'Προσφέρουμε τρία πακέτα: Basic (€39), Plus (€69) και Premium (€119). Κάθε πακέτο περιλαμβάνει διαφορετικά χαρακτηριστικά για να καλύψει τις ανάγκες σας.',
    },
    {
      question: 'Πως γίνεται η δημιουργία του προσκλητηρίου;',
      answer: 'Απλά εγγραφείτε, επιλέξτε ένα θέμα, συμπληρώστε τις πληροφορίες σας, ανεβάστε φωτογραφίες και το προσκλητήριό σας είναι έτοιμο!',
    },
    {
      question: 'Μπορείτε να αναλάβετε εσείς την δημιουργία της πρόσκλησης μου;',
      answer: 'Ναι, παρέχουμε υπηρεσία πλήρους δημιουργίας προσκλητηρίου. Επικοινωνήστε μαζί μας για περισσότερες πληροφορίες.',
    },
    {
      question: 'Πως μπορώ να αποστείλω την πρόσκληση μου στους καλεσμένους;',
      answer: 'Μπορείτε να την αποστείλετε μέσω email, WhatsApp, SMS ή να την μοιραστείτε μέσω social media με ένα μοναδικό link.',
    },
    {
      question: 'Πως ενημερώνομαι για την παρουσία των καλεσμένων μου;',
      answer: 'Το σύστημά μας διαθέτει ενσωματωμένη λειτουργία RSVP όπου οι καλεσμένοι μπορούν να επιβεβαιώσουν την παρουσία τους και εσείς λαμβάνετε άμεσες ειδοποιήσεις.',
    },
    {
      question: 'Την πρόσκληση μου μπορούν να την δουν όλοι;',
      answer: 'Όχι, μπορείτε να προστατεύσετε την πρόσκλησή σας με κωδικό (διαθέσιμο στο Plus πακέτο).',
    },
    {
      question: 'Για πόσο καιρό θα μείνει δημοσιευμένη η πρόσκληση μου;',
      answer: 'Η πρόσκλησή σας παραμένει ενεργή για 12 μήνες από την ημερομηνία δημοσίευσης. Μετά μπορείτε να την ανανεώσετε αν το επιθυμείτε.',
    },
    {
      question: 'Με ποιον τρόπο μπορώ να πληρώσω;',
      answer: 'Δεχόμαστε όλες τις κύριες πιστωτικές και χρεωστικές κάρτες (Visa, Mastercard, American Express), καθώς και πληρωμές μέσω PayPal και τραπεζικής κατάθεσης.',
    },
    {
      question: 'Πότε πρέπει να πληρώσω;',
      answer: 'Η πληρωμή γίνεται κατά τη δημιουργία του προσκλητηρίου, πριν από τη δημοσίευσή του. Προσφέρουμε επίσης δωρεάν δοκιμή για να δείτε πρώτα το αποτέλεσμα.',
    },
    {
      question: 'Τι είναι το ψηφιακό album;',
      answer: 'Το ψηφιακό album είναι μια γκαλερί φωτογραφιών όπου μπορείτε να ανεβάσετε φωτογραφίες από τον γάμο σας και να τις μοιραστείτε με τους καλεσμένους σας. Οι καλεσμένοι μπορούν επίσης να ανεβάσουν τις δικές τους φωτογραφίες.',
    },
    {
      question: 'Το προσκλητήριο έχει πολλά πεδία που δεν μου χρειάζονται. Μπορούν να απενεργοποιηθούν;',
      answer: 'Ναι, μπορείτε να προσαρμόσετε πλήρως το προσκλητήριό σας και να απενεργοποιήσετε οποιαδήποτε πεδία δεν χρειάζεστε. Έχετε πλήρη έλεγχο στο τι θα εμφανίζεται.',
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
              className="bg-background rounded-lg px-6"
            >
              <AccordionTrigger className="hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
