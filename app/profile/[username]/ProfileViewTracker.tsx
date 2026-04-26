'use client';

import { useEffect } from 'react';
import { buildFingerprint } from '../../../src/lib/analytics/fingerprint';
import { categoriseReferrer } from '../../../src/lib/analytics/referrer';

export default function ProfileViewTracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    const track = async () => {
      try {
        const fp = await buildFingerprint();
        const referrer = categoriseReferrer(document.referrer);

        // Fire-and-forget: we don't await the tracking result
        fetch('/api/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            profileId, 
            referrer, 
            fp 
          }),
          keepalive: true,
        }).catch(err => console.error('Tracking fetch failed:', err));
      } catch (err) {
        console.error('Tracking setup failed:', err);
      }
    };

    track();
  }, [profileId]);

  return null; // Silent component
}
