import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCountdownProps {
  targetDate: string;
  targetTime?: string;
  style?: 'classic' | 'modern' | 'minimal';
  accentColor?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function AnimatedCountdown({ 
  targetDate, 
  targetTime = '18:00',
  style = 'classic',
  accentColor = '#C9A961'
}: AnimatedCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(`${targetDate}T${targetTime}`);
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => {
    if (style === 'minimal') {
      return (
        <motion.div 
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-6xl font-bold font-serif"
            style={{ color: accentColor }}
          >
            {value.toString().padStart(2, '0')}
          </motion.div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider mt-2">
            {label}
          </div>
        </motion.div>
      );
    }

    if (style === 'modern') {
      return (
        <motion.div 
          className="relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              key={value}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-5xl md:text-7xl font-bold font-serif"
              style={{ color: accentColor }}
            >
              {value.toString().padStart(2, '0')}
            </motion.div>
            <div className="text-xs md:text-sm text-white/70 uppercase tracking-widest mt-3 font-medium">
              {label}
            </div>
          </motion.div>
        </motion.div>
      );
    }

    // Classic style
    return (
      <motion.div 
        className="text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/30 shadow-xl"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            key={value}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-6xl font-bold font-serif"
            style={{ color: accentColor }}
          >
            {value.toString().padStart(2, '0')}
          </motion.div>
          <div className="text-sm text-white/80 uppercase tracking-wide mt-2 font-medium">
            {label}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8 text-white">
          Counting Down To Forever
        </h3>
        
        <div className={`grid grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto ${
          style === 'minimal' ? 'gap-8' : ''
        }`}>
          <TimeUnit value={timeLeft.days} label="Days" />
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <TimeUnit value={timeLeft.minutes} label="Minutes" />
          <TimeUnit value={timeLeft.seconds} label="Seconds" />
        </div>
      </motion.div>
    </div>
  );
}
