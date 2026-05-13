import React, { useState, useRef, useEffect } from 'react'
import { useBot } from '../hooks/useBot'
 
const Chatbot = () => {
  const { userMessage, setUserMessage, loading, handleChatWithAi } = useBot()
  const [threadId] = useState(() => `thread_${Date.now()}`)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const messageEndRef = useRef(null)
 
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
 
  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])
 
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!userMessage.trim()) return
 
    setError('')
    const userMsg = userMessage.trim()
    setUserMessage('')
 
    // Add user message to chat
    setMessages((prev) => [...prev, { type: 'user', content: userMsg }])
 
    try {
      const response = await handleChatWithAi({ userMessage: userMsg, threadId })
      // Add AI response directly after getting it
      setMessages((prev) => [...prev, { type: 'ai', content: response.AiResult }])
    } catch (err) {
      setError('Failed to get response. Please try again.')
      console.error(err)
    }
  }
 
  return (
  <div className="flex flex-col h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1410] to-[#0a0a0a]">

    {/* Messages Container */}
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 lg:w-[60%] lg:mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

      {messages.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              Your <span className="text-[#f5a623] italic">learning hub</span>.
            </h2>
            <p className="text-gray-400">
              Resumes, mock interviews, and focused practice — all in one calm workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
            {[
              {
                icon: "📋",
                title: "Interview preparation",
                desc: "Practice common questions and scenarios",
              },
              {
                icon: "✍️",
                title: "Resume optimization",
                desc: "Get feedback on your resume content",
              },
              {
                icon: "🎯",
                title: "Career guidance",
                desc: "Navigate your professional journey",
              },
              {
                icon: "💻",
                title: "Technical concepts",
                desc: "Understand complex technical topics",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group p-6 bg-gradient-to-br from-[#1a1410] to-[#0f0f0f] rounded-xl border border-[#2a2420] hover:border-[#f5a623]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#f5a623]/10 hover:-translate-y-1 cursor-pointer"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <p className="text-white font-medium mb-1">{item.title}</p>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg, idx) => {
        const isUser = msg.type === "user";

        // Detect code blocks
        const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;

        // Detect links
        const linkRegex = /(https?:\/\/[^\s]+)/g;

        const renderContent = (text) => {
          const parts = [];
          let lastIndex = 0;

          const matches = [...text.matchAll(codeRegex)];

          if (matches.length === 0) {
            return renderTextWithLinks(text);
          }

          matches.forEach((match, i) => {
            const fullMatch = match[0];
            const lang = match[1];
            const code = match[2];
            const start = match.index;
            const end = start + fullMatch.length;

            // Normal text before code
            if (start > lastIndex) {
              parts.push(
                <div key={`text-${i}`} className="mb-3">
                  {renderTextWithLinks(text.slice(lastIndex, start))}
                </div>
              );
            }

            // Code block
            parts.push(
              <div
                key={`code-${i}`}
                className="my-4 overflow-hidden rounded-xl border border-[#2a2420] bg-[#0b0b0b]"
              >
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2420] bg-[#141414]">
                  <span className="text-xs text-[#f5a623] uppercase tracking-wider">
                    {lang || "code"}
                  </span>

                  <button
                    onClick={() => navigator.clipboard.writeText(code)}
                    className="text-xs text-gray-400 hover:text-white transition"
                  >
                    Copy
                  </button>
                </div>

                <pre className="overflow-x-auto p-4 text-sm text-gray-200 leading-7">
                  <code>{code}</code>
                </pre>
              </div>
            );

            lastIndex = end;
          });

          // Remaining text
          if (lastIndex < text.length) {
            parts.push(
              <div key="last-text">
                {renderTextWithLinks(text.slice(lastIndex))}
              </div>
            );
          }

          return parts;
        };

        const renderTextWithLinks = (text) => {
          return text.split(linkRegex).map((part, i) => {
            if (part.match(linkRegex)) {
              return (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 mt-2 rounded-lg bg-[#151515] border border-[#2a2420] text-[#f5a623] hover:bg-[#1d1d1d] transition-all break-all"
                >
                  🔗 {part}
                </a>
              );
            }

            // Bullet points formatting
            if (part.includes("\n- ")) {
              return (
                <div
                  key={i}
                  className="space-y-2 text-sm leading-7 whitespace-pre-wrap"
                >
                  {part.split("\n").map((line, idx) => (
                    <div
                      key={idx}
                      className={
                        line.trim().startsWith("-")
                          ? "flex gap-2 text-gray-200"
                          : "text-gray-200"
                      }
                    >
                      {line.trim().startsWith("-") && (
                        <span className="text-[#f5a623] mt-[2px]">•</span>
                      )}
                      <span>
                        {line.replace("-", "")}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <span
                key={i}
                className="text-sm leading-7 whitespace-pre-wrap text-gray-200"
              >
                {part}
              </span>
            );
          });
        };

        return (
          <div
            key={idx}
            className={`flex gap-3 animate-slideUp ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative max-w-xs md:max-w-3xl px-5 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                isUser
                  ? "bg-gradient-to-br from-[#f5a623] to-[#d4881c] text-white rounded-br-md shadow-lg shadow-[#f5a623]/20"
                  : "bg-gradient-to-br from-[#1a1410] to-[#0f0f0f] text-gray-100 rounded-bl-md border border-[#2a2420] shadow-lg"
              }`}
            >
            
              <div className="space-y-2">
                {renderContent(msg.content)}
              </div>
            </div>
          </div>
        );
      })}

      {loading && (
        <div className="flex gap-3 justify-start animate-slideUp">
          <div className="bg-gradient-to-br from-[#1a1410] to-[#0f0f0f] px-5 py-4 rounded-2xl rounded-bl-md border border-[#2a2420]">
            <div className="flex gap-2 items-center">
              <div
                className="w-2 h-2 bg-[#f5a623] rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-[#f5a623] rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-[#f5a623] rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>

              <span className="text-sm text-gray-400 ml-2">
                Thinking...
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex gap-3 justify-start animate-slideUp">
          <div className="bg-gradient-to-br from-red-950/50 to-red-900/30 text-red-200 px-5 py-3 rounded-2xl rounded-bl-md border border-red-800/50 backdrop-blur-sm">
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div ref={messageEndRef} />
    </div>

    {/* Input Form */}
    <div className="px-4 py-4 backdrop-blur-sm">
      <form
        onSubmit={handleSendMessage}
        className="flex gap-3 max-w-4xl mx-auto"
      >
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Ask me anything..."
          disabled={loading}
          className="flex-1 px-5 py-3 bg-[#0f0f0f] border border-[#2a2420] rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        />

        <button
          type="submit"
          disabled={loading || !userMessage.trim()}
          className="px-7 py-3 bg-gradient-to-r from-[#f5a623] to-[#d4881c] text-white rounded-full font-medium shadow-lg shadow-[#f5a623]/30 hover:shadow-xl hover:shadow-[#f5a623]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300"
        >
          {loading ? "⏳" : "➤"}
        </button>
      </form>
    </div>

    <style jsx>{`
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .animate-slideUp {
        animation: slideUp 0.3s ease-out;
      }

      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
      }
    `}</style>
  </div>
)
}
 
export default Chatbot