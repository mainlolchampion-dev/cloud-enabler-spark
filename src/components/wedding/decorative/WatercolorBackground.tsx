interface WatercolorBackgroundProps {
  variant?: 'pink' | 'purple' | 'mixed';
  opacity?: number;
}

export function WatercolorBackground({ variant = 'mixed', opacity = 0.3 }: WatercolorBackgroundProps) {
  const variants = {
    pink: 'from-pink-200/40 via-pink-100/20 to-transparent',
    purple: 'from-purple-200/40 via-purple-100/20 to-transparent',
    mixed: 'from-pink-200/40 via-purple-100/20 to-pink-100/20'
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Watercolor splash effects */}
      <div 
        className={`absolute top-0 left-0 w-full h-full bg-gradient-radial ${variants[variant]} blur-3xl`}
        style={{ opacity }}
      ></div>
      <div 
        className="absolute top-20 right-10 w-96 h-96 bg-gradient-radial from-pink-300/30 via-transparent to-transparent rounded-full blur-3xl"
        style={{ opacity }}
      ></div>
      <div 
        className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-radial from-purple-300/30 via-transparent to-transparent rounded-full blur-3xl"
        style={{ opacity }}
      ></div>
    </div>
  );
}
