'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ghost, Home } from 'lucide-react';
import { getRandomDialogue } from '@/config/chibisama-dialogues';

export default function NotFound() {
  useEffect(() => {
    // Trigger Chibi-sama 404 dialogue
    const dialogue = getRandomDialogue('errors', 'notFound');
    if (dialogue) {
      window.dispatchEvent(
        new CustomEvent('chibisama:speak', {
          detail: { category: 'errors', subcategory: 'notFound' },
        })
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-violet-600/20 flex items-center justify-center"
        >
          <Ghost className="w-12 h-12 text-violet-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold gradient-text mb-4"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-slate-300 mb-2"
        >
          This page was erased from the ledger
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-500 mb-8"
        >
          Perhaps it never existed. Perhaps neither do you.
          <br />
          <span className="text-sm">(Just kidding. Use the navigation, please.)</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Return to the Realm
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
