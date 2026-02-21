'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { EntryScreen } from '@/components/entry/EntryScreen';
import { RealmView } from '@/components/realm/RealmView';
import { AuthModal } from '@/components/auth/AuthModal';
import { Category } from '@/types';
import { getRandomDialogue } from '@/config/chibisama-dialogues';

export default function HomePage() {
  const [showEntry, setShowEntry] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [entryComplete, setEntryComplete] = useState(false);
  const { data: session, status } = useSession();

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      const data = await res.json();
      return data.data as Category[];
    },
    enabled: entryComplete,
  });

  // Handle entry completion
  const handleEntryComplete = useCallback(() => {
    setEntryComplete(true);
    // Small delay before hiding entry screen
    setTimeout(() => {
      setShowEntry(false);
      // Show auth modal if not authenticated
      if (status === 'unauthenticated') {
        setShowAuth(true);
      }
    }, 500);
  }, [status]);

  // Trigger Chibi-sama intro after entry
  useEffect(() => {
    if (entryComplete && !showEntry) {
      const timer = setTimeout(() => {
        const intro = getRandomDialogue('entry', 'intro');
        if (intro) {
          window.dispatchEvent(
            new CustomEvent('chibisama:speak', {
              detail: { category: 'entry', subcategory: 'intro' },
            })
          );
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [entryComplete, showEntry]);

  return (
    <>
      <AnimatePresence>
        {showEntry && (
          <EntryScreen onComplete={handleEntryComplete} />
        )}
      </AnimatePresence>

      {!showEntry && entryComplete && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="min-h-screen"
        >
          {/* Background effects */}
          <div className="fixed inset-0 pointer-events-none">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-slate-950 to-slate-950" />

            {/* Floating particles */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background:
                    i % 3 === 0
                      ? 'rgba(139, 92, 246, 0.5)'
                      : i % 3 === 1
                      ? 'rgba(236, 72, 153, 0.5)'
                      : 'rgba(34, 211, 238, 0.5)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -50, 0],
                  x: [0, Math.random() * 30 - 15, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}

            {/* Nebula clouds */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />
          </div>

          {/* Header */}
          <header className="relative z-10 p-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h1 className="text-2xl font-bold gradient-text">
                  ISEKAI AWARDS
                </h1>
                <p className="text-sm text-slate-400">
                  The Ledger of Souls • 2024
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4"
              >
                {session ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-300">
                      Welcome, {session.user?.name || 'Soul'}
                    </span>
                    <a
                      href="/profile"
                      className="px-4 py-2 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm hover:bg-violet-600/30 transition-colors"
                    >
                      Soul Ledger
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-700 transition-colors"
                  >
                    Bind Your Soul
                  </button>
                )}
              </motion.div>
            </div>
          </header>

          {/* Main content */}
          <div className="relative z-10">
            {categoriesData && <RealmView categories={categoriesData} />}
          </div>
        </motion.main>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
