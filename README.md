# Προσκλητήρια - Πλατφόρμα Δημιουργίας Προσκλήσεων

Ένα σύγχρονο, πλήρως λειτουργικό admin dashboard για τη δημιουργία επαγγελματικών ψηφιακών προσκλητηρίων για Γάμους, Βαπτίσεις και Πάρτι. Κάθε πρόσκληση εκδίδει δημόσια σελίδα με μοναδικό URL που μπορεί να μοιραστεί με τους καλεσμένους.

## 🚀 Χαρακτηριστικά

### Admin Dashboard
- **Πλήρης διαχείριση προσκλήσεων**: Δημιουργία, επεξεργασία, διαγραφή και προεπισκόπηση
- **3 τύποι προσκλήσεων**: Γάμος, Βάπτιση, Party με ξεχωριστά templates
- **Rich Text Editor**: WYSIWYG επεξεργαστής κειμένου για το περιεχόμενο
- **Διαχείριση Gallery**: Upload και drag & drop φωτογραφιών
- **Ενσωματωμένοι Χάρτες**: Προσθήκη τοποθεσιών με OpenStreetMap
- **Repeatable Fields**: Προσθήκη κουμπάρων, οικογενειών, αριθμών κατάθεσης
- **Προεπισκόπηση σε πραγματικό χρόνο**: Δείτε πώς θα φαίνεται η πρόσκληση πριν τη δημοσιεύσετε

### Δημόσιες Σελίδες Προσκλήσεων

#### 🤵👰 Γάμος (Romantic/Classic Template)
- Hero section με cover image
- Στοιχεία ζευγαριού με φωτογραφίες
- Κουμπάροι
- Χάρτες για εκκλησία & δεξίωση
- Οικογένειες (γαμπρού & νύφης)
- Gallery φωτογραφιών με lightbox
- Αριθμοί κατάθεσης
- RSVP φόρμα

#### 👶✨ Βάπτιση (Bright/Playful Template)
- Παστέλ χρώματα
- Στοιχεία παιδιού
- Ανάδοχοι
- Χάρτες τοποθεσιών
- Οικογένεια γονέων
- Gallery & RSVP

#### 🎉🎊 Party (Modern/Nightlife Template)
- Σκούρο theme με neon accents
- Οργανωτές
- Λεπτομέρειες εκδήλωσης
- Χάρτης τοποθεσίας
- Gallery & RSVP

### Κοινά Χαρακτηριστικά Δημόσιων Σελίδων
- **Responsive Design**: Άψογη εμφάνιση σε mobile, tablet, desktop
- **Animations**: Flowers (γάμος), Bubbles (βάπτιση), Confetti (party)
- **Music Player**: Ενσωματωμένο YouTube player
- **Add to Calendar**: Download .ics αρχείο
- **Χάρτες με tabs**: Χάρτης / Δορυφόρος view
- **Sticky Mobile Bar**: Call, Maps, Share buttons
- **OpenGraph meta tags**: Όμορφο preview σε social media

## 🛠️ Τεχνολογίες

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS με custom design system
- **UI Components**: shadcn/ui, Radix UI
- **Rich Text**: React Quill
- **Maps**: React Leaflet, OpenStreetMap
- **Backend**: Supabase (Database, Auth, Storage)
- **Routing**: React Router v6
- **Forms**: React Hook Form με Zod validation
- **Animations**: Tailwind CSS animations
- **Icons**: Lucide React

## 📦 Εγκατάσταση

```bash
# Clone το repository
git clone <repository-url>

# Μετάβαση στον φάκελο
cd prosklhthria

# Εγκατάσταση dependencies
npm install

# Εκκίνηση development server
npm run dev
```

## 🚀 Scripts

