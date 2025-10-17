import { ReactNode } from "react";

export interface InvitationTheme {
  id: string;
  name: string;
  nameEl: string; // Greek name
  description: string;
  preview: string;
  category: 'wedding' | 'baptism' | 'party' | 'all';
  
  // Typography
  fonts: {
    heading: string;  // Tailwind font class
    body: string;     // Tailwind font class
    accent?: string;  // Optional accent/script font
  };
  
  // Colors (HSL format)
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
  };
  
  // Gradients
  gradients: {
    hero: string;
    section: string;
    overlay: string;
  };
  
  // Shadows
  shadows: {
    card: string;
    image: string;
    elegant: string;
  };
  
  // Layout & Spacing
  layout: {
    sectionSpacing: string;    // Tailwind spacing class
    cardRadius: string;         // Tailwind rounded class
    cardPadding: string;        // Tailwind padding class
  };
  
  // Animations
  animations?: {
    enabled: boolean;
    particleType: 'flowers' | 'stars' | 'hearts' | 'leaves' | 'butterflies' | 'sparkles';
    particleDensity: 'subtle' | 'medium' | 'dramatic';
    particleColor: string;
  };
}

export const invitationThemes: InvitationTheme[] = [
  // ROMANTIC ROSE GOLD - Default/Current
  {
    id: 'romantic',
    name: 'Romantic Rose Gold',
    nameEl: 'Ρομαντικό Ροζ Χρυσό',
    description: 'Soft blush tones with elegant rose gold accents',
    preview: '/themes/romantic-preview.jpg',
    category: 'all',
    fonts: {
      heading: 'font-serif',     // Playfair Display
      body: 'font-sans',         // Montserrat
      accent: 'font-script',     // Cormorant Garamond
    },
    colors: {
      background: '340 50% 98%',
      foreground: '345 35% 25%',
      primary: '15 65% 65%',
      primaryForeground: '340 50% 98%',
      secondary: '340 45% 75%',
      secondaryForeground: '345 35% 25%',
      accent: '25 75% 55%',
      accentForeground: '340 50% 98%',
      muted: '340 30% 96%',
      mutedForeground: '345 25% 45%',
      border: '340 25% 92%',
    },
    gradients: {
      hero: 'linear-gradient(135deg, hsl(340 45% 95%) 0%, hsl(15 65% 92%) 100%)',
      section: 'linear-gradient(180deg, hsl(340 50% 98%) 0%, hsl(340 45% 96%) 50%, hsl(15 65% 95%) 100%)',
      overlay: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)',
    },
    shadows: {
      card: '0 4px 8px -2px hsl(15 65% 65% / 0.12)',
      image: '0 12px 20px -4px hsl(15 65% 65% / 0.15)',
      elegant: '0 15px 50px -12px hsl(15 65% 65% / 0.25)',
    },
    layout: {
      sectionSpacing: 'space-y-16',
      cardRadius: 'rounded-xl',
      cardPadding: 'p-8',
    },
    animations: {
      enabled: true,
      particleType: 'flowers',
      particleDensity: 'medium',
      particleColor: '#f4a7b9',
    },
  },

  // CLASSIC ELEGANCE - Navy & Gold
  {
    id: 'classic',
    name: 'Classic Elegance',
    nameEl: 'Κλασική Κομψότητα',
    description: 'Timeless navy blue with luxurious gold details',
    preview: '/themes/classic-preview.jpg',
    category: 'all',
    fonts: {
      heading: 'font-classic',    // Libre Baskerville
      body: 'font-sans',          // Montserrat
      accent: 'font-elegant',     // Cinzel
    },
    colors: {
      background: '220 40% 98%',
      foreground: '220 60% 15%',
      primary: '220 60% 35%',
      primaryForeground: '220 40% 98%',
      secondary: '45 85% 55%',
      secondaryForeground: '220 60% 15%',
      accent: '45 90% 65%',
      accentForeground: '220 60% 15%',
      muted: '220 30% 92%',
      mutedForeground: '220 40% 40%',
      border: '220 25% 85%',
    },
    gradients: {
      hero: 'linear-gradient(135deg, hsl(220 60% 35%) 0%, hsl(220 50% 25%) 100%)',
      section: 'linear-gradient(180deg, hsl(220 40% 98%) 0%, hsl(220 35% 95%) 100%)',
      overlay: 'linear-gradient(to bottom, rgba(30,41,59,0.7), transparent)',
    },
    shadows: {
      card: '0 4px 8px -2px hsl(220 60% 35% / 0.15)',
      image: '0 12px 20px -4px hsl(220 60% 35% / 0.2)',
      elegant: '0 15px 50px -12px hsl(45 85% 55% / 0.3)',
    },
    layout: {
      sectionSpacing: 'space-y-20',
      cardRadius: 'rounded-lg',
      cardPadding: 'p-10',
    },
    animations: {
      enabled: true,
      particleType: 'stars',
      particleDensity: 'subtle',
      particleColor: '#d4af37',
    },
  },

  // MODERN MINIMALIST - Black & White
  {
    id: 'modern',
    name: 'Modern Minimalist',
    nameEl: 'Μοντέρνο Μινιμαλιστικό',
    description: 'Clean lines with sophisticated monochrome palette',
    preview: '/themes/modern-preview.jpg',
    category: 'all',
    fonts: {
      heading: 'font-elegant',    // Cinzel
      body: 'font-modern',        // Raleway
      accent: 'font-modern',      // Raleway
    },
    colors: {
      background: '0 0% 100%',
      foreground: '0 0% 10%',
      primary: '0 0% 10%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 95%',
      secondaryForeground: '0 0% 10%',
      accent: '0 0% 30%',
      accentForeground: '0 0% 100%',
      muted: '0 0% 97%',
      mutedForeground: '0 0% 40%',
      border: '0 0% 90%',
    },
    gradients: {
      hero: 'linear-gradient(135deg, hsl(0 0% 95%) 0%, hsl(0 0% 100%) 100%)',
      section: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 98%) 100%)',
      overlay: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
    },
    shadows: {
      card: '0 4px 8px -2px hsl(0 0% 0% / 0.08)',
      image: '0 12px 20px -4px hsl(0 0% 0% / 0.12)',
      elegant: '0 15px 50px -12px hsl(0 0% 0% / 0.15)',
    },
    layout: {
      sectionSpacing: 'space-y-24',
      cardRadius: 'rounded-none',
      cardPadding: 'p-12',
    },
    animations: {
      enabled: true,
      particleType: 'sparkles',
      particleDensity: 'subtle',
      particleColor: '#333333',
    },
  },

  // GARDEN ROMANCE - Green & Ivory
  {
    id: 'garden',
    name: 'Garden Romance',
    nameEl: 'Ρομαντικός Κήπος',
    description: 'Fresh botanical greens with soft ivory tones',
    preview: '/themes/garden-preview.jpg',
    category: 'all',
    fonts: {
      heading: 'font-serif',     // Playfair Display
      body: 'font-sans',         // Montserrat
      accent: 'font-cursive',    // Great Vibes
    },
    colors: {
      background: '45 35% 97%',
      foreground: '145 40% 20%',
      primary: '145 30% 45%',
      primaryForeground: '45 35% 97%',
      secondary: '85 40% 85%',
      secondaryForeground: '145 40% 20%',
      accent: '45 60% 65%',
      accentForeground: '145 40% 20%',
      muted: '85 25% 92%',
      mutedForeground: '145 25% 35%',
      border: '85 20% 88%',
    },
    gradients: {
      hero: 'linear-gradient(135deg, hsl(145 30% 55%) 0%, hsl(85 40% 65%) 100%)',
      section: 'linear-gradient(180deg, hsl(45 35% 97%) 0%, hsl(85 25% 92%) 100%)',
      overlay: 'linear-gradient(to bottom, rgba(30,70,50,0.4), transparent)',
    },
    shadows: {
      card: '0 4px 8px -2px hsl(145 30% 45% / 0.12)',
      image: '0 12px 20px -4px hsl(145 30% 45% / 0.18)',
      elegant: '0 15px 50px -12px hsl(145 30% 45% / 0.22)',
    },
    layout: {
      sectionSpacing: 'space-y-16',
      cardRadius: 'rounded-2xl',
      cardPadding: 'p-8',
    },
    animations: {
      enabled: true,
      particleType: 'leaves',
      particleDensity: 'medium',
      particleColor: '#8fbc8f',
    },
  },

  // VINTAGE CHIC - Sepia & Cream
  {
    id: 'vintage',
    name: 'Vintage Chic',
    nameEl: 'Vintage Κομψότητα',
    description: 'Nostalgic sepia tones with vintage charm',
    preview: '/themes/vintage-preview.jpg',
    category: 'all',
    fonts: {
      heading: 'font-classic',    // Libre Baskerville
      body: 'font-serif',         // Playfair Display (lighter weight)
      accent: 'font-dancing',     // Dancing Script
    },
    colors: {
      background: '35 30% 96%',
      foreground: '25 25% 25%',
      primary: '25 35% 50%',
      primaryForeground: '35 30% 96%',
      secondary: '340 30% 75%',
      secondaryForeground: '25 25% 25%',
      accent: '35 45% 60%',
      accentForeground: '25 25% 25%',
      muted: '35 20% 90%',
      mutedForeground: '25 20% 40%',
      border: '35 15% 85%',
    },
    gradients: {
      hero: 'linear-gradient(135deg, hsl(35 35% 85%) 0%, hsl(25 40% 75%) 100%)',
      section: 'linear-gradient(180deg, hsl(35 30% 96%) 0%, hsl(35 25% 92%) 100%)',
      overlay: 'linear-gradient(to bottom, rgba(80,60,40,0.4), transparent)',
    },
    shadows: {
      card: '0 4px 8px -2px hsl(25 35% 50% / 0.15)',
      image: '0 12px 20px -4px hsl(25 35% 50% / 0.2)',
      elegant: '0 15px 50px -12px hsl(25 35% 50% / 0.25)',
    },
    layout: {
      sectionSpacing: 'space-y-16',
      cardRadius: 'rounded-xl',
      cardPadding: 'p-8',
    },
    animations: {
      enabled: true,
      particleType: 'butterflies',
      particleDensity: 'subtle',
      particleColor: '#dda0dd',
    },
  },

  // LUXE GOLD - Black & Gold
  {
    id: 'luxe',
    name: 'Luxe Gold',
    nameEl: 'Πολυτελές Χρυσό',
    description: 'Dramatic black with opulent gold accents',
    preview: '/themes/luxe-preview.jpg',
    category: 'all',
    fonts: {
      heading: 'font-elegant',    // Cinzel
      body: 'font-modern',        // Raleway
      accent: 'font-cursive',     // Great Vibes
    },
    colors: {
      background: '0 0% 98%',
      foreground: '0 0% 8%',
      primary: '0 0% 8%',
      primaryForeground: '45 100% 95%',
      secondary: '45 90% 55%',
      secondaryForeground: '0 0% 8%',
      accent: '45 95% 65%',
      accentForeground: '0 0% 8%',
      muted: '0 0% 92%',
      mutedForeground: '0 0% 35%',
      border: '0 0% 88%',
    },
    gradients: {
      hero: 'linear-gradient(135deg, hsl(0 0% 8%) 0%, hsl(0 0% 15%) 100%)',
      section: 'linear-gradient(180deg, hsl(0 0% 98%) 0%, hsl(0 0% 95%) 100%)',
      overlay: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
    },
    shadows: {
      card: '0 4px 8px -2px hsl(45 90% 55% / 0.2)',
      image: '0 12px 20px -4px hsl(45 90% 55% / 0.25)',
      elegant: '0 15px 50px -12px hsl(45 90% 55% / 0.35)',
    },
    layout: {
      sectionSpacing: 'space-y-20',
      cardRadius: 'rounded-lg',
      cardPadding: 'p-10',
    },
    animations: {
      enabled: true,
      particleType: 'stars',
      particleDensity: 'medium',
      particleColor: '#ffd700',
    },
  },

  // BURGUNDY GOLD - Wedding Premium
  {
    id: 'burgundy_gold',
    name: 'Burgundy & Gold',
    nameEl: 'Μπορντό & Χρυσό',
    description: 'Rich burgundy wine with luxurious gold accents',
    preview: '/themes/burgundy-preview.jpg',
    category: 'wedding',
    fonts: {
      heading: 'font-elegant',
      body: 'font-serif',
      accent: 'font-cursive',
    },
    colors: {
      background: '0 25% 98%',
      foreground: '345 70% 15%',
      primary: '345 65% 40%',
      primaryForeground: '0 25% 98%',
      secondary: '45 90% 55%',
      secondaryForeground: '345 70% 15%',
      accent: '345 55% 55%',
      accentForeground: '0 25% 98%',
      muted: '345 20% 92%',
      mutedForeground: '345 40% 35%',
      border: '345 15% 88%',
    },
    gradients: {
      hero: 'linear-gradient(135deg, hsl(345 65% 40%) 0%, hsl(345 60% 30%) 100%)',
      section: 'linear-gradient(180deg, hsl(0 25% 98%) 0%, hsl(345 20% 95%) 100%)',
      overlay: 'linear-gradient(to bottom, rgba(114,28,36,0.7), transparent)',
    },
    shadows: {
      card: '0 4px 8px -2px hsl(345 65% 40% / 0.2)',
      image: '0 12px 20px -4px hsl(345 65% 40% / 0.25)',
      elegant: '0 15px 50px -12px hsl(45 90% 55% / 0.35)',
    },
    layout: {
      sectionSpacing: 'space-y-20',
      cardRadius: 'rounded-xl',
      cardPadding: 'p-10',
    },
    animations: {
      enabled: true,
      particleType: 'flowers',
      particleDensity: 'medium',
      particleColor: '#8B2635',
    },
  },

  // SAFARI ADVENTURE - Baptism Premium
  {
    id: 'safari_adventure',
    name: 'Safari Adventure',
    nameEl: 'Σαφάρι Περιπέτεια',
    description: 'Wild safari animals with warm earthy tones',
    preview: '/themes/safari-preview.jpg',
    category: 'baptism',
    fonts: {
      heading: 'font-sans',
      body: 'font-sans',
      accent: 'font-sans',
    },
    colors: {
      background: '40 45% 98%',
      foreground: '30 50% 20%',
      primary: '30 65% 45%',
      primaryForeground: '40 45% 98%',
      secondary: '85 40% 55%',
      secondaryForeground: '30 50% 20%',
      accent: '35 70% 60%',
      accentForeground: '30 50% 20%',
      muted: '40 30% 92%',
      mutedForeground: '30 35% 35%',
      border: '40 25% 88%',
    },
    gradients: {
      hero: 'linear-gradient(135deg, hsl(30 65% 65%) 0%, hsl(85 50% 70%) 100%)',
      section: 'linear-gradient(180deg, hsl(40 45% 98%) 0%, hsl(40 35% 95%) 100%)',
      overlay: 'linear-gradient(to bottom, rgba(139,90,43,0.5), transparent)',
    },
    shadows: {
      card: '0 4px 8px -2px hsl(30 65% 45% / 0.15)',
      image: '0 12px 20px -4px hsl(30 65% 45% / 0.2)',
      elegant: '0 15px 50px -12px hsl(30 65% 45% / 0.25)',
    },
    layout: {
      sectionSpacing: 'space-y-16',
      cardRadius: 'rounded-2xl',
      cardPadding: 'p-8',
    },
    animations: {
      enabled: true,
      particleType: 'leaves',
      particleDensity: 'subtle',
      particleColor: '#8B5A2B',
    },
  },

  // NEON NIGHT - Party Premium
  {
    id: 'neon_night',
    name: 'Neon Night',
    nameEl: 'Νέον Βραδιά',
    description: 'Electric neon lights with cyberpunk vibes',
    preview: '/themes/neon-preview.jpg',
    category: 'party',
    fonts: {
      heading: 'font-sans',
      body: 'font-modern',
      accent: 'font-sans',
    },
    colors: {
      background: '240 15% 10%',
      foreground: '0 0% 98%',
      primary: '280 100% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '330 100% 50%',
      secondaryForeground: '0 0% 100%',
      accent: '180 100% 50%',
      accentForeground: '240 15% 10%',
      muted: '240 10% 20%',
      mutedForeground: '0 0% 70%',
      border: '240 10% 30%',
    },
    gradients: {
      hero: 'linear-gradient(135deg, hsl(280 100% 60%) 0%, hsl(330 100% 50%) 50%, hsl(180 100% 50%) 100%)',
      section: 'linear-gradient(180deg, hsl(240 15% 10%) 0%, hsl(240 12% 15%) 100%)',
      overlay: 'linear-gradient(to bottom, rgba(139,92,246,0.6), transparent)',
    },
    shadows: {
      card: '0 4px 20px -2px hsl(280 100% 60% / 0.4)',
      image: '0 12px 30px -4px hsl(330 100% 50% / 0.5)',
      elegant: '0 15px 60px -12px hsl(180 100% 50% / 0.6)',
    },
    layout: {
      sectionSpacing: 'space-y-16',
      cardRadius: 'rounded-xl',
      cardPadding: 'p-8',
    },
    animations: {
      enabled: true,
      particleType: 'sparkles',
      particleDensity: 'dramatic',
      particleColor: '#EC4899',
    },
  },

  // LIEBE ROMANTIC - European Elegance
  {
    id: 'liebe_romantic',
    name: 'Liebe Romantic',
    nameEl: 'Λίμπε Ρομαντικό',
    description: 'European elegance with soft lavender and pink tones',
    preview: '/themes/liebe-preview.jpg',
    category: 'wedding',
    fonts: {
      heading: 'font-serif',     // Playfair Display
      body: 'font-sans',         // Montserrat
      accent: 'font-elegant',    // Cinzel
    },
    colors: {
      background: '300 40% 98%',
      foreground: '300 30% 20%',
      primary: '280 60% 60%',
      primaryForeground: '300 40% 98%',
      secondary: '320 50% 75%',
      secondaryForeground: '300 30% 20%',
      accent: '280 55% 55%',
      accentForeground: '300 40% 98%',
      muted: '300 25% 95%',
      mutedForeground: '300 20% 40%',
      border: '300 20% 90%',
    },
    gradients: {
      hero: 'linear-gradient(135deg, hsl(320 50% 95%) 0%, hsl(280 60% 92%) 100%)',
      section: 'linear-gradient(180deg, hsl(300 40% 98%) 0%, hsl(320 45% 96%) 50%, hsl(280 50% 95%) 100%)',
      overlay: 'linear-gradient(to bottom, rgba(147,51,234,0.3), transparent)',
    },
    shadows: {
      card: '0 4px 8px -2px hsl(280 60% 60% / 0.15)',
      image: '0 12px 20px -4px hsl(280 60% 60% / 0.2)',
      elegant: '0 15px 50px -12px hsl(320 50% 75% / 0.25)',
    },
    layout: {
      sectionSpacing: 'space-y-20',
      cardRadius: 'rounded-3xl',
      cardPadding: 'p-10',
    },
    animations: {
      enabled: true,
      particleType: 'hearts',
      particleDensity: 'medium',
      particleColor: '#D8B4FE',
    },
  },
];

export const getThemeById = (id: string): InvitationTheme | undefined => {
  return invitationThemes.find(theme => theme.id === id);
};

export const getThemesByCategory = (category: 'wedding' | 'baptism' | 'party' | 'all'): InvitationTheme[] => {
  if (category === 'all') return invitationThemes;
  return invitationThemes.filter(theme => theme.category === category || theme.category === 'all');
};
