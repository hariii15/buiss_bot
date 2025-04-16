import React from 'react'
import { Link } from 'react-router-dom'
import { FiUser, FiMessageSquare, FiInfo } from 'react-icons/fi'; // Added icons

const home = () => {
  return (
    // Adjusted height and added padding
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-900 to-gray-800 bg-fixed p-6 text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white max-w-4xl leading-tight mb-6">
        Welcome to Buis-Bot
      </h1>
      <p className="mt-2 text-lg md:text-xl text-gray-300 max-w-2xl mb-10">
        Your AI-powered assistant for smarter business decisions and insights. Access your profile or chat with the bot.
      </p>
      {/* Simplified main action buttons */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Link to="/profile">
          <button className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center text-lg">
            <FiUser className="mr-2 h-5 w-5"/> View Profile
          </button>
        </Link>
        <Link to="/chatbot">
          <button className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 flex items-center justify-center text-lg">
             <FiMessageSquare className="mr-2 h-5 w-5"/> Start Chat
          </button>
        </Link>
         <Link to="/about">
          <button className="w-full sm:w-auto bg-gray-700 text-gray-100 px-8 py-3 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300 flex items-center justify-center text-lg">
             <FiInfo className="mr-2 h-5 w-5"/> About App
          </button>
        </Link>
        {/* Removed Analytics button */}
        {/* <Link to="/analytics"> ... </Link> */}
        {/* Removed AI Tools button */}
        {/* <Link to="/ai-tools"> ... </Link> */}
      </div>
      {/* Removed the fixed chat widget as there's a main button now */}
      {/* <div className="fixed bottom-4 right-4 ..."> ... </div> */}
    </div>
  )
}

export default home
