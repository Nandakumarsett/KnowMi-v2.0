import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

const allData = [
  { name: 'Aryan Kapoor',    persona: 'Developer',      city: 'Delhi',     scans: 1247, emoji: '💻', rank: 1 },
  { name: 'Priya Mehta',     persona: 'Designer',       city: 'Bangalore', scans: 1089, emoji: '🎨', rank: 2 },
  { name: 'Rohan Singh',     persona: 'Founder',        city: 'Mumbai',    scans:  934, emoji: '🚀', rank: 3 },
  { name: 'Sneha Iyer',      persona: 'Content Creator',city: 'Chennai',   scans:  812, emoji: '📸', rank: 4 },
  { name: 'Vikram Nair',     persona: 'PM',             city: 'Pune',      scans:  778, emoji: '📊', rank: 5 },
  { name: 'Anjali Reddy',    persona: 'Marketer',       city: 'Hyderabad', scans:  651, emoji: '📣', rank: 6 },
  { name: 'Karan Bhatia',    persona: 'Student',        city: 'Delhi',     scans:  589, emoji: '🎓', rank: 7 },
  { name: 'Meera Patel',     persona: 'Artist',         city: 'Ahmedabad', scans:  512, emoji: '🎭', rank: 8 },
]

const cities = ['all', 'Delhi', 'Bangalore', 'Mumbai', 'Pune', 'Hyderabad']
const rankColors = ['#FF9933', '#9CA3AF', '#CD7F32']
const rankSymbols = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const [activeCity, setActiveCity] = useState('all')
  const ref = useReveal()

  const filtered = activeCity === 'all'
    ? allData
    : allData.filter(d => d.city === activeCity)

  return (
    <section id="leaderboard" className="section-pad snap-section min-h-screen flex items-center" style={{ background: 'var(--ink)' }} ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <span className="tag mb-5 inline-block" style={{ background: 'rgba(255,153,51,0.15)', color: 'var(--saffron)', border: '1px solid rgba(255,153,51,0.2)' }}>
              🏆 Live Leaderboard
            </span>
            <h2 className="font-display font-bold mb-5 text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.05 }}>
              Who is Getting<br/>
              <span className="italic" style={{ color: 'var(--saffron)' }}>the Most Scans?</span>
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '400px' }}>
              Real KnoWMi wearers, ranked by total QR scans this week. Your scan count updates live every 24 hours.
            </p>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} role="group" aria-label="Filter by city">
              <style>{`#leaderboard .overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => setActiveCity(city)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200 whitespace-nowrap flex-shrink-0"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: '0.05em',
                    background: activeCity === city ? 'var(--saffron)' : 'rgba(255,255,255,0.06)',
                    color: activeCity === city ? '#fff' : 'rgba(255,255,255,0.4)',
                    border: '1px solid ' + (activeCity === city ? 'var(--saffron)' : 'rgba(255,255,255,0.08)'),
                  }}
                  aria-pressed={activeCity === city}
                >
                  {city === 'all' ? '🌍 All India' : city}
                </button>
              ))}
            </div>
            <a href="#pricing" className="btn-primary btn-base px-6 py-3.5 text-sm">
              Get Your Tee and Climb the Board →
            </a>
          </div>

          <div className="reveal reveal-delay-2" role="list" aria-label="Leaderboard rankings">
            {filtered.slice(0, 6).map((d, i) => {
              const isTop3 = i < 3
              return (
                <div
                  key={d.name}
                  role="listitem"
                  className="flex items-center gap-4 p-4 rounded-2xl mb-3 transition-all duration-200 cursor-default"
                  style={{
                    background: i === 0 ? 'linear-gradient(135deg, rgba(255,153,51,0.15), rgba(255,153,51,0.05))' : 'rgba(255,255,255,0.04)',
                    border: '1px solid ' + (i === 0 ? 'rgba(255,153,51,0.3)' : 'rgba(255,255,255,0.06)'),
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)' }}
                >
                  <div className="w-8 text-center flex-shrink-0" style={{ fontSize: isTop3 ? '20px' : '13px', fontWeight: 900, color: rankColors[i] || 'rgba(255,255,255,0.3)', fontFamily: isTop3 ? 'serif' : 'JetBrains Mono, monospace' }} aria-label={'Rank ' + (i + 1)}>
                    {isTop3 ? rankSymbols[i] : '#' + (i + 1)}
                  </div>
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: i === 0 ? 'rgba(255,153,51,0.2)' : 'rgba(255,255,255,0.07)' }} aria-hidden="true">{d.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-white truncate">{d.name}</div>
                    <div className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>{d.persona} · {d.city}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-display font-bold text-xl counter-num" style={{ color: i === 0 ? 'var(--saffron)' : 'rgba(255,255,255,0.7)' }}>{d.scans.toLocaleString('en-IN')}</div>
                    <div className="text-[9px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>scans</div>
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="text-center py-10" style={{ color: 'rgba(255,255,255,0.3)' }}>
                No entries from {activeCity} yet. <a href="#pricing" style={{ color: 'var(--saffron)', textDecoration: 'underline' }}>Be the first!</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
