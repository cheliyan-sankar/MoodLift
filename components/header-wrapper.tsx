'use client';

import { useAuth } from '@/lib/auth-context';
import { AfterLoginHeader } from './after-login-header';

export function HeaderWrapper() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return <AfterLoginHeader />;
}
