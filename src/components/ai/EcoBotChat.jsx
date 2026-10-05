import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, MessageSquare, Bot, User, Trash2 } from 'lucide-react';
import { sendEcoBotMessage } from '../../services/api';

export default function EcoBotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: '👋 Hi there! I am **EcoBot**, your Gemini AI e-waste guide. Ask me how to wipe personal data, what points you will earn, or how to recycle safely!'
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const data = await sendEcoBotMessage(userMsg, messages);
      if (data?.reply) {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: 'I can help you with e-waste guidelines, data wiping, and point rewards!' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'I am currently operating in offline EcoBot mode. Feel free to ask about device recycling points or data wiping tips!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2.5 px-4 py-3 bg-gradient-to-r from-eco-600 to-emerald-600 hover:from-eco-500 hover:to-emerald-500 text-white font-semibold rounded-full shadow-2xl shadow-eco-500/40 hover:scale-105 transition-all duration-300 group border border-emerald-400/30"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-100 group-hover:rotate-12 transition-transform" />
          </div>
          <span className="text-sm">Ask EcoBot AI</span>
        </button>
      )}

      {isOpen && (
        <div className="w-96 glass-card rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-[520px] overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-eco-700 via-emerald-600 to-ocean-600 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  EcoBot Assistant <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                </h4>
                <p className="text-[10px] opacity-80 font-medium">Powered by Google Gemini 2.5</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setMessages([{ role: 'bot', text: 'Chat cleared! How can I assist your recycling journey?' }])}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/50 dark:bg-dark-900/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-eco-500/10 text-eco-600 dark:text-eco-400 flex items-center justify-center shrink-0 border border-eco-500/20">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-eco-600 text-white rounded-tr-none font-medium'
                      : 'bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-gray-700 shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-ocean-500/10 text-ocean-600 flex items-center justify-center shrink-0 border border-ocean-500/20">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-xs text-gray-400 font-medium">
                <Sparkles className="w-4 h-4 text-eco-500 animate-spin" />
                <span>EcoBot is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask EcoBot about e-waste disposal..."
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-gray-100 dark:bg-dark-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-eco-500/50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-eco-600 hover:bg-eco-500 text-white disabled:opacity-50 transition-colors shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
