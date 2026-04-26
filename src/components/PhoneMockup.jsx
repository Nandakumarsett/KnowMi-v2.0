import { useRef, useState, useEffect, useCallback } from 'react'

// QR code pattern SVG
const QRPattern = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" aria-label="QR code">
    {/* Corner squares */}
    <rect x="8" y="8" width="26" height="26" rx="3" fill="none" stroke="#0A0A0F" strokeWidth="3" />
    <rect x="12" y="12" width="14" height="14" rx="1.5" fill="#0A0A0F" />
    <rect x="66" y="8" width="26" height="26" rx="3" fill="none" stroke="#0A0A0F" strokeWidth="3" />
    <rect x="70" y="12" width="14" height="14" rx="1.5" fill="#0A0A0F" />
    <rect x="8" y="66" width="26" height="26" rx="3" fill="none" stroke="#0A0A0F" strokeWidth="3" />
    <rect x="12" y="70" width="14" height="14" rx="1.5" fill="#0A0A0F" />
    {/* Data modules */}
    {[40,46,52,58,40,46,52,40,46,52,58,40,52,40,46,52,58].map((x, i) => {
      const positions = [
        [40,8],[46,8],[52,8],[58,8],
        [40,14],[52,14],
        [40,20],[46,20],[52,20],[58,20],
        [40,26],[58,26],
        [40,32],[46,32],[52,32],
        [66,40],[72,40],[78,40],[84,40],
        [66,46],[78,46],
        [66,52],[72,52],[84,52],
        [8,40],[14,40],[20,40],[26,40],
        [8,52],[14,52],[26,52],
        [8,58],[20,58],[26,58],
        [40,40],[46,40],[52,40],
        [40,46],[52,46],[58,46],
        [40,52],[52,52],
        [40,58],[46,58],[52,58],[58,58],
        [40,64],[58,64],
        [40,70],[46,70],[52,70],
        [40,76],[46,76],[58,76],
        [40,82],[52,82],[58,82],
        [46,64],[52,64],
        [66,52],[72,52],[84,52],
        [66,58],[78,58],
        [66,64],[72,64],[78,64],[84,64],
        [66,70],[84,70],
        [66,76],[72,76],[78,76],[84,76],
        [66,82],[72,82],[84,82],
      ]
      const pos = positions[i]
      if (!pos) return null
      return <rect key={i} x={pos[0]} y={pos[1]} width="5" height="5" rx="0.5" fill="#0A0A0F" />
    })}
    {/* Center logo hint */}
    <rect x="44" y="44" width="12" height="12" rx="2" fill="#FF9933" />
    <text x="50" y="53" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">P</text>
  </svg>
)

