export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string | null;
}

export interface StreakUpdateResult {
  currentStreak: number;
  longestStreak: number;
  isNewStreak: boolean;
  streakBroken: boolean;
}

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function getToday(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getYesterday(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

export function calculateStreakUpdate(
  currentStreak: number,
  longestStreak: number,
  lastLoginDate: string | null
): StreakUpdateResult {
  const today = getToday();
  const yesterday = getYesterday();

  if (!lastLoginDate) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, longestStreak),
      isNewStreak: true,
      streakBroken: false,
    };
  }

  if (lastLoginDate === today) {
    return {
      currentStreak,
      longestStreak,
      isNewStreak: false,
      streakBroken: false,
    };
  }

  if (lastLoginDate === yesterday) {
    const newStreak = currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, longestStreak),
      isNewStreak: false,
      streakBroken: false,
    };
  }

  return {
    currentStreak: 1,
    longestStreak,
    isNewStreak: true,
    streakBroken: true,
  };
}

export function generateInitials(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') {
    return 'U';
  }

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarColor(seed: string): string {
  const colors = [
    { bg: 'bg-blue-100', text: 'text-blue-700' },
    { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    { bg: 'bg-rose-100', text: 'text-rose-700' },
    { bg: 'bg-amber-100', text: 'text-amber-700' },
    { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  ];

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index].bg;
}

export function getAvatarTextColor(seed: string): string {
  const colors = [
    { bg: 'bg-blue-100', text: 'text-blue-700' },
    { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    { bg: 'bg-rose-100', text: 'text-rose-700' },
    { bg: 'bg-amber-100', text: 'text-amber-700' },
    { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  ];

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index].text;
}