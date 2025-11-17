import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="text-center space-y-6">
        {/* Animated Heart */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block"
        >
          <Heart className="h-16 w-16 text-primary" fill="currentColor" />
        </motion.div>

        {/* Pulsing Circles */}
        <div className="relative h-16 flex items-center justify-center">
          <motion.div
            className="absolute w-16 h-16 rounded-full border-4 border-primary/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute w-16 h-16 rounded-full border-4 border-secondary/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-muted-foreground font-medium"
        >
          {message}
        </motion.p>

        {/* Dots animation */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                y: [0, -10, 0],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
