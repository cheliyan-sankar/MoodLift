'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, LogOut, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useStreak } from '@/hooks/use-streak';
import { generateInitials, getAvatarColor, getAvatarTextColor } from '@/lib/streak-utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const { streakData } = useStreak();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
  const initials = generateInitials(displayName);
  const bgColor = getAvatarColor(user?.email || '');
  const textColor = getAvatarTextColor(user?.email || '');

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 flex-wrap">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl sm:text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MoodLift
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/about">
              <Button variant="ghost" size="sm">About</Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" size="sm">Blog</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="sm">Contact</Button>
            </Link>
            {user ? (
              <>
                <Link href="/games">
                  <Button variant="ghost" size="sm">Games</Button>
                </Link>
                <Link href="/discover">
                  <Button variant="ghost" size="sm">Discover</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="p-0 bg-transparent hover:bg-transparent">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${bgColor} ${textColor} border-2 border-purple-200`}>
                          {initials}
                        </div>
                        {streakData?.currentStreak && streakData.currentStreak > 0 && (
                          <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-2 py-1 shadow-md border border-gray-200 flex items-center gap-1">
                            <Flame className="w-3 h-3" style={{ color: '#FF6B35' }} />
                            <span className="text-xs font-bold" style={{ color: '#FF6B35' }}>{streakData.currentStreak}</span>
                          </div>
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/">
                <Button size="sm" style={{ backgroundColor: '#3C1F71' }}>
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t">
            <Link href="/about" className="block">
              <Button variant="ghost" className="w-full justify-start text-sm">
                About
              </Button>
            </Link>
            <Link href="/blog" className="block">
              <Button variant="ghost" className="w-full justify-start text-sm">
                Blog
              </Button>
            </Link>
            <Link href="/contact" className="block">
              <Button variant="ghost" className="w-full justify-start text-sm">
                Contact
              </Button>
            </Link>
            {user ? (
              <>
                <Link href="/games" className="block">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Games
                  </Button>
                </Link>
                <Link href="/discover" className="block">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Discover
                  </Button>
                </Link>
                <Link href="/dashboard" className="block">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/" className="block">
                <Button className="w-full text-sm" style={{ backgroundColor: '#3C1F71' }}>
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}