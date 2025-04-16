import React from 'react';
// Using more specific icons for clarity
import { FiInfo, FiUser, FiLink, FiCpu, FiDatabase, FiCode, FiZap, FiBarChart2, FiEdit2, FiLock } from 'react-icons/fi';

const About = () => {
  return (
    // Added more padding and adjusted min-height
    <div className="bg-gray-900 min-h-[calc(100vh-64px)] py-16 px-4 sm:px-6 lg:px-12 text-gray-300">
      <div className="max-w-5xl mx-auto space-y-16"> {/* Increased max-width and spacing */}

        {/* App Section */}
        <section className="bg-gray-800 shadow-xl rounded-lg p-8 md:p-10"> {/* Increased padding */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8"> {/* Adjusted alignment */}
            <FiCpu className="h-12 w-12 text-blue-400 mr-5 mb-4 sm:mb-0 flex-shrink-0" /> {/* Larger icon */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">About Buis-Bot</h1> {/* Adjusted size */}
              <p className="mt-1 text-lg text-blue-200">Your Intelligent Business Partner</p> {/* Added subtitle */}
            </div>
          </div>
          <p className="text-base md:text-lg mb-5 leading-relaxed"> {/* Adjusted size and leading */}
            Buis-Bot is an intelligent business assistant designed to empower users like you with AI-driven insights and tools. Our goal is to help you streamline operations, understand your data better, and make informed decisions for business growth.
          </p>
          <p className="text-base md:text-lg mb-8 leading-relaxed"> {/* Adjusted size and leading */}
            By leveraging advanced language models and integrating with your specific business context (provided during onboarding), Buis-Bot offers personalized advice, generates reports, answers queries, and assists with various business tasks.
          </p>
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Key Features:</h3>
            <ul className="space-y-3 text-gray-300"> {/* Increased spacing */}
              <li className="flex items-start">
                <FiZap className="h-5 w-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <span>Personalized AI Chat Assistant with Business Context Awareness</span>
              </li>
              <li className="flex items-start">
                <FiBarChart2 className="h-5 w-5 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                <span>Data Analytics and Visualization <span className="text-xs text-gray-500">(Coming Soon)</span></span>
              </li>
              <li className="flex items-start">
                <FiEdit2 className="h-5 w-5 text-purple-400 mr-3 mt-1 flex-shrink-0" />
                <span>AI-Powered Content Generation Tools <span className="text-xs text-gray-500">(Coming Soon)</span></span>
              </li>
              <li className="flex items-start">
                <FiLock className="h-5 w-5 text-red-400 mr-3 mt-1 flex-shrink-0" />
                <span>Secure User Authentication and Data Storage via Supabase</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Developer Section */}
        <section className="bg-gray-800 shadow-xl rounded-lg p-8 md:p-10"> {/* Increased padding */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8"> {/* Adjusted alignment */}
            <FiUser className="h-12 w-12 text-green-400 mr-5 mb-4 sm:mb-0 flex-shrink-0" /> {/* Larger icon */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">About the Developer</h2>
              <p className="mt-1 text-lg text-green-200">Hari</p> {/* Added name subtitle */}
            </div>
          </div>
          <p className="text-base md:text-lg mb-5 leading-relaxed"> {/* Adjusted size and leading */}
            This application was developed by Hari, a passionate software developer focused on creating useful and innovative web applications using modern technologies.
          </p>
          <p className="text-base md:text-lg mb-8 leading-relaxed"> {/* Adjusted size and leading */}
            Buis-Bot is a project aimed at exploring the practical applications of AI in the business domain, combining frontend and backend skills with cloud services.
          </p>
          <div className="space-y-5 border-t border-gray-700 pt-6"> {/* Increased spacing */}
            <div className="flex items-center">
              <FiLink className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
              <h3 className="text-base font-semibold text-white mr-3 w-28 flex-shrink-0">Portfolio:</h3> {/* Fixed width for alignment */}
              <a
                href="https://portfolio-final-virid-eta.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline transition duration-300 break-all text-sm md:text-base"
              >
                portfolio-final-virid-eta.vercel.app
              </a>
            </div>
            <div className="flex items-start sm:items-center"> {/* Adjusted alignment for wrapping */}
              <FiCode className="h-5 w-5 text-gray-400 mr-3 mt-1 sm:mt-0 flex-shrink-0" />
              <h3 className="text-base font-semibold text-white mr-3 w-28 flex-shrink-0">Tech Stack:</h3>
              <span className="text-gray-400 text-sm md:text-base">React, Supabase, Tailwind CSS, FastAPI (Backend), AI Models</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
