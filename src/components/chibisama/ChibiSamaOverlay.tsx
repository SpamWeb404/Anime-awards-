'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DialogueEntry,
  getRandomDialogue,
  chibisamaDialogues,
} from '@/config/chibisama-dialogues';
import { ChibiEmotion } from '@/types';

interface ChibiSamaState {
  isVisible: boolean;
  dialogue: DialogueEntry | null;
  isTyping: boolean;
  displayedText: string;
  emotion: ChibiEmotion;
  clickCount: number;
}

// Emotion-based styling
const emotionStyles: Record<ChibiEmotion, { color: string; tailSpeed: number }> =
  {
    neutral: { color: '#a78bfa', tailSpeed: 3 },
    excited: { color: '#f472b6', tailSpeed: 1 },
    judgmental: { color: '#818cf8', tailSpeed: 4 },
    cheeky: { color: '#fbbf24', tailSpeed: 2 },
    dramatic: { color: '#c084fc', tailSpeed: 1.5 },
    bored: { color: '#94a3b8', tailSpeed: 5 },
    annoyed: { color: '#f87171', tailSpeed: 2 },
    impressed: { color: '#22d3ee', tailSpeed: 1.5 },
  };

export function ChibiSamaOverlay() {
  const [state, setState] = useState<ChibiSamaState>({
    isVisible: false,
    dialogue: null,
    isTyping: false,
    displayedText: '',
    emotion: 'neutral',
    clickCount: 0,
  });

  const [isMinimized, setIsMinimized] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Type dialogue with effect
  const typeDialogue = useCallback(
    (text: string, speed: number = 50) => {
      setState((prev) => ({ ...prev, isTyping: true, displayedText: '' }));

      let index = 0;
      const type = () => {
        if (index < text.length) {
          setState((prev) => ({
            ...prev,
            displayedText: text.slice(0, index + 1),
          }));
          index++;
          typingRef.current = setTimeout(type, speed);
        } else {
          setState((prev) => ({ ...prev, isTyping: false }));
        }
      };

      type();
    },
    [setState]
  );

  // Show dialogue
  const showDialogue = useCallback(
    (dialogue: DialogueEntry | null, autoHide: boolean = true) => {
      if (!dialogue) return;

      // Clear any existing typing
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }

      const text = Array.isArray(dialogue.text)
        ? dialogue.text.join(' ')
        : dialogue.text;

      setState((prev) => ({
        ...prev,
        isVisible: true,
        dialogue,
        emotion: dialogue.emotion || 'neutral',
      }));

      setIsMinimized(false);
      typeDialogue(text, dialogue.typingSpeed || 50);

      // Auto-hide after pause
      if (autoHide && hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      if (autoHide && dialogue.pauseAfter) {
        hideTimeoutRef.current = setTimeout(() => {
          setIsMinimized(true);
        }, dialogue.pauseAfter + text.length * 50);
      }
    },
    [typeDialogue]
  );

  // Skip typing animation
  const skipTyping = useCallback(() => {
    if (typingRef.current) {
      clearTimeout(typingRef.current);
    }
    if (state.dialogue) {
      const text = Array.isArray(state.dialogue.text)
        ? state.dialogue.text.join(' ')
        : state.dialogue.text;
      setState((prev) => ({ ...prev, isTyping: false, displayedText: text }));
    }
  }, [state.dialogue]);

  // Handle Chibi-sama click (easter egg)
  const handleChibiClick = useCallback(() => {
    const newClickCount = state.clickCount + 1;
    setState((prev) => ({ ...prev, clickCount: newClickCount }));

    // Easter egg responses
    const easterEggDialogues = chibisamaDialogues.easterEggs.clickChibi;
    const dialogueIndex = Math.min(
      newClickCount - 1,
      easterEggDialogues.length - 1
    );

    if (dialogueIndex >= 0 && dialogueIndex < easterEggDialogues.length) {
      showDialogue(easterEggDialogues[dialogueIndex], false);
    }

    // Reset after the last response
    if (newClickCount >= easterEggDialogues.length) {
      setState((prev) => ({ ...prev, clickCount: 0 }));
    }
  }, [state.clickCount, showDialogue]);

  // Show random hint
  const showRandomHint = useCallback(() => {
    const hint = getRandomDialogue('hints', 'random');
    if (hint) {
      showDialogue(hint, true);
    }
  }, [showDialogue]);

  // Listen for custom events
  useEffect(() => {
    const handleChibiSpeak = (event: CustomEvent) => {
      const { dialogueId, category, subcategory, replacements } = event.detail;

      if (dialogueId) {
        // Find specific dialogue by ID
        // This would need a getDialogueById function
      } else if (category && subcategory) {
        const dialogue = getRandomDialogue(category, subcategory, replacements);
        showDialogue(dialogue);
      }
    };

    window.addEventListener(
      'chibisama:speak' as any,
      handleChibiSpeak as EventListener
    );

    return () => {
      window.removeEventListener(
        'chibisama:speak' as any,
        handleChibiSpeak as EventListener
      );
    };
  }, [showDialogue]);

  // Initial greeting after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const currentEmotionStyle = emotionStyles[state.emotion];

  return (
    <>
      {/* Floating Chibi-sama Avatar */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
      >
        {/* Hint bubble */}
        <AnimatePresence>
          {showHint && isMinimized && !state.isVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-full right-0 mb-3 whitespace-nowrap"
            >
              <div className="glass px-4 py-2 rounded-full text-sm text-white/80 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Click for guidance
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chibi-sama Avatar */}
        <motion.div
          className="relative"
          onClick={handleChibiClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-50"
            style={{
              background: currentEmotionStyle.color,
              animation: `pulse-glow ${currentEmotionStyle.tailSpeed}s ease-in-out infinite`,
            }}
          />

          {/* Avatar circle */}
          <div
            className="relative w-16 h-16 rounded-full flex items-center justify-center border-2"
            style={{
              background: `linear-gradient(135deg, ${currentEmotionStyle.color}40, ${currentEmotionStyle.color}20)`,
              borderColor: currentEmotionStyle.color,
              boxShadow: `0 0 20px ${currentEmotionStyle.color}50`,
            }}
          >
            {/* Chibi-sama face representation */}
            <div className="relative w-10 h-10">
              {/* Eyes */}
              <motion.div
                className="absolute top-2 left-1 w-2.5 h-3 bg-white rounded-full"
                animate={{
                  scaleY: [1, 0.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <div
                  className="absolute top-1 left-0.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: currentEmotionStyle.color }}
                />
              </motion.div>
              <motion.div
                className="absolute top-2 right-1 w-2.5 h-3 bg-white rounded-full"
                animate={{
                  scaleY: [1, 0.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <div
                  className="absolute top-1 right-0.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: currentEmotionStyle.color }}
                />
              </motion.div>

              {/* Mouth */}
              <motion.div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-1.5 border-b-2 border-white rounded-full"
                animate={{
                  scaleX: state.emotion === 'excited' ? [1, 1.3, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              />

              {/* Tails (decorative) */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute -bottom-1 w-2 h-4 rounded-full opacity-60"
                  style={{
                    background: currentEmotionStyle.color,
                    left: `${20 + i * 25}%`,
                  }}
                  animate={{
                    rotate: [-10, 10, -10],
                    scaleY: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: currentEmotionStyle.tailSpeed,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Hint button */}
          <motion.button
            className="absolute -top-1 -right-1 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              showRandomHint();
            }}
          >
            <MessageCircle className="w-3 h-3 text-white" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Dialogue Bubble */}
      <AnimatePresence>
        {state.isVisible && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-28 right-6 z-50 max-w-sm"
            onClick={skipTyping}
          >
            <div className="glass-strong rounded-2xl p-5 relative">
              {/* Close button */}
              <button
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
              >
                <X className="w-3 h-3" />
              </button>

              {/* Emotion indicator */}
              <div className="flex items-center gap-2 mb-3">
                <Sparkles
                  className="w-4 h-4"
                  style={{ color: currentEmotionStyle.color }}
                />
                <span
                  className="text-xs uppercase tracking-wider font-medium"
                  style={{ color: currentEmotionStyle.color }}
                >
                  {state.emotion}
                </span>
              </div>

              {/* Dialogue text */}
              <p className="text-white/90 text-sm leading-relaxed min-h-[3rem]">
                {state.displayedText}
                {state.isTyping && (
                  <span className="inline-block w-0.5 h-4 bg-white/60 ml-0.5 animate-pulse" />
                )}
              </p>

              {/* Click to skip hint */}
              {state.isTyping && (
                <p className="text-white/40 text-xs mt-2">Click to skip</p>
              )}
            </div>

            {/* Triangle pointer */}
            <div
              className="absolute -bottom-2 right-8 w-4 h-4 rotate-45"
              style={{
                background: 'rgba(20, 20, 30, 0.85)',
                borderRight: '1px solid rgba(255, 255, 255, 0.15)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Export hook for triggering Chibi-sama from other components
export function useChibiSama() {
  const speak = useCallback(
    (
      category: string,
      subcategory: string,
      replacements?: Record<string, string>
    ) => {
      const dialogue = getRandomDialogue(category, subcategory, replacements);
      if (dialogue) {
        window.dispatchEvent(
          new CustomEvent('chibisama:speak', {
            detail: { category, subcategory, replacements },
          })
        );
      }
    },
    []
  );

  return { speak };
}
