import { useState, useEffect, useMemo, useRef } from 'react'
import Avatar from '../components/Avatar'
import { useNavigate } from 'react-router-dom'
import { 
  Zap, LayoutDashboard, Signal, Globe, User, Save, Check, Plus, X,
  Instagram, Linkedin, MessageCircle, Github, Twitter, Youtube, 
  Mail, Twitch, Trophy, GraduationCap, Dumbbell, Gamepad2, 
  Code2, Rocket, Newspaper, Star, Target, Activity, Link2, Bell, 
  Settings, Eye, Sparkles, TrendingUp, TrendingDown, Users, 
  ArrowUpRight, ChevronRight, Clock, MapPin, Smartphone, BarChart3,
  Flame, Share2, Download, Award, Palette, GripVertical, Trash2,
  Upload, Loader2, Camera, Paintbrush, ArrowRight, CheckCircle2,
  Edit3, ChevronLeft, Lock, Crown, QrCode, ShoppingBag, UserPlus, ShieldCheck
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import ViewsChart from '../components/analytics/ViewsChart'
import DevicePie from '../components/analytics/DevicePie'
import SourceDonut from '../components/analytics/SourceDonut'
import ReferrerBar from '../components/analytics/ReferrerBar'
import RecentVisitors from '../components/analytics/RecentVisitors'
import LiveCounter from '../components/analytics/LiveCounter'

// ============ PREMIUM DESIGN SYSTEM ============
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
  
  :root {
    --sf: #F97316;
    --sf-dark: #2A2A2A;
    --sf-light: #EAEAEA;
    --brand-black: #111111;
    --sf-glow: rgba(224, 123, 26, 0.15);
    --gold: #FFB347;
    --emerald: #10B981;
    --emerald-light: #ECFDF5;
    --ruby: #EF4444;
    --ruby-light: #FEF2F2;
    --sapphire: #3B82F6;
    --sapphire-light: #EFF6FF;
    --violet: #8B5CF6;
    --violet-light: #F5F3FF;
    --pink: #EC4899;
    --pink-light: #FDF2F8;
  }

  body { background: #FAFAF9; color: #111111; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  .font-display { font-family: 'Montserrat', sans-serif; font-weight: 800; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }

  .glass { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
  .card { background: white; border: 1px solid #E7E5E4; border-radius: 24px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  .card:hover { border-color: #D6D3D1; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); transform: translateY(-2px); }

  .btn-primary { background: var(--sf); color: white; border-radius: 16px; font-weight: 700; transition: all 0.3s ease; }
  .btn-primary:hover { background: var(--sf-dark); box-shadow: 0 10px 20px var(--sf-glow); transform: translateY(-1px); }

  .premium-input { width: 100%; padding: 14px 18px; background: #F5F5F4; border: 1px solid #E7E5E4; border-radius: 16px; font-size: 14px; font-weight: 500; transition: all 0.2s; outline: none; }
  .premium-input:focus { background: white; border-color: var(--sf); box-shadow: 0 0 0 4px var(--sf-glow); }

  .live-dot { width: 8px; height: 8px; background: var(--emerald); border-radius: 50%; position: relative; animation: pulse 2s infinite; }
  @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }

  .step-dot { transition: all 0.4s ease; border: 2px solid transparent; }
  .step-dot.active { border-color: var(--sf); background: var(--sf-light); color: var(--sf); transform: scale(1.1); }
  .step-dot.completed { background: #ECFDF5; color: #10B981; }

  .persona-card { cursor: pointer; border-radius: 28px; padding: 24px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); border: 2px solid transparent; }
  .persona-card.active { border-color: white; outline: 3px solid var(--sf); transform: scale(1.02); box-shadow: 0 30px 60px -10px rgba(0,0,0,0.1); }

  .toast { position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); background: #1C1917; color: white; padding: 12px 24px; border-radius: 20px; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 8px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); animation: slideUp 0.4s ease-out; z-index: 1000; }
  @keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }

  .animate-float-preview { animation: floatPreview 6s ease-in-out infinite; }
  @keyframes floatPreview { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

  .gradient-text { background: linear-gradient(135deg, var(--sf), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

  .qr-mask {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(224, 123, 26, 0.9), rgba(245, 158, 11, 0.8));
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 24px;
    z-index: 10;
  }

  .premium-shimmer {
    position: relative;
    overflow: hidden;
  }
  .premium-shimmer::after {
    content: "";
    position: absolute;
    top: -150%;
    left: -150%;
    width: 300%;
    height: 300%;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(255, 255, 255, 0) 45%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 55%,
      transparent 100%
    );
    animation: shimmer 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
    transform: rotate(25deg);
    pointer-events: none;
  }
  @keyframes shimmer {
    0% { transform: translate(-30%, -30%) rotate(25deg); }
    100% { transform: translate(30%, 30%) rotate(25deg); }
  }

  .tab-transition {
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .tab-hidden {
    opacity: 0;
    transform: scale(0.98) translateY(15px);
    filter: blur(8px);
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .tab-visible {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
`

const PERSONAS = {
  dev: {
    id: 'dev', label: 'Developer', emoji: '💻', icon: Code2, bg: 'linear-gradient(180deg, #0A1628 0%, #0F1E38 100%)',
    accent: '#3B9EFF', accentLight: 'rgba(59, 158, 255, 0.15)', cardBg: 'rgba(59, 158, 255, 0.08)',
    textPrimary: '#FFFFFF', textSecondary: '#6B9CD1', tagBg: 'rgba(59, 158, 255, 0.12)',
    buttonBg: 'linear-gradient(135deg, #3B9EFF, #5FB4FF)',
    fields: ['github', 'linkedin', 'blog', 'twitter', 'instagram'], stats: ['Built Projects', 'GitHub Stars']
  },
  influencer: {
    id: 'influencer', label: 'Creator', emoji: '📸', icon: Rocket, bg: 'linear-gradient(180deg, #2A1810 0%, #3A2418 100%)',
    accent: '#F59E0B', accentLight: 'rgba(245, 158, 11, 0.15)', cardBg: 'rgba(245, 158, 11, 0.08)',
    textPrimary: '#FFFFFF', textSecondary: '#D4A574', tagBg: 'rgba(245, 158, 11, 0.12)',
    buttonBg: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    fields: ['instagram', 'tiktok', 'youtube', 'email'], stats: ['Followers', 'Collabs']
  },
  gamer: {
    id: 'gamer', label: 'Gamer', emoji: '🎮', icon: Gamepad2, bg: 'linear-gradient(180deg, #1A0B2E 0%, #241240 100%)',
    accent: '#A855F7', accentLight: 'rgba(168, 85, 247, 0.15)', cardBg: 'rgba(168, 85, 247, 0.1)',
    textPrimary: '#FFFFFF', textSecondary: '#B794D6', tagBg: 'rgba(168, 85, 247, 0.12)',
    buttonBg: 'linear-gradient(135deg, #A855F7, #C084FC)',
    fields: ['twitch', 'discord', 'steam', 'youtube', 'instagram'], stats: ['League Rank', 'Followers']
  },
  student: {
    id: 'student', label: 'Student', emoji: '🎓', icon: GraduationCap, bg: 'linear-gradient(180deg, #0F1225 0%, #1A1E3A 100%)',
    accent: '#818CF8', accentLight: 'rgba(129, 140, 248, 0.15)', cardBg: 'rgba(129, 140, 248, 0.1)',
    textPrimary: '#FFFFFF', textSecondary: '#A5B4FC', tagBg: 'rgba(129, 140, 248, 0.12)',
    buttonBg: 'linear-gradient(135deg, #818CF8, #A78BFA)',
    fields: ['linkedin', 'github', 'resume', 'notion', 'instagram'], stats: ['CGPA', 'University']
  },
  gym: {
    id: 'gym', label: 'Athlete', emoji: '💪', icon: Dumbbell, bg: 'linear-gradient(180deg, #2A0A0A 0%, #3A1414 100%)',
    accent: '#EF4444', accentLight: 'rgba(239, 68, 68, 0.15)', cardBg: 'rgba(239, 68, 68, 0.08)',
    textPrimary: '#FFFFFF', textSecondary: '#FCA5A5', tagBg: 'rgba(239, 68, 68, 0.12)',
    buttonBg: 'linear-gradient(135deg, #EF4444, #F87171)',
    fields: ['strava', 'instagram', 'youtube', 'coaching'], stats: ['Max PR', 'Gym Name']
  }
}

const VerificationLock = ({ profile, user }) => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
    <div className="card p-10 max-w-md w-full glass shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, var(--sf), var(--gold))' }} />
      <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
        <Lock size={40} strokeWidth={1.5} />
      </div>
      <h2 className="text-3xl font-display font-black text-neutral-900 mb-4 leading-tight">Identity <span className="text-orange-500 italic">Pending</span></h2>
      <p className="text-sm text-neutral-500 mb-10 leading-relaxed font-medium">
        Welcome to KnoWMi, <span className="font-bold text-neutral-800">{profile?.first_name}</span>! Your Analytics Pulse and Phygital Profile are currently locked while we verify your account.
      </p>
      <div className="space-y-4">
        <a
          href={`https://wa.me/917981325397?text=${encodeURIComponent(`Hi KnoWMi! I'm ${profile?.first_name}. I've signed up and would like to verify my account.\nEmail: ${user?.email}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full btn-primary py-4 flex items-center justify-center gap-3 shadow-xl"
        >
          <MessageCircle size={20} className="fill-white/20" />
          Verify via WhatsApp
        </a>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
          Verification typically takes 5-10 minutes.
        </p>
      </div>
    </div>
    <div className="mt-12 flex items-center gap-6 opacity-30 grayscale pointer-events-none">
       <BarChart3 size={32} />
       <Users size={32} />
       <Trophy size={32} />
       <MapPin size={32} />
    </div>
  </div>
)

const FIELD_META = {
  github:    { emoji: '🐙', label: 'GitHub', prefix: 'github.com/' },
  linkedin:  { emoji: '💼', label: 'LinkedIn', prefix: 'linkedin.com/in/' },
  twitter:   { emoji: '🐦', label: 'Twitter', prefix: 'twitter.com/' },
  instagram: { emoji: '📸', label: 'Instagram', prefix: 'instagram.com/' },
  youtube:   { emoji: '📺', label: 'YouTube', prefix: 'youtube.com/@' },
  tiktok:    { emoji: '🎵', label: 'TikTok', prefix: 'tiktok.com/@' },
  twitch:    { emoji: '🎮', label: 'Twitch', prefix: 'twitch.tv/' },
  discord:   { emoji: '💬', label: 'Discord', prefix: 'discord.gg/' },
  steam:     { emoji: '🎯', label: 'Steam', prefix: 'steamcommunity.com/id/' },
  notion:    { emoji: '📝', label: 'Notion', prefix: 'notion.so/' },
  strava:    { emoji: '🏃', label: 'Strava', prefix: 'strava.com/athletes/' },
  blog:      { emoji: '📄', label: 'Blog', prefix: 'https://' },
  email:     { emoji: '💌', label: 'Email', prefix: '' },
  coaching:  { emoji: '📞', label: 'Coaching', prefix: 'wa.me/' },
  resume:    { emoji: '📋', label: 'Resume', prefix: 'https://' }
}

const StatCard = ({ label, value, color, icon: Icon, delay = 0 }) => (
  <div className="card p-8 animate-slideUp group hover:border-orange-500/30" style={{ animationDelay: `${delay}s` }}>
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 shadow-lg" style={{ background: `${color}15`, color, boxShadow: `0 8px 20px ${color}15` }}>
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">{label}</p>
    <h3 className="text-4xl font-black font-display text-neutral-900 tracking-tight">{value.toLocaleString()}</h3>
  </div>
)
const PersonaEditor = ({ profile, onUpdate }) => {
  // Initialize identities from persona_data or create the first one from profile
  const [identities, setIdentities] = useState(() => {
    const stored = profile?.persona_data?.identities || []
    if (stored.length === 0 && profile?.persona_type) {
      return [{
        id: 'primary',
        persona_type: profile.persona_type,
        first_name: profile.first_name,
        last_name: profile.last_name,
        bio: profile.bio,
        data: profile.persona_data || {},
        active: true
      }]
    }
    return stored
  })

  const [activeIdentityId, setActiveIdentityId] = useState(() => {
    const active = identities.find(i => i.active)
    return active ? active.id : 'primary'
  })

  // State for the identity currently being edited
  const [editingId, setEditingId] = useState(null) 
  const [persona, setPersona] = useState('dev')
  const [data, setData] = useState({})
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')

  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [extractedColor, setExtractedColor] = useState(null)
  const colorCache = useRef({})
  const [errors, setErrors] = useState({})
  const [statErrors, setStatErrors] = useState({})

  // Load identity into editor
  const startEditing = (id) => {
    const identity = identities.find(i => i.id === id)
    if (identity) {
      setEditingId(id)
      setPersona(identity.persona_type)
      setData(identity.data || {})
      setFirstName(identity.first_name)
      setLastName(identity.last_name)
      setBio(identity.bio)
      setIsEditing(true)
    }
  }

  const addNewIdentity = () => {
    if (identities.length >= 3) return
    const newId = `id-${Math.random().toString(36).substring(2, 9)}`
    setEditingId(newId)
    setPersona(null) // Force Choose Your Path
    setData({})
    setFirstName(profile?.first_name || '')
    setLastName(profile?.last_name || '')
    setBio('')
    setIsEditing(true)
  }

  const toggleActive = async (id) => {
    const updated = identities.map(i => ({ ...i, active: i.id === id }))
    setIdentities(updated)
    
    const active = updated.find(i => i.id === id)
    // Update main profile with active identity data for public view/Tee scan
    await supabase.from('profiles').update({
      persona_type: active.persona_type,
      persona_data: { ...active.data, identities: updated },
      first_name: active.first_name,
      last_name: active.last_name,
      bio: active.bio
    }).eq('id', profile.id)
    onUpdate()
  }

  const formatK = (val) => {
    if (!val) return '0';
    const num = parseInt(String(val).replace(/\D/g, ''));
    if (isNaN(num)) return val;
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  }

  // Extract color logic remains same...
  useEffect(() => {
    if (profile?.avatar_url) {
      if (colorCache.current[profile.avatar_url]) {
        setExtractedColor(colorCache.current[profile.avatar_url]);
        return;
      }
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = profile.avatar_url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1; canvas.height = 1;
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        const color = `rgb(${r},${g},${b})`;
        colorCache.current[profile.avatar_url] = color;
        setExtractedColor(color);
      };
    }
  }, [profile?.avatar_url])

  const baseTheme = PERSONAS[persona] || PERSONAS.dev
  const theme = useMemo(() => {
    if (!extractedColor) return baseTheme;
    return {
      ...baseTheme,
      accent: extractedColor,
      bg: `linear-gradient(180deg, ${extractedColor}33 0%, ${baseTheme.bg.split(',')[1].trim()} 100%)`,
      cardBg: `${extractedColor}15`
    };
  }, [baseTheme, extractedColor])

  const handleAvatarUpload = async (file) => {
    if (!file || file.size > 2 * 1024 * 1024) return
    try {
      setUploading(true)
      const filePath = `${profile.id}-${Math.random()}.${file.name.split('.').pop()}`
      await supabase.storage.from('avatars').upload(filePath, file)
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id)
      onUpdate()
    } finally { setUploading(false) }
  }

  const handleSave = async () => {
    // Validation...
    const fieldErrors = {};
    const sErrors = {};
    theme.fields.forEach(f => {
      if (data[f] && /^\d+$/.test(data[f])) fieldErrors[f] = true;
    });
    theme.stats.forEach(s => {
      if (data[s] && !/^\d+$/.test(String(data[s]).replace(/[KM]/gi, ''))) sErrors[s] = true;
    });

    if (Object.keys(fieldErrors).length > 0 || Object.keys(sErrors).length > 0) {
      setErrors(fieldErrors);
      setStatErrors(sErrors);
      return;
    }

    setSaving(true)
    
    // Update or Add to identities array
    let updatedIdentities = [...identities]
    const existingIndex = updatedIdentities.findIndex(i => i.id === editingId)
    
    const identityData = {
      id: editingId,
      persona_type: persona,
      first_name: firstName,
      last_name: lastName,
      bio: bio,
      data: data,
      active: existingIndex >= 0 ? updatedIdentities[existingIndex].active : identities.length === 0
    }

    if (existingIndex >= 0) {
      updatedIdentities[existingIndex] = identityData
    } else {
      updatedIdentities.push(identityData)
    }

    // If this is the active identity, sync to main profile fields
    const isMainSync = identityData.active
    
    const { error } = await supabase.from('profiles').update({ 
      persona_type: isMainSync ? persona : profile.persona_type, 
      persona_data: { ...profile.persona_data, identities: updatedIdentities },
      first_name: isMainSync ? firstName : profile.first_name,
      last_name: isMainSync ? lastName : profile.last_name,
      bio: isMainSync ? bio : profile.bio
    }).eq('id', profile?.id)

    if (!error) {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      setIsEditing(false)
      setIdentities(updatedIdentities)
      onUpdate()
    }
    setSaving(false)
  }

  if (!isEditing) {
    const isCreator = profile?.status === 'paid' || profile?.role === 'owner'
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-display font-black">My <span className="text-orange-500">Identities</span></h2>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{identities.length} / 3 Slots Used</span>
        </div>
        
        {/* Identity Cards List */}
        <div className="space-y-4">
          {identities.map(idnt => (
            <div 
              key={idnt.id} 
              onClick={() => startEditing(idnt.id)}
              className="card p-6 bg-white flex items-center gap-6 shadow-xl relative overflow-hidden group cursor-pointer hover:border-orange-500/30 transition-all active:scale-[0.98]"
            >
              <div className={`absolute top-0 left-0 w-1.5 h-full ${idnt.active ? 'bg-orange-500' : 'bg-neutral-200'}`} />
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-100 shrink-0">
              <Avatar src={profile?.avatar_url} name={`${idnt.first_name} ${idnt.last_name}`} username={profile?.username} size="w-16 h-16 text-2xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-black text-xl">{idnt.first_name} {idnt.last_name}</h3>
                  {idnt.active ? (
                    <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-md border border-emerald-100 flex items-center gap-1">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> Live
                    </div>
                  ) : (
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleActive(idnt.id); }} 
                      className="px-2 py-0.5 bg-neutral-50 text-neutral-400 text-[9px] font-black uppercase rounded-md border border-neutral-200 hover:border-orange-200 hover:text-orange-500 transition-all relative z-10"
                    >
                      Make Live
                    </button>
                  )}
                </div>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">{PERSONAS[idnt.persona_type]?.label} Persona</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:text-orange-500 group-hover:bg-orange-50 transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* Add New Identity Button (Creator Plan Only) */}
        {isCreator ? (
          identities.length < 3 ? (
            <button onClick={addNewIdentity} className="w-full h-24 border-2 border-dashed border-neutral-200 rounded-3xl flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/30 transition-all group">
              <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                <Plus size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add New Identity</span>
            </button>
          ) : (
            <div className="text-center py-4 px-6 bg-neutral-50 rounded-2xl border border-neutral-100">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Max 3 Identities Reached</p>
            </div>
          )
        ) : (
          <div className="card p-8 bg-orange-50 border border-orange-100 text-center">
            <Lock size={32} className="mx-auto mb-4 text-orange-500 opacity-50" />
            <h3 className="text-lg font-bold mb-1">Upgrade to Creator Plan</h3>
            <p className="text-xs text-neutral-500 mb-6">Unlock up to 3 different identities for your phygital scans.</p>
            <button onClick={() => window.location.href = '/#pricing'} className="btn-primary px-8 py-3 text-sm">Upgrade Now</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="max-w-[900px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-8 animate-slideUp">
          {/* Section 1: Path - Only show if persona is not yet chosen for this identity */}
          {!persona && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-[10px]">01</div>
                <h2 className="text-xl font-display font-black">Choose Your Path</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.values(PERSONAS).map(p => (
                  <div key={p.id} onClick={() => setPersona(p.id)} className={`persona-card p-4 h-32 ${persona === p.id ? 'active' : ''}`} style={{ background: p.bg }}>
                     <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xl mb-3" style={{ background: p.cardBg }}>{p.emoji}</div>
                     <h3 className="text-sm font-display font-bold text-white mb-0.5">{p.label}</h3>
                     <p className="text-[8px] uppercase font-bold tracking-widest" style={{ color: p.textSecondary }}>Select Theme</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 2: Identity */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-[10px]">{!persona ? '02' : '01'}</div>
              <h2 className="text-xl font-display font-black">Build Your Identity</h2>
            </div>
            <div className="space-y-4 card p-6 bg-white shadow-sm">
              <div className="flex items-center gap-6 p-4 bg-neutral-50 rounded-2xl">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 flex items-center justify-center text-4xl shadow-lg border-4 border-white">
                    <Avatar src={profile?.avatar_url} name={`${firstName} ${lastName}`} username={profile?.username} size="w-20 h-20 text-4xl" />
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-full border-4 border-white flex items-center justify-center text-white cursor-pointer shadow-lg hover:scale-110 transition-all"><Plus size={16}/><input type="file" className="hidden" onChange={(e) => handleAvatarUpload(e.target.files[0])}/></label>
                </div>
                <div><p className="text-sm font-bold">Profile Picture</p><p className="text-[10px] text-neutral-400">JPG or PNG • Max 2MB</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">First Name</label><input className="premium-input" value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
                <div><label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">Last Name</label><input className="premium-input" value={lastName} onChange={e => setLastName(e.target.value)} /></div>
              </div>
              <div><label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">Bio</label><textarea className="premium-input min-h-[100px]" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell the world who you are..." /></div>
              <div><label className="text-[10px] font-bold uppercase text-neutral-400 mb-1 block">Public Tagline</label><input className="premium-input" value={data.tagline || ''} onChange={e => setData({...data, tagline: e.target.value})} placeholder="e.g. Building the future..." /></div>
            </div>
          </section>

          {/* Section 3: Connect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-[10px]">{profile?.persona_type ? '02' : '03'}</div>
              <h2 className="text-xl font-display font-black">Connect Your World</h2>
            </div>
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-3">
                  {theme.stats.map(s => (
                    <div key={s} className={`p-3 card transition-all ${statErrors[s] ? 'bg-red-50 border-red-200' : 'bg-white shadow-sm'}`}>
                      <p className="text-[8px] font-black uppercase text-neutral-400 tracking-widest mb-1">{s}</p>
                      <input 
                        className={`w-full text-lg font-display font-black outline-none bg-transparent ${statErrors[s] ? 'text-ruby-500' : 'text-neutral-900'}`} 
                        placeholder="0" 
                        value={data[s] || ''} 
                        onChange={e => {
                          const val = e.target.value;
                          if (val && !/^\d*$/.test(val)) {
                            setStatErrors({...statErrors, [s]: true})
                          } else {
                            setStatErrors({...statErrors, [s]: false})
                            setData({...data, [s]: val})
                          }
                        }} 
                      />
                      <p className={`text-[8px] font-bold mt-0.5 ${statErrors[s] ? 'text-ruby-500' : 'text-neutral-400'}`}>
                        {statErrors[s] ? '⚠️ Numbers Only' : 'Ex: 12000 -> 12K'}
                      </p>
                    </div>
                  ))}
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {theme.fields.map(f => {
                    const isLocked = profile?.status !== 'paid' && profile?.role !== 'owner' && ['instagram', 'youtube'].includes(f)
                    const hasError = errors[f]
                    return (
                      <div key={f} className={`flex items-center gap-3 p-3 card transition-all ${isLocked ? 'opacity-60 bg-neutral-50' : 'bg-white shadow-sm'} ${hasError ? 'border-ruby-500 bg-red-50' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${hasError ? 'bg-ruby-100 text-ruby-500' : 'bg-neutral-100'}`}>{FIELD_META[f]?.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[8px] font-bold uppercase tracking-wider truncate mb-0.5 ${hasError ? 'text-ruby-500' : 'text-neutral-400'}`}>{f}</p>
                          <input 
                            disabled={isLocked}
                            className={`w-full text-xs font-bold outline-none bg-transparent ${hasError ? 'text-ruby-500' : isLocked ? 'text-neutral-400' : 'text-neutral-900'}`} 
                            placeholder={isLocked ? 'Locked' : `UserName`} 
                            value={data[f] || ''} 
                            onChange={e => {
                              const val = e.target.value;
                              setData({...data, [f]: val});
                            }} 
                          />
                        </div>
                      </div>
                    )
                  })}
               </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 pt-6">
            <button onClick={handleSave} className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg shadow-2xl">
              {saving ? <Loader2 className="animate-spin" /> : <><Save size={24}/> Save Identity</>}
            </button>
            <button onClick={() => setIsEditing(false)} className="py-3 text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors">Cancel Changes</button>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-neutral-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Identity Preview</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50">
              <div className="live-dot" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Live</span>
            </div>
          </div>

          <div className="persona-card overflow-hidden animate-float-preview shadow-2xl" style={{ background: theme.bg, padding: 0 }}>
            <div className="preview-card" style={{ padding: '40px 24px' }}>
              <div 
                className="w-24 h-24 rounded-[32px] mx-auto mb-6 flex items-center justify-center text-5xl shadow-2xl"
                style={{ background: theme.cardBg, border: `2.5px solid ${theme.accentLight}` }}
              >
                <Avatar src={profile?.avatar_url} name={`${firstName} ${lastName}`} username={profile?.username} size="w-24 h-24 text-4xl" />
              </div>
              <h3 className="text-2xl font-display font-black text-center mb-1" style={{ color: theme.textPrimary }}>{firstName} {lastName || ''}</h3>
              <p className="text-[10px] font-bold text-center uppercase tracking-[0.2em] mb-4" style={{ color: theme.accent }}>{data.tagline || `${theme.label} Identity`}</p>
              
              {bio && (
                <p className="text-center text-[10px] mb-4 leading-relaxed opacity-60 line-clamp-2 px-4" style={{ color: theme.textSecondary }}>
                  {bio}
                </p>
              )}

              {/* Stats Grid */}
              {theme.stats && theme.stats.some(s => data[s]) && (
                <div className="flex items-center justify-center gap-6 mb-6 px-4">
                  {theme.stats.map((s, i) => (
                    <div key={s} className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xl font-display font-black" style={{ color: theme.accent }}>{formatK(data[s])}</p>
                        <p className="text-[8px] font-bold uppercase tracking-widest opacity-50" style={{ color: theme.textSecondary }}>{s}</p>
                      </div>
                      {i === 0 && theme.stats[1] && <div className="w-px h-8 bg-white/10" />}
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                 {theme?.fields?.filter(f => data[f]).slice(0, 3).map(f => (
                   <div key={f} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: theme.cardBg, border: `1px solid ${theme.accentLight}` }}>
                     <span className="text-lg">{FIELD_META[f]?.emoji || '🔗'}</span>
                     <span className="text-[10px] font-bold text-white uppercase tracking-wider">{f}</span>
                     <ArrowRight size={14} className="ml-auto" style={{ color: theme.accent }} />
                   </div>
                 ))}
                 {theme.fields.filter(f => data[f]).length === 0 && (
                   <div className="text-center py-8 opacity-20" style={{ color: theme.textSecondary }}>
                     <Link2 size={24} className="mx-auto mb-2" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Links will appear here</p>
                   </div>
                 )}
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-neutral-400 mt-6 font-bold uppercase tracking-widest">
            Real-Time Intelligence Preview
          </p>
        </div>
      </div>
      {showToast && <div className="toast"><CheckCircle2 size={16} /> Identity Updated!</div>}
    </div>
  )
}


const IdentityPass = ({ profile }) => {
  const isOwner = profile?.role === 'owner';
  const isPaid = profile?.status === 'paid' || isOwner
  const secretSlug = profile?.secure_slug || profile?.id
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${window.location.origin}/p/${secretSlug}`)}`

  return (
    <div className="animate-slideUp space-y-8">
      <div className="flex items-end justify-between">
        <div><p className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] mb-2">My Official Identity</p><h2 className="text-5xl font-display font-black tracking-tight">Identity <span className="gradient-text">Pass</span></h2></div>
        <div className="flex gap-2">
          {isPaid && <button className="btn-primary h-12 px-8 text-sm flex items-center gap-2"><Download size={18}/> Download Pass</button>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10">
        <div className="relative group">
          <div className="card p-12 flex flex-col items-center bg-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-6 right-8 flex items-center gap-1.5 bg-emerald-50/50 px-2.5 py-1.5 rounded-xl backdrop-blur-sm border border-emerald-500/10">
              <div className="live-dot"/>
              <span className="text-[10px] text-emerald-600 font-black tracking-widest uppercase">Verified</span>
            </div>

            <div className="flex flex-col items-center -mt-4 mb-3">
              <img src="/logo-square.png" className="w-36 h-36 object-contain -mb-10 bg-transparent border-none shadow-none" alt="KnoWMi Logo" />
              <h4 className="text-[32px] font-display font-black leading-[0.8] mb-1 tracking-[0.05em]">KnoWMi</h4>
              <p className="text-[10.5px] font-black uppercase tracking-[0.2em] text-neutral-400">Official Identity Pass</p>
            </div>

            <div className="relative w-64 h-64 mb-6">
              <img src={qrUrl} className={`w-full h-full object-contain ${!isPaid ? 'opacity-20 blur-sm grayscale' : ''}`} alt="Identity QR" />
              
              {!isPaid && (
                <div className="qr-mask">
                  <Lock className="text-white mb-4" size={40} />
                  <p className="text-white font-black text-xs uppercase tracking-widest text-center px-6 leading-relaxed">Identity Pass Locked</p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-5 w-64 text-center">
              <div className="flex flex-col items-center gap-0.5">
                <h3 className="text-3xl font-display font-black leading-tight">{profile?.first_name} {profile?.last_name || ''}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  {profile?.persona_data?.title || 'Digital Creator'}
                </p>
              </div>
              <p className="text-[14px] font-black text-orange-500 uppercase tracking-[0.3em]">
                {String(profile?.wm_code || profile?.pt_code || '').replace('PT-', 'WM-')}
              </p>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-8 bg-orange-50/30 border-orange-200 premium-shimmer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shrink-0"><Crown size={24}/></div>
              <div>
                <h4 className="text-lg font-bold mb-1">{isPaid ? 'You are our Premium Customer Now' : 'Upgrade to Premium Pass'}</h4>
                <p className="text-sm text-neutral-600 mb-6">
                  {isPaid 
                    ? 'Your physical identity is active. Enjoy unmasked QR access, detailed scan locations, and advanced persona statistics.' 
                    : 'Activate your physical identity. Get an unmasked QR code, detailed scan locations, and advanced persona statistics.'}
                </p>
                {!isPaid && <button className="btn-primary px-8 py-3 text-sm">Go Premium — 499</button>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             <div className="card p-6 bg-emerald-50/20 border-emerald-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center"><Award size={20}/></div>
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Premium Benefits Included</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  {[
                    "Lifetime Advanced Analytics",
                    "Dynamic NFC Sleeve Activation",
                    "240 GSM Ultra-Premium Cotton",
                    "Verified Profile Badge",
                    "Priority 24/7 WhatsApp Support",
                    "Location-Based Scan Tracking"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                      <Check size={14} className="text-emerald-500" /> {benefit}
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { profile, user, loading: authLoading, refreshProfile, isVerified, role } = useAuth()
  const [scans, setScans] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('analytics')
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/?auth=signin')
    }
  }, [user, authLoading, navigate])
  const [editorProgress, setEditorProgress] = useState(null)
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [dailyStats, setDailyStats] = useState([])
  const [recentEvents, setRecentEvents] = useState([])
  const [analyticsSummary, setAnalyticsSummary] = useState({ total: 0, unique: 0, qr: 0, repeat: 0 })
  const [selectedSize, setSelectedSize] = useState('L')
  const idleTimer = useRef(null)

  useEffect(() => {
    const handleActivity = (e) => {
      // If clicking/touching the nav itself, don't hide it
      if (e?.target?.closest('nav')) return

      setIsNavVisible(false)
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        setIsNavVisible(true)
      }, 600)
    }

    window.addEventListener('scroll', handleActivity)
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('mousedown', handleActivity)
    window.addEventListener('touchstart', handleActivity)

    return () => {
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('mousedown', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [])

  const [connections, setConnections] = useState([])

  useEffect(() => { 
    if (profile?.id) {
      // Fetch scans
      supabase.from('scans').select('*').eq('profile_id', profile.id).order('scanned_at', { ascending: true })
        .then(({data}) => { setScans(data || []); })
      
      // Fetch orders
      supabase.from('orders').select('*').eq('profile_id', profile.id).order('created_at', { ascending: false })
        .then(({data}) => { setOrders(data || []); setLoading(false) })

      // Fetch Deep Analytics
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      // 1. Daily Rollups
      supabase.from('profile_view_daily').select('*').eq('profile_id', profile.id).gte('day', thirtyDaysAgo).order('day', { ascending: true })
        .then(({data}) => {
          setDailyStats(data || []);
          const total = data?.reduce((acc, curr) => acc + curr.total_views, 0) || 0;
          const unique = data?.reduce((acc, curr) => acc + curr.unique_views, 0) || 0;
          const qr = data?.reduce((acc, curr) => acc + (curr.qr_views || 0), 0) || 0;
          setAnalyticsSummary(prev => ({ ...prev, total, unique, qr }));
        });

      // 2. Recent Events
      supabase.from('profile_view_events').select('viewed_at, device_type, referrer, country, is_repeat').eq('profile_id', profile.id).order('viewed_at', { ascending: false }).limit(50)
        .then(({data}) => {
          setRecentEvents(data || []);
          const repeats = data?.filter(e => e.is_repeat).length || 0;
          const repeatRate = data?.length ? (repeats / data.length) * 100 : 0;
          setAnalyticsSummary(prev => ({ ...prev, repeat: repeatRate }));
        });
    } else if (!authLoading) setLoading(false)
  }, [profile, authLoading])

  const latestOrder = orders[0]

  const deviceData = [
    { name: 'iPhone', value: 45, color: '#E07B1A' },
    { name: 'Android', value: 35, color: '#10B981' },
    { name: 'Desktop', value: 20, color: '#8B5CF6' }
  ]

  const chartData = useMemo(() => {
    return [6,5,4,3,2,1,0].map(i => {
      const d = new Date(); d.setDate(d.getDate() - i)
      const ds = d.toISOString().split('T')[0]
      return { 
        name: d.toLocaleDateString('en', {day:'numeric', month:'short'}), 
        value: (scans || []).filter(s => s?.scanned_at?.startsWith(ds)).length 
      }
    })
  }, [scans])



  // REAL DATA CALCULATIONS
  const totalScans = (scans || []).length
  const reachIndex = Math.round(totalScans * 1.8 + (orders.length * 5)) 
  const connectionCount = connections.length
  // Engagement = Scans in last 7 days / Average
  const recentScans = chartData.reduce((acc, curr) => acc + curr.value, 0)
  const engagementScore = Math.min(100, Math.round((recentScans / 10) * 100) || 0)

  if (authLoading || loading) return <div className="min-h-screen bg-[#FAFAF9] p-10"><style dangerouslySetInnerHTML={{ __html: STYLES }}/><div className="skeleton h-20 w-full rounded-2xl mb-6"/><div className="skeleton h-64 w-full rounded-2xl"/></div>

  // ABSOLUTE GATE: If not verified AND not owner, they see NOTHING but the lock.
  if (isVerified !== true && role !== 'owner') return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <header className="h-16 border-b bg-white/80 backdrop-blur-xl flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      </header>
      <VerificationLock profile={profile} user={user} />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-32">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* Personalized Navigation */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-neutral-100 flex items-center px-4 md:px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-400 transition-colors flex items-center gap-2 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Home</span>
            </button>
            <div className="h-8 w-px bg-neutral-100 hidden sm:block" />
            <div className="flex flex-col">
              <h1 className="font-display text-2xl tracking-tight text-[#111111]">
                {profile?.first_name ? `${profile.first_name}'s` : 'KnoWMi'} <span className="text-neutral-300 font-light text-xl">| Analytics</span>
              </h1>
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] leading-none mt-1">Scan Me. Know Me.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div 
              onClick={() => navigate(`/p/${profile?.secure_slug || profile?.id}`)}
              className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-orange-200 transition-all cursor-pointer group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-neutral-900 leading-none">{profile?.first_name}</p>
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">{profile?.wm_code || 'WM-NEW-000'}</p>
              </div>
              <Avatar 
                src={profile?.avatar_url} 
                name={profile?.first_name} 
                username={profile?.username} 
                size="w-9 h-9 border-2 border-white shadow-sm group-hover:border-orange-500/20 transition-all" 
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="animate-slideUp space-y-8">
          {/* Controls - Period Selection Only */}
          <div className="flex justify-end items-center mb-8">
            <div className="bg-white p-1 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-2">
              <Clock size={16} className="text-neutral-400 ml-3" />
              <button className="px-6 py-2.5 rounded-xl bg-[#111111] text-white text-xs font-bold shadow-lg shadow-black/10 flex items-center gap-2 transition-all hover:scale-[1.02]">
                Last 30 Days <ChevronDown size={14}/>
              </button>
            </div>
          </div>

          <div className="tab-container relative overflow-hidden min-h-[800px]">
            {/* Analytics Tab */}
            <div className={`tab-transition ${activeTab === 'analytics' ? 'tab-visible' : 'tab-hidden'}`}>
              <div className="space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-[1.5rem] border border-neutral-200 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Total Views</p>
                    <p className="text-3xl font-black text-neutral-900 mb-1">{analyticsSummary.total.toLocaleString()}</p>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-tight">Last 30 days</p>
                  </div>
                  <div className="bg-white p-6 rounded-[1.5rem] border border-neutral-200 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Unique Reach</p>
                    <p className="text-3xl font-black text-neutral-900 mb-1">{analyticsSummary.unique.toLocaleString()}</p>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-tight">Unique visitors</p>
                  </div>
                  <div className="bg-white p-6 rounded-[1.5rem] border border-neutral-200 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">QR Scan Rate</p>
                    <p className="text-3xl font-black text-neutral-900 mb-1">{((analyticsSummary.qr / analyticsSummary.total) * 100 || 0).toFixed(1)}%</p>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-tight">From physical scans</p>
                  </div>
                  <div className="bg-white p-6 rounded-[1.5rem] border border-neutral-200 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Repeat Score</p>
                    <p className="text-3xl font-black text-neutral-900 mb-1">{analyticsSummary.repeat.toFixed(1)}%</p>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-tight">Returning fans</p>
                  </div>
                </div>

                {/* 1. Main Chart: Scan Activity */}
                <div className="bg-white p-8 rounded-[1.5rem] border border-neutral-200 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-display text-[#111111] uppercase tracking-tight">Scan Activity</h3>
                      <LiveCounter profileId={profile.id} />
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Total Scans</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Unique Scans</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[400px]">
                    <ViewsChart data={dailyStats} />
                  </div>
                </div>

                {/* 2. Three Column Breakdown */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Top Locations */}
                  <div className="bg-white p-8 rounded-[1.5rem] border border-neutral-200 shadow-sm flex flex-col">
                    <h3 className="text-sm font-display text-[#111111] uppercase tracking-[0.1em] mb-8">Top Locations</h3>
                    <div className="flex-1 flex flex-col gap-6">
                      <div className="aspect-[16/9] rounded-2xl bg-neutral-100 overflow-hidden relative border border-neutral-200">
                        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-60 grayscale" alt="Map mockup" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-12 h-12 bg-orange-500/20 rounded-full animate-ping" />
                           <div className="absolute w-4 h-4 bg-orange-500 rounded-full border-2 border-white" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        {(scans || []).slice(0, 3).map((s, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-black text-neutral-300">{i + 1}.</span>
                              <span className="text-sm font-bold text-neutral-700">{s.city || 'Mumbai, IN'}</span>
                            </div>
                            <span className="text-xs font-black text-neutral-400">{Math.round(100 - (i * 20))}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sources (QR Scan Rate Style) */}
                  <div className="bg-white p-8 rounded-[1.5rem] border border-neutral-200 shadow-sm flex flex-col">
                    <h3 className="text-sm font-display text-[#111111] uppercase tracking-[0.1em] mb-8">QR Scan Rate</h3>
                    <div className="flex-1 flex flex-col items-center justify-center relative">
                      <div className="w-full h-[220px]">
                        <SourceDonut data={dailyStats} />
                      </div>
                    </div>
                  </div>

                  {/* Engagement Time */}
                  <div className="bg-white p-8 rounded-[1.5rem] border border-neutral-200 shadow-sm flex flex-col">
                    <h3 className="text-sm font-display text-[#111111] uppercase tracking-[0.1em] mb-8">Avg Engagement Time</h3>
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="relative">
                        <div className="text-5xl font-display font-medium text-neutral-900 mb-2">1m 45s</div>
                        <Clock className="absolute -top-4 -right-8 text-neutral-300" size={24} />
                      </div>
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-2">per scan</p>
                      <div className="mt-8 flex items-center gap-2 text-[#10B981]">
                        <TrendingUp size={16} />
                        <span className="text-sm font-black">12% <span className="font-medium text-neutral-400">from last period</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Bottom Full Row */}
                <div className="bg-white p-8 rounded-[1.5rem] border border-neutral-200 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-display text-[#111111] uppercase tracking-[0.1em]">Recent Activity</h3>
                    <button className="text-xs font-bold text-orange-500 uppercase tracking-widest">View All Scans</button>
                  </div>
                  <RecentVisitors events={recentEvents} />
                </div>
              </div>
            )}
          </div>
          
          {/* Connections Tab */}
          <div className={`tab-transition ${activeTab === 'connections' ? 'tab-visible' : 'tab-hidden'}`}>
            {activeTab === 'connections' && (
              <div className="space-y-8 animate-slideUp">
                <div className="flex items-end justify-between">
                  <div><p className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] mb-2">Social Handshake</p><h2 className="text-5xl font-display font-black tracking-tight">Your <span className="gradient-text">Network</span></h2></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {connections.map(c => (
                    <div key={c.id} className="card p-6 flex items-center gap-4 hover:border-orange-500/30 transition-all cursor-pointer group">
                      <img src={c.avatar} className="w-14 h-14 rounded-2xl object-cover" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{c.name}</h4>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{c.code}</p>
                        <p className="text-[9px] text-orange-500 mt-1 font-bold">Connected {c.date}</p>
                      </div>
                      <ChevronRight size={16} className="text-neutral-300 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Store Tab */}
          <div className={`tab-transition ${activeTab === 'store' ? 'tab-visible' : 'tab-hidden'}`}>
            {activeTab === 'store' && (
              <>
                {(profile?.status === 'paid' || (latestOrder && latestOrder.status !== 'pending')) ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center animate-slideUp">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10">
                      <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-4xl font-display font-black mb-4">Hurray!! Order Confirmed</h2>
                    <p className="text-lg text-neutral-500 max-w-md mx-auto mb-10">
                      {latestOrder ? (
                        <>You ordered the <span className="font-bold text-orange-500">{latestOrder.item_name}</span>. Your phygital journey has begun!</>
                      ) : (
                        <>Your premium purchase is verified! The owner is currently assigning your Signature Tee details. Check back shortly!</>
                      )}
                    </p>
                    
                    <div className="card p-10 bg-white max-w-sm w-full shadow-2xl border-none premium-shimmer">
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-left">
                          <p className="text-[10px] font-black uppercase text-neutral-400">Order ID</p>
                          <p className="font-bold">{latestOrder ? (latestOrder.order_number || latestOrder.id.slice(0, 8).toUpperCase()) : 'ASSIGNING...'}</p>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-black uppercase">
                          {latestOrder ? latestOrder.status : 'VERIFIED'}
                        </div>
                      </div>
                      <div className="aspect-square bg-neutral-50 rounded-2xl mb-6 flex items-center justify-center overflow-hidden border-2 border-neutral-100">
                         {/* Animated Ordered T-shirt */}
                         <div className="relative w-full h-full animate-float-slow scale-110">
                           {latestOrder?.model_image_url ? (
                             <img src={latestOrder?.model_image_url} className="w-full h-full object-contain p-4" alt={latestOrder?.item_name || 'Item'} />
                           ) : (
                             <svg viewBox="0 0 200 250" className="w-full h-full drop-shadow-xl">
                               <path d="M40,50 Q100,30 160,50 L190,90 L165,115 L155,108 L155,230 Q100,245 45,230 L45,108 L35,115 L10,90 Z" fill="#171717" />
                               <rect x="40" y="80" width="120" height="2" fill="var(--saffron)" className="animate-scan-glow" style={{ filter: 'blur(1px)' }} />
                             </svg>
                           )}
                         </div>
                      </div>
                      <button onClick={() => setActiveTab('order-status')} className="w-full py-4 bg-neutral-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
                        Track Delivery Status
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-slideUp pb-20">
                    <div className="flex items-end justify-between">
                      <div><p className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] mb-2">Phygital Merch</p><h2 className="text-5xl font-display font-black tracking-tight">Identity <span className="gradient-text">Store</span></h2></div>
                    </div>
                
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
                      <div className="card p-12 lg:p-20 flex items-center justify-center bg-[#F3F4F6] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/50 to-transparent pointer-events-none" />
                        
                        {/* High-Fidelity T-Shirt Model */}
                        <div className="relative w-full max-w-[400px] aspect-[4/5] animate-float group cursor-crosshair">
                          <svg viewBox="0 0 200 250" className="w-full h-full drop-shadow-[0_40px_40px_rgba(0,0,0,0.15)] transition-transform duration-700 group-hover:scale-105">
                            <defs>
                              <linearGradient id="fabricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#171717" />
                                <stop offset="100%" stopColor="#262626" />
                              </linearGradient>
                            </defs>
                            <path 
                              d="M40,50 Q100,30 160,50 L190,90 L165,115 L155,108 L155,230 Q100,245 45,230 L45,108 L35,115 L10,90 Z" 
                              fill="url(#fabricGrad)" 
                            />
                            <path d="M45,108 Q100,120 155,108" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="2" />
                            <path d="M100,50 Q100,230 100,230" fill="none" stroke="white" strokeOpacity="0.02" strokeWidth="1" />
                          </svg>

                          {/* Integrated Identity Overlay */}
                          <div className={`absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-white rounded-3xl p-3 shadow-2xl flex flex-col items-center justify-center border-4 border-black/5 rotate-[-1deg] overflow-hidden ${profile?.status !== 'paid' ? 'premium-shimmer' : ''}`}>
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${window.location.origin}/p/${profile?.secure_slug || profile?.id}`} 
                              className={`w-full h-full mb-1 opacity-80 ${profile?.status !== 'paid' ? 'blur-[8px] grayscale opacity-40' : ''}`} 
                            />
                            {profile?.status !== 'paid' && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                                <Lock size={24} className="text-orange-600 drop-shadow-sm" />
                              </div>
                            )}
                            <p className="text-[7px] font-black tracking-[0.2em] text-black/30">{profile?.wm_code}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="card p-8 bg-white shadow-xl border-none">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="px-3 py-1 bg-orange-500/10 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full">Best Seller</div>
                            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Limited</div>
                          </div>
                          <h3 className="text-3xl font-display font-black mb-2">The Signature Tee</h3>
                          <p className="text-sm text-neutral-400 mb-6 leading-relaxed">Crafted from 240 GSM ultra-heavy cotton with a luxurious oversized phygital fit. Includes lifetime advanced analytics activation.</p>
                          
                          <div className="flex items-center gap-4 mb-8">
                            <div className="text-4xl font-display font-black">₹999</div>
                            <div className="text-sm text-neutral-400 line-through">₹1,499</div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Select Fit (240 GSM)</p>
                            <div className="grid grid-cols-4 gap-3">
                              {['S', 'M', 'L', 'XL'].map(sz => (
                                <button 
                                  key={sz} 
                                  onClick={() => setSelectedSize(sz)}
                                  className={`h-12 border-2 rounded-xl flex items-center justify-center font-black text-sm transition-all
                                    ${selectedSize === sz ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-neutral-100 hover:border-orange-200'}`}
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button 
                            onClick={async () => {
                              const { error } = await supabase.from('orders').insert({
                                profile_id: profile.id,
                                item_name: 'Signature KnoWMi',
                                size: selectedSize,
                                amount: 999,
                                qr_code_link: window.location.origin + '/s/' + (profile?.wm_code?.replace('PT-', '') || profile?.id)
                              })
                              if (!error) {
                                alert('Order Initiated! Our team will contact you for shipping details.')
                                refreshProfile()
                              }
                            }}
                            className="btn-primary w-full h-16 rounded-[24px] text-base font-black flex items-center justify-center gap-3 mt-8 shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
                          >
                            Order & Activate <ArrowRight size={20} />
                          </button>
                        </div>

                        <div className="card p-6 border-dashed border-2 bg-transparent">
                          <div className="flex items-center gap-4 text-neutral-400">
                            <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center"><Smartphone size={20}/></div>
                            <div>
                              <p className="text-xs font-bold">NFC Handshake Chip</p>
                              <p className="text-[10px] opacity-60">Integrated into the left sleeve</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Existing Tabs */}
          <div className={`tab-transition ${activeTab === 'profile' ? 'tab-visible' : 'tab-hidden'}`}>
            {activeTab === 'profile' && <PersonaEditor profile={profile} onUpdate={refreshProfile} />}
          </div>
          
          <div className={`tab-transition ${activeTab === 'pass' ? 'tab-visible' : 'tab-hidden'}`}>
            {activeTab === 'pass' && <IdentityPass profile={profile} />}
          </div>

          {/* Order Status Tab */}
          <div className={`tab-transition ${activeTab === 'order-status' ? 'tab-visible' : 'tab-hidden'}`}>
            {activeTab === 'order-status' && (
              <div className="space-y-8 animate-slideUp pb-20">
                <div className="flex items-end justify-between">
                  <div><p className="text-[11px] font-black uppercase text-orange-500 tracking-[0.2em] mb-2">Delivery Pulse</p><h2 className="text-5xl font-display font-black tracking-tight">Order <span className="gradient-text">Status</span></h2></div>
                </div>

                {!latestOrder ? (
                  <div className="card p-20 text-center">
                    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
                      <ShoppingBag size={40} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No active orders</h3>
                    <p className="text-sm text-neutral-400 mb-8">Visit the Identity Store to get your Signature Tee.</p>
                    <button onClick={() => setActiveTab('store')} className="btn-primary px-8 py-3 text-sm">Visit Store</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="card p-8 bg-white shadow-xl border-none">
                        <div className="flex justify-between items-start mb-10">
                          <div>
                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Order Placed</p>
                            <p className="text-lg font-bold">{new Date(latestOrder.order_date || latestOrder.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Order ID</p>
                            <p className="text-lg font-bold font-mono">{latestOrder.order_number || latestOrder.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                        </div>

                        <div className="space-y-8 relative">
                          {/* Tracking Line */}
                          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-neutral-100" />
                          
                          {[
                            { label: 'Order Confirmed', status: 'pending', icon: Check, desc: 'Your identity is being prepared' },
                            { label: 'Payment Verified', status: 'paid', icon: ShieldCheck, desc: 'Quality check and packing' },
                            { label: 'In Transit', status: 'shipped', icon: Rocket, desc: latestOrder.tracking_info || 'Handed over to delivery partner' },
                            { label: 'Delivered', status: 'delivered', icon: MapPin, desc: `Arriving in ${latestOrder.delivery_city || 'your city'}` }
                          ].map((step, i) => {
                            const isCompleted = ['pending', 'paid', 'shipped', 'delivered'].indexOf(latestOrder.status) >= ['pending', 'paid', 'shipped', 'delivered'].indexOf(step.status)
                            const isCurrent = latestOrder.status === step.status
                            
                            return (
                              <div key={i} className={`flex gap-6 relative z-10 ${isCompleted ? 'opacity-100' : 'opacity-30'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm transition-all ${isCompleted ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                                  <step.icon size={14} strokeWidth={3} />
                                </div>
                                <div className="pb-2">
                                  <h4 className={`text-sm font-black uppercase tracking-wider mb-0.5 ${isCurrent ? 'text-orange-600' : 'text-neutral-900'}`}>{step.label}</h4>
                                  <p className="text-xs text-neutral-500">{isCompleted ? step.desc : 'Waiting...'}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="card p-6 border-dashed bg-transparent flex items-center gap-4 text-neutral-500">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm"><Globe size={24}/></div>
                        <div>
                          <p className="text-xs font-bold">Estimated Delivery</p>
                          <p className="text-[10px]">{latestOrder.estimated_delivery || 'Calculating based on your city...'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="card p-10 bg-neutral-900 text-white relative overflow-hidden flex flex-col items-center justify-center">
                       <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none" />
                       <div className="relative w-full aspect-square animate-float-slow">
                          {latestOrder.model_image_url ? (
                            <img src={latestOrder.model_image_url} className="w-full h-full object-contain" alt={latestOrder.item_name} />
                          ) : (
                            <svg viewBox="0 0 200 250" className="w-full h-full drop-shadow-[0_40px_40px_rgba(0,0,0,0.5)]">
                              <path d="M40,50 Q100,30 160,50 L190,90 L165,115 L155,108 L155,230 Q100,245 45,230 L45,108 L35,115 L10,90 Z" fill="#262626" />
                              <path d="M45,108 Q100,120 155,108" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                              <rect x="50" y="80" width="100" height="1" fill="var(--saffron)" className="animate-scan-glow" />
                            </svg>
                          )}
                       </div>
                       <div className="text-center mt-6">
                         <h3 className="text-xl font-display font-black text-white mb-2">{latestOrder.item_name}</h3>
                         <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">{latestOrder.sku || 'SKU-SIGNATURE-TEE'}</p>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <nav className={`fixed bottom-6 left-1/2 -translate-x-1/2 glass border border-white/50 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-1.5 flex justify-between w-[calc(100%-32px)] max-w-[420px] z-50 transition-all duration-700 ease-in-out
        ${isNavVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
        {[
          { id: 'analytics', icon: Signal, label: 'Pulse' },
          { id: 'profile', icon: User, label: 'Identity' },
          { id: 'connections', icon: Users, label: 'Network' },
          { id: 'pass', icon: QrCode, label: 'Pass' },
          { id: 'order-status', icon: Clock, label: 'Status' },
          { id: 'store', icon: ShoppingBag, label: 'Store' }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`flex flex-col items-center justify-center flex-1 h-14 rounded-[20px] transition-all duration-300 relative group
              ${activeTab === tab.id ? 'bg-orange-50 text-orange-600 shadow-[0_4px_12px_rgba(224,123,26,0.08)] -translate-y-1' : 'text-neutral-400'}`}
          >
            <tab.icon size={22} className={`transition-all duration-300 ${activeTab === tab.id ? 'drop-shadow-[0_0_8px_rgba(224,123,26,0.3)] scale-110' : 'group-hover:scale-110'}`}/>
            <span className={`text-[9px] font-black uppercase tracking-wider mt-1 transition-all duration-300 ${activeTab === tab.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
              {tab.label}
            </span>
            {activeTab === tab.id && <div className="absolute -bottom-1 w-1 h-1 bg-orange-500 rounded-full animate-ping" />}
          </button>
        ))}
      </nav>
    </div>
  )
}
