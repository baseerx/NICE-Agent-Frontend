import { useState } from "react";
import axios from "../../api/axios";
import { MessageCircle, X, Database, Send } from "lucide-react";
import { getCsrfToken } from "../../utils/global";

const PowerSectorChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "agent",
      text: "Hello there! I'm Baseer, your friendly agent. Ask me anything about Pakistan's power sector — from the latest news to verified database insights!",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const callAgentAPI = async () => {
    if (!query.trim()) return;

    const userMessage = { role: "user", text: query };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const response = await axios.post(
        "articles/power-sector-agent-db/",
        { query },
        {
          headers: {
            "X-CSRFToken": getCsrfToken(),
          },
        }
      );

      const agentReply = {
        role: "agent",
        text: response.data.answer,
      };

      setMessages((prev) => [...prev, agentReply]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Database size={20} className="text-blue-200" />
              <h3 className="font-bold">Power Sector Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "bg-white border text-slate-700"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="text-xs text-slate-400 italic">
                Baseer is typing…
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask about power sector data..."
                className="w-full pl-4 pr-12 py-3 bg-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    callAgentAPI();
                  }
                }}
              />
              <button
                onClick={callAgentAPI}
                className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-lg transition-all ${
          isOpen ? "bg-slate-800" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isOpen ? (
          <X size={28} className="text-white" />
        ) : (
          <MessageCircle size={28} className="text-white" />
        )}
      </button>
    </div>
  );
};

export default PowerSectorChatbot;
