import React from 'react'
import { Link } from 'react-router-dom'

const NotAuthenticated = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center max-w-md">
        <div className="bg-red-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3V6a3 3 0 00-3-3H9a3 3 0 00-3 3v6a3 3 0 003 3h5.5a3 3 0 003-3V9a3 3 0 00-3-3h-3.5" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Authentication Required</h1>
        <p className="text-gray-300 mb-8">
          You need to log in to access this page. Please sign in to continue.
        </p>

        <Link to="/login">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 w-full">
            Sign In
          </button>
        </Link>
      </div>
    </div>
  )
}

export default NotAuthenticated
