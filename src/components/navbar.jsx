import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

// Use environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const navbar = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center space-x-4">
          <img
            src="https://your-business-logo-url.com/logo.png"
            alt="Buis-Bot Logo"
            className="h-10"
          />
          <h1 className="text-white text-2xl font-bold">Buis-Bot</h1>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-8">
          <li>
            <Link to="/" className="text-gray-300 hover:text-blue-400 font-medium transition duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/profile" className="text-gray-300 hover:text-blue-400 font-medium transition duration-300">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/history" className="text-gray-300 hover:text-blue-400 font-medium transition duration-300">
              History
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-gray-300 hover:text-blue-400 font-medium transition duration-300">
              About
            </Link>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Link to="/chatbot">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              Chat Now
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0010.707 2H4a1 1 0 00-1 1zm9 2.5V5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1.5a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5zm1 3V9a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v1.5a.5.5 0 00.5.5h1a.5.5 0 00.5-.5zm0 3v-1.5a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5V13a.5.5 0 00.5.5h1a.5.5 0 00.5-.5z" clipRule="evenodd" />
              <path d="M5 11.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5V13a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1.5z" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default navbar
