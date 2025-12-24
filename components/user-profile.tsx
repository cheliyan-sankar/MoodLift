'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { supabase } from '@/lib/supabase';
import { useStreak } from '@/hooks/use-streak';
import { generateInitials, getAvatarColor, getAvatarTextColor } from '@/lib/streak-utils';
import { LogOut, Flame } from 'lucide-react';

interface UserProfileData {
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

function UserProfileComponent() {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { streakData, loading: streakLoading, updateStreak } = useStreak();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name, email, avatar_url')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          setUserData({
            fullName: profile.full_name || '',
            email: profile.email,
            avatarUrl: profile.avatar_url,
          });
        }

        await updateStreak();
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [updateStreak]);

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUserData(null);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  }, []);

  if (isLoading || streakLoading) {
    return (
      <div
        className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"
        aria-label="Loading user profile"
      />
    );
  }

  if (!userData) {
    return null;
  }

  const displayName = userData.fullName || userData.email.split('@')[0];
  const initials = generateInitials(displayName);
  const avatarBgColor = getAvatarColor(userData.email);
  const avatarTextColor = getAvatarTextColor(userData.email);
  const currentStreak = streakData?.currentStreak ?? 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-1 px-2 py-1.5 rounded-full transition-all hover:bg-gray-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{ '--tw-ring-color': 'hsl(var(--primary))' } as React.CSSProperties}
        aria-label={`Profile menu for ${displayName}`}
        aria-expanded={isOpen}
      >
        <div className="relative">
          {userData.avatarUrl ? (
            <img
              src={userData.avatarUrl}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${avatarBgColor} ${avatarTextColor} border-2 border-purple-200`}
            >
              {initials}
            </div>
          )}

          {currentStreak > 0 && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border border-gray-200">
              <Flame
                className="w-4 h-4"
                style={{ color: '#FF6B35' }}
                fill="#FF6B35"
                aria-label={`${currentStreak} day streak`}
              />
            </div>
          )}
        </div>

        <div className="hidden sm:block text-right">
          <p className="text-xs font-medium text-gray-900 leading-none">{displayName}</p>
          {currentStreak > 0 && (
            <p className="text-xs font-semibold mt-0.5" style={{ color: '#FF6B35' }}>
              {currentStreak} day
            </p>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div
            className="px-4 py-3 border-b"
            style={{ backgroundColor: 'hsl(var(--secondary))' }}
          >
            <p className="text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-600 mt-0.5">{userData.email}</p>
          </div>

          <div className="px-4 py-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5" style={{ color: '#FF6B35' }} fill="#FF6B35" />
                <div>
                  <p className="text-xs text-gray-600">Current Streak</p>
                  <p className="text-lg font-bold" style={{ color: 'hsl(var(--primary))' }}>
                    {currentStreak > 0 ? `${currentStreak} days` : '-'}
                  </p>
                </div>
              </div>
            </div>

            {streakData && streakData.longestStreak > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600">Personal Best</p>
                <p className="text-lg font-bold" style={{ color: 'hsl(var(--primary))' }}>
                  {streakData.longestStreak} days
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export const UserProfile = memo(UserProfileComponent);