```bash
# Development server (http://localhost:8080)
npm run dev

# Build για production
npm run build

# Preview του production build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📁 Δομή Project

```
prosklhthria/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components (Sidebar)
│   │   ├── wedding/         # Shared components (PublishPanel, ImagePicker, etc.)
│   │   ├── baptism/         # Baptism-specific components
│   │   └── party/           # Party-specific components
│   ├── pages/
│   │   ├── AddWedding.tsx   # Δημιουργία γάμου
│   │   ├── AddBaptism.tsx   # Δημιουργία βάπτισης
│   │   ├── AddParty.tsx     # Δημιουργία party
│   │   ├── AllWeddings.tsx  # Λίστα γάμων
│   │   ├── AllBaptisms.tsx  # Λίστα βαπτίσεων
│   │   ├── AllParties.tsx   # Λίστα parties
│   │   ├── Dashboard.tsx    # Αρχική σελίδα
│   │   └── public/          # Δημόσιες σελίδες προσκλήσεων
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities & storage
│   ├── integrations/        # Supabase integration
│   ├── assets/              # Dummy images & assets
│   └── index.css           # Global styles & design system
├── supabase/
│   ├── config.toml         # Supabase configuration
│   └── functions/          # Edge functions (RSVP emails)
└── public/
    └── leaflet.css         # Leaflet styles
```

## 🎨 Design System

Το project χρησιμοποιεί ένα πλήρως παραμετροποιήσιμο design system με:

- **Χρώματα**: Primary (ροζ #E91E63), Secondary (μπλε #5B7C99), Accent (πορτοκαλί #FF9E40)
- **Γραμματοσειρές**: 
  - **Serif** (Playfair Display): Για τίτλους, ονόματα και headlines
  - **Sans** (Inter): Για σώμα κειμένου και UI
- **Spacing & Radius**: Ομοιόμορφα με CSS custom properties
- **Dark Mode Support**: Πλήρης υποστήριξη

Όλα τα χρώματα και styles ορίζονται στο `src/index.css` και `tailwind.config.ts`.

### Παράδειγμα χρήσης:
```tsx
// Serif font για τίτλους
<h1 className="font-serif text-5xl">Ο Γάμος μας</h1>

