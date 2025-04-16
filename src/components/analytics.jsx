import React from 'react'

const Analytics = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-6">Analytics</h1>
      <p className="text-lg text-gray-300 text-center max-w-2xl">
        Dive deep into your business data with advanced analytics and visualizations.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-blue-400">User Growth</h2>
          <p className="text-lg text-gray-300">Track the growth of your user base over time.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-blue-400">Engagement Metrics</h2>
          <p className="text-lg text-gray-300">Analyze how users interact with your platform.</p>
        </div>
      </div>
    </div>
  )
}

export default Analytics
