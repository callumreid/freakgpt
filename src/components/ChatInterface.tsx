'use client';

import { useState, useRef, useEffect } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Hey there, gorgeous 😉. You've found FreakGPT – the naughtier cousin of ChatGPT. I'm here to answer your questions... with a twist. So, what can I do for you today? 😏",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.reply && data.reply.content) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.reply.content,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "Oops, I'm feeling a bit speechless right now 😳 Try me again, baby... I promise I'll be more responsive next time 😈",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "👋 Hey there, gorgeous 😉. You've found FreakGPT – the naughtier cousin of ChatGPT. I'm here to answer your questions... with a twist. So, what can I do for you today? 😏",
        timestamp: new Date(),
      }
    ]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">😈</div>
          <div>
            <h1 className="text-xl font-bold text-pink-400">FreakGPT</h1>
            <p className="text-xs text-gray-400">Like ChatGPT... but a little freaky</p>
          </div>
        </div>
        <button
          onClick={handleNewChat}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          New Chat
        </button>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  😈
                </div>
              )}
              
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-pink-600 text-white rounded-tr-sm'
                    : 'bg-gray-800 text-gray-100 rounded-tl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  U
                </div>
              )}
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                😈
              </div>
              <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-800 bg-gray-900 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-end space-x-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask FreakGPT anything... I don't bite... much 😈"
            className="flex-1 resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent max-h-32 min-h-[44px]"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors duration-200"
          >
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <div className="max-w-3xl mx-auto mt-2">
          <p className="text-xs text-gray-500 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}