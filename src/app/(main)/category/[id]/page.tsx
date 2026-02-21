'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';
import { Nominee, Category } from '@/types';
import { NomineeCard } from '@/components/nominees/NomineeCard';
import { VoteConfirmModal } from '@/components/nominees/VoteConfirmModal';
import { getRandomDialogue } from '@/config/chibisama-dialogues';
import { cn } from '@/lib/utils';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);

  // Fetch category details
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const res = await fetch(`/api/categories`);
      const data = await res.json();
      return data.data.find((c: Category) => c.id === categoryId) as Category;
    },
  });

  // Fetch nominees
  const { data: nominees, isLoading: nomineesLoading } = useQuery({
    queryKey: ['nominees', categoryId],
    queryFn: async () => {
      const res = await fetch(`/api/nominees?categoryId=${categoryId}`);
      const data = await res.json();
      return data.data as Nominee[];
    },
    enabled: !!categoryId,
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async (nomineeId: string) => {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomineeId, categoryId }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nominees', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });

      // Trigger Chibi-sama dialogue
      const dialogue = getRandomDialogue('voting', 'confirm');
      if (dialogue) {
        window.dispatchEvent(
          new CustomEvent('chibisama:speak', {
            detail: { category: 'voting', subcategory: 'confirm' },
          })
        );
      }

      setShowVoteModal(false);
      setSelectedNominee(null);
    },
  });

  // Handle nominee click
  const handleNomineeClick = useCallback(
    (nominee: Nominee) => {
      setSelectedNominee(nominee);

      if (nominee.userVoted) {
        // Already voted for this one
        const dialogue = getRandomDialogue('nominees', 'alreadyVoted');
        if (dialogue) {
          window.dispatchEvent(
            new CustomEvent('chibisama:speak', {
              detail: { category: 'nominees', subcategory: 'alreadyVoted' },
            })
          );
        }
      } else {
        // Show vote modal
        const dialogue = getRandomDialogue('nominees', 'click', {
          nomineeTitle: nominee.title,
        });
        if (dialogue) {
          window.dispatchEvent(
            new CustomEvent('chibisama:speak', {
              detail: {
                category: 'nominees',
                subcategory: 'click',
                replacements: { nomineeTitle: nominee.title },
              },
            })
          );
        }
        setShowVoteModal(true);
      }
    },
    [setSelectedNominee, setShowVoteModal]
  );

  // Handle vote confirmation
  const handleVoteConfirm = useCallback(() => {
    if (selectedNominee) {
      voteMutation.mutate(selectedNominee.id);
    }
  }, [selectedNominee, voteMutation]);

  // Trigger category entry dialogue
  useEffect(() => {
    if (category) {
      const timer = setTimeout(() => {
        const dialogue = getRandomDialogue('categories', 'enter', {
          categoryName: category.name,
        });
        if (dialogue) {
          window.dispatchEvent(
            new CustomEvent('chibisama:speak', {
              detail: {
                category: 'categories',
                subcategory: category.element,
                replacements: { categoryName: category.name },
              },
            })
          );
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [category]);

  if (categoryLoading || nomineesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Realm Not Found
          </h1>
          <Link
            href="/"
            className="text-violet-400 hover:text-violet-300"
          >
            Return to the Main Realm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at top, ${category.element}40, transparent 60%)`,
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Realms
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-slate-400 max-w-2xl">
                {category.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <span className="text-slate-400">
                  {nominees?.length || 0} nominees
                </span>
              </div>
              {category.userVoted && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">You&apos;ve voted</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Nominees Grid */}
      <section className="relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nominees?.map((nominee, index) => (
              <NomineeCard
                key={nominee.id}
                nominee={nominee}
                categoryElement={category.element}
                index={index}
                onClick={() => handleNomineeClick(nominee)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Vote Confirmation Modal */}
      <VoteConfirmModal
        isOpen={showVoteModal}
        onClose={() => {
          setShowVoteModal(false);
          setSelectedNominee(null);
        }}
        nominee={selectedNominee}
        categoryElement={category.element}
        onConfirm={handleVoteConfirm}
        isLoading={voteMutation.isPending}
      />
    </main>
  );
}
