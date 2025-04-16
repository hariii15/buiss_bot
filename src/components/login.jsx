import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'

// Initialize Supabase client
const supabaseUrl = 'https://wvjuhrxgibiyukzxedrc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2anVocnhnaWJpeXVrenhlZHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjAxNDcsImV4cCI6MjA1OTY5NjE0N30.L6OKP_dVbvZvlvRQJc7APcu3MbP1aWBmzrMiCA7nxf0'
const supabase = createClient(supabaseUrl, supabaseKey)

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      setUser(user)

      // Check if the user has filled out business information
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error checking user data:', userError)
      }

      if (!existingUser) {
        navigate('/business-form')
      } else {
        navigate('/welcome')
      }
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      setMessage('Signup successful! Please check your email to confirm your account.')
    } catch (error) {
      setMessage('Error: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      // We'll check for the user's business info after sign-in
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}` // Let App.jsx handle the routing
        }
      })
      if (error) throw error
      setMessage('Redirecting to Google...')
    } catch (error) {
      console.error('Google Sign-In Error:', error)
      setMessage('Error: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-6">Login</h1>
      <form className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4" onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className="block text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-100"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-100"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 rounded-lg ${
            isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition duration-300`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <button
          onClick={handleSignup}
          disabled={isLoading}
          className={`w-full p-3 rounded-lg mt-2 ${
            isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          } text-white transition duration-300`}
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className={`w-full p-3 rounded-lg mt-4 ${
          isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
        } text-white transition duration-300`}
      >
        {isLoading ? 'Redirecting...' : 'Sign in with Google'}
      </button>
      {message && <p className="mt-4 text-gray-300">{message}</p>}
    </div>
  )
}

export default Login
