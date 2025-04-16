import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'

// Initialize Supabase client
const supabaseUrl = 'https://wvjuhrxgibiyukzxedrc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2anVocnhnaWJpeXVrenhlZHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjAxNDcsImV4cCI6MjA1OTY5NjE0N30.L6OKP_dVbvZvlvRQJc7APcu3MbP1aWBmzrMiCA7nxf0'
const supabase = createClient(supabaseUrl, supabaseKey)

const BusinessForm = () => {
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    business_description: '',
    industry: '',
    company_size: '',
    goals: '',
    challenges: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user found')

      // Insert user data including their ID from auth
      const { error } = await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        business_name: formData.business_name,
        business_type: formData.business_type,
        business_description: formData.business_description,
        industry: formData.industry,
        company_size: formData.company_size,
        goals: formData.goals,
        challenges: formData.challenges
      })

      if (error) throw error

      setMessage('Business information saved successfully!')
      navigate('/welcome')
    } catch (error) {
      setMessage('Error saving business information: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-4xl font-bold text-white">Business Profile</h1>
          <p className="mt-2 text-blue-100">
            Help us personalize your experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="business_name" className="block text-gray-300 mb-2 font-medium">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="business_name"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                placeholder="Enter your business name"
                required
              />
            </div>

            <div>
              <label htmlFor="business_type" className="block text-gray-300 mb-2 font-medium">
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                id="business_type"
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                required
              >
                <option value="">Select business type</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="LLC">LLC</option>
                <option value="Corporation">Corporation</option>
                <option value="Nonprofit">Nonprofit</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="industry" className="block text-gray-300 mb-2 font-medium">
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                required
              >
                <option value="">Select industry</option>
                <option value="Technology">Technology</option>
                <option value="Retail">Retail</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="company_size" className="block text-gray-300 mb-2 font-medium">
                Company Size
              </label>
              <select
                id="company_size"
                name="company_size"
                value={formData.company_size}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501+">501+ employees</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="business_description" className="block text-gray-300 mb-2 font-medium">
              Business Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="business_description"
              name="business_description"
              value={formData.business_description}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 min-h-[100px]"
              placeholder="Enter a brief description of your business"
              required
            />
          </div>

          <div>
            <label htmlFor="goals" className="block text-gray-300 mb-2 font-medium">
              Business Goals
            </label>
            <textarea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
              placeholder="What are your main business goals?"
            />
          </div>

          <div>
            <label htmlFor="challenges" className="block text-gray-300 mb-2 font-medium">
              Business Challenges
            </label>
            <textarea
              id="challenges"
              name="challenges"
              value={formData.challenges}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
              placeholder="What challenges is your business facing?"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-lg text-lg font-medium ${
                isSubmitting
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/50'
              } text-white transition duration-300`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>

      {message && (
        <div className={`mt-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-800' : 'bg-green-700'} text-white shadow-lg`}>
          {message.includes('Error') ? (
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {message}
            </div>
          ) : (
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BusinessForm
