'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Heart, Loader2 } from 'lucide-react';
import { Nominee, ElementType, elementColors } from '@/types';
import { cn } from '@/lib/utils';

interface VoteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  nominee: Nominee | null;
  categoryElement: ElementType;
  onConfirm: () => void;
  isLoading: boolean;
}

export function VoteConfirmModal({
  isOpen,
  onClose,
  nominee,
  categoryElement,
  onConfirm,
  isLoading,
}: VoteConfirmModalProps) {
  const colors = elementColors[categoryElement];

  if (!nominee) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-strong rounded-2xl overflow-hidden max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={nominee.imageUrl}
                alt={nominee.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl font-bold text-white">
                  {nominee.title}
                </h2>
                {nominee.studio && (
                  <p className="text-slate-400">{nominee.studio}</p>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {nominee.description && (
                <p className="text-slate-300 mb-6">{nominee.description}</p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <span className="text-slate-400">
                    {nominee.voteCount.toLocaleString()} souls bonded
                  </span>
                </div>
                {nominee.hiddenGemScore > 70 && (
                  <div
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      background: `${colors.primary}30`,
                      color: colors.primary,
                    }}
                  >
                    Hidden Gem {Math.round(nominee.hiddenGemScore)}%
                  </div>
                )}
              </div>

              {/* Warning text */}
              <div
                className="p-4 rounded-xl mb-6"
                style={{
                  background: `${colors.primary}10`,
                  border: `1px solid ${colors.primary}30`,
                }}
              >
                <p className="text-sm text-slate-300">
                  You are about to bind your soul to this nominee. This bond can
                  be changed until the voting period ends.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={cn(
                    'flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all',
                    isLoading
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'text-white hover:shadow-lg'
                  )}
                  style={{
                    background: isLoading
                      ? undefined
                      : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    boxShadow: isLoading
                      ? undefined
                      : `0 4px 20px ${colors.glow}`,
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Binding...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5" />
                      Bind Your Soul
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
