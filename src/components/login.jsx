import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Use environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const Login = () => {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
      setMessage('Redirecting to Google...')
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center">
        <img
          src="https://your-business-logo-url.com/logo.png"
          alt="Buis-Bot Logo"
          className="h-16 mb-6"
        />
        <h1 className="text-4xl font-bold text-white mb-4">Sign in to Buis-Bot</h1>
        <p className="text-gray-400 mb-8 text-center">
          Welcome! Please sign in with your Google account to continue.
        </p>
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={`w-full flex items-center justify-center bg-white text-gray-800 font-semibold py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 mb-2 ${
            isLoading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          <svg className="h-6 w-6 mr-3" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.61l6.89-6.89C36.68 2.69 30.77 0 24 0 14.82 0 6.71 5.48 2.69 13.44l8.06 6.26C12.5 13.13 17.77 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.44c-.54 2.91-2.18 5.38-4.65 7.04l7.18 5.59C43.98 37.51 46.1 31.56 46.1 24.55z"/>
              <path fill="#FBBC05" d="M10.75 28.19c-1.13-3.36-1.13-6.97 0-10.33l-8.06-6.26C.91 15.1 0 19.41 0 24c0 4.59.91 8.9 2.69 12.4l8.06-6.21z"/>
              <path fill="#EA4335" d="M24 48c6.48 0 11.92-2.15 15.89-5.85l-7.18-5.59c-2.01 1.35-4.59 2.14-7.71 2.14-6.23 0-11.5-3.63-13.25-8.99l-8.06 6.21C6.71 42.52 14.82 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </g>
          </svg>
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
        {message && <p className="mt-4 text-gray-300 text-center">{message}</p>}
      </div>
    </div>
  )
}

export default Login
