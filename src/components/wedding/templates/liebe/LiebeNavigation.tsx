import { Heart } from "lucide-react";

export function LiebeNavigation() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
          <span className="font-cursive text-4xl text-gray-800">Liebe</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('home')}
            className="text-gray-700 hover:text-pink-500 transition-colors font-serif text-sm"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('couple')}
            className="text-gray-700 hover:text-pink-500 transition-colors font-serif text-sm"
          >
            The Couple
          </button>
          <button
            onClick={() => scrollToSection('story')}
            className="text-gray-700 hover:text-pink-500 transition-colors font-serif text-sm"
          >
            Our Story
          </button>
          <button
            onClick={() => scrollToSection('event')}
            className="text-gray-700 hover:text-pink-500 transition-colors font-serif text-sm"
          >
            The Event
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="text-gray-700 hover:text-pink-500 transition-colors font-serif text-sm"
          >
            Gallery
          </button>
          <button
            onClick={() => scrollToSection('rsvp')}
            className="text-gray-700 hover:text-pink-500 transition-colors font-serif text-sm"
          >
            RSVP
          </button>
        </div>
      </div>
    </nav>
  );
}
