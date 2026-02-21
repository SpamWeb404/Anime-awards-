// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  username: string;
  email?: string;
  authProvider?: 'discord' | 'google' | 'email' | 'guest';
  summonDate: string;
  lastSeen: string;
  role: 'user' | 'admin';
  privacyMode: 'public' | 'private' | 'anonymous';
  preferences?: UserPreferences;
  spiritForm?: SpiritForm;
  votes: Vote[];
  achievements: UserAchievement[];
}

export interface UserPreferences {
  theme?: 'dark' | 'light' | 'auto';
  companionPersonality?: 'sassy' | 'supportive' | 'mysterious';
  notifications?: boolean;
  soundEffects?: boolean;
}

export interface SpiritForm {
  id: string;
  glowColor: string;
  orbStyle: 'default' | 'crystal' | 'flame' | 'star' | 'moon';
  auraSize: 'small' | 'medium' | 'large';
  tailCount: number;
}

// ============================================
// Category Types
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  element: ElementType;
  description?: string;
  order: number;
  isActive: boolean;
  nomineeCount?: number;
  userVote?: Vote;
}

export type ElementType =
  | 'fire'
  | 'water'
  | 'shadow'
  | 'light'
  | 'nature'
  | 'thunder'
  | 'ice'
  | 'wind'
  | 'earth'
  | 'cosmos';

export const elementColors: Record<ElementType, { primary: string; secondary: string; glow: string }> = {
  fire: { primary: '#ef4444', secondary: '#f97316', glow: 'rgba(239, 68, 68, 0.5)' },
  water: { primary: '#3b82f6', secondary: '#06b6d4', glow: 'rgba(59, 130, 246, 0.5)' },
  shadow: { primary: '#6366f1', secondary: '#8b5cf6', glow: 'rgba(99, 102, 241, 0.5)' },
  light: { primary: '#fbbf24', secondary: '#f59e0b', glow: 'rgba(251, 191, 36, 0.5)' },
  nature: { primary: '#22c55e', secondary: '#10b981', glow: 'rgba(34, 197, 94, 0.5)' },
  thunder: { primary: '#eab308', secondary: '#facc15', glow: 'rgba(234, 179, 8, 0.5)' },
  ice: { primary: '#67e8f9', secondary: '#22d3ee', glow: 'rgba(103, 232, 249, 0.5)' },
  wind: { primary: '#a5f3fc', secondary: '#67e8f9', glow: 'rgba(165, 243, 252, 0.5)' },
  earth: { primary: '#92400e', secondary: '#b45309', glow: 'rgba(146, 64, 14, 0.5)' },
  cosmos: { primary: '#c084fc', secondary: '#a855f7', glow: 'rgba(192, 132, 252, 0.5)' },
};

// ============================================
// Nominee Types
// ============================================

export interface Nominee {
  id: string;
  categoryId: string;
  title: string;
  studio?: string;
  imageUrl: string;
  mangaArtUrl?: string;
  description?: string;
  hiddenGemScore: number;
  voteCount: number;
  userVoted?: boolean;
}

// ============================================
// Vote Types
// ============================================

export interface Vote {
  id: string;
  userId: string;
  nomineeId: string;
  categoryId: string;
  boundAt: string;
  updatedAt: string;
  nominee?: Nominee;
}

export interface VoteStats {
  totalVotes: number;
  categoryVotes: Record<string, number>;
  nomineeVotes: Record<string, number>;
}

// ============================================
// Achievement Types
// ============================================

export interface Achievement {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  achievement: Achievement;
  earnedAt: string;
}

// ============================================
// Announcement Types
// ============================================

export interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'celebration' | 'urgent';
  createdBy?: string;
  createdAt: string;
  expiresAt?: string;
  isGlobal: boolean;
  dismissedBy: string[];
}

// ============================================
// Chibi-sama Types
// ============================================

export type ChibiEmotion =
  | 'neutral'
  | 'excited'
  | 'judgmental'
  | 'cheeky'
  | 'dramatic'
  | 'bored'
  | 'annoyed'
  | 'impressed';

export interface ChibiDialogue {
  id: string;
  text: string | string[];
  emotion: ChibiEmotion;
  typingSpeed?: number;
  pauseAfter?: number;
}

// ============================================
// App Config Types
// ============================================

export interface AppConfig {
  votingDeadline?: string;
  votingOpen: boolean;
  totalUsers: number;
  totalVotes: number;
  announcementsEnabled: boolean;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Socket.io Event Types
// ============================================

export interface ServerToClientEvents {
  'vote:update': (data: { nomineeId: string; voteCount: number; categoryId: string }) => void;
  'announcement:new': (announcement: Announcement) => void;
  'user:joined': (data: { userCount: number }) => void;
  'user:left': (data: { userCount: number }) => void;
  'chibi:announce': (data: { message: string; emotion?: ChibiEmotion }) => void;
}

export interface ClientToServerEvents {
  'vote:subscribe': (categoryId: string) => void;
  'vote:unsubscribe': (categoryId: string) => void;
  'announcement:dismiss': (announcementId: string) => void;
}

// ============================================
// Admin Types
// ============================================

export interface AdminStats {
  totalUsers: number;
  totalVotes: number;
  votesByCategory: Record<string, number>;
  topNominees: Array<{ nominee: Nominee; voteCount: number }>;
  hiddenGems: Array<{ nominee: Nominee; hiddenGemScore: number }>;
  userGrowth: Array<{ date: string; count: number }>;
  voteTimeline: Array<{ date: string; count: number }>;
}

export interface CreateNomineeInput {
  categoryId: string;
  title: string;
  studio?: string;
  imageUrl: string;
  mangaArtUrl?: string;
  description?: string;
}

export interface UpdateNomineeInput extends Partial<CreateNomineeInput> {
  id: string;
}