// Sans font για κείμενο
<p className="font-sans text-base">Σας προσκαλούμε...</p>
```

## 🗄️ Database Schema

### Πίνακας: `invitations`
- `id` (UUID): Μοναδικό ID πρόσκλησης
- `user_id` (UUID): ID χρήστη που δημιούργησε την πρόσκληση
- `type` (text): 'wedding' | 'baptism' | 'party'
- `title` (text): Τίτλος πρόσκλησης
- `status` (text): 'draft' | 'published'
- `data` (jsonb): Όλα τα δεδομένα της πρόσκλησης
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `published_at` (timestamp)

### Πίνακας: `rsvps`
- `id` (UUID)
- `invitation_id` (UUID): Foreign key → invitations
- `name` (text): Όνομα καλεσμένου
- `email` (text): Email καλεσμένου
- `phone` (text): Τηλέφωνο
- `will_attend` (text): 'yes' | 'no' | 'maybe'
- `number_of_guests` (integer)
- `dietary_restrictions` (text)
- `message` (text)
- `created_at` (timestamp)

### Storage Buckets
- `invitations`: Για κύριες φωτογραφίες
- `gallery`: Για gallery φωτογραφίες
- `profiles`: Για profile φωτογραφίες χρηστών

## 🔐 Ασφάλεια (RLS Policies)

Όλοι οι πίνακες έχουν Row Level Security (RLS) policies:

### Invitations
- Χρήστες μπορούν να δουν μόνο τις δικές τους προσκλήσεις
- Χρήστες μπορούν να δημιουργήσουν/επεξεργαστούν/διαγράψουν μόνο τις δικές τους
- Δημοσιευμένες προσκλήσεις είναι ορατές σε όλους (public pages)

### RSVPs
- Όλοι μπορούν να δημιουργήσουν RSVP
- Μόνο ο δημιουργός της πρόσκλησης μπορεί να δει τα RSVPs της

## 📝 Πώς να προσθέσω νέο template

1. **Δημιουργήστε νέο interface** στο `src/pages/AddNewType.tsx`:
```typescript
interface NewTypeData {
  title: string;
  mainImage: string;
  // ... άλλα πεδία
}
```

2. **Δημιουργήστε το form component** με όλα τα πεδία

3. **Δημιουργήστε το public template** στο `src/pages/public/NewTypeInvitation.tsx`

4. **Προσθέστε routes** στο `src/App.tsx`:
```typescript
<Route path="/newtype/add" element={<AddNewType />} />
<Route path="/newtype/all" element={<AllNewTypes />} />
```

5. **Προσθέστε στο sidebar** στο `src/components/layout/AppSidebar.tsx`

## 🎯 Πώς να αλλάξω το Storage Backend

Το storage layer είναι αφαιρημένο στο `src/lib/invitationStorage.ts`. Μπορείτε να αντικαταστήσετε τις Supabase κλήσεις με:

- Local Storage (για testing)
- REST API (custom backend)
- Firebase
- MongoDB

Απλά implement τις ίδιες functions:
- `publishInvitation(id, data, type, title)`
- `getInvitation(id)`
- `getInvitationsIndex()`
- `deleteInvitation(id)`

## ✅ QA Checklist

### Λειτουργικότητα
- ✅ Δημιουργία πρόσκλησης για κάθε τύπο
- ✅ Αποθήκευση προσχεδίου
- ✅ Επεξεργασία υπάρχουσας πρόσκλησης
- ✅ Διαγραφή πρόσκλησης
- ✅ Προεπισκόπηση πρόσκλησης
- ✅ Δημοσίευση πρόσκλησης
- ✅ Κοινοποίηση link (Copy, QR, WhatsApp)
- ✅ Upload εικόνων
- ✅ Drag & drop reorder στο gallery
- ✅ Χάρτες με search
- ✅ RSVP submission
- ✅ Email notifications

### Validation
- ✅ Required fields validation
- ✅ IBAN format validation
- ✅ Email format validation
- ✅ Phone format validation
- ✅ Image file type/size validation

### Responsive Design
- ✅ Mobile (375px)
- ✅ Tablet (768px)
- ✅ Desktop (1440px+)
- ✅ Sticky mobile bar
- ✅ Collapsible sidebar

### Accessibility (a11y)
- ✅ Alt text σε όλες τις εικόνες
- ✅ Keyboard navigation
- ✅ Focus states
- ✅ WCAG AA contrast
- ✅ Aria labels σε icons

### Performance
- ✅ Image lazy loading
- ✅ Code splitting
- ✅ Responsive images (srcset)
- ✅ Fast initial load
- ✅ Smooth animations

### SEO/SMO
- ✅ Title tags
- ✅ Meta descriptions
- ✅ OpenGraph tags
- ✅ Twitter cards
- ✅ Canonical URLs

## 🐛 Troubleshooting

### Πρόβλημα: Οι εικόνες δεν φορτώνουν
**Λύση**: 
- Ελέγξτε τα RLS policies στο storage
- Βεβαιωθείτε ότι τα buckets είναι public
- Ελέγξτε το console για CORS errors

### Πρόβλημα: Η πρόσκληση δεν βρέθηκε (404)
**Λύση**: 
- Ελέγξτε ότι το ID είναι σωστό
- Βεβαιωθείτε ότι η πρόσκληση είναι published (όχι draft)
- Ελέγξτε το URL format: `/prosklisi/{id}` (σωστό) όχι `/proskisi/{id}`

### Πρόβλημα: Authentication errors
**Λύση**: 
- Ελέγξτε τα Supabase credentials στο `.env`
- Βεβαιωθείτε ότι ο χρήστης είναι logged in
- Ελέγξτε τα RLS policies στη βάση δεδομένων

### Πρόβλημα: RSVP emails δεν στέλνονται
**Λύση**: 
- Ελέγξτε το RESEND_API_KEY στα Supabase secrets
- Ελέγξτε τα logs στο Supabase Edge Functions
- Βεβαιωθείτε ότι το domain είναι verified στο Resend

## 🎓 Οδηγός Χρήσης

### Δημιουργία Πρόσκλησης Γάμου

1. **Login**: Συνδεθείτε με το λογαριασμό σας
2. **Πλοήγηση**: Από το sidebar επιλέξτε "Γάμος" → "Προσθήκη Πρόσκλησης"
3. **Βασικά Στοιχεία**: 
   - Προσθέστε τίτλο (π.χ. "Ο Γάμος μας")
   - Upload κύρια φωτογραφία
   - Γράψτε το κείμενο της πρόσκλησης
4. **Ζευγάρι**: 
   - Εισάγετε ονόματα γαμπρού & νύφης
   - Προσθέστε φωτογραφίες
5. **Κουμπάροι**: Προσθέστε ονόματα και φωτογραφίες
6. **Ημερομηνία & Ώρα**: Επιλέξτε την ημερομηνία και ώρα του γάμου
7. **Τοποθεσίες**: 
   - Προσθέστε εκκλησία (υποχρεωτικό)
   - Προσθέστε δεξίωση (προαιρετικό)
   - Χρησιμοποιήστε το search για να βρείτε τοποθεσίες
8. **Αριθμοί Κατάθεσης**: Προσθέστε τραπεζικούς λογαριασμούς (IBAN)
9. **Οικογένειες**: Προσθέστε μέλη οικογενειών
10. **Gallery**: Upload φωτογραφίες (drag & drop για reorder)
11. **Προεπισκόπηση**: Κάντε κλικ στο "Προεπισκόπηση" για να δείτε πώς φαίνεται
12. **Δημοσίευση**: Κάντε κλικ στο "Δημοσίευση"
13. **Κοινοποίηση**: Αντιγράψτε το link ή μοιραστείτε via WhatsApp/QR code

### Διαχείριση RSVPs

1. Από το sidebar επιλέξτε "Γάμος" → "Όλες οι Προσκλήσεις"
2. Κάντε κλικ στο "RSVP (X)" δίπλα στην πρόσκληση
3. Δείτε όλες τις απαντήσεις
4. Εξάγετε σε CSV/Excel
5. Φιλτράρετε ανά κατάσταση (Θα έρθει / Δεν θα έρθει / Ίσως)

## 📧 Email Notifications

Το σύστημα στέλνει αυτόματα email στους καλεσμένους όταν:
- Υποβάλλουν RSVP
- Επιβεβαιώνουν την παρουσία τους

Τα emails χρησιμοποιούν το Resend API και περιλαμβάνουν:
- Επιβεβαίωση RSVP
- Λεπτομέρειες εκδήλωσης
- Link προς την πρόσκληση

## 🌐 SEO Best Practices

Κάθε δημόσια σελίδα πρόσκλησης περιλαμβάνει:

```html
<!-- Dynamic Title -->
<title>Γάμος: Γιάννης & Μαρία - 15 Ιουνίου 2025</title>

