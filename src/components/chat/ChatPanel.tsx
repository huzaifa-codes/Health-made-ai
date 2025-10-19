"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
  fileUrl?: string;
  loading?: boolean;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "👋 Hello! I'm HealthMate, your AI medical assistant. Type symptoms or upload a medical report (PDF/Image) for analysis.",
    },
  ]);
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    // User messages
    const userMessages: Message[] = [];
    if (message.trim()) userMessages.push({ sender: "user", text: message.trim() });
    if (file) userMessages.push({ sender: "user", text: `📎 ${file.name}`, fileUrl: URL.createObjectURL(file) });

    // Add user messages + AI loading bubble
    const loadingMessage: Message = { sender: "ai", text: "Analyzing...", loading: true };
    setMessages(prev => [...prev, ...userMessages, loadingMessage]);

    setMessage("");
    setFile(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("promt", message.trim() || "");
      if (file) formData.append("file", file);

      const res = await axios.post("/api/healthmate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const reply: string = res.data.result || "⚠️ No response received.";

      // Replace the last loading message with actual reply
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.findIndex(m => m.loading);
        if (lastIndex !== -1) {
          newMessages[lastIndex] = { sender: "ai", text: reply };
        } else {
          newMessages.push({ sender: "ai", text: reply });
        }
        return newMessages;
      });
    } catch (err) {
      console.error(err);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.findIndex(m => m.loading);
        if (lastIndex !== -1) {
          newMessages[lastIndex] = { sender: "ai", text: "⚠️ Something went wrong. Please try again." };
        } else {
          newMessages.push({ sender: "ai", text: "⚠️ Something went wrong. Please try again." });
        }
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white shadow-lg p-6">
      {/* Chat Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-purple-700">AI Health Assistant</h2>
        <p className="text-sm text-gray-500">Professional medical guidance</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} gap-3`}>
            {msg.sender === "ai" && (
              <Avatar className="h-9 w-9 shadow-sm">
                <AvatarImage src="/avatar.jpg" alt="AI" />
              </Avatar>
            )}

            <div
              className={`max-w-[75%] text-base px-4 py-3 rounded-2xl shadow-md whitespace-pre-wrap flex items-center gap-2 ${
                msg.sender === "user"
                  ? "bg-purple-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-900 rounded-tl-none"
              }`}
            >
              {msg.loading && <Loader2 className="animate-spin w-5 h-5 text-purple-600" />}
              <span>{msg.text}</span>
              {msg.fileUrl && (
                <div className="mt-2">
                  <a
                    href={msg.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-700 underline text-sm"
                  >
                    View file
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <form onSubmit={handleSend} className="mt-4 flex flex-col gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your symptoms or question..."
          className="px-4 py-3 rounded-lg shadow-inner text-base border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm text-gray-600"
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-base shadow-md"
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
