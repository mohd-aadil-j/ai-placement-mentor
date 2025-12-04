import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classroomApi } from '../api/classroomApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatMessage } from '../utils/messageFormatter';

const assistantConfig = {
  technical: {
    name: 'Technical Interview Trainer',
    icon: '🎓',
    color: 'blue',
    description: 'Master DSA, System Design, OOP, and technical concepts',
    gradient: 'from-blue-600 to-indigo-600',
  },
  coding: {
    name: 'Coding Practice Coach',
    icon: '💻',
    color: 'green',
    description: 'Practice live coding, debugging, and problem-solving',
    gradient: 'from-green-600 to-emerald-600',
  },
  aptitude: {
    name: 'Aptitude & Reasoning Expert',
    icon: '🧮',
    color: 'purple',
    description: 'Master quantitative, logical, and verbal reasoning',
    gradient: 'from-purple-600 to-pink-600',
  },
};

const ClassroomAssistant = () => {
  const { assistantType } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [file, setFile] = useState(null);

  const config = assistantConfig[assistantType];

  useEffect(() => {
    if (!config) {
      navigate('/classroom');
      return;
    }
    fetchHistory();
  }, [assistantType]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const response = await classroomApi.getConversationHistory(assistantType);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await classroomApi.sendMessage(assistantType, userMessage, messages, file);
      const assistantMessage = {
        role: `${assistantType}_assistant`,
        content: response.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: `${assistantType}_assistant`,
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!confirm('Clear all conversation history with this assistant?')) return;
    try {
      await classroomApi.clearConversation(assistantType);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing conversation:', error);
      alert('Failed to clear conversation');
    }
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className={`bg-gradient-to-r ${config.gradient} text-white rounded-t-lg p-6`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/classroom')}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ←
            </button>
            <span className="text-4xl">{config.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{config.name}</h1>
              <p className="text-sm opacity-90">{config.description}</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-sm"
            >
              Clear Chat
            </button>
          )}
        </div>
      </div>

      <style>{`
        .assistant-message {
          line-height: 1.7;
        }
        .assistant-message strong {
          font-weight: 600;
          color: #1e40af;
        }
        .assistant-message em {
          font-style: italic;
          color: #4b5563;
        }
        .assistant-message code {
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        .assistant-message div[class*="ml-4"] {
          line-height: 1.8;
        }
        .assistant-message div[class*="bg-blue-50"] {
          margin: 0.75rem 0;
        }
        .assistant-message div[class*="bg-green-50"] {
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
              <p className="text-lg mb-4">{config.icon} Hello! I'm your {config.name}.</p>
              <p className="text-sm mb-6">I'm here to help you prepare for placement interviews.</p>
              <div className="max-w-2xl mx-auto grid gap-3 text-left">
                {assistantType === 'technical' && (
                  <>
                    <div className="bg-blue-50 p-3 rounded">Ask me about Data Structures & Algorithms</div>
                    <div className="bg-blue-50 p-3 rounded">Discuss System Design concepts</div>
                    <div className="bg-blue-50 p-3 rounded">Learn OOP and Design Patterns</div>
                    <div className="bg-blue-50 p-3 rounded">Practice technical problem-solving</div>
                  </>
                )}
                {assistantType === 'coding' && (
                  <>
                    <div className="bg-green-50 p-3 rounded">Get help with coding problems</div>
                    <div className="bg-green-50 p-3 rounded">Debug and optimize your code</div>
                    <div className="bg-green-50 p-3 rounded">Learn coding patterns and templates</div>
                    <div className="bg-green-50 p-3 rounded">Practice for live coding rounds</div>
                  </>
                )}
                {assistantType === 'aptitude' && (
                  <>
                    <div className="bg-purple-50 p-3 rounded">Solve quantitative aptitude problems</div>
                    <div className="bg-purple-50 p-3 rounded">Practice logical reasoning</div>
                    <div className="bg-purple-50 p-3 rounded">Learn shortcuts and tricks</div>
                    <div className="bg-purple-50 p-3 rounded">Improve speed and accuracy</div>
                  </>
                )}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-4 ${
                      isUser
                        ? 'bg-gray-700 text-white'
                        : `bg-${config.color}-50 text-gray-800`
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!isUser && (
                        <span className="text-2xl">{config.icon}</span>
                      )}
                      <div className="flex-1">
                        {!isUser ? (
                          <div 
                            className="assistant-message whitespace-pre-wrap leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.content).replace(/\n/g, '<br/>') }}
                          />
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                        {msg.timestamp && (
                          <p className={`text-xs mt-2 ${isUser ? 'text-gray-300' : 'text-gray-500'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      {isUser && (
                        <span className="text-2xl">👤</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className={`bg-${config.color}-50 rounded-lg p-4 max-w-[75%]`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{config.icon}</span>
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
              placeholder="Type your question or paste your code..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className={`px-6 py-3 bg-${config.color}-600 text-white rounded-lg hover:bg-${config.color}-700 disabled:bg-gray-400 transition font-medium`}
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

export default ClassroomAssistant;
