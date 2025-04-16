import './App.css'
import Navbar from './components/navbar'
import Home from './components/home'
import Chatbot from './components/chatbot'
import Welcome from './components/welcome'
import Profile from './components/profile'
import Login from './components/login'
import BusinessForm from './components/businessForm'
import NotAuthenticated from './components/notAuthenticated'
import About from './components/about' // Import the new About component
import ChatHistory from './components/chatHistory' // Add this import
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://wvjuhrxgibiyukzxedrc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2anVocnhnaWJpeXVrenhlZHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjAxNDcsImV4cCI6MjA1OTY5NjE0N30.L6OKP_dVbvZvlvRQJc7APcu3MbP1aWBmzrMiCA7nxf0'
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [user, setUser] = useState(null)
  const [userBusinessInfo, setUserBusinessInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      setLoading(true)
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        // Set user from session if exists
        if (session) {
          setUser(session.user)

          // Check if business info exists for this user
          const { data: businessInfo, error: businessError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (businessError) {
            if (businessError.code !== 'PGRST116') { // Not found error
              console.error('Error checking business info:', businessError)
            }
          } else {
            setUserBusinessInfo(businessInfo)
          }
        }

        // Set up auth state listener
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (_event, session) => {
            const currentUser = session?.user || null
            setUser(currentUser)

            if (currentUser) {
              const { data } = await supabase
                .from('users')
                .select('*')
                .eq('id', currentUser.id)
                .single()

              setUserBusinessInfo(data || null)
            } else {
              setUserBusinessInfo(null)
            }
          }
        )

        setAuthChecked(true)
        return () => subscription.unsubscribe()
      } catch (error) {
        console.error('Auth error:', error)
        setAuthChecked(true)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  // Show loading state while checking authentication
  if (loading && !authChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl p-4 rounded-lg bg-gray-800 shadow-lg">
          <p className="mb-2">Loading...</p>
          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Always show login for unauthenticated users */}
        <Route
          path="/login"
          element={
            !user ? (
              <Login />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Protect all other routes */}
        <Route
          path="/"
          element={
            user ? (
              userBusinessInfo ? (
                <>
                  <Navbar />
                  <Home />
                </>
              ) : (
                <Navigate to="/business-form" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/business-form"
          element={
            user ? (
              userBusinessInfo ? <Navigate to="/welcome" /> : <BusinessForm />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/welcome"
          element={
            user ? (
              userBusinessInfo ? <Welcome /> : <Navigate to="/business-form" />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              userBusinessInfo ? (
                <>
                  <Navbar />
                  <Profile />
                </>
              ) : (
                <Navigate to="/business-form" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/chatbot"
          element={
            user ? (
              userBusinessInfo ? (
                <>
                  <Navbar />
                  <Chatbot />
                </>
              ) : (
                <Navigate to="/business-form" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Add About route */}
        <Route
          path="/about"
          element={
            user ? (
              userBusinessInfo ? (
                <>
                  <Navbar />
                  <About />
                </>
              ) : (
                <Navigate to="/business-form" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/history"
          element={
            user ? (
              userBusinessInfo ? (
                <>
                  <Navbar />
                  <ChatHistory />
                </>
              ) : (
                <Navigate to="/business-form" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all other routes and redirect to NotAuthenticated if not logged in */}
        <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
