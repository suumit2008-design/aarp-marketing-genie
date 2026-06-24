import { createApp, genie, server } from '@databricks/appkit';

/**
 * Derive a friendly identity from the X-Forwarded-* headers that Databricks
 * Apps injects for the signed-in user. These headers are only present when the
 * app runs inside Databricks Apps; locally they're absent, so we fall back to
 * an optional DEV_USER_EMAIL env var (or return empty fields).
 */
function deriveIdentity(headers: Record<string, string | string[] | undefined>) {
  const get = (k: string) => {
    const v = headers[k];
    return (Array.isArray(v) ? v[0] : v) || '';
  };

  const email = get('x-forwarded-email') || process.env.DEV_USER_EMAIL || '';
  const preferred = get('x-forwarded-preferred-username');
  const rawUser = get('x-forwarded-user');

  // Pick the most human-looking source for a name.
  let base = '';
  if (preferred && !preferred.includes('@') && /[a-z]/i.test(preferred)) base = preferred;
  else if (email) base = email.split('@')[0];
  else if (preferred) base = preferred.split('@')[0];
  else if (rawUser && /[a-z]/i.test(rawUser)) base = rawUser;

  const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  const parts = base.split(/[._\-\s]+/).filter(Boolean);
  const displayName = parts.map(cap).join(' ');
  const firstName = parts.length ? cap(parts[0]) : '';
  const initials = (
    parts.length >= 2 ? parts[0][0] + parts[1][0] : base.slice(0, 2)
  ).toUpperCase();

  return { email, displayName, firstName, initials };
}

createApp({
  plugins: [genie(), server()],
  // Register custom routes before the server starts listening.
  onPluginsReady: (appkit) => {
    appkit.server.extend((app) => {
      // Returns the currently signed-in Databricks user for the client UI.
      app.get('/api/me', (req, res) => {
        res.set('Cache-Control', 'no-store');
        res.json(deriveIdentity(req.headers));
      });
    });
  },
}).catch(console.error);
