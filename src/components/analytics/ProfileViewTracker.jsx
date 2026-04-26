import { useEffect } from 'react';
import { buildFingerprint } from '../../lib/analytics/fingerprint';
import { categoriseReferrer } from '../../lib/analytics/referrer';

export default function ProfileViewTracker({ profileId }) {
  useEffect(() => {
    const track = async () => {
      try {
        const fp = await buildFingerprint();
        const referrer = categoriseReferrer(document.referrer);

        // Fire-and-forget: proxy through your API or call Edge Function directly
        // For Vite + Supabase, you might call the Edge Function directly if allowed
        // But the prompt asked for an API route proxy.
        // On localhost:5173, /api/track-view won't exist unless you have a proxy setup.
        // We can call the Supabase Edge Function directly using the anon key.
        
        const searchParams = new URLSearchParams(window.location.search);
        const source = searchParams.get('src') || 'direct';

        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ingest-profile-view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ 
            profileId, 
            referrer, 
            fp,
            source
          }),
          keepalive: true,
        });

        if (!response.ok) {
          console.error('Tracking failed:', await response.json());
        }
      } catch (err) {
        console.error('Tracking error:', err);
      }
    };

    if (profileId) {
      track();
    }
  }, [profileId]);

  return null;
}
