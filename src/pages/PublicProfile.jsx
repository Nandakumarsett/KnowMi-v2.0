import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Instagram, Linkedin, MessageCircle, Globe, 
  MapPin, Share2, ShieldCheck, Zap, ChevronRight,
  ExternalLink, UserPlus, Github, Twitter, Youtube, 
  Mail, Twitch, Trophy, GraduationCap, Dumbbell, 
  Gamepad2, Code2, Rocket, Newspaper, Star, Target, Music, Activity, 
  Link as LinkIcon, User, ArrowRight, X, Grid, Check, Download,
  Cpu, Heart, Camera, Layout, Palette, Terminal, Zap as FastIcon,
  Flame, TrendingUp, MoreHorizontal, QrCode
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProfileViewTracker from '../components/analytics/ProfileViewTracker'

// --- CONSTANTS & DATA ---
const PERSONA_THEMES = {
  gamer: {
    name: 'Gamer',
    class: 'theme-gamer',
    colors: { primary: '#00F2FF', secondary: '#7000FF', bg: '#0A0A0F' },
    icon: Gamepad2
  },
  student: {
    name: 'Student',
    class: 'theme-student',
    colors: { primary: '#FF6B6B', secondary: '#4ECDC4', bg: '#F7F9FC' },
    icon: GraduationCap
  },
  developer: {
    name: 'Developer',
    class: 'theme-developer',
    colors: { primary: '#10B981', secondary: '#3B82F6', bg: '#0F172A' },
    icon: Terminal
  },
  influencer: {
    name: 'Influencer',
    class: 'theme-influencer',
    colors: { primary: '#F472B6', secondary: '#8B5CF6', bg: '#FFFFFF' },
    icon: Star
  },
  fitness: {
    name: 'Fitness',
    class: 'theme-fitness',
    colors: { primary: '#F97316', secondary: '#EF4444', bg: '#000000' },
    icon: Dumbbell
  },
  creator: {
    name: 'Creator',
    class: 'theme-creator',
    colors: { primary: '#8B5CF6', secondary: '#EC4899', bg: '#18181B' },
    icon: Palette
  }
}

const FIELD_META = {
  instagram_url: { label: 'Instagram', emoji: '📸', prefix: 'https://instagram.com/' },
  linkedin_url: { label: 'LinkedIn', emoji: '💼', prefix: 'https://linkedin.com/in/' },
  github_url: { label: 'GitHub', emoji: '💻', prefix: 'https://github.com/' },
  twitter_url: { label: 'Twitter', emoji: '🐦', prefix: 'https://twitter.com/' },
  website_url: { label: 'Website', emoji: '🔗' },
  whatsapp_number: { label: 'WhatsApp', emoji: '💬', prefix: 'https://wa.me/' },
  youtube_url: { label: 'YouTube', emoji: '📺' },
  twitch_url: { label: 'Twitch', emoji: '🎮' }
}

// --- COMPONENTS ---

const AnimatedCounter = ({ value, label, trend }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let start = 0
    const end = parseInt(value)
    if (start === end) return
    
    let duration = 1500
    let startTime = null
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * (end - start) + start))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value])

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black tracking-tighter">{count}</span>
        {trend && <span className="text-[10px] font-bold text-emerald-500">+{trend}</span>}
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 mt-1">{label}</span>
    </div>
  )
}

const ActivityStrip = ({ items }) => {
  return (
    <div className="flex items-center gap-2 py-3 px-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10 w-full overflow-hidden">
      <div className="flex -space-x-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-6 h-6 rounded-full border-2 border-[#1A0F0A] bg-neutral-800 flex items-center justify-center overflow-hidden">
            <User size={12} className="text-neutral-500" />
          </div>
        ))}
      </div>
      <p className="text-[10px] font-bold text-neutral-400 whitespace-nowrap animate-marquee">
        Recently scanned by someone from <span className="text-white">Bengaluru</span> • <span className="text-white">Mumbai</span> • <span className="text-white">Chennai</span>
      </p>
    </div>
  )
}

