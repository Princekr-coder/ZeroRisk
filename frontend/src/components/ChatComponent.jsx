"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { chatWithAI } from "@/lib/api";

export function ChatComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "ai", text: "Hello! Based on the latest analysis, what would you like me to explain?" }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatWithAI(sessionId, userMessage);
      setMessages(prev => [...prev, { role: "ai", text: response.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: "Oops, couldn't connect right now. Try again!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-[450px] bg-background border border-border shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden">
          <div className="bg-primary p-4 flex justify-between items-center shrink-0">
             <h3 className="text-white font-bold text-sm">AI Financial Assistant</h3>
             <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-white hover:text-white/70" /></button>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-card/50 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`text-sm px-3 py-2 rounded-xl max-w-[85%] ${m.role === 'user' ? 'bg-primary text-white' : 'bg-muted text-foreground'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-xs text-muted-foreground flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-2"/>AI is thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-background border-t border-border flex gap-2">
             <input
               type="text"
               value={input}
               onChange={e => setInput(e.target.value)}
               placeholder="Ask anything..."
               className="flex-1 bg-transparent border border-input rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
             />
             <button disabled={isLoading} type="submit" className="p-2 bg-primary/20 text-primary rounded-md disabled:opacity-50">
               <Send className="w-4 h-4" />
             </button>
          </form>
        </div>
      )}
    </>
  );
}