<!-- Meta Description -->
<meta name="description" content="Σας προσκαλούμε στο γάμο μας...">

<!-- OpenGraph Tags -->
<meta property="og:title" content="Ο Γάμος μας">
<meta property="og:description" content="...">
<meta property="og:image" content="[κύρια φωτογραφία]">
<meta property="og:url" content="https://domain.com/prosklisi/abc123">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
```

## 📱 Mobile Optimization

- Responsive design για όλες τις οθόνες (375px - 2560px)
- Sticky bottom bar σε mobile με quick actions
- Touch-friendly buttons (min 44x44px)
- Optimized images με lazy loading
- Fast loading times (<3s σε 3G)

## 🎨 Customization Guide

### Αλλαγή Χρωμάτων

Επεξεργαστείτε το `src/index.css`:

```css
:root {
  /* Primary color (κύριο χρώμα - ροζ) */
  --primary: 340 82% 52%;
  
  /* Secondary color (δευτερεύον - μπλε) */
  --secondary: 217 33% 55%;
  
  /* Accent color (έμφαση - πορτοκαλί) */
  --accent: 27 96% 61%;
}
```

### Αλλαγή Γραμματοσειρών

1. Προσθέστε τη γραμματοσειρά στο `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap" rel="stylesheet">
```

2. Ενημερώστε το `tailwind.config.ts`:
```typescript
fontFamily: {
  serif: ['YourSerifFont', 'serif'],
  sans: ['YourSansFont', 'sans-serif'],
}
```

## 📄 License

MIT License - Ελεύθερο για χρήση σε προσωπικά και εμπορικά projects.

## 🤝 Contributing

Pull requests are welcome! Για μεγάλες αλλαγές, παρακαλώ ανοίξτε πρώτα ένα issue για συζήτηση.

## 📧 Support

Για support και ερωτήσεις, παρακαλώ επικοινωνήστε στο [support email].

---

**Δημιουργήθηκε με ❤️ για να κάνει τη δημιουργία προσκλητηρίων εύκολη και όμορφη.**

### Lovable Project URL
https://lovable.dev/projects/964cea84-658d-43ea-93f4-2e574446c91b
