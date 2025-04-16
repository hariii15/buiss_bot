import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const welcome = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Automatically navigate to home page after 2 seconds
    const timer = setTimeout(() => {
      navigate('/')
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-800 to-gray-900 animate-fade-in">
      <img
        src="https://your-business-logo-url.com/logo.png"
        alt="Business Logo"
        className="h-20 mb-6 animate-bounce"
      />
      <h1 className="text-6xl font-extrabold text-white animate-fade-in">Welcome to Buis-Bot</h1>
      <p className="mt-4 text-2xl text-gray-400 animate-fade-in-delayed">Your AI-powered business assistant.</p>
    </div>
  )
}

export default welcome
