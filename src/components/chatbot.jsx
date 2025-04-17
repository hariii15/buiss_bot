import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { FiSend, FiUser, FiCpu } from 'react-icons/fi'

// Use environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const chatbot = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState(null)
  const [businessContext, setBusinessContext] = useState(null)
  const messagesEndRef = useRef(null) // Ref for scrolling
  const [historyLoading, setHistoryLoading] = useState(true); // State for history loading

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    // Use timeout to ensure DOM is updated before scrolling
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  // Scroll to bottom whenever messages update
  useEffect(() => {
    // Scroll only after history is loaded and messages change
    if (!historyLoading) {
      scrollToBottom();
    }
  }, [messages, historyLoading]);

  // Get user data, business context, and chat history
  useEffect(() => {
    const initializeChat = async () => {
      setHistoryLoading(true); // Start loading history
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);

          // Fetch business context (parallel fetch)
          const contextPromise = supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          // Fetch chat history (parallel fetch)
          const historyPromise = supabase
            .from('chat_history')
            .select('sender, message_text')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

          const [contextResult, historyResult] = await Promise.all([contextPromise, historyPromise]);

          // Process business context
          if (contextResult.data && !contextResult.error) {
            setBusinessContext(contextResult.data);
          } else if (contextResult.error && contextResult.error.code !== 'PGRST116') {
            console.error("Error fetching business context:", contextResult.error);
          }

          // Process chat history
          if (historyResult.data && !historyResult.error) {
            const formattedHistory = historyResult.data.map(msg => ({
              sender: msg.sender,
              text: msg.message_text
            }));
            setMessages(formattedHistory);
          } else if (historyResult.error) {
            setMessages([]);
          } else {
             setMessages([]);
          }

        } else {
          setMessages([]);
        }
      } catch (err) {
        setMessages([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    initializeChat();
  }, []);

  // Function to save a message to the database
  const saveMessageToDb = async (sender, text) => {
    if (!userId) return; // Don't save if user ID is not set

    try {
      const { error } = await supabase
        .from('chat_history')
        .insert({
          user_id: userId,
          sender: sender,
          message_text: text
        });
      if (error) throw error;
    } catch (error) {
      console.error("Error saving message to DB:", error);
      // Optional: Add user feedback about saving error
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessageText = input;
    const userMessage = { sender: 'user', text: userMessageText }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    await saveMessageToDb('user', userMessageText);

    try {
      const currentUserId = userId || 'anonymous'

      let contextString = "User's Business Context:\n";
      if (businessContext) {
        contextString += `- Business Name: ${businessContext.business_name || 'N/A'}\n`;
        contextString += `- Business Type: ${businessContext.business_type || 'N/A'}\n`;
        contextString += `- Industry: ${businessContext.industry || 'N/A'}\n`;
        contextString += `- Company Size: ${businessContext.company_size || 'N/A'}\n`;
        contextString += `- Description: ${businessContext.business_description || 'N/A'}\n`;
        contextString += `- Goals: ${businessContext.goals || 'N/A'}\n`;
        contextString += `- Challenges: ${businessContext.challenges || 'N/A'}\n`;
      } else {
        contextString += "No business context available.\n";
      }

      const fullPrompt = `${contextString}\nUser Query: ${userMessageText}`;

      const response = await fetch('https://buis-bot.onrender.com/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUserId,
          prompt: fullPrompt,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json()
      await new Promise(resolve => setTimeout(resolve, 300));
      const botResponseText = data.answer || 'Sorry, I could not process that.';
      const botMessage = { sender: 'bot', text: botResponseText }
      setMessages((prev) => [...prev, botMessage])

      await saveMessageToDb('bot', botResponseText);

      await logUserInteraction(currentUserId, userMessageText, botResponseText)

    } catch (error) {
      const errorMessageText = `Error: ${error.message}. Please try again.`;
      const errorMessage = { sender: 'bot', text: errorMessageText }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Function to log user interactions to Supabase (optional)
  const logUserInteraction = async (userId, prompt, response) => {
    // Check if you have a 'chat_logs' table set up
    // try {
    //   const { error } = await supabase.from('chat_logs').insert([
    //     { user_id: userId, prompt, response } // Ensure columns match your table
    //   ])
    //   if (error) throw error
    // } catch (error) {
    //   console.error('Error logging interaction:', error)
    // }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-800 text-gray-100">
      <div className="flex-1 overflow-y-auto">
        {historyLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-400">Loading chat history...</div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-10 space-y-6 sm:space-y-8">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 sm:space-x-4 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center shadow">
                    <FiCpu className="text-white h-5 w-5" />
                  </div>
                )}
                <div
                  className={`p-3 sm:p-4 rounded-lg max-w-[90vw] sm:max-w-[80%] min-w-0 break-words shadow ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700'
                  }`}
                >
                  {message.text.split('\n').map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </div>
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gray-600 flex items-center justify-center shadow">
                    <FiUser className="text-white h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages.length > 0 && messages[messages.length - 1]?.sender === 'user' && (
              <div className="flex items-start space-x-2 sm:space-x-4 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center shadow">
                  <FiCpu className="text-white h-5 w-5" />
                </div>
                <div className="p-3 sm:p-4 rounded-lg bg-gray-700 shadow">
                  <div className="flex space-x-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <footer className="bg-gray-800 border-t border-gray-700 p-2 sm:p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center bg-gray-700 rounded-lg shadow-inner overflow-hidden">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              className="flex-1 p-3 sm:p-4 bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none resize-none text-base"
              placeholder="Send a message..."
              disabled={isLoading || historyLoading}
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || historyLoading || !input.trim()}
              className={`p-3 sm:p-4 ${
                isLoading || historyLoading || !input.trim()
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-gray-400 hover:text-gray-200'
              } transition duration-200`}
            >
              {isLoading ? (
                 <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              ) : (
                <FiSend className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default chatbot
