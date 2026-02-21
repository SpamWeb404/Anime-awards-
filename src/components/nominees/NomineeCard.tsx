'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Sparkles } from 'lucide-react';
import { Nominee, ElementType, elementColors } from '@/types';
import { cn } from '@/lib/utils';

interface NomineeCardProps {
  nominee: Nominee;
  categoryElement: ElementType;
  index: number;
  onClick: () => void;
}

export function NomineeCard({
  nominee,
  categoryElement,
  index,
  onClick,
}: NomineeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const colors = elementColors[categoryElement];
  const isHiddenGem = nominee.hiddenGemScore > 70;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl overflow-hidden cursor-pointer',
        'border-2 transition-all duration-300',
        nominee.userVoted
          ? 'border-green-500/50 shadow-lg shadow-green-500/20'
          : 'border-transparent hover:border-violet-500/50'
      )}
      style={{
        background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}05)`,
      }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(circle at center, ${colors.glow}, transparent 70%)`,
        }}
      />

      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Manga/Anime split effect */}
        <div className="absolute inset-0 flex">
          {/* Manga side (left) */}
          <div
            className="w-1/2 h-full relative overflow-hidden"
            style={{
              filter: 'grayscale(100%) contrast(1.2)',
            }}
          >
            <Image
              src={nominee.mangaArtUrl || nominee.imageUrl}
              alt={nominee.title}
              fill
              className={cn(
                'object-cover transition-all duration-500',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {/* Manga lines overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0,0,0,0.1) 2px,
                    rgba(0,0,0,0.1) 4px
                  )
                `,
              }}
            />
          </div>

          {/* Anime side (right) */}
          <motion.div
            className="w-1/2 h-full relative overflow-hidden"
            animate={{
              filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
            }}
          >
            <Image
              src={nominee.imageUrl}
              alt={nominee.title}
              fill
              className={cn(
                'object-cover transition-all duration-500',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {/* Glow on hover */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.glow})`,
              }}
              animate={{ opacity: isHovered ? 0.5 : 0 }}
            />
          </motion.div>

          {/* Split line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-0.5"
            style={{
              background: `linear-gradient(180deg, transparent, ${colors.primary}, transparent)`,
            }}
          />
        </div>

        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-800 animate-pulse" />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Hidden Gem badge */}
          {isHiddenGem && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Hidden Gem
            </motion.div>
          )}

          {/* Voted badge */}
          {nominee.userVoted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 py-1 rounded-full bg-green-500 text-white text-xs font-medium flex items-center gap-1"
            >
              <Heart className="w-3 h-3 fill-current" />
              Bonded
            </motion.div>
          )}
        </div>

        {/* Vote count */}
        <div className="absolute bottom-3 right-3">
          <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm flex items-center gap-2">
            <Heart className="w-4 h-4" />
            {nominee.voteCount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-white text-lg mb-1 line-clamp-1">
          {nominee.title}
        </h3>
        {nominee.studio && (
          <p className="text-sm text-slate-400">{nominee.studio}</p>
        )}

        {/* Hidden gem indicator */}
        {isHiddenGem && (
          <div className="mt-3 flex items-center gap-2">
            <div
              className="h-1 flex-1 rounded-full overflow-hidden bg-slate-700"
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${nominee.hiddenGemScore}%` }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </div>
            <span className="text-xs text-slate-500">
              {Math.round(nominee.hiddenGemScore)}%
            </span>
          </div>
        )}
      </div>

      {/* Hover border effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 2px ${colors.primary}`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.5 : 0 }}
      />
    </motion.div>
  );
}
