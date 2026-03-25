'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { api } from '../lib/api';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! 👋 I'm your Alumni Assistant. Ask me about **events**, **jobs**, or how to **register**!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const data = await api.post('/chat', { message: userMsg.text });
            const botMsg = {
                id: Date.now() + 1,
                text: data.reply || "I'm having trouble connecting right now.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting to the server.",
                sender: 'bot',
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Simple markdown parser for bold text
    const formatText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-all z-50 flex items-center justify-center hover:scale-110 active:scale-95"
                style={{ width: '60px', height: '60px' }}
                aria-label="Toggle Chat"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 bg-white rounded-xl shadow-2xl z-50 flex flex-col border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
                    style={{ width: '380px', height: '500px', maxHeight: '80vh' }}
                >
                    {/* Header */}
                    <div className="bg-primary p-4 text-white flex items-center gap-2">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">Alumni Assistant</h3>
                            <p className="text-xs text-white/80">Always here to help</p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-primary text-white rounded-br-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                        } ${msg.isError ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
                                >
                                    {formatText(msg.text)}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-lg rounded-bl-none border border-gray-100 shadow-sm flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about events, jobs..."
                            className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
