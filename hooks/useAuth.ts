'use client';

import { trpc } from '@/lib/trpc';

export function useAuth() {
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation();
  const utils = trpc.useUtils();

  const logout = async () => {
    await logoutMutation.mutateAsync();
    utils.auth.me.invalidate();
    window.location.href = '/';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