// Animated phone screen content
const PhoneScreen = () => {
  return (
    <div className="w-full h-full bg-white rounded-[28px] overflow-hidden relative flex flex-col">
      {/* Status bar */}
      <div className="flex justify-between items-center px-5 pt-3 pb-1 bg-white">
        <span className="text-[10px] font-semibold" style={{ color: 'var(--ink)', fontFamily: 'JetBrains Mono, monospace' }}>9:41</span>
        <div className="flex gap-1 items-center">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="var(--ink)"><rect x="0" y="3" width="2" height="5" rx="0.5"/><rect x="3" y="2" width="2" height="6" rx="0.5"/><rect x="6" y="1" width="2" height="7" rx="0.5"/><rect x="9" y="0" width="2" height="8" rx="0.5"/></svg>
          <svg width="10" height="8" viewBox="0 0 10 8" fill="var(--ink)"><path d="M5 1.5C3.5 1.5 2.2 2.1 1.2 3L0 1.8C1.4.7 3.1 0 5 0s3.6.7 4.9 1.8L8.8 3C7.8 2.1 6.5 1.5 5 1.5z"/><path d="M5 4C4.1 4 3.4 4.3 2.8 4.9L1.6 3.7C2.6 2.9 3.7 2.5 5 2.5s2.4.4 3.4 1.2L7.2 4.9C6.6 4.3 5.9 4 5 4z"/><circle cx="5" cy="6.5" r="1.5"/></svg>
          <div className="flex items-center gap-0.5">
            <div className="w-5 h-2.5 rounded-sm border border-[var(--ink)]" style={{ padding: '1px' }}>
              <div className="h-full w-3/4 rounded-sm" style={{ background: 'var(--green-india)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* App header */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-[var(--border2)]">
        <div className="flex items-center gap-1.5">
          <span 
            style={{ 
              fontFamily: "'Outfit', sans-serif", 
              fontSize: '18px',
              fontWeight: 900,
              color: 'var(--ink)',
              letterSpacing: '-0.04em'
            }}
          >
            KnoW<span style={{ color: 'var(--saffron)' }}>M</span>i
          </span>
        </div>
        <div className="w-6 h-6 rounded-full" style={{ background: 'var(--saffron-light)' }}>
          <div className="w-full h-full rounded-full flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </div>
        </div>
      </div>

      {/* Profile card */}
      <div className="flex-1 overflow-hidden px-3 pt-3 pb-1">
        {/* Avatar + name */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF9933, #E07A00)' }}>
            R
          </div>
          <div>
            <div className="text-[13px] font-bold" style={{ color: 'var(--ink)', fontFamily: 'Fraunces, serif' }}>Rahul Sharma</div>
            <div className="text-[10px]" style={{ color: 'var(--ink3)' }}>Product Designer · Delhi</div>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green-india)' }} />
              <span className="text-[9px]" style={{ color: 'var(--green-india)', fontFamily: 'JetBrains Mono, monospace' }}>247 scans this week</span>
            </div>
          </div>
        </div>

        {/* QR code area */}
        <div className="rounded-2xl p-3 mb-2.5 relative" style={{ background: 'var(--off)', border: '1px solid var(--border)' }}>
          <div className="w-full aspect-square max-w-[100px] mx-auto relative">
            <QRPattern />
            <div className="scan-line" />
          </div>
          <div className="text-center mt-2">
            <div className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'var(--ink4)', fontFamily: 'JetBrains Mono, monospace' }}>Scan to Connect</div>
          </div>
        </div>

        {/* Social links */}
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          {[
            { icon: 'in', label: 'LinkedIn', color: '#0077B5' },
            { icon: 'ig', label: 'Instagram', color: '#E1306C' },
            { icon: 'tw', label: 'Twitter', color: '#1DA1F2' },
          ].map(s => (
            <div key={s.label} className="rounded-xl py-1.5 px-1 text-center cursor-pointer transition-transform hover:scale-95 active:scale-90"
              style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
              <div className="text-[10px] font-bold" style={{ color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>{s.icon}</div>
              <div className="text-[8px] mt-0.5" style={{ color: 'var(--ink3)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scan counter */}
        <div className="rounded-xl px-3 py-2 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(255,153,51,0.08), rgba(255,153,51,0.03))', border: '1px solid rgba(255,153,51,0.2)' }}>
          <div>
            <div className="text-[10px]" style={{ color: 'var(--ink3)' }}>Total Scans</div>
            <div className="text-[18px] font-bold" style={{ fontFamily: 'Fraunces, serif', color: 'var(--saffron)' }}>1,247</div>
          </div>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--saffron-light)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="px-4 py-2 flex justify-around border-t border-[var(--border2)]">
        {[
          { icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', active: true },
          { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', active: false },
          { icon: 'M18 20V10M12 20V4M6 20v-6', active: false },
        ].map((n, i) => (
          <div key={i} className="p-1.5 rounded-lg" style={{ background: n.active ? 'var(--saffron-light)' : 'transparent' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={n.active ? 'var(--saffron)' : 'var(--ink4)'}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={n.icon} />
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PhoneMockup({ className = '' }) {
  const containerRef = useRef(null)
  const [rotation, setRotation] = useState({ x: 3, y: -8 })
  const [isHovering, setIsHovering] = useState(false)
  const animFrameRef = useRef(null)
  const targetRef = useRef({ x: 3, y: -8 })
  const currentRef = useRef({ x: 3, y: -8 })

  // Smooth lerp animation loop
  useEffect(() => {
    const animate = () => {
      const lerp = isHovering ? 0.08 : 0.03
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerp
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerp
      setRotation({ x: currentRef.current.x, y: currentRef.current.y })
      animFrameRef.current = requestAnimationFrame(animate)
    }
    animFrameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [isHovering])

  // Idle floating animation when not hovered
  useEffect(() => {
    if (isHovering) return
    let t = 0
    const idle = setInterval(() => {
      t += 0.02
      targetRef.current = {
        x: 3 + Math.sin(t) * 4,
        y: -8 + Math.cos(t * 0.7) * 3,
      }
    }, 50)
    return () => clearInterval(idle)
  }, [isHovering])

  const handleMouseMove = useCallback((e) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    targetRef.current = {
      x: -dy * 15,
      y: dx * 15,
    }
  }, [])

  const handleMouseEnter = useCallback(() => setIsHovering(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    targetRef.current = { x: 3, y: -8 }
  }, [])

  // Touch support for mobile
  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0]
    if (!touch || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (touch.clientX - cx) / (rect.width / 2)
    const dy = (touch.clientY - cy) / (rect.height / 2)
    targetRef.current = {
      x: Math.max(-15, Math.min(15, -dy * 15)),
      y: Math.max(-15, Math.min(15, dx * 15)),
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      style={{ perspective: '1000px', cursor: 'grab' }}
      aria-label="PehchaanTee app demo on smartphone — move your cursor to rotate"
    >
      <div
        className="relative"
        style={{
          width: '260px',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isHovering ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {/* Reflection / shadow beneath phone */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2"
          style={{
            width: '180px',
            height: '30px',
            background: 'radial-gradient(ellipse, rgba(255,153,51,0.25) 0%, transparent 70%)',
            filter: 'blur(12px)',
            zIndex: -1,
          }}
          aria-hidden="true"
        />

        {/* Phone outer frame */}
        <div
          className="relative rounded-[42px] p-[3px]"
          style={{
            background: 'linear-gradient(160deg, #2a2a35 0%, #0a0a0f 50%, #1a1a25 100%)',
            boxShadow: `
              0 40px 80px rgba(0,0,0,0.5),
              0 20px 40px rgba(0,0,0,0.3),
              inset 0 1px 0 rgba(255,255,255,0.1),
              0 0 0 1px rgba(255,255,255,0.05)
            `,
          }}
        >
          {/* Metallic rim highlight */}
          <div
            className="absolute inset-0 rounded-[42px] pointer-events-none"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)',
              zIndex: 2,
            }}
            aria-hidden="true"
          />

          {/* Specular highlight that moves with rotation */}
          <div
            className="absolute inset-0 rounded-[42px] pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at ${50 + rotation.y * 2}% ${50 - rotation.x * 2}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
              zIndex: 3,
            }}
            aria-hidden="true"
          />

          {/* Side buttons */}
          <div className="absolute right-0 top-20 w-0.5 h-16 rounded-l-full"
            style={{ background: 'linear-gradient(180deg, #3a3a4a, #1a1a25)', marginRight: '-1px' }}
            aria-hidden="true" />
          <div className="absolute left-0 top-24 w-0.5 h-8 rounded-r-full"
            style={{ background: 'linear-gradient(180deg, #3a3a4a, #1a1a25)', marginLeft: '-1px' }}
            aria-hidden="true" />
          <div className="absolute left-0 top-36 w-0.5 h-8 rounded-r-full"
            style={{ background: 'linear-gradient(180deg, #3a3a4a, #1a1a25)', marginLeft: '-1px' }}
            aria-hidden="true" />

          {/* Inner bezel */}
          <div className="rounded-[39px] overflow-hidden bg-[#0a0a0f] p-[6px]">
            {/* Notch/Dynamic Island */}
            <div className="relative">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full z-10 flex items-center justify-center gap-1"
                style={{ background: '#0a0a0f' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1a1a25' }} />
                <div className="w-8 h-1.5 rounded-full" style={{ background: '#1a1a25' }} />
              </div>
            </div>

            {/* Screen */}
            <div className="rounded-[34px] overflow-hidden" style={{ height: '520px' }}>
              <PhoneScreen />
            </div>
          </div>
        </div>

        {/* Subtle reflection on desk surface */}
        <div
          className="absolute top-full left-0 right-0 rounded-[42px]"
          style={{
            height: '80px',
            background: 'linear-gradient(180deg, rgba(255,153,51,0.08) 0%, transparent 100%)',
            transform: 'scaleY(-0.3) translateY(-100%)',
            filter: 'blur(4px)',
            opacity: 0.4,
            zIndex: -1,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
