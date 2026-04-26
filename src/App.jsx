import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import PublicProfile from './pages/PublicProfile'
import Admin from './pages/Admin'
import ScanHandler from './pages/ScanHandler'
import About from './pages/About'
import Blog from './pages/Blog'
import PressKit from './pages/PressKit'
import Legal from './pages/Legal'
import TrackOrder from './pages/TrackOrder'
import Shop from './pages/Shop'
import Leaderboard from './pages/Leaderboard'
import VerifyBubble from './components/VerifyBubble'

export default function App() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const pendingAuthType = localStorage.getItem('pending_auth_type')
        const isNewUser = (new Date() - new Date(session.user.created_at)) < 10000 // Created in last 10s

        if (pendingAuthType === 'signup' && !isNewUser) {
          alert('Hurry! You are already a Customer to Us')
        }
        
        localStorage.removeItem('pending_auth_type')

        // If we are coming back from an OAuth redirect (token in hash),
        // we clean the URL and let the current page (Home) handle the logged-in UI.
        if (window.location.hash.includes('access_token')) {
          window.location.hash = '' // Clean the URL
          window.location.reload() // Refresh to update Home page buttons
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/analytics" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/s/:code" element={<ScanHandler />} />
        <Route path="/p/:username" element={<PublicProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/press" element={<PressKit />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
      <VerifyBubble />
    </Router>
  )
}
