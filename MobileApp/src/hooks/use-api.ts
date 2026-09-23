import { useCallback } from 'react';

import { apiRequest, type ApiResult } from '@/api/client';
import { useSession } from '@/context/session';

export function useApi() {
  const { session, signIn, signOut } = useSession();

  return useCallback(
    async (path: string, options?: { method?: string; body?: unknown }): Promise<ApiResult<any>> => {
      if (!session) {
        return { ok: false, errorMessage: 'Not authenticated', authExpired: true };
      }

      const result = await apiRequest(path, session, options);

      if (result.refreshedSession) {
        await signIn(result.refreshedSession);
      }
      if (!result.ok && result.authExpired) {
        await signOut();
      }

      return result;
    },
    [session, signIn, signOut]
  );
}
