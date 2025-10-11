import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface CountdownTimerProps {
  targetDate: string;
  targetTime?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({ targetDate, targetTime = '00:00' }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-serif text-primary mb-2">Αντίστροφη Μέτρηση</h2>
        <p className="text-muted-foreground text-lg">Μέχρι τη μεγάλη ημέρα</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: timeLeft.days, label: 'Μέρες' },
          { value: timeLeft.hours, label: 'Ώρες' },
          { value: timeLeft.minutes, label: 'Λεπτά' },
          { value: timeLeft.seconds, label: 'Δευτερόλεπτα' },
        ].map((item, index) => (
          <Card 
            key={index}
            className="p-6 text-center bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 hover:scale-105 transition-transform duration-300"
          >
            <div className="text-5xl md:text-6xl font-bold text-primary mb-2 font-serif">
              {item.value.toString().padStart(2, '0')}
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">
              {item.label}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
