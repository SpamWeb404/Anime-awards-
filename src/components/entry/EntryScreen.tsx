'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface EntryScreenProps {
  onComplete?: () => void;
}

const floatingTexts = [
  'Another soul approaches...',
  'The ledger welcomes you...',
  'Your name... will be written...',
  'The realm awaits...',
  'Destiny calls...',
];

// Type for ambient particles
type Particle = {
  left: string;
  top: string;
  delay: number;
  duration: number;
};

export function EntryScreen({ onComplete }: EntryScreenProps) {
  const [stage, setStage] = useState<'book' | 'opening' | 'tunnel' | 'complete'>('book');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [hasClicked, setHasClicked] = useState(false);
  const [ambientParticles, setAmbientParticles] = useState<Particle[]>([]);
  const router = useRouter();

  // Generate ambient particles only on the client (after mount)
  useEffect(() => {
    const particles = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
    setAmbientParticles(particles);
  }, []);

  // Handle book click
  const handleBookClick = useCallback(() => {
    if (hasClicked) return;
    setHasClicked(true);
    setStage('opening');

    // Progress through stages
    setTimeout(() => setStage('tunnel'), 1500);
    setTimeout(() => {
      setStage('complete');
      onComplete?.();
    }, 4000);
  }, [hasClicked, onComplete]);

  // Cycle through floating texts
  useEffect(() => {
    if (stage !== 'tunnel') return;

    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % floatingTexts.length);
    }, 800);

    return () => clearInterval(interval);
  }, [stage]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0f] overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Stage 1: The Book */}
        {stage === 'book' && (
          <motion.div
            key="book"
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={handleBookClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Ambient particles - generated client-side only */}
            <div className="absolute inset-0 pointer-events-none">
              {ambientParticles.map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
                  style={{
                    left: particle.left,
                    top: particle.top,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay,
                  }}
                />
              ))}
            </div>

            {/* The Book */}
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Book glow */}
              <div className="absolute inset-0 bg-gradient-radial from-violet-500/30 via-purple-500/10 to-transparent blur-3xl scale-150" />

              {/* Book cover */}
              <div className="relative w-72 h-96 md:w-96 md:h-[500px]">
                {/* Leather texture effect */}
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: `
                      linear-gradient(145deg, #3d2817 0%, #2a1b0f 50%, #3d2817 100%),
                      url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")
                    `,
                    boxShadow: `
                      inset 0 0 60px rgba(0,0,0,0.8),
                      0 0 40px rgba(139, 92, 246, 0.3),
                      0 0 80px rgba(139, 92, 246, 0.1)
                    `,
                  }}
                />

                {/* Gold border */}
                <div
                  className="absolute inset-3 rounded border-2"
                  style={{
                    borderColor: '#d4af37',
                    boxShadow: 'inset 0 0 20px rgba(212, 175, 55, 0.3)',
                  }}
                />

                {/* Corner decorations */}
                {[
                  'top-4 left-4',
                  'top-4 right-4',
                  'bottom-4 left-4',
                  'bottom-4 right-4',
                ].map((pos, i) => (
                  <div
                    key={i}
                    className={`absolute w-8 h-8 ${pos}`}
                    style={{
                      background: `
                        linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)
                      `,
                      clipPath:
                        'polygon(0 0, 100% 0, 100% 30%, 30% 30%, 30% 100%, 0 100%)',
                    }}
                  />
                ))}

                {/* Title */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
                  <motion.h1
                    className="text-3xl md:text-4xl font-bold text-center tracking-wider"
                    style={{
                      fontFamily: 'serif',
                      color: '#d4af37',
                      textShadow: '0 2px 10px rgba(212, 175, 55, 0.5)',
                    }}
                    animate={{
                      textShadow: [
                        '0 2px 10px rgba(212, 175, 55, 0.3)',
                        '0 2px 20px rgba(212, 175, 55, 0.6)',
                        '0 2px 10px rgba(212, 175, 55, 0.3)',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    THE LEDGER
                    <br />
                    OF SOULS
                  </motion.h1>

                  <div
                    className="w-24 h-0.5 my-4"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, #d4af37, transparent)',
                    }}
                  />

                  <p
                    className="text-sm md:text-base text-center italic"
                    style={{ color: 'rgba(212, 175, 55, 0.7)' }}
                  >
                    Record of the Chosen Ones
                  </p>

                  <motion.p
                    className="mt-12 text-xs text-center"
                    style={{ color: 'rgba(212, 175, 55, 0.5)' }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Click to enter
                  </motion.p>
                </div>

                {/* Center seal */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
                  <motion.div
                    className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: 'rgba(212, 175, 55, 0.5)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                  >
                    <span className="text-2xl">✦</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Stage 2: Book Opening */}
        {stage === 'opening' && (
          <motion.div
            key="opening"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-72 h-96 md:w-96 md:h-[500px]"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 180 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Pages effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 rounded"
                style={{
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />

              {/* Page lines */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-4 right-4 h-px bg-amber-900/10"
                  style={{ top: `${10 + i * 4}%` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.03 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Stage 3: The Tunnel */}
        {stage === 'tunnel' && (
          <motion.div
            key="tunnel"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Tunnel effect */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                  style={{
                    width: `${(i + 1) * 20}%`,
                    height: `${(i + 1) * 20}%`,
                    borderColor: `rgba(139, 92, 246, ${0.3 - i * 0.03})`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>

            {/* Floating pages */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-16 h-20 bg-gradient-to-br from-amber-100 to-yellow-50 rounded shadow-lg"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{
                  opacity: 0,
                  scale: 0,
                  rotate: Math.random() * 360,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 2],
                  x: [0, (Math.random() - 0.5) * 400],
                  y: [0, (Math.random() - 0.5) * 400],
                  rotate: [Math.random() * 360, Math.random() * 720],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                }}
              />
            ))}

            {/* Floating text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTextIndex}
                className="relative z-10 text-2xl md:text-4xl font-light text-center px-8"
                style={{
                  color: '#d4af37',
                  textShadow: '0 0 30px rgba(212, 175, 55, 0.5)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {floatingTexts[currentTextIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Stage 4: White flash */}
        {stage === 'complete' && (
          <motion.div
            key="complete"
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, times: [0, 0.5, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  );
        }
>>>>>>> 4ce55e143bf7dbe5a8976c9db4d3ab45a5bd36b3
