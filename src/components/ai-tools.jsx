import React from 'react'

const AITools = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-6">AI Tools</h1>
      <p className="text-lg text-gray-300 text-center max-w-2xl">
        Leverage AI-powered tools to automate tasks, generate insights, and enhance productivity.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-blue-400">Chatbot</h2>
          <p className="text-lg text-gray-300">Engage with customers using our intelligent chatbot.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-blue-400">Predictive Analytics</h2>
          <p className="text-lg text-gray-300">Forecast trends and make data-driven decisions.</p>
        </div>
      </div>
    </div>
  )
}

export default AITools
