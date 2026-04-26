import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ViewsChart from '../../../src/components/analytics/ViewsChart';
import DevicePie from '../../../src/components/analytics/DevicePie';
import ReferrerBar from '../../../src/components/analytics/ReferrerBar';
import RecentVisitors from '../../../src/components/analytics/RecentVisitors';
import LiveCounter from '../../../src/components/analytics/LiveCounter';

export const revalidate = 60; // Cache for 60s

export default async function AnalyticsPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  // 1. Fetch Profile ID associated with the user
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', session.user.id)
    .single();

  if (!profile) return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-neutral-900">Dashboard</h1>
      <p className="mt-4 text-neutral-500 font-medium">Please create a profile first to see analytics.</p>
    </div>
  );

  // 2. Fetch Last 30 Days from profile_view_daily (Efficient rollup)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: dailyStats } = await supabase
    .from('profile_view_daily')
    .select('*')
    .eq('profile_id', profile.id)
    .gte('day', thirtyDaysAgo)
    .order('day', { ascending: true });

  // 3. Fetch Last 50 Events for the recent visitors table
  const { data: recentEvents } = await supabase
    .from('profile_view_events')
    .select('viewed_at, device_type, referrer, country, is_repeat')
    .eq('profile_id', profile.id)
    .order('viewed_at', { ascending: false })
    .limit(50);

  // 4. Compute Summary Metrics
  const totalViews = dailyStats?.reduce((acc, curr) => acc + curr.total_views, 0) || 0;
  const uniqueViews = dailyStats?.reduce((acc, curr) => acc + curr.unique_views, 0) || 0;
  const qrViews = dailyStats?.reduce((acc, curr) => acc + (curr.qr_views || 0), 0) || 0;
  const repeatVisits = recentEvents?.filter(e => e.is_repeat).length || 0;
  const repeatRate = recentEvents?.length ? (repeatVisits / recentEvents.length) * 100 : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-neutral-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              Performance
            </span>
            <LiveCounter profileId={profile.id} />
          </div>
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Analytics</h1>
          <p className="text-neutral-500 font-medium mt-1">Measuring your real-world identity impact.</p>
        </div>
      </div>

      {/* Section A — Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Views', val: totalViews.toLocaleString(), sub: 'Last 30 days' },
          { label: 'Unique Reach', val: uniqueViews.toLocaleString(), sub: 'Unique visitors' },
          { label: 'QR Scan Rate', val: `${((qrViews / totalViews) * 100 || 0).toFixed(1)}%`, sub: 'From physical scans' },
          { label: 'Repeat Score', val: `${repeatRate.toFixed(1)}%`, sub: 'Returning fans' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">{stat.label}</p>
            <p className="text-3xl font-black text-neutral-900 mb-1">{stat.val}</p>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-tight">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Section B — Growth Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-neutral-900">Traffic Over Time</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-1 bg-orange-500 rounded-full"></div>
                 <span className="text-[10px] font-black text-neutral-400 uppercase">Total</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-1 border-t-2 border-dashed border-orange-500"></div>
                 <span className="text-[10px] font-black text-neutral-400 uppercase">Unique</span>
               </div>
            </div>
          </div>
          <ViewsChart data={dailyStats || []} />
        </div>

        {/* Section C — Device Breakdown */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-black text-neutral-900 mb-8">Device Mix</h3>
          <div className="flex-1 flex items-center">
            <DevicePie data={dailyStats || []} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Section D — Referrer Sources */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-black text-neutral-900 mb-8">Top Sources</h3>
          <div className="flex-1">
            <ReferrerBar data={dailyStats || []} />
          </div>
        </div>

        {/* Section E — Recent Activity Table */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden">
          <h3 className="text-lg font-black text-neutral-900 mb-8">Recent Activity</h3>
          <RecentVisitors events={recentEvents || []} />
          <div className="mt-8 pt-6 border-t border-neutral-50 flex items-center justify-between">
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
              Visitor data is anonymised.
            </p>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
              GDPR & CCPA Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
