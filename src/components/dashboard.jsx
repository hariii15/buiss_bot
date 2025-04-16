import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://wvjuhrxgibiyukzxedrc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2anVocnhnaWJpeXVrenhlZHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjAxNDcsImV4cCI6MjA1OTY5NjE0N30.L6OKP_dVbvZvlvRQJc7APcu3MbP1aWBmzrMiCA7nxf0'
const supabase = createClient(supabaseUrl, supabaseKey)

const Dashboard = () => {
  const [formData, setFormData] = useState({ name: '', email: '', business: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const { data, error } = await supabase.from('users').insert([formData])
      if (error) {
        console.error('Supabase Error:', error)
        throw error
      }
      console.log('Supabase Response:', data)
      setMessage('Data submitted successfully!')
      setFormData({ name: '', email: '', business: '' }) // Reset form
    } catch (error) {
      setMessage('Error submitting data: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-6">Dashboard</h1>
      <p className="text-lg text-gray-300 text-center max-w-2xl mb-8">
        Enter your business details to get started with personalized insights.
      </p>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <div>
          <label htmlFor="name" className="block text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-100"
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-100"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="business" className="block text-gray-300 mb-2">
            Business Name
          </label>
          <input
            type="text"
            id="business"
            name="business"
            value={formData.business}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-100"
            placeholder="Enter your business name"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-3 rounded-lg ${
            isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition duration-300`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {message && <p className="mt-4 text-gray-300">{message}</p>}
    </div>
  )
}

export default Dashboard
