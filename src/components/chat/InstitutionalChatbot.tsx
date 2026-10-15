"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { X, Send, Bot, ShieldCheck, ExternalLink, ArrowRight } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  citations?: Array<{ title: string; url: string }>;
  timestamp: string;
}

let seq = 0;
function getNextId(prefix: string): string {
  seq += 1;
  return `${prefix}_${seq}`;
}

const SUGGESTED_QUESTIONS = [
  "What is the indicative yield guidance?",
  "How does the 5-point due diligence work?",
  "Why is the calculator deferred?",
  "How are debentures secured under ROC?",
];

export const InstitutionalChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial_greeting",
      sender: "bot",
      text: "Welcome to Niventra Capital Advisory. I am your institutional assistant, strictly grounded in our approved corporate disclosures, debenture structuring frameworks, and due diligence policies. How may I assist your inquiries today?",
      timestamp: "Just now",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: getNextId("usr"),
      sender: "user",
      text: textToSend,
      timestamp: "Today",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const botMessage: ChatMessage = {
          id: getNextId("bot"),
          sender: "bot",
          text: data.answer,
          citations: data.citations || [],
          timestamp: "Today",
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: getNextId("bot_err"),
          sender: "bot",
          text: "Our automated advisory assistant is currently unable to retrieve verified documentation for that inquiry. Please contact our corporate desk directly at 1800 890 0818.",
          timestamp: "Today",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch {
      const errorMessage: ChatMessage = {
        id: getNextId("bot_net_err"),
        sender: "bot",
        text: "Network error communicating with the advisory grounding service. Please try again or reach our team via the contact form.",
        timestamp: "Today",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Niventra Institutional Advisory Assistant"
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1A1A1A] text-white shadow-xl hover:bg-[#2D2D2D] transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] border border-[#9A7B2C]/40 group"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-[#9A7B2C]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
            <span className="font-heading text-xs font-semibold tracking-wide">
              Advisory Intelligence
            </span>
          </button>
        )}
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] max-w-[420px] h-[580px] bg-white border border-[rgba(26,26,26,0.15)] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#1A1A1A] text-white p-4 flex items-center justify-between border-b border-[#2D2D2D]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-[#9A7B2C]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-sm font-semibold text-white">Niventra Advisory AI</h3>
                  <span className="text-[0.625rem] px-1.5 py-0.2 rounded bg-[#9A7B2C]/30 text-[#D4AF37] font-mono">
                    Grounded
                  </span>
                </div>
                <p className="text-[0.6875rem] text-gray-300">Grounded in verified corporate disclosures</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Compliance Disclaimer Bar */}
          <div className="bg-[rgba(154,123,44,0.08)] border-b border-[rgba(154,123,44,0.2)] px-4 py-2 flex items-center gap-2 text-[0.6875rem] text-[#1A1A1A]">
            <ShieldCheck className="w-4 h-4 text-[#9A7B2C] shrink-0" />
            <span>Informational assistance only. Not personalized financial or legal advice.</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFAF7]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-white text-[#1A1A1A] border border-[rgba(26,26,26,0.08)] shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Citations if available */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[rgba(26,26,26,0.08)] space-y-1">
                      <span className="text-[0.625rem] font-semibold text-[#8A8A8A] uppercase tracking-wider block">
                        Verified Sources & Citations
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.citations.map((c, idx) => (
                          <Link
                            key={idx}
                            href={c.url}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[rgba(154,123,44,0.1)] text-[#9A7B2C] hover:bg-[rgba(154,123,44,0.2)] text-[0.625rem] font-medium transition-colors"
                          >
                            <span>{c.title}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[0.625rem] text-[#8A8A8A] mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#5C5C5C] p-2 bg-white rounded border border-[rgba(26,26,26,0.08)] w-fit">
                <div className="w-2 h-2 rounded-full bg-[#9A7B2C] animate-ping" />
                <span>Consulting verified disclosures...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          {messages.length <= 2 && (
            <div className="p-3 bg-white border-t border-[rgba(26,26,26,0.08)] space-y-1.5">
              <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-[#8A8A8A] block">
                Suggested Inquiries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-left text-[0.6875rem] px-2.5 py-1 rounded bg-[#FAFAF7] hover:bg-[#F4F3EF] border border-[rgba(26,26,26,0.1)] text-[#1A1A1A] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-[rgba(26,26,26,0.1)]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about yields, due diligence, or terms..."
                className="flex-1 px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="p-2 rounded bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] disabled:opacity-40 transition-colors"
                aria-label="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[0.625rem] text-[#8A8A8A]">
              <span>Need human advisory?</span>
              <Link
                href="/contact/"
                onClick={() => setIsOpen(false)}
                className="text-[#9A7B2C] font-semibold hover:underline flex items-center gap-0.5"
              >
                <span>Schedule Consultation</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
