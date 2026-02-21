'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Heart,
  Trophy,
  Plus,
  Megaphone,
  Settings,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminStats } from '@/types';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'nominees' | 'announcements' | 'settings'>('dashboard');

  // Check admin access
  const isAdmin = (session?.user as any)?.role === 'admin';

  // Redirect if not admin
  if (status === 'authenticated' && !isAdmin) {
    router.push('/');
    return null;
  }

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  // Fetch admin stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      return data.data as AdminStats;
    },
    enabled: isAdmin,
  });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'nominees', label: 'Nominees', icon: Trophy },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!isAdmin || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-violet-400" />
                Keeper&apos;s Realm
              </h1>
              <p className="text-slate-400">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-violet-600/20 text-violet-400 text-sm">
                Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
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

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Souls"
                value={stats.totalUsers}
                icon={Users}
                color="blue"
              />
              <StatCard
                title="Total Votes"
                value={stats.totalVotes}
                icon={Heart}
                color="pink"
              />
              <StatCard
                title="Categories"
                value={stats.votesByCategory.length}
                icon={Trophy}
                color="yellow"
              />
              <StatCard
                title="Hidden Gems"
                value={stats.hiddenGems.length}
                icon={Sparkles}
                color="purple"
              />
            </div>

            {/* Top Nominees */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                Top Nominees
              </h3>
              <div className="space-y-3">
                {stats.topNominees.slice(0, 5).map((item, index) => (
                  <div
                    key={item.nominee.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold">
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700">
                      {item.nominee.imageUrl && (
                        <img
                          src={item.nominee.imageUrl}
                          alt={item.nominee.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">
                        {item.nominee.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.nominee.category?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-violet-400">
                        {item.voteCount.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">votes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Votes by Category */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Votes by Category
              </h3>
              <div className="space-y-3">
                {stats.votesByCategory.map((category) => (
                  <div key={category.categoryId} className="flex items-center gap-4">
                    <span className="w-32 text-sm text-slate-400">
                      {category.categoryName}
                    </span>
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            (category.count / stats.totalVotes) * 100
                          }%`,
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                      />
                    </div>
                    <span className="w-16 text-right text-sm text-slate-400">
                      {category.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Nominees Tab */}
        {activeTab === 'nominees' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Manage Nominees</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add Nominee
              </button>
            </div>
            <p className="text-slate-500">
              Nominee management interface coming soon...
            </p>
          </motion.div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Announcements</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors">
                <Plus className="w-4 h-4" />
                New Announcement
              </button>
            </div>
            <p className="text-slate-500">
              Announcement management interface coming soon...
            </p>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Realm Settings
            </h2>
            <p className="text-slate-500">
              Settings interface coming soon...
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'pink' | 'yellow' | 'purple';
}) {
  const colors = {
    blue: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
    pink: 'from-pink-500/20 to-rose-500/20 text-pink-400',
    yellow: 'from-yellow-500/20 to-amber-500/20 text-yellow-400',
    purple: 'from-violet-500/20 to-purple-500/20 text-violet-400',
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
        </div>
        <div
          className={cn(
            'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center',
            colors[color]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