const QRCard = ({ profile, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const publicSlug = profile.persona_data?.public_slug || profile.wm_code?.replace('PT-', '') || profile.id;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${window.location.origin}/s/${publicSlug}`)}&color=000000&bgcolor=FFFFFF&margin=2`;
  
  return (
    <>
      <div 
        onClick={() => setIsExpanded(true)}
        className="relative group cursor-pointer"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative glass-card p-6 rounded-[2.2rem] border border-white/10 flex flex-col items-center">
          <div className="bg-white p-4 rounded-3xl shadow-2xl mb-4">
            <img 
              src={qrUrl}
              alt="Profile QR Code"
              className="w-[120px] h-[120px]"
              fetchpriority="high"
            />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">Scan to Connect</h3>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">Instant Identity Exchange</p>
          </div>
          
          <div className="flex gap-2 mt-6 w-full">
            <button className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
              <Download size={14} /> Download
            </button>
            <button className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 animate-in fade-in zoom-in duration-300">
          <div className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 flex flex-col items-center">
            <button 
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400"
            >
              <X size={20} />
            </button>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-display font-black text-neutral-900 mb-2">Your Identity Pass</h2>
              <p className="text-sm text-neutral-500 font-medium">Let others scan this to connect with you instantly.</p>
            </div>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-neutral-100 mb-10">
              <img 
                src={qrUrl.replace('300x300', '600x600')}
                alt="Profile QR Code Large"
                className="w-[220px] h-[220px]"
                fetchpriority="high"
              />
            </div>
            <div className="w-full space-y-3">
              <button className="w-full py-5 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3">
                <Download size={18} /> Save to Photos
              </button>
              <div className="flex items-center justify-center gap-2 py-3 px-4 bg-orange-50 text-orange-600 rounded-xl">
                <FastIcon size={14} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-widest">NFC Ready • Wave to Scan</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function PublicProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({ network: 0, pulse: 0, collabs: 0 })
  const [loading, setLoading] = useState(true)
  const [extractedColor, setExtractedColor] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [livePulse, setLivePulse] = useState(true)

  // Fetch real analytics stats
  useEffect(() => {
    if (!profile?.id) return;

    async function fetchStats() {
      try {
        // 1. Get total scans
        const { count: scanCount } = await supabase
          .from('scans')
          .select('*', { count: 'exact', head: true })
          .eq('profile_id', profile.id);

        // 2. Get total views from profile_view_daily
        const { data: viewData } = await supabase
          .from('profile_view_daily')
          .select('total_views')
          .eq('profile_id', profile.id);
        
        const totalViews = viewData?.reduce((sum, day) => sum + (day.total_views || 0), 0) || 0;

        setStats({
          network: scanCount || 0,
          pulse: totalViews || 0,
          collabs: 12 // Keep as mock or fetch from another table if available
        });
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    }

    fetchStats();
    
    // Subscribe to real-time updates for scans
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scans', filter: `profile_id=eq.${profile.id}` }, () => {
        fetchStats();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [profile?.id])

  // Current persona type (default to creator for brand feel)
  const personaType = profile?.persona_type || 'creator'
  const theme = PERSONA_THEMES[personaType]

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`wm_code.ilike.${username},wm_code.ilike.PT-${username},wm_code.ilike.WM-${username},first_name.ilike.${username},persona_data->>public_slug.eq.${username.toLowerCase()}`)
          .single()

        if (error || !data) {
          console.error("Profile not found:", error)
          setProfile(null)
          setLoading(false)
          return
        }

        // Check verification status and authentication
        const { data: { session } } = await supabase.auth.getSession();
        const isLoggedIn = !!session;

        if (!data.is_verified && !isLoggedIn) {
          setProfile({ ...data, is_locked_for_anon: true });
          setLoading(false);
          return;
        }

        setProfile(data);
      } catch (err) {
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [username])

  // Extract color from avatar for dynamic theme integration
  useEffect(() => {
    if (profile?.avatar_url) {
      const img = new Image()
      img.crossOrigin = "Anonymous"
      img.src = profile.avatar_url
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = 1; canvas.height = 1
        ctx.drawImage(img, 0, 0, 1, 1)
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
        setExtractedColor(`rgba(${r},${g},${b},0.4)`)
      }
    }
  }, [profile?.avatar_url])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] p-6 flex flex-col items-center">
        {/* Skeleton Hero */}
        <div className="w-36 h-36 rounded-[2.5rem] bg-white/5 animate-pulse mb-8 mt-16"></div>
        <div className="w-48 h-8 bg-white/5 rounded-xl animate-pulse mb-3"></div>
        <div className="w-32 h-4 bg-white/5 rounded-lg animate-pulse mb-10"></div>
        
        {/* Skeleton Stats */}
        <div className="w-full max-w-xs grid grid-cols-3 gap-4 mb-10 py-6 border-y border-white/5">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-12 h-8 bg-white/5 rounded-lg animate-pulse"></div>
              <div className="w-10 h-2 bg-white/5 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Skeleton QR */}
        <div className="w-full max-w-xs h-64 bg-white/5 rounded-[2.5rem] animate-pulse mb-12"></div>

        {/* Skeleton Links */}
        <div className="w-full space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-full h-20 bg-white/5 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-red-500/20">
          <X size={48} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-display font-black text-white mb-2">Identity Not Found</h1>
        <p className="text-neutral-500 mb-10">The code or username you scanned doesn't exist yet.</p>
        <button onClick={() => navigate('/')} className="btn-primary px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest">Back Home</button>
      </div>
    )
  }

  if (profile?.is_locked_for_anon) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-orange-500/10 to-transparent"></div>
        <div className="w-24 h-24 bg-orange-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-orange-500/20 shadow-2xl shadow-orange-500/10 relative z-10">
          <ShieldCheck size={48} className="text-orange-500" />
        </div>
        <h1 className="text-4xl font-display font-black text-white mb-4 tracking-tight relative z-10">Identity <span className="text-orange-500">Secured</span></h1>
        <p className="text-neutral-400 max-w-[280px] mb-10 font-medium leading-relaxed relative z-10">
          This is a verified KnoWMi identity. To prevent unauthorized scans, the owner has secured this profile.
        </p>
        <div className="w-full max-w-[320px] space-y-4 relative z-10">
          <button 
            onClick={() => window.location.href = '/?auth=signup'}
            className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
          >
            Sign Up to View ↗
          </button>
          <button 
            onClick={() => window.location.href = '/?auth=signin'}
            className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/10 transition-all"
          >
            Already a member? Sign In
          </button>
        </div>
        <p className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600 relative z-10">
          One Tee. One Scan. Infinite Connections.
        </p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme.class} selection:bg-orange-500/30`}>
      <style>{`
        body { background: ${theme.colors.bg}; }
        .font-display { font-family: 'Fraunces', serif; }
        .glass-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .animate-marquee { animation: marquee 30s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes scan-glow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
        .theme-gamer { --accent: #00F2FF; --accent-glow: rgba(0,242,255,0.3); }
        .theme-creator { --accent: #8B5CF6; --accent-glow: rgba(139,92,246,0.3); }
        .theme-fitness { --accent: #F97316; --accent-glow: rgba(249,115,22,0.3); }
      `}</style>

      {/* Hero Section */}
      <div className="relative pt-16 pb-12 px-6 flex flex-col items-center">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-500/10 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Profile Image with Glow */}
        <div className="relative mb-8">
          <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative w-36 h-36 rounded-[2.5rem] p-1.5 bg-gradient-to-br from-orange-500 to-amber-500 shadow-2xl overflow-hidden">
            <div className="w-full h-full rounded-[2.2rem] bg-neutral-900 overflow-hidden relative">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} className="w-full h-full object-cover" alt={profile.first_name} fetchpriority="high" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-500">
                  <User size={64} />
                </div>
              )}
            </div>
            {/* Live Pulse Indicator */}
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-neutral-100">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Name & Title */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-4xl font-display font-black tracking-tight text-white">{profile.first_name}</h1>
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Check size={14} strokeWidth={4} />
            </div>
          </div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-4">{profile.persona_tag || profile.role || 'Verified Member'}</p>
          <p className="text-sm font-medium text-neutral-400 max-w-[280px] leading-relaxed mx-auto">
            {profile.bio || "Exploring the boundaries of digital and physical identity with KnoWMi." }
          </p>
        </div>

        {/* Animated Counters Section */}
        <div className="w-full max-w-xs grid grid-cols-3 gap-4 mb-10 py-6 border-y border-white/5">
          <AnimatedCounter value={stats.network} label="Network" trend="5" />
          <AnimatedCounter value={stats.pulse} label="Pulse" trend="12" />
          <AnimatedCounter value={stats.collabs} label="Collabs" />
        </div>

        {/* Activity Strip */}
        <ActivityStrip />
      </div>

      {/* Main Content Area */}
      <div className="px-6 pb-32 space-y-12">
        
        {/* QR Centerpiece */}
        <div className="pt-4">
          <QRCard profile={profile} theme={theme} />
        </div>

        {/* Profile Strength Meter */}
        <div className="glass-card p-6 rounded-3xl border border-white/10">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Identity Strength</h3>
             <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">92% Solid</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
             <div className="w-[92%] h-full bg-gradient-to-r from-orange-600 to-amber-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-5 h-5 bg-orange-500/20 rounded flex items-center justify-center">
              <Flame size={12} className="text-orange-500" />
            </div>
            <p className="text-[10px] font-bold text-neutral-400">7 Day Connection Streak! Keep scanning.</p>
          </div>
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Digital Ecosystem</h3>
             <div className="h-[1px] flex-1 bg-white/5 ml-4"></div>
          </div>
          
          <div className="grid gap-3">
            {Object.keys(FIELD_META).filter(f => profile?.[f]).map(f => {
              const rawValue = String(profile[f]).trim();
              const meta = FIELD_META[f] || {};
              let fullLink = rawValue.startsWith('http') ? rawValue : (meta.prefix ? meta.prefix + rawValue : `https://${rawValue}`);
              
              return (
                <a key={f} href={fullLink} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-4 p-5 glass-card rounded-2xl border border-white/5 hover:border-white/20 transition-all group">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {meta.emoji || '🔗'}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-0.5">{meta.label || f}</p>
                    <p className="text-sm font-bold text-white/90">{rawValue}</p>
                  </div>
                  <ChevronRight size={18} className="text-neutral-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Discovery Block */}
        <div className="pt-8">
           <div className="text-center mb-6">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">People also scanned</h3>
           </div>
           <div className="flex justify-center gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/5 p-1">
                    <div className="w-full h-full rounded-xl bg-neutral-800"></div>
                  </div>
                  <div className="w-10 h-2 bg-white/5 rounded-full"></div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-[100] bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="max-w-md mx-auto flex gap-3">
          <button 
            onClick={() => { setConnecting(true); setTimeout(() => { setConnecting(false); setIsConnected(true) }, 1000) }}
            className={`flex-[2] h-16 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all
                       ${isConnected ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-white text-black shadow-2xl'}`}
          >
            {connecting ? <Loader2 className="animate-spin" size={20} /> : isConnected ? <><Check size={20} strokeWidth={3}/> Connected</> : <><UserPlus size={20} strokeWidth={3}/> Connect</>}
          </button>
          <button className="flex-1 h-16 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center active:scale-95 transition-all">
            <Share2 size={24} />
          </button>
        </div>
      </div>

      <ProfileViewTracker profileId={profile.id} />
    </div>
  )
}

const Loader2 = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
)
