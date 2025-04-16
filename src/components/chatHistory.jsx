import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Link } from 'react-router-dom'
import { FiMessageSquare, FiUser, FiCpu, FiClock, FiCalendar, FiLoader } from 'react-icons/fi'

// Initialize Supabase client
const supabaseUrl = 'https://wvjuhrxgibiyukzxedrc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2anVocnhnaWJpeXVrenhlZHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjAxNDcsImV4cCI6MjA1OTY5NjE0N30.L6OKP_dVbvZvlvRQJc7APcu3MbP1aWBmzrMiCA7nxf0'
const supabase = createClient(supabaseUrl, supabaseKey)

const ChatHistory = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          throw new Error('User not authenticated');
        }

        // Fetch messages with created_at field for sorting
        const { data, error: fetchError } = await supabase
          .from('chat_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        // Group messages by conversation (using date as a simple way to group them)
        // This is a simple approach - for more sophisticated grouping you might need additional fields
        const conversationGroups = [];
        let currentDate = null;
        let currentGroup = [];

        data.forEach(message => {
          const messageDate = new Date(message.created_at).toLocaleDateString();

          if (messageDate !== currentDate) {
            if (currentGroup.length > 0) {
              conversationGroups.push({
                date: currentDate,
                messages: [...currentGroup]
              });
            }
            currentDate = messageDate;
            currentGroup = [message];
          } else {
            currentGroup.push(message);
          }
        });

        // Add the last group
        if (currentGroup.length > 0) {
          conversationGroups.push({
            date: currentDate,
            messages: currentGroup
          });
        }

        setConversations(conversationGroups);
      } catch (err) {
        console.error('Error fetching chat history:', err);
        setError(err.message || 'Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-gray-900 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Chat History</h1>
          <p className="text-gray-400">Your previous conversations with Buis-Bot</p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin h-8 w-8 text-blue-500" />
            <span className="ml-2 text-gray-300">Loading conversations...</span>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <FiMessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-300 mb-4">You don't have any chat history yet.</p>
            <Link to="/chatbot" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition duration-300">
              Start a Conversation
            </Link>
          </div>
        ) : (
          // Display conversation groups
          <div className="space-y-8">
            {conversations.map((convo, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="bg-gray-700 px-4 py-3 flex items-center">
                  <FiCalendar className="text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-white">{formatDate(convo.date)}</h3>
                </div>

                <div className="p-4">
                  <div className="space-y-4">
                    {convo.messages.map((message, msgIndex) => (
                      <div
                        key={msgIndex}
                        className={`flex items-start space-x-3 p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-gray-700/50'
                            : 'bg-gray-700'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-md ${
                          message.sender === 'user'
                            ? 'bg-gray-600'
                            : 'bg-indigo-600'
                          } flex items-center justify-center`}
                        >
                          {message.sender === 'user'
                            ? <FiUser className="text-white h-5 w-5" />
                            : <FiCpu className="text-white h-5 w-5" />
                          }
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-1">
                            <p className="text-sm font-medium text-gray-300">
                              {message.sender === 'user' ? 'You' : 'Buis-Bot'}
                            </p>
                            <span className="ml-2 text-xs text-gray-500 flex items-center">
                              <FiClock className="mr-1 h-3 w-3" /> {formatTime(message.created_at)}
                            </span>
                          </div>
                          <p className="text-gray-300 whitespace-pre-wrap break-words">
                            {message.message_text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Button to start a new conversation */}
        {!loading && !error && conversations.length > 0 && (
          <div className="mt-8 text-center">
            <Link to="/chatbot" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-lg transition duration-300">
              Start a New Conversation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
