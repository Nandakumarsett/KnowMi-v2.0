import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ScanHandler() {
  const { code } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const recordScan = async () => {
      if (!code) return

      try {
        // 1. Find the profile associated with this referral/QR code
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, user_id, first_name')
          .or(`wm_code.ilike.${code},wm_code.ilike.PT-${code},wm_code.ilike.WM-${code},first_name.ilike.${code},persona_data->>public_slug.eq.${code.toLowerCase()}`)
          .single()

        if (profileError || !profile) {
          console.error('Profile not found for code:', code)
          navigate('/')
          return
        }

        // 2. Capture basic device/location info (simplified for now)
        const userAgent = navigator.userAgent
        const isIOS = /iPad|iPhone|iPod/.test(userAgent)
        const isAndroid = /Android/.test(userAgent)
        
        let device = 'Other'
        if (isIOS) device = 'iPhone'
        else if (isAndroid) device = 'Android'

        // 3. Log the scan in the database
        await supabase.from('scans').insert({
          profile_id: profile.id,
          device: device,
          browser: navigator.appName,
          os: navigator.platform
        })

        // 4. Redirect to the user's public profile page with QR source flag
        navigate(`/p/${code}?src=qr`)
      } catch (err) {
        console.error('Error logging scan:', err)
        navigate('/')
      }
    }

    recordScan()
  }, [code, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[var(--sf)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-bold tracking-widest uppercase text-xs">Connecting to Identity...</p>
      </div>
    </div>
  )
}
