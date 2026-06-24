import { useEffect, useState } from 'react';

export type CurrentUser = {
  email: string;
  displayName: string;
  firstName: string;
  initials: string;
};

/**
 * Fetches the signed-in Databricks user from /api/me (resolved server-side from
 * the X-Forwarded-* headers). Returns null until loaded / if unavailable.
 */
export function useCurrentUser(): CurrentUser | null {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: CurrentUser | null) => {
        if (!cancelled && data) setUser(data);
      })
      .catch(() => {
        /* leave as null — UI falls back gracefully */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return user;
}
