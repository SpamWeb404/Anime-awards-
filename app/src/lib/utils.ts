import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  return d.toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return formatDate(date);
}

/**
 * Format time remaining until a deadline
 */
export function formatTimeRemaining(deadline: string | Date): string {
  const d = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const now = new Date();
  const diffInSeconds = Math.floor((d.getTime() - now.getTime()) / 1000);

  if (diffInSeconds <= 0) return 'Time is up!';

  const days = Math.floor(diffInSeconds / 86400);
  const hours = Math.floor((diffInSeconds % 86400) / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}

/**
 * Generate a random username for guests
 */
export function generateGuestUsername(): string {
  const adjectives = ['Wandering', 'Mysterious', 'Silent', 'Ethereal', 'Lost', 'Drifting', 'Hidden'];
  const nouns = ['Soul', 'Spirit', 'Wanderer', 'Shadow', 'Echo', 'Dream', 'Whisper'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 9999);
  return `${adj}${noun}${number}`;
}

/**
 * Calculate hidden gem score based on vote patterns
 */
export function calculateHiddenGemScore(
  voteCount: number,
  totalVotes: number,
  nomineeCount: number
): number {
  if (totalVotes === 0 || nomineeCount === 0) return 0;

  const averageVotes = totalVotes / nomineeCount;
  const voteRatio = voteCount / averageVotes;

  // Hidden gems have lower vote counts but high engagement
  // Score is higher when votes are below average but not zero
  if (voteCount === 0) return 0;
  if (voteRatio > 1.5) return 0; // Too popular

  // Calculate score: inverse of popularity, capped at 100
  const score = Math.min(100, Math.max(0, (1 - voteRatio / 1.5) * 100));
  return Math.round(score);
}

/**
 * Check if a user has earned an achievement
 */
export function checkAchievementCondition(
  condition: string,
  userData: {
    voteCount: number;
    categoryCount: number;
    totalCategories: number;
    daysVisited: number;
    hiddenGemVotes: number;
    joinDate: Date;
  }
): boolean {
  switch (condition) {
    case 'first_vote':
      return userData.voteCount >= 1;
    case 'hidden_gem_hunter':
      return userData.hiddenGemVotes >= 3;
    case 'completionist':
      return userData.categoryCount >= userData.totalCategories;
    case 'early_soul':
      const hoursSinceJoin = (Date.now() - userData.joinDate.getTime()) / (1000 * 60 * 60);
      return hoursSinceJoin <= 24 && userData.voteCount > 0;
    case 'loyal_spirit':
      return userData.daysVisited >= 3;
    case 'dedicated_voter':
      return userData.voteCount >= 10;
    default:
      return false;
  }
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generate a gradient based on element type
 */
export function getElementGradient(element: string): string {
  const gradients: Record<string, string> = {
    fire: 'from-red-500 via-orange-500 to-yellow-500',
    water: 'from-blue-500 via-cyan-500 to-teal-500',
    shadow: 'from-indigo-600 via-purple-600 to-pink-600',
    light: 'from-yellow-400 via-amber-400 to-orange-400',
    nature: 'from-green-500 via-emerald-500 to-teal-500',
    thunder: 'from-yellow-500 via-amber-500 to-orange-500',
    ice: 'from-cyan-400 via-sky-400 to-blue-400',
    wind: 'from-sky-300 via-cyan-300 to-teal-300',
    earth: 'from-amber-700 via-yellow-700 to-orange-800',
    cosmos: 'from-purple-500 via-violet-500 to-fuchsia-500',
  };
  return gradients[element] || gradients.cosmos;
}

/**
 * Get element icon name
 */
export function getElementIcon(element: string): string {
  const icons: Record<string, string> = {
    fire: 'Flame',
    water: 'Droplets',
    shadow: 'Moon',
    light: 'Sun',
    nature: 'Leaf',
    thunder: 'Zap',
    ice: 'Snowflake',
    wind: 'Wind',
    earth: 'Mountain',
    cosmos: 'Sparkles',
  };
  return icons[element] || 'Sparkles';
}

/**
 * Sleep function for animations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Shuffle array randomly
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Get contrast color (black or white) for a background
 */
export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#ffffff';

  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
