import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Trophy, Users, Activity, Clock, 
  TrendingUp, TrendingDown, Minus, Share2, 
  X, Copy, Linkedin, Eye
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Trie } from '../lib/leaderboard/trie';

interface Profile {
  rank: number;
  knowmi_score: number;
  percentile: number;
  badge: string | null;
  rank_delta: number;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  profile_category: string;
  updated_at?: string;
}

interface Stats {
  totalProfiles: number;
  avgScore: number;
  lastUpdated: string;
}

const CATEGORIES = ['All', 'Professional', 'Creator', 'Business'];

const deterministicColor = (name: string) => {
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-teal-500', 'bg-orange-500', 'bg-pink-500'];
  let hash = 0;
  const safeName = name || 'User';
  for (let i = 0; i < safeName.length; i++) hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const Avatar = ({ profile, size = "md" }: { profile: Profile; size?: "sm" | "md" | "lg" }) => {
  const dimensions = size === "sm" ? "w-8 h-8 text-[10px]" : size === "md" ? "w-12 h-12 text-lg" : "w-24 h-24 text-4xl";
  
  if (profile.avatar_url) {
    return <img src={profile.avatar_url} alt={profile.display_name} className={`${dimensions} rounded-full object-cover border-2 border-white shadow-sm`} />;
  }

  return (
    <div className={`${dimensions} rounded-full ${deterministicColor(profile.username)} flex items-center justify-center font-black text-white border-2 border-white shadow-sm`}>
      {(profile.display_name || 'U').charAt(0).toUpperCase()}
    </div>
  );
};

const BadgePill = ({ badge }: { badge: string | null }) => {
  if (!badge) return null;
  const styles: Record<string, string> = {
    top1: 'bg-amber-100 text-amber-700 border-amber-200',
    top1pct: 'bg-purple-100 text-purple-700 border-purple-200',
    top10pct: 'bg-teal-100 text-teal-700 border-teal-200',
    top100: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  const labels: Record<string, string> = {
    top1: 'Global #1',
    top1pct: 'Top 1%',
    top10pct: 'Top 10%',
    top100: 'Top 100',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[badge] || styles.top100}`}>
      {labels[badge] || 'Top Member'}
    </span>
  );
};

export default function Leaderboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState<Stats>({ totalProfiles: 0, avgScore: 0, lastUpdated: new Date().toISOString() });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [shareProfile, setShareProfile] = useState<Profile | null>(null);

  useEffect(() => {
    document.title = 'KnoWMi Elite | Global Rankings';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'See where you stand in the KnoWMi global rankings. Scan more, connect better, and climb the Elite leaderboard.');
    
    const timer = setTimeout(() => {
      document.body.classList.add('page-loaded');
    }, 100);
    return () => document.body.classList.remove('page-loaded');
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { data: profilesData } = await supabase.from('public_leaderboard').select('*').limit(100);
      const { count } = await supabase.from('profile_scores').select('*', { count: 'exact', head: true });
      const { data: scoreData } = await supabase.from('profile_scores').select('knowmi_score');

      const avg = scoreData?.length ? scoreData.reduce((acc, curr) => acc + Number(curr.knowmi_score), 0) / scoreData.length : 0;
      
      if (profilesData) setProfiles(profilesData);
      setStats({
        totalProfiles: count || 0,
        avgScore: Math.round(avg * 10) / 10,
        lastUpdated: profilesData?.[0]?.updated_at || new Date().toISOString()
      });
      setLoading(false);
    }
    fetchData();
  }, []);

  const trie = useMemo(() => {
    const t = new Trie();
    profiles.forEach(p => {
      t.insert(p.display_name, p.username);
      t.insert(p.username, p.username);
    });
    return t;
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    let result = profiles;
    if (category !== 'All') result = result.filter(p => p.profile_category?.toLowerCase() === category.toLowerCase());
    if (search) {
      const matches = trie.search(search);
      result = result.filter(p => matches.includes(p.username));
    }
    return result;
  }, [search, category, profiles, trie]);

  const podium = filteredProfiles.filter(p => p.rank <= 3).sort((a, b) => {
    if (a.rank === 1) return 0;
    if (b.rank === 1) return 1;
    return a.rank === 2 ? -1 : 1;
  });

  const tableRows = filteredProfiles.filter(p => p.rank > 3);

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ago`;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-10">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mb-4" />
      <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest animate-pulse">Calculating Global Ranks...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32 font-sans">
      <header className="h-20 bg-white border-b border-neutral-200 flex items-center px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex flex-col">
            <a href="/" className="font-display text-2xl tracking-tight text-[#111111] hover:text-orange-500 transition-colors">KnoWMi <span className="text-neutral-300 font-light text-xl">| Leaderboard</span></a>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] leading-none mt-1">Scan Me. Know Me.</p>
          </div>
          <div className="flex items-center gap-3">
             <a href="/dashboard" className="text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors">← Back to Dashboard</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500"><Users size={24}/></div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Global Profiles</p>
              <p className="text-2xl font-black text-neutral-900">{stats.totalProfiles.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-500"><Activity size={24}/></div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Avg KnoWMi Score</p>
              <p className="text-2xl font-black text-neutral-900">{stats.avgScore}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500"><Clock size={24}/></div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Last Updated</p>
              <p className="text-2xl font-black text-neutral-900">{formatTime(stats.lastUpdated)}</p>
            </div>
          </div>
        </div>

        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight">KnoWMi <span className="text-orange-500">Elite</span></h1>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by name..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-orange-500 shadow-sm transition-all"
              />
            </div>
            <div className="flex bg-white p-1 rounded-2xl border border-neutral-200 shadow-sm">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${category === cat ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-900'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Podium */}
        {podium.length > 0 && (
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-20 px-4">
            {podium.map((p, i) => (
              <div 
                key={p.username}
                style={{ transition: 'all 0.5s ease', transitionDelay: `${i * 100}ms` }}
                className={`relative flex flex-col items-center p-8 rounded-[2.5rem] border bg-white shadow-xl w-full md:w-64 animate-in fade-in slide-in-from-bottom-4 duration-700 ${p.rank === 1 ? 'md:h-96 md:-translate-y-8 border-teal-500 z-10' : 'md:h-80 border-neutral-100'}`}
              >
                <div className="absolute -top-4 bg-white px-4 py-1 rounded-full border border-neutral-100 shadow-sm font-black text-xs">
                  Global Rank #{p.rank}
                </div>
                <Avatar profile={p} size={p.rank === 1 ? "lg" : "md"} />
                <div className="mt-4 text-center">
                  <h3 className="font-black text-neutral-900 line-clamp-1">{p.display_name}</h3>
                  <p className="text-xs font-bold text-neutral-400">@{p.username}</p>
                  <div className="mt-4 inline-flex flex-col items-center">
                    <span className={`text-3xl font-black ${p.rank === 1 ? 'text-teal-600' : 'text-neutral-900'}`}>{p.knowmi_score}</span>
                    <BadgePill badge={p.badge} />
                  </div>
                </div>
                {p.rank === 1 && <Trophy className="absolute bottom-6 right-6 text-teal-500/10" size={64} />}
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm overflow-hidden mb-20">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Rank</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Identity</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Score</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Trend</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {tableRows.map((p) => (
                  <tr 
                    key={p.username}
                    className="group hover:bg-neutral-50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/p/${p.username}`}
                  >
                    <td className="px-8 py-6">
                      <span className="text-lg font-black text-neutral-900">#{p.rank}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <Avatar profile={p} size="sm" />
                        <div>
                          <p className="font-black text-neutral-900 leading-tight">{p.display_name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-400">@{p.username}</span>
                            <BadgePill badge={p.badge} />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="w-32">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-lg font-black text-teal-600 leading-none">{p.knowmi_score}</span>
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Top {100 - p.percentile}%</span>
                        </div>
                        <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${(p.knowmi_score / 1000) * 100}%`, transition: 'width 1s ease' }}
                            className="h-full bg-teal-500"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-1 font-black text-xs ${p.rank_delta > 0 ? 'text-emerald-500' : p.rank_delta < 0 ? 'text-rose-500' : 'text-neutral-400'}`}>
                        {p.rank_delta > 0 ? <TrendingUp size={14}/> : p.rank_delta < 0 ? <TrendingDown size={14}/> : <Minus size={14}/>}
                        {p.rank_delta !== 0 && Math.abs(p.rank_delta)}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShareProfile(p);
                          }}
                          className="p-2 text-neutral-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                        >
                          <Share2 size={18}/>
                        </button>
                        <a href={`/p/${p.username}`} className="p-2 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                          <Eye size={18}/>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Share Modal */}
        {shareProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-neutral-100 flex justify-between items-center">
                <h2 className="text-xl font-black text-neutral-900">Share Achievement</h2>
                <button onClick={() => setShareProfile(null)} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-400 transition-colors"><X size={20}/></button>
              </div>
              
              <div className="p-8">
                <div className="aspect-[1.91/1] bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-8 text-white relative overflow-hidden mb-8">
                  <div className="relative z-10">
                    <h1 className="font-display text-2xl tracking-tight mb-2">KnoWMi</h1>
                    <div className="mt-8">
                      <p className="text-4xl font-black mb-1">Ranked #{shareProfile.rank}</p>
                      <p className="text-lg text-neutral-400">on the global leaderboard</p>
                    </div>
                    <div className="mt-8 flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Score</p>
                        <p className="text-2xl font-black text-teal-400">{shareProfile.knowmi_score}</p>
                      </div>
                      <div className="h-8 w-px bg-neutral-700" />
                      <div>
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Profile</p>
                        <p className="font-bold">@{shareProfile.username}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-6 right-8 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">knowmi.in/leaderboard</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://knowmi.in/p/${shareProfile.username}?ref=leaderboard`);
                      alert('Link copied!');
                    }}
                    className="flex items-center justify-center gap-2 py-4 bg-neutral-100 hover:bg-neutral-200 rounded-2xl font-bold text-neutral-900 transition-all"
                  >
                    <Copy size={18}/> Copy Link
                  </button>
                  <button className="flex items-center justify-center gap-2 py-4 bg-[#0A66C2] hover:bg-[#004182] rounded-2xl font-bold text-white transition-all">
                    <Linkedin size={18}/> LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
