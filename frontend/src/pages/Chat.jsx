import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from '../api/chatApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatMessage } from '../utils/messageFormatter';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await chatApi.getConversationHistory();
        setMessages(response.messages || []);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to UI immediately
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await chatApi.sendMessage(userMessage, messages, file);
      
      // Add mentor response to UI
      const mentorMessage = {
        role: 'mentor',
        content: response.response,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, mentorMessage]);
      setFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'mentor',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-6">
        <h1 className="text-3xl font-bold mb-2">💬 Chat with Your Placement Mentor</h1>
        <p className="text-blue-100">Get personalized guidance for interviews, resume tips, and career advice</p>
      </div>

      <style>{`
        .mentor-message {
          line-height: 1.7;
        }
        .mentor-message strong {
          font-weight: 600;
          color: #1e40af;
        }
        .mentor-message em {
          font-style: italic;
          color: #4b5563;
        }
        .mentor-message code {
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        .mentor-message div[class*="ml-4"] {
          line-height: 1.8;
        }
        .mentor-message div[class*="bg-blue-50"] {
          margin: 0.75rem 0;
        }
        .mentor-message div[class*="bg-green-50"] {
          margin: 1rem 0;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="bg-white shadow-lg rounded-b-lg">
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-lg mb-4">👋 Hello! I'm your AI Placement Mentor.</p>
              <p className="text-sm">Ask me anything about:</p>
              <div className="mt-4 grid grid-cols-2 gap-3 max-w-md mx-auto text-left">
                <div className="bg-blue-50 p-3 rounded">📝 Resume tips</div>
                <div className="bg-green-50 p-3 rounded">💼 Interview prep</div>
                <div className="bg-purple-50 p-3 rounded">🎯 Career guidance</div>
                <div className="bg-yellow-50 p-3 rounded">💡 Skill development</div>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-4 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {msg.role === 'mentor' && (
                      <span className="text-2xl">🎓</span>
                    )}
                    <div className="flex-1">
                      {msg.role === 'mentor' ? (
                        <div 
                          className="mentor-message whitespace-pre-wrap leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content).replace(/\n/g, '<br/>') }}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                      {msg.timestamp && (
                        <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <span className="text-2xl">👤</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4 max-w-[75%]">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎓</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex gap-2 items-center">
            <label className="flex items-center px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
              📎
              <input
                type="file"
                className="hidden"
                accept=".txt,.pdf,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
            >
              Send
            </button>
          </div>
          {file && (
            <div className="mt-2 text-xs text-gray-600 flex items-center gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded">Attachment: {file.name}</span>
              <button type="button" onClick={() => setFile(null)} className="text-red-600">Remove</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Chat;
