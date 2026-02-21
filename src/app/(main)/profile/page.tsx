'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  User,
  Heart,
  Award,
  Settings,
  Calendar,
  Sparkles,
  Palette,
  Shield,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { UserAchievement, Vote } from '@/types';

interface UserProfile {
  id: string;
  username: string;
  email?: string;
  summonDate: string;
  role: string;
  privacyMode: string;
  spiritForm?: {
    glowColor: string;
    orbStyle: string;
    auraSize: string;
    tailCount: number;
  };
  stats: {
    totalVotes: number;
    totalAchievements: number;
    categoriesVoted: number;
    affinityStats: Array<{
      category: string;
      element: string;
      votes: number;
      percentage: number;
    }>;
  };
  votes: Vote[];
  achievements: Array<{
    achievement: {
      id: string;
      name: string;
      description: string;
      icon: string;
      rarity: string;
    };
    earnedAt: string;
  }>;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'votes' | 'achievements' | 'settings'>('overview');

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      return data.data as UserProfile;
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'votes', label: 'Soul Bonds', icon: Heart },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <main className="min-h-screen pb-20">
      {/* Header Background */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/50 to-slate-950" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at top, ${profile.spiritForm?.glowColor || '#8b5cf6'}40, transparent 60%)`,
          }}
        />

        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: profile.spiritForm?.glowColor || '#8b5cf6',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div
              className="w-32 h-32 rounded-full border-4 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${profile.spiritForm?.glowColor || '#8b5cf6'}40, ${profile.spiritForm?.glowColor || '#8b5cf6'}20)`,
                borderColor: profile.spiritForm?.glowColor || '#8b5cf6',
                boxShadow: `0 0 40px ${profile.spiritForm?.glowColor || '#8b5cf6'}50`,
              }}
            >
              <User className="w-16 h-16 text-white/80" />
            </div>
            {profile.role === 'admin' && (
              <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-medium">
                Admin
              </div>
            )}
          </motion.div>

          {/* Info */}
          <div className="flex-1">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {profile.username}
            </motion.h1>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 text-slate-400"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Summoned {formatDate(profile.summonDate)}
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {profile.privacyMode} profile
              </span>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4"
          >
            <div className="text-center px-4 py-2 rounded-xl bg-slate-800/50">
              <div className="text-2xl font-bold text-violet-400">
                {profile.stats.totalVotes}
              </div>
              <div className="text-xs text-slate-500">Soul Bonds</div>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-slate-800/50">
              <div className="text-2xl font-bold text-pink-400">
                {profile.stats.totalAchievements}
              </div>
              <div className="text-xs text-slate-500">Achievements</div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="glass rounded-2xl p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Affinity Stats */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  Elemental Affinity
                </h3>
                {profile.stats.affinityStats.length > 0 ? (
                  <div className="space-y-3">
                    {profile.stats.affinityStats.map((stat) => (
                      <div key={stat.category} className="flex items-center gap-4">
                        <span className="w-32 text-sm text-slate-400">
                          {stat.category}
                        </span>
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.percentage}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                          />
                        </div>
                        <span className="w-12 text-right text-sm text-slate-400">
                          {stat.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">
                    No votes yet. Start exploring the realms!
                  </p>
                )}
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Recent Soul Bonds
                </h3>
                {profile.votes.slice(0, 5).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile.votes.slice(0, 5).map((vote) => (
                      <div
                        key={vote.id}
                        className="p-4 rounded-xl bg-slate-800/50 flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-lg bg-violet-600/20 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {vote.nominee?.title}
                          </p>
                          <p className="text-sm text-slate-500">
                            {vote.nominee?.category?.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">
                    No soul bonds yet. Visit the realms to start voting!
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Votes Tab */}
          {activeTab === 'votes' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {profile.votes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.votes.map((vote) => (
                    <div
                      key={vote.id}
                      className="p-4 rounded-xl bg-slate-800/50 flex items-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700">
                        {vote.nominee?.imageUrl && (
                          <img
                            src={vote.nominee.imageUrl}
                            alt={vote.nominee.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">
                          {vote.nominee?.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {vote.nominee?.category?.name}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Bonded {formatDate(vote.boundAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">
                    No soul bonds yet. Visit the realms to start voting!
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {profile.achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.achievements.map((ua) => (
                    <div
                      key={ua.achievement.id}
                      className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center text-2xl">
                          {ua.achievement.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">
                            {ua.achievement.name}
                          </h4>
                          <p className="text-sm text-slate-500">
                            {ua.achievement.description}
                          </p>
                          <span
                            className={cn(
                              'inline-block mt-2 px-2 py-0.5 rounded text-xs',
                              ua.achievement.rarity === 'legendary' &&
                                'bg-yellow-500/20 text-yellow-400',
                              ua.achievement.rarity === 'epic' &&
                                'bg-purple-500/20 text-purple-400',
                              ua.achievement.rarity === 'rare' &&
                                'bg-blue-500/20 text-blue-400',
                              ua.achievement.rarity === 'common' &&
                                'bg-slate-500/20 text-slate-400'
                            )}
                          >
                            {ua.achievement.rarity}
                          </span>
                          <p className="text-xs text-slate-600 mt-2">
                            Earned {formatDate(ua.earnedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">
                    No achievements yet. Keep exploring to unlock them!
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Spirit Form */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-violet-400" />
                  Spirit Form
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-800/50">
                    <label className="block text-sm text-slate-400 mb-2">
                      Glow Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={profile.spiritForm?.glowColor || '#ff69b4'}
                        className="w-12 h-12 rounded-lg cursor-pointer"
                        readOnly
                      />
                      <span className="text-sm text-slate-500">
                        {profile.spiritForm?.glowColor || '#ff69b4'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/50">
                    <label className="block text-sm text-slate-400 mb-2">
                      Orb Style
                    </label>
                    <p className="text-white capitalize">
                      {profile.spiritForm?.orbStyle || 'default'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/50">
                    <label className="block text-sm text-slate-400 mb-2">
                      Aura Size
                    </label>
                    <p className="text-white capitalize">
                      {profile.spiritForm?.auraSize || 'medium'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/50">
                    <label className="block text-sm text-slate-400 mb-2">
                      Tail Count
                    </label>
                    <p className="text-white">
                      {profile.spiritForm?.tailCount || 3} tails
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-400" />
                  Privacy
                </h3>
                <div className="p-4 rounded-xl bg-slate-800/50">
                  <p className="text-sm text-slate-400 mb-2">Profile Visibility</p>
                  <p className="text-white capitalize">{profile.privacyMode}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
