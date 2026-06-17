import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, User, Bot, Loader2, ArrowRight } from 'lucide-react';
import { analyzeSymptomsAI } from '../../../services/api';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const AIChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Welcome to your Gemini AI Health Assistant. Please detail your symptoms, and I will immediately evaluate medical departments and immediate care workflows for you.",
      specialization: null,
      urgency: null
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    const query = input.trim();
    if (!query) return;

    // Append user message
    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await analyzeSymptomsAI(query);
      
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.advice,
        specialization: data.recommendedSpecialization,
        urgency: data.urgencyLevel,
        provider: data.aiProvider
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "I encountered a network interrupt. Please attempt again or directly reference standard clinical routing."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const bg = dark ? '#0d1526' : '#ffffff';
  const border = dark ? 'rgba(255,255,255,0.07)' : 'rgba(37,99,235,0.1)';
  const textCol = dark ? '#f1f5f9' : '#0f172a';
  const muted = dark ? '#64748b' : '#94a3b8';
  const innerBg = dark ? '#060b18' : '#f0f5ff';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger Launcher */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{ 
            width: 60, 
            height: 60, 
            background: "#2563eb", 
            borderRadius: 20, 
            border: "none", 
            color: "#fff", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            boxShadow: "0 10px 40px rgba(37,99,235,0.4)", 
            cursor: 'pointer',
            position: 'relative'
          }}
          className="hover:scale-110 transition-transform duration-200"
        >
          <Bot size={28} />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500"></span>
          </span>
        </button>
      )}

      {/* Main Expanded Window */}
      {isOpen && (
        <div 
          style={{
            width: 'calc(100vw - 40px)',
            maxWidth: '440px',
            height: '600px',
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: '32px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 1000
          }} 
          className="animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header Panel */}
          <div style={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0891b2 100%)', 
            padding: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            color: '#fff', 
            position: 'relative' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 16, 
                background: 'rgba(255,255,255,0.15)', 
                backdropFilter: 'blur(10px)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <Sparkles size={24} className="text-white animate-pulse" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0, letterSpacing: '-0.01em' }}>Gemini AI</h3>
                  <span style={{ 
                    fontSize: 9, 
                    fontWeight: 900, 
                    background: 'rgba(255,255,255,0.2)', 
                    color: '#fff', 
                    padding: '2px 8px', 
                    borderRadius: 100, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em' 
                  }}>
                    Enterprise
                  </span>
                </div>
                <p style={{ fontSize: 10, opacity: 0.8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>
                  Clinical Diagnostic Engine
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Interactive Flow Area */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 20, 
            background: innerBg 
          }} className="scrollbar-thin">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    flexDirection: isUser ? 'row-reverse' : 'row'
                  }}
                >
                  {/* Entity Icon */}
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    background: isUser ? '#2563eb' : (dark ? '#1e293b' : '#ffffff'),
                    color: isUser ? '#ffffff' : (dark ? '#38bdf8' : '#2563eb'),
                    border: `1px solid ${border}`,
                    flexShrink: 0
                  }}>
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  {/* Chat Block */}
                  <div style={{
                    background: isUser ? '#2563eb' : (dark ? '#0d1526' : '#ffffff'),
                    color: isUser ? '#ffffff' : textCol,
                    border: isUser ? 'none' : `1px solid ${border}`,
                    borderRadius: isUser ? '20px 20px 0 20px' : '20px 20px 20px 0',
                    padding: '16px 20px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    lineHeight: 1.6,
                    fontSize: '15px'
                  }}>
                    <p style={{ margin: 0, fontWeight: 500, whiteSpace: 'pre-line' }}>{msg.text}</p>

                    {/* Supplemental Meta mapping */}
                    {msg.specialization && (
                      <div style={{ 
                        marginTop: 16, 
                        paddingTop: 16, 
                        borderTop: `1px solid ${isUser ? 'rgba(255,255,255,0.1)' : border}`, 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                          <span style={{ fontSize: 12, opacity: 0.7 }}>Mapped Facility:</span>
                          <span style={{ 
                            fontSize: 12, 
                            fontWeight: 800, 
                            color: '#2563eb', 
                            background: 'rgba(37,99,235,0.08)', 
                            padding: '4px 10px', 
                            borderRadius: 8 
                          }}>
                            {msg.specialization}
                          </span>
                        </div>
                        {msg.urgency && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                            <span style={{ fontSize: 12, opacity: 0.7 }}>Priority Index:</span>
                            <span style={{ 
                              fontSize: 11, 
                              fontWeight: 900, 
                              padding: '4px 10px', 
                              borderRadius: 8,
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                              background: msg.urgency === 'HIGH' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                              color: msg.urgency === 'HIGH' ? '#ef4444' : '#22c55e'
                            }}>
                              {msg.urgency}
                            </span>
                          </div>
                        )}
                        <div style={{ marginTop: 8 }}>
                          <Link
                            to="/patient/search"
                            state={{ searchQuery: msg.specialization }}
                            onClick={() => setIsOpen(false)}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              gap: 8, 
                              fontSize: 12, 
                              fontWeight: 800, 
                              color: '#fff', 
                              background: '#2563eb', 
                              padding: '10px 16px', 
                              borderRadius: 12, 
                              textDecoration: 'none',
                              transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                          >
                            <span>Discover {msg.specialization}</span>
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Dynamic Loader */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: muted, paddingLeft: 48 }}>
                <Loader2 size={16} className="animate-spin" style={{ color: '#2563eb' }} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>Evaluating diagnostic profiles...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Secure Message Console Input */}
          <div style={{ 
            padding: '16px 24px', 
            background: bg, 
            borderTop: `1px solid ${border}`, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12 
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe symptoms (e.g. fever, chest pain)..."
              style={{ 
                flex: 1, 
                padding: '14px 20px', 
                borderRadius: 16, 
                background: dark ? 'rgba(255,255,255,0.03)' : '#f8fafc', 
                border: `1px solid ${border}`, 
                color: textCol, 
                fontSize: 15, 
                fontWeight: 600,
                outline: 'none',
                transition: 'border-color 0.2s' 
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = border}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 16, 
                background: '#2563eb', 
                color: '#fff', 
                border: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                opacity: !input.trim() ? 0.5 : 1,
                boxShadow: input.trim() ? '0 4px 15px rgba(37,99,235,0.3)' : 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { if (input.trim()) e.target.style.transform = 'scale(1.05)' }}
              onMouseLeave={(e) => { e.target.style.transform = 'scale(1)' }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbotWidget;
