import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Share2,
  ShieldCheck,
  ChevronRight,
  User,
  X,
  Check,
  Download,
  GraduationCap,
  Dumbbell,
  Gamepad2,
  Star,
  Palette,
  Terminal,
  Music,
  Trophy,
  Users,
  QrCode,
  Sparkles,
  Copy
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProfileViewTracker from '../components/analytics/ProfileViewTracker'

const PERSONA_THEMES = {
  gamer: {
    name: 'Gamer',
    class: 'theme-gamer',
    colors: { primary: '#60A5FA', secondary: '#A78BFA', soft: '#DBEAFE', bg: '#0A0A0F' },
    icon: Gamepad2,
    mood: 'Competitive & Chill',
    leftLabel: 'Arena Rank',
    rightLabel: 'Squad Size',
    deco: ['⭐', '🎮', '🎵']
  },
  student: {
    name: 'Student',
    class: 'theme-student',
    colors: { primary: '#3B82F6', secondary: '#EC4899', soft: '#DBEAFE', bg: '#F8FAFC' },
    icon: GraduationCap,
    mood: 'Studious & Happy',
    leftLabel: 'Campus Rank',
    rightLabel: 'Study Buddies',
    deco: ['⭐', '📚', '✏️']
  },
  developer: {
    name: 'Developer',
    class: 'theme-developer',
    colors: { primary: '#22C55E', secondary: '#06B6D4', soft: '#DCFCE7', bg: '#070B14' },
    icon: Terminal,
    mood: 'Building & Shipping',
    leftLabel: 'Build Streak',
    rightLabel: 'Collabs',
    deco: ['💻', '⚡', '🧠']
  },
  influencer: {
    name: 'Influencer',
    class: 'theme-influencer',
    colors: { primary: '#F472B6', secondary: '#A78BFA', soft: '#FCE7F3', bg: '#FFF7FC' },
    icon: Star,
    mood: 'Creative & Social',
    leftLabel: 'Reach Rank',
    rightLabel: 'Fans Met',
    deco: ['✨', '🎤', '📸']
  },
  fitness: {
    name: 'Fitness',
    class: 'theme-fitness',
    colors: { primary: '#FB923C', secondary: '#F43F5E', soft: '#FFEDD5', bg: '#111111' },
    icon: Dumbbell,
    mood: 'Focused & Energetic',
    leftLabel: 'Fitness Rank',
    rightLabel: 'Workout Pals',
    deco: ['🔥', '🏋️', '💪']
  },
  creator: {
    name: 'Creator',
    class: 'theme-creator',
    colors: { primary: '#8B5CF6', secondary: '#22D3EE', soft: '#EDE9FE', bg: '#18181B' },
    icon: Palette,
    mood: 'Expressive & Curious',
    leftLabel: 'Creator Rank',
    rightLabel: 'Community',
    deco: ['🎨', '🪄', '🎵']
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

const randomToken = (size = 18) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  if (window?.crypto?.getRandomValues) {
    const bytes = new Uint8Array(size)
    window.crypto.getRandomValues(bytes)
    return Array.from(bytes, b => chars[b % chars.length]).join('')
  }
  return Array.from({ length: size }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function PublicProfile() {
  const { username } = useParams()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({ network: 0, pulse: 0, collabs: 0 })
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [shareLink, setShareLink] = useState('')

  useEffect(() => {
    if (!profile?.id) return

    async function fetchStats() {
      try {
        const { count: scanCount } = await supabase.from('scans').select('*', { count: 'exact', head: true }).eq('profile_id', profile.id)
        const { data: viewData } = await supabase.from('profile_view_daily').select('total_views').eq('profile_id', profile.id)
        const totalViews = viewData?.reduce((sum, day) => sum + (day.total_views || 0), 0) || 0

        setStats({
          network: scanCount || 0,
          pulse: totalViews || 0,
          collabs: Math.max(Math.ceil((scanCount || 0) / 3), 1)
        })
      } catch (err) {
        console.error('Stats fetch error:', err)
      }
    }

    fetchStats()
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scans', filter: `profile_id=eq.${profile.id}` }, fetchStats)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [profile?.id])

  useEffect(() => {
    async function fetchProfile() {
      try {
        const safeUsername = (username || '').trim()
        if (!safeUsername) {
          setProfile(null)
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`wm_code.ilike.${safeUsername},wm_code.ilike.PT-${safeUsername},wm_code.ilike.WM-${safeUsername},persona_data->>public_slug.eq.${safeUsername.toLowerCase()}`)
          .maybeSingle()

        if (error || !data) {
          setProfile(null)
          setLoading(false)
          return
        }

        const {
          data: { session }
        } = await supabase.auth.getSession()

        if (!data.is_verified && !session) {
          setProfile({ ...data, is_locked_for_anon: true })
          setLoading(false)
          return
        }

        setProfile(data)
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  const personaType = profile?.persona_type || 'creator'
  const theme = PERSONA_THEMES[personaType] || PERSONA_THEMES.creator
  const publicSlug = profile?.persona_data?.public_slug || profile?.wm_code?.replace('PT-', '') || profile?.id

  const secureShareLink = useMemo(() => {
    if (!publicSlug) return ''
    const nonce = randomToken(16)
    return `${window.location.origin}/s/${publicSlug}?share=${nonce}`
  }, [publicSlug, profile?.updated_at])

  useEffect(() => {
    setShareLink(secureShareLink)
  }, [secureShareLink])

  const handleShare = async () => {
    const fresh = `${window.location.origin}/s/${publicSlug}?share=${randomToken(20)}`
    setShareLink(fresh)
    if (navigator.share) {
      await navigator.share({ title: `${profile.first_name}'s KnoWMi`, text: 'Connect with me on KnoWMi', url: fresh })
      return
    }
    await navigator.clipboard.writeText(fresh)
  }

  const qrUrl = shareLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(shareLink)}&color=000000&bgcolor=FFFFFF&margin=2`
    : ''

  if (loading) {
    return <div className="min-h-screen bg-neutral-100 animate-pulse" />
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-red-500/20">
          <X size={48} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Identity Not Found</h1>
        <p className="text-neutral-500 mb-10">The code or username you scanned doesn&apos;t exist yet.</p>
        <button onClick={() => navigate('/')} className="px-8 py-4 rounded-2xl font-black text-sm bg-white text-black">Back Home</button>
      </div>
    )
  }

  if (profile?.is_locked_for_anon) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 bg-orange-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-orange-500/20">
          <ShieldCheck size={48} className="text-orange-500" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Identity Secured</h1>
        <p className="text-neutral-400 max-w-[280px] mb-10">Please sign in to view this verified profile.</p>
        <div className="w-full max-w-[320px] space-y-4">
          <button onClick={() => (window.location.href = '/?auth=signup')} className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black">Sign Up to View</button>
          <button onClick={() => (window.location.href = '/?auth=signin')} className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold">Already a member? Sign In</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme.class} pb-28`}>
      <style>{`
        body { background: ${theme.colors.bg}; }
      `}</style>

      <div className="mx-auto max-w-md px-4 pt-5">
        <div className="rounded-[2rem] border border-black/10 bg-white/90 backdrop-blur-md p-4 shadow-xl relative overflow-hidden">
          <button className="absolute right-4 top-4 rounded-full bg-black/10 p-2"><X size={18} /></button>

          <div className="text-center">
            <p className="font-black text-2xl tracking-tight" style={{ color: theme.colors.primary }}>KnoWMi</p>
            <h1 className="text-4xl font-black mt-2" style={{ color: theme.colors.primary }}>{profile.first_name} {profile.last_name || ''}</h1>
            <p className="font-bold text-lg" style={{ color: theme.colors.secondary }}>{profile.persona_tag || `${theme.name} Persona`}</p>
          </div>

          <div className="mt-3 flex justify-center gap-3 text-2xl">
            {theme.deco.map((d) => <span key={d}>{d}</span>)}
          </div>

          <div className="mt-4 flex justify-center">
            <div className="rounded-full p-1" style={{ border: `6px solid ${theme.colors.primary}` }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.first_name} className="h-36 w-36 rounded-full object-cover" />
              ) : (
                <div className="h-36 w-36 rounded-full bg-neutral-200 grid place-items-center"><User size={56} /></div>
              )}
            </div>
          </div>

          <p className="text-center mt-4 text-xl"><span className="font-black">Mood:</span> {theme.mood}</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[1.8rem] p-4 text-center border-2 shadow" style={{ background: theme.colors.soft }}>
              <p className="font-semibold text-lg">{theme.leftLabel}</p>
              <p className="font-black text-5xl leading-tight">{Math.max(1, 100 - Math.min(stats.pulse || 0, 95))}%</p>
            </div>
            <div className="rounded-[1.8rem] p-4 text-center border-2 shadow" style={{ background: '#D1FAE5' }}>
              <p className="font-semibold text-lg">{theme.rightLabel}</p>
              <p className="font-black text-5xl leading-tight">{Math.max(stats.network, 1)}</p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border-2 border-black/20 bg-amber-50 p-4">
            <div className="flex gap-4 items-center">
              <div className="bg-white p-2 rounded-xl border">
                {qrUrl ? <img src={qrUrl} alt="Profile QR" className="h-28 w-28" /> : <QrCode className="h-28 w-28" />}
              </div>
              <div>
                <p className="text-3xl font-black leading-tight">Scan for my</p>
                <p className="text-4xl font-black" style={{ color: theme.colors.primary }}>Profile</p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-black text-2xl text-center mb-2">Recent Visitors</p>
            <div className="flex justify-center -space-x-2">
              {[Users, Trophy, Music, Sparkles].map((Icon, i) => (
                <div key={i} className="h-12 w-12 rounded-full border-2 border-black bg-white grid place-items-center">
                  <Icon size={20} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setConnecting(true)
                setTimeout(() => {
                  setConnecting(false)
                  setIsConnected(true)
                }, 700)
              }}
              className="h-14 rounded-full bg-orange-400 text-white font-black text-2xl"
            >
              {connecting ? '...' : isConnected ? 'Connected' : 'Add to Group'}
            </button>
            <button onClick={handleShare} className="h-14 rounded-full bg-violet-500 text-white font-black text-2xl">Share Profile</button>
          </div>

          <div className="mt-3 rounded-xl bg-black/5 p-2 text-xs font-mono break-all flex items-center gap-2">
            <Copy size={13} /> {shareLink}
          </div>

          <div className="mt-5 space-y-2">
            {Object.keys(FIELD_META).filter((f) => profile?.[f]).map((f) => {
              const rawValue = String(profile[f]).trim()
              const meta = FIELD_META[f]
              const fullLink = rawValue.startsWith('http') ? rawValue : (meta.prefix ? meta.prefix + rawValue : `https://${rawValue}`)
              return (
                <a key={f} href={fullLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl bg-black/5 p-3">
                  <span className="text-xl">{meta.emoji}</span>
                  <span className="font-bold flex-1">{meta.label}</span>
                  <ChevronRight size={18} />
                </a>
              )
            })}
          </div>

          <div className="mt-5 flex gap-2">
            <button className="flex-1 rounded-xl border p-3 font-bold flex items-center justify-center gap-2"><Download size={16} /> Save QR</button>
            <button onClick={handleShare} className="flex-1 rounded-xl border p-3 font-bold flex items-center justify-center gap-2"><Share2 size={16} /> Share Link</button>
          </div>

          <div className="mt-5 text-center text-xs text-black/70">Secure Share ID refreshes each time you tap share.</div>
          <div className="mt-1 text-center text-xs text-black/70">Persona active: {theme.name} <Check className="inline" size={12} /></div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-white/95 py-3">
        <div className="max-w-md mx-auto grid grid-cols-3 text-center text-sm font-semibold text-neutral-500">
          <p>Home</p>
          <p>Search</p>
          <p className="text-violet-500">Profile</p>
        </div>
      </div>

      <ProfileViewTracker profileId={profile.id} />
    </div>
  )
}
